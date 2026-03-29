"use client";

import { useState, useEffect, useCallback } from "react";

const DISMISSED_KEY = "atlas_popup_dismissed";

const STATS = [
  { value: "500", unit: "mg", label: "Potassium" },
  { value: "200", unit: "mg", label: "Magnesium" },
  { value: "600", unit: "mg", label: "Sodium" },
  { value: "100%", unit: "+", label: "B-Vitamins" },
  { value: "0", unit: "g", label: "Sugar" },
];

export default function Popup() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    }
  }, []);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
      if (!isValid) {
        setError(true);
        return;
      }
      setError(false);
      setSubmitted(true);
    },
    [email]
  );

  if (!visible) return null;

  return (
    <div className="popup-overlay" onClick={dismiss}>
      <button
        className="popup__close"
        onClick={dismiss}
        aria-label="Close"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      <div className="popup" onClick={(e) => e.stopPropagation()}>
        <div className="popup__inner">
          <div className="popup__layout">
            <div className="popup__left">
              <div className="popup__logo">
                <img
                  src="/logo.svg"
                  alt="Atlas Hydration"
                  height="24"
                />
              </div>
              <div className="popup__title-block">
                <div className="popup__heading">Daily</div>
                <div className="popup__heading">Hydration</div>
                <div className="popup__sub">Electrolytes with Vitamins</div>
              </div>
              <div className="popup__percent">10% Off</div>

              {submitted ? (
                <div className="popup__success">
                  <p className="popup__code">
                    Code: <strong>ATLAS10</strong>
                  </p>
                  <p className="popup__fine">
                    Apply at checkout for 10% off your first order.
                  </p>
                </div>
              ) : (
                <form className="popup__form" onSubmit={handleSubmit}>
                  <input
                    type="email"
                    className={`popup__input${error ? " popup__input--error" : ""}`}
                    placeholder="Enter your email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(false);
                    }}
                  />
                  <button type="submit" className="popup__btn">
                    Get My Code
                  </button>
                </form>
              )}

              <p className="popup__fine">
                Zero spam. Unsubscribe anytime.
              </p>
            </div>

            <div className="popup__right">
              {STATS.map((stat) => (
                <div className="popup__stat" key={stat.label}>
                  <span className="popup__stat-val">
                    {stat.value}
                    <small>{stat.unit}</small>
                  </span>
                  <span className="popup__stat-label">{stat.label}</span>
                </div>
              ))}
            </div>
          </div>

          <button className="popup__dismiss" onClick={dismiss}>
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
