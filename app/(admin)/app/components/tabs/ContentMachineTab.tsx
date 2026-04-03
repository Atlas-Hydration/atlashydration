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

// ─── PREMIUM CANVAS SLIDE ENGINE ───
const W = 1080, H = 1920;
const THUMB_W = 200, THUMB_H = 356;
const ACCENT = '#C8514A';

function wrapLines(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line + word + ' ';
    if (ctx.measureText(test).width > maxW && line) {
      lines.push(line.trim());
      line = word + ' ';
    } else { line = test; }
  }
  if (line.trim()) lines.push(line.trim());
  return lines;
}

function drawRotatedRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, angle: number, fill: string) {
  ctx.save();
  ctx.translate(x + w / 2, y + h / 2);
  ctx.rotate(angle * Math.PI / 180);
  ctx.fillStyle = fill;
  ctx.fillRect(-w / 2, -h / 2, w, h);
  ctx.restore();
}

function drawGrain(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(255,255,255,0.015)';
  for (let i = 0; i < 8000; i++) {
    ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
  }
}

function drawSlide(ctx: CanvasRenderingContext2D, slide: Slide) {
  const sn = String(slide.slide_number).padStart(2, '0');

  if (slide.type === 'hook') {
    // ── HOOK SLIDE ──
    // 1. Base fill
    ctx.fillStyle = '#0D0D0D';
    ctx.fillRect(0, 0, W, H);

    // 2. Radial glow
    const glow = ctx.createRadialGradient(540, 960, 0, 540, 960, 900);
    glow.addColorStop(0, 'rgba(200,81,74,0.25)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // 3. Geometric background rectangles
    drawRotatedRect(ctx, 650, 200, 600, 600, 35, 'rgba(200,81,74,0.06)');
    drawRotatedRect(ctx, -100, 1100, 500, 500, 20, 'rgba(200,81,74,0.04)');
    drawRotatedRect(ctx, 800, 1400, 300, 300, 45, 'rgba(255,255,255,0.02)');

    // 4. Thin horizontal accent line
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(80, 820);
    ctx.lineTo(200, 820);
    ctx.stroke();

    // 5. Headline — large, bold, left-aligned
    ctx.textAlign = 'left';
    ctx.font = '800 108px "DM Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    // Split into lines at ~18 chars
    const hookWords = slide.headline.split(' ');
    const hookLines: string[] = [];
    let hLine = '';
    for (const w of hookWords) {
      if ((hLine + w).length > 18 && hLine) { hookLines.push(hLine.trim()); hLine = w + ' '; }
      else { hLine += w + ' '; }
    }
    if (hLine.trim()) hookLines.push(hLine.trim());
    hookLines.slice(0, 2).forEach((l, i) => ctx.fillText(l, 80, 920 + i * 130));

    // 6. Atlas Hydration bottom
    ctx.textAlign = 'center';
    ctx.font = '400 32px "DM Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.35)';
    ctx.fillText('Atlas Hydration', 540, 1800);

    // 7. Noise grain
    drawGrain(ctx);

  } else if (slide.type === 'cta') {
    // ── CTA SLIDE ──
    // 1. Base fill
    ctx.fillStyle = '#0F0F0F';
    ctx.fillRect(0, 0, W, H);

    // 2. Radial glow
    const glow = ctx.createRadialGradient(540, 900, 0, 540, 900, 600);
    glow.addColorStop(0, 'rgba(200,81,74,0.2)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // 3. Abstract background circles
    ctx.lineWidth = 1;
    [[400, 'rgba(200,81,74,0.08)'], [300, 'rgba(200,81,74,0.12)'], [200, 'rgba(255,255,255,0.05)']].forEach(([r, c]) => {
      ctx.strokeStyle = c as string;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(540, 700, r as number, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.strokeStyle = 'rgba(200,81,74,0.05)';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.arc(540, 700, 500, 0, Math.PI * 2);
    ctx.stroke();

    // 4. ATLAS text — manually spaced letters
    ctx.textAlign = 'center';
    ctx.font = '800 120px "DM Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    const atlasLetters = 'ATLAS'.split('');
    const letterSpacing = 30;
    const totalW = atlasLetters.reduce((sum, l) => sum + ctx.measureText(l).width, 0) + letterSpacing * (atlasLetters.length - 1);
    let lx = 540 - totalW / 2;
    for (const letter of atlasLetters) {
      const lw = ctx.measureText(letter).width;
      ctx.fillText(letter, lx + lw / 2, 760);
      lx += lw + letterSpacing;
    }

    // 5. Thin accent line
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(440, 810);
    ctx.lineTo(640, 810);
    ctx.stroke();

    // 6. Headline
    ctx.font = '500 52px "DM Sans", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.85)';
    ctx.textAlign = 'center';
    ctx.fillText(slide.headline, 540, 920);

    // 7. Body
    ctx.font = '300 36px "DM Sans", sans-serif';
    ctx.fillStyle = '#666666';
    ctx.fillText('Zero Sugar Electrolytes', 540, 990);

    // 8. URL
    ctx.font = '400 32px "DM Mono", monospace';
    ctx.fillStyle = ACCENT;
    ctx.fillText('atlashydration.com', 540, 1100);

    // 9. Stat pills
    const pills = ['500mg K+', '200mg Mg', '600mg Na', '0g Sugar'];
    const pillW = 200, pillH = 70, pillR = 35, pillGap = 20;
    const totalPW = pills.length * pillW + (pills.length - 1) * pillGap;
    const psx = (W - totalPW) / 2;
    ctx.font = '500 26px "DM Sans", sans-serif';
    pills.forEach((p, i) => {
      const px = psx + i * (pillW + pillGap);
      ctx.fillStyle = 'rgba(255,255,255,0.05)';
      ctx.beginPath();
      ctx.roundRect(px, 1220, pillW, pillH, pillR);
      ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(px, 1220, pillW, pillH, pillR);
      ctx.stroke();
      ctx.fillStyle = '#888888';
      ctx.textAlign = 'center';
      ctx.fillText(p, px + pillW / 2, 1220 + 44);
    });

    drawGrain(ctx);

  } else {
    // ── CONTENT SLIDES (2-7) ──
    const isLight = slide.slide_number % 2 === 0;

    // Colors
    const bg = isLight ? '#F5F2EE' : '#161820';
    const blockFill = isLight ? 'rgba(200,81,74,0.08)' : 'rgba(200,81,74,0.12)';
    const bigNumColor = isLight ? 'rgba(0,0,0,0.04)' : 'rgba(255,255,255,0.03)';
    const headColor = isLight ? '#111111' : '#F0EDE8';
    const bodyColor = isLight ? '#777777' : '#666666';
    const counterColor = isLight ? '#BBBBBB' : '#444444';
    const wordmarkColor = isLight ? '#CCCCCC' : '#333333';

    // 1. Base fill
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // 2. Left color block
    ctx.fillStyle = blockFill;
    ctx.fillRect(0, 0, 180, H);

    // 3. Vertical accent bar
    ctx.fillStyle = ACCENT;
    ctx.fillRect(0, 280, 6, 900);

    // 4. Massive background number
    ctx.textAlign = 'right';
    ctx.font = '900 520px "DM Sans", sans-serif';
    ctx.fillStyle = bigNumColor;
    ctx.fillText(sn, 1020, 1700);

    // 5. Top decorative line cluster
    ctx.strokeStyle = ACCENT;
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(220, 240); ctx.lineTo(320, 240); ctx.stroke();
    ctx.strokeStyle = 'rgba(200,81,74,0.4)';
    ctx.beginPath(); ctx.moveTo(220, 252); ctx.lineTo(280, 252); ctx.stroke();
    ctx.strokeStyle = 'rgba(200,81,74,0.2)';
    ctx.beginPath(); ctx.moveTo(220, 264); ctx.lineTo(250, 264); ctx.stroke();

    // 6. Slide counter top-right
    ctx.textAlign = 'right';
    ctx.font = '400 28px "DM Mono", monospace';
    ctx.fillStyle = counterColor;
    ctx.fillText(`${sn} / 08`, 1000, 100);

    // 7. Headline
    ctx.textAlign = 'left';
    ctx.font = '700 88px "DM Sans", sans-serif';
    ctx.fillStyle = headColor;
    const headLines = wrapLines(ctx, slide.headline, 820);
    let hy = 680;
    headLines.forEach(l => { ctx.fillText(l, 220, hy); hy += 106; });

    // 8. Body text
    ctx.font = '300 40px "DM Sans", sans-serif';
    ctx.fillStyle = bodyColor;
    const bodyLines = wrapLines(ctx, slide.body, 820);
    let by = hy + 40;
    bodyLines.forEach(l => { ctx.fillText(l, 220, by); by += 64; });

    // 9. Atlas wordmark bottom-left
    ctx.font = '600 30px "DM Sans", sans-serif';
    ctx.fillStyle = wordmarkColor;
    ctx.fillText('Atlas', 220, 1840);
  }
}

// ─── RENDER FULL-RES SLIDE TO OFFSCREEN CANVAS ───
function renderFullSlide(slide: Slide): HTMLCanvasElement {
  const c = document.createElement('canvas');
  const dpr = 2;
  c.width = W * dpr;
  c.height = H * dpr;
  const ctx = c.getContext('2d')!;
  ctx.scale(dpr, dpr);
  drawSlide(ctx, slide);
  return c;
}

// ─── SLIDE THUMBNAIL — renders full-res then scales via drawImage ───
function SlidePreview({ slide, onClick }: { slide: Slide; onClick: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    if (!ctx) return;
    const dpr = 2;
    c.width = THUMB_W * dpr;
    c.height = THUMB_H * dpr;
    ctx.scale(dpr, dpr);
    const full = renderFullSlide(slide);
    ctx.drawImage(full, 0, 0, full.width, full.height, 0, 0, THUMB_W, THUMB_H);
  }, [slide]);

  return (
    <canvas ref={canvasRef} onClick={onClick} style={{
      width: THUMB_W, height: THUMB_H,
      borderRadius: 8, flexShrink: 0, cursor: 'pointer',
      border: '1px solid #272727', transition: 'transform 0.15s, border-color 0.15s',
    }} onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.transform = 'scale(1.03)'; }}
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
    const full = renderFullSlide(slide);
    c.width = full.width; c.height = full.height;
    ctx.drawImage(full, 0, 0);
  }, [slide]);
  if (!slide) return null;
  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      overflow: 'auto', padding: 40,
    }}>
      <canvas ref={canvasRef} style={{
        width: W * 0.5, height: H * 0.5, borderRadius: 12,
        boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
      }} onClick={e => e.stopPropagation()} />
    </div>
  );
}

// ─── EXPORT ───
async function exportSlide(slide: Slide, topic: string, deckNum: number, slideNum: number): Promise<void> {
  await document.fonts.ready;
  const c = renderFullSlide(slide);
  const dataUrl = c.toDataURL('image/jpeg', 0.95);
  const a = document.createElement('a');
  const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
  a.href = dataUrl;
  a.download = `atlas-${slug}-${String(deckNum).padStart(2, '0')}-slide-${String(slideNum).padStart(2, '0')}.jpg`;
  a.click();
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
