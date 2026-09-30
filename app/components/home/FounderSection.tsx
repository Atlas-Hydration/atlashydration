import fs from "node:fs";
import path from "node:path";

/**
 * Drop a real photo at public/images/founder.jpg (or .jpeg / .webp / .png) and
 * it replaces the "Where Atlas gets used" panel automatically.
 */
function findFounderPhoto(): string | null {
  for (const ext of ["jpg", "jpeg", "webp", "png"]) {
    if (fs.existsSync(path.join(process.cwd(), "public", "images", `founder.${ext}`))) {
      return `/images/founder.${ext}`;
    }
  }
  return null;
}

const places = [
  { where: "In the air", what: "Long-haul 787 flights across time zones." },
  { where: "In the gym", what: "Early workouts before the day starts." },
  { where: "In the heat", what: "Summer runs and padel on the court." },
  { where: "At the desk", what: "Full workdays, with a stick in the drawer." },
];

export default function FounderSection() {
  const photo = findFounderPhoto();
  return (
    <section className="fdr" id="founder" aria-labelledby="fdr-title">
      <div className="container">
        <div className="fdr__layout">
          <div className="fdr__content">
            <p className="section-eyebrow">The story behind Atlas</p>
            <h2 className="fdr__heading" id="fdr-title">Built by a pilot, for people who move.</h2>
            <div className="fdr__text">
              <p>
                Atlas was founded by Garrett Ray, a 787 pilot who travels internationally and still makes time to train, run, and play padel. Between long-haul flights, early workouts, summer heat, and full workdays, he wanted one hydration product that held up everywhere, without sugar or filler.
              </p>
              <p>
                So he built Atlas: 1,769mg of electrolytes, B vitamins, vitamin C, and amino acids in a stick pack that fits a carry-on, a gym bag, or a desk drawer. Zero sugar. 25 calories. Nothing to hide.
              </p>
            </div>
            <div className="fdr__sig">
              <span className="fdr__sig-name">Garrett Ray</span>
              <span className="fdr__sig-role">Founder, Atlas Hydration · 787 pilot</span>
              <a href="https://www.instagram.com/flywithgarrett/" target="_blank" rel="noopener noreferrer" className="fdr__ig">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="5" />
                  <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                </svg>
                @flywithgarrett
              </a>
            </div>
          </div>

          {photo ? (
            <img className="fdr__photo" src={photo} alt="Garrett Ray, founder of Atlas Hydration" loading="lazy" />
          ) : (
            <div className="fdr__panel">
              <p className="fdr__panel-title">Where Atlas gets used</p>
              <ul className="fdr__places">
                {places.map((p) => (
                  <li key={p.where}>
                    <span className="fdr__where">{p.where}</span>
                    <span className="fdr__what">{p.what}</span>
                  </li>
                ))}
              </ul>
              <img src="/logo.svg" alt="" className="fdr__panel-logo" height={22} loading="lazy" />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
