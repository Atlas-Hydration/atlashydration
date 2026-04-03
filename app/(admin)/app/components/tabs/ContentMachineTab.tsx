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

const TOPIC_CATEGORIES = [
  'sleep optimization', 'morning routines', 'dehydration symptoms',
  'pilot and aviation health', 'athletic recovery', 'cognitive performance',
  'gut health', 'circadian rhythm', 'travel health', 'electrolyte science',
];

// ─── PREMIUM SLIDE RENDERER ───
const W = 1080, H = 1920;
const PREVIEW_SCALE = 0.3;
const ACCENT = '#C8514A';

function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxW: number, lineH: number): number {
  const words = text.split(' ');
  let line = '', cy = y;
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxW && line) {
      ctx.fillText(line.trim(), x, cy);
      line = word + ' '; cy += lineH;
    } else { line = test; }
  }
  ctx.fillText(line.trim(), x, cy);
  return cy;
}

function addGrain(ctx: CanvasRenderingContext2D, w: number, h: number, opacity: number) {
  const imgData = ctx.getImageData(0, 0, w, h);
  const d = imgData.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * 25 * opacity;
    d[i] += n; d[i + 1] += n; d[i + 2] += n;
  }
  ctx.putImageData(imgData, 0, 0);
}

function drawSlide(ctx: CanvasRenderingContext2D, slide: Slide) {
  const m = 80;
  const sn = String(slide.slide_number).padStart(2, '0');
  const isEvenContent = slide.type === 'content' && slide.slide_number % 2 === 0;
  const isDarkContent = slide.type === 'content' && slide.slide_number % 2 !== 0;

  if (slide.type === 'hook') {
    // ── HOOK SLIDE ──
    const grad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.9);
    grad.addColorStop(0, '#1A1A2E');
    grad.addColorStop(1, '#0D0D0D');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // Red accent line above headline
    ctx.fillStyle = ACCENT;
    ctx.fillRect(W / 2 - 30, H * 0.38, 60, 3);

    // Headline
    ctx.textAlign = 'center';
    ctx.font = '800 72px "DM Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    wrapText(ctx, slide.headline, W / 2, H * 0.45, W - m * 2, 88);

    // Atlas wordmark bottom
    ctx.font = '500 28px "DM Sans", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillText('Atlas Hydration', W / 2, H - m);

    addGrain(ctx, W, H, 0.04);

  } else if (slide.type === 'cta') {
    // ── CTA SLIDE ──
    ctx.fillStyle = '#111111';
    ctx.fillRect(0, 0, W, H);
    const glow = ctx.createRadialGradient(W / 2, H * 0.4, 0, W / 2, H * 0.4, W * 0.5);
    glow.addColorStop(0, 'rgba(200,81,74,0.15)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    ctx.textAlign = 'center';

    // Atlas logo text (large)
    ctx.font = '700 80px "DM Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('Atlas', W / 2, H * 0.35);

    // Headline
    ctx.font = '600 52px "DM Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    wrapText(ctx, slide.headline, W / 2, H * 0.45, W - m * 2, 64);

    // Divider
    ctx.fillStyle = ACCENT;
    ctx.fillRect(W / 2 - 40, H * 0.52, 80, 2);

    // Subtitle
    ctx.font = '300 28px "DM Sans", sans-serif';
    ctx.fillStyle = '#888888';
    ctx.fillText('Zero Sugar Electrolytes', W / 2, H * 0.57);

    // Stat pills
    const pills = ['500mg K+', '200mg Mg', '600mg Na', '0g Sugar'];
    const pillW = 180, pillH = 48, pillGap = 16;
    const totalPillW = pills.length * pillW + (pills.length - 1) * pillGap;
    const pillStartX = (W - totalPillW) / 2;
    const pillY = H * 0.65;
    ctx.font = '500 22px "DM Sans", sans-serif';
    pills.forEach((p, i) => {
      const px = pillStartX + i * (pillW + pillGap);
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(px, pillY, pillW, pillH, 24);
      ctx.stroke();
      ctx.fillStyle = '#888888';
      ctx.fillText(p, px + pillW / 2, pillY + 31);
    });

    // URL
    ctx.font = '400 24px "DM Mono", monospace';
    ctx.fillStyle = ACCENT;
    ctx.fillText('atlashydration.com', W / 2, H - m - 20);

    addGrain(ctx, W, H, 0.04);

  } else {
    // ── CONTENT SLIDES ──
    const isLight = isEvenContent;
    const bg = isLight ? '#F7F5F2' : '#1C1E22';
    const headColor = isLight ? '#0D0D0D' : '#F0EDE8';
    const bodyColor = isLight ? '#555555' : '#888888';
    const counterColor = isLight ? '#AAAAAA' : '#444444';
    const numBg = isLight ? '#F0EDE8' : '#232323';
    const wordmarkColor = isLight ? '#CCCCCC' : '#444444';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Thick vertical red bar left edge
    ctx.fillStyle = ACCENT;
    ctx.fillRect(0, 0, 6, H);

    // Slide counter top-right
    ctx.textAlign = 'right';
    ctx.font = '400 22px "DM Mono", monospace';
    ctx.fillStyle = counterColor;
    ctx.fillText(`${sn} / 08`, W - m, m + 22);

    // Large faded background number bottom-right
    ctx.textAlign = 'right';
    ctx.font = '900 300px "DM Sans", sans-serif';
    ctx.fillStyle = numBg;
    ctx.fillText(sn, W - 40, H - 60);

    // Headline centered vertically, left-aligned
    ctx.textAlign = 'left';
    ctx.font = '700 64px "DM Sans", sans-serif';
    ctx.fillStyle = headColor;
    const headY = wrapText(ctx, slide.headline, m, H * 0.38, W - m * 2, 78);

    // Body below headline
    ctx.font = '300 32px "DM Sans", sans-serif';
    ctx.fillStyle = bodyColor;
    wrapText(ctx, slide.body, m, headY + 60, W - m * 2, 50);

    // Atlas wordmark bottom-left
    ctx.font = '500 28px "DM Sans", sans-serif';
    ctx.fillStyle = wordmarkColor;
    ctx.fillText('Atlas', m, H - m);
  }
}

// ─── SLIDE PREVIEW COMPONENT ───
function SlidePreview({ slide, onClick }: { slide: Slide; onClick: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = 2;
    c.width = W * PREVIEW_SCALE * dpr;
    c.height = H * PREVIEW_SCALE * dpr;
    ctx.scale(dpr * PREVIEW_SCALE, dpr * PREVIEW_SCALE);
    drawSlide(ctx, slide);
  }, [slide]);

  return (
    <canvas ref={canvasRef} onClick={onClick} style={{
      width: W * PREVIEW_SCALE, height: H * PREVIEW_SCALE,
      borderRadius: 8, flexShrink: 0, cursor: 'pointer',
      border: '1px solid #272727', transition: 'transform 0.15s, border-color 0.15s',
    }} onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.transform = 'scale(1.02)'; }}
       onMouseLeave={e => { e.currentTarget.style.borderColor = '#272727'; e.currentTarget.style.transform = 'scale(1)'; }} />
  );
}

// ─── FULL-SIZE MODAL ───
function SlideModal({ slide, onClose }: { slide: Slide | null; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!slide) return;
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = 2;
    c.width = W * dpr; c.height = H * dpr;
    ctx.scale(dpr, dpr);
    drawSlide(ctx, slide);
  }, [slide]);
  if (!slide) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    }}>
      <canvas ref={canvasRef} style={{
        width: W * 0.45, height: H * 0.45, borderRadius: 12,
        boxShadow: '0 32px 80px rgba(0,0,0,0.6)',
      }} onClick={e => e.stopPropagation()} />
    </div>
  );
}

// ─── EXPORT ───
async function exportSlide(slide: Slide, topic: string, deckNum: number, slideNum: number): Promise<void> {
  const c = document.createElement('canvas');
  const dpr = 2; c.width = W * dpr; c.height = H * dpr;
  const ctx = c.getContext('2d');
  if (!ctx) return;
  ctx.scale(dpr, dpr);
  await document.fonts.ready;
  drawSlide(ctx, slide);
  return new Promise(resolve => {
    c.toBlob(blob => {
      if (!blob) { resolve(); return; }
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
      a.href = url;
      a.download = `atlas-${slug}-${String(deckNum).padStart(2, '0')}-slide-${String(slideNum).padStart(2, '0')}.jpg`;
      a.click(); URL.revokeObjectURL(url); resolve();
    }, 'image/jpeg', 0.95);
  });
}

// ─── MAIN COMPONENT ───
export default function ContentMachineTab() {
  const [generating, setGenerating] = useState(false);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [error, setError] = useState('');
  const [exportProgress, setExportProgress] = useState('');
  const [lastGenerated, setLastGenerated] = useState('');
  const [focusTopics, setFocusTopics] = useState<string[]>(TOPIC_CATEGORIES.slice(0, 5));
  const [modalSlide, setModalSlide] = useState<Slide | null>(null);
  const cancelRef = useRef(false);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    const h = localStorage.getItem('atlas_cm_decks');
    if (h) { try { setDecks(JSON.parse(h)); } catch { /* */ } }
    const lg = localStorage.getItem('atlas_cm_last');
    if (lg) setLastGenerated(lg);
  }, []);

  const generate = useCallback(async () => {
    setGenerating(true); setError('');
    try {
      const res = await fetch('/api/content-machine', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topics: focusTopics, count: 5 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Server error: ${res.status}`);
      const parsed: Deck[] = data.decks.map((d: Deck) => ({ ...d, posted: false }));
      setDecks(parsed);
      const ts = new Date().toLocaleString();
      setLastGenerated(ts);
      localStorage.setItem('atlas_cm_decks', JSON.stringify(parsed));
      localStorage.setItem('atlas_cm_last', ts);
    } catch (e) { setError(e instanceof Error ? e.message : 'Generation failed'); }
    finally { setGenerating(false); }
  }, [focusTopics]);

  const handleExportAll = useCallback(async () => {
    cancelRef.current = false;
    for (let d = 0; d < decks.length; d++) {
      for (let s = 0; s < decks[d].slides.length; s++) {
        if (cancelRef.current) { setExportProgress(''); return; }
        setExportProgress(`Deck ${d + 1}/${decks.length} — Slide ${s + 1}/8`);
        await exportSlide(decks[d].slides[s], decks[d].topic, d + 1, s + 1);
        await new Promise(r => setTimeout(r, 150));
      }
    }
    setExportProgress('');
  }, [decks]);

  const togglePosted = (i: number) => {
    setDecks(prev => {
      const n = [...prev]; n[i] = { ...n[i], posted: !n[i].posted };
      localStorage.setItem('atlas_cm_decks', JSON.stringify(n)); return n;
    });
  };

  const toggleTopic = (t: string) => setFocusTopics(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]);

  const btn = (override?: React.CSSProperties): React.CSSProperties => ({
    background: 'var(--accent)', color: '#fff', border: 'none',
    padding: '10px 24px', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem',
    cursor: generating ? 'wait' : 'pointer', opacity: generating ? 0.6 : 1,
    fontFamily: 'inherit', ...override,
  });

  const ghost: React.CSSProperties = {
    padding: '6px 14px', borderRadius: 6, fontSize: '0.75rem', fontWeight: 500,
    border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-dim)',
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
  };

  const card: React.CSSProperties = {
    background: '#161616', borderRadius: 14, border: '1px solid #272727', padding: 20, marginBottom: 16,
  };

  const thumbStrip: React.CSSProperties = {
    display: 'flex', gap: 10, overflowX: 'auto', padding: '16px 0 4px',
    scrollbarWidth: 'none',
  };

  return (
    <div style={{ padding: '0 4px' }}>
      <SlideModal slide={modalSlide} onClose={() => setModalSlide(null)} />

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card"><div className="stat-card__label">TODAY&apos;S BATCH</div><div className="stat-card__value">{decks.length || 5}</div><div className="stat-card__sub">Slideshows</div></div>
        <div className="stat-card"><div className="stat-card__label">FORMAT</div><div className="stat-card__value" style={{ fontSize: '1.4rem' }}>TikTok 9:16</div><div className="stat-card__sub">1080 x 1920px</div></div>
        <div className="stat-card"><div className="stat-card__label">SLIDES PER DECK</div><div className="stat-card__value">8</div><div className="stat-card__sub">Slides</div></div>
        <div className="stat-card"><div className="stat-card__label">LAST GENERATED</div><div className="stat-card__value" style={{ fontSize: '1rem' }}>{lastGenerated || 'Never'}</div><div className="stat-card__sub">{today}</div></div>
      </div>

      {/* Topics */}
      <div style={{ ...card, marginBottom: 16 }}>
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

      {error && <div style={{ ...card, borderColor: ACCENT, color: ACCENT, fontSize: '0.85rem', marginBottom: 16 }}>{error}</div>}

      {exportProgress && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: '#161616', borderRadius: 14, border: '1px solid #272727', padding: 32, textAlign: 'center', minWidth: 300 }}>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', marginBottom: 8 }}>Exporting Slides</div>
            <div style={{ fontSize: '0.82rem', color: '#888', marginBottom: 20 }}>{exportProgress}</div>
            <button style={ghost} onClick={() => { cancelRef.current = true; setExportProgress(''); }}>Cancel</button>
          </div>
        </div>
      )}

      {decks.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', ...card }}>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="1" style={{ marginBottom: 20, opacity: 0.4 }}>
            <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" />
          </svg>
          <div style={{ fontSize: '1rem', fontWeight: 600, color: '#fff', marginBottom: 6 }}>No content generated yet</div>
          <div style={{ fontSize: '0.82rem', color: '#888', marginBottom: 24 }}>Generate 5 TikTok slideshows with AI-powered copy and premium design</div>
          <button style={btn()} disabled={generating} onClick={generate}>
            {generating ? "Generating today's content..." : "Generate Today's Batch"}
          </button>
        </div>
      ) : (
        <>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 8 }}>
            <div>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff' }}>Today&apos;s Batch</span>
              <span style={{ fontSize: '0.75rem', color: '#888', marginLeft: 10 }}>{decks.length} / 5 Ready</span>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button style={ghost} onClick={handleExportAll}>Download All ({decks.length * 8} slides)</button>
              <button style={btn({ padding: '8px 16px', fontSize: '0.78rem' })} disabled={generating} onClick={generate}>
                {generating ? 'Regenerating...' : 'Regenerate All'}
              </button>
            </div>
          </div>

          {decks.map((deck, di) => (
            <div key={di} style={card}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4, flexWrap: 'wrap' }}>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.75rem', color: ACCENT, fontWeight: 700 }}>
                  {String(di + 1).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#fff', flex: 1 }}>{deck.topic}</span>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.68rem', color: '#666' }}>8 SLIDES</span>
                <span style={{
                  fontSize: '0.65rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                  background: deck.posted ? 'rgba(22,163,74,0.15)' : '#1C1C1C',
                  color: deck.posted ? '#16a34a' : '#666',
                }}>{deck.posted ? 'POSTED' : 'READY'}</span>
              </div>
              <div style={thumbStrip} className="hide-scrollbar">
                {deck.slides.map((slide, si) => (
                  <SlidePreview key={si} slide={slide} onClick={() => setModalSlide(slide)} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <button style={ghost} onClick={async () => {
                  for (let s = 0; s < deck.slides.length; s++) {
                    setExportProgress(`Deck ${di + 1} — Slide ${s + 1}/8`);
                    await exportSlide(deck.slides[s], deck.topic, di + 1, s + 1);
                    await new Promise(r => setTimeout(r, 150));
                  }
                  setExportProgress('');
                }}>Download All Slides</button>
                <button style={ghost} onClick={() => navigator.clipboard.writeText(deck.topic)}>Copy Topic</button>
                <button style={{ ...ghost, color: deck.posted ? '#16a34a' : 'var(--text-dim)' }} onClick={() => togglePosted(di)}>
                  {deck.posted ? 'Posted Today' : 'Mark as Posted'}
                </button>
              </div>
            </div>
          ))}
        </>
      )}

      <style>{`.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
    </div>
  );
}
