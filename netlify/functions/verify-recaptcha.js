// Netlify Function: Verify Google reCAPTCHA v3 token
// Expects POST { token: string, action?: string }

const https = require('https');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const secret = process.env.RECAPTCHA_SECRET;
  if (!secret) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured: RECAPTCHA_SECRET missing' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const token = payload.token;
  const action = payload.action || 'auth';
  if (!token) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing token' }) };
  }

  // Make request to Google siteverify
  const params = new URLSearchParams({
    secret,
    response: token,
  }).toString();

  const verifyUrl = `https://www.google.com/recaptcha/api/siteverify`;

  const resBody = await new Promise((resolve, reject) => {
    const req = https.request(verifyUrl + '?' + params, { method: 'POST' }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve(data));
    });
    req.on('error', reject);
    req.end();
  });

  try {
    const result = JSON.parse(resBody);
    // Expect result: { success, score, action, challenge_ts, hostname }
    if (!result.success) {
      return { statusCode: 400, body: JSON.stringify({ success: false, detail: 'Verification failed', result }) };
    }
    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ success: true, score: result.score ?? null, action: result.action ?? action, hostname: result.hostname || null })
    };
  } catch (e) {
    return { statusCode: 500, body: JSON.stringify({ error: 'Verification parse error', detail: String(e) }) };
  }
};

