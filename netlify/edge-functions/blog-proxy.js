// Netlify Edge Function to proxy /blog requests to Vercel
// Fetches from Vercel domain directly (which sets correct Host header)

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

    // Return the response from Vercel
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  } catch (error) {
    return new Response(`Proxy error: ${error.message}`, {
      status: 502,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}

export const config = {
  path: ['/blog', '/blog/*'],
};
