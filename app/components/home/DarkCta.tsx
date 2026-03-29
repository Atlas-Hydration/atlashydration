"use client";

import { useCart } from "@/app/context/CartContext";

export default function DarkCta() {
  const { addToCart } = useCart();

  return (
    <section className="cta-dark" aria-label="Buy now">
      <div className="cta-dark__video-wrap">
        <iframe
          className="cta-dark__video-yt"
          src="https://www.youtube.com/embed/l0Dk8Ylqbxk?autoplay=1&mute=1&loop=1&playlist=l0Dk8Ylqbxk&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
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
            Pre-Order — $29.99
          </button>
        </div>
      </div>
    </section>
  );
}
