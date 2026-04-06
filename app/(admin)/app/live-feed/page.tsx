'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

/* ── Event icons (SVG) ── */
type EventIconProps = { color: string; size?: number };
const EventIcon = {
  eye: ({ color, size = 18 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
  ),
  cart: ({ color, size = 18 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  ),
  card: ({ color, size = 18 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  check: ({ color, size = 18 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  mail: ({ color, size = 18 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  rocket: ({ color, size = 18 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" /><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  sparkle: ({ color, size = 18 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  activity: ({ color, size = 18 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

/* ── Device icons ── */
const DeviceIcon = {
  desktop: ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  ),
  mobile: ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  tablet: ({ size = 14 }: { size?: number }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
};

function getDeviceIcon(device: string) {
  const d = (device || '').toLowerCase();
  if (d === 'mobile') return <DeviceIcon.mobile />;
  if (d === 'tablet') return <DeviceIcon.tablet />;
  return <DeviceIcon.desktop />;
}

/* ── Country flag emoji ── */
const COUNTRY_TO_CODE: Record<string, string> = {
  'United States': 'US', 'United Kingdom': 'GB', 'Canada': 'CA', 'Australia': 'AU',
  'Germany': 'DE', 'France': 'FR', 'Japan': 'JP', 'India': 'IN', 'Brazil': 'BR',
  'Mexico': 'MX', 'Spain': 'ES', 'Italy': 'IT', 'Netherlands': 'NL', 'Sweden': 'SE',
  'Norway': 'NO', 'Denmark': 'DK', 'Finland': 'FI', 'Poland': 'PL', 'Switzerland': 'CH',
  'Belgium': 'BE', 'Austria': 'AT', 'Portugal': 'PT', 'Ireland': 'IE', 'New Zealand': 'NZ',
  'South Korea': 'KR', 'China': 'CN', 'Russia': 'RU', 'Argentina': 'AR', 'Colombia': 'CO',
  'Chile': 'CL', 'Peru': 'PE', 'South Africa': 'ZA', 'Nigeria': 'NG', 'Egypt': 'EG',
  'Israel': 'IL', 'Turkey': 'TR', 'Saudi Arabia': 'SA', 'United Arab Emirates': 'AE',
  'Thailand': 'TH', 'Indonesia': 'ID', 'Philippines': 'PH', 'Vietnam': 'VN',
  'Malaysia': 'MY', 'Singapore': 'SG', 'Taiwan': 'TW', 'Hong Kong': 'HK',
  'Czech Republic': 'CZ', 'Czechia': 'CZ', 'Romania': 'RO', 'Hungary': 'HU',
  'Greece': 'GR', 'Ukraine': 'UA', 'Croatia': 'HR', 'Slovakia': 'SK',
  'Bulgaria': 'BG', 'Serbia': 'RS', 'Lithuania': 'LT', 'Latvia': 'LV', 'Estonia': 'EE',
  'Slovenia': 'SI', 'Iceland': 'IS', 'Luxembourg': 'LU', 'Malta': 'MT', 'Cyprus': 'CY',
  'Pakistan': 'PK', 'Bangladesh': 'BD', 'Sri Lanka': 'LK', 'Nepal': 'NP',
  'Kenya': 'KE', 'Ghana': 'GH', 'Morocco': 'MA', 'Tunisia': 'TN', 'Algeria': 'DZ',
  'Costa Rica': 'CR', 'Panama': 'PA', 'Ecuador': 'EC', 'Uruguay': 'UY', 'Paraguay': 'PY',
  'Bolivia': 'BO', 'Venezuela': 'VE', 'Dominican Republic': 'DO', 'Guatemala': 'GT',
  'Jamaica': 'JM', 'Puerto Rico': 'PR', 'Cuba': 'CU',
};

function countryFlag(country: string): string {
  const code = COUNTRY_TO_CODE[country];
  if (!code) return '';
  return String.fromCodePoint(
    ...code.split('').map(c => 0x1F1E6 + c.charCodeAt(0) - 65)
  );
}

/* ── Event labels ── */
const EVENT_LABELS: Record<string, { label: string; Icon: (p: EventIconProps) => React.JSX.Element; color: string }> = {
  'page_view': { label: 'viewed a page', Icon: EventIcon.eye, color: '#3b82f6' },
  'add_to_cart': { label: 'added to cart', Icon: EventIcon.cart, color: '#f59e0b' },
  'begin_checkout': { label: 'started checkout', Icon: EventIcon.card, color: '#8b5cf6' },
  'purchase': { label: 'completed a purchase', Icon: EventIcon.check, color: '#22c55e' },
  'sign_up': { label: 'signed up', Icon: EventIcon.mail, color: '#ec4899' },
  'session_start': { label: 'started a session', Icon: EventIcon.rocket, color: '#3b82f6' },
  'first_visit': { label: 'visited for the first time', Icon: EventIcon.sparkle, color: '#22c55e' },
  'form_start': { label: 'started a form', Icon: EventIcon.card, color: '#8b5cf6' },
};

function formatMinutesAgo(minutes: number): string {
  if (!minutes || minutes <= 0) return 'just now';
  if (minutes === 1) return '1 min ago';
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '~1 hour ago';
  return `~${hours} hours ago`;
}

/* ── Time grouping ── */
type TimeBucket = 'Just now' | 'A few minutes ago' | '10-20 minutes ago' | '20-30 minutes ago' | 'Earlier today';
function getTimeBucket(minutesAgo: number): TimeBucket {
  if (minutesAgo <= 2) return 'Just now';
  if (minutesAgo <= 10) return 'A few minutes ago';
  if (minutesAgo <= 20) return '10-20 minutes ago';
  if (minutesAgo <= 30) return '20-30 minutes ago';
  return 'Earlier today';
}

/* ── Event key for tracking ── */
function eventKey(e: EventRow): string {
  return `${e.event}|${e.city}|${e.country}|${e.minutesAgo}|${e.page}|${e.device}|${e.count}`;
}

/* ── Sound generation via Web Audio API ── */
function playChime() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.1);
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);
    setTimeout(() => ctx.close(), 500);
  } catch {
    // Web Audio not available
  }
}

interface EventRow {
  event: string;
  city: string;
  country: string;
  count: number;
  minutesAgo?: number;
  page?: string;
  device?: string;
}

interface SourceRow {
  source: string;
  activeUsers: number;
}

interface RevenueData {
  total: number;
  orders: number;
  avgOrderValue: number;
}

/* ── WebGL starfield ── */
function initStarfield(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl', { alpha: true, antialias: true });
  if (!gl) return null;

  const STAR_COUNT = 1800;
  const positions = new Float32Array(STAR_COUNT * 3);
  const sizes = new Float32Array(STAR_COUNT);
  const speeds = new Float32Array(STAR_COUNT);
  const colors = new Float32Array(STAR_COUNT * 3);
  const twinkle = new Float32Array(STAR_COUNT);

  for (let i = 0; i < STAR_COUNT; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 4;
    positions[i * 3 + 2] = Math.random() * 3;
    sizes[i] = Math.random() * 3 + 0.5;
    speeds[i] = Math.random() * 0.3 + 0.05;
    twinkle[i] = Math.random() * Math.PI * 2;
    const colorType = Math.random();
    if (colorType < 0.4) {
      colors[i * 3] = 0.85; colors[i * 3 + 1] = 0.9; colors[i * 3 + 2] = 1.0;
    } else if (colorType < 0.7) {
      colors[i * 3] = 0.6; colors[i * 3 + 1] = 0.75; colors[i * 3 + 2] = 1.0;
    } else if (colorType < 0.85) {
      colors[i * 3] = 1.0; colors[i * 3 + 1] = 0.85; colors[i * 3 + 2] = 0.7;
    } else {
      colors[i * 3] = 0.9; colors[i * 3 + 1] = 0.7; colors[i * 3 + 2] = 1.0;
    }
  }

  const vsrc = `
    attribute vec3 aPos;
    attribute float aSize;
    attribute float aSpeed;
    attribute vec3 aColor;
    attribute float aTwinkle;
    uniform float uTime;
    uniform vec2 uRes;
    varying float vAlpha;
    varying vec3 vColor;
    void main() {
      float z = mod(aPos.z + uTime * aSpeed, 3.0);
      float depth = 1.0 / (z + 0.5);
      float x = aPos.x * depth;
      float y = aPos.y * depth * (uRes.x / uRes.y);
      gl_Position = vec4(x, y, 0.0, 1.0);
      gl_PointSize = aSize * depth * min(uRes.x, uRes.y) / 800.0;
      vAlpha = (1.0 - z / 3.0) * (0.5 + 0.5 * sin(uTime * 1.5 + aTwinkle));
      vColor = aColor;
    }
  `;
  const fsrc = `
    precision mediump float;
    varying float vAlpha;
    varying vec3 vColor;
    void main() {
      float d = length(gl_PointCoord - 0.5) * 2.0;
      float glow = exp(-d * d * 3.0);
      gl_FragColor = vec4(vColor, vAlpha * glow);
    }
  `;

  function compile(type: number, src: string) {
    const s = gl!.createShader(type)!;
    gl!.shaderSource(s, src);
    gl!.compileShader(s);
    return s;
  }

  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vsrc));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, fsrc));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  function buf(attr: string, data: Float32Array, size: number) {
    const b = gl!.createBuffer();
    gl!.bindBuffer(gl!.ARRAY_BUFFER, b);
    gl!.bufferData(gl!.ARRAY_BUFFER, data, gl!.STATIC_DRAW);
    const loc = gl!.getAttribLocation(prog, attr);
    gl!.enableVertexAttribArray(loc);
    gl!.vertexAttribPointer(loc, size, gl!.FLOAT, false, 0, 0);
  }

  buf('aPos', positions, 3);
  buf('aSize', sizes, 1);
  buf('aSpeed', speeds, 1);
  buf('aColor', colors, 3);
  buf('aTwinkle', twinkle, 1);

  const uTime = gl.getUniformLocation(prog, 'uTime');
  const uRes = gl.getUniformLocation(prog, 'uRes');

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  let raf = 0;
  const start = performance.now();

  function frame() {
    const t = (performance.now() - start) / 1000;
    canvas.width = canvas.clientWidth * devicePixelRatio;
    canvas.height = canvas.clientHeight * devicePixelRatio;
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.clearColor(0, 0, 0, 0);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.uniform1f(uTime, t);
    gl!.uniform2f(uRes, canvas.width, canvas.height);
    gl!.drawArrays(gl!.POINTS, 0, STAR_COUNT);
    raf = requestAnimationFrame(frame);
  }
  frame();

  return () => cancelAnimationFrame(raf);
}

export default function LiveFeedPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  const [error, setError] = useState('');
  const [sources, setSources] = useState<SourceRow[]>([]);
  const [revenue, setRevenue] = useState<RevenueData>({ total: 0, orders: 0, avgOrderValue: 0 });
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [revenueBanner, setRevenueBanner] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Running totals (accumulated across refreshes)
  const [totals, setTotals] = useState({ pageViews: 0, sessions: 0, addToCart: 0, purchases: 0 });

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const seenEventKeysRef = useRef<Set<string>>(new Set());
  const prevEventKeysRef = useRef<Set<string>>(new Set());
  const newEventKeysRef = useRef<Set<string>>(new Set());
  const soundPlayedKeysRef = useRef<Set<string>>(new Set());
  const lastRevenueRef = useRef<number>(0);
  const revenueBannerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/analytics?period=realtime&t=${Date.now()}`, { cache: 'no-store' });
      const json = await res.json();
      if (json.error) { setError(json.error); return; }

      const newEvents: EventRow[] = json.events || [];
      setSources(json.sources || []);
      setRevenue(json.revenue || { total: 0, orders: 0, avgOrderValue: 0 });

      // Track new event keys for animation
      const currentKeys = new Set(newEvents.map(eventKey));
      const freshKeys = new Set<string>();
      currentKeys.forEach(k => {
        if (!prevEventKeysRef.current.has(k)) freshKeys.add(k);
      });
      newEventKeysRef.current = freshKeys;
      prevEventKeysRef.current = currentKeys;

      // Accumulate running totals (only count events not seen before)
      let addPV = 0, addSess = 0, addATC = 0, addPurch = 0;
      for (const e of newEvents) {
        const k = eventKey(e);
        if (!seenEventKeysRef.current.has(k)) {
          seenEventKeysRef.current.add(k);
          const cnt = e.count || 1;
          if (e.event === 'page_view') addPV += cnt;
          if (e.event === 'session_start') addSess += cnt;
          if (e.event === 'add_to_cart') addATC += cnt;
          if (e.event === 'purchase') addPurch += cnt;
        }
      }
      if (addPV || addSess || addATC || addPurch) {
        setTotals(prev => ({
          pageViews: prev.pageViews + addPV,
          sessions: prev.sessions + addSess,
          addToCart: prev.addToCart + addATC,
          purchases: prev.purchases + addPurch,
        }));
      }

      // Revenue flash detection
      const newRevTotal = json.revenue?.total || 0;
      if (newRevTotal > 0 && newRevTotal > lastRevenueRef.current) {
        const hasPurchaseEvent = newEvents.some((ev: EventRow) => ev.event === 'purchase');
        if (hasPurchaseEvent) {
          setRevenueBanner(`New sale! $${newRevTotal.toFixed(2)}`);
          if (revenueBannerTimerRef.current) clearTimeout(revenueBannerTimerRef.current);
          revenueBannerTimerRef.current = setTimeout(() => setRevenueBanner(null), 10000);
        }
      }
      lastRevenueRef.current = newRevTotal;

      // Sound notifications for purchase/add_to_cart
      if (soundEnabled) {
        for (const e of newEvents) {
          if ((e.event === 'purchase' || e.event === 'add_to_cart')) {
            const k = eventKey(e);
            if (!soundPlayedKeysRef.current.has(k)) {
              soundPlayedKeysRef.current.add(k);
              playChime();
              break; // only play once per fetch
            }
          }
        }
      }

      setEvents(newEvents);
      setActiveUsers(json.activeUsers || 0);
      setLastUpdated(new Date().toLocaleTimeString());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    }
  }, [soundEnabled]);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 10000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetchData]);

  // WebGL starfield
  useEffect(() => {
    if (canvasRef.current) {
      return initStarfield(canvasRef.current) ?? undefined;
    }
  }, []);

  const filtered = events.filter((e) => !['scroll', 'user_engagement'].includes(e.event));

  // Group events by time bucket
  const bucketOrder: TimeBucket[] = ['Just now', 'A few minutes ago', '10-20 minutes ago', '20-30 minutes ago', 'Earlier today'];
  const groupedEvents: { bucket: TimeBucket; events: EventRow[] }[] = [];
  const bucketMap = new Map<TimeBucket, EventRow[]>();
  for (const e of filtered) {
    const bucket = getTimeBucket(e.minutesAgo ?? 0);
    if (!bucketMap.has(bucket)) bucketMap.set(bucket, []);
    bucketMap.get(bucket)!.push(e);
  }
  for (const bucket of bucketOrder) {
    const evts = bucketMap.get(bucket);
    if (evts && evts.length > 0) {
      groupedEvents.push({ bucket, events: evts });
    }
  }

  const topSource = sources.length > 0 ? sources[0].source : null;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0e1a',
      color: '#e5e7eb',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: 0,
      position: 'relative',
    }}>
      {/* WebGL starfield background */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          zIndex: 0, pointerEvents: 'none',
        }}
      />
      {/* Revenue flash banner */}
      {revenueBanner && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          background: 'linear-gradient(90deg, rgba(22,101,52,0.95), rgba(21,128,61,0.95))',
          color: '#fff', textAlign: 'center',
          padding: '12px 24px', fontSize: '0.95rem', fontWeight: 700,
          animation: 'slideDown 0.3s ease-out',
        }}>
          {'💰'} {revenueBanner}
        </div>
      )}

      {/* Header bar */}
      <div style={{
        position: 'sticky', top: revenueBanner ? 44 : 0, zIndex: 10,
        background: 'rgba(10,14,26,0.85)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="Atlas" style={{ height: 22, width: 'auto', opacity: 0.9 }} />
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#22c55e',
            animation: 'pulse 2s infinite',
            boxShadow: '0 0 8px rgba(34,197,94,0.6)',
          }} />
          <span style={{ fontWeight: 700, fontSize: '1rem' }}>Live Event Feed</span>
          <span style={{
            fontSize: '0.75rem', fontWeight: 600,
            background: 'rgba(59,130,246,0.15)', color: '#60a5fa',
            padding: '3px 10px', borderRadius: 10,
          }}>
            {activeUsers} active {activeUsers === 1 ? 'user' : 'users'}
          </span>
          {topSource && (
            <span style={{
              fontSize: '0.7rem', color: '#9ca3af',
              background: 'rgba(255,255,255,0.05)', padding: '3px 8px', borderRadius: 6,
            }}>
              via {topSource}
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.75rem', color: '#6b7280' }}>
          {error && <span style={{ color: '#ef4444' }}>{error}</span>}
          {lastUpdated && <span>Updated {lastUpdated}</span>}
          {/* Sound toggle */}
          <button
            onClick={() => setSoundEnabled(prev => !prev)}
            title={soundEnabled ? 'Mute notifications' : 'Enable sound notifications'}
            style={{
              background: soundEnabled ? 'rgba(34,197,94,0.15)' : 'rgba(255,255,255,0.04)',
              border: soundEnabled ? '1px solid rgba(34,197,94,0.3)' : '1px solid rgba(255,255,255,0.08)',
              borderRadius: 6, padding: '4px 8px', cursor: 'pointer',
              display: 'inline-flex', alignItems: 'center', gap: 4,
              color: soundEnabled ? '#22c55e' : '#6b7280', fontSize: '0.75rem',
            }}
          >
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              {soundEnabled ? (
                <>
                  <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                  <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                </>
              ) : (
                <line x1="23" y1="9" x2="17" y2="15" />
              )}
            </svg>
          </button>
          <span style={{
            background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: 6,
          }}>
            Auto-refresh 10s
          </span>
        </div>
      </div>

      {/* Running totals bar */}
      <div style={{
        position: 'sticky', top: revenueBanner ? 100 : 56, zIndex: 9,
        background: 'rgba(10,14,26,0.9)', backdropFilter: 'blur(8px)',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        padding: '8px 24px',
        display: 'flex', alignItems: 'center', gap: 20,
        fontSize: '0.75rem',
      }}>
        <TotalPill label="Page Views" count={totals.pageViews} color="#3b82f6" />
        <TotalPill label="Sessions" count={totals.sessions} color="#8b5cf6" />
        <TotalPill label="Add to Cart" count={totals.addToCart} color="#f59e0b" />
        <TotalPill label="Purchases" count={totals.purchases} color="#22c55e" />
      </div>

      {/* Events list */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 0, position: 'relative', zIndex: 1 }}>
        {filtered.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: 60, color: '#6b7280', fontSize: '0.85rem' }}>
            Waiting for events...
          </div>
        )}
        {groupedEvents.map(({ bucket, events: bucketEvents }) => (
          <div key={bucket}>
            {/* Time bucket divider */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12,
              padding: '16px 0 8px 0',
            }}>
              <span style={{
                fontSize: '0.7rem', fontWeight: 600, color: '#4b5563',
                textTransform: 'uppercase', letterSpacing: '0.05em',
              }}>
                {bucket}
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.04)' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {bucketEvents.map((e, i) => {
                const info = EVENT_LABELS[e.event] || { label: e.event, Icon: EventIcon.activity, color: '#6b7280' };
                const flag = countryFlag(e.country);
                const cityDisplay = e.city || '';
                const location = flag
                  ? `${flag} ${cityDisplay}`
                  : [cityDisplay, e.country].filter(Boolean).join(', ');
                const when = formatMinutesAgo(e.minutesAgo ?? 0);
                const isNew = e.event === 'first_visit' || e.event === 'session_start';
                const k = eventKey(e);
                const isAnimated = newEventKeysRef.current.has(k);
                return (
                  <div
                    key={`${k}-${i}`}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 14,
                      padding: '14px 18px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: 10,
                      borderLeft: `3px solid ${info.color}`,
                      transition: 'background 0.15s',
                      animation: isAnimated ? 'slideIn 0.35s ease-out' : undefined,
                    }}
                  >
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 36, height: 36, borderRadius: 10,
                      background: 'rgba(255,255,255,0.05)', flexShrink: 0,
                    }}>
                      <info.Icon color={info.color} size={18} />
                    </span>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <span style={{ fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                        Someone{location ? ` in ${location}` : ''}
                        {e.device && (
                          <span style={{ display: 'inline-flex', alignItems: 'center', opacity: 0.6 }}>
                            {getDeviceIcon(e.device)}
                          </span>
                        )}
                        {' '}
                        <span style={{ color: info.color, fontWeight: 600 }}>{info.label}</span>
                        {isNew && (
                          <span style={{
                            fontSize: '0.6rem', fontWeight: 700,
                            background: 'rgba(34,197,94,0.15)', color: '#22c55e',
                            padding: '1px 6px', borderRadius: 8,
                            letterSpacing: '0.04em',
                          }}>
                            NEW
                          </span>
                        )}
                      </span>
                      {e.page && e.page !== '(not set)' && (
                        <span style={{ fontSize: '0.7rem', color: '#4b5563' }}>
                          on {e.page}
                        </span>
                      )}
                      <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>{when}</span>
                    </div>
                    {e.count > 1 && (
                      <span style={{
                        fontSize: '0.72rem', color: '#6b7280',
                        background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 8,
                      }}>
                        x{e.count}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-100%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

/* ── Running total pill component ── */
function TotalPill({ label, count, color }: { label: string; count: number; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
      <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, opacity: 0.7 }} />
      <span style={{ color: '#9ca3af' }}>{label}</span>
      <span style={{ color: '#e5e7eb', fontWeight: 600 }}>{count}</span>
    </div>
  );
}
