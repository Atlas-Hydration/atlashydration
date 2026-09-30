const benefits = [
  {
    kicker: "Replace",
    title: "Physical Performance",
    text: "Sodium and potassium play a role in muscle contraction and nerve signaling, and sweat is how you lose them. Atlas helps you replace electrolytes around training.",
    facts: [
      { name: "Sodium", amount: "600 mg" },
      { name: "Potassium", amount: "500 mg" },
    ],
  },
  {
    kicker: "Support",
    title: "Cognitive Function",
    text: "Magnesium supports normal nerve function, and B vitamins play a role in energy metabolism. Stay on top of hydration through long workdays and flights.",
    facts: [
      { name: "Magnesium", amount: "200 mg" },
      { name: "B vitamins", amount: "B3, B5, B6, B12" },
    ],
  },
  {
    kicker: "Round out",
    title: "Muscular Recovery",
    text: "L-Glutamine and L-Alanine amino acids, plus magnesium, to round out your post-training routine.",
    facts: [
      { name: "L-Glutamine", amount: "1,000 mg" },
      { name: "L-Alanine", amount: "200 mg" },
    ],
  },
];

export default function HydrationBenefits() {
  return (
    <section className="bn" id="benefits" aria-labelledby="bn-title">
      <div className="container">
        <div className="bn__head">
          <p className="section-eyebrow">The benefits</p>
          <h2 className="bn__title" id="bn-title">Why electrolytes matter</h2>
          <p className="bn__sub">
            You lose electrolytes through sweat, especially when you train, travel, or spend time in the heat. Replacing them is part of staying hydrated.
          </p>
        </div>

        <div className="bn__grid">
          {benefits.map((b) => (
            <article className="bn__col" key={b.title}>
              <p className="bn__kicker">{b.kicker}</p>
              <h3 className="bn__col-title">{b.title}</h3>
              <p className="bn__text">{b.text}</p>
              <p className="bn__facts-label">In every stick</p>
              <dl className="bn__facts">
                {b.facts.map((f) => (
                  <div key={f.name}>
                    <dt>{f.name}</dt>
                    <dd>{f.amount}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>

        <p className="bn__note">
          *These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease.
        </p>
      </div>
    </section>
  );
}
