export default function CtaSection() {
  return (
    <section className="cta-section cta-section--ocean" aria-label="Call to action">
      <div className="cta-section__overlay" />
      <div className="container">
        <div className="cta-section__inner">
          <p className="cta-section__eyebrow">1% for the Planet Member</p>
          <h2 className="cta-section__title">Hydrate Your Body.<br />Protect Our Water.</h2>
          <p className="cta-section__text">
            Atlas Hydration is a proud member of 1% for the Planet. We donate 1% of every sale to organizations dedicated to providing clean, accessible water to communities around the world. Because hydration should never be a privilege. It should be a right.
          </p>
          <a href="/products/strawberry-lemonade" className="btn btn--white btn--lg">Shop &amp; Give Back</a>
        </div>
      </div>
    </section>
  );
}
