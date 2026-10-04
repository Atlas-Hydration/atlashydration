// Which carts can sit near the free-shipping threshold? Run: node scripts/check-shipping-boundary.mjs
// Mirrors computeCartPricing (app/context/CartContext.tsx) for one-time carts: pouches (either flavor)
// and bottles. Subscription carts always ship free, so they are not listed. Rerun if prices change.
import { POUCH_RETAIL, BOTTLE_RETAIL, BOTTLE_HALF_DISCOUNT, multiPouchDiscount } from "../app/data/pricing.ts";
import { FREE_SHIPPING_THRESHOLD } from "../app/data/formula.ts";

const r2 = (n) => Math.round(n * 100) / 100;
const rows = [];
for (let p = 0; p <= 12; p++) for (let b = 0; b <= 12; b++) {
  if (p + b === 0) continue;
  const pre = r2(p * POUCH_RETAIL + b * BOTTLE_RETAIL);
  const pouchOffer = multiPouchDiscount(p);
  const bottleOffer = b === 0 ? 0 : p >= 4 ? BOTTLE_RETAIL : p >= 2 ? BOTTLE_HALF_DISCOUNT : 0;
  const post = r2(pre - Math.max(pouchOffer, bottleOffer));
  rows.push({ p, b, pre, post });
}
const near = (t) => rows.filter((r) => [r.pre, r.post].some((v) => Math.abs(v - t) <= 2));
const window = (t, label) => {
  const hits = near(t);
  console.log(`${label}: carts with a subtotal within $2.00 of $${t}: ${hits.length}`);
  for (const h of hits) console.log(`   ${h.p} pouch(es) + ${h.b} bottle(s): before discounts $${h.pre.toFixed(2)}, after $${h.post.toFixed(2)}`);
};
console.log(`Configured threshold: $${FREE_SHIPPING_THRESHOLD}\n`);
window(FREE_SHIPPING_THRESHOLD, `$${FREE_SHIPPING_THRESHOLD}`);
window(50, "$50 (the old copy)");
const exact = rows.filter((r) => r.pre === FREE_SHIPPING_THRESHOLD || r.post === FREE_SHIPPING_THRESHOLD);
console.log(`\nCarts landing on exactly $${FREE_SHIPPING_THRESHOLD.toFixed(2)}: ${exact.length}`);
const between = rows.filter((r) => Math.min(r.pre, r.post) < 50 && Math.max(r.pre, r.post) >= 40);
console.log(`Carts whose answer depends on $40 vs $50 (any subtotal basis between): ${between.length}`);
for (const h of between) console.log(`   ${h.p} pouch(es) + ${h.b} bottle(s): before $${h.pre.toFixed(2)}, after $${h.post.toFixed(2)}`);
