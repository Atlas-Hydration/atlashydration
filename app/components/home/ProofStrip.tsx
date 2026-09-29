import { FORMULA, FORMULA_TOTAL, FREE_SHIPPING_THRESHOLD } from "@/app/data/formula";

// Product figures mirror the Supplement Facts label (see app/data/formula.ts);
// policy items mirror the shipping/returns page and subscription terms.
const items = [
  `${FORMULA_TOTAL}mg electrolytes`,
  `${FORMULA.sugarG}g sugar`,
  `${FORMULA.calories} calories`,
  "Vitamins + amino acids",
  `${FORMULA.sodiumMg}mg sodium`,
  `${FORMULA.potassiumMg}mg potassium`,
  `${FORMULA.magnesiumMg}mg magnesium`,
  "L-Glutamine + L-Alanine",
  "Sweetened with stevia + allulose",
  `Free shipping over $${FREE_SHIPPING_THRESHOLD}`,
  "Subscribe & Save 20%",
  "Skip or cancel anytime",
  "Made in USA",
  "Third-party tested",
  "Non-GMO",
  "16 sticks per box",
  "30-day satisfaction guarantee",
];

function ItemList({ hidden }: { hidden?: boolean }) {
  return (
    <ul className="proof-strip__list" aria-hidden={hidden || undefined}>
      {items.map((item) => (
        <li className="proof-strip__item" key={item}>{item}</li>
      ))}
    </ul>
  );
}

export default function ProofStrip() {
  return (
    <div className="proof-strip" aria-label="Atlas at a glance">
      <div className="proof-strip__track">
        <ItemList />
        <ItemList hidden />
      </div>
    </div>
  );
}
