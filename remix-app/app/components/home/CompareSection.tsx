import { useState, useCallback } from "react";

interface Brand {
  key: string;
  name: string;
  logo: string;
}

interface Category {
  key: string;
  label: string;
  unit: string;
  atlas: number;
  lowerBetter: boolean;
  values: Record<string, number>;
  subs?: Record<string, Record<string, number>>;
}

const BRANDS: Brand[] = [
  { key: "lmnt", name: "LMNT", logo: "images/logos/lmnt.svg" },
  { key: "liv", name: "Liquid I.V.", logo: "images/logos/liquid-iv.svg" },
  { key: "wb", name: "WaterBoy", logo: "images/logos/waterboy.svg" },
  { key: "drip", name: "DripDrop", logo: "images/logos/dripdrop.svg" },
  { key: "nuun", name: "Nuun", logo: "images/logos/nuun.svg" },
];

const CATS: Category[] = [
  {
    key: "electrolytes", label: "Electrolytes", unit: "mg", atlas: 1769, lowerBetter: false,
    values: { lmnt: 1260, liv: 930, wb: 1540, drip: 1330, nuun: 900 },
    subs: {
      Sodium: { atlas: 600, lmnt: 1000, liv: 500, wb: 950, drip: 330, nuun: 300 },
      Potassium: { atlas: 500, lmnt: 200, liv: 380, wb: 390, drip: 400, nuun: 150 },
      Magnesium: { atlas: 200, lmnt: 60, liv: 50, wb: 200, drip: 0, nuun: 25 },
      Chloride: { atlas: 469, lmnt: 0, liv: 0, wb: 0, drip: 600, nuun: 425 },
    },
  },
  {
    key: "vitaminb", label: "Vitamin B", unit: "mg", atlas: 38, lowerBetter: false,
    values: { lmnt: 0, liv: 36, wb: 0, drip: 0, nuun: 0 },
    subs: {
      "B3 (Niacin)": { atlas: 24, lmnt: 0, liv: 30, wb: 0, drip: 0, nuun: 0 },
      B5: { atlas: 5, lmnt: 0, liv: 3, wb: 0, drip: 0, nuun: 0 },
      B6: { atlas: 2, lmnt: 0, liv: 3, wb: 0, drip: 0, nuun: 0 },
      "B12 (mcg)": { atlas: 8, lmnt: 0, liv: 0, wb: 0, drip: 0, nuun: 0 },
    },
  },
  {
    key: "vitaminc", label: "Vitamin C", unit: "mg", atlas: 90, lowerBetter: false,
    values: { lmnt: 0, liv: 62, wb: 0, drip: 0, nuun: 0 },
  },
  {
    key: "aminos", label: "Amino Acids", unit: "mg", atlas: 1200, lowerBetter: false,
    values: { lmnt: 0, liv: 0, wb: 0, drip: 0, nuun: 0 },
    subs: {
      "L-Glutamine": { atlas: 1000, lmnt: 0, liv: 0, wb: 0, drip: 0, nuun: 0 },
      "L-Alanine": { atlas: 200, lmnt: 0, liv: 0, wb: 0, drip: 0, nuun: 0 },
    },
  },
  {
    key: "sugar", label: "Sugar", unit: "g", atlas: 0, lowerBetter: true,
    values: { lmnt: 0, liv: 11, wb: 0, drip: 6, nuun: 1 },
  },
];

const DEFAULT_ACTIVE = ["lmnt", "liv", "wb"];

function fmtVal(val: number, unit: string) {
  return (val >= 1000 ? val.toLocaleString() : val) + (unit ? " " + unit.toUpperCase() : "");
}

interface ModalState {
  catKey: string;
  rivalKey: string;
}

export default function CompareSection() {
  const [activeBrands, setActiveBrands] = useState<string[]>(DEFAULT_ACTIVE);
  const [modal, setModal] = useState<ModalState | null>(null);

  const toggleBrand = useCallback((key: string) => {
    setActiveBrands((prev) =>
      prev.includes(key) ? prev.filter((b) => b !== key) : [...prev, key]
    );
  }, []);

  const activeBrandData = BRANDS.filter((b) => activeBrands.includes(b.key));

  // Count wins
  const atlasWins = CATS.filter((cat) => {
    return activeBrandData.every((b) => {
      const rv = cat.values[b.key];
      return cat.lowerBetter ? rv >= cat.atlas : rv <= cat.atlas;
    });
  }).length;

  // Modal data
  const modalCat = modal ? CATS.find((c) => c.key === modal.catKey) : null;
  const modalRival = modal ? BRANDS.find((b) => b.key === modal.rivalKey) : null;

  return (
    <>
      <section className="compare" id="compare" aria-label="How Atlas Compares">
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">Compare</p>
            <h2 className="section-title">How Atlas Compares</h2>
            <p className="section-subtitle">Tap any row for a head-to-head breakdown.</p>
          </div>

          {/* Brand Toggles */}
          <div className="compare__controls">
            <div className="compare__brand-toggles">
              {BRANDS.map((b) => (
                <button
                  key={b.key}
                  className={`compare__toggle${activeBrands.includes(b.key) ? " active" : ""}`}
                  onClick={() => toggleBrand(b.key)}
                >
                  {b.name}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="compare__table-wrap">
            <table className="compare__table animated" role="table">
              <thead>
                <tr>
                  <th></th>
                  <th className="compare__th-atlas">
                    <img src="logo.svg" alt="Atlas" height="20" />
                  </th>
                  {activeBrandData.map((b) => (
                    <th key={b.key} className="compare__th-logo">
                      <span className={`compare__th-brand compare__th-brand--${b.key}`}>{b.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {CATS.map((cat) => {
                  const isWinner = activeBrandData.every((b) => {
                    const rv = cat.values[b.key];
                    return cat.lowerBetter ? rv >= cat.atlas : rv <= cat.atlas;
                  });

                  return (
                    <tr key={cat.key} onClick={() => activeBrandData.length > 0 && setModal({ catKey: cat.key, rivalKey: activeBrandData[0].key })}>
                      <td className="compare__label">{cat.label}</td>
                      <td className="compare__value compare__value--atlas">
                        <div className="compare__bar" style={{ "--bar-width": "100%" } as React.CSSProperties}>
                          <strong>{fmtVal(cat.atlas, cat.unit)}</strong>
                          {isWinner && <span className="compare__win-badge">Winner</span>}
                        </div>
                      </td>
                      {activeBrandData.map((b) => {
                        const val = cat.values[b.key];
                        if (val === 0 && !cat.lowerBetter) {
                          return <td key={b.key} className="compare__value"><span className="compare__zero">&mdash;</span></td>;
                        }
                        if (cat.key === "sugar" && val > 0) {
                          return <td key={b.key} className="compare__value"><span className="compare__sugar-bad">{fmtVal(val, cat.unit)}</span></td>;
                        }
                        if (cat.key === "sugar" && val === 0) {
                          return (
                            <td key={b.key} className="compare__value">
                              <div className="compare__check">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="3"><path d="M20 6L9 17l-5-5" /></svg>
                                {fmtVal(val, cat.unit)}
                              </div>
                            </td>
                          );
                        }
                        const pct = cat.atlas === 0 ? 100 : Math.min(100, (val / cat.atlas) * 100);
                        return (
                          <td key={b.key} className="compare__value">
                            <div className="compare__bar" style={{ "--bar-width": `${Math.round(pct)}%` } as React.CSSProperties}>
                              {fmtVal(val, cat.unit)}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {/* Score row */}
                <tr className="compare__score-row">
                  <td className="compare__label" style={{ color: "rgba(255,255,255,0.3)", fontSize: "var(--text-xs)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Categories Won
                  </td>
                  <td className="compare__value compare__value--atlas">
                    <span className="compare__score-atlas">{atlasWins}/{CATS.length}</span>
                  </td>
                  {activeBrandData.map((b) => {
                    const bWins = CATS.filter((cat) => {
                      const val = cat.values[b.key];
                      return cat.lowerBetter ? val < cat.atlas : val > cat.atlas;
                    }).length;
                    return (
                      <td key={b.key} className="compare__value">
                        <span className="compare__score-rival">{bWins}/{CATS.length}</span>
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Breakdown Modal */}
      {modal && modalCat && modalRival && (
        <CompareModal cat={modalCat} rival={modalRival} onClose={() => setModal(null)} />
      )}
    </>
  );
}

function CompareModal({ cat, rival, onClose }: { cat: Category; rival: Brand; onClose: () => void }) {
  const av = cat.atlas;
  const rv = cat.values[rival.key];
  const maxVal = Math.max(av, rv, 1);
  const atlasWins = cat.lowerBetter ? av < rv : av > rv;
  const isTie = av === rv;

  let verdictBadge: string;
  let verdictClass: string;
  let verdictDetail: string;

  if (isTie) {
    verdictBadge = "Tie";
    verdictClass = "compare-modal__badge--tie";
    verdictDetail = `Both deliver ${fmtVal(av, cat.unit)} of ${cat.label.toLowerCase()}.`;
  } else if (atlasWins) {
    verdictBadge = "Atlas Wins";
    verdictClass = "compare-modal__badge--win";
    if (rv === 0) {
      verdictDetail = `${rival.name} has no ${cat.label.toLowerCase()}. Atlas delivers ${fmtVal(av, cat.unit)}.`;
    } else if (cat.lowerBetter) {
      verdictDetail = `Atlas has ${fmtVal(rv - av, cat.unit)} less ${cat.label.toLowerCase()} than ${rival.name}.`;
    } else {
      const pct = Math.round(((av - rv) / rv) * 100);
      verdictDetail = `Atlas delivers ${pct}% more (${fmtVal(av, cat.unit)} vs ${fmtVal(rv, cat.unit)}).`;
    }
  } else {
    verdictBadge = `${rival.name} Leads`;
    verdictClass = "compare-modal__badge--lose";
    if (cat.lowerBetter) {
      verdictDetail = `${rival.name} has ${fmtVal(rv, cat.unit)} vs Atlas\u2019s ${fmtVal(av, cat.unit)}.`;
    } else {
      const pct = Math.round(((rv - av) / av) * 100);
      verdictDetail = `${rival.name} has ${pct}% more (${fmtVal(rv, cat.unit)} vs ${fmtVal(av, cat.unit)}).`;
    }
  }

  return (
    <div className="compare-modal" aria-hidden="false">
      <div className="compare-modal__backdrop" onClick={onClose} />
      <div className="compare-modal__card">
        <button className="compare-modal__close" onClick={onClose} aria-label="Close">&times;</button>
        <div className="compare-modal__header">
          <div className="compare-modal__vs">
            <span className="compare-modal__brand compare-modal__brand--atlas">Atlas</span>
            <span className="compare-modal__vs-text">vs</span>
            <span className="compare-modal__brand compare-modal__brand--rival">{rival.name}</span>
          </div>
          <p className="compare-modal__cat">{cat.label}</p>
        </div>
        <div className="compare-modal__bars">
          <div className="compare-modal__row">
            <div className="compare-modal__label compare-modal__label--atlas">
              <span className="compare-modal__name">Atlas</span>
              <span className="compare-modal__val">{fmtVal(av, cat.unit)}</span>
            </div>
            <div className="compare-modal__track">
              <div className="compare-modal__fill compare-modal__fill--atlas" style={{ width: `${(av / maxVal) * 100}%` }} />
            </div>
          </div>
          <div className="compare-modal__row">
            <div className="compare-modal__label">
              <span className="compare-modal__name">{rival.name}</span>
              <span className="compare-modal__val">{fmtVal(rv, cat.unit)}</span>
            </div>
            <div className="compare-modal__track">
              <div className="compare-modal__fill compare-modal__fill--rival" style={{ width: `${(rv / maxVal) * 100}%` }} />
            </div>
          </div>
        </div>
        <div className="compare-modal__verdict">
          <div className={`compare-modal__badge ${verdictClass}`}>{verdictBadge}</div>
          <p className="compare-modal__detail">{verdictDetail}</p>
        </div>
      </div>
    </div>
  );
}
