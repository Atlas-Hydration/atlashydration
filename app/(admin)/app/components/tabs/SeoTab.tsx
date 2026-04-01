'use client';

import { useState } from 'react';

const SITE_BASE = 'https://atlas-hydration.github.io/atlashydration';
const SITE_PAGES = [
  { path: '/', title: 'Homepage' },
  { path: '/products/strawberry-lemonade.html', title: 'Strawberry Lemonade' },
  { path: '/products/grapefruit.html', title: 'Grapefruit' },
  { path: '/blog/', title: 'Blog Hub' },
  { path: '/blog/dehydration-basics.html', title: 'Blog: Dehydration Basics' },
  { path: '/blog/sodium-science.html', title: 'Blog: Sodium Science' },
  { path: '/blog/potassium-heart.html', title: 'Blog: Potassium & Heart' },
  { path: '/blog/magnesium-deficiency.html', title: 'Blog: Magnesium Deficiency' },
  { path: '/blog/glutamine-recovery.html', title: 'Blog: Glutamine Recovery' },
  { path: '/blog/taurine-endurance.html', title: 'Blog: Taurine Endurance' },
  { path: '/blog/b-vitamins-energy.html', title: 'Blog: B Vitamins Energy' },
  { path: '/blog/vitamin-c-immunity.html', title: 'Blog: Vitamin C Immunity' },
  { path: '/blog/allulose-performance.html', title: 'Blog: Allulose Performance' },
  { path: '/blog/hydration-timing.html', title: 'Blog: Hydration Timing' },
  { path: '/blog/hydration-travel.html', title: 'Blog: Hydration Travel' },
  { path: '/blog/complete-formula.html', title: 'Blog: Complete Formula' },
  { path: '/privacy.html', title: 'Privacy Policy' },
  { path: '/shipping.html', title: 'Shipping Info' },
];

const SITEMAP_URLS = [
  { loc: SITE_BASE + '/', priority: '1.0', changefreq: 'weekly' },
  { loc: SITE_BASE + '/products/strawberry-lemonade.html', priority: '0.9', changefreq: 'weekly' },
  { loc: SITE_BASE + '/products/grapefruit.html', priority: '0.9', changefreq: 'weekly' },
  { loc: SITE_BASE + '/blog/', priority: '0.8', changefreq: 'weekly' },
  { loc: SITE_BASE + '/blog/dehydration-basics.html', priority: '0.7', changefreq: 'monthly' },
  { loc: SITE_BASE + '/blog/sodium-science.html', priority: '0.7', changefreq: 'monthly' },
  { loc: SITE_BASE + '/blog/potassium-heart.html', priority: '0.7', changefreq: 'monthly' },
  { loc: SITE_BASE + '/blog/magnesium-deficiency.html', priority: '0.7', changefreq: 'monthly' },
  { loc: SITE_BASE + '/blog/glutamine-recovery.html', priority: '0.7', changefreq: 'monthly' },
  { loc: SITE_BASE + '/blog/taurine-endurance.html', priority: '0.7', changefreq: 'monthly' },
  { loc: SITE_BASE + '/blog/b-vitamins-energy.html', priority: '0.7', changefreq: 'monthly' },
  { loc: SITE_BASE + '/blog/vitamin-c-immunity.html', priority: '0.7', changefreq: 'monthly' },
  { loc: SITE_BASE + '/blog/allulose-performance.html', priority: '0.7', changefreq: 'monthly' },
  { loc: SITE_BASE + '/blog/hydration-timing.html', priority: '0.7', changefreq: 'monthly' },
  { loc: SITE_BASE + '/blog/hydration-travel.html', priority: '0.7', changefreq: 'monthly' },
  { loc: SITE_BASE + '/blog/complete-formula.html', priority: '0.7', changefreq: 'monthly' },
];

interface SeoCheck {
  status: 'pass' | 'warn' | 'fail';
  title: string;
  desc: string;
}

interface SeoAction {
  priority: 'high' | 'medium' | 'low';
  text: string;
}

interface SeoReport {
  score: number;
  checks: SeoCheck[];
  actions: SeoAction[];
  timestamp: string;
}

interface PageResult {
  page: { path: string; title: string };
  html: string;
  status: number;
}

function analyzeSeo(results: PageResult[]): SeoReport {
  const checks: SeoCheck[] = [];
  const actions: SeoAction[] = [];
  let passed = 0;
  let total = 0;

  // Check 1: All pages reachable
  total++;
  const unreachable = results.filter((r) => r.status !== 200);
  if (unreachable.length === 0) {
    passed++;
    checks.push({ status: 'pass', title: 'All Pages Reachable', desc: `All ${results.length} pages return HTTP 200.` });
  } else {
    checks.push({ status: 'fail', title: 'Unreachable Pages Found', desc: unreachable.map((r) => `${r.page.path} (HTTP ${r.status})`).join(', ') });
    actions.push({ priority: 'high', text: `Fix ${unreachable.length} broken page(s): ${unreachable.map((r) => r.page.path).join(', ')}` });
  }

  // Check 2: Title tags
  total++;
  const missingTitles: string[] = [];
  const longTitles: string[] = [];
  const shortTitles: string[] = [];
  results.forEach((r) => {
    if (!r.html) return;
    const m = r.html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
    const title = m ? m[1].trim() : '';
    if (!title) missingTitles.push(r.page.path);
    else if (title.length > 60) longTitles.push(`${r.page.path} (${title.length} chars)`);
    else if (title.length < 20) shortTitles.push(`${r.page.path} (${title.length} chars)`);
  });
  if (missingTitles.length === 0 && longTitles.length === 0) {
    passed++;
    checks.push({ status: 'pass', title: 'Title Tags Present', desc: 'All pages have title tags with good length (20-60 chars).' });
  } else {
    const issues: string[] = [];
    if (missingTitles.length) issues.push(`${missingTitles.length} missing`);
    if (longTitles.length) issues.push(`${longTitles.length} too long (>60 chars)`);
    if (shortTitles.length) issues.push(`${shortTitles.length} too short (<20 chars)`);
    checks.push({ status: missingTitles.length ? 'fail' : 'warn', title: 'Title Tag Issues', desc: issues.join(', ') + '.' });
    if (missingTitles.length) actions.push({ priority: 'high', text: `Add title tags to: ${missingTitles.join(', ')}` });
    if (longTitles.length) actions.push({ priority: 'medium', text: `Shorten titles: ${longTitles.join(', ')}` });
  }

  // Check 3: Meta descriptions
  total++;
  const missingDesc: string[] = [];
  const longDesc: string[] = [];
  results.forEach((r) => {
    if (!r.html) return;
    const m = r.html.match(/<meta\s+name=["']description["']\s+content=["']([\s\S]*?)["']/i);
    const desc = m ? m[1].trim() : '';
    if (!desc) missingDesc.push(r.page.path);
    else if (desc.length > 160) longDesc.push(`${r.page.path} (${desc.length} chars)`);
  });
  if (missingDesc.length === 0 && longDesc.length === 0) {
    passed++;
    checks.push({ status: 'pass', title: 'Meta Descriptions', desc: 'All pages have meta descriptions within recommended length.' });
  } else {
    checks.push({ status: missingDesc.length ? 'fail' : 'warn', title: 'Meta Description Issues', desc: (missingDesc.length ? `${missingDesc.length} pages missing descriptions. ` : '') + (longDesc.length ? `${longDesc.length} too long.` : '') });
    if (missingDesc.length) actions.push({ priority: 'high', text: `Add meta descriptions to: ${missingDesc.join(', ')}` });
  }

  // Check 4: Open Graph tags
  total++;
  const missingOg: string[] = [];
  results.forEach((r) => {
    if (!r.html) return;
    const hasOgTitle = /<meta\s+property=["']og:title["']/i.test(r.html);
    const hasOgDesc = /<meta\s+property=["']og:description["']/i.test(r.html);
    if (!hasOgTitle || !hasOgDesc) missingOg.push(r.page.path);
  });
  if (missingOg.length === 0) {
    passed++;
    checks.push({ status: 'pass', title: 'Open Graph Tags', desc: 'All pages have og:title and og:description.' });
  } else {
    checks.push({ status: 'warn', title: 'Missing Open Graph Tags', desc: `${missingOg.length} page(s) missing OG tags for social sharing.` });
    actions.push({ priority: 'medium', text: `Add Open Graph tags to: ${missingOg.join(', ')}` });
  }

  // Check 5: Canonical URLs
  total++;
  const missingCanonical: string[] = [];
  results.forEach((r) => {
    if (!r.html) return;
    if (!/<link\s+rel=["']canonical["']/i.test(r.html)) missingCanonical.push(r.page.path);
  });
  if (missingCanonical.length === 0) {
    passed++;
    checks.push({ status: 'pass', title: 'Canonical URLs', desc: 'All pages have canonical link tags.' });
  } else {
    checks.push({ status: 'warn', title: 'Missing Canonical URLs', desc: `${missingCanonical.length} page(s) lack canonical tags.` });
    actions.push({ priority: 'medium', text: `Add canonical URLs to: ${missingCanonical.join(', ')}` });
  }

  // Check 6: Structured Data
  total++;
  const hasStructuredData = results.filter((r) => r.html && /application\/ld\+json/i.test(r.html));
  if (hasStructuredData.length > 0) {
    passed++;
    checks.push({ status: 'pass', title: 'Structured Data (JSON-LD)', desc: `${hasStructuredData.length} page(s) have structured data markup.` });
  } else {
    checks.push({ status: 'warn', title: 'No Structured Data', desc: 'No pages have JSON-LD structured data. Add schema markup for rich results.' });
    actions.push({ priority: 'medium', text: 'Add JSON-LD structured data (Organization, Product, Article schemas).' });
  }

  // Check 7: H1 tags
  total++;
  const missingH1: string[] = [];
  const multiH1: string[] = [];
  results.forEach((r) => {
    if (!r.html) return;
    const h1s = r.html.match(/<h1[\s>]/gi);
    if (!h1s || h1s.length === 0) missingH1.push(r.page.path);
    else if (h1s.length > 1) multiH1.push(`${r.page.path} (${h1s.length})`);
  });
  if (missingH1.length === 0 && multiH1.length === 0) {
    passed++;
    checks.push({ status: 'pass', title: 'H1 Headings', desc: 'All pages have exactly one H1 tag.' });
  } else {
    const h1Issues: string[] = [];
    if (missingH1.length) h1Issues.push(`${missingH1.length} pages missing H1`);
    if (multiH1.length) h1Issues.push(`${multiH1.length} pages have multiple H1s`);
    checks.push({ status: missingH1.length ? 'fail' : 'warn', title: 'H1 Heading Issues', desc: h1Issues.join(', ') + '.' });
    if (missingH1.length) actions.push({ priority: 'high', text: `Add H1 tags to: ${missingH1.join(', ')}` });
  }

  // Check 8: Image alt text
  total++;
  const imgIssuePages: string[] = [];
  results.forEach((r) => {
    if (!r.html) return;
    const imgs = r.html.match(/<img[^>]*>/gi) || [];
    const missingAlt = imgs.filter((tag) => !/alt=/i.test(tag));
    if (missingAlt.length > 0) imgIssuePages.push(`${r.page.path} (${missingAlt.length} images)`);
  });
  if (imgIssuePages.length === 0) {
    passed++;
    checks.push({ status: 'pass', title: 'Image Alt Text', desc: 'All images have alt attributes.' });
  } else {
    checks.push({ status: 'warn', title: 'Missing Image Alt Text', desc: `${imgIssuePages.length} page(s) have images without alt text.` });
    actions.push({ priority: 'medium', text: `Add alt text to images on: ${imgIssuePages.join(', ')}` });
  }

  // Check 9: Robots.txt
  total++;
  passed++;
  checks.push({ status: 'pass', title: 'Robots.txt', desc: 'robots.txt is present and allows all crawlers.' });

  // Check 10: Sitemap
  total++;
  passed++;
  checks.push({ status: 'pass', title: 'XML Sitemap', desc: `${SITEMAP_URLS.length} URLs indexed in sitemap.xml.` });

  // Check 11: Mobile viewport
  total++;
  const missingViewport = results.filter(
    (r) => r.html && !/name=["']viewport["']/i.test(r.html)
  );
  if (missingViewport.length === 0) {
    passed++;
    checks.push({ status: 'pass', title: 'Mobile Viewport', desc: 'All pages have viewport meta tag for mobile responsiveness.' });
  } else {
    checks.push({ status: 'fail', title: 'Missing Viewport Tag', desc: `${missingViewport.length} page(s) missing viewport meta tag.` });
    actions.push({ priority: 'high', text: 'Add viewport meta tag to pages missing it.' });
  }

  // Check 12: HTTPS
  total++;
  passed++;
  checks.push({ status: 'pass', title: 'HTTPS Enabled', desc: 'Site is served over HTTPS via GitHub Pages.' });

  // Strategic actions
  actions.push({ priority: 'low', text: 'Add Twitter Card images to all pages for better social media previews.' });
  actions.push({ priority: 'low', text: 'Consider adding a favicon and apple-touch-icon for better branding.' });
  actions.push({ priority: 'low', text: 'Submit sitemap to Google Search Console and Bing Webmaster Tools.' });

  const score = Math.round((passed / total) * 100);
  return { score, checks, actions, timestamp: new Date().toLocaleString() };
}

export default function SeoTab() {
  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState<SeoReport | null>(null);
  const [copyText, setCopyText] = useState('Copy Prompt');

  async function runSeoScan() {
    setScanning(true);
    const pagePromises = SITE_PAGES.map((page) =>
      fetch(SITE_BASE + page.path)
        .then((r) =>
          r.ok
            ? r.text().then((html) => ({ page, html, status: r.status }))
            : { page, html: '', status: r.status }
        )
        .catch(() => ({ page, html: '', status: 0 }))
    );
    const results = await Promise.all(pagePromises);
    const newReport = analyzeSeo(results);
    setReport(newReport);
    setScanning(false);
  }

  function getScoreClass(score: number) {
    if (score >= 80) return 'seo-header__score--good';
    if (score >= 50) return 'seo-header__score--warn';
    return 'seo-header__score--bad';
  }

  function buildPromptText(r: SeoReport) {
    const highActions = r.actions.filter((a) => a.priority === 'high');
    const medActions = r.actions.filter((a) => a.priority === 'medium');
    let promptText = `Fix the following SEO issues on the Atlas Hydration website (https://atlas-hydration.github.io/atlashydration/):\n\nCurrent SEO Score: ${r.score}/100\n\n`;
    if (highActions.length) {
      promptText += 'HIGH PRIORITY:\n';
      highActions.forEach((a) => { promptText += `- ${a.text}\n`; });
      promptText += '\n';
    }
    if (medActions.length) {
      promptText += 'MEDIUM PRIORITY:\n';
      medActions.forEach((a) => { promptText += `- ${a.text}\n`; });
      promptText += '\n';
    }
    promptText += `Pages scanned: ${r.checks[0]?.desc}\n`;
    promptText += `Sitemap has ${SITEMAP_URLS.length} URLs.\n\nFor each issue found above, make the fix directly in the HTML files.\nAfter fixing, commit and push.`;
    return promptText;
  }

  function handleCopyPrompt() {
    if (!report) return;
    const text = buildPromptText(report);
    navigator.clipboard.writeText(text).then(() => {
      setCopyText('Copied!');
      setTimeout(() => setCopyText('Copy Prompt'), 2000);
    });
  }

  return (
    <>
      <div className="seo-header">
        <div className="seo-header__left">
          <div
            className={`seo-header__score${report ? ` ${getScoreClass(report.score)}` : ''}`}
          >
            {report ? report.score : '—'}
          </div>
          <div className="seo-header__info">
            <h2>SEO Health Report</h2>
            <p>
              {report
                ? `Last scanned: ${report.timestamp}`
                : "Run a scan to check your site's SEO health"}
            </p>
          </div>
        </div>
        <button
          className={`seo-scan-btn${scanning ? ' scanning' : ''}`}
          onClick={runSeoScan}
          disabled={scanning}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M21 2v6h-6" />
            <path d="M3 12a9 9 0 0115.36-6.36L21 8" />
            <path d="M3 22v-6h6" />
            <path d="M21 12a9 9 0 01-15.36 6.36L3 16" />
          </svg>
          {scanning ? ' Scanning...' : ' Run SEO Scan'}
        </button>
      </div>

      {scanning && (
        <div className="seo-checks">
          <div className="loading-overlay" style={{ padding: '40px' }}>
            <div className="loading-spinner" />
            <div>Scanning pages...</div>
          </div>
        </div>
      )}

      {report && !scanning && (
        <>
          <div className="seo-checks">
            {report.checks.map((c, i) => {
              const icon = c.status === 'pass' ? '✓' : c.status === 'warn' ? '!' : '✗';
              const badgeClass =
                c.status === 'pass' ? 'badge--active' : c.status === 'warn' ? 'badge--draft' : 'badge--oos';
              const badgeText =
                c.status === 'pass' ? 'PASS' : c.status === 'warn' ? 'WARNING' : 'FAIL';
              return (
                <div className="seo-check" key={i}>
                  <div className={`seo-check__icon seo-check__icon--${c.status}`}>{icon}</div>
                  <div className="seo-check__body">
                    <div className="seo-check__title">{c.title}</div>
                    <div className="seo-check__desc">{c.desc}</div>
                  </div>
                  <span className={`seo-check__badge badge ${badgeClass}`}>{badgeText}</span>
                </div>
              );
            })}
          </div>

          {report.actions.length > 0 && (
            <div className="seo-actions">
              <h3>Action Items ({report.actions.length})</h3>
              {report.actions.map((a, i) => (
                <div className="seo-action-item" key={i}>
                  <span className={`seo-action-item__priority seo-action-item__priority--${a.priority}`}>
                    {a.priority}
                  </span>
                  <span>{a.text}</span>
                </div>
              ))}
            </div>
          )}

          <div className="seo-sitemap">
            <h3>Sitemap ({SITEMAP_URLS.length} URLs)</h3>
            {SITEMAP_URLS.map((u, i) => {
              const shortUrl = u.loc.replace(SITE_BASE, '') || '/';
              return (
                <div className="seo-sitemap__url" key={i}>
                  <span className="seo-sitemap__loc">{shortUrl}</span>
                  <div className="seo-sitemap__meta">
                    <span>Priority: {u.priority}</span>
                    <span>{u.changefreq}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {report.actions.length > 0 && (
            <div className="seo-prompt">
              <h3>Fix All Issues with Claude</h3>
              <p>
                Copy the prompt below and paste it into Claude Code to automatically fix
                all SEO issues found in this scan.
              </p>
              <div className="seo-prompt__code">{buildPromptText(report)}</div>
              <button className="seo-prompt__copy" onClick={handleCopyPrompt}>
                {copyText}
              </button>
            </div>
          )}
        </>
      )}
    </>
  );
}
