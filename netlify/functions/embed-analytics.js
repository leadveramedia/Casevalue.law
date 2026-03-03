/**
 * Embed Analytics Netlify Function
 * Receives lightweight analytics events from embedded calculators.
 * Events are logged for now; a dashboard can be built later.
 */

exports.handler = async (event) => {
  // Only accept POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  // CORS headers for cross-origin embed requests
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { event: eventName, partner, referrer, caseType, state, timestamp } = body;

    // Validate required fields
    if (!eventName) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Missing event name' }) };
    }

    // Log the event (Netlify function logs are available in the dashboard)
    console.log(JSON.stringify({
      type: 'embed_analytics',
      event: eventName,
      partner: partner || 'unknown',
      referrer: referrer || 'unknown',
      caseType: caseType || null,
      state: state || null,
      timestamp: timestamp || new Date().toISOString(),
      ip: event.headers['x-forwarded-for'] || event.headers['client-ip'] || 'unknown',
    }));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ ok: true }),
    };
  } catch {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Invalid request body' }),
    };
  }
};
