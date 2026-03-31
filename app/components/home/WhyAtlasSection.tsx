"use client";

import React, { useState } from "react";

const cards = [
  {
    number: "01",
    title: "More Electrolytes Than Anyone",
    statNumber: "1,769",
    statUnit: "mg electrolytes",
    reveal: (
      <>
        <p>Sodium, potassium, magnesium, and chloride in ratios backed by exercise science. More per serving than LMNT, Liquid I.V., and WaterBoy — combined.</p>
        <div className="why-atlas__card-bar"><div className="why-atlas__card-bar-fill" style={{ "--bar-width": "100%" } as React.CSSProperties} /><span>Atlas 1,769mg</span></div>
        <div className="why-atlas__card-bar why-atlas__card-bar--muted"><div className="why-atlas__card-bar-fill" style={{ "--bar-width": "71%" } as React.CSSProperties} /><span>LMNT 1,260mg</span></div>
        <div className="why-atlas__card-bar why-atlas__card-bar--muted"><div className="why-atlas__card-bar-fill" style={{ "--bar-width": "28%" } as React.CSSProperties} /><span>Liquid I.V. 500mg</span></div>
      </>
    ),
  },
  {
    number: "02",
    title: "Full-Spectrum Recovery",
    statNumber: "6",
    statUnit: "recovery nutrients",
    reveal: (
      <>
        <p>B3, B5, B6, B12, Vitamin C, plus 1,200mg amino acids (L-Glutamine &amp; L-Alanine). No other electrolyte brand includes this full recovery stack.</p>
      </>
    ),
  },
  {
    number: "03",
    title: "Zero Sugar. Zero Compromise.",
    statNumber: "0",
    statUnit: "grams sugar",
    reveal: (
      <>
        <p>Naturally sweetened with stevia and allulose. Only 25 calories per stick. No artificial flavors, no synthetic dyes, no junk.</p>
        <div className="why-atlas__card-pills">
          {["Stevia Leaf", "Allulose", "No Artificial Colors", "No Artificial Flavors"].map((p) => (
            <span className="why-atlas__pill why-atlas__pill--green" key={p}>{p}</span>
          ))}
        </div>
      </>
    ),
  },
  {
    number: "04",
    title: "Built for Real Life",
    statNumber: "1",
    statUnit: "stick. anytime.",
    reveal: (
      <>
        <p>Individually wrapped stick packs that go anywhere. Gym bag, carry-on, desk drawer. Mix with cold water in seconds — no blender, no mess.</p>
        <div className="why-atlas__card-pills">
          {["Travel-Ready", "Gym Bag", "Office", "On-the-Go"].map((p) => (
            <span className="why-atlas__pill" key={p}>{p}</span>
          ))}
        </div>
      </>
    ),
  },
];

function WhyAtlasCard({ card }: { card: typeof cards[0] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={`why-atlas__card why-atlas__card--feature${expanded ? " why-atlas__card--expanded" : ""}`}
      onClick={() => setExpanded((prev) => !prev)}
    >
      <div className="why-atlas__card-front">
        <div className="why-atlas__card-number">{card.number}</div>
        <h3 className="why-atlas__card-title">{card.title}</h3>
        <div className="why-atlas__card-stat">
          <span className="why-atlas__card-stat-number">{card.statNumber}</span>
          <span className="why-atlas__card-stat-unit">{card.statUnit}</span>
        </div>
      </div>
      <div className="why-atlas__card-reveal">
        {card.reveal}
      </div>
    </div>
  );
}

export default function WhyAtlasSection() {
  return (
    <section className="why-atlas" id="why-atlas" aria-label="Why Choose Atlas">
      <div className="why-atlas__bg" />
      <div className="container">
        <div className="why-atlas__header">
          <p className="section-eyebrow" style={{ color: "rgba(255,255,255,0.5)" }}>Why Atlas</p>
          <h2 className="why-atlas__title">Engineered for<br />Those Who Demand More</h2>
          <p className="why-atlas__subtitle">
            Most electrolyte brands cut corners — low doses, added sugar, missing nutrients. Atlas was built by an athlete who demanded more from his hydration. Every ingredient is dosed to perform.
          </p>
        </div>

        <div className="why-atlas__grid">
          {cards.map((card) => (
            <WhyAtlasCard key={card.number} card={card} />
          ))}
        </div>

        <div className="why-atlas__bottom">
          <div className="why-atlas__proof">
            <div className="why-atlas__proof-item">
              <span className="why-atlas__proof-number">1%</span>
              <span className="why-atlas__proof-label">for the Planet member</span>
            </div>
            <div className="why-atlas__proof-divider" />
            <div className="why-atlas__proof-item">
              <span className="why-atlas__proof-number">3rd</span>
              <span className="why-atlas__proof-label">party tested</span>
            </div>
            <div className="why-atlas__proof-divider" />
            <div className="why-atlas__proof-item">
              <span className="why-atlas__proof-number">USA</span>
              <span className="why-atlas__proof-label">made &amp; sourced</span>
            </div>
          </div>
          <a href="/products/strawberry-lemonade" className="btn btn--white btn--lg">Shop Now</a>
        </div>
      </div>
    </section>
  );
}
