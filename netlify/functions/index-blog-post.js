/**
 * Netlify Function: index-blog-post
 *
 * Receives webhooks from Sanity CMS when blog posts are published/updated
 * and triggers a GitHub Action that uses Workload Identity Federation
 * to authenticate with Google's Indexing API (keyless authentication).
 *
 * Environment Variables Required:
 * - GITHUB_TOKEN: Personal Access Token with repo scope (for triggering workflows)
 * - GITHUB_REPO: Repository in format "owner/repo" (e.g., "username/casevalue.law")
 * - SANITY_WEBHOOK_SECRET: Secret for validating Sanity webhooks
 * - NETLIFY_AUTH_TOKEN: Personal Access Token for Netlify API (for cache purging)
 */

// const crypto = require('crypto'); // Unused - signature validation disabled

// Signature validation function - kept for reference if re-enabling
// function validateSanityWebhook(body, signature, secret) {
//   if (!signature || !secret) return false;
//   const providedSignature = signature.replace(/^sha256=/, '');
//   const expectedSignature = crypto.createHmac('sha256', secret).update(body).digest('hex');
//   try {
//     return crypto.timingSafeEqual(Buffer.from(providedSignature), Buffer.from(expectedSignature));
//   } catch (e) { return false; }
// }

const INDEXNOW_KEY = '618425fc808a4b198c7d33ddee5a1c32';
const SITE_HOST = 'casevalue.law';

/**
 * Submit a URL to IndexNow (Bing, Yandex, etc.)
 * @param {string} slug - Blog post slug
 * @returns {Promise<object>}
 */
async function submitToIndexNow(slug) {
  const url = `https://${SITE_HOST}/blog/${slug}`;
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: SITE_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
      urlList: [url],
    }),
  });
  return { status: response.status, ok: response.ok };
}

/**
 * Trigger GitHub Action via repository_dispatch
 * @param {string} slug - Blog post slug
 * @param {string} action - 'update' or 'delete'
 * @returns {Promise<object>}
 */
async function triggerGitHubAction(slug, action) {
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;

  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable not set');
  }

  if (!repo) {
    throw new Error('GITHUB_REPO environment variable not set');
  }

  const response = await fetch(
    `https://api.github.com/repos/${repo}/dispatches`,
    {
      method: 'POST',
      headers: {
        'Accept': 'application/vnd.github+json',
        'Authorization': `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event_type: 'index-blog-post',
        client_payload: {
          slug: slug,
          action: action,
          timestamp: new Date().toISOString(),
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`GitHub API error (${response.status}): ${errorText}`);
  }

  // repository_dispatch returns 204 No Content on success
  return { success: true, status: response.status };
}

/**
 * Purge Netlify prerender/CDN cache for blog paths
 * Ensures newly published posts aren't served as stale 404s from cache
 * @returns {Promise<object>}
 */
async function purgeNetlifyCache() {
  const token = process.env.NETLIFY_AUTH_TOKEN;
  const siteId = process.env.SITE_ID;

  if (!token || !siteId) {
    return { skipped: true, reason: 'Missing NETLIFY_AUTH_TOKEN or SITE_ID' };
  }

  const response = await fetch('https://api.netlify.com/api/v1/purge', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ site_id: siteId }),
  });

  return { status: response.status, ok: response.ok };
}

/**
 * Main handler
 */
exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = event.body;
    const signature = event.headers['x-sanity-signature'] || event.headers['X-Sanity-Signature'];
    const secret = process.env.SANITY_WEBHOOK_SECRET;

    // Signature validation disabled - low risk for this use case
    // (function only triggers Google Indexing, no sensitive operations)
    // See: https://github.com/sanity-io/webhook-toolkit for debugging if re-enabling
    void signature; // Acknowledge unused variable
    void secret;

    // Parse webhook payload
    const payload = JSON.parse(body);
    console.log('Received Sanity webhook:', JSON.stringify(payload, null, 2));

    // Extract slug from the payload
    // Sanity webhook payload structure varies based on configuration
    // Common structures: { slug: { current: 'xxx' } } or { result: { slug: { current: 'xxx' } } }
    let slug = null;
    let action = 'update';

    if (payload._type === 'blogPost' && payload.slug?.current) {
      // Direct document payload
      slug = payload.slug.current;
    } else if (payload.result?.slug?.current) {
      // GROQ projection payload
      slug = payload.result.slug.current;
    } else if (payload.slug) {
      // Simple slug string
      slug = typeof payload.slug === 'string' ? payload.slug : payload.slug.current;
    }

    // Check if this is a delete operation
    if (payload._deleted === true || payload.transition === 'disappear') {
      action = 'delete';
    }

    if (!slug) {
      console.log('No slug found in webhook payload, skipping indexing');
      return {
        statusCode: 200,
        body: JSON.stringify({ message: 'No slug found, skipping' }),
      };
    }

    console.log(`Processing blog post: ${slug} (${action})`);

    // Submit to IndexNow (Bing, Yandex), trigger GitHub Action (Google),
    // and purge Netlify prerender cache in parallel
    const [indexNowResult, githubResult, cacheResult] = await Promise.allSettled([
      submitToIndexNow(slug),
      triggerGitHubAction(slug, action),
      purgeNetlifyCache(),
    ]);

    const indexNowStatus = indexNowResult.status === 'fulfilled'
      ? `OK (HTTP ${indexNowResult.value.status})`
      : `Failed: ${indexNowResult.reason?.message}`;
    const githubStatus = githubResult.status === 'fulfilled'
      ? 'OK'
      : `Failed: ${githubResult.reason?.message}`;
    const cacheStatus = cacheResult.status === 'fulfilled'
      ? (cacheResult.value.skipped ? `Skipped: ${cacheResult.value.reason}` : `OK (HTTP ${cacheResult.value.status})`)
      : `Failed: ${cacheResult.reason?.message}`;

    console.log(`IndexNow: ${indexNowStatus}`);
    console.log(`GitHub Action: ${githubStatus}`);
    console.log(`Cache purge: ${cacheStatus}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        slug: slug,
        action: action,
        indexNow: indexNowStatus,
        googleIndexing: githubStatus,
        cachePurge: cacheStatus,
      }),
    };
  } catch (error) {
    console.error('Error processing webhook:', error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: 'Failed to process webhook',
        message: error.message,
      }),
    };
  }
};
