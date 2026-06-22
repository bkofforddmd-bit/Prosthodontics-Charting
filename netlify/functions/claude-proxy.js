// Netlify Function: claude-proxy
// Forwards a request to the Anthropic API using the API KEY SUPPLIED BY THE CALLER.
// Each clinician's browser sends their OWN key in the "x-user-api-key" header, so
// usage bills to THEIR OWN Anthropic account. No key is stored on the server.
//
// DEPLOY:
//   1. In your site repo, create the folder:  netlify/functions/
//   2. Put this file there as:                netlify/functions/claude-proxy.js
//   3. Deploy. Your proxy URL becomes:
//        https://YOUR-SITE.netlify.app/.netlify/functions/claude-proxy
//   4. In the app, open "⚙ AI key", paste that URL as the proxy URL, and each
//      user pastes their own Anthropic key.

exports.handler = async (event) => {
  const cors = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-user-api-key',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: cors, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers: cors, body: JSON.stringify({ error: { message: 'Method not allowed' } }) };
  }

  // The caller's own Anthropic key (never stored, just forwarded)
  const userKey = event.headers['x-user-api-key'] || event.headers['X-User-Api-Key'];
  if (!userKey) {
    return { statusCode: 401, headers: cors, body: JSON.stringify({ error: { message: 'Missing x-user-api-key header. Add your API key in the app under "⚙ AI key".' } }) };
  }

  try {
    const upstream = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': userKey,
        'anthropic-version': '2023-06-01'
      },
      body: event.body
    });

    const text = await upstream.text();
    return { statusCode: upstream.status, headers: cors, body: text };
  } catch (err) {
    return { statusCode: 502, headers: cors, body: JSON.stringify({ error: { message: 'Proxy error: ' + (err && err.message ? err.message : 'unknown') } }) };
  }
};

