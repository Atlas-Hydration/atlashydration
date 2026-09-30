/**
 * Generates the 1200x630 Open Graph / Twitter share images into public/og/.
 * Run after adding or editing an article:  node scripts/generate-og.mjs
 * Requires Playwright + a Chromium (dev-only tool, not part of the site build).
 */
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { createRequire } from "node:module";

const { chromium } = createRequire(import.meta.url)("playwright");

const root = process.cwd();
const { ARTICLES } = await import(pathToFileURL(path.join(root, "app/data/articles.ts")).href);
const logo = "data:image/svg+xml;base64," + fs.readFileSync(path.join(root, "public/logo.svg")).toString("base64");

const tones = {
  dark: { bg: "radial-gradient(120% 80% at 0% 110%, rgba(232,93,117,.36), transparent 60%), linear-gradient(160deg,#161618,#0c0c0e)", fg: "#f5f5f5", logoFilter: "none" },
  rose: { bg: "linear-gradient(150deg,#8f2f43,#5b1a2a)", fg: "#ffffff", logoFilter: "none" },
  stone: { bg: "#ebe8e2", fg: "#1d1d1f", logoFilter: "invert(1)" },
};
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const page = (tone, inner) => `<!doctype html><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}body{width:1200px;height:630px;background:${tone.bg};color:${tone.fg};font-family:Inter,Helvetica,Arial,sans-serif;position:relative;overflow:hidden}
.wrap{position:absolute;inset:0;padding:64px 72px;display:flex;flex-direction:column;justify-content:space-between}
.serif{font-family:'Playfair Display',Georgia,'Times New Roman',serif}
.tag{font-size:22px;letter-spacing:.22em;text-transform:uppercase;font-weight:600;opacity:.78}
.foot{display:flex;align-items:center;justify-content:space-between}
.foot img{height:40px;filter:${tone.logoFilter}}.foot span{font-size:22px;opacity:.7;letter-spacing:.04em}
${inner.css}</style><div class="wrap">${inner.html}<div class="foot"><img src="${logo}"><span>atlas-hydration.com</span></div></div>`;

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const ctx = await browser.newContext({ viewport: { width: 1200, height: 630 } });
const p = await ctx.newPage();
const shot = async (html, file) => { await p.setContent(html, { waitUntil: "load" }); await p.screenshot({ path: file, type: "png" }); console.log("wrote", path.relative(root, file)); };

await shot(page(tones.dark, {
  css: ".big{font-size:92px;line-height:1.04;letter-spacing:-.02em;max-width:900px}.sub{font-size:30px;opacity:.75;margin-top:22px}",
  html: `<div class="tag">Atlas Hydration</div><div><div class="serif big">Zero-sugar electrolytes for people who move.</div><div class="sub">Sodium, potassium, magnesium, B vitamins and amino acids.</div></div>`,
}), path.join(root, "public/og/default.png"));

for (const a of ARTICLES) {
  const tone = tones[a.cover.tone];
  await shot(page(tone, {
    css: ".fig{font-size:170px;line-height:1;letter-spacing:-.03em}.cap{font-size:32px;line-height:1.35;max-width:880px;opacity:.82;margin-top:26px}.ttl{font-size:26px;opacity:.6;margin-top:22px}",
    html: `<div class="tag">${esc(a.tag)}</div><div><div class="serif fig">${esc(a.cover.figure)}</div><div class="cap">${esc(a.cover.caption)}</div></div>`,
  }), path.join(root, "public/og/articles", `${a.slug}.png`));
}
await browser.close();
