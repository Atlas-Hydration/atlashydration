"use client";

import { useEffect } from "react";

export default function ReviewsSection() {
  useEffect(() => {
    if (typeof window !== "undefined" && !document.querySelector('script[src*="juniphq"]')) {
      const script = document.createElement("script");
      script.src = "https://widgets.juniphq.com/v1/junip_shopify.js";
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section className="testimonials" id="reviews" aria-label="Customer reviews">
      <div className="container">
        <div className="section-header">
          <p className="section-eyebrow">Reviews</p>
          <h2 className="section-title">What Our Customers Are Saying</h2>
          <p className="section-subtitle">Real reviews from real customers who trust Atlas for their daily hydration.</p>
        </div>
        <span
          className="junip-store-key"
          data-store-key="anLwjMqeGdCvG9w79wSpfM16"
          style={{ display: "none" }}
        />
        <div className="reviews-widget">
          <span
            className="junip-review-section"
            data-layout="grid"
            data-reviews-type="all"
            data-show-summary="true"
            data-reviews-count="6"
            data-min-rating="4"
          >
            <span className="junip-review-section-wrapper" />
          </span>
        </div>
      </div>
    </section>
  );
}
