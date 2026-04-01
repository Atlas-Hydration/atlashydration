'use client';

export default function PackingLabTab() {
  return (
    <div className="section">
      <div className="section__header">
        <h2 className="section__title">Packing Lab</h2>
        <span className="section__badge">Coming Soon</span>
      </div>
      <div
        style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius)',
          padding: '60px 40px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'var(--accent-dim)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
          }}
        >
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2"
          >
            <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>
        <div
          style={{
            fontSize: '1.1rem',
            fontWeight: 700,
            marginBottom: '8px',
            letterSpacing: '-0.02em',
          }}
        >
          Packing Lab
        </div>
        <div
          style={{
            fontSize: '0.82rem',
            color: 'var(--text-dim)',
            lineHeight: 1.6,
            maxWidth: '400px',
            margin: '0 auto',
          }}
        >
          Tools for managing packaging configurations, SKU setups, label generation,
          and production workflows. Coming soon.
        </div>
      </div>
    </div>
  );
}
