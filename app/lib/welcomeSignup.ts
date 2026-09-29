"use client";

import { useCallback, useState, type FormEvent } from "react";
import { subscribeToKlaviyoPublic } from "@/app/lib/klaviyo";

/** Welcome discount revealed after a successful signup (must exist in Shopify). */
export const WELCOME_CODE = "ATLASWELCOME10";

const SUBSCRIBED_KEY = "atlas_welcome_subscribed";
const DISMISSED_KEY = "atlas_welcome_dismissed_at";
const DISMISS_SNOOZE_MS = 3 * 24 * 60 * 60 * 1000; // don't re-open on its own for 3 days

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function hasSubscribed(): boolean {
  try {
    return localStorage.getItem(SUBSCRIBED_KEY) === "1";
  } catch {
    return false;
  }
}

export function markSubscribed(): void {
  try {
    localStorage.setItem(SUBSCRIBED_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function markDismissed(): void {
  try {
    localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
}

/** True when the popup should not open on its own. */
export function autoOpenSuppressed(): boolean {
  if (hasSubscribed()) return true;
  try {
    const at = Number(localStorage.getItem(DISMISSED_KEY));
    return Boolean(at) && Date.now() - at < DISMISS_SNOOZE_MS;
  } catch {
    return false;
  }
}

export type SignupStatus = "idle" | "loading" | "success" | "error";

export function useWelcomeSignup(source: string, onFallback?: () => void) {
  const [email, setEmail] = useState("");
  // Honeypot: hidden from people; only a bot filling every field sets it.
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<SignupStatus>("idle");
  const [message, setMessage] = useState("");

  const submit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (status === "loading") return;

      const trimmed = email.trim();
      if (!EMAIL_RE.test(trimmed)) {
        setStatus("error");
        setMessage("Please enter a valid email address.");
        return;
      }
      if (trap.trim()) {
        setStatus("success");
        return;
      }

      setStatus("loading");
      setMessage("");
      const result = await subscribeToKlaviyoPublic({
        email: trimmed,
        source,
        properties: {
          "Discount Offered": WELCOME_CODE,
          discount_code: WELCOME_CODE,
        },
      });

      if (result === "ok") {
        markSubscribed();
        setStatus("success");
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const gtag = typeof window !== "undefined" ? (window as any).gtag : undefined;
        if (typeof gtag === "function") gtag("event", "sign_up", { method: source });
        return;
      }

      // Klaviyo didn't confirm: hand off to the native Klaviyo form instead of
      // failing, so the visitor can still sign up.
      if (result === "error" && onFallback) {
        setStatus("idle");
        onFallback();
        return;
      }

      setStatus("error");
      setMessage(
        result === "rate_limited"
          ? "Too many attempts. Please try again in a few minutes."
          : "Something went wrong on our end. Please try again."
      );
    },
    [email, trap, status, source, onFallback]
  );

  const clearError = useCallback(() => {
    setStatus((s) => (s === "error" ? "idle" : s));
  }, []);

  return { email, setEmail, trap, setTrap, status, message, submit, clearError };
}

/** Copies text; resolves false when the browser blocks clipboard access. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
