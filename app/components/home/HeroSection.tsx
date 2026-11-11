import Link from "next/link";
import { FREE_SHIPPING_THRESHOLD } from "@/app/data/formula";
import HeroVideo from "@/app/components/home/HeroVideo";

const CF_BASE = "https://customer-1sijhr9xl3yqixxu.cloudflarestream.com";
const DESKTOP_ID = "a82a07f888cfed6727a183cab0322ee4";
const MOBILE_ID = "c74e4337de25b62fd46e2e1a4331d528";

const streamParams = (id: string) =>
  `${CF_BASE}/${id}/iframe?${new URLSearchParams({ autoplay: "true", muted: "true", loop: "true", controls: "false", preload: "auto", startTime: "0", letterboxColor: "transparent" })}`;

export default function HeroSection() {
  return (
    <section className="hero" aria-label="Hero">
      {/* Start fetching the poster (the largest thing on screen) immediately. */}
      <link rel="preload" as="image" href={`${CF_BASE}/${MOBILE_ID}/thumbnails/thumbnail.jpg?width=720&height=1280&fit=crop`} media="(max-width: 768px)" />
      <link rel="preload" as="image" href={`${CF_BASE}/${DESKTOP_ID}/thumbnails/thumbnail.jpg?width=1920&height=1080&fit=crop`} media="(min-width: 769px)" />
      <div className="hero__video-wrap">
        {/* Instant thumbnails while iframes load */}
        <picture className="hero__video-poster">
          <source media="(max-width: 768px)" srcSet={`${CF_BASE}/${MOBILE_ID}/thumbnails/thumbnail.jpg?width=720&height=1280&fit=crop`} />
          <img
            src={`${CF_BASE}/${DESKTOP_ID}/thumbnails/thumbnail.jpg?width=1920&height=1080&fit=crop`}
            alt=""
            className="hero__video-poster-img"
            fetchPriority="high"
            decoding="async"
          />
        </picture>
        <HeroVideo desktopSrc={streamParams(DESKTOP_ID)} mobileSrc={streamParams(MOBILE_ID)} />
        <div className="hero__video-overlay" />
      </div>
      <div className="hero__content">
        <h1 className="hero__title">Daily performance hydration.</h1>
        <p className="hero__stat">1,769&nbsp;mg electrolytes. Zero sugar. 25 calories.</p>
        <Link href="/products/strawberry-lemonade" className="btn btn--hero">
          Shop Strawberry Lemonade
        </Link>
        <ul className="hero__trust" aria-label="Atlas at a glance">
          <li>Made in USA</li>
          <li>Third-party tested</li>
          <li>{`Free shipping over $${FREE_SHIPPING_THRESHOLD}`}</li>
        </ul>
      </div>
    </section>
  );
}
