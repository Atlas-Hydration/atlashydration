"use client";

import { useCart } from "@/app/context/CartContext";

export default function DarkCta() {
  const { addToCart } = useCart();

  return (
    <section className="cta-dark cta-dark--science" aria-label="Buy now">
      <div className="cta-dark__overlay" />
      <div className="container">
        <div className="cta-dark__inner">
          <h2 className="cta-dark__title">
            Ready to Try<br />
            <span className="wave-text">Strawberry&nbsp;Lemonade?</span>
          </h2>
          <p className="cta-dark__text">
            16 stick packs of clean, science-backed hydration. Zero sugar. 25 calories. Full performance.
          </p>
          <button
            className="cta-dark__btn"
            onClick={() => addToCart("strawberry-lemonade", 1)}
          >
            Order &mdash; $29.99
          </button>
        </div>
      </div>
    </section>
  );
}
