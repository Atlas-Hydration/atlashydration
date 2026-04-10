"use client";

import { useState } from "react";
import { subscribeToKlaviyo } from "@/app/lib/klaviyo";

export default function GrapefruitWaitlist() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) { setError(true); return; }
    setError(false);
    await subscribeToKlaviyo({
      email: trimmed,
      source: "Homepage — New Flavor Notifications",
      properties: { "Interested In": "New Flavors" },
    });
    setSubmitted(true);
  };

  return (
    <section className="waitlist" id="grapefruit-waitlist" aria-label="Grapefruit Preorder">
      <span className="waitlist__swatch" />
      <div className="container">
        <p className="waitlist__eyebrow">Preorder Now</p>
        <h2 className="waitlist__heading">Grapefruit has arrived.</h2>
        <p className="waitlist__sub">
          Be one of the first to try our newest flavor. Preorder now and get 20% off with Subscribe &amp; Save.
        </p>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
          <a
            href="/products/grapefruit"
            className="waitlist__btn"
            style={{ display: "inline-block", textDecoration: "none", textAlign: "center", padding: "14px 36px" }}
          >
            Preorder Grapefruit
          </a>
        </div>

        <p className="waitlist__social" style={{ marginBottom: 32 }}>
          Join 200+ people who&apos;ve already ordered.
        </p>

        <div style={{ maxWidth: 440, margin: "0 auto", paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.08)" }}>
          <p style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.5)", textAlign: "center", marginBottom: 12 }}>
            Get notified about new flavors
          </p>
          {submitted ? (
            <div style={{ color: "#16a34a", fontWeight: 600, fontSize: "0.85rem", textAlign: "center" }}>
              You&apos;re in. We&apos;ll email you when the next flavor drops.
            </div>
          ) : (
            <form className="waitlist__form" onSubmit={handleSubmit} style={{ gap: 8 }}>
              <input
                type="email"
                className={`waitlist__input${error ? " waitlist__input--error" : ""}`}
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (error) setError(false); }}
                style={{ fontSize: "0.85rem", padding: "10px 14px" }}
              />
              <button
                type="submit"
                className="waitlist__btn"
                style={{
                  fontSize: "0.72rem",
                  padding: "10px 20px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                Notify Me
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
