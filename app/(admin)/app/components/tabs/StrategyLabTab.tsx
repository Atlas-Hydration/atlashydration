'use client';

import { useState, useCallback } from 'react';

interface ToolDef {
  num: string;
  name: string;
  desc: string;
  enabled: boolean;
  system?: string;
  prompt?: string;
}

const TOOLS: ToolDef[] = [
  {
    num: '01', name: 'Market Breakdown', desc: 'Analyze your target market segments, demographics, and buying behaviors.', enabled: true,
    system: 'You are a senior market analyst. Analyze markets using only specific, data-backed insights. No generic statements. Output clean structured sections with bold headers and concise bullet points. Total output under 600 words.',
    prompt: `Analyze the market for zero-sugar electrolyte drink mixes targeting health-conscious adults, athletes, travelers, and pilots. Atlas Hydration is a clean zero-sugar electrolyte brand with 1,769mg electrolytes per serving, B vitamins, Vitamin C, and recovery amino acids, priced at $29.99.

Deliver exactly four structured sections:
1. Market sizing: TAM, SAM, and SOM with estimated dollar values and assumptions
2. Top 5 demand trends: each as a one-line headline + two-sentence explanation
3. Top 5 underserved opportunities: specific gaps, not broad categories
4. Follow the money: 3-5 areas where VC, PE, or acquirer capital is actively flowing

Format each section with a bold heading then concise bullet points. Under 600 words total.`,
  },
  { num: '02', name: 'Problem Prioritization', desc: 'Rank customer pain points by urgency, frequency, and willingness to pay.', enabled: false },
  { num: '03', name: 'Offer Creation', desc: 'Generate high-converting offer structures with pricing and positioning.', enabled: false },
  { num: '04', name: 'Distribution Plan', desc: 'Map optimal channels, partnerships, and go-to-market sequencing.', enabled: false },
  { num: '05', name: 'Viral Content Engine', desc: 'Identify shareable content angles tied to your product and audience.', enabled: false },
  { num: '06', name: 'Competitor Weakness Map', desc: 'Surface gaps and vulnerabilities in competitor positioning and execution.', enabled: false },
  { num: '07', name: 'Scale System', desc: 'Design repeatable growth loops and automation opportunities.', enabled: false },
];

function formatReport(text: string) {
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} style={{ height: 12 }} />;
    // Bold headers: lines starting with ** or ## or numbered section headers
    const isBold = /^(\*\*|#{1,3}\s|[0-9]+\.\s)/.test(trimmed);
    const clean = trimmed.replace(/^\*\*/, '').replace(/\*\*$/, '').replace(/^#{1,3}\s*/, '');
    if (isBold) {
      return <div key={i} style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.88rem', marginTop: 16, marginBottom: 6 }}>{clean}</div>;
    }
    // Bullet points
    if (/^[-*]\s/.test(trimmed)) {
      return (
        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 4, paddingLeft: 4 }}>
          <span style={{ color: 'var(--accent)', flexShrink: 0 }}>-</span>
          <span style={{ color: 'var(--text-dim)', fontSize: '0.82rem', lineHeight: 1.6 }}>{trimmed.replace(/^[-*]\s*/, '')}</span>
        </div>
      );
    }
    return <div key={i} style={{ color: 'var(--text-dim)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: 4 }}>{trimmed}</div>;
  });
}

export default function StrategyLabTab() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<Record<string, string>>({});
  const [error, setError] = useState('');

  const runTool = useCallback(async (tool: ToolDef) => {
    if (!tool.system || !tool.prompt) return;
    setExpanded(tool.num);
    setLoading(tool.num);
    setError('');
    try {
      const res = await fetch('/api/strategy-lab', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: tool.system, prompt: tool.prompt }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `Error ${res.status}`);
      setResults(prev => ({ ...prev, [tool.num]: data.result }));
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Analysis failed');
    } finally {
      setLoading(null);
    }
  }, []);

  const card: React.CSSProperties = {
    background: 'var(--surface)', borderRadius: 14,
    border: '1px solid var(--border)', padding: 24,
    display: 'flex', flexDirection: 'column', gap: 12,
    transition: 'border-color 0.15s',
  };

  const ghost: React.CSSProperties = {
    padding: '8px 16px', borderRadius: 8, border: '1px solid var(--border)',
    background: 'transparent', color: 'var(--text-dim)', fontSize: '0.78rem',
    fontWeight: 600, fontFamily: 'inherit', cursor: 'pointer', transition: 'all 0.15s',
  };

  return (
    <div style={{ padding: '0 4px' }}>
      <div style={{ marginBottom: 32 }}>
        <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: 4 }}>
          AI-powered business intelligence for Atlas Hydration
        </p>
      </div>

      {error && (
        <div style={{ ...card, borderColor: 'var(--accent)', color: 'var(--accent)', fontSize: '0.85rem', marginBottom: 16 }}>{error}</div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: expanded ? '1fr' : 'repeat(2, 1fr)', gap: 16 }}>
        {TOOLS.map((tool) => {
          const isExpanded = expanded === tool.num;
          const isLoading = loading === tool.num;
          const result = results[tool.num];

          // If another tool is expanded, hide this one
          if (expanded && !isExpanded) return null;

          return (
            <div key={tool.num} style={{
              ...card,
              ...(isExpanded ? { gridColumn: '1 / -1' } : {}),
            }}>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent)' }}>{tool.num}</span>
                  <span style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text)' }}>{tool.name}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isExpanded && result && (
                    <button style={ghost} onClick={() => navigator.clipboard.writeText(result)}>Copy Report</button>
                  )}
                  {isExpanded && result && (
                    <button style={ghost} onClick={() => runTool(tool)}>Regenerate</button>
                  )}
                  {isExpanded && (
                    <button style={ghost} onClick={() => setExpanded(null)}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ verticalAlign: 'middle' }}>
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {!isExpanded && (
                    <span style={{
                      fontSize: '0.6rem', fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                      background: result ? 'rgba(22,163,74,0.15)' : 'var(--surface2)',
                      color: result ? '#16a34a' : 'var(--text-dim)',
                      textTransform: 'uppercase', letterSpacing: '0.06em',
                    }}>{result ? 'Done' : 'Ready'}</span>
                  )}
                </div>
              </div>

              {/* Description (compact view) */}
              {!isExpanded && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>{tool.desc}</div>
              )}

              {/* Loading skeleton */}
              {isExpanded && isLoading && (
                <div style={{ padding: '20px 0' }}>
                  {[1, 2, 3, 4, 5, 6].map(i => (
                    <div key={i} style={{
                      height: i % 3 === 0 ? 14 : 10,
                      background: 'var(--surface2)',
                      borderRadius: 4,
                      marginBottom: 10,
                      width: `${60 + Math.random() * 35}%`,
                      animation: 'pulse 1.5s ease-in-out infinite',
                      opacity: 0.5,
                    }} />
                  ))}
                  <style>{`@keyframes pulse { 0%,100% { opacity: 0.3; } 50% { opacity: 0.6; } }`}</style>
                </div>
              )}

              {/* Result */}
              {isExpanded && !isLoading && result && (
                <div style={{ padding: '8px 0', maxHeight: 600, overflowY: 'auto' }}>
                  {formatReport(result)}
                </div>
              )}

              {/* Run button */}
              {!isExpanded && (
                <button
                  disabled={!tool.enabled}
                  onClick={() => runTool(tool)}
                  style={{
                    marginTop: 'auto', padding: '8px 16px', borderRadius: 8,
                    border: '1px solid var(--border)', fontSize: '0.78rem', fontWeight: 600,
                    fontFamily: 'inherit', transition: 'all 0.15s',
                    background: tool.enabled ? 'var(--accent)' : 'transparent',
                    color: tool.enabled ? '#fff' : 'var(--text-dim)',
                    cursor: tool.enabled ? 'pointer' : 'not-allowed',
                    opacity: tool.enabled ? 1 : 0.5,
                  }}
                >Run Analysis</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
