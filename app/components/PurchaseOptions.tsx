"use client";

import StarterOffer from "./StarterOffer";
import { STARTER_OFFER_LIVE } from "@/app/data/starterOffer";
import { useCallback } from "react";
import { BOTTLE_DISCOUNT_LIVE } from "@/app/context/CartContext";
import { PRODUCTS } from "@/app/data/products";
import { MULTI_POUCH_DISCOUNT_PER_POUCH, multiPouchDiscount, oneTimePouchTotal } from "@/app/data/pricing";
import { FREE_SHIPPING_THRESHOLD, SHIPPING_RATE } from "@/app/data/formula";

export type PurchaseType = "subscribe" | "onetime" | "starter";

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

const CheckSvg = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
    <path d="M20 6L9 17l-5-5" />
  </svg>
);

/** Starter selection adds the inventory-managed kit; singles and selling plans remain independent. */
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

  const singleShipsFree = singlePrice >= FREE_SHIPPING_THRESHOLD;
  const oneTimeTotal = oneTimePouchTotal(qty);

  const tryActive = purchaseType === "onetime" && qty === 1 && !customQtyOpen;


  const chooseTry = useCallback(() => {
    onPurchaseTypeChange("onetime");
    onQtyChange(1);
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
        {STARTER_OFFER_LIVE && slug === "strawberry-lemonade" && <StarterOffer selected={purchaseType === "starter"} onSelect={() => { onPurchaseTypeChange("starter"); onQtyChange(1); onCustomQtyOpenChange(false); }} />}
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

      {purchaseType === "starter" ? null : isSubscribing ? (
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
                {oneTimeTotal >= FREE_SHIPPING_THRESHOLD
                  ? "Free shipping included"
                  : `Free standard shipping with the $50 starter kit`}
              </span>
            </div>
          </div>
        </div>
      )}

      {purchaseType === "onetime" && multiDiscount > 0 && (
        <p className="qty-select__hint">
          {money(MULTI_POUCH_DISCOUNT_PER_POUCH)} off every pouch when you buy 2 or more. You save {money(multiDiscount)}.
        </p>
      )}

      {purchaseType === "starter" ? null : customQtyOpen ? (
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

      {BOTTLE_DISCOUNT_LIVE && purchaseType === "onetime" && qty >= 4 && (
        <p className="qty-select__hint">Your Atlas Bottle ships free at this quantity.</p>
      )}
    </div>
  );
}
