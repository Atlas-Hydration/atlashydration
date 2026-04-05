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
const DOMAIN = 'atlas-hydration.com';

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

function drawGrain(ctx: CanvasRenderingContext2D, count = 6000) {
  for (let i = 0; i < count; i++) {
    const a = 0.01 + Math.random() * 0.02;
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fillRect(Math.random() * W, Math.random() * H, 1, 1);
  }
}

function drawSlide(ctx: CanvasRenderingContext2D, slide: Slide) {
  const sn = String(slide.slide_number).padStart(2, '0');

  if (slide.type === 'hook') {
    // ── HOOK SLIDE ──
    ctx.fillStyle = '#080810';
    ctx.fillRect(0, 0, W, H);

    // Large radial glow
    const glow = ctx.createRadialGradient(540, 800, 0, 540, 800, 900);
    glow.addColorStop(0, 'rgba(200,81,74,0.22)');
    glow.addColorStop(0.5, 'rgba(200,81,74,0.06)');
    glow.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Background geometric shapes
    drawRotatedRect(ctx, 600, 100, 700, 700, 35, 'rgba(200,81,74,0.05)');
    drawRotatedRect(ctx, -150, 1000, 550, 550, 20, 'rgba(200,81,74,0.035)');
    drawRotatedRect(ctx, 750, 1350, 400, 400, -15, 'rgba(255,255,255,0.015)');

    // Accent line
    ctx.fillStyle = ACCENT;
    ctx.fillRect(80, 700, 80, 3);

    // Headline
    ctx.textAlign = 'left';
    ctx.font = '800 96px "DM Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    const hookLines = wrapLines(ctx, slide.headline, W - 160);
    hookLines.slice(0, 3).forEach((l, i) => ctx.fillText(l, 80, 810 + i * 120));

    // Subtle bottom bar
    ctx.fillStyle = 'rgba(200,81,74,0.15)';
    ctx.fillRect(0, H - 200, W, 200);

    // Brand lockup bottom
    ctx.textAlign = 'left';
    ctx.font = '700 28px "DM Sans", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText('Atlas Hydration', 80, H - 80);

    ctx.textAlign = 'right';
    ctx.font = '400 24px "DM Mono", monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText(DOMAIN, W - 80, H - 80);

    drawGrain(ctx);

  } else if (slide.type === 'cta') {
    // ── CTA SLIDE ──
    ctx.fillStyle = '#0A0A0E';
    ctx.fillRect(0, 0, W, H);

    // Radial glow
    const glow = ctx.createRadialGradient(540, 750, 0, 540, 750, 650);
    glow.addColorStop(0, 'rgba(200,81,74,0.18)');
    glow.addColorStop(1, 'transparent');
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, W, H);

    // Concentric circles
    [500, 380, 260, 160].forEach((r, i) => {
      ctx.strokeStyle = `rgba(200,81,74,${0.04 + i * 0.025})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(540, 700, r, 0, Math.PI * 2);
      ctx.stroke();
    });

    // ATLAS text with letter spacing
    ctx.textAlign = 'center';
    ctx.font = '800 110px "DM Sans", sans-serif';
    ctx.fillStyle = '#FFFFFF';
    const letters = 'ATLAS'.split('');
    const sp = 28;
    const tw = letters.reduce((s, l) => s + ctx.measureText(l).width, 0) + sp * 4;
    let lx = 540 - tw / 2;
    for (const letter of letters) {
      const lw = ctx.measureText(letter).width;
      ctx.fillText(letter, lx + lw / 2, 720);
      lx += lw + sp;
    }

    // Accent line
    ctx.fillStyle = ACCENT;
    ctx.fillRect(540 - 40, 780, 80, 2.5);

    // Headline
    ctx.font = '500 48px "DM Sans", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.9)';
    ctx.fillText(slide.headline, 540, 880);

    // Subtitle
    ctx.font = '300 32px "DM Sans", sans-serif';
    ctx.fillStyle = '#777';
    ctx.fillText('Zero Sugar Electrolytes', 540, 950);

    // URL
    ctx.font = '400 30px "DM Mono", monospace';
    ctx.fillStyle = ACCENT;
    ctx.fillText(DOMAIN, 540, 1060);

    // Stat pills
    const pills = ['500mg K+', '200mg Mg', '600mg Na', '0g Sugar'];
    const pw = 195, ph = 64, pr = 32, pg = 16;
    const tpw = pills.length * pw + (pills.length - 1) * pg;
    const psx = (W - tpw) / 2;
    ctx.font = '500 24px "DM Sans", sans-serif';
    pills.forEach((p, i) => {
      const px = psx + i * (pw + pg);
      ctx.fillStyle = 'rgba(255,255,255,0.04)';
      ctx.beginPath(); ctx.roundRect(px, 1180, pw, ph, pr); ctx.fill();
      ctx.strokeStyle = 'rgba(255,255,255,0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.roundRect(px, 1180, pw, ph, pr); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.textAlign = 'center';
      ctx.fillText(p, px + pw / 2, 1180 + 40);
    });

    // Bottom tagline
    ctx.font = '300 26px "DM Sans", sans-serif';
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.textAlign = 'center';
    ctx.fillText('Electrolytes. Vitamins. Zero Sugar.', 540, H - 100);

    drawGrain(ctx);

  } else {
    // ── CONTENT SLIDES (2-7) ──
    const isLight = slide.slide_number % 2 === 0;
    const bg = isLight ? '#F4F1EC' : '#111318';
    const blockFill = isLight ? 'rgba(200,81,74,0.06)' : 'rgba(200,81,74,0.10)';
    const bigNumColor = isLight ? 'rgba(0,0,0,0.035)' : 'rgba(255,255,255,0.025)';
    const headColor = isLight ? '#141414' : '#F0EDE8';
    const bodyColor = isLight ? '#6B6B6B' : '#777';
    const counterColor = isLight ? '#C0C0C0' : '#3A3A3A';
    const wordmarkColor = isLight ? '#D0D0D0' : '#2A2A2A';
    const accentBar = isLight ? ACCENT : '#D4604F';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Left color block
    ctx.fillStyle = blockFill;
    ctx.fillRect(0, 0, 160, H);

    // Accent bar
    ctx.fillStyle = accentBar;
    ctx.fillRect(0, 250, 6, 950);

    // Background number
    ctx.textAlign = 'right';
    ctx.font = '900 500px "DM Sans", sans-serif';
    ctx.fillStyle = bigNumColor;
    ctx.fillText(sn, 1020, 1680);

    // Line cluster
    ctx.strokeStyle = accentBar;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(200, 230); ctx.lineTo(320, 230); ctx.stroke();
    ctx.globalAlpha = 0.5;
    ctx.beginPath(); ctx.moveTo(200, 244); ctx.lineTo(270, 244); ctx.stroke();
    ctx.globalAlpha = 0.25;
    ctx.beginPath(); ctx.moveTo(200, 258); ctx.lineTo(240, 258); ctx.stroke();
    ctx.globalAlpha = 1;

    // Counter
    ctx.textAlign = 'right';
    ctx.font = '400 26px "DM Mono", monospace';
    ctx.fillStyle = counterColor;
    ctx.fillText(`${sn} / 08`, 1000, 100);

    // Headline
    ctx.textAlign = 'left';
    ctx.font = '700 82px "DM Sans", sans-serif';
    ctx.fillStyle = headColor;
    const hl = wrapLines(ctx, slide.headline, 780);
    let hy = 640;
    hl.forEach(l => { ctx.fillText(l, 200, hy); hy += 100; });

    // Body
    ctx.font = '300 38px "DM Sans", sans-serif';
    ctx.fillStyle = bodyColor;
    const bl = wrapLines(ctx, slide.body, 780);
    let by = hy + 40;
    bl.forEach(l => { ctx.fillText(l, 200, by); by += 60; });

    // Bottom brand bar
    ctx.fillStyle = isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.015)';
    ctx.fillRect(0, H - 160, W, 160);

    ctx.font = '600 28px "DM Sans", sans-serif';
    ctx.fillStyle = wordmarkColor;
    ctx.textAlign = 'left';
    ctx.fillText('Atlas Hydration', 200, H - 70);

    ctx.font = '400 22px "DM Mono", monospace';
    ctx.textAlign = 'right';
    ctx.fillText(DOMAIN, 1000, H - 72);
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
function SlidePreview({ slide, onClick, topic, deckNum, slideNum }: {
  slide: Slide; onClick: () => void; topic: string; deckNum: number; slideNum: number;
}) {
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
    <div style={{ position: 'relative', flexShrink: 0 }}>
      <canvas ref={canvasRef} onClick={onClick} style={{
        width: THUMB_W, height: THUMB_H, display: 'block',
        borderRadius: 8, cursor: 'pointer',
        border: '1px solid #272727', transition: 'transform 0.15s, border-color 0.15s',
      }} onMouseEnter={e => { e.currentTarget.style.borderColor = ACCENT; e.currentTarget.style.transform = 'scale(1.03)'; }}
         onMouseLeave={e => { e.currentTarget.style.borderColor = '#272727'; e.currentTarget.style.transform = 'scale(1)'; }} />
      <button
        onClick={async (e) => { e.stopPropagation(); await exportSlide(slide, topic, deckNum, slideNum); }}
        title={`Download slide ${slideNum}`}
        style={{
          position: 'absolute', bottom: 6, right: 6, width: 28, height: 28,
          borderRadius: 6, border: 'none', cursor: 'pointer',
          background: 'rgba(0,0,0,0.6)', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: 0.7, transition: 'opacity 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '1'; }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '0.7'; }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>
    </div>
  );
}

// ─── FULL-SIZE MODAL ───
function SlideModal({ slide, onClose, topic, deckNum, slideNum }: {
  slide: Slide | null; onClose: () => void; topic: string; deckNum: number; slideNum: number;
}) {
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
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      cursor: 'pointer', overflow: 'auto', padding: 20, gap: 16,
    }}>
      <canvas ref={canvasRef} style={{
        width: Math.min(W * 0.5, window.innerWidth - 40),
        height: 'auto', aspectRatio: `${W}/${H}`,
        borderRadius: 12, boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
      }} onClick={e => e.stopPropagation()} />
      <button
        onClick={async (e) => { e.stopPropagation(); await exportSlide(slide, topic, deckNum, slideNum); }}
        style={{
          padding: '10px 24px', borderRadius: 8, border: 'none',
          background: ACCENT, color: '#fff', fontWeight: 600, fontSize: '0.85rem',
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >Download This Slide</button>
    </div>
  );
}

// ─── EXPORT ───
function slideFilename(topic: string, deckNum: number, slideNum: number): string {
  const slug = topic.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 30);
  return `atlas-${slug}-${String(deckNum).padStart(2, '0')}-slide-${String(slideNum).padStart(2, '0')}.jpg`;
}

async function exportSlide(slide: Slide, topic: string, deckNum: number, slideNum: number): Promise<void> {
  await document.fonts.ready;
  const c = renderFullSlide(slide);
  const filename = slideFilename(topic, deckNum, slideNum);

  return new Promise<void>((resolve) => {
    c.toBlob(async (blob) => {
      if (!blob) { resolve(); return; }

      // Try Web Share API first (mobile — saves to Photos/share sheet)
      if (navigator.share && navigator.canShare) {
        try {
          const file = new File([blob], filename, { type: 'image/jpeg' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({ files: [file] });
            resolve();
            return;
          }
        } catch {
          // User cancelled or share failed — fall through to download
        }
      }

      // Fallback: blob URL download
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      setTimeout(() => { document.body.removeChild(a); URL.revokeObjectURL(url); resolve(); }, 150);
    }, 'image/jpeg', 0.95);
  });
}

// ─── MAIN COMPONENT ───
export default function ContentMachineTab() {
  const [generating, setGenerating] = useState(false);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [error, setError] = useState('');
  const [exportProgress, setExportProgress] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [lastGenerated, setLastGenerated] = useState('');
  const [focusTopics, setFocusTopics] = useState<string[]>(TOPIC_CATEGORIES.slice(0, 5));
  const [modalSlide, setModalSlide] = useState<{ slide: Slide; topic: string; deckNum: number; slideNum: number } | null>(null);
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
    setDownloading(true);
    for (let d = 0; d < decks.length; d++) {
      for (let s = 0; s < decks[d].slides.length; s++) {
        if (cancelRef.current) { setExportProgress(''); setDownloading(false); return; }
        setExportProgress(`Downloading slide ${s + 1} of 8 (Deck ${d + 1}/${decks.length})`);
        await exportSlide(decks[d].slides[s], decks[d].topic, d + 1, s + 1);
        await new Promise(r => setTimeout(r, 300));
      }
    }
    setExportProgress('');
    setDownloading(false);
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
      <SlideModal
        slide={modalSlide?.slide ?? null}
        topic={modalSlide?.topic ?? ''}
        deckNum={modalSlide?.deckNum ?? 0}
        slideNum={modalSlide?.slideNum ?? 0}
        onClose={() => setModalSlide(null)}
      />

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
              <button style={{ ...ghost, opacity: downloading ? 0.5 : 1, cursor: downloading ? 'wait' : 'pointer' }} disabled={downloading} onClick={handleExportAll}>{downloading ? exportProgress : `Download All (${decks.length * 8} slides)`}</button>
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
                  <SlidePreview key={si} slide={slide} topic={deck.topic} deckNum={di + 1} slideNum={si + 1}
                    onClick={() => setModalSlide({ slide, topic: deck.topic, deckNum: di + 1, slideNum: si + 1 })} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
                <button style={{ ...ghost, opacity: downloading ? 0.5 : 1, cursor: downloading ? 'wait' : 'pointer' }} disabled={downloading} onClick={async () => {
                  setDownloading(true);
                  for (let s = 0; s < deck.slides.length; s++) {
                    setExportProgress(`Downloading slide ${s + 1} of 8...`);
                    await exportSlide(deck.slides[s], deck.topic, di + 1, s + 1);
                    await new Promise(r => setTimeout(r, 300));
                  }
                  setExportProgress('');
                  setDownloading(false);
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
