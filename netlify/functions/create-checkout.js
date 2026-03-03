/**
 * create-checkout.js — Paid tier Stripe Checkout session creator
 * Validates firm info, creates a Stripe Checkout session, returns the URL.
 */
const Stripe = require('stripe');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json',
};

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function generatePartnerSlug(firmName) {
  return firmName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 40)
    .replace(/^-|-$/g, '');
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const priceId = process.env.STRIPE_PRICE_ID;

  if (!stripeKey || !priceId) {
    console.error('Missing STRIPE_SECRET_KEY or STRIPE_PRICE_ID');
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Payment not configured' }) };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { firmName, contactName, email, phone, state, caseTypes } = body;

    if (!firmName || !firmName.trim()) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Firm name is required' }) };
    }
    if (!contactName || !contactName.trim()) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Contact name is required' }) };
    }
    if (!email || !isValidEmail(email)) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Valid email is required' }) };
    }
    if (!phone || !phone.trim()) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Phone number is required' }) };
    }

    const partnerSlug = generatePartnerSlug(firmName);
    const stripe = Stripe(stripeKey);

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email,
      success_url: 'https://casevalue.law/for-law-firms?status=success',
      cancel_url: 'https://casevalue.law/for-law-firms?status=cancelled',
      metadata: {
        firmName,
        contactName,
        email,
        phone,
        state: state || '',
        caseTypes: (caseTypes || []).join(','),
        partnerSlug,
      },
    });

    console.log(JSON.stringify({ type: 'checkout_created', partnerSlug, sessionId: session.id, timestamp: new Date().toISOString() }));

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error('create-checkout error:', err);
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Could not create checkout session' }) };
  }
};
