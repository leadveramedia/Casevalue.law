/**
 * validate-partner.js — Checks if a partner's subscription is active.
 * Called by embed.js before rendering the iframe.
 * Uses Netlify Blobs as the data store.
 */
const { getStore } = require('@netlify/blobs');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const partner = event.queryStringParameters?.partner || '';

  if (!partner) {
    // No partner — anonymous embed, always allow
    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ active: true, plan: null }) };
  }

  try {
    const store = getStore('partners');
    const record = await store.get(`partner:${partner}`, { type: 'json' });

    if (!record) {
      // Unknown partner — fail open, let embed render but log it
      console.log(JSON.stringify({ type: 'unknown_partner', partner, timestamp: new Date().toISOString() }));
      return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ active: true, plan: null }) };
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ active: record.active === true, plan: record.plan || null }),
    };
  } catch (err) {
    // Fail open on error — don't break client sites
    console.error('validate-partner error:', err);
    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ active: true, plan: null }) };
  }
};
