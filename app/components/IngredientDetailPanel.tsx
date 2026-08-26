"use client";

import { useState, useCallback, useEffect, useRef, type ReactNode } from "react";

interface IngredientInfo {
  name: string;
  dose: string;
  desc: string;
  effects: string[];
  goodFor: string[];
}

const INGREDIENT_DATA: Record<string, IngredientInfo> = {
  sodium: {
    name: "Sodium",
    dose: "600mg — 26% DV",
    desc: "Delivered as Sodium Citrate and Pink Himalayan Salt for optimal bioavailability. Sodium is the primary electrolyte lost in sweat and critical for hydration.",
    effects: [
      "Regulates fluid balance between cells and blood plasma",
      "Enables nerve impulse transmission for muscle contractions",
      "Drives intestinal absorption of water and glucose",
      "Prevents hyponatremia during prolonged exercise",
    ],
    goodFor: ["Hydration", "Endurance", "Nerve Function"],
  },
  magnesium: {
    name: "Magnesium",
    dose: "200mg — 48% DV",
    desc: "Provided as Magnesium Malate — one of the most bioavailable forms. Magnesium is involved in over 300 enzymatic reactions in the body.",
    effects: [
      "Supports ATP energy production at the cellular level",
      "Relaxes smooth and skeletal muscle fibers, reducing cramps",
      "Regulates nervous system signaling and stress response",
      "Contributes to bone density and cardiovascular function",
    ],
    goodFor: ["Muscle Recovery", "Energy", "Sleep"],
  },
  potassium: {
    name: "Potassium",
    dose: "500mg — 11% DV",
    desc: "Delivered as Potassium Citrate for gentle absorption. Works alongside sodium to maintain your body's electrical gradient.",
    effects: [
      "Maintains cellular membrane potential for heart rhythm",
      "Counterbalances sodium to regulate blood pressure",
      "Prevents muscle cramps and supports contraction strength",
      "Aids kidney function and fluid balance",
    ],
    goodFor: ["Heart Health", "Cramp Prevention", "Blood Pressure"],
  },
  chloride: {
    name: "Chloride",
    dose: "469mg — 20% DV",
    desc: "Delivered from Pink Himalayan Salt alongside sodium. Chloride works with sodium and potassium to maintain fluid balance and is a key component of stomach acid.",
    effects: [
      "Maintains fluid balance and blood volume alongside sodium",
      "Supports proper acid-base (pH) balance in the blood",
      "A key component of stomach acid (HCl) for digestion",
      "Assists nerve impulse transmission and muscle function",
    ],
    goodFor: ["Hydration", "Fluid Balance", "Digestion"],
  },
  vitaminb3: {
    name: "Vitamin B3 (Niacin)",
    dose: "24mg — 150% DV",
    desc: "Niacin is essential for converting food into cellular energy. It supports over 400 enzymatic reactions as a precursor to NAD+.",
    effects: [
      "Converts carbohydrates, fats, and proteins into usable energy",
      "Supports healthy cholesterol metabolism",
      "Promotes DNA repair and cellular signaling",
      "Enhances skin barrier function and circulation",
    ],
    goodFor: ["Energy", "Cholesterol", "Skin Health"],
  },
  vitaminb5: {
    name: "Vitamin B5 (Pantothenic Acid)",
    dose: "5mg — 100% DV",
    desc: "A key component of Coenzyme A (CoA), which is involved in fatty acid synthesis, energy metabolism, and hormone production.",
    effects: [
      "Essential for synthesis of Coenzyme A (CoA)",
      "Metabolizes fats and carbohydrates for energy",
      "Supports adrenal gland function and stress hormones",
      "Aids in red blood cell production",
    ],
    goodFor: ["Metabolism", "Stress Response", "Hormones"],
  },
  vitaminb6: {
    name: "Vitamin B6 (P-5-P)",
    dose: "2mg — 118% DV",
    desc: "Provided as Pyridoxal-5-phosphate (P5P), the bioactive form that bypasses liver conversion. Critical for amino acid metabolism.",
    effects: [
      "Metabolizes amino acids for muscle protein synthesis",
      "Produces serotonin, dopamine, and GABA neurotransmitters",
      "Supports hemoglobin production for oxygen transport",
      "Regulates homocysteine levels for cardiovascular health",
    ],
    goodFor: ["Brain Health", "Mood", "Muscle Growth"],
  },
  vitaminb12: {
    name: "Vitamin B12",
    dose: "8mcg — 333% DV",
    desc: "Premium Methylcobalamin form — the most bioavailable B12 that requires no conversion by the body. Essential for energy and nervous system health.",
    effects: [
      "Forms red blood cells that carry oxygen to muscles",
      "Maintains myelin sheath protecting nerve fibers",
      "Required for DNA synthesis during cell division",
      "Prevents megaloblastic anemia and chronic fatigue",
    ],
    goodFor: ["Energy", "Focus", "Nervous System"],
  },
  vitaminc: {
    name: "Vitamin C",
    dose: "90mg — 100% DV",
    desc: "Ascorbic Acid — a powerful antioxidant that neutralizes free radicals generated during exercise and supports immune defense.",
    effects: [
      "Neutralizes exercise-induced oxidative stress",
      "Stimulates white blood cell production and function",
      "Required for collagen synthesis in joints and skin",
      "Enhances iron absorption from plant-based foods",
    ],
    goodFor: ["Immunity", "Skin & Joints", "Antioxidant Protection"],
  },
  glutamine: {
    name: "L-Glutamine",
    dose: "1,000mg",
    desc: "The most abundant amino acid in muscle tissue. Glutamine stores are rapidly depleted during intense exercise, making supplementation critical for recovery.",
    effects: [
      "Fuels rapidly dividing immune cells post-exercise",
      "Maintains intestinal barrier integrity (gut health)",
      "Prevents muscle protein breakdown during stress",
      "Supports glycogen replenishment after training",
    ],
    goodFor: ["Gut Health", "Recovery", "Immune Support"],
  },
  alanine: {
    name: "L-Alanine",
    dose: "200mg",
    desc: "A glucogenic amino acid that plays a key role in the glucose-alanine cycle between muscles and the liver during exercise.",
    effects: [
      "Transports nitrogen from muscles to liver for detox",
      "Provides substrate for gluconeogenesis (new glucose)",
      "Buffers acid buildup in muscles during high intensity",
      "Supports stable blood sugar during prolonged activity",
    ],
    goodFor: ["Endurance", "Blood Sugar", "Detox"],
  },
};

interface RowDef {
  key: string;
  label: ReactNode;
  dv: string;
}

const ELECTROLYTE_ROWS: RowDef[] = [
  { key: "sodium", label: <><strong>Sodium</strong> (as Sodium Citrate and Pink Himalayan Salt) 600mg</>, dv: "26%" },
  { key: "magnesium", label: <><strong>Magnesium</strong> (as Magnesium Malate) 200mg</>, dv: "48%" },
  { key: "potassium", label: <><strong>Potassium</strong> (as Potassium Citrate) 500mg</>, dv: "11%" },
  { key: "chloride", label: <><strong>Chloride</strong> (as Pink Himalayan Salt) 469mg</>, dv: "20%" },
];

const VITAMIN_ROWS: RowDef[] = [
  { key: "vitaminb3", label: <><strong>Vitamin B3</strong> (as Niacin) 24mg</>, dv: "150%" },
  { key: "vitaminb5", label: <><strong>Vitamin B5</strong> (as Pantothenic acid) 5mg</>, dv: "100%" },
  { key: "vitaminb6", label: <><strong>Vitamin B6</strong> (as Pyridoxal-5-phosphate) 2mg</>, dv: "118%" },
  { key: "vitaminb12", label: <><strong>Vitamin B12</strong> (as Methylcobalamin) 8mcg</>, dv: "333%" },
  { key: "vitaminc", label: <><strong>Vitamin C</strong> (Ascorbic Acid) 90mg</>, dv: "100%" },
];

const AMINO_ROWS: RowDef[] = [
  { key: "glutamine", label: <><strong>L-Glutamine</strong> 1000mg</>, dv: "+" },
  { key: "alanine", label: <><strong>L-Alanine</strong> 200mg</>, dv: "+" },
];

function DetailPanelContent({ data, ingredientKey }: { data: IngredientInfo; ingredientKey: string }) {
  return (
    <div className="sf-detail-panel__content" key={ingredientKey}>
      <div className="sf-detail-panel__header">
        <span className="sf-detail-panel__name">{data.name}</span>
        <span className="sf-detail-panel__dose">{data.dose}</span>
      </div>
      <div className="sf-detail-panel__body">
        <p className="sf-detail-panel__desc">{data.desc}</p>
        <div className="sf-detail-panel__effects">
          <h4>How it affects your body</h4>
          <ul className="sf-detail-panel__list">
            {data.effects.map((effect, i) => (
              <li key={i}>{effect}</li>
            ))}
          </ul>
        </div>
        <div className="sf-detail-panel__goodfor">
          <h4>Good For</h4>
          <div className="sf-detail-panel__goodfor-tags">
            {data.goodFor.map((tag) => (
              <span key={tag} className="sf-detail-panel__goodfor-tag">{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileIngredientSheet({ data, onClose }: { data: IngredientInfo | null; onClose: () => void }) {
  const sheetRef = useRef<HTMLDivElement>(null);
  const startY = useRef(0);
  const deltaY = useRef(0);

  useEffect(() => {
    if (data) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [data]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY;
    if (sheetRef.current) sheetRef.current.style.transition = "none";
  }, []);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    deltaY.current = e.touches[0].clientY - startY.current;
    if (deltaY.current > 0 && sheetRef.current) {
      sheetRef.current.style.transform = `translateY(${deltaY.current}px)`;
    }
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (sheetRef.current) sheetRef.current.style.transition = "";
    if (deltaY.current > 80) {
      onClose();
    }
    if (sheetRef.current) sheetRef.current.style.transform = "";
    deltaY.current = 0;
  }, [onClose]);

  return (
    <>
      <div
        className={`ingredient-sheet__overlay${data ? " active" : ""}`}
        onClick={onClose}
      />
      <div
        ref={sheetRef}
        className={`ingredient-sheet${data ? " active" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="ingredient-sheet__handle"><div className="ingredient-sheet__handle-bar" /></div>
        {data && (
          <>
            <div className="ingredient-sheet__name">{data.name}</div>
            <div className="ingredient-sheet__dose">{data.dose}</div>
            <div className="ingredient-sheet__desc">{data.desc}</div>
            <div className="ingredient-sheet__effects">
              <h4>How it affects your body</h4>
              <ul>
                {data.effects.map((effect, i) => (
                  <li key={i}>{effect}</li>
                ))}
              </ul>
            </div>
            <div className="ingredient-sheet__tags">
              {data.goodFor.map((tag) => (
                <span key={tag} className="ingredient-sheet__tag">{tag}</span>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export function SupplementFactsWithPanel({ otherIngredients }: { otherIngredients?: string }) {
  const [activeIngredient, setActiveIngredient] = useState<string | null>(null);
  const [mobileSheet, setMobileSheet] = useState<string | null>(null);
  const data = activeIngredient ? INGREDIENT_DATA[activeIngredient] : null;
  const sheetData = mobileSheet ? INGREDIENT_DATA[mobileSheet] : null;

  const handleHover = (key: string) => setActiveIngredient(key);
  const handleLeave = () => setActiveIngredient(null);
  const handleClick = (key: string) => {
    if (window.innerWidth <= 768) {
      setMobileSheet(mobileSheet === key ? null : key);
    } else {
      setActiveIngredient(activeIngredient === key ? null : key);
    }
  };

  const renderRows = (rows: RowDef[]) =>
    rows.map((row) => (
      <div
        key={row.key}
        className={`sf-row sf-row--hoverable${activeIngredient === row.key ? " sf-row--active" : ""}`}
        data-ingredient={row.key}
        onMouseEnter={() => handleHover(row.key)}
        onMouseLeave={handleLeave}
        onClick={() => handleClick(row.key)}
      >
        <span>{row.label}</span><span>{row.dv}</span>
      </div>
    ));

  const other = otherIngredients || "Citric Acid, Natural Strawberry & Lemon Flavors, Bamboo Extract, Annatto Seed Extract (color)";

  return (
    <>
      <div className="supplement-facts__grid">
        <div className="supplement-facts__table" role="table" aria-label="Supplement Facts">
          <h3>Supplement Facts</h3>
          <p className="sf-meta">16 servings per container</p>
          <p className="sf-meta">Serving Size <strong>1 Stick (8g)</strong></p>
          <div className="sf-divider" />
          <p className="sf-meta" style={{ fontSize: "var(--text-xs)" }}>Amount per serving</p>
          <div className="sf-row sf-row--calories"><span>Calories</span><span>5</span></div>
          <div className="sf-row sf-row--header"><span>% Daily Value*</span></div>
          <div className="sf-row"><span><strong>Total Carbohydrate</strong> 1g</span><span>&lt;1%*</span></div>
          <div className="sf-row"><span><strong>Total Sugar</strong> 0g</span><span>0%</span></div>
          <div className="sf-row"><span><strong>Protein</strong> 0g</span><span>0%</span></div>
          <div className="sf-section-divider" />
          {renderRows(ELECTROLYTE_ROWS)}
          <div className="sf-section-divider" />
          {renderRows(VITAMIN_ROWS)}
          <div className="sf-section-divider" />
          {renderRows(AMINO_ROWS)}
          <div className="sf-divider" />
          <p className="sf-other"><strong>Other Ingredients:</strong> {other}</p>
          <p className="sf-other">*Percent Daily Values Are Based on a 2000 Calorie Diet</p>
        </div>

        <div className="sf-detail-panel">
          {!data ? (
            <div className="sf-detail-panel__default">
              <div className="sf-detail-panel__icon">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C10 6 6 10 6 14a6 6 0 1012 0c0-4-4-8-6-12z" /></svg>
              </div>
              <p className="sf-detail-panel__prompt">Hover over any ingredient to learn how it works in your body</p>
            </div>
          ) : (
            <DetailPanelContent data={data} ingredientKey={activeIngredient!} />
          )}
        </div>
      </div>

      <MobileIngredientSheet data={sheetData} onClose={() => setMobileSheet(null)} />
    </>
  );
}

export { SupplementFactsWithPanel as SupplementFactsWithPanelGrapefruit };
