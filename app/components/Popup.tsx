"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";

const DISMISSED_KEY = "atlas_popup_dismissed";

// ---------------------------------------------------------------------------
// Context so Header can trigger the popup
// ---------------------------------------------------------------------------

interface PopupContextValue {
  openPopup: () => void;
}

const PopupContext = createContext<PopupContextValue>({ openPopup: () => {} });
export const usePopupTrigger = () => useContext(PopupContext);

// ---------------------------------------------------------------------------
// Shopify config (same as CartContext)
// ---------------------------------------------------------------------------

const SHOPIFY_DOMAIN = "7fa7b7-42.myshopify.com";
const STOREFRONT_TOKEN = "390caf7f28b55c8958daeab3fcd55f76";

// ---------------------------------------------------------------------------
// Provider — wraps children + renders the popup
// ---------------------------------------------------------------------------

export function PopupProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  // Auto-open after 3 seconds (once per session)
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (sessionStorage.getItem(DISMISSED_KEY)) return;

    const timer = setTimeout(() => setVisible(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const openPopup = useCallback(() => setVisible(true), []);

  const dismiss = useCallback(() => {
    setVisible(false);
    if (typeof window !== "undefined") {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    }
  }, []);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmed = email.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        setError(true);
        return;
      }
      setError(false);

      // Submit to Shopify via Storefront API customerCreate
      // This triggers the "Sign Up 10% Discount" marketing automation
      try {
        await fetch(`https://${SHOPIFY_DOMAIN}/api/2024-01/graphql.json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
          },
          body: JSON.stringify({
            query: `mutation customerCreate($input: CustomerCreateInput!) {
              customerCreate(input: $input) {
                customer { id }
                customerUserErrors { code message }
              }
            }`,
            variables: {
              input: {
                email: trimmed,
                acceptsMarketing: true,
              },
            },
          }),
        });
      } catch {
        // Still show the code even if the API call fails
      }

      setSubmitted(true);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (typeof window !== 'undefined' && typeof (window as any).gtag === 'function') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).gtag('event', 'sign_up', { method: 'email_popup' });
      }
    },
    [email]
  );

  return (
    <PopupContext.Provider value={{ openPopup }}>
      {children}

      {visible && (
        <div className="popup-overlay" onClick={dismiss}>
          <div className="popup" onClick={(e) => e.stopPropagation()}>
            <button className="popup__close" onClick={dismiss} aria-label="Close popup">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="popup__inner">
              <img src="/atlas-eagle.svg" alt="" className="popup__eagle" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />

              <h2 className="popup__title">
                <span className="popup__title-bold">UNLOCK 10%</span>
                <span className="popup__title-light">OFF YOUR ORDER</span>
              </h2>

              {submitted ? (
                <div className="popup__success">
                  <p className="popup__code">
                    Your code: <strong>ATLAS10</strong>
                  </p>
                  <p className="popup__success-note">
                    Apply at checkout for 10% off your first order.
                  </p>
                  <button className="popup__btn popup__btn--cta" onClick={dismiss}>
                    Start Shopping
                  </button>
                </div>
              ) : (
                <form className="popup__form" onSubmit={handleSubmit}>
                  <label htmlFor="popup-email" className="sr-only">Email address</label>
                  <input
                    id="popup-email"
                    type="email"
                    className={`popup__input${error ? " popup__input--error" : ""}`}
                    placeholder="Email"
                    autoComplete="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (error) setError(false);
                    }}
                  />
                  <button type="submit" className="popup__btn popup__btn--cta">
                    Claim 10% OFF
                  </button>
                </form>
              )}

              <button className="popup__dismiss" onClick={dismiss}>
                No Thanks
              </button>
            </div>
          </div>
        </div>
      )}
    </PopupContext.Provider>
  );
}
