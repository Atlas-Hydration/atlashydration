'use client';

const TOOLS = [
  { num: '01', name: 'Market Breakdown', desc: 'Analyze your target market segments, demographics, and buying behaviors.' },
  { num: '02', name: 'Problem Prioritization', desc: 'Rank customer pain points by urgency, frequency, and willingness to pay.' },
  { num: '03', name: 'Offer Creation', desc: 'Generate high-converting offer structures with pricing and positioning.' },
  { num: '04', name: 'Distribution Plan', desc: 'Map optimal channels, partnerships, and go-to-market sequencing.' },
  { num: '05', name: 'Viral Content Engine', desc: 'Identify shareable content angles tied to your product and audience.' },
  { num: '06', name: 'Competitor Weakness Map', desc: 'Surface gaps and vulnerabilities in competitor positioning and execution.' },
  { num: '07', name: 'Scale System', desc: 'Design repeatable growth loops and automation opportunities.' },
];

export default function StrategyLabTab() {
  return (
    <div style={{ padding: '0 4px' }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: 4 }}>
          AI-powered business intelligence for Atlas Hydration
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 16,
      }}>
        {TOOLS.map((tool) => (
          <div key={tool.num} style={{
            background: 'var(--surface)',
            borderRadius: 14,
            border: '1px solid var(--border)',
            padding: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
            transition: 'border-color 0.15s',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{
                fontFamily: '"DM Mono", monospace',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: 'var(--accent)',
              }}>{tool.num}</span>
              <span style={{
                fontSize: '0.6rem',
                fontWeight: 600,
                padding: '2px 8px',
                borderRadius: 4,
                background: 'var(--surface2)',
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}>Ready</span>
            </div>
            <div>
              <div style={{
                fontSize: '0.95rem',
                fontWeight: 600,
                color: 'var(--text)',
                marginBottom: 4,
              }}>{tool.name}</div>
              <div style={{
                fontSize: '0.78rem',
                color: 'var(--text-dim)',
                lineHeight: 1.5,
              }}>{tool.desc}</div>
            </div>
            <button
              disabled
              style={{
                marginTop: 'auto',
                padding: '8px 16px',
                borderRadius: 8,
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--text-dim)',
                fontSize: '0.78rem',
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: 'not-allowed',
                opacity: 0.5,
                transition: 'all 0.15s',
              }}
            >Run Analysis</button>
          </div>
        ))}
      </div>
    </div>
  );
}
