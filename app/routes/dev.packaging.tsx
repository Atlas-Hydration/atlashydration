export function meta() {
  return [
    { title: "Atlas Dev — Packaging Design" },
    { name: "robots", content: "noindex, nofollow" },
  ];
}

export default function DevPackagingPage() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .pkg-body { font-family: 'Inter', -apple-system, system-ui, sans-serif; background: #0a0a0b; color: #e8e8ed; min-height: 100vh; }
        .pkg-topbar {
          display: flex; align-items: center; justify-content: space-between;
          padding: 14px 32px; border-bottom: 1px solid #2a2a2d;
          background: rgba(10,10,11,0.92); backdrop-filter: blur(12px);
          position: sticky; top: 0; z-index: 100;
        }
        .pkg-topbar__left { display: flex; align-items: center; gap: 12px; }
        .pkg-topbar__logo { font-weight: 800; font-size: 0.95rem; }
        .pkg-topbar__badge { font-size: 0.58rem; font-weight: 700; padding: 3px 8px; border-radius: 4px; background: rgba(245,166,35,0.12); color: #f5a623; text-transform: uppercase; letter-spacing: 0.06em; }
        .pkg-topbar__back { font-size: 0.78rem; color: #8e8e93; text-decoration: none; }
        .pkg-topbar__back:hover { color: #e8e8ed; }

        .pkg-container { max-width: 1200px; margin: 0 auto; padding: 40px 32px; }
        .pkg-page-header { margin-bottom: 40px; }
        .pkg-page-header h1 { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 6px; }
        .pkg-page-header p { color: #8e8e93; font-size: 0.82rem; }

        .pkg-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 40px;
          align-items: start;
        }
        @media (max-width: 900px) {
          .pkg-grid { grid-template-columns: 1fr; }
        }

        .pkg-card {
          background: #141416; border: 1px solid #2a2a2d; border-radius: 16px;
          overflow: hidden;
        }
        .pkg-card__canvas {
          display: flex; justify-content: center; align-items: center;
          padding: 40px 32px; background: #111113;
        }
        .pkg-card__info { padding: 20px 24px; }
        .pkg-card__title { font-size: 0.95rem; font-weight: 700; margin-bottom: 4px; }
        .pkg-card__sub { font-size: 0.72rem; color: #8e8e93; }

        /* =============================================
           DESIGN A — Original Dark Premium
           ============================================= */
        .pouch-a {
          width: 400px; height: 500px;
          border-radius: 14px; overflow: hidden; position: relative;
          background: linear-gradient(165deg, #1a1a1f 0%, #0d0d10 50%, #1a1a1f 100%);
          box-shadow: 0 0 0 1px rgba(245,166,35,0.15), 0 16px 48px rgba(0,0,0,0.5), 0 0 80px rgba(245,166,35,0.06);
          font-family: 'Inter', -apple-system, system-ui, sans-serif;
        }
        .pouch-a::before {
          content: ''; position: absolute; top: -20%; right: -30%; width: 80%; height: 70%;
          background: radial-gradient(ellipse, rgba(245,166,35,0.10) 0%, transparent 70%);
          pointer-events: none;
        }

        .pouch-a .pa-content {
          position: relative; z-index: 5;
          display: flex; flex-direction: column; align-items: center; justify-content: space-between;
          height: 100%; padding: 28px 30px 22px; text-align: center;
        }
        .pouch-a .pa-top { width: 100%; }
        .pouch-a .pa-eyebrow {
          font-size: 0.5rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.18em;
          color: #f5a623; margin-bottom: 12px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .pouch-a .pa-eyebrow::before, .pouch-a .pa-eyebrow::after {
          content: ''; width: 16px; height: 1px;
          background: linear-gradient(90deg, transparent, #f5a623);
        }
        .pouch-a .pa-eyebrow::after { background: linear-gradient(90deg, #f5a623, transparent); }
        .pouch-a .pa-logo { margin-bottom: 6px; }
        .pouch-a .pa-logo img { height: 22px; width: auto; }
        .pouch-a .pa-subtitle {
          font-size: 0.5rem; font-weight: 500; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(232,232,237,0.45);
        }

        .pouch-a .pa-center {
          flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
          width: 100%;
        }
        .pouch-a .pa-fruit { width: 150px; height: 150px; margin-bottom: 14px; }
        .pouch-a .pa-fruit svg {
          width: 100%; height: 100%;
          filter: drop-shadow(0 8px 24px rgba(245,166,35,0.25));
        }
        .pouch-a .pa-flavor {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 1.9rem; font-weight: 700; color: #fff; margin-bottom: 4px; line-height: 1;
        }
        .pouch-a .pa-flavor-sub {
          font-size: 0.6rem; font-weight: 500; color: rgba(232,232,237,0.5);
          letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 16px;
        }

        .pouch-a .pa-nutrients {
          display: flex; gap: 1px; background: rgba(255,255,255,0.06);
          border-radius: 8px; overflow: hidden; width: 100%;
        }
        .pouch-a .pa-nutrient {
          flex: 1; padding: 10px 6px; text-align: center; background: rgba(255,255,255,0.02);
        }
        .pouch-a .pa-nutrient__val { font-size: 0.9rem; font-weight: 800; color: #fff; line-height: 1.1; }
        .pouch-a .pa-nutrient__val--hl { color: #f5a623; }
        .pouch-a .pa-nutrient__lbl {
          font-size: 0.44rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.06em; color: rgba(232,232,237,0.4); margin-top: 2px;
        }

        .pouch-a .pa-bottom { width: 100%; }
        .pouch-a .pa-badges {
          display: flex; align-items: center; justify-content: center;
          gap: 14px; margin-bottom: 10px;
        }
        .pouch-a .pa-badge {
          display: flex; align-items: center; gap: 3px;
          font-size: 0.46rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.05em; color: rgba(232,232,237,0.4);
        }
        .pouch-a .pa-badge svg { width: 10px; height: 10px; color: #f5a623; opacity: 0.7; }
        .pouch-a .pa-serving {
          font-size: 0.48rem; color: rgba(232,232,237,0.25); letter-spacing: 0.04em;
          border-top: 1px solid rgba(255,255,255,0.06); padding-top: 10px;
        }

        .pouch-a .pa-deco-l, .pouch-a .pa-deco-r { position: absolute; z-index: 2; pointer-events: none; }
        .pouch-a .pa-deco-l {
          top: 50%; left: 12px; transform: translateY(-50%);
          width: 1px; height: 90px;
          background: linear-gradient(180deg, transparent, rgba(245,166,35,0.12), transparent);
        }
        .pouch-a .pa-deco-r {
          top: 50%; right: 12px; transform: translateY(-50%);
          width: 1px; height: 90px;
          background: linear-gradient(180deg, transparent, rgba(245,166,35,0.12), transparent);
        }

        /* =============================================
           DESIGN B — Coral Gradient (Component 47)
           ============================================= */
        .pouch-b {
          width: 400px; height: 500px;
          border-radius: 14px; overflow: hidden; position: relative;
          background: linear-gradient(155deg, #f28b7d 0%, #e8735a 25%, #f09080 50%, #f5a693 75%, #f0c4b8 100%);
          box-shadow: 0 16px 48px rgba(0,0,0,0.5), 0 0 80px rgba(232,115,90,0.08);
          font-family: 'Inter', -apple-system, system-ui, sans-serif;
        }

        /* Diagonal light streak overlays */
        .pouch-b::before {
          content: ''; position: absolute; inset: 0;
          background:
            linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 40%),
            linear-gradient(145deg, transparent 30%, rgba(255,255,255,0.06) 45%, transparent 60%),
            linear-gradient(160deg, transparent 50%, rgba(255,255,255,0.04) 65%, transparent 80%);
          pointer-events: none; z-index: 1;
        }

        .pouch-b .pb-content {
          position: relative; z-index: 5;
          display: flex; flex-direction: column; justify-content: space-between;
          height: 100%; padding: 32px 30px 24px;
        }

        /* Top row: logo left, nutrients right */
        .pouch-b .pb-top {
          display: flex; justify-content: space-between; align-items: flex-start;
        }
        .pouch-b .pb-logo img { height: 24px; width: auto; filter: brightness(100); }

        .pouch-b .pb-stats { text-align: right; }
        .pouch-b .pb-stat { margin-bottom: 10px; }
        .pouch-b .pb-stat__val {
          font-size: 1.15rem; font-weight: 800; color: #fff; line-height: 1;
          letter-spacing: -0.02em;
        }
        .pouch-b .pb-stat__val span { font-size: 0.6em; font-weight: 600; }
        .pouch-b .pb-stat__lbl {
          font-size: 0.5rem; font-weight: 500; color: rgba(255,255,255,0.65);
          letter-spacing: 0.02em; margin-top: 1px;
        }

        /* Center / main text area */
        .pouch-b .pb-center { flex: 1; display: flex; flex-direction: column; justify-content: flex-end; padding-bottom: 8px; }
        .pouch-b .pb-headline {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2.8rem; font-weight: 700; color: #fff;
          line-height: 0.95; letter-spacing: -0.03em;
          margin-bottom: 8px;
        }
        .pouch-b .pb-subline {
          font-size: 0.85rem; font-weight: 400; color: rgba(255,255,255,0.7);
          letter-spacing: 0.01em; margin-bottom: 16px;
        }

        /* Flavor pill */
        .pouch-b .pb-pill {
          display: inline-flex; align-items: center; gap: 6px;
          background: rgba(255,255,255,0.92); color: #e8735a;
          font-size: 0.78rem; font-weight: 700;
          padding: 8px 20px; border-radius: 24px;
          letter-spacing: 0.01em;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          width: fit-content;
        }

        /* Bottom row */
        .pouch-b .pb-bottom {
          display: flex; justify-content: space-between; align-items: flex-end;
          margin-top: 16px;
        }
        .pouch-b .pb-packs {
          font-size: 0.56rem; font-weight: 600; color: rgba(255,255,255,0.55);
          letter-spacing: 0.04em;
        }
        .pouch-b .pb-bottom-stat { text-align: right; }
        .pouch-b .pb-bottom-stat__val {
          font-size: 1.1rem; font-weight: 800; color: #fff; line-height: 1;
        }
        .pouch-b .pb-bottom-stat__val span { font-size: 0.6em; font-weight: 600; }
        .pouch-b .pb-bottom-stat__lbl {
          font-size: 0.48rem; font-weight: 500; color: rgba(255,255,255,0.6);
          margin-top: 1px;
        }

        @media (max-width: 600px) {
          .pkg-container { padding: 20px 16px; }
          .pouch-a, .pouch-b { width: 320px; height: 400px; }
          .pouch-a .pa-content { padding: 20px 22px 16px; }
          .pouch-a .pa-logo img { height: 18px; }
          .pouch-a .pa-fruit { width: 110px; height: 110px; }
          .pouch-a .pa-flavor { font-size: 1.5rem; }
          .pouch-b .pb-content { padding: 24px 22px 18px; }
          .pouch-b .pb-headline { font-size: 2rem; }
          .pouch-b .pb-stat__val { font-size: 0.95rem; }
        }
      `}} />
      <div className="pkg-body">
        <div className="pkg-topbar">
          <div className="pkg-topbar__left">
            <span className="pkg-topbar__logo">Atlas Dev</span>
            <span className="pkg-topbar__badge">Packaging</span>
          </div>
          <div className="pkg-topbar__right">
            <a href="/atlashydration/dev/" className="pkg-topbar__back">&larr; Dashboard</a>
          </div>
        </div>

        <div className="pkg-container">
          <div className="pkg-page-header">
            <h1>Grapefruit Pouch — 2 Concepts</h1>
            <p>Stand-up pouch designs &bull; 5:4 portrait format &bull; 16 stick packs per pouch</p>
          </div>

          <div className="pkg-grid">

            {/* =========== DESIGN A: Dark Premium =========== */}
            <div className="pkg-card">
              <div className="pkg-card__canvas">
                <div className="pouch-a">
                  <div className="pa-deco-l"></div>
                  <div className="pa-deco-r"></div>

                  <div className="pa-content">
                    <div className="pa-top">
                      <div className="pa-eyebrow">Zero-Sugar Electrolytes</div>
                      <div className="pa-logo">
                        <img src="/atlashydration/logo.svg" alt="Atlas Hydration" />
                      </div>
                      <div className="pa-subtitle">Electrolyte Drink Mix</div>
                    </div>

                    <div className="pa-center">
                      <div className="pa-fruit">
                        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                          <defs>
                            <radialGradient id="gf-a-outer" cx="40%" cy="35%" r="55%">
                              <stop offset="0%" stopColor="#f7c948"/>
                              <stop offset="40%" stopColor="#f5a623"/>
                              <stop offset="100%" stopColor="#d4841a"/>
                            </radialGradient>
                            <radialGradient id="gf-a-inner" cx="45%" cy="40%" r="50%">
                              <stop offset="0%" stopColor="#ff9e8c"/>
                              <stop offset="50%" stopColor="#e8735a"/>
                              <stop offset="100%" stopColor="#c95a42"/>
                            </radialGradient>
                            <radialGradient id="gf-a-hl" cx="30%" cy="25%" r="40%">
                              <stop offset="0%" stopColor="rgba(255,255,255,0.35)"/>
                              <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                            </radialGradient>
                          </defs>
                          <circle cx="120" cy="110" r="60" fill="url(#gf-a-outer)" opacity="0.5"/>
                          <g transform="translate(70, 60)">
                            <circle cx="55" cy="55" r="55" fill="url(#gf-a-outer)"/>
                            <circle cx="55" cy="55" r="48" fill="#fef3dc"/>
                            <circle cx="55" cy="55" r="44" fill="url(#gf-a-inner)"/>
                            <g opacity="0.35">
                              <line x1="55" y1="11" x2="55" y2="99" stroke="#fef3dc" strokeWidth="1.5"/>
                              <line x1="55" y1="55" x2="11" y2="55" stroke="#fef3dc" strokeWidth="1"/>
                              <line x1="55" y1="55" x2="99" y2="55" stroke="#fef3dc" strokeWidth="1"/>
                              <line x1="55" y1="55" x2="23" y2="23" stroke="#fef3dc" strokeWidth="1"/>
                              <line x1="55" y1="55" x2="87" y2="23" stroke="#fef3dc" strokeWidth="1"/>
                              <line x1="55" y1="55" x2="23" y2="87" stroke="#fef3dc" strokeWidth="1"/>
                              <line x1="55" y1="55" x2="87" y2="87" stroke="#fef3dc" strokeWidth="1"/>
                            </g>
                            <circle cx="55" cy="55" r="6" fill="#fef3dc" opacity="0.5"/>
                            <circle cx="55" cy="55" r="44" fill="url(#gf-a-hl)"/>
                          </g>
                          <g transform="translate(105, 36) rotate(15)">
                            <path d="M0 18 Q8 -2 22 0 Q14 12 0 18Z" fill="#5a9e3e" opacity="0.8"/>
                            <line x1="0" y1="18" x2="18" y2="2" stroke="#4a8a32" strokeWidth="0.8" opacity="0.6"/>
                          </g>
                        </svg>
                      </div>
                      <div className="pa-flavor">Grapefruit</div>
                      <div className="pa-flavor-sub">Cold-Pressed Grapefruit Oil &bull; Natural Flavor</div>

                      <div className="pa-nutrients">
                        <div className="pa-nutrient">
                          <div className="pa-nutrient__val pa-nutrient__val--hl">600<span style={{fontSize:'0.55em',fontWeight:600}}>mg</span></div>
                          <div className="pa-nutrient__lbl">Sodium</div>
                        </div>
                        <div className="pa-nutrient">
                          <div className="pa-nutrient__val">500<span style={{fontSize:'0.55em',fontWeight:600}}>mg</span></div>
                          <div className="pa-nutrient__lbl">Potassium</div>
                        </div>
                        <div className="pa-nutrient">
                          <div className="pa-nutrient__val">200<span style={{fontSize:'0.55em',fontWeight:600}}>mg</span></div>
                          <div className="pa-nutrient__lbl">Magnesium</div>
                        </div>
                        <div className="pa-nutrient">
                          <div className="pa-nutrient__val">90<span style={{fontSize:'0.55em',fontWeight:600}}>mg</span></div>
                          <div className="pa-nutrient__lbl">Vitamin C</div>
                        </div>
                        <div className="pa-nutrient">
                          <div className="pa-nutrient__val">0<span style={{fontSize:'0.55em',fontWeight:600}}>g</span></div>
                          <div className="pa-nutrient__lbl">Sugar</div>
                        </div>
                      </div>
                    </div>

                    <div className="pa-bottom">
                      <div className="pa-badges">
                        <div className="pa-badge">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                          Non-GMO
                        </div>
                        <div className="pa-badge">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l2.5 2.5L16 9"/></svg>
                          Made in USA
                        </div>
                        <div className="pa-badge">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4"/><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                          3rd Party Tested
                        </div>
                      </div>
                      <div className="pa-serving">16 Stick Packs &bull; Net Wt. 4.5 oz (128g) &bull; 1 Stick (8g) per serving</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pkg-card__info">
                <div className="pkg-card__title">Design A — Dark Premium</div>
                <div className="pkg-card__sub">Dark background, centered fruit illustration, gold accents. Supplement-forward nutrient bar.</div>
              </div>
            </div>

            {/* =========== DESIGN B: Coral Gradient =========== */}
            <div className="pkg-card">
              <div className="pkg-card__canvas">
                <div className="pouch-b">
                  <div className="pb-content">
                    {/* Top: logo + nutrient stack */}
                    <div className="pb-top">
                      <div className="pb-logo">
                        <img src="/atlashydration/logo.svg" alt="Atlas" />
                      </div>
                      <div className="pb-stats">
                        <div className="pb-stat">
                          <div className="pb-stat__val">500<span>mg</span></div>
                          <div className="pb-stat__lbl">Potassium</div>
                        </div>
                        <div className="pb-stat">
                          <div className="pb-stat__val">200<span>mg</span></div>
                          <div className="pb-stat__lbl">Magnesium</div>
                        </div>
                        <div className="pb-stat">
                          <div className="pb-stat__val">600<span>mg</span></div>
                          <div className="pb-stat__lbl">Sodium</div>
                        </div>
                        <div className="pb-stat">
                          <div className="pb-stat__val">100%+</div>
                          <div className="pb-stat__lbl">B-Vitamins</div>
                        </div>
                        <div className="pb-stat">
                          <div className="pb-stat__val">0<span>g</span></div>
                          <div className="pb-stat__lbl">Sugar</div>
                        </div>
                      </div>
                    </div>

                    {/* Main headline */}
                    <div className="pb-center">
                      <div className="pb-headline">Daily<br/>Hydration</div>
                      <div className="pb-subline">Electrolytes with Vitamins</div>
                      <div className="pb-pill">Grapefruit Zest</div>
                    </div>

                    {/* Bottom row */}
                    <div className="pb-bottom">
                      <div className="pb-packs">16 Stick Packs</div>
                      <div className="pb-bottom-stat">
                        <div className="pb-bottom-stat__val">1,300<span>mg</span></div>
                        <div className="pb-bottom-stat__lbl">Total Electrolytes</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="pkg-card__info">
                <div className="pkg-card__title">Design B — Coral Gradient</div>
                <div className="pkg-card__sub">Warm grapefruit gradient, editorial typography, nutrient stack sidebar. Inspired by Component 47.</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
