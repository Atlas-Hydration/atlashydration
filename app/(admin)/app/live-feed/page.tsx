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
  if (hours === 1) return '1 hour ago';
  return `${hours} hours ago`;
}

interface EventRow {
  event: string;
  city: string;
  country: string;
  count: number;
  minutesAgo?: number;
}

export default function LiveFeedPage() {
  const [events, setEvents] = useState<EventRow[]>([]);
  const [activeUsers, setActiveUsers] = useState(0);
  const [lastUpdated, setLastUpdated] = useState('');
  const [error, setError] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/analytics?period=realtime&t=${Date.now()}`, { cache: 'no-store' });
      const json = await res.json();
      if (json.error) { setError(json.error); return; }
      setEvents(json.events || []);
      setActiveUsers(json.activeUsers || 0);
      setLastUpdated(new Date().toLocaleTimeString());
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch');
    }
  }, []);

  useEffect(() => {
    fetchData();
    intervalRef.current = setInterval(fetchData, 15000); // 15s refresh
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fetchData]);

  const filtered = events.filter((e) => !['scroll', 'user_engagement'].includes(e.event));

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0e1a',
      color: '#e5e7eb',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: 0,
    }}>
      {/* Header bar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        background: 'rgba(10,14,26,0.95)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '16px 24px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
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
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: '0.75rem', color: '#6b7280' }}>
          {error && <span style={{ color: '#ef4444' }}>{error}</span>}
          {lastUpdated && <span>Updated {lastUpdated}</span>}
          <span style={{
            background: 'rgba(255,255,255,0.04)', padding: '4px 10px', borderRadius: 6,
          }}>
            Auto-refresh 15s
          </span>
        </div>
      </div>

      {/* Events list */}
      <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {filtered.length === 0 && !error && (
          <div style={{ textAlign: 'center', padding: 60, color: '#6b7280', fontSize: '0.85rem' }}>
            Waiting for events...
          </div>
        )}
        {filtered.map((e, i) => {
          const info = EVENT_LABELS[e.event] || { label: e.event, Icon: EventIcon.activity, color: '#6b7280' };
          const location = [e.city, e.country].filter(Boolean).join(', ');
          const when = formatMinutesAgo(e.minutesAgo ?? 0);
          return (
            <div
              key={`${e.event}-${e.city}-${e.minutesAgo}-${i}`}
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px',
                background: 'rgba(255,255,255,0.03)',
                borderRadius: 10,
                borderLeft: `3px solid ${info.color}`,
                transition: 'background 0.15s',
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
                <span style={{ fontSize: '0.85rem' }}>
                  Someone{location ? ` in ${location}` : ''}{' '}
                  <span style={{ color: info.color, fontWeight: 600 }}>{info.label}</span>
                </span>
                <span style={{ fontSize: '0.72rem', color: '#6b7280' }}>{when}</span>
              </div>
              <span style={{
                fontSize: '0.72rem', color: '#6b7280',
                background: 'rgba(255,255,255,0.04)', padding: '3px 10px', borderRadius: 8,
              }}>
                x{e.count}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
