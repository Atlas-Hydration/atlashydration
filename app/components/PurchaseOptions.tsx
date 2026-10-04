"use client";

import { useCallback } from "react";
import { BOTTLE_DISCOUNT_LIVE, BOTTLE_FULL_PRICE, BOTTLE_HALF_PRICE, computeCartPricing } from "@/app/context/CartContext";
import { PRODUCTS } from "@/app/data/products";
import { MULTI_POUCH_DISCOUNT_PER_POUCH, STICKS_PER_POUCH, multiPouchDiscount, oneTimePouchTotal } from "@/app/data/pricing";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_RATE, qualifiesForFreeShipping } from "@/app/data/formula";

export type PurchaseType = "subscribe" | "onetime";

interface PurchaseOptionsProps {
  slug: string;
  purchaseType: PurchaseType;
  onPurchaseTypeChange: (type: PurchaseType) => void;
  qty: number;
  onQtyChange: (qty: number) => void;
  customQtyOpen: boolean;
  onCustomQtyOpenChange: (open: boolean) => void;
  frequency: number;
  onFrequencyChange: (weeks: number) => void;
  /** Optional Atlas Bottle add-on shown under the 2-pouch option. */
  addBottle: boolean;
  onAddBottleChange: (add: boolean) => void;
}

const money = (n: number) => `$${n.toFixed(2)}`;
/** "$9" for whole dollars, "$9.50" otherwise. */
const savings = (n: number) => (Number.isInteger(n) ? `$${n}` : money(n));

const CheckSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/**
 * Presentation only. Selections map onto the same state the buy boxes always
 * used (purchaseType + qty), so the cart, discount code, and Shopify selling
 * plans are untouched:
 *   Try      -> one-time, qty 1
 *   Stock up -> one-time, qty 2 (ATLAS2PACK, applied automatically by Shopify)
 *   Subscribe -> subscribe (existing selling plans)
 */
export default function PurchaseOptions({
  slug,
  purchaseType,
  onPurchaseTypeChange,
  qty,
  onQtyChange,
  customQtyOpen,
  onCustomQtyOpenChange,
  frequency,
  onFrequencyChange,
  addBottle,
  onAddBottleChange,
}: PurchaseOptionsProps) {
  const product = PRODUCTS[slug];
  const isSubscribing = purchaseType === "subscribe";

  const singlePrice = product.price;
  const subscribePrice = product.subscribePrice;
  const twoPackTotal = oneTimePouchTotal(2);
  const singleShipsFree = qualifiesForFreeShipping(singlePrice);
  const oneTimeTotal = oneTimePouchTotal(qty);

  // The add-on is priced by the same function as the cart, so the total shown
  // here is exactly what the cart and Shopify charge.
  const bottle = PRODUCTS.bottle;
  const showBottleAddon = BOTTLE_DISCOUNT_LIVE && !isSubscribing && qty === 2 && !customQtyOpen;
  const withBottleTotal = computeCartPricing([
    { slug, title: product.name, price: singlePrice, quantity: 2, image: null },
    { slug: "bottle", title: bottle.name, price: bottle.price, quantity: 1, image: null },
  ]).total;

  const tryActive = !isSubscribing && qty === 1 && !customQtyOpen;
  const stockActive = !isSubscribing && qty === 2 && !customQtyOpen;

  const chooseTry = useCallback(() => {
    onPurchaseTypeChange("onetime");
    onQtyChange(1);
    onCustomQtyOpenChange(false);
  }, [onPurchaseTypeChange, onQtyChange, onCustomQtyOpenChange]);

  const chooseStock = useCallback(() => {
    onPurchaseTypeChange("onetime");
    onQtyChange(2);
    onCustomQtyOpenChange(false);
  }, [onPurchaseTypeChange, onQtyChange, onCustomQtyOpenChange]);

  const chooseSubscribe = useCallback(() => {
    if (!isSubscribing) {
      onPurchaseTypeChange("subscribe");
      onQtyChange(1);
      onCustomQtyOpenChange(false);
    }
  }, [isSubscribing, onPurchaseTypeChange, onQtyChange, onCustomQtyOpenChange]);

  const unitPrice = isSubscribing ? subscribePrice : singlePrice;
  const stepperTotal = isSubscribing ? qty * unitPrice : oneTimePouchTotal(qty);
  const multiDiscount = isSubscribing ? 0 : multiPouchDiscount(qty);

  return (
    <div className="po">
      <div className="po__list" role="radiogroup" aria-label="Choose how to buy">
        <button
          type="button"
          role="radio"
          aria-checked={tryActive}
          className={`po-option${tryActive ? " po-option--active" : ""}`}
          onClick={chooseTry}
        >
          <span className="po-option__radio" aria-hidden="true" />
          <span className="po-option__body">
            <span className="po-option__step">Try</span>
            <span className="po-option__title">1 pouch</span>
            <span className="po-option__sub">
              {money(product.perStick)} / stick ·{" "}
              {singleShipsFree ? <strong className="po-option__ship">free shipping</strong> : `${money(SHIPPING_RATE)} shipping`}
            </span>
          </span>
          <span className="po-option__price">{money(singlePrice)}</span>
        </button>

        <button
          type="button"
          role="radio"
          aria-checked={stockActive}
          className={`po-option po-option--featured${stockActive ? " po-option--active" : ""}`}
          onClick={chooseStock}
        >
          <span className="po-badge">Most Popular</span>
          <span className="po-option__radio" aria-hidden="true" />
          <span className="po-option__body">
            <span className="po-option__step">Stock up</span>
            <span className="po-option__title">2 pouches</span>
            <span className="po-option__sub">
              Save {savings(multiPouchDiscount(2))} + <strong className="po-option__ship">free shipping</strong>
            </span>
          </span>
          <span className="po-option__price">
            {money(twoPackTotal)}
            <span className="po-option__was">{money(singlePrice * 2)}</span>
          </span>
        </button>

        {showBottleAddon && (
          <label className={`po-addon${addBottle ? " po-addon--on" : ""}`}>
            <input
              type="checkbox"
              className="po-addon__input"
              checked={addBottle}
              onChange={(e) => onAddBottleChange(e.target.checked)}
            />
            <span className="po-addon__box" aria-hidden="true">
              {addBottle ? <CheckSvg /> : <span className="po-addon__plus">+</span>}
            </span>
            {bottle.images[0] && <img className="po-addon__img" src={bottle.images[0]} alt="" width={44} height={44} />}
            <span className="po-addon__body">
              <span className="po-addon__title">Add the Atlas Performance Bottle</span>
              <span className="po-addon__price">
                <strong>{money(BOTTLE_HALF_PRICE)}</strong>
                <s>{money(BOTTLE_FULL_PRICE)}</s>
                <em>50% off</em>
              </span>
              <span className="po-addon__note">
                Replaces the {savings(multiPouchDiscount(2))} pouch savings. Total with bottle: {money(withBottleTotal)}.
              </span>
            </span>
          </label>
        )}

        <button
          type="button"
          role="radio"
          aria-checked={isSubscribing}
          className={`po-option${isSubscribing ? " po-option--active" : ""}`}
          onClick={chooseSubscribe}
        >
          <span className="po-option__radio" aria-hidden="true" />
          <span className="po-option__body">
            <span className="po-option__step">Subscribe</span>
            <span className="po-option__title">Subscribe &amp; Save 20%</span>
            <span className="po-option__sub">{money(subscribePrice)} per pouch · <strong className="po-option__ship">free shipping</strong></span>
          </span>
          <span className="po-option__price">
            {money(subscribePrice)}
            <span className="po-option__was">{money(singlePrice)}</span>
          </span>
        </button>
      </div>

      <p className="po__summary" aria-live="polite" data-testid="offer-summary">
        <span>Selected:</span> {qty} {qty === 1 ? "pouch" : "pouches"} ({qty * STICKS_PER_POUCH} sticks) ·{" "}
        {isSubscribing ? `subscription, every ${frequency} weeks` : "one-time purchase"}
        {showBottleAddon && addBottle ? " + Atlas Performance Bottle" : ""}
      </p>

      {isSubscribing ? (
        <div className="po__detail">
          <div className="purchase-option__perks">
            <div className="purchase-option__perk"><CheckSvg /><span>20% off every order, plus free shipping</span></div>
            <div className="purchase-option__perk"><CheckSvg /><span>Skip, pause, or cancel anytime</span></div>
          </div>
          <div className="frequency-selector">
            {[2, 4, 6].map((weeks) => (
              <button
                key={weeks}
                type="button"
                className={`frequency-selector__btn${frequency === weeks ? " active" : ""}`}
                onClick={() => onFrequencyChange(weeks)}
              >
                Every {weeks} weeks
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="po__detail">
          <div className="purchase-option__perks">
            <div className="purchase-option__perk">
              <CheckSvg />
              <span>
                {qualifiesForFreeShipping(oneTimeTotal)
                  ? "Free shipping included"
                  : `Add another pouch for free shipping (orders over $${FREE_SHIPPING_THRESHOLD})`}
              </span>
            </div>
          </div>
        </div>
      )}

      {multiDiscount > 0 && !(showBottleAddon && addBottle) && (
        <p className="qty-select__hint">
          {money(MULTI_POUCH_DISCOUNT_PER_POUCH)} off every pouch when you buy 2 or more. You save {money(multiDiscount)}.
        </p>
      )}

      {customQtyOpen ? (
        <div className="qty-stepper">
          <div className="qty-stepper__control">
            <button type="button" aria-label="Decrease quantity" onClick={() => onQtyChange(Math.max(1, qty - 1))}>−</button>
            <span>{qty}</span>
            <button type="button" aria-label="Increase quantity" onClick={() => onQtyChange(Math.min(20, qty + 1))}>+</button>
          </div>
          <span className="qty-stepper__total">{money(stepperTotal)}</span>
        </div>
      ) : (
        <button type="button" className="qty-select__custom-toggle" onClick={() => onCustomQtyOpenChange(true)}>
          Need a different amount?
        </button>
      )}

      {BOTTLE_DISCOUNT_LIVE && !isSubscribing && qty >= 4 && (
        <p className="qty-select__hint">Your Atlas Bottle ships free at this quantity.</p>
      )}
    </div>
  );
}
