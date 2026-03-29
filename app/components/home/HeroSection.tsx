"use client";

import Link from "next/link";

const benefits = [
  {
    label: "Hydration",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2C10 6 6 10 6 14a6 6 0 1012 0c0-4-4-8-6-12z" />
      </svg>
    ),
  },
  {
    label: "Recovery",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
    ),
  },
  {
    label: "Performance",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
  },
  {
    label: "Immunity",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    label: "No Sugar",
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" />
        <path d="M4.93 4.93l14.14 14.14" />
      </svg>
    ),
  },
];

const StarIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff" stroke="none">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
  </svg>
);

export default function HeroSection() {
  return (
    <section className="hero" aria-label="Hero">
      <div className="hero__video-wrap">
        <iframe
          className="hero__video-yt"
          src="https://www.youtube.com/embed/l0Dk8Ylqbxk?autoplay=1&mute=1&loop=1&playlist=l0Dk8Ylqbxk&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
        <div className="hero__video-overlay" />
      </div>
      <div className="hero__content">
        <div className="hero__reviews">
          <div className="hero__stars-manual">
            <StarIcon /><StarIcon /><StarIcon /><StarIcon /><StarIcon />
            <span className="hero__review-count">(20)</span>
          </div>
        </div>
        <h1 className="hero__title">All hydration.<br />No sugar.</h1>
        <div className="hero__benefits">
          {benefits.map((b) => (
            <div className="hero__benefit" key={b.label}>
              <div className="hero__benefit-icon">{b.icon}</div>
              <span>{b.label}</span>
            </div>
          ))}
        </div>
        <Link href="/products/strawberry-lemonade" className="btn btn--hero">
          Hydrate
        </Link>
      </div>
    </section>
  );
}
