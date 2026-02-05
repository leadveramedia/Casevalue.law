/**
 * Netlify Build Plugin: IndexNow
 *
 * Submits all site URLs to IndexNow API after every successful deploy.
 * This notifies Bing, Yandex, and other participating search engines
 * that content has been updated.
 *
 * Fetches blog post slugs from Sanity CMS to build the complete URL list.
 */

const INDEXNOW_KEY = '618425fc808a4b198c7d33ddee5a1c32';
const SITE_HOST = 'casevalue.law';
const SANITY_PROJECT_ID = 's8mux3ix';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

const STATIC_URLS = [
  `https://${SITE_HOST}/`,
  `https://${SITE_HOST}/blog`,
];

async function fetchBlogSlugs() {
  const query = encodeURIComponent('*[_type == "blogPost"]{slug}');
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Sanity API error: ${response.status}`);
  }
  const data = await response.json();
  return (data.result || [])
    .filter(post => post.slug?.current)
    .map(post => `https://${SITE_HOST}/blog/${post.slug.current}`);
}

async function submitToIndexNow(urlList) {
  const response = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      host: SITE_HOST,
      key: INDEXNOW_KEY,
      keyLocation: `https://${SITE_HOST}/${INDEXNOW_KEY}.txt`,
      urlList,
    }),
  });

  return { status: response.status, ok: response.ok };
}

module.exports = {
  onSuccess: async ({ utils }) => {
    try {
      console.log('IndexNow: Fetching blog posts from Sanity...');
      const blogUrls = await fetchBlogSlugs();

      const allUrls = [...STATIC_URLS, ...blogUrls];
      console.log(`IndexNow: Submitting ${allUrls.length} URLs...`);
      allUrls.forEach(url => console.log(`  - ${url}`));

      const result = await submitToIndexNow(allUrls);

      if (result.ok || result.status === 200 || result.status === 202) {
        console.log(`IndexNow: Successfully submitted (HTTP ${result.status})`);
      } else {
        console.warn(`IndexNow: Unexpected response (HTTP ${result.status})`);
      }
    } catch (error) {
      // Don't fail the build for IndexNow errors
      utils.status.show({
        title: 'IndexNow submission failed',
        summary: error.message,
        text: 'Deploy succeeded but IndexNow notification failed. URLs will be discovered via sitemap.',
      });
      console.error('IndexNow error:', error.message);
    }
  },
};
