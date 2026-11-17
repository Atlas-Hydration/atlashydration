import Link from "next/link";

const specs = [
  {
    stat: "1,769",
    unit: "mg electrolytes",
    title: "Clear electrolyte dosing",
    text: "Sodium, potassium, and magnesium in every stick, with the full breakdown printed on the label. Sodium is the electrolyte you lose most in sweat.",
  },
  {
    stat: "7",
    unit: "added nutrients",
    title: "Vitamins and amino acids",
    text: "Vitamin C and B vitamins (niacin, pantethine, B6, B12), plus L-Glutamine and L-Alanine, for the days you train hard and travel harder.",
  },
  {
    stat: "0",
    unit: "g sugar",
    title: "Zero sugar, 25 calories",
    text: "Sweetened with stevia and allulose. No artificial flavors and no synthetic dyes.",
  },
  {
    stat: "1",
    unit: "stick",
    title: "Made to travel",
    text: "Individually wrapped sticks for the gym bag, carry-on, or desk drawer. Mix with cold water in seconds. No blender, no mess.",
  },
];

const proof = [
  { big: "USA", label: "Made & sourced" },
  { big: "3rd", label: "Party tested" },
];

export default function WhyAtlasSection() {
  return (
    <section className="built" id="why-atlas" aria-labelledby="built-title">
      <div className="container">
        <div className="built__layout">
          <div className="built__intro">
            <p className="section-eyebrow">Why Atlas</p>
            <h2 className="built__title" id="built-title">Built for how you actually live.</h2>
            <p className="built__sub">
              Atlas was built by a pilot and athlete who needed hydration that keeps up with travel, training, and heat. Every ingredient is on the label.
            </p>
            <ul className="built__proof" aria-label="Quality commitments">
              {proof.map((p) => (
                <li key={p.big}>
                  <strong>{p.big}</strong>
                  <span>{p.label}</span>
                </li>
              ))}
            </ul>
            <Link href="/products/strawberry-lemonade" className="btn btn--dark btn--lg">Shop Strawberry Lemonade</Link>
          </div>

          <ul className="built__list">
            {specs.map((s) => (
              <li className="built__row" key={s.title}>
                <div className="built__stat">
                  {s.stat}
                  <small>{s.unit}</small>
                </div>
                <div>
                  <h3 className="built__row-title">{s.title}</h3>
                  <p className="built__row-text">{s.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
