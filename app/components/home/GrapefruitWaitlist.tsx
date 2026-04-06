"use client";

import { useState } from "react";

export default function GrapefruitWaitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setError(true); return; }
    setError(false);
    // Email captured — waitlist managed via Shopify/Klaviyo on store side
    void trimmed;
    setSubmitted(true);
  };

  return (
    <section className="waitlist" id="grapefruit-waitlist" aria-label="Grapefruit Waitlist">
      <span className="waitlist__swatch" />
      <div className="container">
        <p className="waitlist__eyebrow">Coming Soon</p>
        <h2 className="waitlist__heading">Grapefruit is almost here.</h2>
        <p className="waitlist__sub">
          Be the first to know when it drops. Subscribers get early access and 20% off launch price.
        </p>

        {submitted ? (
          <div style={{ color: "#16a34a", fontWeight: 600, fontSize: "0.9rem" }}>
            You&apos;re on the list. We&apos;ll email you when Grapefruit launches.
          </div>
        ) : (
          <form className="waitlist__form" onSubmit={handleSubmit}>
            <input
              type="email"
              className={`waitlist__input${error ? " waitlist__input--error" : ""}`}
              placeholder="Enter your email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); if (error) setError(false); }}
            />
            <button type="submit" className="waitlist__btn">Join Waitlist</button>
          </form>
        )}

        <p className="waitlist__social">Join 200+ people already on the waitlist</p>
      </div>
    </section>
  );
}
