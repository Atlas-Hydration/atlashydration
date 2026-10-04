import { normalizeState, type PurchaseFlavor, type PurchaseState } from "@/app/data/purchase";

/**
 * Remembers a shopper's buy-box choices (offer, quantity, plan, add-on) for the
 * current tab, so a reload or the Back button does not silently change what they
 * picked. It is only applied when the visit is a reload or a history move. A
 * fresh visit (a link click, an ad, a typed URL) always starts from the page's
 * own offer, so a landing URL always shows the offer it names.
 */

const KEY_PREFIX = "atlas_purchase:";
const HISTORY_WINDOW_MS = 1500;

let documentHasMounted = false;
let historyArrival = false;
let historyTimer: ReturnType<typeof setTimeout> | undefined;

if (typeof window !== "undefined") {
  // A client-side Back/Forward remounts the page inside the same document. The
  // popstate fires just before, so a short flag marks that arrival as "history".
  window.addEventListener("popstate", () => {
    historyArrival = true;
    if (historyTimer) clearTimeout(historyTimer);
    historyTimer = setTimeout(() => { historyArrival = false; }, HISTORY_WINDOW_MS);
  });
}

/** True when this mount should restore the remembered selection. */
export function shouldRestoreSelection(): boolean {
  const firstMountInDocument = !documentHasMounted;
  documentHasMounted = true;

  if (historyArrival) {
    historyArrival = false;
    return true;
  }
  if (!firstMountInDocument) return false;
  try {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    return nav?.type === "reload" || nav?.type === "back_forward";
  } catch {
    return false;
  }
}

export function readSelection(path: string, lockedFlavor?: PurchaseFlavor): PurchaseState | null {
  try {
    const raw = sessionStorage.getItem(KEY_PREFIX + path);
    return raw ? normalizeState(JSON.parse(raw), lockedFlavor) : null;
  } catch {
    return null;
  }
}

export function writeSelection(path: string, state: PurchaseState) {
  try {
    sessionStorage.setItem(KEY_PREFIX + path, JSON.stringify(state));
  } catch {
    /* storage unavailable: selections simply aren't remembered */
  }
}
