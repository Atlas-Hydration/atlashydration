"use client";

import React, { useState } from "react";

const cards = [
  {
    number: "01",
    title: "Clear Electrolyte Dosing",
    statNumber: "1,769",
    statUnit: "mg electrolytes",
    reveal: (
      <>
        <p>Sodium, potassium, and magnesium in every stick, with the full breakdown printed on the label. Sodium is the electrolyte you lose most in sweat.</p>
        <div className="why-atlas__card-pills">
          {["Sodium", "Potassium", "Magnesium"].map((p) => (
            <span className="why-atlas__pill" key={p}>{p}</span>
          ))}
        </div>
      </>
    ),
  },
  {
    number: "02",
    title: "Vitamins & Amino Acids",
    statNumber: "7",
    statUnit: "added nutrients",
    reveal: (
      <>
        <p>Vitamin C and B vitamins (niacin, pantethine, B6, B12), plus L-Glutamine and L-Alanine amino acids, for the days you train hard and travel harder.</p>
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
          <h2 className="why-atlas__title">Built for<br />How You Actually Live</h2>
          <p className="why-atlas__subtitle">
            Atlas was built by a pilot and athlete who needed hydration that keeps up with travel, training, and heat. Every ingredient is listed on the label, with zero added sugar.
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
