import Link from "next/link";
import { FREE_SHIPPING_THRESHOLD } from "@/app/data/formula";

const CF_BASE = "https://customer-1sijhr9xl3yqixxu.cloudflarestream.com";
const DESKTOP_ID = "a82a07f888cfed6727a183cab0322ee4";
const MOBILE_ID = "c74e4337de25b62fd46e2e1a4331d528";

const streamParams = (id: string) =>
  `${CF_BASE}/${id}/iframe?${new URLSearchParams({ autoplay: "true", muted: "true", loop: "true", controls: "false", preload: "auto", startTime: "0", letterboxColor: "transparent" })}`;

export default function HeroSection() {
  return (
    <section className="hero" aria-label="Hero">
      <div className="hero__video-wrap">
        {/* Instant thumbnails while iframes load */}
        <picture className="hero__video-poster">
          <source media="(max-width: 768px)" srcSet={`${CF_BASE}/${MOBILE_ID}/thumbnails/thumbnail.jpg?width=720&height=1280&fit=crop`} />
          <img
            src={`${CF_BASE}/${DESKTOP_ID}/thumbnails/thumbnail.jpg?width=1920&height=1080&fit=crop`}
            alt=""
            className="hero__video-poster-img"
          />
        </picture>
        {/* Desktop — horizontal video */}
        <iframe
          className="hero__video-cf hero__video-cf--desktop"
          src={streamParams(DESKTOP_ID)}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Atlas Hydration hero video background"
        />
        {/* Mobile — vertical video */}
        <iframe
          className="hero__video-cf hero__video-cf--mobile"
          src={streamParams(MOBILE_ID)}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Atlas Hydration hero video background mobile"
        />
        <div className="hero__video-overlay" />
      </div>
      <div className="hero__content">
        <h1 className="hero__title">Daily performance hydration.</h1>
        <p className="hero__stat">1,769&nbsp;mg electrolytes. Zero sugar. 25 calories.</p>
        <p className="hero__copy">
          Electrolytes, B vitamins, vitamin C, and amino acids in a stick pack that goes wherever you do: training, travel, heat, recovery, and everyday performance.
        </p>
        <Link href="/products/strawberry-lemonade" className="btn btn--hero">
          Shop Strawberry Lemonade
        </Link>
        <ul className="hero__trust" aria-label="Atlas at a glance">
          <li>Third-party tested</li>
          <li>Made in USA</li>
          <li>Free shipping over ${FREE_SHIPPING_THRESHOLD}</li>
        </ul>
        <Link href="/products/bottle" className="hero__bottle-link">
          New: Atlas Performance Bottle
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M9 18l6-6-6-6" /></svg>
        </Link>
      </div>
    </section>
  );
}
