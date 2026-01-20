// Netlify Edge Function to proxy /blog requests to Vercel
// Fetches from Vercel domain directly (which sets correct Host header)
// Bypasses Netlify prerender cache to ensure fresh content for crawlers

export default async function handler(request) {
  const url = new URL(request.url);

  // Construct the Vercel URL
  const vercelUrl = `https://casevalue-blog.vercel.app${url.pathname}${url.search}`;

  try {
    // Proxy the request to Vercel
    const response = await fetch(vercelUrl, {
      method: request.method,
      headers: {
        'Accept': request.headers.get('Accept') || '*/*',
        'Accept-Encoding': request.headers.get('Accept-Encoding') || 'gzip, deflate, br',
        'User-Agent': request.headers.get('User-Agent') || 'Netlify Edge Function',
      },
    });

    // Create new headers, copying from Vercel response
    const newHeaders = new Headers(response.headers);

    // Bypass Netlify's prerender cache for blog content
    // This ensures crawlers get fresh content from Vercel, not stale cached 404s
    newHeaders.set('Netlify-CDN-Cache-Control', 'no-store');
    newHeaders.set('Cache-Control', 'public, max-age=0, must-revalidate');
    newHeaders.set('Netlify-Vary', 'query');

    // Return the response from Vercel with updated headers
    return new Response(response.body, {
      status: response.status,
      headers: newHeaders,
    });
  } catch (error) {
    return new Response(`Proxy error: ${error.message}`, {
      status: 502,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

export const config = {
  path: ['/blog', '/blog/*', '/_next/image'],
};
