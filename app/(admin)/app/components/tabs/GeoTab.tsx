'use client';

import { useState } from 'react';

const SITE_BASE = 'https://atlas-hydration.com';
const SITE_PAGES = [
  { path: '/', title: 'Homepage' },
  { path: '/products/strawberry-lemonade', title: 'Strawberry Lemonade' },
  { path: '/products/grapefruit', title: 'Grapefruit' },
  { path: '/privacy', title: 'Privacy Policy' },
  { path: '/shipping', title: 'Shipping Info' },
  { path: '/contact', title: 'Contact' },
];

interface GeoCheck {
  status: 'pass' | 'warn' | 'fail';
  title: string;
  desc: string;
}

interface GeoAction {
  priority: 'high' | 'medium' | 'low';
  text: string;
}

interface GeoReport {
  score: number;
  checks: GeoCheck[];
  actions: GeoAction[];
  suggestions: GeoAction[];
  timestamp: string;
}

interface PageResult {
  page: { path: string; title: string };
  html: string;
  status: number;
}

function analyzeGeo(results: PageResult[]): GeoReport {
  const checks: GeoCheck[] = [];
  const actions: GeoAction[] = [];
  const suggestions: GeoAction[] = [];
  let passed = 0;
  let total = 0;

  // Check 1: Structured Data / JSON-LD
  total++;
  const pagesWithSchema: string[] = [];
  const pagesWithoutSchema: string[] = [];
  const schemaTypes: Record<string, number> = {};
  results.forEach((r) => {
    if (!r.html) return;
    const schemas = r.html.match(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi) || [];
    if (schemas.length > 0) {
      pagesWithSchema.push(r.page.path);
      schemas.forEach((s) => {
        const typeMatch = s.match(/"@type"\s*:\s*"([^"]+)"/);
        if (typeMatch) schemaTypes[typeMatch[1]] = (schemaTypes[typeMatch[1]] || 0) + 1;
      });
    } else {
      pagesWithoutSchema.push(r.page.path);
    }
  });
  const schemaTypeList = Object.keys(schemaTypes);
  if (pagesWithSchema.length >= results.length * 0.8) {
    passed++;
    checks.push({ status: 'pass', title: 'Structured Data Coverage', desc: `${pagesWithSchema.length}/${results.length} pages have JSON-LD. Schema types: ${schemaTypeList.join(', ')}.` });
  } else if (pagesWithSchema.length > 0) {
    checks.push({ status: 'warn', title: 'Partial Structured Data', desc: `Only ${pagesWithSchema.length}/${results.length} pages have JSON-LD. AI models rely heavily on structured data for citation.` });
    actions.push({ priority: 'high', text: `Add JSON-LD structured data to: ${pagesWithoutSchema.slice(0, 5).join(', ')}${pagesWithoutSchema.length > 5 ? ` and ${pagesWithoutSchema.length - 5} more` : ''}` });
  } else {
    checks.push({ status: 'fail', title: 'No Structured Data', desc: 'No pages have JSON-LD. This is critical for AI models to understand and cite your content accurately.' });
    actions.push({ priority: 'high', text: 'Add JSON-LD to all pages: Organization, Product, Article, FAQPage, and HowTo schemas.' });
  }

  // Check 2: FAQ Schema
  total++;
  const pagesWithFaq = results.filter((r) => r.html && /FAQPage/i.test(r.html));
  if (pagesWithFaq.length >= 2) {
    passed++;
    checks.push({ status: 'pass', title: 'FAQ Schema', desc: `${pagesWithFaq.length} page(s) have FAQPage schema. FAQ content is heavily cited by AI assistants.` });
  } else if (pagesWithFaq.length === 1) {
    checks.push({ status: 'warn', title: 'Limited FAQ Schema', desc: 'Only 1 page has FAQ schema. Add FAQ sections to product and blog pages for better AI citation.' });
    actions.push({ priority: 'medium', text: 'Add FAQPage schema to product pages and key blog posts with Q&A content.' });
  } else {
    checks.push({ status: 'fail', title: 'No FAQ Schema', desc: 'No pages have FAQPage schema. FAQ content is one of the most cited formats by AI assistants.' });
    actions.push({ priority: 'high', text: 'Create FAQ sections with FAQPage JSON-LD on product pages (e.g., "How many electrolytes per serving?", "Is it sugar-free?").' });
  }

  // Check 3: Quantitative Claims
  total++;
  const pagesWithStats: string[] = [];
  results.forEach((r) => {
    if (!r.html) return;
    if (/\d{2,}mg|\d{2,}\s*mg|\d+\s*calories|\d+\s*grams?|zero[\s-]sugar/i.test(r.html)) {
      pagesWithStats.push(r.page.path);
    }
  });
  if (pagesWithStats.length >= results.length * 0.3) {
    passed++;
    checks.push({ status: 'pass', title: 'Quantitative Claims', desc: `${pagesWithStats.length} pages contain specific numeric claims (mg, calories, etc.). AI models prefer citing specific, verifiable data.` });
  } else {
    checks.push({ status: 'warn', title: 'Limited Quantitative Data', desc: `Only ${pagesWithStats.length} pages have specific numeric claims. AI models prioritize content with concrete, citable statistics.` });
    actions.push({ priority: 'medium', text: 'Add specific numeric claims (e.g., "1,300mg electrolytes per serving") to more pages.' });
  }

  // Check 4: Authority Signals
  total++;
  const pagesWithCitations: string[] = [];
  results.forEach((r) => {
    if (!r.html) return;
    if (/cite|source|study|research|according to|published|journal|university|clinical/i.test(r.html)) {
      pagesWithCitations.push(r.page.path);
    }
  });
  if (pagesWithCitations.length >= 3) {
    passed++;
    checks.push({ status: 'pass', title: 'Authority Signals', desc: `${pagesWithCitations.length} pages reference studies, research, or authoritative sources. This builds trust with AI models.` });
  } else {
    checks.push({ status: 'warn', title: 'Weak Authority Signals', desc: `Only ${pagesWithCitations.length} page(s) cite studies or research. AI models weigh authoritative, well-sourced content higher.` });
    actions.push({ priority: 'medium', text: 'Add citations to scientific studies and research in blog articles to boost authority.' });
  }

  // Check 5: Brand Entity
  total++;
  const hasOrgSchema = results.some((r) => r.html && /Organization/i.test(r.html) && /application\/ld\+json/i.test(r.html));
  const hasBrandMentions = results.filter((r) => r.html && /Atlas Hydration/gi.test(r.html));
  if (hasOrgSchema && hasBrandMentions.length >= results.length * 0.5) {
    passed++;
    checks.push({ status: 'pass', title: 'Brand Entity Recognition', desc: `Organization schema present and brand name appears on ${hasBrandMentions.length}/${results.length} pages.` });
  } else if (hasOrgSchema) {
    checks.push({ status: 'warn', title: 'Partial Brand Entity', desc: 'Organization schema found but brand name consistency could improve.' });
    actions.push({ priority: 'low', text: 'Ensure consistent brand naming ("Atlas Hydration") across all pages.' });
  } else {
    checks.push({ status: 'fail', title: 'Missing Brand Entity', desc: 'No Organization schema found. AI models need clear entity definitions to correctly reference your brand.' });
    actions.push({ priority: 'high', text: 'Add Organization JSON-LD schema with brand name, description, URL, logo, and social profiles.' });
  }

  // Check 6: Product Schema
  total++;
  const productPages = results.filter((r) => r.page.path.indexOf('/products/') !== -1);
  const productsWithSchema = productPages.filter((r) => r.html && /Product/i.test(r.html) && /application\/ld\+json/i.test(r.html));
  const productsWithFullSchema = productsWithSchema.filter((r) => r.html && /offers/i.test(r.html) && /description/i.test(r.html));
  if (productPages.length === 0) {
    passed++;
    checks.push({ status: 'pass', title: 'Product Schema', desc: 'No product pages to audit.' });
  } else if (productsWithFullSchema.length === productPages.length) {
    passed++;
    checks.push({ status: 'pass', title: 'Product Schema', desc: `All ${productPages.length} product pages have complete Product schema with offers and descriptions.` });
  } else {
    checks.push({ status: productsWithSchema.length === 0 ? 'fail' : 'warn', title: 'Incomplete Product Schema', desc: `${productsWithFullSchema.length}/${productPages.length} product pages have complete Product schema.` });
    actions.push({ priority: 'high', text: 'Add complete Product JSON-LD with name, description, image, offers (price, currency, availability), brand, and nutritionInformation.' });
  }

  // Check 7: Content Depth
  total++;
  const thinPages: string[] = [];
  const goodPages: string[] = [];
  results.forEach((r) => {
    if (!r.html) return;
    const textContent = r.html
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    const wordCount = textContent.split(' ').length;
    if (wordCount < 200) thinPages.push(`${r.page.path} (${wordCount} words)`);
    else goodPages.push(r.page.path);
  });
  if (thinPages.length <= 2) {
    passed++;
    checks.push({ status: 'pass', title: 'Content Depth', desc: `${goodPages.length}/${results.length} pages have substantial content (200+ words).` });
  } else {
    checks.push({ status: 'warn', title: 'Thin Content Pages', desc: `${thinPages.length} pages have less than 200 words.` });
    actions.push({ priority: 'medium', text: `Expand content on thin pages: ${thinPages.slice(0, 3).join(', ')}` });
  }

  // Check 8: Content Hierarchy
  total++;
  const goodHierarchy: string[] = [];
  const badHierarchy: string[] = [];
  results.forEach((r) => {
    if (!r.html) return;
    const hasH1 = /<h1[\s>]/i.test(r.html);
    const hasH2 = /<h2[\s>]/i.test(r.html);
    if (hasH1 && hasH2) goodHierarchy.push(r.page.path);
    else badHierarchy.push(r.page.path);
  });
  if (badHierarchy.length <= 2) {
    passed++;
    checks.push({ status: 'pass', title: 'Content Hierarchy', desc: `${goodHierarchy.length} pages have clear H1/H2 heading hierarchy.` });
  } else {
    checks.push({ status: 'warn', title: 'Weak Content Hierarchy', desc: `${badHierarchy.length} pages lack proper H1 + H2 heading structure.` });
    actions.push({ priority: 'medium', text: `Add clear H1/H2 heading hierarchy to: ${badHierarchy.slice(0, 3).join(', ')}` });
  }

  // Check 9: Conversational Content
  total++;
  const conversationalPages: string[] = [];
  results.forEach((r) => {
    if (!r.html) return;
    if (/\?<\/h[23]>|what is|how does|why do|when should|how to|how much|can i|does it/i.test(r.html)) {
      conversationalPages.push(r.page.path);
    }
  });
  if (conversationalPages.length >= 3) {
    passed++;
    checks.push({ status: 'pass', title: 'Conversational Content', desc: `${conversationalPages.length} pages contain question-style headings or Q&A format.` });
  } else {
    checks.push({ status: 'warn', title: 'Limited Q&A Content', desc: `Only ${conversationalPages.length} page(s) use question-and-answer format.` });
    actions.push({ priority: 'high', text: 'Add Q&A sections using natural question headings (e.g., "What electrolytes does Atlas Hydration contain?", "Is Atlas Hydration sugar-free?").' });
  }

  // Check 10: Brand Story
  total++;
  const hasAbout = results.some((r) => r.html && /about|our story|our mission|who we are/i.test(r.html) && r.html.length > 2000);
  if (hasAbout) {
    passed++;
    checks.push({ status: 'pass', title: 'Brand Story Content', desc: 'Brand story / mission content found.' });
  } else {
    checks.push({ status: 'warn', title: 'No Dedicated Brand Story', desc: 'No substantial "About Us" or brand story content detected.' });
    actions.push({ priority: 'medium', text: 'Create a dedicated About page or expand brand story section with founding story, mission, team, and values.' });
  }

  // Check 11: Comparison Content
  total++;
  const hasComparison = results.some((r) => r.html && /vs\.?|versus|compared to|comparison|better than|alternative/i.test(r.html));
  if (hasComparison) {
    passed++;
    checks.push({ status: 'pass', title: 'Comparison Content', desc: 'Comparison or "vs" content found.' });
  } else {
    checks.push({ status: 'warn', title: 'No Comparison Content', desc: 'No comparison content detected. Users often ask AI "Atlas Hydration vs Liquid IV".' });
    suggestions.push({ priority: 'medium', text: 'Create comparison pages or sections: "Atlas Hydration vs Liquid IV", "Atlas vs LMNT", etc.' });
  }

  // Check 12: Ingredient Transparency
  total++;
  const hasIngredients = results.some((r) => r.html && /ingredient|nutrition|supplement facts|serving size|per serving/i.test(r.html));
  if (hasIngredients) {
    passed++;
    checks.push({ status: 'pass', title: 'Ingredient Transparency', desc: 'Ingredient and nutrition information found.' });
  } else {
    checks.push({ status: 'fail', title: 'Missing Ingredient Details', desc: 'No ingredient/nutrition info found.' });
    actions.push({ priority: 'high', text: 'Add detailed ingredient lists and nutrition facts with NutritionInformation schema markup.' });
  }

  // Check 13: Social Proof
  total++;
  const hasReviews = results.some((r) => r.html && /review|testimonial|rating|stars?|customer said|verified purchase/i.test(r.html));
  if (hasReviews) {
    passed++;
    checks.push({ status: 'pass', title: 'Social Proof', desc: 'Reviews or testimonials detected.' });
  } else {
    checks.push({ status: 'warn', title: 'No Reviews / Testimonials', desc: 'No customer reviews or testimonials found.' });
    suggestions.push({ priority: 'medium', text: 'Add customer testimonials with Review schema markup (aggregateRating, individual reviews).' });
  }

  // Check 14: AI Crawler Access
  total++;
  const aiBlockedPages = results.filter((r) => {
    if (!r.html) return false;
    return /GPTBot|CCBot|anthropic|Claude-Web|PerplexityBot|Google-Extended/i.test(r.html);
  });
  if (aiBlockedPages.length === 0) {
    passed++;
    checks.push({ status: 'pass', title: 'AI Crawler Access', desc: 'No AI crawler blocks detected. Your content is accessible to GPTBot, ClaudeBot, PerplexityBot, and other AI crawlers.' });
  } else {
    checks.push({ status: 'fail', title: 'AI Crawlers Blocked', desc: `${aiBlockedPages.length} page(s) block AI crawlers.` });
    actions.push({ priority: 'high', text: 'Remove AI crawler blocks (GPTBot, CCBot, anthropic-ai) from robots.txt and meta tags.' });
  }

  const score = total > 0 ? Math.round((passed / total) * 100) : 0;
  return { score, checks, actions, suggestions, timestamp: new Date().toLocaleString() };
}

export default function GeoTab() {
  const [scanning, setScanning] = useState(false);
  const [report, setReport] = useState<GeoReport | null>(null);
  const [copyText, setCopyText] = useState('Copy Prompt');

  async function runGeoScan() {
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
    const newReport = analyzeGeo(results);
    setReport(newReport);
    setScanning(false);
  }

  function getScoreClass(score: number) {
    if (score >= 75) return 'seo-header__score--good';
    if (score >= 45) return 'seo-header__score--warn';
    return 'seo-header__score--bad';
  }

  function buildPromptText(r: GeoReport) {
    const highActions = r.actions.filter((a) => a.priority === 'high');
    const medActions = r.actions.filter((a) => a.priority === 'medium');
    let promptText = `Fix the following GEO (Generative Engine Optimization) issues on the Atlas Hydration website (https://atlas-hydration.com/):\n\nHosting: Vercel | Framework: Next.js 16 (App Router, static export) | Node.js\n\nCurrent GEO Score: ${r.score}/100\n\nGEO ensures AI assistants (ChatGPT, Claude, Perplexity, Google AI Overviews) can discover, understand, and accurately cite our content.\n\n`;
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
    if (r.suggestions.length) {
      promptText += 'CONTENT SUGGESTIONS:\n';
      r.suggestions.forEach((s) => { promptText += `- ${s.text}\n`; });
      promptText += '\n';
    }
    promptText += 'For each issue found above, apply the appropriate fix.\nAfter fixing, commit and push.';
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

  const showPrompt = report && (report.actions.length > 0 || report.suggestions.length > 0);

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
            <h2>GEO Health Report</h2>
            <p>
              {report
                ? `Last scanned: ${report.timestamp}`
                : "Run a scan to check your site's GEO readiness"}
            </p>
          </div>
        </div>
        <button
          className={`seo-scan-btn${scanning ? ' scanning' : ''}`}
          onClick={runGeoScan}
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
            <circle cx="12" cy="12" r="10" />
            <path d="M2 12h20" />
            <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
          </svg>
          {scanning ? ' Scanning...' : ' Run GEO Scan'}
        </button>
      </div>

      <div
        className="geo-explainer"
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '20px',
          marginBottom: '24px',
        }}
      >
        <div style={{ fontSize: '0.82rem', fontWeight: 600, marginBottom: '6px' }}>
          What is GEO?
        </div>
        <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.6 }}>
          Generative Engine Optimization (GEO) ensures your content is discoverable and
          accurately cited by AI assistants like ChatGPT, Claude, Perplexity, and Google
          AI Overviews. Unlike traditional SEO which targets search engine crawlers, GEO
          focuses on making your content structured, authoritative, and easy for language
          models to extract and reference.
        </div>
      </div>

      {scanning && (
        <div className="seo-checks">
          <div className="loading-overlay" style={{ padding: '40px' }}>
            <div className="loading-spinner" />
            <div>Analyzing GEO readiness...</div>
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

          {report.suggestions.length > 0 && (
            <div className="seo-actions">
              <h3>Content Suggestions ({report.suggestions.length})</h3>
              {report.suggestions.map((s, i) => (
                <div className="seo-action-item" key={i}>
                  <span className={`seo-action-item__priority seo-action-item__priority--${s.priority}`}>
                    {s.priority}
                  </span>
                  <span>{s.text}</span>
                </div>
              ))}
            </div>
          )}

          {showPrompt && (
            <div className="seo-prompt">
              <h3>Fix All Issues with Claude</h3>
              <p>
                Copy the prompt below and paste it into Claude Code to automatically fix
                all GEO issues found in this scan.
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
