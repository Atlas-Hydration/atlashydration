"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  WELCOME_CODE,
  autoOpenSuppressed,
  copyText,
  hasSubscribed,
  markDismissed,
  useWelcomeSignup,
} from "@/app/lib/welcomeSignup";
import { openWelcomeForm } from "@/app/lib/klaviyo";

const AUTO_OPEN_DELAY_MS = 8000;
// Never interrupt shopping/checkout flows or the internal dashboard.
const NO_AUTO_OPEN = [/^\/cart/, /^\/checkout/, /^\/app/];

interface SignupPopupContextValue {
  openSignup: () => void;
}

const SignupPopupContext = createContext<SignupPopupContextValue>({ openSignup: () => {} });
export const useSignupPopup = () => useContext(SignupPopupContext);

export function SignupPopupProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const pathRef = useRef(pathname);
  const shownRef = useRef(false);

  useEffect(() => {
    pathRef.current = pathname;
  }, [pathname]);

  // One automatic appearance per page load, 8s after arriving, never on
  // cart/checkout, and not again after signup or a recent dismissal.
  useEffect(() => {
    const started = Date.now();
    const id = window.setInterval(() => {
      if (shownRef.current) return;
      if (Date.now() - started < AUTO_OPEN_DELAY_MS) return;
      if (NO_AUTO_OPEN.some((re) => re.test(pathRef.current))) return;
      if (autoOpenSuppressed()) {
        shownRef.current = true;
        return;
      }
      shownRef.current = true;
      setOpen(true);
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  const openSignup = useCallback(() => {
    shownRef.current = true;
    setOpen(true);
  }, []);

  const close = useCallback(() => {
    markDismissed();
    setOpen(false);
  }, []);

  return (
    <SignupPopupContext.Provider value={{ openSignup }}>
      {children}
      {open && <SignupModal onClose={close} />}
    </SignupPopupContext.Provider>
  );
}

function SignupModal({ onClose }: { onClose: () => void }) {
  const { email, setEmail, trap, setTrap, status, message, submit, clearError } =
    useWelcomeSignup("Popup: 10% Welcome", () => {
      onClose();
      openWelcomeForm();
    });
  // Returning subscribers who tap "Unlock 10% Off" just get their code again.
  const [alreadyIn] = useState(() => hasSubscribed());
  const [copied, setCopied] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const showCode = alreadyIn || status === "success";

  // Focus in, lock scroll, restore both on the way out.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      previous?.focus?.();
    };
  }, []);

  useEffect(() => {
    if (showCode) {
      dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    } else {
      inputRef.current?.focus();
    }
  }, [showCode]);

  const onKeyDown = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]):not([tabindex="-1"])'
    );
    if (!focusable || focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const handleCopy = async () => {
    const ok = await copyText(WELCOME_CODE);
    setCopied(ok);
    if (ok) window.setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div className="wp-overlay" onClick={onClose}>
      <div
        ref={dialogRef}
        className="wp"
        role="dialog"
        aria-modal="true"
        aria-labelledby="wp-title"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <aside className="wp__brand" aria-hidden="true">
          <img src="/logo.svg" alt="" className="wp__logo" height={26} />
          <div className="wp__offer">
            <span className="wp__offer-eyebrow">Welcome offer</span>
            <span className="wp__offer-number">10<small>%</small></span>
            <span className="wp__offer-caption">off your first order</span>
          </div>
          <p className="wp__perk">Plus priority access to launches, events &amp; more.</p>
        </aside>

        <div className="wp__panel">
          <button type="button" className="wp__close" onClick={onClose} aria-label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

          {showCode ? (
            <div className="wp__content" key="success">
              <p className="wp__eyebrow">{alreadyIn ? "Welcome back" : "You're in"}</p>
              <h2 id="wp-title" className="wp__title">Here&apos;s your 10% off.</h2>
              <p className="wp__lede">Paste it at checkout.</p>

              <div className="wp__code">
                <span className="wp__code-value" aria-label={`Your code is ${WELCOME_CODE}`}>{WELCOME_CODE}</span>
                <button type="button" className="wp__copy" onClick={handleCopy} data-autofocus>
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <p className="wp__status" role="status" aria-live="polite">
                {copied ? "Copied to your clipboard." : " "}
              </p>

              <Link href="/products/strawberry-lemonade" className="wp__cta" onClick={onClose}>
                Start shopping
              </Link>
            </div>
          ) : (
            <div className="wp__content" key="form">
              <p className="wp__eyebrow">Join the Atlas list</p>
              <h2 id="wp-title" className="wp__title">Unlock 10% off your order.</h2>
              <p className="wp__lede">Enter your email to reveal your code.</p>

              <form className="wp__form" onSubmit={submit} noValidate>
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
                <label htmlFor="wp-email" className="sr-only">Email address</label>
                <input
                  ref={inputRef}
                  id="wp-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder="Email address"
                  className={`wp__input${status === "error" ? " wp__input--error" : ""}`}
                  value={email}
                  aria-invalid={status === "error"}
                  aria-describedby="wp-error"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError();
                  }}
                />
                <p id="wp-error" className="wp__error" role="alert">
                  {status === "error" ? message : ""}
                </p>
                <button type="submit" className="wp__cta" disabled={status === "loading"}>
                  {status === "loading" ? "Unlocking…" : "Unlock my 10%"}
                </button>
              </form>

              <p className="wp__fine">
                By joining, you agree to receive marketing emails. Unsubscribe anytime.{" "}
                <Link href="/privacy" onClick={onClose}>Privacy Policy</Link>
              </p>
              <button type="button" className="wp__skip" onClick={onClose}>
                No thanks
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
