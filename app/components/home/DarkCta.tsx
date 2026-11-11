"use client";

import { usePurchaseSelection } from "@/app/context/PurchaseSelectionContext";
import { STICKS_PER_POUCH } from "@/app/data/pricing";
import { STARTER_OFFER } from "@/app/data/starterOffer";
import { PRODUCTS } from "@/app/data/products";

const CF_BASE = "https://customer-1sijhr9xl3yqixxu.cloudflarestream.com";
const DESKTOP_ID = "a82a07f888cfed6727a183cab0322ee4";
const MOBILE_ID = "c74e4337de25b62fd46e2e1a4331d528";

const streamParams = (id: string) =>
  `${CF_BASE}/${id}/iframe?${new URLSearchParams({ autoplay: "true", muted: "true", loop: "true", controls: "false", preload: "auto", startTime: "0", letterboxColor: "transparent" })}`;

export default function DarkCta() {
  // Same selection (flavor, offer, quantity, plan, bottle) as the main buy box.
  const { flavor, purchaseType, qty, bottleIncluded, total, isPreorder, addSelectionToCart } = usePurchaseSelection();

  const isStarter = flavor === "strawberry-lemonade" && purchaseType === "starter";
  const packSummary = isStarter
    ? `${STARTER_OFFER.stickQuantity} stick packs · ${STARTER_OFFER.pouchQuantity} pouches + ${STARTER_OFFER.bottleQuantity} free Atlas bottle`
    : `${qty * STICKS_PER_POUCH} stick packs · ${qty} ${qty === 1 ? "pouch" : "pouches"}${bottleIncluded ? " + Atlas bottle" : ""}`;

  return (
    <section className="cta-dark cta-dark--video" aria-label="Buy now">
      <div className="cta-dark__video-wrap">
        <picture className="cta-dark__video-poster">
          <source media="(max-width: 768px)" srcSet={`${CF_BASE}/${MOBILE_ID}/thumbnails/thumbnail.jpg?width=720&height=1280&fit=crop`} />
          <img
            src={`${CF_BASE}/${DESKTOP_ID}/thumbnails/thumbnail.jpg?width=1920&height=1080&fit=crop`}
            alt=""
            className="cta-dark__video-poster-img"
          />
        </picture>
        <iframe
          loading="lazy"
          className="cta-dark__video-cf cta-dark__video-cf--desktop"
          src={streamParams(DESKTOP_ID)}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Background video"
        />
        <iframe
          loading="lazy"
          className="cta-dark__video-cf cta-dark__video-cf--mobile"
          src={streamParams(MOBILE_ID)}
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="Background video mobile"
        />
      </div>
      <div className="cta-dark__overlay" />
      <div className="container">
        <div className="cta-dark__inner">
          <h2 className="cta-dark__title">
            Ready to Try<br />
            <span className="wave-text">{PRODUCTS[flavor].name.replace(" ", "\u00a0")}?</span>
          </h2>
          <p className="cta-dark__text">
            {packSummary}. 1,769mg electrolytes. Zero sugar. 25 calories.
          </p>
          <button
            className="cta-dark__btn"
            onClick={() => addSelectionToCart()}
          >
            {isStarter ? "Order starter kit" : isPreorder ? "Pre-Order" : "Order"} &mdash; ${total.toFixed(2)}
          </button>
        </div>
      </div>
    </section>
  );
}
