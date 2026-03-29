export default function CtaSection() {
  return (
    <section className="cta-section" aria-label="Call to action">
      <div className="cta-section__video-wrap">
        <iframe
          className="cta-section__video-yt"
          src="https://www.youtube.com/embed/l0Dk8Ylqbxk?autoplay=1&mute=1&loop=1&playlist=l0Dk8Ylqbxk&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1"
          allow="autoplay; encrypted-media"
          allowFullScreen
        />
      </div>
      <div className="cta-section__overlay" />
      <div className="container">
        <div className="cta-section__inner">
          <p className="cta-section__eyebrow">1% for the Planet Member</p>
          <h2 className="cta-section__title">Hydrate Your Body.<br />Protect Our Water.</h2>
          <p className="cta-section__text">
            Atlas Hydration is a proud member of 1% for the Planet. We donate 1% of every sale to organizations dedicated to providing clean, accessible water to communities around the world. Because hydration shouldn&apos;t be a privilege — it should be a right.
          </p>
          <a href="#products" className="btn btn--white btn--lg">Shop &amp; Give Back</a>
        </div>
      </div>
    </section>
  );
}
