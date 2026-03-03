/**
 * stripe-webhook.js — Handles Stripe subscription lifecycle events.
 *
 * Events handled:
 *   checkout.session.completed  → write paid partner to Blobs, email configurator link
 *   customer.subscription.deleted → mark partner inactive
 *   invoice.payment_failed      → mark partner inactive
 *   invoice.payment_succeeded   → mark partner active (handles renewals)
 */
const Stripe = require('stripe');
const crypto = require('crypto');
const { getStore } = require('@netlify/blobs');

const RESEND_API_URL = 'https://api.resend.com/emails';
const FROM_EMAIL = 'leads@casevalue.law';
const FROM_NAME = 'CaseValue.law';
const BCC_EMAIL = 'info@leadvera.com';

function generateAccessToken(partnerSlug, secret) {
  return crypto.createHmac('sha256', secret).update(partnerSlug).digest('hex');
}

function buildPaidEmailHtml({ firmName, contactName, partnerSlug, configuratorUrl, embedCode }) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f3f4f6">
  <div style="max-width:600px;margin:0 auto;padding:24px">
    <div style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1)">
      <div style="background:linear-gradient(135deg,#1e293b,#334155);padding:24px 32px">
        <h1 style="margin:0;color:#fbbf24;font-size:22px;font-weight:700">Welcome to CaseValue Pro</h1>
        <p style="margin:6px 0 0;color:#94a3b8;font-size:14px">Your white-label calculator is ready to configure</p>
      </div>
      <div style="padding:24px 32px">
        <p style="color:#374151;font-size:15px">Hi ${contactName || firmName},</p>
        <p style="color:#374151;font-size:15px">Thank you for subscribing! Your Pro account is active. Here's how to get started:</p>

        <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:8px;padding:16px;margin:16px 0">
          <p style="margin:0 0 8px;color:#166534;font-size:14px;font-weight:600">Step 1: Customize your calculator</p>
          <p style="margin:0 0 12px;color:#166534;font-size:14px">Open your personal configurator to set your brand colors, logo, practice areas, and get your embed code with lead routing.</p>
          <a href="${configuratorUrl}" style="display:inline-block;padding:10px 20px;background:#16a34a;color:#fff;border-radius:6px;text-decoration:none;font-size:14px;font-weight:600">Open Your Configurator →</a>
          <p style="margin:10px 0 0;color:#166534;font-size:12px">Bookmark this link — it's your personal access URL.</p>
        </div>

        <div style="margin:24px 0">
          <p style="color:#374151;font-size:14px;font-weight:600;margin-bottom:8px">Your Partner ID: <code style="background:#f3f4f6;padding:2px 6px;border-radius:4px;font-family:monospace;color:#1e293b">${partnerSlug}</code></p>
          <p style="color:#374151;font-size:14px;font-weight:600;margin-bottom:8px">Default Embed Code (before customization):</p>
          <pre style="background:#f3f4f6;color:#1e293b;border:1px solid #e5e7eb;padding:16px;border-radius:8px;font-size:13px;overflow-x:auto;white-space:pre-wrap;font-family:monospace">${embedCode}</pre>
          <p style="color:#6b7280;font-size:13px;margin-top:8px">After customizing, copy your updated embed code from the configurator.</p>
        </div>

        <p style="color:#374151;font-size:14px;font-weight:600;margin-bottom:4px">What's included in Pro:</p>
        <ul style="color:#374151;font-size:14px;margin:0;padding-left:20px">
          <li>Leads emailed directly to your intake address in real-time</li>
          <li>Custom accent color — derives your full calculator palette</li>
          <li>Your logo in the calculator footer</li>
          <li>Hide "Powered by CaseValue.law" branding</li>
        </ul>

        <p style="color:#6b7280;font-size:13px;margin-top:20px">
          Manage your subscription at any time via <a href="https://billing.stripe.com/p/login" style="color:#3b82f6">Stripe Customer Portal</a>.
          Questions? Reply to this email.
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

async function sendEmail(apiKey, payload) {
  const response = await fetch(RESEND_API_URL, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    const text = await response.text();
    console.error('Resend error:', response.status, text);
  }
  return response;
}

async function setPartnerStatus(store, partnerSlug, update) {
  const existing = await store.get(`partner:${partnerSlug}`, { type: 'json' }) || {};
  await store.setJSON(`partner:${partnerSlug}`, { ...existing, ...update, updatedAt: new Date().toISOString() });
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const accessSecret = process.env.EMBED_ACCESS_SECRET;
  const resendKey = process.env.RESEND_API_KEY;

  if (!stripeKey || !webhookSecret) {
    console.error('Missing Stripe env vars');
    return { statusCode: 500, body: 'Configuration error' };
  }

  const stripe = Stripe(stripeKey);
  let stripeEvent;

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body, 'base64').toString('utf8')
    : event.body;

  try {
    stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      event.headers['stripe-signature'],
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  const siteID = process.env.NETLIFY_SITE_ID || process.env.SITE_ID;
  const netlifyToken = process.env.NETLIFY_AUTH_TOKEN;
  const store = getStore({
    name: 'partners',
    siteID,
    token: netlifyToken,
  });

  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed': {
        const session = stripeEvent.data.object;
        const meta = session.metadata || {};
        const { firmName, contactName, email, phone, state, caseTypes, partnerSlug } = meta;

        if (!partnerSlug || !email) {
          console.error('Missing metadata in checkout session:', session.id);
          break;
        }

        const subscriptionId = session.subscription;
        const customerId = session.customer;

        // Store paid partner in Blobs
        await setPartnerStatus(store, partnerSlug, {
          plan: 'paid',
          active: true,
          firmName,
          contactName,
          email,
          phone,
          state: state || '',
          caseTypes: caseTypes ? caseTypes.split(',').filter(Boolean) : [],
          stripeCustomerId: customerId,
          subscriptionId,
          createdAt: new Date().toISOString(),
        });

        // Tag the Stripe customer with partnerSlug so subscription lifecycle
        // webhooks (deleted, payment_failed, etc.) can look it up by customer ID
        if (customerId) {
          await stripe.customers.update(customerId, { metadata: { partnerSlug } });
        }

        // Generate configurator access URL
        const token = accessSecret ? generateAccessToken(partnerSlug, accessSecret) : '';
        const configuratorUrl = `https://casevalue.law/embed/signup?partner=${encodeURIComponent(partnerSlug)}&token=${token}`;

        // Build basic embed code for the email
        const caseTypesArr = caseTypes ? caseTypes.split(',').filter(Boolean) : [];
        const embedCode = `<script\n  src="https://casevalue.law/embed.js"\n  data-partner="${partnerSlug}"\n></script>`;

        if (resendKey) {
          await sendEmail(resendKey, {
            from: `${FROM_NAME} <${FROM_EMAIL}>`,
            to: [email],
            bcc: [BCC_EMAIL],
            subject: `Welcome to CaseValue Pro — Your Calculator is Ready`,
            html: buildPaidEmailHtml({ firmName, contactName, partnerSlug, configuratorUrl, embedCode }),
          });
        }

        console.log(JSON.stringify({ type: 'paid_signup', partnerSlug, sessionId: session.id, timestamp: new Date().toISOString() }));
        break;
      }

      case 'customer.subscription.deleted': {
        const sub = stripeEvent.data.object;
        // Find partner by subscriptionId — store in Blobs requires a lookup
        // We stored subscriptionId in the blob; retrieve by scanning (or use customer metadata)
        // For now log and rely on invoice.payment_failed for deactivation
        console.log(JSON.stringify({ type: 'subscription_deleted', subscriptionId: sub.id, customerId: sub.customer, timestamp: new Date().toISOString() }));

        // Look up partner by customer ID stored in metadata
        const customerId = sub.customer;
        if (customerId) {
          // Retrieve subscription metadata to get partnerSlug
          const customer = await stripe.customers.retrieve(customerId);
          const partnerSlug = customer.metadata?.partnerSlug;
          if (partnerSlug) {
            await setPartnerStatus(store, partnerSlug, { active: false, plan: 'paid' });
            console.log(JSON.stringify({ type: 'partner_deactivated', partnerSlug, reason: 'subscription_deleted', timestamp: new Date().toISOString() }));
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = stripeEvent.data.object;
        const customerId = invoice.customer;
        if (customerId) {
          const customer = await stripe.customers.retrieve(customerId);
          const partnerSlug = customer.metadata?.partnerSlug;
          if (partnerSlug) {
            await setPartnerStatus(store, partnerSlug, { active: false });
            console.log(JSON.stringify({ type: 'partner_deactivated', partnerSlug, reason: 'payment_failed', timestamp: new Date().toISOString() }));
          }
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = stripeEvent.data.object;
        // Only handle renewals (not the initial payment, which is covered by checkout.session.completed)
        if (invoice.billing_reason === 'subscription_cycle') {
          const customerId = invoice.customer;
          if (customerId) {
            const customer = await stripe.customers.retrieve(customerId);
            const partnerSlug = customer.metadata?.partnerSlug;
            if (partnerSlug) {
              await setPartnerStatus(store, partnerSlug, { active: true });
              console.log(JSON.stringify({ type: 'partner_reactivated', partnerSlug, reason: 'payment_succeeded', timestamp: new Date().toISOString() }));
            }
          }
        }
        break;
      }

      default:
        // Ignore other events
        break;
    }
  } catch (err) {
    console.error('stripe-webhook handler error:', err);
    // Return 200 so Stripe doesn't retry — log the error instead
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
