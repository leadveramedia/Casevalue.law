// Netlify Edge Function to proxy /blog requests to Vercel
// Fetches from Vercel domain directly with proper host headers
// so Next.js generates asset URLs pointing to casevalue.law (not vercel.app)
// Vercel returns server-rendered HTML — no prerendering needed

export default async function handler(request) {
  const url = new URL(request.url);

  // Construct the Vercel URL
  const vercelUrl = `https://casevalue-blog.vercel.app${url.pathname}${url.search}`;

  try {
    // Proxy the request to Vercel
    // Host must match Vercel's expected domain so it accepts the request
    // X-Forwarded-Host tells Next.js to use casevalue.law in generated HTML/asset URLs
    const response = await fetch(vercelUrl, {
      method: request.method,
      headers: {
        'Host': 'casevalue-blog.vercel.app',
        'X-Forwarded-Host': 'casevalue.law',
        'X-Forwarded-Proto': 'https',
        'Accept': request.headers.get('Accept') || '*/*',
        'Accept-Encoding': request.headers.get('Accept-Encoding') || 'gzip, deflate, br',
        'User-Agent': request.headers.get('User-Agent') || 'Netlify Edge Function',
      },
    });

    // Create new headers, copying from Vercel response
    const newHeaders = new Headers(response.headers);

    // Vercel returns server-rendered HTML directly — Googlebot gets full content
    // No prerendering needed (prerendering is disabled; it conflicts with Next.js RSC streaming)
    newHeaders.set('Cache-Control', 'public, max-age=0, must-revalidate');

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
