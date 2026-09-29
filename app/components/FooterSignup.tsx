"use client";

import { openWelcomeForm } from "@/app/lib/klaviyo";

export default function FooterSignup() {
  return (
    <section className="fs" aria-labelledby="fs-title">
      <div className="fs__copy">
        <h2 id="fs-title" className="fs__title">Get 10% off your first order.</h2>
        <p className="fs__sub">Join the Atlas list and we&apos;ll reveal your welcome code right away.</p>
      </div>
      <button type="button" className="fs__btn" onClick={openWelcomeForm}>
        Unlock 10%
      </button>
    </section>
  );
}
