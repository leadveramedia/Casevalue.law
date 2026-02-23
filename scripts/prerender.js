/**
 * Build-time prerendering script
 * Fetches all blog post slugs from Sanity CMS, then runs react-snap
 * to prerender every page as static HTML for SEO.
 *
 * Usage: node scripts/prerender.js (called automatically by npm run build)
 */

const { run } = require('react-snap');

const SANITY_PROJECT_ID = 's8mux3ix';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

async function fetchBlogSlugs() {
  const query = encodeURIComponent('*[_type == "blogPost"]{slug}');
  const url = `https://${SANITY_PROJECT_ID}.apicdn.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}&returnQuery=false`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Sanity API error: ${response.status}`);
  }
  const data = await response.json();
  return (data.result || []).map(post => `/blog/${post.slug.current}`);
}

async function main() {
  const slugs = await fetchBlogSlugs();
  console.log(`\n📝 Found ${slugs.length} blog posts in Sanity`);

  const include = ['/', '/blog', ...slugs];
  console.log(`🔗 Total pages to prerender: ${include.length}\n`);

  await run({
    source: 'build',
    include,
    crawl: false,
    inlineCss: false,
    puppeteerArgs: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security'],
    skipThirdPartyRequests: false,
    concurrency: 1,
  });
}

main().catch((err) => {
  console.error('Prerender failed:', err.message);
  process.exit(1);
});
