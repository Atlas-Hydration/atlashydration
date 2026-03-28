import { useEffect } from "react";

export default function ReviewsSection() {
  useEffect(() => {
    // Load Junip widget script
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
        </div>
        {/* Junip Store Key */}
        <span
          className="junip-store-key"
          data-store-key="anLwjMqeGdCvG9w79wSpfM16"
          style={{ display: "none" }}
        />
        {/* Junip Review Section */}
        <span
          className="junip-review-section"
          data-layout="grid"
          data-reviews-type="all"
          data-show-summary="true"
          data-reviews-count="6"
        >
          <span className="junip-review-section-wrapper" />
        </span>
      </div>
    </section>
  );
}
