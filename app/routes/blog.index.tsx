import { useClientScripts } from "~/hooks/useClientScripts";

export function meta() {
  return [
    { title: "Hydration Science Blog | Atlas Hydration" },
    { name: "description", content: "Learn the science of hydration. 12-part series covering electrolytes, amino acids, vitamins, and how to optimize your hydration for peak performance." },
    { property: "og:type", content: "website" },
    { property: "og:title", content: "Hydration Science Blog | Atlas Hydration" },
    { property: "og:description", content: "Learn the science of hydration in our 12-part series covering electrolytes, amino acids, and peak performance." },
    { property: "og:url", content: "https://rwb8771.github.io/atlashydration/blog/" },
    { property: "og:site_name", content: "Atlas Hydration" },
    { tagName: "link", rel: "canonical", href: "https://rwb8771.github.io/atlashydration/blog/" },
  ];
}

export default function BlogIndexPage() {
  useClientScripts();

  return (
    <>
      {/*  Header  */}
  <header className="header header--solid" role="banner">
    <nav className="header__nav" aria-label="Main navigation">
      <a href="/atlashydration/" className="header__logo" aria-label="Atlas Hydration Home">
        <img src="/atlashydration/logo.svg" alt="Atlas Hydration" className="header__logo-img" height="28" />
      </a>
      <div className="header__right">
        <button className="header__icon js-cart-toggle" aria-label="Shopping cart">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6"/></svg>
          <span className="cart-count" style={{display: "none"}}>0</span>
        </button>
      </div>
      <button className="header__hamburger" aria-label="Open menu" id="menuToggle">
        <span></span><span></span><span></span>
      </button>
    </nav>
  </header>

  <main>
    <div className="blog-hub">
      <div className="blog-hub__header">
        <span className="blog-hub__eyebrow">The Science</span>
        <h1 className="blog-hub__title">The Complete Guide to Hydration</h1>
        <p className="blog-hub__subtitle">A 12-part series that takes you from dehydration basics to mastering your daily hydration strategy. Read in order for the full story.</p>
        <span className="blog-hub__series-label">12-Part Series</span>
      </div>

      <div className="blog-hub__grid">
        {/*  Featured: Article 1  */}
        <a href="/atlashydration/blog/dehydration-basics" className="blog-hub__card blog-hub__featured">
          <div className="blog-hub__card-image">
            <img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=600&fit=crop&crop=center" alt="Person exercising in heat" loading="lazy" />
          </div>
          <div className="blog-hub__card-body">
            <span className="blog-hub__card-number">Part 1 of 12</span>
            <h2 className="blog-hub__card-title">What Is Dehydration? The Silent Performance Killer</h2>
            <p className="blog-hub__card-excerpt">Before you can fix your hydration, you need to understand what's actually happening when your body loses water. Spoiler: it starts way before you feel thirsty.</p>
            <span className="blog-hub__card-meta">7 min read</span>
          </div>
        </a>

        {/*  Article 2  */}
        <a href="/atlashydration/blog/sodium-science" className="blog-hub__card">
          <div className="blog-hub__card-image">
            <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=400&fit=crop&crop=center" alt="Athlete hydrating" loading="lazy" />
          </div>
          <div className="blog-hub__card-body">
            <span className="blog-hub__card-number">Part 2 of 12</span>
            <h2 className="blog-hub__card-title">Why Sodium Matters More Than You Think</h2>
            <p className="blog-hub__card-excerpt">The primary electrolyte lost in sweat — and why most drinks don't replace enough.</p>
            <span className="blog-hub__card-meta">5 min read</span>
          </div>
        </a>

        {/*  Article 3  */}
        <a href="/atlashydration/blog/potassium-heart" className="blog-hub__card">
          <div className="blog-hub__card-image">
            <img src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=600&h=400&fit=crop&crop=center" alt="Heart health and fitness" loading="lazy" />
          </div>
          <div className="blog-hub__card-body">
            <span className="blog-hub__card-number">Part 3 of 12</span>
            <h2 className="blog-hub__card-title">Potassium: The Electrolyte Your Heart Needs</h2>
            <p className="blog-hub__card-excerpt">How potassium works with sodium to regulate fluid balance and prevent cramping.</p>
            <span className="blog-hub__card-meta">5 min read</span>
          </div>
        </a>

        {/*  Article 4  */}
        <a href="/atlashydration/blog/magnesium-deficiency" className="blog-hub__card">
          <div className="blog-hub__card-image">
            <img src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop&crop=center" alt="Weight training recovery" loading="lazy" />
          </div>
          <div className="blog-hub__card-body">
            <span className="blog-hub__card-number">Part 4 of 12</span>
            <h2 className="blog-hub__card-title">Magnesium: Why Most Athletes Are Deficient</h2>
            <p className="blog-hub__card-excerpt">The recovery mineral that 75% of Americans don't get enough of.</p>
            <span className="blog-hub__card-meta">5 min read</span>
          </div>
        </a>

        {/*  Article 5  */}
        <a href="/atlashydration/blog/glutamine-recovery" className="blog-hub__card">
          <div className="blog-hub__card-image">
            <img src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&h=400&fit=crop&crop=center" alt="Gym workout" loading="lazy" />
          </div>
          <div className="blog-hub__card-body">
            <span className="blog-hub__card-number">Part 5 of 12</span>
            <h2 className="blog-hub__card-title">L-Glutamine: Your Muscles' Secret Weapon</h2>
            <p className="blog-hub__card-excerpt">The most abundant amino acid in your body — and why exercise drains it fast.</p>
            <span className="blog-hub__card-meta">6 min read</span>
          </div>
        </a>

        {/*  Article 6  */}
        <a href="/atlashydration/blog/taurine-endurance" className="blog-hub__card">
          <div className="blog-hub__card-image">
            <img src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop&crop=center" alt="Endurance running" loading="lazy" />
          </div>
          <div className="blog-hub__card-body">
            <span className="blog-hub__card-number">Part 6 of 12</span>
            <h2 className="blog-hub__card-title">L-Taurine: The Endurance Amino</h2>
            <p className="blog-hub__card-excerpt">Why this amino acid shows up in every performance drink — and how it actually works.</p>
            <span className="blog-hub__card-meta">5 min read</span>
          </div>
        </a>

        {/*  Article 7  */}
        <a href="/atlashydration/blog/b-vitamins-energy" className="blog-hub__card">
          <div className="blog-hub__card-image">
            <img src="https://images.unsplash.com/photo-1593079831268-3381b0db4a77?w=600&h=400&fit=crop&crop=center" alt="Energy and vitality" loading="lazy" />
          </div>
          <div className="blog-hub__card-body">
            <span className="blog-hub__card-number">Part 7 of 12</span>
            <h2 className="blog-hub__card-title">B Vitamins and Hydration: The Energy Connection</h2>
            <p className="blog-hub__card-excerpt">How B vitamins help convert what you drink into cellular energy.</p>
            <span className="blog-hub__card-meta">5 min read</span>
          </div>
        </a>

        {/*  Article 8  */}
        <a href="/atlashydration/blog/vitamin-c-immunity" className="blog-hub__card">
          <div className="blog-hub__card-image">
            <img src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&h=400&fit=crop&crop=center" alt="Healthy nutrition" loading="lazy" />
          </div>
          <div className="blog-hub__card-body">
            <span className="blog-hub__card-number">Part 8 of 12</span>
            <h2 className="blog-hub__card-title">Vitamin C: Beyond Immunity</h2>
            <p className="blog-hub__card-excerpt">The antioxidant that protects your cells during the oxidative stress of exercise.</p>
            <span className="blog-hub__card-meta">5 min read</span>
          </div>
        </a>

        {/*  Article 9  */}
        <a href="/atlashydration/blog/allulose-performance" className="blog-hub__card">
          <div className="blog-hub__card-image">
            <img src="https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=400&fit=crop&crop=center" alt="Runner in motion" loading="lazy" />
          </div>
          <div className="blog-hub__card-body">
            <span className="blog-hub__card-number">Part 9 of 12</span>
            <h2 className="blog-hub__card-title">Allulose: The Zero-Sugar Sweetener That Works</h2>
            <p className="blog-hub__card-excerpt">Why zero glycemic impact matters for sustained athletic performance.</p>
            <span className="blog-hub__card-meta">5 min read</span>
          </div>
        </a>

        {/*  Article 10  */}
        <a href="/atlashydration/blog/hydration-timing" className="blog-hub__card">
          <div className="blog-hub__card-image">
            <img src="https://images.unsplash.com/photo-1461896836934-bd45ba7b5430?w=600&h=400&fit=crop&crop=center" alt="Pre-workout preparation" loading="lazy" />
          </div>
          <div className="blog-hub__card-body">
            <span className="blog-hub__card-number">Part 10 of 12</span>
            <h2 className="blog-hub__card-title">How to Hydrate Before, During, and After Exercise</h2>
            <p className="blog-hub__card-excerpt">The complete timing guide to maximize every sip.</p>
            <span className="blog-hub__card-meta">6 min read</span>
          </div>
        </a>

        {/*  Article 11  */}
        <a href="/atlashydration/blog/hydration-travel" className="blog-hub__card">
          <div className="blog-hub__card-image">
            <img src="https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=600&h=400&fit=crop&crop=center" alt="Airplane travel" loading="lazy" />
          </div>
          <div className="blog-hub__card-body">
            <span className="blog-hub__card-number">Part 11 of 12</span>
            <h2 className="blog-hub__card-title">Hydration for Travel: Why Pilots Need More</h2>
            <p className="blog-hub__card-excerpt">Created by a pilot — why cabin air at 35,000 feet demands better hydration.</p>
            <span className="blog-hub__card-meta">6 min read</span>
          </div>
        </a>

        {/*  Article 12  */}
        <a href="/atlashydration/blog/complete-formula" className="blog-hub__card">
          <div className="blog-hub__card-image">
            <img src="https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=600&h=400&fit=crop&crop=center" alt="Science and formulation" loading="lazy" />
          </div>
          <div className="blog-hub__card-body">
            <span className="blog-hub__card-number">Part 12 of 12</span>
            <h2 className="blog-hub__card-title">The Complete Atlas Formula: Why Every Ingredient Matters</h2>
            <p className="blog-hub__card-excerpt">Bringing it all together — how 10 ingredients work in synergy for total hydration.</p>
            <span className="blog-hub__card-meta">7 min read</span>
          </div>
        </a>
      </div>
    </div>
  </main>

  <footer className="footer" role="contentinfo">
    <div className="container">
      <div className="footer__bottom">
        <p>&copy; 2026 Atlas Hydration. All rights reserved.</p>
      </div>
    </div>
  </footer>
    </>
  );
}
