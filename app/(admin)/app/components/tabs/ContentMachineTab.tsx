'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

// ─── TYPES ───
interface Slide {
  slide_number: number;
  headline: string;
  body: string;
  type: 'hook' | 'content' | 'cta';
}

interface Deck {
  topic: string;
  slides: Slide[];
  posted: boolean;
}

// ─── TOPIC CATEGORIES ───
const TOPIC_CATEGORIES = [
  'sleep optimization', 'morning routines', 'dehydration symptoms',
  'pilot and aviation health', 'athletic recovery', 'cognitive performance',
  'gut health', 'circadian rhythm', 'travel health', 'electrolyte science',
];

// ─── SYSTEM PROMPT ───
const SYSTEM_PROMPT = `You are a premium health content strategist for Atlas Hydration, a zero-sugar electrolyte brand founded by a commercial airline pilot. Generate TikTok slideshow content that is educational, credible, and subtly tied to hydration and electrolytes. Tone: clean, confident, Apple-like — no emojis, no hype language, no exclamation marks. Think: what a knowledgeable friend would tell you, not an ad.`;

function buildUserPrompt(categories: string[]): string {
  const picked = categories.sort(() => Math.random() - 0.5).slice(0, 5);
  return `Generate 5 TikTok slideshow decks. Each deck has 8 slides.

For each deck return:
- topic: a hook-driven title (4-10 words)
- slides: array of 8 objects with slide_number (1-8), headline (4-7 words max, punchy), body (1-2 sentences max, factual, no fluff), type ("hook" for slide 1, "content" for slides 2-7, "cta" for slide 8)

Slide 8 (CTA) always: headline = "Stay Hydrated. Stay Sharp.", body = "Atlas Hydration — Zero Sugar Electrolytes. atlashydration.com"

Topic categories to draw from: ${picked.join(', ')}

Return ONLY a valid JSON array of 5 deck objects. No markdown, no explanation.`;
}

// ─── SLIDE RENDERER ───
const FULL_W = 1080;
const FULL_H = 1920;
const PREVIEW_SCALE = 0.15;

function SlidePreview({ slide, deckIndex, accent }: { slide: Slide; deckIndex: number; accent: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const dpr = 2;
    canvas.width = FULL_W * PREVIEW_SCALE * dpr;
    canvas.height = FULL_H * PREVIEW_SCALE * dpr;
    ctx.scale(dpr * PREVIEW_SCALE, dpr * PREVIEW_SCALE);
    drawSlide(ctx, slide, accent);
  }, [slide, accent, deckIndex]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: FULL_W * PREVIEW_SCALE,
        height: FULL_H * PREVIEW_SCALE,
        borderRadius: 6,
        flexShrink: 0,
        cursor: 'pointer',
        border: '1px solid var(--border)',
      }}
    />
  );
}

function drawSlide(ctx: CanvasRenderingContext2D, slide: Slide, accent: string) {
  const w = FULL_W, h = FULL_H;
  const isDark = slide.type === 'hook' || slide.type === 'cta';
  const isCta = slide.type === 'cta';

  // Background
  if (isDark) {
    ctx.fillStyle = '#0D0D0D';
    ctx.fillRect(0, 0, w, h);
    // Subtle radial glow
    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * 0.6);
    grad.addColorStop(0, accent + '14');
    grad.addColorStop(1, 'transparent');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  } else {
    ctx.fillStyle = '#F7F5F2';
    ctx.fillRect(0, 0, w, h);
  }

  const margin = 80;
  const textColor = isDark ? '#F0EDE8' : '#0D0D0D';
  const bodyColor = isDark ? '#888888' : '#666666';
  const counterColor = isDark ? '#444444' : '#AAAAAA';

  // Accent line — left edge
  ctx.fillStyle = accent;
  ctx.fillRect(margin, margin, 2, h - margin * 2);

  // Slide counter — top right
  ctx.font = '400 22px "DM Mono", monospace';
  ctx.fillStyle = counterColor;
  ctx.textAlign = 'right';
  ctx.fillText(`0${slide.slide_number} / 08`, w - margin, margin + 22);

  if (isCta) {
    // CTA: centered layout
    ctx.textAlign = 'center';
    // Headline
    ctx.font = '700 72px "DM Sans", sans-serif';
    ctx.fillStyle = textColor;
    ctx.letterSpacing = '-0.02em';
    wrapText(ctx, slide.headline, w / 2, h / 2 - 40, w - margin * 2, 82);
    // Body
    ctx.font = '300 36px "DM Sans", sans-serif';
    ctx.fillStyle = bodyColor;
    wrapText(ctx, slide.body, w / 2, h / 2 + 100, w - margin * 2, 52);
    // URL
    ctx.font = '400 28px "DM Mono", monospace';
    ctx.fillStyle = counterColor;
    ctx.fillText('atlashydration.com', w / 2, h / 2 + 240);
  } else {
    // Standard layout: headline vertically centered-ish, left aligned
    ctx.textAlign = 'left';
    ctx.font = '700 72px "DM Sans", sans-serif';
    ctx.fillStyle = textColor;
    wrapText(ctx, slide.headline, margin + 20, h * 0.38, w - margin * 2 - 20, 82);
    // Body below
    ctx.font = '300 36px "DM Sans", sans-serif';
    ctx.fillStyle = bodyColor;
    wrapText(ctx, slide.body, margin + 20, h * 0.52, w - margin * 2 - 20, 52);
  }

  // Atlas logo text — bottom left (simplified)
  ctx.textAlign = 'left';
  ctx.font = '700 32px "DM Sans", sans-serif';
  ctx.fillStyle = isDark ? '#F0EDE8' : '#1A1A1A';
  ctx.globalAlpha = 0.3;
  ctx.fillText('Atlas', margin + 20, h - margin);
  ctx.globalAlpha = 1;
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number) {
  const words = text.split(' ');
  let line = '';
  let cy = y;
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line.trim(), x, cy);
      line = word + ' ';
      cy += lineH;
    } else {
      line = test;
    }
  }
  ctx.fillText(line.trim(), x, cy);
}

// ─── FULL-RES EXPORT ───
async function exportSlide(slide: Slide, accent: string, deckTopic: string, slideNum: number): Promise<void> {
  const canvas = document.createElement('canvas');
  const dpr = 2;
  canvas.width = FULL_W * dpr;
  canvas.height = FULL_H * dpr;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  await document.fonts.ready;
  drawSlide(ctx, slide, accent);
  return new Promise(resolve => {
    canvas.toBlob(blob => {
      if (!blob) { resolve(); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const slug = deckTopic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
      a.href = url;
      a.download = `atlas-${slug}-slide-${String(slideNum).padStart(2, '0')}.jpg`;
      a.click();
      URL.revokeObjectURL(url);
      resolve();
    }, 'image/jpeg', 0.95);
  });
}

async function exportDeck(deck: Deck, accent: string, onProgress: (n: number) => void) {
  for (let i = 0; i < deck.slides.length; i++) {
    onProgress(i + 1);
    await exportSlide(deck.slides[i], accent, deck.topic, i + 1);
    await new Promise(r => setTimeout(r, 200));
  }
}

// ─── MAIN COMPONENT ───
export default function ContentMachineTab() {
  const [generating, setGenerating] = useState(false);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [error, setError] = useState('');
  const [exportProgress, setExportProgress] = useState('');
  const [lastGenerated, setLastGenerated] = useState('');
  const [focusTopics, setFocusTopics] = useState<string[]>(TOPIC_CATEGORIES.slice(0, 5));
  const cancelRef = useRef(false);

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  // Load history from localStorage
  useEffect(() => {
    const history = localStorage.getItem('atlas_cm_decks');
    if (history) {
      try { setDecks(JSON.parse(history)); } catch { /* ignore */ }
    }
    const lg = localStorage.getItem('atlas_cm_last');
    if (lg) setLastGenerated(lg);
  }, []);

  const accent = '#C8514A';

  function getApiKey(): string | null {
    let key = localStorage.getItem('atlas_cm_apikey');
    if (key) return key;
    key = window.prompt('Enter your Anthropic API key to enable content generation:');
    if (key && key.trim()) {
      localStorage.setItem('atlas_cm_apikey', key.trim());
      return key.trim();
    }
    return null;
  }

  const generate = useCallback(async () => {
    const key = getApiKey();
    if (!key) return;
    setGenerating(true);
    setError('');
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': key,
          'anthropic-version': '2023-06-01',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 4096,
          system: SYSTEM_PROMPT,
          messages: [{ role: 'user', content: buildUserPrompt(focusTopics) }],
        }),
      });
      if (!res.ok) throw new Error(`API error: ${res.status}`);
      const data = await res.json();
      const text = data.content?.[0]?.text || '';
      const jsonMatch = text.match(/\[[\s\S]*\]/);
      if (!jsonMatch) throw new Error('No valid JSON in response');
      const parsed: Deck[] = JSON.parse(jsonMatch[0]).map((d: Deck) => ({ ...d, posted: false }));
      setDecks(parsed);
      const ts = new Date().toLocaleString();
      setLastGenerated(ts);
      localStorage.setItem('atlas_cm_decks', JSON.stringify(parsed));
      localStorage.setItem('atlas_cm_last', ts);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Generation failed');
    } finally {
      setGenerating(false);
    }
  }, [focusTopics]);

  const handleExportAll = useCallback(async () => {
    cancelRef.current = false;
    for (let d = 0; d < decks.length; d++) {
      if (cancelRef.current) break;
      for (let s = 0; s < decks[d].slides.length; s++) {
        if (cancelRef.current) break;
        setExportProgress(`Deck ${d + 1}/${decks.length} — Slide ${s + 1}/8`);
        await exportSlide(decks[d].slides[s], accent, decks[d].topic, s + 1);
        await new Promise(r => setTimeout(r, 200));
      }
    }
    setExportProgress('');
  }, [decks, accent]);

  const togglePosted = (idx: number) => {
    setDecks(prev => {
      const next = [...prev];
      next[idx] = { ...next[idx], posted: !next[idx].posted };
      localStorage.setItem('atlas_cm_decks', JSON.stringify(next));
      return next;
    });
  };

  const toggleTopic = (t: string) => {
    setFocusTopics(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t]);
  };

  // ─── RENDER ───
  const btnStyle: React.CSSProperties = {
    background: 'var(--accent)', color: '#fff', border: 'none',
    padding: '10px 24px', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem',
    cursor: generating ? 'wait' : 'pointer', opacity: generating ? 0.6 : 1,
    fontFamily: 'inherit',
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--surface)', borderRadius: 12, border: '1px solid var(--border)',
    padding: 20, marginBottom: 16,
  };

  return (
    <div style={{ padding: '0 4px' }}>
      {/* Stats bar */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card__label">TODAY&apos;S BATCH</div>
          <div className="stat-card__value">{decks.length || 5}</div>
          <div className="stat-card__sub">Slideshows</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">FORMAT</div>
          <div className="stat-card__value" style={{ fontSize: '1.4rem' }}>TikTok 9:16</div>
          <div className="stat-card__sub">1080 x 1920px</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">SLIDES PER DECK</div>
          <div className="stat-card__value">8</div>
          <div className="stat-card__sub">Slides</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">LAST GENERATED</div>
          <div className="stat-card__value" style={{ fontSize: '1rem' }}>{lastGenerated || 'Never'}</div>
          <div className="stat-card__sub">{today}</div>
        </div>
      </div>

      {/* Topic chips */}
      <div style={{ ...cardStyle, marginBottom: 16 }}>
        <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, marginBottom: 10 }}>Focus Topics</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {TOPIC_CATEGORIES.map(t => (
            <button key={t} onClick={() => toggleTopic(t)} style={{
              padding: '5px 12px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 500,
              border: `1px solid ${focusTopics.includes(t) ? 'var(--accent)' : 'var(--border)'}`,
              background: focusTopics.includes(t) ? 'var(--accent-dim)' : 'transparent',
              color: focusTopics.includes(t) ? 'var(--accent)' : 'var(--text-dim)',
              cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div style={{ ...cardStyle, borderColor: '#C8514A', color: '#C8514A', fontSize: '0.85rem', marginBottom: 16 }}>{error}</div>
      )}

      {/* Export progress modal */}
      {exportProgress && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: 'var(--surface)', borderRadius: 14, border: '1px solid var(--border)', padding: 32, textAlign: 'center', minWidth: 300 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', marginBottom: 8 }}>Exporting Slides</div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: 20 }}>{exportProgress}</div>
            <button style={{ ...btnStyle, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-dim)' }}
              onClick={() => { cancelRef.current = true; setExportProgress(''); }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Decks or empty state */}
      {decks.length === 0 ? (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          padding: '80px 24px', ...cardStyle,
        }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="1" style={{ marginBottom: 20, opacity: 0.4 }}>
            <rect x="2" y="3" width="20" height="14" rx="2" />
            <path d="M8 21h8" /><path d="M12 17v4" />
            <path d="M7 8h2" /><path d="M7 11h4" />
          </svg>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>No content generated yet</div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: 24 }}>
            Generate 5 TikTok slideshows with AI-powered copy and premium design
          </div>
          <button style={btnStyle} disabled={generating} onClick={generate}>
            {generating ? 'Generating today\'s content...' : "Generate Today's Batch"}
          </button>
        </div>
      ) : (
        <>
          {/* Batch header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)' }}>Today&apos;s Batch</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginLeft: 10 }}>{decks.length} / 5 Ready</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={{ ...btnStyle, background: 'transparent', border: '1px solid var(--border)', color: 'var(--text-dim)', padding: '8px 16px', fontSize: '0.78rem' }}
                onClick={handleExportAll}>Download All ({decks.length * 8} slides)</button>
              <button style={{ ...btnStyle, padding: '8px 16px', fontSize: '0.78rem' }}
                disabled={generating} onClick={generate}>
                {generating ? 'Regenerating...' : 'Regenerate All'}
              </button>
            </div>
          </div>

          {/* Deck cards */}
          {decks.map((deck, di) => (
            <div key={di} style={{ ...cardStyle, animationDelay: `${di * 60}ms` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.7rem', color: 'var(--text-dim)', background: 'var(--surface2)', padding: '2px 8px', borderRadius: 4 }}>
                  {String(di + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text)', flex: 1 }}>{deck.topic}</span>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.68rem', color: 'var(--text-dim)' }}>8 SLIDES</span>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                  background: deck.posted ? 'rgba(22,163,74,0.15)' : 'var(--surface2)',
                  color: deck.posted ? '#16a34a' : 'var(--text-dim)',
                }}>
                  {deck.posted ? 'POSTED' : 'READY'}
                </span>
              </div>

              {/* Slide thumbnails */}
              <div style={{ display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 8 }}>
                {deck.slides.map((slide, si) => (
                  <SlidePreview key={si} slide={slide} deckIndex={di} accent={accent} />
                ))}
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <button style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 500,
                  border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-dim)',
                  cursor: 'pointer', fontFamily: 'inherit',
                }} onClick={async () => {
                  await exportDeck(deck, accent, n => setExportProgress(`Deck ${di + 1} — Slide ${n}/8`));
                  setExportProgress('');
                }}>Download All Slides</button>
                <button style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 500,
                  border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-dim)',
                  cursor: 'pointer', fontFamily: 'inherit',
                }} onClick={() => { navigator.clipboard.writeText(deck.topic); }}>Copy Topic</button>
                <button style={{
                  padding: '6px 14px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 500,
                  border: '1px solid var(--border)', background: 'transparent',
                  color: deck.posted ? '#16a34a' : 'var(--text-dim)',
                  cursor: 'pointer', fontFamily: 'inherit',
                }} onClick={() => togglePosted(di)}>
                  {deck.posted ? 'Posted Today' : 'Mark as Posted'}
                </button>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}
