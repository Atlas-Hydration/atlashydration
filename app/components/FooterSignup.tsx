"use client";

import { useState } from "react";
import { WELCOME_CODE, copyText, useWelcomeSignup } from "@/app/lib/welcomeSignup";

export default function FooterSignup() {
  const { email, setEmail, trap, setTrap, status, message, submit, clearError } =
    useWelcomeSignup("Footer: 10% Welcome");
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const ok = await copyText(WELCOME_CODE);
    setCopied(ok);
    if (ok) window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section className="fs" aria-labelledby="fs-title">
      <div className="fs__copy">
        <h2 id="fs-title" className="fs__title">Get 10% off your first order.</h2>
        <p className="fs__sub">Join the Atlas list and we&apos;ll reveal your welcome code right away.</p>
      </div>

      {status === "success" ? (
        <div className="fs__done" role="status" aria-live="polite">
          <span className="fs__done-label">Your code</span>
          <span className="fs__done-code">{WELCOME_CODE}</span>
          <button type="button" className="fs__copy-btn" onClick={handleCopy}>
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      ) : (
        <form className="fs__form" onSubmit={submit} noValidate>
          <input
            type="text"
            name="company"
            value={trap}
            onChange={(e) => setTrap(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            className="wp__trap"
          />
          <label htmlFor="fs-email" className="sr-only">Email address</label>
          <input
            id="fs-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="Email address"
            className={`fs__input${status === "error" ? " fs__input--error" : ""}`}
            value={email}
            aria-invalid={status === "error"}
            aria-describedby="fs-error"
            onChange={(e) => {
              setEmail(e.target.value);
              clearError();
            }}
          />
          <button type="submit" className="fs__btn" disabled={status === "loading"}>
            {status === "loading" ? "Unlocking…" : "Unlock 10%"}
          </button>
          <p id="fs-error" className="fs__error" role="alert">
            {status === "error" ? message : ""}
          </p>
        </form>
      )}
    </section>
  );
}
