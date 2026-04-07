'use client';

import { useState, useMemo } from 'react';

// ─── EMAIL DATA ───
interface Email {
  id: string;
  num: number;
  subject: string;
  preheader: string;
  headline: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
  delay: string;
  status: 'Draft' | 'Ready' | 'Live';
}

interface Flow {
  name: string;
  key: string;
  emails: Email[];
}

const FLOWS: Flow[] = [
  {
    name: 'Welcome Series', key: 'welcome', emails: [
      { id: 'w1', num: 1, delay: 'Immediate', status: 'Ready', subject: 'Your 10% off is inside', preheader: 'Welcome to Atlas Hydration', headline: 'Welcome to Atlas.', body: "I built Atlas because I was tired of choosing between sugar-loaded sports drinks and plain water that doesn't hydrate. As a commercial pilot flying 787s across the Pacific, I needed something that actually worked.\n\nHere's 10% off your first order. No strings.", ctaText: 'Shop Now — 10% Off', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade' },
      { id: 'w2', num: 2, delay: 'Day 2', status: 'Ready', subject: 'Why I stopped drinking coffee before flights', preheader: 'The story behind Atlas', headline: 'I stopped drinking coffee before flights.', body: "At 40,000 feet, pressurized cabins pull moisture out of your body faster than you realize. Coffee made it worse. I started experimenting with electrolyte formulas between flights.\n\nNothing on the market was clean enough. So I built my own.", ctaText: 'Read the Story', ctaUrl: 'https://atlas-hydration.com/#founder' },
      { id: 'w3', num: 3, delay: 'Day 4', status: 'Ready', subject: 'Your sports drink is lying to you', preheader: 'The truth about hydration marketing', headline: 'Most sports drinks are sugar water with marketing.', body: "Liquid IV has 11g of sugar per serving. LMNT has no vitamins. Nuun barely has any electrolytes.\n\nAtlas has 1,769mg electrolytes, B vitamins, Vitamin C, and recovery amino acids. Zero sugar. 25 calories. Compare for yourself.", ctaText: 'See How We Compare', ctaUrl: 'https://atlas-hydration.com/#compare' },
      { id: 'w4', num: 4, delay: 'Day 7', status: 'Ready', subject: 'What happens after 30 days of proper hydration', preheader: 'Real results from real people', headline: '30 days changes everything.', body: "Better sleep. Sharper focus. Fewer afternoon crashes. That's what our subscribers report after the first month.\n\nIt's not magic. It's what happens when you give your body what it actually needs.", ctaText: 'Read Reviews', ctaUrl: 'https://atlas-hydration.com/#reviews' },
      { id: 'w5', num: 5, delay: 'Day 10', status: 'Ready', subject: 'Your discount expires tomorrow', preheader: 'Last chance for 10% off', headline: 'Last chance, {{ first_name|default:"there" }}.', body: "Your 10% discount expires tomorrow. After that, full price.\n\nOr subscribe and save 20% on every order. Free shipping. Cancel anytime. Most people choose this.", ctaText: 'Claim Your Discount', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade' },
    ],
  },
  {
    name: 'Abandoned Cart', key: 'cart', emails: [
      { id: 'c1', num: 1, delay: '1 hour', status: 'Ready', subject: 'You left something behind', preheader: 'Your Atlas cart is waiting', headline: 'Still thinking about it?', body: "You were close. Your cart is saved and ready.\n\nOne click to finish your order.", ctaText: 'Complete Your Order', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade' },
      { id: 'c2', num: 2, delay: '24 hours', status: 'Ready', subject: 'Zero sugar. 1,769mg electrolytes. No compromise.', preheader: 'The facts on Atlas Hydration', headline: 'Here is what you are getting.', body: "1,769mg electrolytes. 500mg potassium. 200mg magnesium. 600mg sodium. B vitamins. Vitamin C. L-Glutamine. L-Taurine.\n\nZero sugar. 25 calories. Made in the USA.\n\nNo artificial colors. No artificial sweeteners. No compromise.", ctaText: 'Try Atlas Risk-Free', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade' },
      { id: 'c3', num: 3, delay: '72 hours', status: 'Ready', subject: 'Last chance — your cart expires soon', preheader: 'Free shipping on your order', headline: 'Free shipping. Last chance.', body: "Your cart is about to expire. I added free shipping to make the decision easier.\n\nThis is the last email about this. No pressure.", ctaText: 'Get Free Shipping', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade' },
    ],
  },
  {
    name: 'Post-Purchase', key: 'post', emails: [
      { id: 'p1', num: 1, delay: 'Day 1', status: 'Ready', subject: 'Your Atlas order is confirmed', preheader: 'How to get the most from Atlas', headline: 'Your order is on its way.', body: "Mix one stick pack with 16oz of cold water. Best first thing in the morning, before a workout, or during travel.\n\nYou will notice the difference within the first few days.", ctaText: 'How to Use Atlas', ctaUrl: 'https://atlas-hydration.com/#how-to-use' },
      { id: 'p2', num: 2, delay: 'Day 7', status: 'Ready', subject: 'How are you feeling?', preheader: 'Your feedback means everything', headline: 'One week in. How is it going?', body: "I read every single review. Good or bad, it helps me make Atlas better.\n\nIf you have 30 seconds, I would genuinely appreciate your honest feedback.", ctaText: 'Leave a Review', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade#reviews' },
      { id: 'p3', num: 3, delay: 'Day 14', status: 'Ready', subject: 'The science behind what you are drinking', preheader: 'Why these specific ingredients', headline: 'Why these exact ingredients.', body: "Every ingredient in Atlas exists for a reason. No filler. No marketing ingredients.\n\n500mg potassium prevents cramps. 200mg magnesium supports sleep and recovery. 600mg sodium replaces what you lose in sweat.", ctaText: 'Read the Science', ctaUrl: 'https://atlas-hydration.com/#science' },
      { id: 'p4', num: 4, delay: 'Day 25', status: 'Ready', subject: 'Running low? Never run out again.', preheader: 'Subscribe and save 20%', headline: 'Never run out.', body: "If you are going through a stick a day (most people do), you are running low.\n\nSubscribe and save 20% on every delivery. Free shipping. Skip or cancel anytime. Most subscribers choose every 4 weeks.", ctaText: 'Subscribe & Save 20%', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade' },
    ],
  },
  {
    name: 'Winback', key: 'winback', emails: [
      { id: 'wb1', num: 1, delay: 'Day 60', status: 'Ready', subject: "It's been a while, Garrett here", preheader: 'We miss you at Atlas', headline: 'Hey {{ first_name|default:"there" }},', body: "It has been a while. No hard sell here.\n\nJust wanted to check in. We have been improving the formula, shipping faster, and building something worth coming back to.\n\nWhenever you are ready.", ctaText: 'Come Back', ctaUrl: 'https://atlas-hydration.com' },
      { id: 'wb2', num: 2, delay: 'Day 75', status: 'Ready', subject: 'A new flavor is coming. You will want this.', preheader: 'Grapefruit is almost here', headline: 'Grapefruit is coming.', body: "We have been working on a new flavor for months. Grapefruit. Bright, citrusy, clean.\n\nWaitlist subscribers get early access and 20% off the launch price. Thought you should know first.", ctaText: 'Join the Waitlist', ctaUrl: 'https://atlas-hydration.com/#grapefruit-waitlist' },
    ],
  },
];

// ─── HTML EMAIL TEMPLATE ───
function buildEmailHtml(email: Email): string {
  const body = email.body.replace(/\n/g, '<br><br>');
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${email.subject}</title></head>
<body style="margin:0;padding:0;background:#F0F0F0;font-family:-apple-system,'Helvetica Neue',Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0F0F0;">
<tr><td align="center" style="padding:24px 16px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#FFFFFF;">
<!-- HEADER -->
<tr><td style="background:#0F0F0F;padding:32px 40px;text-align:center;">
<div style="font-size:18px;font-weight:700;color:#FFFFFF;letter-spacing:0.2em;margin-bottom:12px;">ATLAS</div>
<div style="width:60px;height:2px;background:#C8514A;margin:0 auto;"></div>
</td></tr>
<!-- BODY -->
<tr><td style="background:#FFFFFF;padding:48px 40px;">
<div style="max-width:520px;margin:0 auto;">
<h1 style="font-size:28px;font-weight:700;color:#0D0D0D;line-height:1.2;margin:0 0 16px;">${email.headline}</h1>
<div style="font-size:16px;font-weight:400;color:#444444;line-height:1.7;margin:0 0 32px;">${body}</div>
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 32px;">
<tr><td style="background:#0D0D0D;border-radius:4px;">
<a href="${email.ctaUrl}" style="display:inline-block;padding:16px 32px;font-size:14px;font-weight:600;color:#FFFFFF;text-decoration:none;letter-spacing:0.05em;">${email.ctaText}</a>
</td></tr></table>
<div style="font-size:14px;color:#999999;margin-top:24px;">— Garrett</div>
</div>
</td></tr>
<!-- FOOTER -->
<tr><td style="background:#0F0F0F;padding:32px 40px;text-align:center;">
<div style="font-size:12px;color:#666666;line-height:1.6;">
<div style="margin-bottom:8px;"><a href="https://instagram.com/atlashydration" style="color:#C8514A;text-decoration:none;">Instagram</a> &nbsp;·&nbsp; <a href="https://tiktok.com/@atlashydration" style="color:#C8514A;text-decoration:none;">TikTok</a></div>
<div>Atlas Hydration &copy; 2026</div>
<div style="margin-top:4px;">You are receiving this because you signed up at atlas-hydration.com</div>
<div style="margin-top:8px;"><a href="{{ unsubscribe_url|default:'#' }}" style="color:#C8514A;text-decoration:none;">Unsubscribe</a></div>
</div>
</td></tr>
</table>
</td></tr></table>
</body></html>`;
}

// ─── MAIN COMPONENT ───
export default function EmailStudioTab() {
  const [activeFlow, setActiveFlow] = useState('welcome');
  const [selectedEmail, setSelectedEmail] = useState<string>('w1');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState('');

  const flow = FLOWS.find(f => f.key === activeFlow)!;
  const email = useMemo(() => {
    for (const f of FLOWS) {
      const e = f.emails.find(e => e.id === selectedEmail);
      if (e) return e;
    }
    return flow.emails[0];
  }, [selectedEmail, flow]);

  const html = useMemo(() => buildEmailHtml(email), [email]);

  const copyHtml = () => {
    navigator.clipboard.writeText(html);
    setCopied(email.id);
    setTimeout(() => setCopied(''), 2000);
  };

  const ghost: React.CSSProperties = {
    padding: '6px 14px', borderRadius: 6, fontSize: '0.72rem', fontWeight: 500,
    border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-dim)',
    cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.15s',
  };

  const card: React.CSSProperties = {
    background: '#161616', borderRadius: 14, border: '1px solid #272727', padding: 16,
  };

  return (
    <div style={{ padding: '0 4px' }}>
      <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginBottom: 24 }}>
        Design, preview, and export Klaviyo-ready emails
      </p>

      {/* Flow tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20, flexWrap: 'wrap' }}>
        {FLOWS.map(f => (
          <button key={f.key} onClick={() => { setActiveFlow(f.key); setSelectedEmail(f.emails[0].id); }} style={{
            ...ghost,
            ...(activeFlow === f.key ? { borderColor: 'var(--accent)', color: 'var(--accent)', background: 'var(--accent-dim)' } : {}),
          }}>
            {f.name} ({f.emails.length})
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16, alignItems: 'start' }}>
        {/* Left: email list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {flow.emails.map(e => (
            <button key={e.id} onClick={() => setSelectedEmail(e.id)} style={{
              ...card,
              borderColor: selectedEmail === e.id ? 'var(--accent)' : '#272727',
              cursor: 'pointer', textAlign: 'left',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span style={{ fontFamily: '"DM Mono", monospace', fontSize: '0.7rem', color: 'var(--accent)', fontWeight: 700 }}>
                  {String(e.num).padStart(2, '0')}
                </span>
                <span style={{ fontSize: '0.68rem', color: '#666', fontFamily: '"DM Mono", monospace' }}>{e.delay}</span>
                <span style={{
                  marginLeft: 'auto', fontSize: '0.58rem', fontWeight: 600, padding: '1px 6px', borderRadius: 4,
                  background: e.status === 'Live' ? 'rgba(22,163,74,0.15)' : e.status === 'Ready' ? 'var(--accent-dim)' : '#1C1C1C',
                  color: e.status === 'Live' ? '#16a34a' : e.status === 'Ready' ? 'var(--accent)' : '#666',
                  textTransform: 'uppercase', letterSpacing: '0.04em',
                }}>{e.status}</span>
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#fff', lineHeight: 1.3 }}>{e.subject}</div>
            </button>
          ))}
        </div>

        {/* Right: preview */}
        <div>
          {/* Preview controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <button onClick={() => setPreviewMode('desktop')} style={{
              ...ghost, ...(previewMode === 'desktop' ? { borderColor: '#fff', color: '#fff' } : {}),
            }}>Desktop</button>
            <button onClick={() => setPreviewMode('mobile')} style={{
              ...ghost, ...(previewMode === 'mobile' ? { borderColor: '#fff', color: '#fff' } : {}),
            }}>Mobile</button>
            <div style={{ flex: 1 }} />
            <button onClick={copyHtml} style={{
              ...ghost, ...(copied === email.id ? { borderColor: '#16a34a', color: '#16a34a' } : {}),
            }}>{copied === email.id ? 'Copied' : 'Copy HTML'}</button>
          </div>

          {/* Email info */}
          <div style={{ ...card, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: 2 }}>Subject</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#fff' }}>{email.subject}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.7rem', color: '#666', marginBottom: 2 }}>Preheader</div>
              <div style={{ fontSize: '0.78rem', color: '#999' }}>{email.preheader}</div>
            </div>
          </div>

          {/* Preview iframe */}
          <div style={{
            ...card, padding: 0, overflow: 'hidden',
            display: 'flex', justifyContent: 'center', background: '#E8E8E8',
          }}>
            <iframe
              srcDoc={html}
              title="Email preview"
              style={{
                width: previewMode === 'desktop' ? 600 : 375,
                height: 800, border: 'none', background: '#fff',
                transition: 'width 0.2s',
              }}
            />
          </div>
        </div>
      </div>

      <style>{`@media (max-width: 768px) { .email-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  );
}
