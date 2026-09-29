import { FORMULA, FORMULA_TOTAL } from "@/app/data/formula";

const items = [
  `${FORMULA_TOTAL}mg electrolytes`,
  `${FORMULA.sugarG}g sugar`,
  `${FORMULA.calories} calories`,
  "Vitamins + amino acids",
];

export default function ProofStrip() {
  return (
    <div className="proof-strip" aria-label="Atlas at a glance">
      <ul className="proof-strip__list">
        {items.map((item) => (
          <li className="proof-strip__item" key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
