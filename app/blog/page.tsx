import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Hydration Explained | Atlas Hydration",
  description: "The science behind proper hydration. Educational articles on electrolytes, recovery, performance, and why most drinks fall short.",
};

const episodes = [
  {
    slug: "sodium-science",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&h=500&fit=crop&crop=center",
    imageAlt: "Athlete training with intensity",
    episode: "Episode 1",
    tag: "Electrolytes",
    title: "Why Sodium Matters More Than You Think",
    excerpt: "At 600mg per serving, Atlas replaces what sweat takes. Sodium is the primary electrolyte lost in sweat, and most people don't realize how quickly levels drop during exercise, travel, or even a normal workday. Without adequate sodium, your body can't retain water efficiently, leading to fatigue, cramps, and cognitive decline.",
    readTime: "5 min read",
  },
  {
    slug: "glutamine-recovery",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&h=500&fit=crop&crop=center",
    imageAlt: "Athlete recovering post-workout",
    episode: "Episode 2",
    tag: "Recovery",
    title: "L-Glutamine: Your Muscles' Secret Weapon",
    excerpt: "L-Glutamine is the most abundant amino acid in your body, and it's critical for gut integrity and immune function. After intense training, your glutamine stores become depleted. Supplementing helps your body recover faster, supports your immune system when it's most vulnerable, and maintains the intestinal barrier that keeps you performing at your best.",
    readTime: "4 min read",
  },
  {
    slug: "allulose-performance",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=500&fit=crop&crop=center",
    imageAlt: "Runner pushing through training",
    episode: "Episode 3",
    tag: "Performance",
    title: "Allulose: Zero-Sugar Sweetener That Works",
    excerpt: "Allulose is a rare sugar that tastes like the real thing but has near-zero glycemic impact. Unlike artificial sweeteners, it doesn't cause digestive issues or insulin spikes. It keeps energy stable throughout your workout or workday. No crashes, no spikes, just clean fuel for sustained performance.",
    readTime: "4 min read",
  },
  {
    slug: null,
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=500&fit=crop&crop=center",
    imageAlt: "Hydration during outdoor activity",
    episode: "Episode 4",
    tag: "Hydration",
    title: "The Dehydration Crisis Nobody Talks About",
    excerpt: "75% of Americans are chronically dehydrated. Most people think drinking water is enough, but without electrolytes, your body can't actually absorb and retain that water efficiently. The science behind why water alone isn't enough, and what you can do about it.",
    readTime: "6 min read",
    comingSoon: true,
  },
  {
    slug: null,
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&h=500&fit=crop&crop=center",
    imageAlt: "Morning routine and wellness",
    episode: "Episode 5",
    tag: "Wellness",
    title: "What Happens When You Hydrate First Thing",
    excerpt: "Your body loses up to a liter of water overnight through breathing and perspiration. Starting your day with electrolyte-rich hydration can improve focus, energy, and digestion within the first hour.",
    readTime: "3 min read",
    comingSoon: true,
  },
  {
    slug: null,
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109db05?w=800&h=500&fit=crop&crop=center",
    imageAlt: "Airplane cabin view",
    episode: "Episode 6",
    tag: "Travel",
    title: "Cabin Pressure and Your Body at 35,000 Feet",
    excerpt: "Pressurized airplane cabins have humidity levels around 10-20%, far below the 30-60% your body prefers. This accelerates dehydration and contributes to jet lag, brain fog, and immune suppression during travel.",
    readTime: "5 min read",
    comingSoon: true,
  },
];

export default function BlogPage() {
  return (
    <main style={{ background: "#ffffff", minHeight: "100vh" }}>
      <section style={{ padding: "120px 0 40px" }}>
        <div className="container">
          <div className="section-header">
            <p className="section-eyebrow">The Science</p>
            <h1 className="section-title">Hydration Explained</h1>
            <p className="section-subtitle">
              The science behind proper hydration. What your body needs, and why most drinks fall short.
            </p>
          </div>
        </div>
      </section>

      <section style={{ padding: "0 0 120px" }}>
        <div className="container">
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
            gap: 32,
          }}>
            {episodes.map((ep) => {
              const card = (
                <div
                  key={ep.title}
                  style={{
                    background: "#fff",
                    border: "1px solid #e8e8e8",
                    borderRadius: 0,
                    overflow: "hidden",
                    transition: "box-shadow 0.2s, transform 0.2s",
                    position: "relative",
                    opacity: ep.comingSoon ? 0.7 : 1,
                  }}
                >
                  {ep.comingSoon && (
                    <span style={{
                      position: "absolute", top: 16, right: 16, zIndex: 2,
                      background: "rgba(0,0,0,0.7)", color: "#fff",
                      fontSize: "0.65rem", fontWeight: 600, padding: "4px 10px",
                      letterSpacing: "0.08em", textTransform: "uppercase",
                    }}>Coming Soon</span>
                  )}
                  <div style={{ aspectRatio: "16/10", overflow: "hidden" }}>
                    <img
                      src={ep.image}
                      alt={ep.imageAlt}
                      loading="lazy"
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </div>
                  <div style={{ padding: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
                      <span style={{
                        fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase",
                        letterSpacing: "0.08em", color: "#999",
                      }}>{ep.episode}</span>
                      <span style={{
                        fontSize: "0.7rem", fontWeight: 600, textTransform: "uppercase",
                        letterSpacing: "0.08em", color: "#1a1a1a",
                      }}>{ep.tag}</span>
                    </div>
                    <h2 style={{
                      fontSize: "1.15rem", fontWeight: 700, color: "#1a1a1a",
                      lineHeight: 1.3, marginBottom: 10,
                      fontFamily: "var(--font-serif, 'Playfair Display', serif)",
                    }}>{ep.title}</h2>
                    <p style={{
                      fontSize: "0.88rem", color: "#666", lineHeight: 1.7, marginBottom: 16,
                    }}>{ep.excerpt}</p>
                    <span style={{
                      fontSize: "0.72rem", color: "#999", fontWeight: 500,
                    }}>{ep.readTime}</span>
                  </div>
                </div>
              );

              if (ep.comingSoon || !ep.slug) return card;
              return (
                <Link href={`/blog#${ep.slug}`} key={ep.title} style={{ textDecoration: "none", color: "inherit" }}>
                  {card}
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}
