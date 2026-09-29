"use client";

import { useCallback } from "react";
import { BOTTLE_DISCOUNT_LIVE, TWO_PACK_DISCOUNT_AMOUNT } from "@/app/context/CartContext";
import { PRODUCTS } from "@/app/data/products";
import { FREE_SHIPPING_THRESHOLD } from "@/app/data/formula";

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
}

const money = (n: number) => `$${n.toFixed(2)}`;

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
 *   Stock up -> one-time, qty 2 (existing 2-pack discount)
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
}: PurchaseOptionsProps) {
  const product = PRODUCTS[slug];
  const isSubscribing = purchaseType === "subscribe";

  const singlePrice = product.price;
  const subscribePrice = product.subscribePrice;
  const twoPackTotal = singlePrice * 2 - TWO_PACK_DISCOUNT_AMOUNT;

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
  const twoPackDiscount = isSubscribing ? 0 : TWO_PACK_DISCOUNT_AMOUNT;
  const stepperTotal = qty === 2 ? unitPrice * 2 - twoPackDiscount : qty * unitPrice;

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
            <span className="po-option__sub">One-time purchase · {money(singlePrice / 16)} / stick</span>
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
            <span className="po-option__sub">One-time purchase · save {money(TWO_PACK_DISCOUNT_AMOUNT)}</span>
          </span>
          <span className="po-option__price">{money(twoPackTotal)}</span>
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
            <span className="po-option__sub">{money(subscribePrice)} per pouch · free shipping</span>
          </span>
          <span className="po-option__price">
            {money(subscribePrice)}
            <span className="po-option__was">{money(singlePrice)}</span>
          </span>
        </button>
      </div>

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
            <div className="purchase-option__perk"><CheckSvg /><span>Free shipping on orders over ${FREE_SHIPPING_THRESHOLD}</span></div>
          </div>
        </div>
      )}

      {qty === 2 && !customQtyOpen && twoPackDiscount > 0 && (
        <p className="qty-select__hint">Includes 50% off the Atlas Bottle, plus {money(twoPackDiscount)} off your pouches.</p>
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

      {BOTTLE_DISCOUNT_LIVE && qty >= 4 && (
        <p className="qty-select__hint">Your Atlas Bottle ships free at this quantity.</p>
      )}
    </div>
  );
}
