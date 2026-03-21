// Atlas Hydration — Cloudflare Worker Proxy for Shopify Admin API
// Securely proxies GraphQL requests from the dashboard to Shopify's Admin API.
//
// SETUP:
//   1. npm install -g wrangler
//   2. cd cloudflare-worker
//   3. wrangler login
//   4. wrangler secret put SHOPIFY_ADMIN_TOKEN
//      (paste your Shopify Admin API access token)
//   5. wrangler deploy
//
// The worker URL will be printed after deploy (e.g. https://atlas-shopify-proxy.<you>.workers.dev)
// Copy that URL into app/index.html as the WORKER_URL.

const API_VERSION = '2025-01';

// In-memory token cache for client credentials flow
let cachedToken = null;
let tokenExpiresAt = 0;

async function getAccessToken(env) {
  // If a static Admin API token is set, use it directly
  if (env.SHOPIFY_ADMIN_TOKEN) {
    return env.SHOPIFY_ADMIN_TOKEN;
  }

  // Otherwise use client credentials flow
  if (cachedToken && Date.now() < tokenExpiresAt) {
    return cachedToken;
  }

  const res = await fetch(`https://${env.SHOPIFY_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=client_credentials&client_id=${env.SHOPIFY_CLIENT_ID}&client_secret=${env.SHOPIFY_CLIENT_SECRET}`
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Token request failed (${res.status}): ${body.substring(0, 200)}`);
  }

  const data = await res.json();
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + ((data.expires_in || 86399) - 60) * 1000;
  return cachedToken;
}

function corsHeaders(origin, allowedOrigin) {
  // Allow the configured origin + localhost for dev
  const allowed = [allowedOrigin, 'http://localhost:3000', 'http://127.0.0.1:3000', 'null'];
  const isAllowed = allowed.some(a => origin === a) || origin?.endsWith('.github.io');

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    // Only accept POST
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }

    try {
      const { query, variables } = await request.json();

      if (!query) {
        return new Response(JSON.stringify({ error: 'Missing query' }), {
          status: 400,
          headers: { ...headers, 'Content-Type': 'application/json' }
        });
      }

      const token = await getAccessToken(env);
      const shopifyUrl = `https://${env.SHOPIFY_DOMAIN}/admin/api/${API_VERSION}/graphql.json`;

      const shopifyRes = await fetch(shopifyUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token,
        },
        body: JSON.stringify({ query, variables }),
      });

      const data = await shopifyRes.text();

      return new Response(data, {
        status: shopifyRes.status,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        }
      });
    } catch (err) {
      return new Response(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
  }
};
