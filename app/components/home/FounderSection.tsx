export default function FounderSection() {
  return (
    <section className="founder" id="founder" aria-label="Founder's Story">
      <div className="container">
        <div className="founder__layout">
          <div className="founder__content">
            <p className="founder__eyebrow">The Story Behind Atlas</p>
            <h2 className="founder__heading">Built by a Pilot.<br />For People Who Move.</h2>
            <div className="founder__text">
              <p>
                Flying across the country at 40,000 feet, pressurized cabins pull moisture out of your body faster than you realize. I&apos;d land dehydrated and reaching for products loaded with sugar and artificial garbage. Nothing on the market was built for how I actually live: high output, always moving, zero tolerance for junk ingredients.
              </p>
              <p>
                So I built Atlas. 1,769mg of real electrolytes, B vitamins, Vitamin C, and recovery amino acids. Zero sugar, clean ingredients, no compromises. It&apos;s what I wish existed when I was cutting weight in high school or recovering between back-to-back flights across the Pacific.
              </p>
            </div>
            <div className="founder__signature">
              <div className="founder__sig-header">
                <img
                  className="founder__sig-avatar"
                  src="/images/gemini-generated-image-544vz0544vz0544v-1.webp"
                  alt="Garrett Ray"
                  width="48"
                  height="48"
                  loading="lazy"
                />
                <div className="founder__sig-info">
                  <span className="founder__sig-name">Garrett Ray</span>
                  <span className="founder__sig-role">Founder, Atlas Hydration</span>
                </div>
              </div>
              <a href="https://www.instagram.com/flywithgarrett/" target="_blank" rel="noopener noreferrer" className="founder__instagram">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
                @flywithgarrett
              </a>
            </div>
          </div>
          <div className="founder__image">
            <img
              src="/images/gemini-generated-image-544vz0544vz0544v-1.webp"
              alt="Garrett Ray, founder of Atlas Hydration"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
