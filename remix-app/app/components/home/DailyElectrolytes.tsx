import { useEffect, useRef, useState } from "react";

const benefits = [
  {
    title: "Sustained Energy",
    text: "No sugar crashes. Electrolytes regulate cellular energy production so you stay alert and focused from morning to night.",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" /></svg>,
  },
  {
    title: "Better Sleep",
    text: "Magnesium calms the nervous system and regulates melatonin. Proper hydration before bed reduces nighttime cramps and restlessness.",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>,
  },
  {
    title: "Immune Support",
    text: "Vitamin C (90mg, 100% DV) plus L-Glutamine strengthen your immune response — especially critical during travel and intense training periods.",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>,
  },
  {
    title: "Reduced Cramps & Headaches",
    text: "Most headaches and muscle cramps are dehydration signals. A proper electrolyte balance prevents them before they start.",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 2C10 6 6 10 6 14a6 6 0 1012 0c0-4-4-8-6-12z" /></svg>,
  },
  {
    title: "Faster Recovery",
    text: "Whether you're recovering from a workout, a long flight, or a late night — electrolytes plus amino acids get you back to baseline faster.",
    icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>,
  },
];

interface StatRing {
  count: number;
  suffix: string;
  label: string;
  ringTarget: number;
  gradientId: string;
  gradientColors: [string, string];
  glowColor: string;
  format?: "comma";
}

const stats: StatRing[] = [
  { count: 75, suffix: "%", label: "of Americans are\ncronically dehydrated", ringTarget: 76, gradientId: "ring-grad-1", gradientColors: ["#e85d75", "#F5A623"], glowColor: "#e85d75" },
  { count: 1769, suffix: "mg", label: "electrolytes per\nAtlas serving", ringTarget: 0, gradientId: "ring-grad-2", gradientColors: ["#3b82f6", "#a855f7"], glowColor: "#3b82f6", format: "comma" },
  { count: 0, suffix: "g", label: "sugar — sweetened\nwith allulose & stevia", ringTarget: 302, gradientId: "ring-grad-3", gradientColors: ["#22c55e", "#10b981"], glowColor: "#22c55e" },
  { count: 25, suffix: "", label: "calories per\nstick pack", ringTarget: 277, gradientId: "ring-grad-4", gradientColors: ["#F5A623", "#e85d75"], glowColor: "#F5A623" },
];

function AnimatedNumber({ count, suffix, format }: { count: number; suffix: string; format?: string }) {
  const [display, setDisplay] = useState("0" + suffix);
  const ref = useRef<HTMLDivElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animated.current) {
          animated.current = true;
          const start = performance.now();
          const duration = 1500;
          function step(now: number) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            let val = Math.floor(eased * count);
            if (format === "comma") val = Number(val);
            const formatted = format === "comma" ? val.toLocaleString() : String(val);
            setDisplay(formatted + suffix);
            if (progress < 1) requestAnimationFrame(step);
            else setDisplay((format === "comma" ? count.toLocaleString() : String(count)) + suffix);
          }
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [count, suffix, format]);

  return <div className="ed__stat-number" ref={ref}>{display}</div>;
}

function StatCards() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="ed__visual" ref={ref}>
      {stats.map((s, i) => (
        <div
          className={`ed__stat-card${visible ? " ed__stat-card--visible" : ""}`}
          key={i}
          style={{
            "--stat-delay": `${i * 150}ms`,
            "--ring-target": String(s.ringTarget),
            transitionDelay: `${i * 150}ms`,
          } as React.CSSProperties}
        >
          <div className="ed__ring-wrap">
            <svg className="ed__ring" viewBox="0 0 120 120" aria-hidden="true">
              <defs>
                <linearGradient id={s.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={s.gradientColors[0]} />
                  <stop offset="100%" stopColor={s.gradientColors[1]} />
                </linearGradient>
              </defs>
              <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
              <circle
                className="ed__ring-fill"
                cx="60" cy="60" r="48"
                fill="none"
                stroke={`url(#${s.gradientId})`}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="302"
                strokeDashoffset={visible ? s.ringTarget : 302}
                transform="rotate(-90 60 60)"
                style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
              />
            </svg>
            <div className="ed__ring-glow" style={{ "--glow-color": s.glowColor } as React.CSSProperties} />
          </div>
          <div className="ed__stat-value">
            <AnimatedNumber count={s.count} suffix={s.suffix} format={s.format} />
            <div className="ed__stat-label" dangerouslySetInnerHTML={{ __html: s.label.replace("\n", "<br/>") }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function DailyElectrolytes() {
  return (
    <section className="electrolytes-daily" id="electrolytes" aria-label="Daily Electrolyte Benefits">
      <div className="container">
        <div className="ed__layout">
          <div className="ed__content">
            <p className="section-eyebrow">Daily Hydration</p>
            <h2 className="ed__heading">What Changes When You Hydrate Properly</h2>
            <p className="ed__intro">
              Most people are chronically dehydrated without knowing it. Adding electrolytes to your daily routine transforms how you feel, think, and perform.
            </p>
            <div className="ed__benefits">
              {benefits.map((b) => (
                <div className="ed__benefit" key={b.title}>
                  <div className="ed__benefit-icon">{b.icon}</div>
                  <div>
                    <h4 className="ed__benefit-title">{b.title}</h4>
                    <p className="ed__benefit-text">{b.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <StatCards />
                <div className="ed__ring-wrap">
                  <svg className="ed__ring" viewBox="0 0 120 120" aria-hidden="true">
                    <defs>
                      <linearGradient id={s.gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={s.gradientColors[0]} />
                        <stop offset="100%" stopColor={s.gradientColors[1]} />
                      </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="48" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                    <circle
                      className="ed__ring-fill"
                      cx="60" cy="60" r="48"
                      fill="none"
                      stroke={`url(#${s.gradientId})`}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray="302"
                      strokeDashoffset="302"
                      transform="rotate(-90 60 60)"
                      data-target={s.ringTarget}
                    />
                  </svg>
                  <div className="ed__ring-glow" style={{ "--glow-color": s.glowColor } as React.CSSProperties} />
                </div>
                <div className="ed__stat-value">
                  <AnimatedNumber count={s.count} suffix={s.suffix} format={s.format} />
                  <div className="ed__stat-label" dangerouslySetInnerHTML={{ __html: s.label.replace("\n", "<br/>") }} />
                </div>
        </div>
      </div>
    </section>
  );
}
