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
 */

const crypto = require('crypto');

/**
 * Validate Sanity webhook signature
 * Sanity sends signature in format: "sha256=HEXDIGEST" or just "HEXDIGEST"
 * @param {string} body - Raw request body
 * @param {string} signature - Signature from x-sanity-signature header
 * @param {string} secret - Webhook secret
 * @returns {boolean}
 */
function validateSanityWebhook(body, signature, secret) {
  if (!signature || !secret) {
    return false;
  }

  // Remove 'sha256=' prefix if present (Sanity uses this format)
  const providedSignature = signature.replace(/^sha256=/, '');

  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(body)
    .digest('hex');

  // Use timing-safe comparison to prevent timing attacks
  try {
    return crypto.timingSafeEqual(
      Buffer.from(providedSignature),
      Buffer.from(expectedSignature)
    );
  } catch (e) {
    // If buffers have different lengths, timingSafeEqual throws
    return false;
  }
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

    // Validate webhook signature (skip in development if no secret set)
    if (secret && !validateSanityWebhook(body, signature, secret)) {
      console.error('Invalid webhook signature');
      return {
        statusCode: 401,
        body: JSON.stringify({ error: 'Invalid signature' }),
      };
    }

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

    console.log(`Triggering GitHub Action for blog post: ${slug} (${action})`);

    // Trigger GitHub Action
    const result = await triggerGitHubAction(slug, action);

    console.log('GitHub Action triggered successfully:', result);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        slug: slug,
        action: action,
        message: 'GitHub Action triggered for Google indexing',
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
