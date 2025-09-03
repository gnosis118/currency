// Netlify Function: SendGrid Event Webhook receiver with signature verification
// POST URL to use in SendGrid: https://<your-site-domain>/.netlify/functions/sendgrid-events

const crypto = require('crypto');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Allow': 'POST' },
      body: JSON.stringify({ detail: 'Method Not Allowed' }),
    };
  }

  const signingKeyBase64 = process.env.SENDGRID_EVENT_SIGNING_KEY || '';

  // Signature headers from Twilio SendGrid
  const signature = event.headers['x-twilio-email-event-webhook-signature'] || event.headers['X-Twilio-Email-Event-Webhook-Signature'];
  const timestamp = event.headers['x-twilio-email-event-webhook-timestamp'] || event.headers['X-Twilio-Email-Event-Webhook-Timestamp'];

  // Verify signature if key is present
  if (signingKeyBase64) {
    if (!signature || !timestamp) {
      return {
        statusCode: 400,
        body: JSON.stringify({ detail: 'Missing signature headers' }),
      };
    }

    try {
      const key = Buffer.from(signingKeyBase64, 'base64');
      const signedPayload = Buffer.concat([Buffer.from(timestamp, 'utf8'), Buffer.from(event.body || '', 'utf8')]);
      const computed = crypto.createHmac('sha256', key).update(signedPayload).digest('base64');
      if (!crypto.timingSafeEqual(Buffer.from(computed), Buffer.from(signature))) {
        return {
          statusCode: 401,
          body: JSON.stringify({ detail: 'Invalid signature' }),
        };
      }
    } catch (e) {
      return {
        statusCode: 400,
        body: JSON.stringify({ detail: 'Signature verification error' }),
      };
    }
  }

  // Parse JSON array of events
  let events;
  try {
    events = JSON.parse(event.body || '[]');
    if (!Array.isArray(events)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ detail: 'Expected a JSON array of events' }),
      };
    }
  } catch (e) {
    return {
      statusCode: 400,
      body: JSON.stringify({ detail: 'Invalid JSON' }),
    };
  }

  // Tally by event type (extend to store in DB/logs as needed)
  const counts = {};
  for (const ev of events) {
    const type = (ev.event || ev.event_type || 'unknown').toLowerCase();
    counts[type] = (counts[type] || 0) + 1;
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ received: events.length, by_type: counts }),
  };
};


