import { useState } from "react";

interface IngredientItem {
  name: string;
  amount: string;
  dv?: string;
  note: string;
}

interface IngredientGroup {
  title: string;
  dose: string;
  icon: string;
  items: IngredientItem[];
}

const groups: IngredientGroup[] = [
  {
    title: "Electrolytes",
    dose: "1,769mg",
    icon: "⚡",
    items: [
      { name: "Sodium", amount: "600mg", dv: "26%", note: "From Sodium Citrate & Pink Himalayan Salt" },
      { name: "Potassium", amount: "500mg", dv: "11%", note: "From Potassium Citrate" },
      { name: "Magnesium", amount: "200mg", dv: "48%", note: "From Magnesium Malate" },
      { name: "Chloride", amount: "469mg", dv: "20%", note: "From Pink Himalayan Salt" },
    ],
  },
  {
    title: "Vitamins",
    dose: "116mg",
    icon: "🛡",
    items: [
      { name: "Vitamin C", amount: "90mg", dv: "100%", note: "Immune support & antioxidant" },
      { name: "Vitamin B3", amount: "24mg", dv: "150%", note: "Niacin — energy metabolism" },
      { name: "Vitamin B5", amount: "5mg", dv: "100%", note: "Pantothenic Acid — adrenal support" },
      { name: "Vitamin B6", amount: "2mg", dv: "118%", note: "Neurotransmitter production" },
      { name: "Vitamin B12", amount: "8mcg", dv: "333%", note: "Red blood cell formation" },
    ],
  },
  {
    title: "Amino Acids",
    dose: "1,200mg",
    icon: "💪",
    items: [
      { name: "L-Glutamine", amount: "1,000mg", note: "Gut health & immune function" },
      { name: "L-Alanine", amount: "200mg", note: "Muscle recovery & endurance" },
    ],
  },
];

function IngredientPopup({ group, onClose }: { group: IngredientGroup; onClose: () => void }) {
  return (
    <div className="ingredient-popup-overlay" style={{ display: "flex" }} onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="ingredient-popup">
        <div className="ingredient-popup__header">
          <div className="ingredient-popup__title-group">
            <div className="ingredient-popup__icon-badge">{group.icon}</div>
            <div>
              <div className="ingredient-popup__title">{group.title}</div>
              <div className="ingredient-popup__dose">{group.dose} per serving</div>
            </div>
          </div>
          <button className="ingredient-popup__close" onClick={onClose} aria-label="Close">&times;</button>
        </div>
        <div className="ingredient-popup__grid">
          {group.items.map((item) => (
            <div className="ingredient-popup__card" key={item.name}>
              <div className="ingredient-popup__card-header">
                <span className="ingredient-popup__card-name">{item.name}</span>
                <span className="ingredient-popup__card-amount">{item.amount}</span>
              </div>
              {item.dv && <div className="ingredient-popup__card-dv">{item.dv} Daily Value</div>}
              <p className="ingredient-popup__card-note">{item.note}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ScienceSection() {
  const [activePopup, setActivePopup] = useState<number | null>(null);

  return (
    <>
      <section className="science" id="science" aria-label="The science behind Atlas Hydration">
        <div className="container">
          <div className="science__layout">
            <div className="science__left">
              <h2 className="science__heading">Superior Hydration<br />Designed with Purpose</h2>
              <p className="science__desc">
                Atlas is a cleaner, modern upgrade with higher electrolytes plus vitamins and recovery support, all zero sugar.
              </p>
              <div className="science__badges">
                <div className="science__badge">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" /><path d="M4.93 4.93l14.14 14.14" />
                  </svg>
                  <span>No Sugar</span>
                </div>
                <div className="science__badge">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2C10 6 6 10 6 14a6 6 0 1012 0c0-4-4-8-6-12z" />
                    <path d="M8 14l2 2 4-4" />
                  </svg>
                  <span>Non-GMO</span>
                </div>
              </div>
              <div className="science__usa">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="12" cy="12" r="10" />
                  <text x="12" y="14" fontSize="6" fill="currentColor" textAnchor="middle" fontWeight="700" stroke="none">USA</text>
                </svg>
                <span>Made in USA</span>
              </div>
            </div>
            <div className="science__right">
              {groups.map((group, i) => (
                <div className="science__accordion" key={group.title} onClick={() => setActivePopup(i)}>
                  <div className="science__accordion-header">
                    <div className="science__accordion-dose">{group.dose}</div>
                    <span className="science__accordion-title">{group.title}</span>
                    <span className="science__accordion-toggle">Show Me More</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {activePopup !== null && (
        <IngredientPopup group={groups[activePopup]} onClose={() => setActivePopup(null)} />
      )}
    </>
  );
}
