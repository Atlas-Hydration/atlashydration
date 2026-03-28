export default function ReviewsSection() {
  return (
    <section className="testimonials" id="reviews" aria-label="Customer reviews">
      <div className="container">
        <div className="section-header">
          <p className="section-eyebrow">Reviews</p>
          <h2 className="section-title">What Our Customers Are Saying</h2>
        </div>
        <div className="testimonials__grid">
          {reviews.map((r, i) => (
            <div className="testimonial" key={i}>
              <div className="testimonial__stars">
                {"★★★★★"}
              </div>
              <p className="testimonial__text">{r.text}</p>
              <div className="testimonial__author">
                <span className="testimonial__name">{r.name}</span>
                <span className="testimonial__badge">Verified Buyer</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const reviews = [
  {
    name: "Jake M.",
    text: "Best electrolyte mix I've tried. No sugar crash, great taste, and I feel the difference during my workouts. The stick packs are super convenient for travel.",
  },
  {
    name: "Sarah L.",
    text: "I switched from Liquid IV to Atlas and I'm never going back. Way more electrolytes, no sugar, and the Strawberry Lemonade flavor is delicious.",
  },
  {
    name: "Chris D.",
    text: "As a pilot, I need to stay hydrated on long flights. Atlas is the only product that checks every box — clean ingredients, high electrolytes, zero sugar.",
  },
  {
    name: "Emily R.",
    text: "I use Atlas every morning and before every workout. My energy is more consistent and I've stopped getting afternoon headaches. Game changer.",
  },
  {
    name: "Marcus T.",
    text: "Tried LMNT, Nuun, and DripDrop. Atlas has more electrolytes than all of them and actually tastes good. The subscription price is unbeatable.",
  },
  {
    name: "Amanda K.",
    text: "Finally an electrolyte mix that doesn't taste like medicine or have a ton of sugar. My whole family uses Atlas now. The B vitamins are a nice bonus too.",
  },
];
