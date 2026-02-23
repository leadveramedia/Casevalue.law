/**
 * Dynamic Sitemap Netlify Function
 * Fetches blog posts from Sanity CMS and returns sitemap.xml on demand
 */

const SANITY_PROJECT_ID = 's8mux3ix';
const SANITY_DATASET = 'production';
const SANITY_API_VERSION = '2024-01-01';

/**
 * Fetch all published blog posts from Sanity
 */
async function fetchBlogPosts() {
  const query = encodeURIComponent('*[_type == "blogPost"]{slug, _updatedAt}');
  const url = `https://${SANITY_PROJECT_ID}.api.sanity.io/v${SANITY_API_VERSION}/data/query/${SANITY_DATASET}?query=${query}`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Sanity API error: ${response.status}`);
  }
  const data = await response.json();
  return data.result || [];
}

/**
 * Format date for sitemap (YYYY-MM-DD)
 */
function formatDate(date) {
  return new Date(date).toISOString().split('T')[0];
}

/**
 * Generate sitemap XML content
 */
function generateSitemapXML(blogPosts) {
  const today = formatDate(new Date());

  const calculatorSlugs = [
    'motor-vehicle-accident', 'medical-malpractice', 'premises-liability',
    'product-liability', 'wrongful-death', 'dog-bite', 'wrongful-termination',
    'wage-and-hour', 'class-action', 'insurance-bad-faith', 'disability-denial',
    'professional-malpractice', 'civil-rights', 'intellectual-property',
    'workers-compensation',
  ];

  const staticPages = [
    {
      loc: 'https://casevalue.law/',
      lastmod: today,
      changefreq: 'weekly',
      priority: '1.0',
      hreflang: true
    },
    ...calculatorSlugs.map(slug => ({
      loc: `https://casevalue.law/calculator/${slug}`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.9',
      hreflang: true
    })),
    {
      loc: 'https://casevalue.law/blog',
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.8',
      hreflang: true
    }
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
`;

  // Add static pages
  staticPages.forEach(page => {
    xml += `
  <url>
    <loc>${page.loc}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>`;

    if (page.hreflang) {
      xml += `
    <xhtml:link rel="alternate" hreflang="en" href="${page.loc}"/>
    <xhtml:link rel="alternate" hreflang="es" href="${page.loc}"/>
    <xhtml:link rel="alternate" hreflang="zh" href="${page.loc}"/>
    <xhtml:link rel="alternate" hreflang="x-default" href="${page.loc}"/>`;
    }

    xml += `
  </url>
`;
  });

  // Add blog posts
  blogPosts.forEach(post => {
    if (post.slug && post.slug.current) {
      const lastmod = post._updatedAt ? formatDate(post._updatedAt) : today;
      xml += `
  <url>
    <loc>https://casevalue.law/blog/${post.slug.current}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
`;
    }
  });

  xml += `
</urlset>`;

  return xml;
}

exports.handler = async (event) => {
  try {
    const blogPosts = await fetchBlogPosts();
    const sitemapXML = generateSitemapXML(blogPosts);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      },
      body: sitemapXML
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return {
      statusCode: 500,
      body: 'Error generating sitemap'
    };
  }
};
