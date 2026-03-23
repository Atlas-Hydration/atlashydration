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

        .pkg-container { max-width: 1100px; margin: 0 auto; padding: 40px 32px; }
        .pkg-page-header { margin-bottom: 40px; }
        .pkg-page-header h1 { font-size: 1.5rem; font-weight: 800; letter-spacing: -0.03em; margin-bottom: 6px; }
        .pkg-page-header p { color: #8e8e93; font-size: 0.82rem; }

        .pkg-canvas-area {
          display: flex; justify-content: center; align-items: center;
          padding: 60px 40px; background: #141416; border: 1px solid #2a2a2d;
          border-radius: 16px; min-height: 80vh;
        }

        .stick-pack {
          width: 480px; height: 640px;
          border-radius: 16px; overflow: hidden; position: relative;
          background: linear-gradient(165deg, #1a1a1f 0%, #0d0d10 50%, #1a1a1f 100%);
          box-shadow: 0 0 0 1px rgba(245,166,35,0.15), 0 20px 60px rgba(0,0,0,0.6), 0 0 120px rgba(245,166,35,0.08);
          font-family: 'Inter', -apple-system, system-ui, sans-serif;
        }
        .stick-pack::before {
          content: ''; position: absolute; top: -20%; right: -30%; width: 80%; height: 70%;
          background: radial-gradient(ellipse, rgba(245,166,35,0.12) 0%, transparent 70%);
          pointer-events: none;
        }
        .stick-pack::after {
          content: ''; position: absolute; bottom: -10%; left: -20%; width: 60%; height: 50%;
          background: radial-gradient(ellipse, rgba(232,146,42,0.08) 0%, transparent 70%);
          pointer-events: none;
        }

        .pack-texture {
          position: absolute; inset: 0;
          background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.008) 2px, rgba(255,255,255,0.008) 3px);
          pointer-events: none; z-index: 1;
        }

        .pack-notch { position: absolute; top: 0; left: 50%; transform: translateX(-50%); width: 40px; height: 6px; z-index: 10; }
        .pack-notch::before, .pack-notch::after {
          content: ''; position: absolute; top: 0; width: 16px; height: 6px;
          border-bottom: 2px dashed rgba(245,166,35,0.3);
        }
        .pack-notch::before { left: 0; }
        .pack-notch::after { right: 0; }
        .pack-notch-center {
          position: absolute; top: 0; left: 50%; transform: translateX(-50%);
          width: 8px; height: 8px; background: rgba(245,166,35,0.2);
          clip-path: polygon(50% 100%, 0 0, 100% 0);
        }

        .pack-content {
          position: relative; z-index: 5;
          display: flex; flex-direction: column; align-items: center; justify-content: space-between;
          height: 100%; padding: 32px 36px 28px; text-align: center;
        }

        .pack-top { width: 100%; }
        .pack-eyebrow {
          font-size: 0.58rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.2em;
          color: #f5a623; margin-bottom: 16px;
          display: flex; align-items: center; justify-content: center; gap: 8px;
        }
        .pack-eyebrow::before, .pack-eyebrow::after { content: ''; width: 20px; height: 1px; background: linear-gradient(90deg, transparent, #f5a623); }
        .pack-eyebrow::after { background: linear-gradient(90deg, #f5a623, transparent); }

        .pack-logo { margin-bottom: 8px; }
        .pack-logo svg { width: 180px; height: auto; }
        .pack-subtitle {
          font-family: 'Inter', -apple-system, system-ui, sans-serif;
          font-size: 0.6rem; font-weight: 500; letter-spacing: 0.22em; text-transform: uppercase;
          color: rgba(232,232,237,0.5);
        }

        .pack-center {
          flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
          width: 100%; position: relative;
        }

        .grapefruit-illustration { position: relative; width: 200px; height: 200px; margin-bottom: 20px; }
        .grapefruit-svg { width: 100%; height: 100%; filter: drop-shadow(0 10px 30px rgba(245,166,35,0.25)); }

        .pack-flavor {
          font-family: 'Playfair Display', Georgia, serif;
          font-size: 2.4rem; font-weight: 700; letter-spacing: -0.02em;
          color: #fff; margin-bottom: 6px; line-height: 1;
        }
        .pack-flavor-sub {
          font-size: 0.72rem; font-weight: 500; color: rgba(232,232,237,0.55);
          letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 20px;
        }

        .pack-nutrients {
          display: flex; gap: 1px; background: rgba(255,255,255,0.06);
          border-radius: 10px; overflow: hidden; width: 100%;
        }
        .pack-nutrient { flex: 1; padding: 12px 8px; text-align: center; background: rgba(255,255,255,0.02); }
        .pack-nutrient:first-child { border-radius: 10px 0 0 10px; }
        .pack-nutrient:last-child { border-radius: 0 10px 10px 0; }
        .pack-nutrient__value { font-size: 1.1rem; font-weight: 800; color: #fff; letter-spacing: -0.02em; line-height: 1.1; }
        .pack-nutrient__value--accent { color: #f5a623; }
        .pack-nutrient__label {
          font-size: 0.52rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.08em; color: rgba(232,232,237,0.4); margin-top: 3px;
        }

        .pack-bottom { width: 100%; }
        .pack-badges { display: flex; align-items: center; justify-content: center; gap: 16px; margin-bottom: 14px; }
        .pack-badge {
          display: flex; align-items: center; gap: 4px;
          font-size: 0.55rem; font-weight: 600; text-transform: uppercase;
          letter-spacing: 0.06em; color: rgba(232,232,237,0.45);
        }
        .pack-badge svg { width: 12px; height: 12px; color: #f5a623; opacity: 0.7; }

        .pack-serving {
          font-size: 0.56rem; color: rgba(232,232,237,0.3); letter-spacing: 0.04em;
          border-top: 1px solid rgba(255,255,255,0.06); padding-top: 12px;
        }

        .pack-deco-left, .pack-deco-right { position: absolute; z-index: 2; pointer-events: none; }
        .pack-deco-left {
          top: 50%; left: 14px; transform: translateY(-50%);
          width: 1px; height: 120px;
          background: linear-gradient(180deg, transparent, rgba(245,166,35,0.15), transparent);
        }
        .pack-deco-right {
          top: 50%; right: 14px; transform: translateY(-50%);
          width: 1px; height: 120px;
          background: linear-gradient(180deg, transparent, rgba(245,166,35,0.15), transparent);
        }

        .pack-corner { position: absolute; z-index: 2; pointer-events: none; }
        .pack-corner--tl { top: 16px; left: 16px; }
        .pack-corner--tr { top: 16px; right: 16px; transform: scaleX(-1); }
        .pack-corner--bl { bottom: 16px; left: 16px; transform: scaleY(-1); }
        .pack-corner--br { bottom: 16px; right: 16px; transform: scale(-1); }
        .pack-corner svg { width: 20px; height: 20px; color: rgba(245,166,35,0.2); }

        @media (max-width: 600px) {
          .pkg-container { padding: 20px; }
          .pkg-canvas-area { padding: 30px 16px; }
          .stick-pack { width: 320px; height: 427px; border-radius: 12px; }
          .pack-content { padding: 20px 24px 18px; }
          .pack-logo svg { width: 140px; }
          .grapefruit-illustration { width: 140px; height: 140px; }
          .pack-flavor { font-size: 1.8rem; }
          .pack-nutrient__value { font-size: 0.9rem; }
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
            <h1>Stick Pack — Grapefruit</h1>
            <p>Front face packaging design &bull; 4:3 portrait format</p>
          </div>

          <div className="pkg-canvas-area">
            <div className="stick-pack">
              <div className="pack-texture"></div>
              <div className="pack-notch"><div className="pack-notch-center"></div></div>
              <div className="pack-deco-left"></div>
              <div className="pack-deco-right"></div>

              <div className="pack-corner pack-corner--tl"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1"><path d="M0 12 L0 0 L12 0"/></svg></div>
              <div className="pack-corner pack-corner--tr"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1"><path d="M0 12 L0 0 L12 0"/></svg></div>
              <div className="pack-corner pack-corner--bl"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1"><path d="M0 12 L0 0 L12 0"/></svg></div>
              <div className="pack-corner pack-corner--br"><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1"><path d="M0 12 L0 0 L12 0"/></svg></div>

              <div className="pack-content">
                {/* Top */}
                <div className="pack-top">
                  <div className="pack-eyebrow">Zero-Sugar Electrolytes</div>
                  <div className="pack-logo">
                    <svg viewBox="0 0 745 171" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M250.91 168.017L320.841 9.89651H338.022L408.241 168.074H386.635L366.121 121.937H292.398L272.343 168.074H250.968L250.91 168.017ZM329.116 37.9353L300.615 103.206H357.847L329.116 37.9353Z" fill="white"/>
                      <path d="M458.514 169.171C448.286 169.171 440.011 166.298 433.805 160.495C427.542 154.692 424.439 146.245 424.439 135.099V74.31H400.822V56.7283H424.439V25.7592H443.574V56.7283H475.695V74.31H443.574V132.686C443.574 139.695 445.068 144.579 447.998 147.395C450.986 150.21 455.641 151.646 462.077 151.646C467.708 151.646 472.247 150.899 475.638 149.406V166.528C470.294 168.309 464.547 169.228 458.456 169.228L458.514 169.171Z" fill="white"/>
                      <path d="M494.665 168.026V0.999939H513.857V168.083H494.665V168.026Z" fill="white"/>
                      <path d="M584.253 170.249C568.796 170.249 555.867 164.618 545.409 153.299C534.893 142.038 529.722 128.363 529.722 112.333C529.722 96.3023 534.951 82.6277 545.409 71.3662C555.867 60.1047 568.853 54.474 584.253 54.474C592.413 54.474 599.998 56.3126 607.065 59.9323C614.133 63.6096 619.592 68.2061 623.442 73.8368V56.7148H642.577V168.065H623.442V150.886C619.592 156.517 614.133 161.171 607.065 164.79C599.998 168.468 592.413 170.249 584.253 170.249ZM587.126 152.667C598.101 152.667 607.18 148.818 614.306 141.061C621.431 133.304 624.994 123.767 624.994 112.333C624.994 100.899 621.431 91.3036 614.306 83.6044C607.18 75.8478 598.101 71.9982 587.126 71.9982C576.151 71.9982 566.842 75.8478 559.717 83.6044C552.592 91.3036 549.029 100.899 549.029 112.333C549.029 123.767 552.592 133.362 559.717 141.061C566.842 148.76 575.979 152.667 587.126 152.667Z" fill="white"/>
                      <path d="M703.191 170.264C690.721 170.264 680.263 167.219 671.874 161.128C663.485 155.038 658.83 146.592 657.968 135.732H677.563C678.769 141.995 681.757 146.592 686.584 149.579C691.411 152.567 697.042 154.004 703.421 154.004C709.799 154.004 714.97 152.74 718.878 150.211C722.843 147.683 724.796 144.064 724.796 139.295C724.796 134.871 723.36 131.193 720.487 128.378C717.614 125.563 712.844 123.264 706.351 121.483L690.319 117.231C671.184 112.175 661.588 101.258 661.588 84.4812C661.588 75.4031 665.151 68.1636 672.391 62.6477C679.574 57.1319 688.825 54.4315 700.145 54.4315C711.465 54.4315 721.004 57.4192 728.359 63.4521C735.714 69.4851 739.794 77.0693 740.713 86.2624H721.521C720.027 81.3785 717.384 77.529 713.649 74.6561C709.856 71.8408 705.317 70.4044 700.145 70.4044C694.629 70.4044 690.089 71.6684 686.412 74.1965C682.734 76.7246 680.953 80.057 680.953 84.2514C680.953 88.4457 682.275 91.5483 684.975 94.019C687.676 96.5471 691.986 98.6155 697.904 100.282L715.717 104.993C734.737 109.705 744.219 120.736 744.219 137.973C744.219 148.66 740.426 156.704 732.841 162.162C725.256 167.563 715.373 170.264 703.248 170.264H703.191Z" fill="white"/>
                      <circle cx="208" cy="8" r="2" fill="white" opacity="0.6"/>
                      <circle cx="205" cy="12" r="2" fill="white" opacity="0.6"/>
                      <circle cx="203" cy="16" r="2" fill="white" opacity="0.6"/>
                      <circle cx="179" cy="37" r="2" fill="white" opacity="0.4"/>
                      <circle cx="163" cy="46" r="2" fill="white" opacity="0.4"/>
                      <circle cx="97" cy="67" r="2" fill="white" opacity="0.3"/>
                      <circle cx="107" cy="79" r="2" fill="white" opacity="0.3"/>
                      <circle cx="134" cy="105" r="2" fill="white" opacity="0.3"/>
                      <circle cx="113" cy="112" r="2" fill="white" opacity="0.3"/>
                      <circle cx="95" cy="131" r="2" fill="white" opacity="0.3"/>
                      <circle cx="112" cy="153" r="2" fill="white" opacity="0.3"/>
                      <circle cx="115" cy="156" r="2" fill="white" opacity="0.3"/>
                    </svg>
                  </div>
                  <div className="pack-subtitle">Electrolyte Drink Mix</div>
                </div>

                {/* Center */}
                <div className="pack-center">
                  <div className="grapefruit-illustration">
                    <svg className="grapefruit-svg" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <radialGradient id="gf-outer" cx="40%" cy="35%" r="55%">
                          <stop offset="0%" stopColor="#f7c948"/>
                          <stop offset="40%" stopColor="#f5a623"/>
                          <stop offset="100%" stopColor="#d4841a"/>
                        </radialGradient>
                        <radialGradient id="gf-inner" cx="45%" cy="40%" r="50%">
                          <stop offset="0%" stopColor="#ff9e8c"/>
                          <stop offset="50%" stopColor="#e8735a"/>
                          <stop offset="100%" stopColor="#c95a42"/>
                        </radialGradient>
                        <radialGradient id="gf-highlight" cx="30%" cy="25%" r="40%">
                          <stop offset="0%" stopColor="rgba(255,255,255,0.35)"/>
                          <stop offset="100%" stopColor="rgba(255,255,255,0)"/>
                        </radialGradient>
                        <filter id="gf-shadow">
                          <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#d4841a" floodOpacity="0.3"/>
                        </filter>
                      </defs>
                      <circle cx="120" cy="110" r="60" fill="url(#gf-outer)" opacity="0.5" filter="url(#gf-shadow)"/>
                      <g transform="translate(70, 60)" filter="url(#gf-shadow)">
                        <circle cx="55" cy="55" r="55" fill="url(#gf-outer)"/>
                        <circle cx="55" cy="55" r="48" fill="#fef3dc"/>
                        <circle cx="55" cy="55" r="44" fill="url(#gf-inner)"/>
                        <g opacity="0.35">
                          <line x1="55" y1="11" x2="55" y2="99" stroke="#fef3dc" strokeWidth="1.5"/>
                          <line x1="55" y1="55" x2="11" y2="55" stroke="#fef3dc" strokeWidth="1"/>
                          <line x1="55" y1="55" x2="99" y2="55" stroke="#fef3dc" strokeWidth="1"/>
                          <line x1="55" y1="55" x2="23" y2="23" stroke="#fef3dc" strokeWidth="1"/>
                          <line x1="55" y1="55" x2="87" y2="23" stroke="#fef3dc" strokeWidth="1"/>
                          <line x1="55" y1="55" x2="23" y2="87" stroke="#fef3dc" strokeWidth="1"/>
                          <line x1="55" y1="55" x2="87" y2="87" stroke="#fef3dc" strokeWidth="1"/>
                          <line x1="55" y1="55" x2="14" y2="38" stroke="#fef3dc" strokeWidth="0.8"/>
                          <line x1="55" y1="55" x2="96" y2="38" stroke="#fef3dc" strokeWidth="0.8"/>
                          <line x1="55" y1="55" x2="14" y2="72" stroke="#fef3dc" strokeWidth="0.8"/>
                          <line x1="55" y1="55" x2="96" y2="72" stroke="#fef3dc" strokeWidth="0.8"/>
                        </g>
                        <circle cx="55" cy="55" r="6" fill="#fef3dc" opacity="0.5"/>
                        <circle cx="55" cy="55" r="44" fill="url(#gf-highlight)"/>
                      </g>
                      <g transform="translate(105, 36) rotate(15)">
                        <path d="M0 18 Q8 -2 22 0 Q14 12 0 18Z" fill="#5a9e3e" opacity="0.8"/>
                        <line x1="0" y1="18" x2="18" y2="2" stroke="#4a8a32" strokeWidth="0.8" opacity="0.6"/>
                      </g>
                      <g transform="translate(155, 148)" opacity="0.6">
                        <path d="M4 0 Q0 6 4 10 Q8 6 4 0Z" fill="#e8735a"/>
                      </g>
                    </svg>
                  </div>

                  <div className="pack-flavor">Grapefruit</div>
                  <div className="pack-flavor-sub">Cold-Pressed Grapefruit Oil &bull; Natural Flavor</div>

                  <div className="pack-nutrients">
                    <div className="pack-nutrient">
                      <div className="pack-nutrient__value pack-nutrient__value--accent">1,300<span style={{fontSize:'0.6em',fontWeight:600}}>mg</span></div>
                      <div className="pack-nutrient__label">Electrolytes</div>
                    </div>
                    <div className="pack-nutrient">
                      <div className="pack-nutrient__value">0<span style={{fontSize:'0.6em',fontWeight:600}}>g</span></div>
                      <div className="pack-nutrient__label">Sugar</div>
                    </div>
                    <div className="pack-nutrient">
                      <div className="pack-nutrient__value">5</div>
                      <div className="pack-nutrient__label">Calories</div>
                    </div>
                    <div className="pack-nutrient">
                      <div className="pack-nutrient__value">90<span style={{fontSize:'0.6em',fontWeight:600}}>mg</span></div>
                      <div className="pack-nutrient__label">Vitamin C</div>
                    </div>
                  </div>
                </div>

                {/* Bottom */}
                <div className="pack-bottom">
                  <div className="pack-badges">
                    <div className="pack-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                      Non-GMO
                    </div>
                    <div className="pack-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M8 12l2.5 2.5L16 9"/></svg>
                      Made in USA
                    </div>
                    <div className="pack-badge">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 12l2 2 4-4"/><path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      3rd Party Tested
                    </div>
                  </div>
                  <div className="pack-serving">16 Stick Packs &bull; Net Wt. 4.5 oz (128g) &bull; Mix with 12–16 fl oz water</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
