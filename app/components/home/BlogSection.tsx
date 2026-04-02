const posts = [
  {
    href: "/#science",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&h=400&fit=crop&crop=center",
    imageAlt: "Athlete training with intensity",
    episode: "Episode 1",
    tag: "Electrolytes",
    title: "Why Sodium Matters More Than You Think",
    excerpt: "At 600mg per serving, Atlas replaces what sweat takes — preventing fatigue, cramps, and cognitive decline.",
  },
  {
    href: "/#science",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600&h=400&fit=crop&crop=center",
    imageAlt: "Athlete recovering post-workout",
    episode: "Episode 2",
    tag: "Recovery",
    title: "L-Glutamine: Your Muscles' Secret Weapon",
    excerpt: "Critical for gut integrity and immune function — especially after intense training when stores are depleted.",
  },
  {
    href: "/#science",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=400&fit=crop&crop=center",
    imageAlt: "Runner pushing through training",
    episode: "Episode 3",
    tag: "Performance",
    title: "Allulose: Zero-Sugar Sweetener That Works",
    excerpt: "Near-zero glycemic impact keeps energy stable. No spikes, no crashes — just clean fuel for performance.",
  },
  {
    href: null,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop&crop=center",
    imageAlt: "Hydration during outdoor activity",
    episode: "Episode 4",
    tag: "Hydration",
    title: "The Dehydration Crisis Nobody Talks About",
    excerpt: "75% of Americans are chronically dehydrated. The science behind why water alone isn't enough.",
    comingSoon: true,
  },
];

export default function BlogSection() {
  return (
    <section className="blog" id="blog" aria-label="Hydration Science">
      <div className="container">
        <div className="section-header">
          <p className="section-eyebrow">The Science</p>
          <h2 className="section-title">Hydration Explained</h2>
          <p className="section-subtitle">
            The science behind proper hydration — what your body needs, and why most drinks fall short.
          </p>
        </div>
        <div className="blog__grid blog__grid--4">
          {posts.map((post) => {
            const inner = (
              <>
                {post.comingSoon && <span className="blog__coming-soon-badge">Coming Soon</span>}
                <div className="blog__card-image">
                  <img src={post.image} alt={post.imageAlt} loading="lazy" />
                </div>
                <div className="blog__card-content">
                  <span className="blog__card-episode">{post.episode}</span>
                  <span className="blog__card-tag">{post.tag}</span>
                  <h3 className="blog__card-title">{post.title}</h3>
                  <p className="blog__card-excerpt">{post.excerpt}</p>
                </div>
              </>
            );

            if (post.comingSoon || !post.href) {
              return (
                <div className="blog__card blog__card--coming-soon" key={post.title}>
                  {inner}
                </div>
              );
            }

            return (
              <a href={post.href} className="blog__card" key={post.title}>
                {inner}
              </a>
            );
          })}
        </div>
        <div className="blog__cta">
          <a href="/#science" className="blog__view-all">
            View All Episodes{" "}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
