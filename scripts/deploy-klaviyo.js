#!/usr/bin/env node

/**
 * Atlas Hydration — Klaviyo Template Deployment Script
 *
 * Uploads all 14 HTML email templates to Klaviyo via their Templates API.
 * Idempotent: checks for existing templates by name, updates if found.
 *
 * Usage:
 *   KLAVIYO_API_KEY=pk_xxx node scripts/deploy-klaviyo.js
 *   KLAVIYO_API_KEY=pk_xxx node scripts/deploy-klaviyo.js --dry-run
 *   KLAVIYO_API_KEY=pk_xxx node scripts/deploy-klaviyo.js --test-render
 */

const fs = require('fs');
const path = require('path');

const API_BASE = 'https://a.klaviyo.com/api';
const API_REVISION = '2024-10-15';
const KLAVIYO_API_KEY = process.env.KLAVIYO_API_KEY;

const DRY_RUN = process.argv.includes('--dry-run');
const TEST_RENDER = process.argv.includes('--test-render');

const EMAIL_MAP = [
  { file: 'welcome/email-01-welcome.html', name: 'Atlas Welcome 01 — Welcome to Atlas', flow: 'welcome', order: 1 },
  { file: 'welcome/email-02-origin-story.html', name: 'Atlas Welcome 02 — Why a Pilot Built an Electrolyte Brand', flow: 'welcome', order: 2 },
  { file: 'welcome/email-03-sugar-comparison.html', name: 'Atlas Welcome 03 — 11g Sugar is the Healthy Option', flow: 'welcome', order: 3 },
  { file: 'welcome/email-04-social-proof.html', name: 'Atlas Welcome 04 — Do Not Take Our Word For It', flow: 'welcome', order: 4 },
  { file: 'welcome/email-05-urgency-discount.html', name: 'Atlas Welcome 05 — Your 10% Off Expires in 24 Hours', flow: 'welcome', order: 5 },
  { file: 'abandoned-cart/email-06-cart-reminder.html', name: 'Atlas Cart 01 — You Left Something Behind', flow: 'abandoned-cart', order: 1 },
  { file: 'abandoned-cart/email-07-social-proof-cart.html', name: 'Atlas Cart 02 — Here Is Why They Come Back', flow: 'abandoned-cart', order: 2 },
  { file: 'abandoned-cart/email-08-final-cart.html', name: 'Atlas Cart 03 — Last Chance Your Cart Expires Soon', flow: 'abandoned-cart', order: 3 },
  { file: 'post-purchase/email-09-order-confirmation.html', name: 'Atlas Post-Purchase 01 — Your Atlas Is On The Way', flow: 'post-purchase', order: 1 },
  { file: 'post-purchase/email-10-usage-guide.html', name: 'Atlas Post-Purchase 02 — Get The Most Out Of Your Atlas', flow: 'post-purchase', order: 2 },
  { file: 'post-purchase/email-11-review-request.html', name: 'Atlas Post-Purchase 03 — How Are You Liking Atlas', flow: 'post-purchase', order: 3 },
  { file: 'winback/email-12-miss-you.html', name: 'Atlas Winback 01 — We Miss You', flow: 'winback', order: 1 },
  { file: 'winback/email-13-whats-new.html', name: 'Atlas Winback 02 — Here Is What You Have Been Missing', flow: 'winback', order: 2 },
  { file: 'winback/email-14-final-offer.html', name: 'Atlas Winback 03 — Your Exclusive 15% Off To Come Back', flow: 'winback', order: 3 },
];

const SAMPLE_CONTEXT = {
  first_name: 'Garrett',
  last_name: 'Atlas',
  discount_code: 'WELCOME10',
  checkout_url: 'https://atlas-hydration.com/checkout',
  tracking_url: 'https://atlas-hydration.com/tracking',
  winback_code: 'COMEBACK15',
};

const headers = () => ({
  'Authorization': `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
  'Content-Type': 'application/vnd.api+json',
  'Accept': 'application/vnd.api+json',
  'revision': API_REVISION,
});

async function findTemplateByName(name) {
  const url = `${API_BASE}/templates?filter=equals(name,"${encodeURIComponent(name)}")`;
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) return null;
  const json = await res.json();
  return json.data?.[0] || null;
}

async function createTemplate(name, html) {
  const res = await fetch(`${API_BASE}/templates`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      data: { type: 'template', attributes: { name, editor_type: 'CODE', html } },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Create failed (${res.status}): ${err.slice(0, 200)}`);
  }
  return (await res.json()).data;
}

async function updateTemplate(id, name, html) {
  const res = await fetch(`${API_BASE}/templates/${id}`, {
    method: 'PATCH',
    headers: headers(),
    body: JSON.stringify({
      data: { type: 'template', id, attributes: { name, html } },
    }),
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Update failed (${res.status}): ${err.slice(0, 200)}`);
  }
  return (await res.json()).data;
}

async function renderTemplate(id) {
  const res = await fetch(`${API_BASE}/template-render`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      data: {
        type: 'template',
        attributes: { id, context: SAMPLE_CONTEXT },
      },
    }),
  });
  return res.ok ? 'Render OK' : `Render failed (${res.status})`;
}

async function main() {
  console.log('\n━━━ Atlas Hydration — Klaviyo Template Deploy ━━━\n');

  if (!KLAVIYO_API_KEY && !DRY_RUN) {
    console.error('ERROR: KLAVIYO_API_KEY environment variable is required.');
    console.error('Get yours from: Klaviyo → Settings → API Keys → Create Private API Key');
    console.error('Required scopes: templates:read, templates:write');
    process.exit(1);
  }

  if (DRY_RUN) console.log('DRY RUN — no API calls will be made.\n');

  const emailsDir = path.join(__dirname, '..', 'src', 'emails');
  const results = [];

  for (const entry of EMAIL_MAP) {
    const filePath = path.join(emailsDir, entry.file);

    if (!fs.existsSync(filePath)) {
      console.log(`SKIP  ${entry.name} — file not found: ${entry.file}`);
      results.push({ name: entry.name, status: 'missing', id: null });
      continue;
    }

    const html = fs.readFileSync(filePath, 'utf-8');
    const sizeKb = (Buffer.byteLength(html) / 1024).toFixed(1);
    console.log(`READ  ${entry.name} (${sizeKb}kb)`);

    if (DRY_RUN) {
      results.push({ name: entry.name, status: 'dry-run', id: null, file: entry.file, size: `${sizeKb}kb` });
      continue;
    }

    try {
      const existing = await findTemplateByName(entry.name);
      let template;

      if (existing) {
        console.log(`  ↻ Updating existing template ${existing.id}...`);
        template = await updateTemplate(existing.id, entry.name, html);
        results.push({ name: entry.name, status: 'updated', id: template.id });
      } else {
        console.log('  + Creating new template...');
        template = await createTemplate(entry.name, html);
        results.push({ name: entry.name, status: 'created', id: template.id });
      }
      console.log(`  ✓ ${results[results.length - 1].status} → ${template.id}`);

      if (TEST_RENDER) {
        const renderResult = await renderTemplate(template.id);
        console.log(`  ⎯ ${renderResult}`);
      }

      // Rate limit: Klaviyo allows 75 requests/sec, but be polite
      await new Promise(r => setTimeout(r, 300));
    } catch (err) {
      console.log(`  ✗ FAILED: ${err.message}`);
      results.push({ name: entry.name, status: 'failed', error: err.message });
    }
  }

  // Summary
  console.log('\n━━━ SUMMARY ━━━\n');
  const created = results.filter(r => r.status === 'created').length;
  const updated = results.filter(r => r.status === 'updated').length;
  const failed = results.filter(r => r.status === 'failed').length;
  const missing = results.filter(r => r.status === 'missing').length;

  console.log(`Created: ${created}  Updated: ${updated}  Failed: ${failed}  Missing: ${missing}`);
  console.log('');
  results.forEach(r => {
    const icon = r.status === 'created' || r.status === 'updated' ? '✓' : r.status === 'dry-run' ? '○' : '✗';
    console.log(`  ${icon} ${r.name} → ${r.id || r.status}${r.size ? ` (${r.size})` : ''}`);
  });

  // Save template IDs
  if (!DRY_RUN && created + updated > 0) {
    const idMap = {};
    results.filter(r => r.id).forEach(r => { idMap[r.name] = r.id; });
    const outPath = path.join(__dirname, 'klaviyo-template-ids.json');
    fs.writeFileSync(outPath, JSON.stringify(idMap, null, 2));
    console.log(`\nTemplate IDs saved to: ${outPath}`);
  }

  console.log('\n━━━ DONE ━━━\n');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
