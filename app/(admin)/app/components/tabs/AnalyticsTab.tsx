'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
import DateRangeSlider from '../DateRangeSlider';

const LiveMap = dynamic(() => import('../LiveMap'), { ssr: false });

/* ── Types ── */
interface AnalyticsData {
  users: number;
  sessions: number;
  purchases: number;
  usersTrend: string;
  sessionsTrend: string;
  purchasesTrend: string;
  conversionRate: string;
  avgSessionDuration: string;
  bounceRate: string;
  topPages: { path: string; views: number; change: string }[];
  channels: { name: string; sessions: number; color: string }[];
  countries: { name: string; users: number; pct: string }[];
  funnel: { label: string; value: number; rate: string }[];
}

interface RealtimeData {
  activeUsers: number;
  pages: { page: string; activeUsers: number }[];
  countries: { country: string; activeUsers: number }[];
  cities: { city: string; activeUsers: number }[];
  devices: { device: string; activeUsers: number }[];
  sources: { source: string; activeUsers: number }[];
  browsers: { browser: string; activeUsers: number }[];
  operatingSystems: { os: string; activeUsers: number }[];
  events: { event: string; city: string; country: string; count: number; minutesAgo?: number }[];
  revenue: { total: number; orders: number; avgOrderValue: number };
}

/* ── Stat card component ── */
function StatCard({ label, value, sub, trend }: { label: string; value: string | number; sub: string; trend?: string }) {
  const trendColor = trend?.startsWith('+') ? 'var(--green)' : trend?.startsWith('-') ? 'var(--red)' : 'var(--text-dim)';
  return (
    <div className="stat-card">
      <div className="stat-card__label">{label}</div>
      <div className="stat-card__value">{value}</div>
      <div className="stat-card__sub">
        {trend && <span style={{ color: trendColor, marginRight: 6, fontWeight: 600 }}>{trend}</span>}
        {sub}
      </div>
    </div>
  );
}

/* ── Channel breakdown bar ── */
function ChannelBar({ channels }: { channels: { name: string; sessions: number; color: string }[] }) {
  const total = channels.reduce((s, c) => s + c.sessions, 0) || 1;
  return (
    <div style={{ marginTop: 16 }}>
      <div style={{ display: 'flex', borderRadius: 6, overflow: 'hidden', height: 8 }}>
        {channels.map((c) => (
          <div key={c.name} style={{ width: `${(c.sessions / total) * 100}%`, background: c.color, minWidth: 2 }} />
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 16px', marginTop: 12 }}>
        {channels.map((c) => (
          <div key={c.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: c.color }} />
            <span style={{ color: 'var(--text-dim)' }}>{c.name}</span>
            <span style={{ fontWeight: 600 }}>{c.sessions}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Top pages table ── */
function TopPagesTable({ pages }: { pages: { path: string; views: number; change: string }[] }) {
  return (
    <table className="table" style={{ marginTop: 12 }}>
      <thead>
        <tr>
          <th>Page</th>
          <th style={{ textAlign: 'right' }}>Views</th>
          <th style={{ textAlign: 'right' }}>Change</th>
        </tr>
      </thead>
      <tbody>
        {pages.map((p) => (
          <tr key={p.path}>
            <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{p.path}</td>
            <td style={{ textAlign: 'right', fontWeight: 600 }}>{p.views}</td>
            <td style={{ textAlign: 'right', color: p.change.startsWith('+') ? 'var(--green)' : 'var(--red)', fontSize: '0.8rem' }}>{p.change}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ── Country table ── */
function CountryTable({ countries }: { countries: { name: string; users: number; pct: string }[] }) {
  return (
    <table className="table" style={{ marginTop: 12 }}>
      <thead>
        <tr>
          <th>Country</th>
          <th style={{ textAlign: 'right' }}>Users</th>
          <th style={{ textAlign: 'right' }}>%</th>
        </tr>
      </thead>
      <tbody>
        {countries.map((c) => (
          <tr key={c.name}>
            <td>{c.name}</td>
            <td style={{ textAlign: 'right', fontWeight: 600 }}>{c.users}</td>
            <td style={{ textAlign: 'right', color: 'var(--text-dim)' }}>{c.pct}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

/* ── Funnel visualization ── */
function Funnel({ steps }: { steps: { label: string; value: number; rate?: string }[] }) {
  const max = steps[0]?.value || 1;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
      {steps.map((s, i) => (
        <div key={s.label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
            <span>{s.label}</span>
            <span style={{ fontWeight: 600 }}>{s.value} {s.rate && <span style={{ color: 'var(--text-dim)', fontWeight: 400 }}>({s.rate})</span>}</span>
          </div>
          <div style={{ background: 'var(--surface2)', borderRadius: 4, height: 6, overflow: 'hidden' }}>
            <div style={{
              width: `${(s.value / max) * 100}%`,
              height: '100%',
              background: i === steps.length - 1 ? 'var(--green)' : 'var(--accent)',
              borderRadius: 4,
              transition: 'width 0.5s ease',
            }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Sparkline SVG ── */
function Sparkline({ data, width = 200, height = 40 }: { data: number[]; width?: number; height?: number }) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * width;
    const y = height - ((v - min) / range) * (height - 4) - 2;
    return `${x},${y}`;
  }).join(' ');
  const areaPoints = `0,${height} ${points} ${width},${height}`;
  return (
    <svg width={width} height={height} style={{ display: 'block' }}>
      <polyline points={areaPoints} fill="rgba(34,197,94,0.1)" stroke="none" />
      <polyline points={points} fill="none" stroke="var(--green)" strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      {data.length > 0 && (
        <circle
          cx={(data.length - 1) / (data.length - 1) * width}
          cy={height - ((data[data.length - 1] - min) / range) * (height - 4) - 2}
          r={3} fill="var(--green)"
        />
      )}
    </svg>
  );
}

/* ── Mercury-style line chart with dotted grid, axis labels, circle markers ── */
function MercuryChart({
  data,
  width = 720,
  height = 260,
  xLabels,
  yFormatter = (v) => v.toLocaleString(),
  color = 'var(--accent)',
  fillColor = 'rgba(59,130,246,0.12)',
}: {
  data: number[];
  width?: number;
  height?: number;
  xLabels?: string[];
  yFormatter?: (v: number) => string;
  color?: string;
  fillColor?: string;
}) {
  if (data.length < 2) {
    return (
      <div style={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-dim)', fontSize: '0.75rem' }}>
        Collecting data…
      </div>
    );
  }

  const padL = 52;
  const padR = 16;
  const padT = 12;
  const padB = 28;
  const chartW = width - padL - padR;
  const chartH = height - padT - padB;

  const rawMax = Math.max(...data);
  const rawMin = Math.min(...data);
  const span = Math.max(1, rawMax - rawMin);
  // Pad the range so line doesn't hug edges; include 0 if values are small
  const yMax = rawMax + span * 0.2;
  const yMin = Math.max(0, rawMin - span * 0.2);
  const yRange = yMax - yMin || 1;

  const yTickCount = 5;
  const yTicks = Array.from({ length: yTickCount + 1 }, (_, i) => yMin + (i / yTickCount) * yRange);

  const pointFor = (v: number, i: number) => {
    const x = padL + (i / (data.length - 1)) * chartW;
    const y = padT + chartH - ((v - yMin) / yRange) * chartH;
    return { x, y };
  };

  const pts = data.map(pointFor);
  const polyline = pts.map((p) => `${p.x},${p.y}`).join(' ');
  const area = `${pts[0].x},${padT + chartH} ${polyline} ${pts[pts.length - 1].x},${padT + chartH}`;

  // X axis labels: use provided labels or generate evenly spaced placeholders
  const xLabelCount = Math.min(xLabels?.length ?? 0, 9) || Math.min(9, data.length);
  const xLabelIndices = Array.from({ length: xLabelCount }, (_, i) =>
    Math.round((i / (xLabelCount - 1 || 1)) * (data.length - 1))
  );

  // Dotted grid (horizontal dots aligned to y ticks)
  const dotRows = yTicks.length;
  const dotsPerRow = 80;

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`} style={{ display: 'block', overflow: 'visible' }}>
      {/* Dotted grid background */}
      {yTicks.map((_, r) => {
        const y = padT + (r / (dotRows - 1)) * chartH;
        return Array.from({ length: dotsPerRow }).map((__, c) => {
          const x = padL + (c / (dotsPerRow - 1)) * chartW;
          return <circle key={`g-${r}-${c}`} cx={x} cy={y} r={0.6} fill="rgba(255,255,255,0.12)" />;
        });
      })}

      {/* Y axis labels */}
      {yTicks.map((v, i) => {
        const y = padT + chartH - (i / (yTicks.length - 1)) * chartH;
        return (
          <text
            key={`yt-${i}`}
            x={padL - 10}
            y={y + 4}
            textAnchor="end"
            fontSize="10"
            fill="rgba(255,255,255,0.4)"
          >
            {yFormatter(Math.round(v))}
          </text>
        );
      })}

      {/* Zero/baseline */}
      <line
        x1={padL}
        y1={padT + chartH}
        x2={padL + chartW}
        y2={padT + chartH}
        stroke="rgba(255,255,255,0.08)"
        strokeWidth={1}
      />

      {/* Area fill */}
      <polyline points={area} fill={fillColor} stroke="none" />

      {/* Line */}
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* Data point markers */}
      {pts.map((p, i) => (
        <g key={`pt-${i}`}>
          <circle cx={p.x} cy={p.y} r={4} fill="var(--surface)" stroke={color} strokeWidth={2} />
        </g>
      ))}

      {/* Highlight current (last) point */}
      {pts.length > 0 && (
        <>
          <rect
            x={pts[pts.length - 1].x - 10}
            y={padT}
            width={20}
            height={chartH}
            fill={color}
            opacity={0.08}
          />
          <circle
            cx={pts[pts.length - 1].x}
            cy={pts[pts.length - 1].y}
            r={5}
            fill={color}
            stroke="#fff"
            strokeWidth={2}
          />
        </>
      )}

      {/* X axis labels */}
      {xLabelIndices.map((idx, i) => {
        const x = padL + (idx / (data.length - 1)) * chartW;
        const label = xLabels?.[idx] ?? '';
        if (!label) return null;
        return (
          <text
            key={`xt-${i}`}
            x={x}
            y={height - 8}
            textAnchor="middle"
            fontSize="10"
            fill="rgba(255,255,255,0.5)"
          >
            {label}
          </text>
        );
      })}
    </svg>
  );
}

/* ── Event icons (SVG) ── */
type EventIconProps = { color: string; size?: number };
const EventIcon = {
  eye: ({ color, size = 16 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  cart: ({ color, size = 16 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="9" cy="21" r="1" />
      <circle cx="20" cy="21" r="1" />
      <path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6" />
    </svg>
  ),
  card: ({ color, size = 16 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
      <line x1="1" y1="10" x2="23" y2="10" />
    </svg>
  ),
  check: ({ color, size = 16 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  ),
  mail: ({ color, size = 16 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  ),
  rocket: ({ color, size = 16 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  ),
  sparkle: ({ color, size = 16 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  scroll: ({ color, size = 16 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="7 13 12 18 17 13" />
      <polyline points="7 6 12 11 17 6" />
    </svg>
  ),
  pointer: ({ color, size = 16 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 11.24V7.5a2.5 2.5 0 0 1 5 0v3.74" />
      <path d="M14 10.5V9a2.5 2.5 0 0 1 5 0v6a7 7 0 0 1-7 7h-1a7 7 0 0 1-7-7v-1a2.5 2.5 0 0 1 5 0" />
    </svg>
  ),
  activity: ({ color, size = 16 }: EventIconProps) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
  ),
};

/* ── Event descriptions ── */
const EVENT_LABELS: Record<string, { label: string; Icon: (p: EventIconProps) => React.JSX.Element; color: string }> = {
  'page_view': { label: 'viewed a page', Icon: EventIcon.eye, color: 'var(--accent)' },
  'add_to_cart': { label: 'added to cart', Icon: EventIcon.cart, color: '#f59e0b' },
  'begin_checkout': { label: 'started checkout', Icon: EventIcon.card, color: '#8b5cf6' },
  'purchase': { label: 'completed a purchase', Icon: EventIcon.check, color: 'var(--green)' },
  'sign_up': { label: 'signed up', Icon: EventIcon.mail, color: '#ec4899' },
  'session_start': { label: 'started a session', Icon: EventIcon.rocket, color: 'var(--accent)' },
  'first_visit': { label: 'visited for the first time', Icon: EventIcon.sparkle, color: '#22c55e' },
  'scroll': { label: 'scrolled the page', Icon: EventIcon.scroll, color: 'var(--text-dim)' },
  'click': { label: 'clicked a link', Icon: EventIcon.pointer, color: 'var(--accent)' },
};

/* ── Relative time formatting ── */
function formatMinutesAgo(minutes: number): string {
  if (!minutes || minutes <= 0) return 'just now';
  if (minutes === 1) return '1 minute ago';
  if (minutes < 60) return `${minutes} minutes ago`;
  const hours = Math.floor(minutes / 60);
  if (hours === 1) return '1 hour ago';
  return `${hours} hours ago`;
}

/* ── Source icons/colors ── */
const SOURCE_STYLES: Record<string, { color: string }> = {
  'google': { color: '#4285f4' },
  'instagram': { color: '#e4405f' },
  'tiktok': { color: '#000000' },
  'facebook': { color: '#1877f2' },
  'youtube': { color: '#ff0000' },
  'twitter': { color: '#1da1f2' },
  'bing': { color: '#008373' },
  '(direct)': { color: 'var(--accent)' },
  '(not set)': { color: 'var(--text-dim)' },
};

/* ── Donut chart ── */
function DonutChart({ items, size = 120 }: { items: { label: string; value: number; color: string }[]; size?: number }) {
  const total = items.reduce((s, i) => s + i.value, 0) || 1;
  const r = size / 2 - 8;
  const cx = size / 2;
  const cy = size / 2;
  let cumAngle = -90;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
      <svg width={size} height={size} style={{ flexShrink: 0 }}>
        {items.map((item) => {
          const angle = (item.value / total) * 360;
          const startAngle = cumAngle;
          cumAngle += angle;
          const endAngle = cumAngle;
          const largeArc = angle > 180 ? 1 : 0;
          const rad = (a: number) => (a * Math.PI) / 180;
          const x1 = cx + r * Math.cos(rad(startAngle));
          const y1 = cy + r * Math.sin(rad(startAngle));
          const x2 = cx + r * Math.cos(rad(endAngle));
          const y2 = cy + r * Math.sin(rad(endAngle));
          const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
          return <path key={item.label} d={d} fill={item.color} opacity={0.8} />;
        })}
        <circle cx={cx} cy={cy} r={r * 0.55} fill="var(--surface)" />
        <text x={cx} y={cy - 4} textAnchor="middle" fill="var(--text)" fontSize={16} fontWeight={700}>{total}</text>
        <text x={cx} y={cy + 12} textAnchor="middle" fill="var(--text-dim)" fontSize={9}>users</text>
      </svg>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((item) => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem' }}>
            <div style={{ width: 8, height: 8, borderRadius: 2, background: item.color, flexShrink: 0 }} />
            <span style={{ color: 'var(--text-dim)' }}>{item.label}</span>
            <span style={{ fontWeight: 600 }}>{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── Live View component ── */
function LiveView({ data, loading, sparklineData }: { data: RealtimeData | null; loading: boolean; sparklineData: number[] }) {
  return (
    <div style={{ marginBottom: 24 }}>
      {/* Active users hero + sparkline */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34,197,94,0.1) 0%, rgba(59,130,246,0.1) 100%)',
        border: '1px solid rgba(34,197,94,0.3)',
        borderRadius: 'var(--radius)',
        padding: '32px 24px',
        textAlign: 'center',
        marginBottom: 20,
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: 12, right: 16,
          display: 'flex', alignItems: 'center', gap: 6,
          fontSize: '0.7rem', color: 'var(--green)',
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%', background: 'var(--green)',
            animation: 'pulse 2s infinite',
          }} />
          LIVE
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 1 }}>
          Active Users Right Now
        </div>
        <div style={{
          fontSize: '4rem', fontWeight: 800, lineHeight: 1,
          background: 'linear-gradient(135deg, var(--green), var(--accent))',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          opacity: loading ? 0.5 : 1,
          transition: 'opacity 0.3s',
        }}>
          {data?.activeUsers ?? '--'}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: 8, marginBottom: 12 }}>
          visitors on your site
        </div>
        {/* Mercury-style live chart */}
        {sparklineData.length >= 2 && (
          <div style={{ marginTop: 12, padding: '0 24px' }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-dim)', marginBottom: 4, textAlign: 'left' }}>Active users — last 30 min</div>
            <MercuryChart
              data={sparklineData}
              height={180}
              color="var(--green)"
              fillColor="rgba(34,197,94,0.12)"
              xLabels={sparklineData.map((_, i) => {
                const total = sparklineData.length;
                const minsAgo = Math.round(((total - 1 - i) / 2)); // 30s intervals
                if (i === 0) return `-${minsAgo}m`;
                if (i === total - 1) return 'now';
                if (i === Math.floor(total / 2)) return `-${minsAgo}m`;
                return '';
              })}
            />
          </div>
        )}
      </div>

      {/* Revenue ticker */}
      {data?.revenue && data.revenue.orders > 0 && (
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16,
          marginBottom: 20,
        }}>
          <div style={{
            background: 'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.02) 100%)',
            border: '1px solid rgba(34,197,94,0.2)',
            borderRadius: 'var(--radius)', padding: '20px 16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Today&apos;s Revenue</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--green)' }}>${data.revenue.total.toFixed(2)}</div>
          </div>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '20px 16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Orders Today</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>{data.revenue.orders}</div>
          </div>
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '20px 16px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 }}>Avg Order Value</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text)' }}>${data.revenue.avgOrderValue.toFixed(2)}</div>
          </div>
        </div>
      )}

      {/* Three columns: active pages + active countries + active cities */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12 }}>
            Active Pages
          </h3>
          {data?.pages?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.pages.map((p) => (
                <div key={p.page} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                  <span style={{ fontFamily: 'monospace', color: 'var(--text-dim)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1, marginRight: 12 }}>
                    {p.page}
                  </span>
                  <span style={{
                    fontWeight: 700, color: 'var(--green)',
                    background: 'rgba(34,197,94,0.1)', padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem',
                  }}>
                    {p.activeUsers}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              {loading ? 'Loading...' : 'No active pages'}
            </div>
          )}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12 }}>
            Active Countries
          </h3>
          {data?.countries?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.countries.map((c) => (
                <div key={c.country} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                  <span>{c.country}</span>
                  <span style={{
                    fontWeight: 700, color: 'var(--accent)',
                    background: 'rgba(59,130,246,0.1)', padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem',
                  }}>
                    {c.activeUsers}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              {loading ? 'Loading...' : 'No active countries'}
            </div>
          )}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12 }}>
            Active Cities
          </h3>
          {data?.cities?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.cities.map((c) => (
                <div key={c.city} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                  <span>{c.city}</span>
                  <span style={{
                    fontWeight: 700, color: '#f59e0b',
                    background: 'rgba(245,158,11,0.1)', padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem',
                  }}>
                    {c.activeUsers}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              {loading ? 'Loading...' : 'No active cities'}
            </div>
          )}
        </div>

        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12 }}>
            Active Devices
          </h3>
          {data?.devices?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.devices.map((d) => (
                <div key={d.device} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {d.device === 'mobile' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                    )}
                    {d.device === 'desktop' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="3" width="20" height="14" rx="2" ry="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
                    )}
                    {d.device === 'tablet' && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                    )}
                    {d.device.charAt(0).toUpperCase() + d.device.slice(1)}
                  </span>
                  <span style={{
                    fontWeight: 700, color: '#a855f7',
                    background: 'rgba(168,85,247,0.1)', padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem',
                  }}>
                    {d.activeUsers}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              {loading ? 'Loading...' : 'No active devices'}
            </div>
          )}
        </div>
      </div>

      {/* Row 2: Traffic Sources + Browser/OS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginTop: 20 }}>
        {/* Traffic Sources */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
            Traffic Sources
            <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-dim)', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: 10, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Today</span>
          </h3>
          {data?.sources?.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {data.sources.map((s) => {
                const style = SOURCE_STYLES[s.source.toLowerCase()] || { color: 'var(--text-dim)' };
                return (
                  <div key={s.source} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: style.color, flexShrink: 0 }} />
                      {s.source}
                    </span>
                    <span style={{
                      fontWeight: 700, color: 'var(--accent)',
                      background: 'rgba(59,130,246,0.1)', padding: '2px 10px', borderRadius: 12, fontSize: '0.75rem',
                    }}>
                      {s.activeUsers}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              {loading ? 'Loading...' : 'No active sources'}
            </div>
          )}
        </div>

        {/* OS breakdown */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 16 }}>Operating Systems</h3>
          {data?.operatingSystems?.length ? (
            <DonutChart items={data.operatingSystems.map((o, i) => ({
              label: o.os,
              value: o.activeUsers,
              color: ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'][i % 6],
            }))} />
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              {loading ? 'Loading...' : 'No OS data'}
            </div>
          )}
        </div>
      </div>

      {/* Live Event Feed */}
      {data?.events?.length ? (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: 24, marginTop: 20,
        }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>Live Event Feed</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 16 }}>Recent activity on your site</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, maxHeight: 300, overflowY: 'auto' }}>
            {data.events
              .filter((e) => !['scroll', 'user_engagement'].includes(e.event))
              .map((e, i) => {
                const info = EVENT_LABELS[e.event] || { label: e.event, Icon: EventIcon.activity, color: 'var(--text-dim)' };
                const location = [e.city, e.country].filter(Boolean).join(', ');
                const when = formatMinutesAgo(e.minutesAgo ?? 0);
                return (
                  <div key={`${e.event}-${e.city}-${e.minutesAgo}-${i}`} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '10px 14px',
                    background: 'var(--surface2)', borderRadius: 8,
                    fontSize: '0.8rem',
                    borderLeft: `3px solid ${info.color}`,
                  }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: 28, height: 28, borderRadius: 8,
                      background: 'var(--surface)', flexShrink: 0,
                    }}>
                      <info.Icon color={info.color} size={15} />
                    </span>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <span style={{ color: 'var(--text)' }}>
                        Someone{location ? ` in ${location}` : ''}{' '}
                        <span style={{ color: info.color, fontWeight: 600 }}>{info.label}</span>
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>{when}</span>
                    </div>
                    <span style={{
                      fontSize: '0.7rem', color: 'var(--text-dim)',
                      background: 'var(--surface)', padding: '2px 8px', borderRadius: 8,
                    }}>
                      x{e.count}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>
      ) : null}
    </div>
  );
}

/* ── Fallback hardcoded data ── */
const FALLBACK: Record<string, AnalyticsData> = {
  'today': {
    users: 18, sessions: 22, purchases: 1,
    usersTrend: '+28.6%', sessionsTrend: '+37.5%', purchasesTrend: '+100%',
    conversionRate: '4.5%', avgSessionDuration: '1m 55s', bounceRate: '31.8%',
    topPages: [
      { path: '/products/strawberry-lemonade', views: 19, change: '+46.2%' },
      { path: '/', views: 16, change: '+33.3%' },
      { path: '/products/grapefruit', views: 5, change: '+25.0%' },
      { path: '/checkout', views: 2, change: '+100%' },
    ],
    channels: [
      { name: 'Direct', sessions: 8, color: '#3b82f6' },
      { name: 'Organic Search', sessions: 5, color: '#22c55e' },
      { name: 'Organic Social', sessions: 4, color: '#ec4899' },
      { name: 'Organic Video', sessions: 3, color: '#ef4444' },
      { name: 'Email', sessions: 2, color: '#6b7280' },
    ],
    countries: [
      { name: 'United States', users: 14, pct: '77.8%' },
      { name: 'Canada', users: 2, pct: '11.1%' },
      { name: 'United Kingdom', users: 1, pct: '5.6%' },
      { name: 'Australia', users: 1, pct: '5.6%' },
    ],
    funnel: [
      { label: 'Sessions', value: 22, rate: '100%' },
      { label: 'Page Views', value: 42, rate: '190.9%' },
      { label: 'Add to Cart', value: 4, rate: '18.2%' },
      { label: 'Checkout', value: 2, rate: '9.1%' },
      { label: 'Purchase', value: 1, rate: '4.5%' },
    ],
  },
  '7d': {
    users: 260, sessions: 301, purchases: 7,
    usersTrend: '+68.8%', sessionsTrend: '+55.2%', purchasesTrend: '+600%',
    conversionRate: '2.3%', avgSessionDuration: '1m 42s', bounceRate: '38.2%',
    topPages: [
      { path: '/products/strawberry-lemonade', views: 265, change: '+99.2%' },
      { path: '/', views: 244, change: '+60.5%' },
      { path: '/products/grapefruit', views: 65, change: '+27.5%' },
      { path: '/collections', views: 28, change: '+133.3%' },
      { path: '/faq', views: 15, change: '+150.0%' },
      { path: '/contact', views: 11, change: '+37.5%' },
      { path: '/checkout', views: 14, change: '+1,300%' },
    ],
    channels: [
      { name: 'Organic Video', sessions: 85, color: '#ef4444' },
      { name: 'Organic Shopping', sessions: 61, color: '#f59e0b' },
      { name: 'Cross-network', sessions: 52, color: '#8b5cf6' },
      { name: 'Organic Search', sessions: 41, color: '#22c55e' },
      { name: 'Direct', sessions: 37, color: '#3b82f6' },
      { name: 'Organic Social', sessions: 18, color: '#ec4899' },
      { name: 'Email', sessions: 2, color: '#6b7280' },
    ],
    countries: [
      { name: 'United States', users: 195, pct: '75.0%' },
      { name: 'Canada', users: 11, pct: '4.2%' },
      { name: 'United Kingdom', users: 8, pct: '3.1%' },
      { name: 'Nigeria', users: 6, pct: '2.3%' },
      { name: 'Sri Lanka', users: 3, pct: '1.2%' },
      { name: 'New Zealand', users: 3, pct: '1.2%' },
      { name: 'Australia', users: 2, pct: '0.8%' },
    ],
    funnel: [
      { label: 'Sessions', value: 301, rate: '100%' },
      { label: 'Product Views', value: 265, rate: '88.0%' },
      { label: 'Add to Cart', value: 42, rate: '14.0%' },
      { label: 'Checkout', value: 14, rate: '4.7%' },
      { label: 'Purchase', value: 7, rate: '2.3%' },
    ],
  },
  '30d': {
    users: 820, sessions: 1050, purchases: 18,
    usersTrend: '+42.1%', sessionsTrend: '+38.5%', purchasesTrend: '+350%',
    conversionRate: '1.7%', avgSessionDuration: '1m 38s', bounceRate: '41.5%',
    topPages: [
      { path: '/products/strawberry-lemonade', views: 890, change: '+85.4%' },
      { path: '/', views: 780, change: '+52.3%' },
      { path: '/products/grapefruit', views: 210, change: '+34.2%' },
      { path: '/collections', views: 95, change: '+110.0%' },
      { path: '/faq', views: 48, change: '+120.0%' },
      { path: '/contact', views: 35, change: '+45.8%' },
      { path: '/checkout', views: 38, change: '+900%' },
    ],
    channels: [
      { name: 'Organic Video', sessions: 280, color: '#ef4444' },
      { name: 'Organic Shopping', sessions: 195, color: '#f59e0b' },
      { name: 'Cross-network', sessions: 168, color: '#8b5cf6' },
      { name: 'Organic Search', sessions: 145, color: '#22c55e' },
      { name: 'Direct', sessions: 132, color: '#3b82f6' },
      { name: 'Organic Social', sessions: 85, color: '#ec4899' },
      { name: 'Email', sessions: 12, color: '#6b7280' },
    ],
    countries: [
      { name: 'United States', users: 615, pct: '75.0%' },
      { name: 'Canada', users: 38, pct: '4.6%' },
      { name: 'United Kingdom', users: 28, pct: '3.4%' },
      { name: 'Nigeria', users: 18, pct: '2.2%' },
      { name: 'Australia', users: 12, pct: '1.5%' },
      { name: 'Germany', users: 8, pct: '1.0%' },
      { name: 'New Zealand', users: 6, pct: '0.7%' },
    ],
    funnel: [
      { label: 'Sessions', value: 1050, rate: '100%' },
      { label: 'Product Views', value: 890, rate: '84.8%' },
      { label: 'Add to Cart', value: 128, rate: '12.2%' },
      { label: 'Checkout', value: 38, rate: '3.6%' },
      { label: 'Purchase', value: 18, rate: '1.7%' },
    ],
  },
  '90d': {
    users: 1580, sessions: 2100, purchases: 32,
    usersTrend: '+125%', sessionsTrend: '+98.2%', purchasesTrend: '+520%',
    conversionRate: '1.5%', avgSessionDuration: '1m 35s', bounceRate: '43.8%',
    topPages: [
      { path: '/products/strawberry-lemonade', views: 1780, change: '+92.1%' },
      { path: '/', views: 1540, change: '+65.8%' },
      { path: '/products/grapefruit', views: 420, change: '+48.6%' },
      { path: '/collections', views: 185, change: '+95.0%' },
      { path: '/faq', views: 92, change: '+88.4%' },
      { path: '/contact', views: 68, change: '+52.3%' },
      { path: '/checkout', views: 65, change: '+750%' },
    ],
    channels: [
      { name: 'Organic Video', sessions: 560, color: '#ef4444' },
      { name: 'Organic Shopping', sessions: 390, color: '#f59e0b' },
      { name: 'Cross-network', sessions: 335, color: '#8b5cf6' },
      { name: 'Organic Search', sessions: 310, color: '#22c55e' },
      { name: 'Direct', sessions: 275, color: '#3b82f6' },
      { name: 'Organic Social', sessions: 165, color: '#ec4899' },
      { name: 'Email', sessions: 28, color: '#6b7280' },
    ],
    countries: [
      { name: 'United States', users: 1185, pct: '75.0%' },
      { name: 'Canada', users: 72, pct: '4.6%' },
      { name: 'United Kingdom', users: 52, pct: '3.3%' },
      { name: 'Nigeria', users: 35, pct: '2.2%' },
      { name: 'Australia', users: 28, pct: '1.8%' },
      { name: 'Germany', users: 18, pct: '1.1%' },
      { name: 'New Zealand', users: 12, pct: '0.8%' },
    ],
    funnel: [
      { label: 'Sessions', value: 2100, rate: '100%' },
      { label: 'Product Views', value: 1780, rate: '84.8%' },
      { label: 'Add to Cart', value: 245, rate: '11.7%' },
      { label: 'Checkout', value: 65, rate: '3.1%' },
      { label: 'Purchase', value: 32, rate: '1.5%' },
    ],
  },
};

/* ── Period labels ── */
type Period = 'live' | 'today' | 'custom';
const DEFAULT_RANGE_DAYS = 7;

function rangeKey(start: Date, end: Date): string {
  const fmt = (d: Date) => d.toISOString().slice(0, 10);
  return `${fmt(start)}_${fmt(end)}`;
}

/* ── Main Analytics Tab ── */
export default function AnalyticsTab() {
  const [period, setPeriod] = useState<Period>('live');
  const [customRange, setCustomRange] = useState<{ start: Date; end: Date }>(() => {
    const end = new Date();
    end.setHours(0, 0, 0, 0);
    const start = new Date(end);
    start.setDate(start.getDate() - DEFAULT_RANGE_DAYS);
    return { start, end };
  });
  const [liveData, setLiveData] = useState<Record<string, AnalyticsData>>({});
  const [realtimeData, setRealtimeData] = useState<RealtimeData | null>(null);
  const [isLive, setIsLive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [realtimeLoading, setRealtimeLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const realtimeInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const [sparklineHistory, setSparklineHistory] = useState<number[]>([]);

  const fetchAnalytics = useCallback(async (p: Period, range?: { start: Date; end: Date }) => {
    if (p === 'live') return; // Handled separately
    setLoading(true);
    setError('');
    try {
      let url = `/api/analytics?period=${p}&t=${Date.now()}`;
      let cacheKey: string = p;
      if (p === 'custom' && range) {
        const fmt = (d: Date) => d.toISOString().slice(0, 10);
        url += `&startDate=${fmt(range.start)}&endDate=${fmt(range.end)}`;
        cacheKey = rangeKey(range.start, range.end);
      }
      const res = await fetch(url, { cache: 'no-store' });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
        return;
      }
      setLiveData((prev) => ({ ...prev, [cacheKey]: json }));
      setIsLive(true);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRealtime = useCallback(async () => {
    setRealtimeLoading(true);
    try {
      const res = await fetch(`/api/analytics?period=realtime&t=${Date.now()}`, { cache: 'no-store' });
      const json = await res.json();
      if (json.error) {
        setError(json.error);
        return;
      }
      setRealtimeData(json);
      setIsLive(true);
      setLastUpdated(new Date().toLocaleTimeString());
      // Track sparkline history (max 60 points = 30 min at 30s intervals)
      setSparklineHistory((prev) => [...prev.slice(-59), json.activeUsers ?? 0]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch realtime');
    } finally {
      setRealtimeLoading(false);
    }
  }, []);

  // Fetch data based on period
  useEffect(() => {
    if (period === 'live') {
      fetchRealtime();
      // Auto-refresh realtime every 30 seconds
      realtimeInterval.current = setInterval(fetchRealtime, 30000);
      return () => {
        if (realtimeInterval.current) clearInterval(realtimeInterval.current);
      };
    } else {
      if (realtimeInterval.current) clearInterval(realtimeInterval.current);
      fetchAnalytics(period, period === 'custom' ? customRange : undefined);
    }
  }, [period, customRange, fetchAnalytics, fetchRealtime]);

  const cacheKey = period === 'custom' ? rangeKey(customRange.start, customRange.end) : period;
  const d = period !== 'live'
    ? ((isLive && liveData[cacheKey]) ? liveData[cacheKey] : FALLBACK['today'] || FALLBACK['7d'])
    : null;

  return (
    <div>
      {/* Period selector: Live + Today buttons + custom range slider */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 32, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          style={{
            padding: '8px 20px', fontSize: '0.8rem',
            border: period === 'live' ? '1px solid rgba(34,197,94,0.5)' : '1px solid var(--border)',
            borderRadius: 8,
            background: period === 'live' ? 'rgba(34,197,94,0.15)' : 'var(--surface)',
            color: period === 'live' ? 'var(--green)' : 'var(--text)',
            cursor: 'pointer', fontWeight: 600,
            display: 'flex', alignItems: 'center', gap: 6,
          }}
          onClick={() => setPeriod('live')}
        >
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: period === 'live' ? 'var(--green)' : 'var(--text-dim)',
            animation: period === 'live' ? 'pulse 2s infinite' : 'none',
          }} />
          Live
        </button>
        <button
          style={{
            padding: '8px 20px', fontSize: '0.8rem',
            border: '1px solid var(--border)',
            borderRadius: 8,
            background: period === 'today' ? 'var(--accent)' : 'var(--surface)',
            color: period === 'today' ? '#fff' : 'var(--text)',
            cursor: 'pointer', fontWeight: 600,
          }}
          onClick={() => setPeriod('today')}
        >
          Today
        </button>

        {/* Date range slider */}
        <div
          onClick={() => {
            if (period !== 'custom') setPeriod('custom');
          }}
          style={{
            flex: 1,
            minWidth: 360,
            opacity: period === 'custom' ? 1 : 0.65,
            cursor: period === 'custom' ? 'default' : 'pointer',
            transition: 'opacity 0.2s',
          }}
        >
          <DateRangeSlider
            start={customRange.start}
            end={customRange.end}
            onChange={(start, end) => {
              setCustomRange({ start, end });
              if (period !== 'custom') setPeriod('custom');
            }}
          />
        </div>

        {/* Live/Cached indicator */}
        <div style={{ marginLeft: 8, display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: (loading || realtimeLoading) ? 'var(--accent)' : isLive ? 'var(--green)' : '#f59e0b',
            animation: (loading || realtimeLoading) ? 'pulse 1s infinite' : 'none',
          }} />
          {(loading || realtimeLoading) ? 'Fetching...' : isLive ? 'Live from GA4' : 'Cached data'}
          {lastUpdated && <span style={{ marginLeft: 6, opacity: 0.7 }}>({lastUpdated})</span>}
        </div>

        <a
          href="https://analytics.google.com/analytics/web/"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: '0.8rem', textDecoration: 'none' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
          Open GA4
        </a>
      </div>

      {error && (
        <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '12px 16px', marginBottom: 20, fontSize: '0.8rem', color: '#ef4444' }}>
          {error}
          {!isLive && <span style={{ color: 'var(--text-dim)', marginLeft: 8 }}>Showing cached data.</span>}
        </div>
      )}

      {/* Live View */}
      {period === 'live' && (
        <>
          <LiveView data={realtimeData} loading={realtimeLoading} sparklineData={sparklineHistory} />
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginTop: 20 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>Visitor Map</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 16 }}>Live visitor locations</p>
            <LiveMap
              countries={realtimeData?.countries || []}
              cities={realtimeData?.cities || []}
            />
          </div>
        </>
      )}

      {/* Key metrics (non-live periods) */}
      {period !== 'live' && d && (
      <div className="stats">
        <StatCard label="Active Users" value={d.users.toLocaleString()} sub="unique visitors" trend={d.usersTrend} />
        <StatCard label="Sessions" value={d.sessions.toLocaleString()} sub="total sessions" trend={d.sessionsTrend} />
        <StatCard label="Purchases" value={d.purchases} sub="completed orders" trend={d.purchasesTrend} />
        <StatCard label="Conversion Rate" value={d.conversionRate} sub="sessions to purchase" />
        <StatCard label="Avg Session" value={d.avgSessionDuration} sub="time on site" />
        <StatCard label="Bounce Rate" value={d.bounceRate} sub="single page visits" />
      </div>
      )}

      {/* Two-column layout for panels (non-live) */}
      {period !== 'live' && d && (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 20, marginTop: 24 }}>

        {/* Conversion Funnel */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>Conversion Funnel</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 8 }}>Session to purchase flow</p>
          <Funnel steps={d.funnel} />
        </div>

        {/* Traffic Channels */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>Traffic Channels</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 8 }}>Sessions by acquisition channel</p>
          <ChannelBar channels={d.channels} />
        </div>

        {/* Top Pages */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>Top Pages</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 0 }}>Most viewed pages</p>
          <TopPagesTable pages={d.topPages} />
        </div>

        {/* Geography */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>Geography</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 0 }}>Active users by country</p>
          <CountryTable countries={d.countries} />
        </div>
      </div>
      )}

      {/* World map for non-live periods */}
      {period !== 'live' && d && d.countries.length > 0 && (
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginTop: 24 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 4 }}>Visitor Map</h3>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: 16 }}>Visitor locations for selected period</p>
          <LiveMap countries={d.countries.map((c) => ({ country: c.name, activeUsers: c.users }))} />
        </div>
      )}

      {/* Setup instructions */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginTop: 24 }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ verticalAlign: -2, marginRight: 6 }}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          {isLive ? 'Live GA4 Integration Active' : 'GA4 Setup Required'}
        </h3>
        {isLive ? (
          <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.6, margin: 0 }}>
            Data is being pulled live from GA4 Data API. Events tracked:{' '}
            <code style={{ background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem' }}>page_view</code>{' '}
            <code style={{ background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem' }}>add_to_cart</code>{' '}
            <code style={{ background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem' }}>begin_checkout</code>{' '}
            <code style={{ background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem' }}>purchase</code>{' '}
            <code style={{ background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem' }}>sign_up</code>
          </p>
        ) : (
          <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.8 }}>
            <p style={{ margin: '0 0 8px' }}>To connect live GA4 data, add these environment variables in Vercel:</p>
            <code style={{ display: 'block', background: 'var(--surface2)', padding: 12, borderRadius: 6, fontSize: '0.75rem', lineHeight: 1.8 }}>
              GA4_PROPERTY_ID=your-numeric-property-id<br />
              GA4_CLIENT_EMAIL=atlas-analytics@advance-genre-492313-k1.iam.gserviceaccount.com<br />
              GA4_PRIVATE_KEY=your-private-key
            </code>
            <p style={{ margin: '8px 0 0', fontSize: '0.75rem' }}>
              Also ensure the service account has Viewer access in GA4 Property &gt; Admin &gt; Property Access Management.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
