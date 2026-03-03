/**
 * verify-access.js — Validates HMAC token for paid embed configurator access.
 * Stateless — no DB required. Token = HMAC-SHA256(partnerSlug, EMBED_ACCESS_SECRET).
 */
const crypto = require('crypto');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const secret = process.env.EMBED_ACCESS_SECRET;
  if (!secret) {
    console.error('EMBED_ACCESS_SECRET not set');
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ valid: false }) };
  }

  try {
    const { partner, token } = JSON.parse(event.body || '{}');

    if (!partner || !token) {
      return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ valid: false }) };
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(partner)
      .digest('hex');

    // Constant-time comparison to prevent timing attacks
    let valid = false;
    try {
      const expectedBuf = Buffer.from(expected, 'hex');
      const tokenBuf = Buffer.from(token, 'hex');
      if (expectedBuf.length === tokenBuf.length) {
        valid = crypto.timingSafeEqual(expectedBuf, tokenBuf);
      }
    } catch {
      valid = false;
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ valid }),
    };
  } catch (err) {
    console.error('verify-access error:', err);
    return { statusCode: 200, headers: CORS_HEADERS, body: JSON.stringify({ valid: false }) };
  }
};
