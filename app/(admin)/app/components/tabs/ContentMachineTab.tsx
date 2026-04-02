'use client';

import { useState } from 'react';

export default function ContentMachineTab() {
  const [generating, setGenerating] = useState(false);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timestamp = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div style={{ padding: '0 4px' }}>
      {/* Stats bar */}
      <div className="stats-grid" style={{ marginBottom: 32 }}>
        <div className="stat-card">
          <div className="stat-card__label">TODAY&apos;S BATCH</div>
          <div className="stat-card__value">5</div>
          <div className="stat-card__sub">Slideshows</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">FORMAT</div>
          <div className="stat-card__value" style={{ fontSize: '1.4rem' }}>TikTok 9:16</div>
          <div className="stat-card__sub">1080 x 1920px</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">SLIDES PER DECK</div>
          <div className="stat-card__value">8</div>
          <div className="stat-card__sub">Slides</div>
        </div>
        <div className="stat-card">
          <div className="stat-card__label">LAST GENERATED</div>
          <div className="stat-card__value" style={{ fontSize: '1.1rem' }}>{timestamp}</div>
          <div className="stat-card__sub">{today}</div>
        </div>
      </div>

      {/* Empty state */}
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px', background: 'var(--surface)', borderRadius: 12,
        border: '1px solid var(--border)',
      }}>
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="1" style={{ marginBottom: 20, opacity: 0.4 }}>
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
          <path d="M7 8h2" />
          <path d="M7 11h4" />
          <path d="M15 8l-3 3 1.5 1.5L17 9" />
        </svg>
        <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
          No content generated yet
        </div>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: 24 }}>
          Generate 5 TikTok slideshows with AI-powered copy and premium design
        </div>
        <button
          className="topbar__refresh"
          style={{
            background: 'var(--accent)', color: '#fff', border: 'none',
            padding: '10px 24px', borderRadius: 8, fontWeight: 600, fontSize: '0.85rem',
            cursor: generating ? 'wait' : 'pointer', opacity: generating ? 0.6 : 1,
          }}
          disabled={generating}
          onClick={() => {
            setGenerating(true);
            setTimeout(() => setGenerating(false), 2000);
          }}
        >
          {generating ? 'Generating...' : "Generate Today's Batch"}
        </button>
      </div>
    </div>
  );
}
