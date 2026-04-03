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
  { num: '02', name: 'Problem Prioritization', desc: 'Rank customer pain points by urgency, frequency, and willingness to pay.', enabled: true,
    system: 'You are a sharp product strategist. Output structured tables and analysis with no filler. Be specific and data-driven.',
    prompt: `List the top 10 problems in the zero-sugar electrolyte and sports hydration industry. Atlas Hydration competes with Liquid IV, LMNT, Nuun, and DripDrop.

For each problem, score it on three dimensions:
- Urgency (1-10): how painful and time-sensitive it is right now
- Willingness to pay (1-10): how likely buyers are to spend money to solve it
- Growth trajectory: 'rising fast', 'stable', or 'declining'

Also add a Complaint signal column: yes/no for whether this problem surfaces frequently in reviews, forums, or sales calls.

Output as a markdown table with these exact columns:
| # | Problem | Urgency | WTP | Trend | Complaint Signal | Why it ranks here |

Sort by combined Urgency + WTP score, highest first. Output ONLY the table with a header row, no intro text, no outro.`,
  },
  { num: '03', name: 'Offer Creation', desc: 'Generate high-converting offer structures with pricing and positioning.', enabled: true,
    system: 'You are a direct response copywriter and offer strategist. Write tight, zero-filler copy that could go directly onto a real landing page.',
    prompt: `Create a high-converting offer for: Atlas Hydration zero-sugar electrolyte stick packs targeting health-conscious adults, frequent travelers, athletes, and people who want clean hydration without artificial ingredients or sugar.
Current product: 30-count box at $29.99, 1,769mg electrolytes per stick, B vitamins, Vitamin C, recovery amino acids, two flavors (Strawberry Lemonade and Grapefruit).

Structure the output exactly like a landing page with these labeled sections:
1. Headline: one bold benefit-driven statement
2. ICP: who this is for (age, role, situation, pain level)
3. Value proposition: the core transformation in one sentence
4. Offer components: what's included (deliverables, bonuses, format)
5. Pricing tiers: name, price, and what changes at each tier (low/mid/premium)
6. Guarantee: specific risk-reversal language the customer sees
7. Competitive edge: 3 reasons this beats the obvious alternatives

Keep each section tight. No filler. Write it as if going directly onto a real landing page.`,
  },
  { num: '04', name: 'Distribution Plan', desc: 'Map optimal channels, partnerships, and go-to-market sequencing.', enabled: true,
    system: 'You are a senior growth strategist. Be specific and realistic. Skip tactics that require a large team or $50k+ budget.',
    prompt: `Act as a senior growth strategist. Build a realistic 30-day distribution plan for Atlas Hydration: a zero-sugar electrolyte brand selling 30-count stick packs at $29.99, targeting health-conscious adults, athletes, pilots, and frequent travelers. Current team: 1-2 founders. Budget: under $5,000/month. Selling direct-to-consumer via Shopify.

Deliverables:
1. Top 5 acquisition channels: ranked by cost-efficiency for this specific audience
2. Content format per channel: one specific format that works on each (short-form video, cold email sequence, SEO article, etc.)
3. Weekly execution calendar: what happens in weeks 1, 2, 3, and 4 (not day-by-day)
4. Organic vs paid split: recommended % allocation and rationale
5. Leverage plays: 2-3 tactics that multiply reach without proportionally more effort (partnerships, repurposing, virality hooks)

Output as a numbered system with clear section headers. For the weekly calendar, use a markdown table with columns: Week | Focus | Key Actions | Expected Output.`,
  },
  { num: '05', name: 'Viral Content Engine', desc: 'Identify shareable content angles tied to your product and audience.', enabled: true,
    system: 'You are a viral content strategist who specializes in health and wellness brands. Write in the voice of the niche, not generic marketing language. Output with bold section headers.',
    prompt: `Create a viral content strategy for: Atlas Hydration, a zero-sugar electrolyte brand founded by a Boeing 787 commercial airline pilot. Audience: health-conscious adults 25-45, athletes, travelers, biohackers, and people interested in clean performance nutrition.

Deliver four components:

1. Hook bank: 10 high-converting hooks (not 20, prioritize quality). For each, label which emotional trigger it uses: fear of missing out, social status, curiosity, or controversy.

2. Content format matrix: a markdown table with these columns:
| Format | Platform | Ideal Length | Why It Spreads | Example Title |
Include 6-8 formats across at least 3 platforms.

3. Shareability audit: for each format, answer 'What makes someone forward or repost this?' in one sentence.

4. Repeatable content system: a simple weekly template as a markdown table:
| Day | Format | Topic Focus | Platform |
showing how many posts, which formats, and what rotation keeps the audience engaged without burnout.

Write hooks in the voice of the Atlas Hydration audience — pilots, athletes, travelers — not generic marketing copy.`,
  },
  { num: '06', name: 'Competitor Weakness Map', desc: 'Surface gaps and vulnerabilities in competitor positioning and execution.', enabled: true,
    system: 'You are a competitive intelligence analyst. Be specific about product gaps and audience blind spots. No generic observations.',
    prompt: `Analyze the top 5 competitors to Atlas Hydration in the zero-sugar electrolyte space: Liquid IV, LMNT, Nuun, DripDrop, and Pedialyte Sport.

For each competitor provide a structured row covering:
- Name + one-line description of their core offer
- What they do best (their defensible strength)
- Where they are weak (product gaps, poor reviews, underserved use cases)
- Which audience they ignore or underserve

Output the competitor breakdown as a markdown table with columns:
| Competitor | Core Offer | Strength | Weakness | Ignored Audience |

Then, based on patterns across all 5, provide:
- Gap analysis: the 2-3 clearest white spaces no competitor is owning
- Positioning recommendation: one sharp positioning statement that would differentiate Atlas Hydration
- Go-to-market angle: which ignored audience + which channel combination represents the fastest path to traction for Atlas

Output competitor table first, then gap analysis and recommendations as prose with bold section headers.`,
  },
  { num: '07', name: 'Scale System', desc: 'Design repeatable growth loops and automation opportunities.', enabled: false },
];

function formatReport(text: string) {
  return text.split('\n').map((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return <div key={i} style={{ height: 12 }} />;
    const isBold = /^(\*\*|#{1,3}\s|[0-9]+\.\s)/.test(trimmed);
    const clean = trimmed.replace(/^\*\*/, '').replace(/\*\*$/, '').replace(/^#{1,3}\s*/, '');
    if (isBold) {
      return <div key={i} style={{ fontWeight: 700, color: 'var(--text)', fontSize: '0.88rem', marginTop: 16, marginBottom: 6 }}>{clean}</div>;
    }
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

function scoreBadge(val: string) {
  const n = parseInt(val, 10);
  const bg = n >= 8 ? 'rgba(200,81,74,0.2)' : n >= 5 ? 'rgba(200,170,50,0.2)' : 'rgba(100,100,100,0.2)';
  const color = n >= 8 ? '#E8605A' : n >= 5 ? '#C5A832' : '#888';
  return <span style={{ display: 'inline-block', padding: '2px 8px', borderRadius: 4, fontSize: '0.72rem', fontWeight: 700, fontFamily: '"DM Mono", monospace', background: bg, color, minWidth: 28, textAlign: 'center' }}>{val}</span>;
}

function trendText(val: string) {
  const v = val.toLowerCase().trim();
  const color = v.includes('rising') ? '#16a34a' : v.includes('declining') ? '#E8605A' : '#888';
  return <span style={{ fontSize: '0.72rem', fontWeight: 600, color }}>{val}</span>;
}

function formatTable(text: string) {
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.startsWith('|'));
  if (lines.length < 2) return formatReport(text);

  const parseRow = (line: string) => line.split('|').slice(1, -1).map(c => c.trim());
  const headers = parseRow(lines[0]);
  const dataLines = lines.filter(l => !l.match(/^\|[\s-:|]+\|$/));
  const rows = dataLines.slice(1).map(parseRow);

  const thStyle: React.CSSProperties = {
    padding: '10px 12px', fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-dim)',
    textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'left',
    borderBottom: '1px solid var(--border)', whiteSpace: 'nowrap',
    position: 'sticky', top: 0, background: 'var(--surface)',
  };
  const tdStyle = (rowIdx: number): React.CSSProperties => ({
    padding: '10px 12px', fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.5,
    borderBottom: '1px solid var(--border)',
    background: rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
  });

  return (
    <div style={{ overflowX: 'auto', borderRadius: 8, border: '1px solid var(--border)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 700 }}>
        <thead>
          <tr>{headers.map((h, i) => <th key={i} style={thStyle}>{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              {row.map((cell, ci) => {
                const hdr = headers[ci]?.toLowerCase() || '';
                let content: React.ReactNode = cell;
                if (hdr === 'urgency' || hdr === 'wtp') content = scoreBadge(cell);
                else if (hdr === 'trend') content = trendText(cell);
                else if (hdr === '#') content = <span style={{ fontFamily: '"DM Mono", monospace', fontWeight: 700, color: 'var(--accent)', fontSize: '0.75rem' }}>{cell}</span>;
                else if (hdr === 'complaint signal') {
                  const yes = cell.toLowerCase().includes('yes');
                  content = <span style={{ fontSize: '0.72rem', fontWeight: 600, color: yes ? '#E8605A' : '#888' }}>{cell}</span>;
                }
                else if (hdr === 'problem') content = <span style={{ color: 'var(--text)', fontWeight: 500 }}>{cell}</span>;
                return <td key={ci} style={tdStyle(ri)}>{content}</td>;
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatMixed(text: string) {
  const blocks: { type: 'text' | 'table'; content: string }[] = [];
  const lines = text.split('\n');
  let tableLines: string[] = [];
  let textLines: string[] = [];

  const flushText = () => { if (textLines.length) { blocks.push({ type: 'text', content: textLines.join('\n') }); textLines = []; } };
  const flushTable = () => { if (tableLines.length) { blocks.push({ type: 'table', content: tableLines.join('\n') }); tableLines = []; } };

  for (const line of lines) {
    if (line.trim().startsWith('|')) {
      flushText();
      tableLines.push(line);
    } else {
      flushTable();
      textLines.push(line);
    }
  }
  flushText();
  flushTable();

  return blocks.map((b, i) => <div key={i}>{b.type === 'table' ? formatTable(b.content) : formatReport(b.content)}</div>);
}

function renderResult(toolNum: string, text: string) {
  if (toolNum === '02') return formatTable(text);
  if (toolNum === '04' || toolNum === '05' || toolNum === '06') return formatMixed(text);
  return formatReport(text);
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
                  {renderResult(tool.num, result)}
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
