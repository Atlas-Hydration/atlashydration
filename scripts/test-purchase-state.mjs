// Unit tests for app/data/purchase.ts (what each selection submits).
// Run: node scripts/test-purchase-state.mjs   (Node 22+, no dependencies)
import assert from "node:assert/strict";
import { offerState, purchaseLines, bottleIncluded, normalizeState, DEFAULT_OFFER } from "../app/data/purchase.ts";

let n = 0;
const t = (name, fn) => { fn(); n++; console.log(`PASS  ${name}`); };
const SB = "strawberry-lemonade";

t("default offer is the subscription (organic pages unchanged)", () => assert.equal(DEFAULT_OFFER, "subscribe"));

t("stock-up = 2 pouches, one-time, no selling plan", () => {
  const s = offerState("stock-up", SB);
  assert.deepEqual(purchaseLines(s, true), [{ slug: SB, quantity: 2 }]);
  assert.equal("subscriptionFrequency" in purchaseLines(s, true)[0], false);
});
t("try = 1 pouch one-time", () => assert.deepEqual(purchaseLines(offerState("try", SB), true), [{ slug: SB, quantity: 1 }]));
t("subscribe carries its frequency (and only subscribe does)", () => {
  const s = { ...offerState("subscribe", SB), frequency: 4 };
  assert.deepEqual(purchaseLines(s, true), [{ slug: SB, quantity: 1, subscriptionFrequency: 4 }]);
});
t("subscription -> one-time switch drops the frequency from the line", () => {
  let s = { ...offerState("subscribe", SB), frequency: 6 };
  s = { ...s, purchaseType: "onetime", qty: 2 };
  assert.deepEqual(purchaseLines(s, true), [{ slug: SB, quantity: 2 }]);
  // and a stale frequency left in state can never leak onto a one-time line
  assert.equal(purchaseLines(s, true)[0].subscriptionFrequency, undefined);
});
t("custom quantity is submitted as chosen (one-time and subscription)", () => {
  assert.deepEqual(purchaseLines({ ...offerState("try", SB), qty: 7, customQtyOpen: true }, true), [{ slug: SB, quantity: 7 }]);
  assert.deepEqual(purchaseLines({ ...offerState("subscribe", SB), qty: 3, customQtyOpen: true, frequency: 2 }, true), [{ slug: SB, quantity: 3, subscriptionFrequency: 2 }]);
});
t("bottle add-on only with plain 2-pouch one-time, and only while live", () => {
  const withBottle = { ...offerState("stock-up", SB), addBottle: true };
  assert.deepEqual(purchaseLines(withBottle, true), [{ slug: SB, quantity: 2 }, { slug: "bottle", quantity: 1 }]);
  assert.equal(bottleIncluded(withBottle, false), false);
  assert.equal(bottleIncluded({ ...withBottle, customQtyOpen: true }, true), false);
  assert.equal(bottleIncluded({ ...withBottle, qty: 3 }, true), false);
  assert.equal(bottleIncluded({ ...withBottle, purchaseType: "subscribe" }, true), false);
  assert.equal(purchaseLines({ ...withBottle, purchaseType: "subscribe", qty: 1 }, true).length, 1);
});
t("normalizeState accepts a good selection", () => {
  const s = { flavor: "grapefruit", purchaseType: "onetime", frequency: 4, qty: 4, customQtyOpen: true, addBottle: false };
  assert.deepEqual(normalizeState(s), s);
});
t("normalizeState rejects malformed / out-of-range data", () => {
  const ok = { flavor: SB, purchaseType: "onetime", frequency: 2, qty: 2, customQtyOpen: false, addBottle: false };
  for (const bad of [null, undefined, "x", 5, {}, { ...ok, qty: 0 }, { ...ok, qty: 21 }, { ...ok, qty: 1.5 }, { ...ok, qty: "2" }, { ...ok, frequency: 3 }, { ...ok, purchaseType: "gift" }, { ...ok, flavor: "bottle" }]) {
    assert.equal(normalizeState(bad), null, JSON.stringify(bad));
  }
});
t("normalizeState: a single-flavor page can never be moved to another flavor", () => {
  const saved = { flavor: "grapefruit", purchaseType: "onetime", frequency: 2, qty: 2, customQtyOpen: false, addBottle: false };
  assert.equal(normalizeState(saved, SB).flavor, SB);
});
t("normalizeState coerces non-boolean flags to false", () => {
  const s = normalizeState({ flavor: SB, purchaseType: "onetime", frequency: 2, qty: 2, customQtyOpen: "yes", addBottle: 1 });
  assert.equal(s.customQtyOpen, false);
  assert.equal(s.addBottle, false);
});
console.log(`\n${n} tests passed`);
