'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';

// ─── TYPES ───────────────────────────────────────────────────────────────────

interface Email {
  id: string;
  num: number;
  subject: string;
  preheader: string;
  eyebrow: string;
  headline: string;
  subheadline: string;
  body: string;
  ctaText: string;
  ctaUrl: string;
  delay: string;
  status: 'Draft' | 'Ready' | 'Live';
  theme: 'dark' | 'light';
  flow: FlowKey;
}

type FlowKey = 'welcome' | 'cart' | 'post' | 'winback';

interface Flow {
  key: FlowKey;
  label: string;
  color: string;
}

// ─── FLOWS ───────────────────────────────────────────────────────────────────

const FLOWS: Flow[] = [
  { key: 'welcome', label: 'Welcome', color: '#C8514A' },
  { key: 'cart', label: 'Abandoned Cart', color: '#D4A053' },
  { key: 'post', label: 'Post-Purchase', color: '#5B9A6F' },
  { key: 'winback', label: 'Winback', color: '#6B8DD6' },
];

// ─── EMAIL DATA ──────────────────────────────────────────────────────────────

const EMAILS: Email[] = [
  // WELCOME FLOW (5)
  {
    id: 'w1', num: 1, flow: 'welcome', delay: 'Immediate', status: 'Ready', theme: 'dark',
    subject: 'Welcome to Atlas — here is what you need to know',
    preheader: 'Premium hydration, zero sugar, built by a pilot.',
    eyebrow: 'WELCOME TO ATLAS',
    headline: 'Hydration that actually works.',
    subheadline: 'Premium electrolytes. Zero sugar. Built for people who demand more.',
    body: 'You just joined a community that takes hydration seriously.<br><br>Here is what makes Atlas different:<br><br>&#10003; 1,769mg electrolytes per serving — more than the leading brands<br>&#10003; Zero sugar, zero artificial sweeteners, zero junk<br>&#10003; Created by a commercial pilot who needed hydration that actually performed<br><br>Your body loses up to 2 liters of water per day through normal activity. Most people replace volume but not electrolytes. Atlas fixes that.',
    ctaText: 'Shop Now', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade',
  },
  {
    id: 'w2', num: 2, flow: 'welcome', delay: '1 day', status: 'Ready', theme: 'light',
    subject: 'Why a pilot built an electrolyte brand',
    preheader: 'At 35,000 feet, dehydration hits different.',
    eyebrow: 'THE FOUNDER STORY',
    headline: 'At 35,000 feet, dehydration is your enemy.',
    subheadline: 'The cabin air has 4% humidity. Your body pays the price.',
    body: 'I am Garrett, founder of Atlas.<br><br>As a commercial pilot, I spend hours in cabin air drier than the Sahara. I tried every electrolyte brand on the market. They were all loaded with sugar, artificial flavors, or both.<br><br>So I built my own. I worked with food scientists for 14 months to create a formula with clinical-grade electrolytes — sodium, potassium, magnesium — in the ratios your body actually needs.<br><br>No sugar. No compromise. Just hydration that works as hard as you do.<br><br>— Garrett',
    ctaText: 'Try Atlas Today', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade',
  },
  {
    id: 'w3', num: 3, flow: 'welcome', delay: '3 days', status: 'Ready', theme: 'dark',
    subject: '11 grams of sugar — and that is the "healthy" option',
    preheader: 'The truth about your current electrolyte mix.',
    eyebrow: 'THE SCIENCE',
    headline: '11 grams of sugar per serving. That is Liquid IV.',
    subheadline: 'We thought you should know what is really in your hydration.',
    body: 'Most electrolyte brands market themselves as healthy. Here is what they do not tell you:<br><br>Liquid IV: 11g sugar per serving<br>Gatorade: 34g sugar per bottle<br>LMNT: Great electrolytes, but limited flavors and $1.50/stick<br><br>Atlas: 0g sugar. 1,769mg electrolytes. 16 stick packs per box.<br><br>We did not create Atlas to compete. We created it because every option had a tradeoff we were not willing to accept. You should not have to choose between taste, performance, and clean ingredients.',
    ctaText: 'See the Difference', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade',
  },
  {
    id: 'w4', num: 4, flow: 'welcome', delay: '5 days', status: 'Ready', theme: 'light',
    subject: 'Do not take our word for it',
    preheader: 'Real reviews from real customers.',
    eyebrow: 'SOCIAL PROOF',
    headline: 'What our customers actually say.',
    subheadline: 'Hundreds of 5-star reviews. Here are a few favorites.',
    body: '"I have tried every electrolyte on the market. Atlas is the first one I actually look forward to drinking." — Sarah M.<br><br>"As a nurse working 12-hour shifts, I need hydration that keeps up. Atlas does exactly that." — James R.<br><br>"Zero sugar and it actually tastes good? I was skeptical. Now I am subscribed." — Michelle T.<br><br>These are not paid reviews. These are real people who switched to Atlas and never looked back.',
    ctaText: 'Join Them', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade',
  },
  {
    id: 'w5', num: 5, flow: 'welcome', delay: '7 days', status: 'Ready', theme: 'dark',
    subject: 'Your 10% off expires in 24 hours',
    preheader: 'Last chance to try Atlas at a discount.',
    eyebrow: 'LAST CHANCE',
    headline: 'Your 10% off expires in 24 hours.',
    subheadline: 'This is your final reminder. After this, the code is gone.',
    body: 'When you signed up, we promised you 10% off your first order. That offer expires tomorrow.<br><br>Here is what you get with Atlas:<br><br>&#10003; 1,769mg premium electrolytes<br>&#10003; Zero sugar, zero artificial sweeteners<br>&#10003; Tastes incredible — Strawberry Lemonade<br>&#10003; Free shipping on orders over $50<br>&#10003; 30-day money-back guarantee<br><br>Use code WELCOME10 at checkout. This is the last time we will send this.',
    ctaText: 'Claim 10% Off', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade',
  },

  // ABANDONED CART FLOW (3)
  {
    id: 'c1', num: 1, flow: 'cart', delay: '1 hour', status: 'Ready', theme: 'dark',
    subject: 'You left something behind',
    preheader: 'Your Atlas is waiting for you.',
    eyebrow: 'YOUR CART',
    headline: 'Still thinking about it?',
    subheadline: 'Your cart is saved — but not for long.',
    body: 'We noticed you left Atlas in your cart. No pressure — but we wanted to make sure nothing went wrong at checkout.<br><br>Your items are reserved for now, but we cannot hold them forever. Finish your order and start hydrating the right way.',
    ctaText: 'Complete Your Order', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade',
  },
  {
    id: 'c2', num: 2, flow: 'cart', delay: '24 hours', status: 'Ready', theme: 'light',
    subject: 'Here is why they switched',
    preheader: 'The numbers do not lie.',
    eyebrow: 'STILL ON THE FENCE?',
    headline: 'Let the numbers speak.',
    subheadline: 'See how Atlas compares to what you have been drinking.',
    body: 'We get it — there are a lot of electrolyte options out there. Here is how Atlas stacks up:<br><br>More electrolytes than Liquid IV. Zero sugar vs their 11g. Better price per serving than LMNT.<br><br>We built Atlas because we were tired of the same tradeoffs. You do not have to choose between clean ingredients and great taste anymore.',
    ctaText: 'Return to Cart', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade',
  },
  {
    id: 'c3', num: 3, flow: 'cart', delay: '3 days', status: 'Ready', theme: 'dark',
    subject: 'Your cart is about to expire',
    preheader: 'Last chance to complete your order.',
    eyebrow: 'FINAL REMINDER',
    headline: 'Your cart expires soon.',
    subheadline: 'This is our last reminder about your saved items.',
    body: 'This is the last time we will email you about this cart.<br><br>Your items are still reserved, but we will release them soon to make room for other orders.<br><br>If you are ready, now is the time. If not, no hard feelings — we will be here when you are.',
    ctaText: 'Finish Checkout', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade',
  },

  // POST-PURCHASE FLOW (4)
  {
    id: 'p1', num: 1, flow: 'post', delay: 'Immediate', status: 'Ready', theme: 'light',
    subject: 'Your order is confirmed — here is how to make the perfect mix',
    preheader: 'Pro tips for getting the most out of Atlas.',
    eyebrow: 'ORDER CONFIRMED',
    headline: 'Your Atlas is on its way.',
    subheadline: 'Here is everything you need to get started.',
    body: 'Thank you for your order. You made a great choice.<br><br>Here is how to make the perfect mix:<br><br>1. Add one stick to 12-16 oz of cold water<br>2. Shake or stir for 10 seconds<br>3. Drink first thing in the morning or during activity<br><br>Pro tip: Start with 14 oz of water for the perfect balance of flavor and electrolyte concentration. Cold water tastes best.',
    ctaText: 'Track Your Order', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade',
  },
  {
    id: 'p2', num: 2, flow: 'post', delay: '7 days', status: 'Ready', theme: 'dark',
    subject: 'How are you feeling?',
    preheader: 'Garrett here — just checking in.',
    eyebrow: 'DAY 7',
    headline: 'How are you feeling?',
    subheadline: 'You have been hydrating with Atlas for a week now.',
    body: 'Hey — Garrett here, founder of Atlas.<br><br>You have had your Atlas for about a week now, and I wanted to check in. Most of our customers notice a difference in energy and focus within the first few days.<br><br>If you love it, we would be grateful if you left us a review. If something is not right, just reply to this email — I read every single one.<br><br>Your feedback is what makes Atlas better.',
    ctaText: 'Leave a Review', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade',
  },
  {
    id: 'p3', num: 3, flow: 'post', delay: '14 days', status: 'Ready', theme: 'light',
    subject: 'What is actually happening inside your body',
    preheader: 'The science behind why you feel better.',
    eyebrow: 'THE SCIENCE',
    headline: 'What is actually happening in your body.',
    subheadline: 'A quick look at the science behind Atlas.',
    body: 'You have been using Atlas for two weeks. Here is what is happening:<br><br>Sodium and potassium regulate fluid balance between your cells. Most people are deficient in both — especially if you exercise, drink coffee, or spend time in dry environments.<br><br>Magnesium supports over 300 enzymatic reactions including muscle function and sleep quality.<br><br>Atlas delivers all three in the ratios recommended by exercise physiologists — without the sugar that would spike your insulin and actually impair absorption.',
    ctaText: 'Learn More', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade',
  },
  {
    id: 'p4', num: 4, flow: 'post', delay: '25 days', status: 'Ready', theme: 'dark',
    subject: 'Running low? Never run out again.',
    preheader: 'Subscribe and save 15%.',
    eyebrow: 'RUNNING LOW?',
    headline: 'Never run out of Atlas again.',
    subheadline: 'Subscribe and save 15% on every order.',
    body: 'If you have been using Atlas daily, you are probably running low right about now.<br><br>Our Subscribe & Save plan makes sure you never run out:<br><br>&#10003; 15% off every order<br>&#10003; Free shipping, always<br>&#10003; Skip, pause, or cancel anytime<br>&#10003; Choose your delivery frequency<br><br>Most of our subscribers choose monthly delivery. Set it and forget it — your body will thank you.',
    ctaText: 'Subscribe & Save 15%', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade',
  },

  // WINBACK FLOW (2)
  {
    id: 'wb1', num: 1, flow: 'winback', delay: '30 days', status: 'Ready', theme: 'light',
    subject: 'Garrett here — just checking in',
    preheader: 'We have not seen you in a while.',
    eyebrow: 'IT HAS BEEN A WHILE',
    headline: 'Garrett here. Just checking in.',
    subheadline: 'We noticed you have not reordered in a while.',
    body: 'Hey — it has been a while since your last order, and I wanted to reach out personally.<br><br>If you loved Atlas, we would love to have you back. If something was not right, I genuinely want to know — just reply to this email.<br><br>Either way, here is 15% off your next order as a thank you for being an early supporter. Use code MISSYOU15 at checkout.<br><br>— Garrett',
    ctaText: 'Come Back & Save 15%', ctaUrl: 'https://atlas-hydration.com/products/strawberry-lemonade',
  },
  {
    id: 'wb2', num: 2, flow: 'winback', delay: '45 days', status: 'Ready', theme: 'dark',
    subject: 'Grapefruit is almost here',
    preheader: 'Our new flavor drops soon — get early access.',
    eyebrow: 'NEW FLAVOR DROPPING SOON',
    headline: 'Grapefruit is almost here.',
    subheadline: 'Be the first to try our newest flavor.',
    body: 'We have been working on something new — and we think you are going to love it.<br><br>Atlas Grapefruit is almost ready. Same premium electrolytes. Same zero sugar formula. A completely new, refreshingly bold citrus flavor.<br><br>As a previous customer, you get early access before we launch publicly. Drop your email on the waitlist and we will notify you the moment it is live.',
    ctaText: 'Get Early Access', ctaUrl: 'https://atlas-hydration.com/products/grapefruit',
  },
];

// ─── BUILD EMAIL HTML ────────────────────────────────────────────────────────

function buildEmailHtml(email: Email): string {
  const isDark = email.theme === 'dark';
  const heroBg = isDark ? '#0A0A0A' : '#F7F5F2';
  const heroText = isDark ? '#FFFFFF' : '#111111';
  const heroSub = isDark ? '#888888' : '#666666';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>${email.subject}</title>
  <!--[if !mso]><!-->
  <style>body{margin:0;padding:0;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;}table{border-spacing:0;}td{padding:0;}img{border:0;line-height:100%;}</style>
  <!--<![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#F0F0F0;">
  <span style="display:none;font-size:1px;color:#F0F0F0;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${email.preheader}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F0F0F0;">
    <tr>
      <td align="center" style="padding:24px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#FFFFFF;">

          <!-- HEADER -->
          <tr>
            <td style="background-color:#0A0A0A;padding:20px 32px;border-bottom:2px solid #C8514A;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.2em;color:#FFFFFF;text-transform:uppercase;">ATLAS</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- HERO -->
          <tr>
            <td style="background-color:${heroBg};padding:48px 40px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:'Courier New',Courier,monospace;font-size:10px;font-weight:600;letter-spacing:0.15em;color:#C8514A;text-transform:uppercase;padding-bottom:16px;">${email.eyebrow}</td>
                </tr>
                <tr>
                  <td style="font-family:Georgia,'Times New Roman',Times,serif;font-size:36px;font-weight:800;line-height:1.15;color:${heroText};padding-bottom:12px;">${email.headline}</td>
                </tr>
                <tr>
                  <td style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.5;color:${heroSub};padding-bottom:0;">${email.subheadline}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="background-color:#FFFFFF;padding:36px 40px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.8;color:#333333;">${email.body}</td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- CTA -->
          <tr>
            <td style="background-color:#0A0A0A;padding:36px 40px;" align="center">
              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="background-color:#C8514A;border-radius:2px;">
                    <a href="${email.ctaUrl}" target="_blank" style="display:inline-block;padding:14px 36px;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#FFFFFF;text-decoration:none;">${email.ctaText}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#0A0A0A;padding:28px 40px;border-top:1px solid #222222;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;font-weight:600;letter-spacing:0.2em;color:#555555;text-transform:uppercase;padding-bottom:10px;">ATLAS HYDRATION</td>
                </tr>
                <tr>
                  <td align="center" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:11px;color:#444444;padding-bottom:6px;">
                    <a href="#" style="color:#666666;text-decoration:underline;">Unsubscribe</a>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;font-size:10px;color:#444444;">&copy; 2026 Atlas Hydration. All rights reserved.</td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function EmailStudioTab() {
  const [activeFlow, setActiveFlow] = useState<FlowKey>('welcome');
  const [selectedId, setSelectedId] = useState<string>('w1');
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [copied, setCopied] = useState(false);
  const [klaviyoKey, setKlaviyoKey] = useState('');
  const [klaviyoStatus, setKlaviyoStatus] = useState<'idle' | 'connected' | 'error'>('idle');
  const [syncing, setSyncing] = useState(false);
  const [syncResults, setSyncResults] = useState<Record<string, string>>({});
  const [showSettings, setShowSettings] = useState(false);

  // Load Klaviyo key from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('atlas_klaviyo_key');
    if (saved) { setKlaviyoKey(saved); testKlaviyoConnection(saved); }
  }, []);

  async function testKlaviyoConnection(key: string) {
    try {
      // Test via our server-side route to avoid CORS
      const res = await fetch('/api/klaviyo-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: key, emailIndex: 0 }),
      });
      const data = await res.json();
      // If first template syncs or already exists, connection works
      setKlaviyoStatus(data.results?.[0]?.status === 'created' || data.results?.[0]?.status === 'updated' ? 'connected' : 'error');
      if (data.results?.[0]?.id) {
        setSyncResults(prev => ({ ...prev, [EMAILS[0].id]: data.results[0].id }));
      }
    } catch { setKlaviyoStatus('error'); }
  }

  function saveKlaviyoKey(key: string) {
    setKlaviyoKey(key);
    localStorage.setItem('atlas_klaviyo_key', key);
    if (key) { setKlaviyoStatus('idle'); testKlaviyoConnection(key); }
    else setKlaviyoStatus('idle');
    setShowSettings(false);
  }

  async function syncAllToKlaviyo() {
    if (!klaviyoKey) { setShowSettings(true); return; }
    setSyncing(true);
    try {
      const res = await fetch('/api/klaviyo-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: klaviyoKey }),
      });
      const data = await res.json();
      if (data.results) {
        const newResults: Record<string, string> = {};
        data.results.forEach((r: { name: string; id?: string }, i: number) => {
          if (r.id && EMAILS[i]) newResults[EMAILS[i].id] = r.id;
        });
        setSyncResults(prev => ({ ...prev, ...newResults }));
        setKlaviyoStatus('connected');
      }
    } catch { /* */ }
    setSyncing(false);
  }

  const flowEmails = useMemo(() => EMAILS.filter((e) => e.flow === activeFlow), [activeFlow]);
  const selectedEmail = useMemo(() => EMAILS.find((e) => e.id === selectedId) ?? EMAILS[0], [selectedId]);

  const handleCopy = useCallback(() => {
    const html = buildEmailHtml(selectedEmail);
    navigator.clipboard.writeText(html).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [selectedEmail]);

  const handleFlowChange = useCallback((key: FlowKey) => {
    setActiveFlow(key);
    const first = EMAILS.find((e) => e.flow === key);
    if (first) setSelectedId(first.id);
  }, []);

  const previewHtml = useMemo(() => buildEmailHtml(selectedEmail), [selectedEmail]);

  // ── Stats ──
  const stats = [
    { label: 'TOTAL EMAILS', value: '14' },
    { label: 'FLOWS', value: '4' },
    { label: 'READY', value: '14 / 14' },
    { label: 'FORMAT', value: 'Klaviyo' },
  ];

  // ── Styles ──
  const s = {
    wrap: { padding: '24px', fontFamily: "'Inter', -apple-system, sans-serif", color: '#E0E0E0', minHeight: '100vh' } as React.CSSProperties,
    statsBar: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' as const } as React.CSSProperties,
    statCard: { flex: '1 1 140px', background: '#161616', border: '1px solid #272727', borderRadius: '8px', padding: '16px 20px' } as React.CSSProperties,
    statLabel: { fontSize: '10px', fontWeight: 600, letterSpacing: '0.1em', color: '#666', marginBottom: '4px', textTransform: 'uppercase' as const } as React.CSSProperties,
    statValue: { fontSize: '20px', fontWeight: 700, color: '#FFF' } as React.CSSProperties,
    main: { display: 'flex', gap: '16px', height: 'calc(100vh - 180px)', minHeight: '500px' } as React.CSSProperties,
    left: { width: '340px', minWidth: '340px', display: 'flex', flexDirection: 'column' as const, gap: '12px' } as React.CSSProperties,
    flowTabs: { display: 'flex', gap: '6px', flexWrap: 'wrap' as const } as React.CSSProperties,
    list: { flex: 1, overflowY: 'auto' as const, display: 'flex', flexDirection: 'column' as const, gap: '6px', paddingRight: '4px' } as React.CSSProperties,
    right: { flex: 1, display: 'flex', flexDirection: 'column' as const, background: '#161616', border: '1px solid #272727', borderRadius: '8px', overflow: 'hidden' } as React.CSSProperties,
    rightHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #272727', background: '#111' } as React.CSSProperties,
    iframe: { flex: 1, border: 'none', background: '#F0F0F0' } as React.CSSProperties,
  };

  return (
    <div style={s.wrap}>
      {/* Stats Bar */}
      <div style={s.statsBar}>
        {stats.map((st) => (
          <div key={st.label} style={s.statCard}>
            <div style={s.statLabel}>{st.label}</div>
            <div style={s.statValue}>{st.value}</div>
          </div>
        ))}
      </div>

      {/* Klaviyo Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{
          fontSize: '0.7rem', fontWeight: 600, padding: '3px 10px', borderRadius: 4,
          background: klaviyoStatus === 'connected' ? 'rgba(22,163,74,0.15)' : klaviyoStatus === 'error' ? 'rgba(200,81,74,0.15)' : '#1C1C1C',
          color: klaviyoStatus === 'connected' ? '#16a34a' : klaviyoStatus === 'error' ? '#C8514A' : '#666',
        }}>
          {klaviyoStatus === 'connected' ? 'KLAVIYO CONNECTED' : klaviyoStatus === 'error' ? 'KLAVIYO ERROR' : 'KLAVIYO NOT CONNECTED'}
        </div>
        <button onClick={() => setShowSettings(true)} style={{
          padding: '4px 12px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 500,
          border: '1px solid #272727', background: 'transparent', color: '#888',
          cursor: 'pointer', fontFamily: 'inherit',
        }}>Settings</button>
        {klaviyoStatus === 'connected' && (
          <button onClick={syncAllToKlaviyo} disabled={syncing} style={{
            padding: '4px 12px', borderRadius: 6, fontSize: '0.7rem', fontWeight: 600,
            border: 'none', background: '#C8514A', color: '#fff',
            cursor: syncing ? 'wait' : 'pointer', fontFamily: 'inherit',
            opacity: syncing ? 0.6 : 1,
          }}>{syncing ? 'Syncing...' : 'Sync All to Klaviyo'}</button>
        )}
        <div style={{ flex: 1 }} />
        {Object.keys(syncResults).length > 0 && (
          <span style={{ fontSize: '0.65rem', color: '#16a34a' }}>
            {Object.keys(syncResults).length}/{EMAILS.length} synced
          </span>
        )}
      </div>

      {/* Klaviyo Settings Modal */}
      {showSettings && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setShowSettings(false)}>
          <div style={{ background: '#161616', borderRadius: 14, border: '1px solid #272727', padding: 28, width: 400, maxWidth: '90vw' }}
            onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#fff', marginBottom: 12 }}>Klaviyo API Key</div>
            <p style={{ fontSize: '0.78rem', color: '#888', marginBottom: 16, lineHeight: 1.5 }}>
              Get your key from: Klaviyo → Settings → API Keys → Create Private API Key.<br />
              Required scopes: templates:read, templates:write
            </p>
            <input
              type="password"
              placeholder="pk_..."
              defaultValue={klaviyoKey}
              onKeyDown={e => { if (e.key === 'Enter') saveKlaviyoKey((e.target as HTMLInputElement).value); }}
              style={{
                width: '100%', padding: '10px 14px', borderRadius: 8, border: '1px solid #272727',
                background: '#1C1C1C', color: '#fff', fontFamily: 'monospace', fontSize: '0.82rem', marginBottom: 12,
              }}
            />
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <button onClick={() => setShowSettings(false)} style={{
                padding: '8px 16px', borderRadius: 8, border: '1px solid #272727', background: 'transparent',
                color: '#888', fontSize: '0.78rem', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
              }}>Cancel</button>
              <button onClick={() => {
                const input = document.querySelector('input[placeholder="pk_..."]') as HTMLInputElement;
                saveKlaviyoKey(input?.value || '');
              }} style={{
                padding: '8px 16px', borderRadius: 8, border: 'none', background: '#C8514A',
                color: '#fff', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              }}>Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Main Layout */}
      <div style={s.main}>
        {/* Left Panel */}
        <div style={s.left}>
          {/* Flow Tabs */}
          <div style={s.flowTabs}>
            {FLOWS.map((f) => {
              const active = f.key === activeFlow;
              return (
                <button
                  key={f.key}
                  onClick={() => handleFlowChange(f.key)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    border: active ? `1px solid ${f.color}` : '1px solid #333',
                    background: active ? `${f.color}18` : 'transparent',
                    color: active ? f.color : '#888',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: 'inherit',
                  }}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Email List */}
          <div style={s.list}>
            {flowEmails.map((em) => {
              const sel = em.id === selectedId;
              const flowColor = FLOWS.find((f) => f.key === em.flow)?.color ?? '#C8514A';
              return (
                <button
                  key={em.id}
                  onClick={() => setSelectedId(em.id)}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left' as const,
                    padding: '14px 16px',
                    background: sel ? '#1E1E1E' : '#161616',
                    border: sel ? `1px solid ${flowColor}` : '1px solid #272727',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    fontFamily: 'inherit',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                      width: '24px', height: '24px', borderRadius: '50%',
                      background: `${flowColor}22`, color: flowColor,
                      fontSize: '11px', fontWeight: 700,
                    }}>
                      {em.num}
                    </span>
                    <span style={{ fontSize: '10px', color: '#666', fontWeight: 500 }}>{em.delay}</span>
                    <span style={{
                      marginLeft: 'auto', fontSize: '9px', fontWeight: 600,
                      padding: '2px 8px', borderRadius: '10px',
                      background: em.status === 'Ready' ? '#5B9A6F22' : em.status === 'Live' ? '#C8514A22' : '#66666622',
                      color: em.status === 'Ready' ? '#5B9A6F' : em.status === 'Live' ? '#C8514A' : '#888',
                      textTransform: 'uppercase' as const, letterSpacing: '0.05em',
                    }}>
                      {em.status}
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: sel ? '#FFF' : '#CCC', lineHeight: 1.3 }}>
                    {em.subject}
                  </div>
                  {syncResults[em.id] && (
                    <div style={{ fontSize: '9px', color: '#16a34a', marginTop: 2, display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#16a34a', display: 'inline-block' }} />
                      Synced · <a href={`https://www.klaviyo.com/email-templates/${syncResults[em.id]}/editor`} target="_blank" rel="noopener noreferrer" style={{ color: '#16a34a', textDecoration: 'none' }}>{syncResults[em.id]}</a>
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Panel */}
        <div style={s.right}>
          <div style={s.rightHeader}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                onClick={() => setPreviewMode('desktop')}
                style={{
                  padding: '5px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                  background: previewMode === 'desktop' ? '#272727' : 'transparent',
                  color: previewMode === 'desktop' ? '#FFF' : '#666',
                  fontSize: '12px', fontWeight: 600, fontFamily: 'inherit',
                }}
              >
                Desktop
              </button>
              <button
                onClick={() => setPreviewMode('mobile')}
                style={{
                  padding: '5px 12px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                  background: previewMode === 'mobile' ? '#272727' : 'transparent',
                  color: previewMode === 'mobile' ? '#FFF' : '#666',
                  fontSize: '12px', fontWeight: 600, fontFamily: 'inherit',
                }}
              >
                Mobile
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '11px', color: '#666' }}>
                {selectedEmail.theme === 'dark' ? 'Dark' : 'Light'} theme
              </span>
              <button
                onClick={handleCopy}
                style={{
                  padding: '6px 16px', borderRadius: '4px', border: '1px solid #C8514A',
                  background: copied ? '#C8514A' : 'transparent',
                  color: copied ? '#FFF' : '#C8514A',
                  fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                  transition: 'all 0.15s', fontFamily: 'inherit',
                }}
              >
                {copied ? 'Copied!' : 'Copy HTML'}
              </button>
            </div>
          </div>

          {/* Preview */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '20px', background: '#111', overflowY: 'auto' }}>
            <iframe
              srcDoc={previewHtml}
              style={{
                ...s.iframe,
                width: previewMode === 'desktop' ? '100%' : '375px',
                maxWidth: '100%',
                height: '100%',
                borderRadius: previewMode === 'mobile' ? '12px' : '0',
                boxShadow: previewMode === 'mobile' ? '0 0 0 3px #333' : 'none',
              }}
              title="Email Preview"
              sandbox="allow-same-origin"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
