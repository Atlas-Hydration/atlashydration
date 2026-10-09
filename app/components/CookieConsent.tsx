"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { loadKlaviyo } from "@/app/lib/klaviyo";

import { CONSENT_KEY } from "@/app/lib/metaPixel";
import MetaPixel from "@/app/components/MetaPixel";

export default function CookieConsent() {
  const [consent, setConsent] = useState<"accepted" | "declined" | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const syncConsent = () => {
      try {
        const stored = localStorage.getItem(CONSENT_KEY);
        if (stored === "accepted" || stored === "declined") {
          setConsent(stored);
          setShowBanner(false);
        } else {
          setConsent(null);
          setShowBanner(true);
        }
      } catch {
        setConsent(null);
        setShowBanner(true);
      }
    };
    syncConsent();
    const onStorage = (event: StorageEvent) => {
      if (event.key === CONSENT_KEY || event.key === null) syncConsent();
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  useEffect(() => {
    if (consent === "accepted") loadKlaviyo();
  }, [consent]);

  const choose = (value: "accepted" | "declined") => {
    setConsent(value);
    setShowBanner(false);
    try {
      localStorage.setItem(CONSENT_KEY, value);
    } catch {
      /* ignore */
    }
  };

  return (
    <>
      <MetaPixel accepted={consent === "accepted"} />
      {consent === "accepted" && (
        <>
          {/* Google Analytics 4 */}
          <Script src="https://www.googletagmanager.com/gtag/js?id=G-J2NYD0S2BR" strategy="afterInteractive" />
          <Script id="ga4-init" strategy="afterInteractive">{`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-J2NYD0S2BR');
          `}</Script>
        </>
      )}

      {showBanner && (
        <div className="cookie-banner" role="dialog" aria-label="Cookie consent">
          <div className="cookie-banner__inner">
            <p className="cookie-banner__text">
              We use cookies to run this site and, with your permission, to understand
              how it&apos;s used and personalize your experience. See our{" "}
              <Link href="/privacy">Privacy Policy</Link> for details.
            </p>
            <div className="cookie-banner__actions">
              <button className="btn btn--outline btn--sm" onClick={() => choose("declined")}>
                Decline
              </button>
              <button className="btn btn--dark btn--sm" onClick={() => choose("accepted")}>
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
