// Netlify Function: Send email via SendGrid (@sendgrid/mail)
// Expects POST JSON: { to: string | string[], subject: string, text?: string, html?: string, from?: string, dataResidency?: 'eu' | 'us' }

const sgMail = require('@sendgrid/mail');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const provider = process.env.NETLIFY_EMAILS_PROVIDER;
  const providerKey = process.env.NETLIFY_EMAILS_PROVIDER_API_KEY;
  const apiKey = process.env.SENDGRID_API_KEY || (provider && provider.toLowerCase() === 'sendgrid' ? providerKey : undefined);
  if (!apiKey) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured: missing SENDGRID_API_KEY (and no NETLIFY_EMAILS_PROVIDER/API_KEY fallback)' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const to = payload.to;
  const subject = payload.subject;
  const text = payload.text;
  const html = payload.html;
  const fromEnv = process.env.SENDGRID_FROM;
  const from = payload.from || fromEnv;

  if (!to || !subject || (!text && !html)) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields: to, subject, and one of text or html' }) };
  }

  if (!from) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured: SENDGRID_FROM missing (or provide "from" in request body)' }) };
  }

  // Initialize client
  sgMail.setApiKey(apiKey);

  // Optional: EU Data Residency support (safe feature-detect)
  const dr = (payload.dataResidency || process.env.SENDGRID_DATA_RESIDENCY || '').toString().toLowerCase();
  try {
    if (dr === 'eu' && typeof sgMail.setDataResidency === 'function') {
      sgMail.setDataResidency('eu');
    }
  } catch (e) {
    // Non-fatal; continue with default US endpoint
    console.warn('setDataResidency failed or unsupported:', e && e.message ? e.message : e);
  }

  const msg = {
    to,
    from,
    subject,
    ...(text ? { text } : {}),
    ...(html ? { html } : {}),
  };

  try {
    const [response] = await sgMail.send(msg);
    const requestId = response && response.headers ? (response.headers['x-message-id'] || response.headers['x-sendgrid-message-id']) : undefined;
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, requestId: requestId || null })
    };
  } catch (error) {
    const status = (error && error.code) || 500;
    const detail = (error && error.response && error.response.body && error.response.body.errors) ? error.response.body.errors : undefined;
    return {
      statusCode: typeof status === 'number' ? status : 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Send failed', message: error && error.message ? error.message : String(error), detail })
    };
  }
};

