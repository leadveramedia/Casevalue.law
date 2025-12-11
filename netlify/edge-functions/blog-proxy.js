// Netlify Edge Function to proxy /blog requests to Vercel
// This rewrites the Host header to match Vercel's expected domain

export default async function handler(request) {
  const url = new URL(request.url);

  // Construct the Vercel URL
  const vercelUrl = new URL(url.pathname + url.search, 'https://casevalue-blog.vercel.app');

  // Create new headers without the problematic Host header
  const headers = new Headers(request.headers);
  headers.set('Host', 'casevalue-blog.vercel.app');
  headers.set('X-Forwarded-Host', url.hostname);

  // Proxy the request to Vercel
  const response = await fetch(vercelUrl.toString(), {
    method: request.method,
    headers: headers,
    body: request.body,
    redirect: 'manual', // Don't follow redirects
  });

  // If Vercel returns a redirect, rewrite the Location header
  if (response.status >= 300 && response.status < 400) {
    const location = response.headers.get('Location');
    if (location) {
      const newHeaders = new Headers(response.headers);
      // Rewrite the location to use casevalue.law instead of vercel.app
      const rewrittenLocation = location.replace(
        'https://casevalue-blog.vercel.app',
        'https://casevalue.law'
      );
      newHeaders.set('Location', rewrittenLocation);
      return new Response(response.body, {
        status: response.status,
        headers: newHeaders,
      });
    }
  }

  return response;
}

export const config = {
  path: ['/blog', '/blog/*'],
};
