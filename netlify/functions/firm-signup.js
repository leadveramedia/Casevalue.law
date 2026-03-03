/**
 * firm-signup.js — Free tier partner registration
 * Validates form, stores partner in Netlify Blobs, emails basic embed code via Resend.
 */
const { getStore } = require('@netlify/blobs');

const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_EMAIL = 'leads@casevalue.law';
const FROM_NAME = 'CaseValue.law';
const BCC_EMAIL = 'info@leadvera.com';

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

function buildEmbedCode(partnerSlug, caseTypes, state) {
  const attrs = [`  src="https://casevalue.law/embed.js"`];
  if (caseTypes && caseTypes.length > 0) {
    attrs.push(`  data-case-types="${caseTypes.join(',')}"`);
  }
  if (state) attrs.push(`  data-state="${state}"`);
  attrs.push(`  data-partner="${partnerSlug}"`);
  return `<script\n${attrs.join('\n')}\n></script>`;
}

function buildEmailHtml({ firmName, contactName, partnerSlug, embedCode }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f3f4f6">
  <div style="max-width:600px;margin:0 auto;padding:24px">
    <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
      <div style="background:linear-gradient(135deg,#1e293b,#334155);padding:24px 32px">
        <h1 style="margin:0;color:#fbbf24;font-size:22px;font-weight:700">Welcome to CaseValue.law</h1>
        <p style="margin:6px 0 0;color:#94a3b8;font-size:14px">Your free embed calculator is ready</p>
      </div>
      <div style="padding:24px 32px">
        <p style="color:#374151;font-size:15px">Hi ${contactName || firmName},</p>
        <p style="color:#374151;font-size:15px">Your CaseValue.law embed code is ready. Paste it into your website where you'd like the calculator to appear.</p>
        <p style="color:#374151;font-size:14px"><strong>Your Partner ID:</strong> <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-family:monospace">${partnerSlug}</code></p>

        <div style="margin:24px 0">
          <p style="color:#374151;font-size:14px;font-weight:600;margin-bottom:8px">Your Embed Code:</p>
          <pre style="background:#0f172a;color:#e2e8f0;padding:16px;border-radius:8px;font-size:13px;overflow-x:auto;white-space:pre-wrap">${embedCode}</pre>
        </div>

        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:8px;padding:16px;margin:16px 0">
          <p style="margin:0;color:#92400e;font-size:14px"><strong>Want lead routing + white-label branding?</strong><br>
          Upgrade to the Pro plan ($49/month) to receive leads directly to your inbox and customize colors, logo, and branding.</p>
          <a href="https://casevalue.law/for-law-firms" style="display:inline-block;margin-top:12px;padding:8px 16px;background:#f59e0b;color:#fff;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600">Upgrade to Pro →</a>
        </div>

        <p style="color:#6b7280;font-size:13px">
          Need help? <a href="https://casevalue.law/embed/docs" style="color:#3b82f6">View the documentation</a> or reply to this email.
        </p>
      </div>
      <div style="padding:16px 32px;background:#f9fafb;border-top:1px solid #e5e7eb">
        <p style="margin:0;font-size:12px;color:#9ca3af;text-align:center">
          <a href="https://casevalue.law" style="color:#3b82f6;text-decoration:none">CaseValue.law</a> — Free Legal Case Value Calculator
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Method Not Allowed' }) };
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
    if (!partnerSlug) {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Could not generate partner ID from firm name' }) };
    }

    // Store in Netlify Blobs
    const store = getStore('partners');
    await store.setJSON(`partner:${partnerSlug}`, {
      plan: 'free',
      active: true,
      firmName,
      contactName,
      email,
      phone,
      state: state || '',
      caseTypes: caseTypes || [],
      createdAt: new Date().toISOString(),
    });

    // Build embed code and send email
    const embedCode = buildEmbedCode(partnerSlug, caseTypes || [], state || '');
    const apiKey = process.env.RESEND_API_KEY;

    if (apiKey) {
      await fetch(RESEND_API_URL, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: [email],
          bcc: [BCC_EMAIL],
          subject: `Your CaseValue.law Embed Code — ${firmName}`,
          html: buildEmailHtml({ firmName, contactName, partnerSlug, embedCode }),
        }),
      });
    }

    console.log(JSON.stringify({ type: 'free_signup', partnerSlug, firmName, timestamp: new Date().toISOString() }));

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: true, partnerSlug }),
    };
  } catch (err) {
    console.error('firm-signup error:', err);
    return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'Invalid request' }) };
  }
};
