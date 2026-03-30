const cards = [
  {
    image: "/images/benefits-performance.jpg",
    imageAlt: "Athlete training for performance",
    overlayLabel: "1,769mg electrolytes per serving",
    title: "Physical Performance",
    text: "Sodium and potassium are critical for muscle contraction, nerve signaling, and thermoregulation. Even a 2% drop in hydration reduces strength and endurance.",
    svg: (
      <svg className="hb__card-svg" viewBox="0 0 200 200" aria-hidden="true">
        <path className="hb__svg-pulse" d="M20 100 L50 100 L60 60 L80 140 L100 80 L120 120 L140 90 L160 100 L180 100" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle className="hb__svg-dot" cx="100" cy="80" r="4" fill="#e85d75" />
      </svg>
    ),
  },
  {
    image: "/images/benefits-cognitive.jpg",
    imageAlt: "Focus and cognitive performance",
    overlayLabel: "75% of your brain is water",
    title: "Cognitive Function",
    text: "Your brain is 75% water. Dehydration impairs memory, focus, and mood. Magnesium supports nerve signaling. B vitamins fuel neurotransmitter production.",
    svg: (
      <svg className="hb__card-svg" viewBox="0 0 200 200" aria-hidden="true">
        <ellipse className="hb__svg-brain-outer" cx="100" cy="95" rx="55" ry="50" fill="none" stroke="#ffffff" strokeWidth="1.5" />
        <path className="hb__svg-brain-line" d="M100 45 L100 145" fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1" strokeDasharray="4 4" />
        <path className="hb__svg-brain-wave" d="M60 75 Q70 65 80 75 Q90 85 100 75 Q110 65 120 75 Q130 85 140 75" fill="none" stroke="#e85d75" strokeWidth="2" strokeLinecap="round" />
        <circle className="hb__svg-dot" cx="100" cy="75" r="3" fill="#e85d75" />
      </svg>
    ),
  },
  {
    image: "/images/benefits-recovery.jpg",
    imageAlt: "Post-workout recovery",
    overlayLabel: "1,200mg recovery amino acids",
    title: "Muscular Recovery",
    text: "L-Glutamine accelerates repair and supports immune function. Magnesium reduces soreness. Recover faster. Train harder.",
    svg: (
      <svg className="hb__card-svg" viewBox="0 0 200 200" aria-hidden="true">
        <rect className="hb__svg-fiber" x="85" y="50" width="6" height="100" rx="3" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <rect className="hb__svg-fiber" x="97" y="40" width="6" height="120" rx="3" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <rect className="hb__svg-fiber" x="109" y="55" width="6" height="90" rx="3" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
        <rect className="hb__svg-repair hb__svg-repair--1" x="85" y="90" width="6" height="0" rx="3" fill="#22c55e" />
        <rect className="hb__svg-repair hb__svg-repair--2" x="97" y="80" width="6" height="0" rx="3" fill="#22c55e" />
        <rect className="hb__svg-repair hb__svg-repair--3" x="109" y="95" width="6" height="0" rx="3" fill="#22c55e" />
        <path className="hb__svg-arrow" d="M70 170 L100 155 L130 170" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function HydrationBenefits() {
  return (
    <section className="hydration-benefits" id="benefits" aria-label="Hydration Benefits">
      <div className="container">
        <div className="section-header">
          <p className="section-eyebrow">The Benefits</p>
          <h2 className="section-title">Why You Need Electrolytes</h2>
          <p className="section-subtitle">
            Your body loses electrolytes every hour through sweat, breath, and daily activity. Replacing them isn&apos;t optional — it&apos;s essential.
          </p>
        </div>
        <div className="hb__grid">
          {cards.map((card) => (
            <div className="hb__card" key={card.title}>
              <div className="hb__card-image">
                <img src={card.image} alt={card.imageAlt} loading="lazy" />
                <div className="hb__card-overlay">
                  {card.svg}
                  <span className="hb__card-overlay-label">{card.overlayLabel}</span>
                </div>
              </div>
              <h3 className="hb__card-title">{card.title}</h3>
              <p className="hb__card-text">{card.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
