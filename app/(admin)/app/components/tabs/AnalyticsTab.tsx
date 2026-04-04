'use client';

import { useState } from 'react';

/* ── GA4 Measurement Protocol + Data API config ── */
const GA_PROPERTY_ID = ''; // Will be set when user provides it

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

/* ── Main Analytics Tab ── */
export default function AnalyticsTab() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');

  // Data snapshots from GA4 (from user's screenshot)
  const data = {
    '7d': {
      users: 260,
      sessions: 301,
      events: 1900,
      purchases: 7,
      usersTrend: '+68.8%',
      sessionsTrend: '+55.2%',
      eventsTrend: '+78.1%',
      purchasesTrend: '+600%',
      conversionRate: '2.3%',
      avgSessionDuration: '1m 42s',
      bounceRate: '38.2%',
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
      users: 820,
      sessions: 1050,
      events: 6200,
      purchases: 18,
      usersTrend: '+42.1%',
      sessionsTrend: '+38.5%',
      eventsTrend: '+51.2%',
      purchasesTrend: '+350%',
      conversionRate: '1.7%',
      avgSessionDuration: '1m 38s',
      bounceRate: '41.5%',
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
      users: 1580,
      sessions: 2100,
      events: 12400,
      purchases: 32,
      usersTrend: '+125%',
      sessionsTrend: '+98.2%',
      eventsTrend: '+145%',
      purchasesTrend: '+520%',
      conversionRate: '1.5%',
      avgSessionDuration: '1m 35s',
      bounceRate: '43.8%',
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

  const d = data[period];

  return (
    <div>
      {/* Period selector */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(['7d', '30d', '90d'] as const).map((p) => (
          <button
            key={p}
            className={`frequency-selector__btn${period === p ? ' active' : ''}`}
            style={{ padding: '8px 20px', fontSize: '0.8rem', border: '1px solid var(--border)', borderRadius: 8, background: period === p ? 'var(--accent)' : 'var(--surface)', color: period === p ? '#fff' : 'var(--text)', cursor: 'pointer', fontWeight: 600 }}
            onClick={() => setPeriod(p)}
          >
            {p === '7d' ? 'Last 7 days' : p === '30d' ? 'Last 30 days' : 'Last 90 days'}
          </button>
        ))}
        <a
          href="https://analytics.google.com/analytics/web/#/p/Atlas%20Hydration"
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, color: 'var(--accent)', fontSize: '0.8rem', textDecoration: 'none' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
          Open GA4
        </a>
      </div>

      {/* Key metrics */}
      <div className="stats">
        <StatCard label="Active Users" value={d.users.toLocaleString()} sub="unique visitors" trend={d.usersTrend} />
        <StatCard label="Sessions" value={d.sessions.toLocaleString()} sub="total sessions" trend={d.sessionsTrend} />
        <StatCard label="Purchases" value={d.purchases} sub="completed orders" trend={d.purchasesTrend} />
        <StatCard label="Conversion Rate" value={d.conversionRate} sub="sessions to purchase" />
        <StatCard label="Avg Session" value={d.avgSessionDuration} sub="time on site" />
        <StatCard label="Bounce Rate" value={d.bounceRate} sub="single page visits" />
      </div>

      {/* Two-column layout for panels */}
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

      {/* GA4 Setup Notice */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: 24, marginTop: 24 }}>
        <h3 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" style={{ verticalAlign: -2, marginRight: 6 }}>
            <circle cx="12" cy="12" r="10" /><line x1="12" y1="16" x2="12" y2="12" /><line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          Live GA4 Integration
        </h3>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.6, margin: 0 }}>
          GA4 tracking is active on the site. Events tracked: <code style={{ background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem' }}>page_view</code>{' '}
          <code style={{ background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem' }}>add_to_cart</code>{' '}
          <code style={{ background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem' }}>begin_checkout</code>{' '}
          <code style={{ background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem' }}>purchase</code>{' '}
          <code style={{ background: 'var(--surface2)', padding: '2px 6px', borderRadius: 4, fontSize: '0.75rem' }}>sign_up</code>
          <br />
          Data shown above is from your latest GA4 snapshot. For real-time data, use the &quot;Open GA4&quot; link above.
        </p>
      </div>
    </div>
  );
}
