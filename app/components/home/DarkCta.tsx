"use client";

import { useCart } from "@/app/context/CartContext";

const CF_BASE = "https://customer-1sijhr9xl3yqixxu.cloudflarestream.com";
const DESKTOP_ID = "a82a07f888cfed6727a183cab0322ee4";
const MOBILE_ID = "c74e4337de25b62fd46e2e1a4331d528";

const streamParams = (id: string) =>
  `${CF_BASE}/${id}/iframe?${new URLSearchParams({ autoplay: "true", muted: "true", loop: "true", controls: "false", preload: "auto", startTime: "0", letterboxColor: "transparent" })}`;

export default function DarkCta() {
  const { addToCart } = useCart();

  return (
    <section className="cta-dark cta-dark--video" aria-label="Buy now">
      <div className="cta-dark__video-wrap">
        <picture className="cta-dark__video-poster">
          <source media="(max-width: 768px)" srcSet={`${CF_BASE}/${MOBILE_ID}/thumbnails/thumbnail.jpg?width=720&height=1280&fit=crop`} />
          <img
            src={`${CF_BASE}/${DESKTOP_ID}/thumbnails/thumbnail.jpg?width=1920&height=1080&fit=crop`}
            alt=""
            className="cta-dark__video-poster-img"
          />
        </picture>
        <iframe
          className="cta-dark__video-cf cta-dark__video-cf--desktop"
          src={streamParams(DESKTOP_ID)}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Background video"
        />
        <iframe
          className="cta-dark__video-cf cta-dark__video-cf--mobile"
          src={streamParams(MOBILE_ID)}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Background video mobile"
        />
      </div>
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
