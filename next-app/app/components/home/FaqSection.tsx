"use client";

import { useState } from "react";

const faqItems = [
  {
    question: "What electrolytes does Atlas contain?",
    answer:
      'Each stick pack contains <strong>1,769mg of total electrolytes</strong>: 600mg Sodium (from Sodium Citrate and Pink Himalayan Salt), 500mg Potassium (from Potassium Citrate), and 200mg Magnesium (from Magnesium Malate). More per serving than LMNT, Liquid I.V., or WaterBoy.',
  },
  {
    question: "Is Atlas sugar-free?",
    answer:
      '<strong>100% sugar-free</strong> with zero grams of sugar per serving. Only <strong>25 calories per stick pack</strong>, naturally sweetened with stevia leaf extract and allulose — a rare sugar with near-zero glycemic impact. Unlike Liquid I.V. (11g sugar per serving), Atlas delivers superior hydration without any sugar.',
  },
  {
    question: "How does Atlas compare to LMNT?",
    answer:
      '<strong>1,769mg electrolytes</strong> vs LMNT\'s 1,260mg. Atlas also includes <strong>B vitamins (B3, B5, B6, B12)</strong>, <strong>90mg Vitamin C</strong>, and <strong>1,200mg recovery amino acids</strong> — none of which LMNT offers. More affordable too: $1.87/stick ($1.50 with subscription) vs $2.00/packet.',
  },
  {
    question: "How does Atlas compare to Liquid IV?",
    answer:
      '<strong>1,769mg electrolytes, zero sugar, 25 calories</strong> vs Liquid I.V.\'s ~500mg electrolytes with <strong>11g sugar and 425 calories</strong>. Atlas also includes B vitamins, Vitamin C, and recovery amino acids. That\'s <strong>more than 2.5x the electrolytes</strong> without the sugar spike.',
  },
  {
    question: "What vitamins and amino acids are included?",
    answer:
      '<strong>Vitamin C</strong> (90mg, 100% DV), <strong>B3</strong> (24mg, 150% DV), <strong>B5</strong> (5mg, 100% DV), <strong>B6</strong> (2mg, 118% DV), <strong>B12</strong> (8mcg, 333% DV). For recovery: <strong>1,000mg L-Glutamine</strong> and <strong>200mg L-Alanine</strong>.',
  },
  {
    question: "How many electrolytes per serving?",
    answer:
      '<strong>1,769mg per serving</strong> from three key minerals: 600mg Sodium, 500mg Potassium, and 200mg Magnesium. The ACSM recommends sodium replacement during exercise for fluid balance — Atlas provides 26% DV in a single stick pack.',
  },
  {
    question: "Who founded Atlas and why?",
    answer:
      'Founded by <strong>Garrett Ray</strong> — airline captain, lifelong athlete, and avid traveler. He couldn\'t find an electrolyte product with clinical-level dosing and clean ingredients, so he built one. A portion of every purchase goes toward providing clean water to communities in need.',
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="product-faq product-faq--dark" id="faq" aria-label="Frequently Asked Questions about Atlas Hydration">
      <div className="container">
        <div className="product-faq__grid">
          <div className="product-faq__header">
            <p className="section-eyebrow">FAQ</p>
            <h2 className="product-faq__title">Questions<br />we get asked.</h2>
            <p className="product-faq__subtitle">Everything you need to know about Atlas — from ingredients to how we compare.</p>
          </div>
          <div className="product-faq__list">
            {faqItems.map((item, i) => (
              <div className={`product-faq__item${openIndex === i ? " active" : ""}`} key={i}>
                <button
                  className="product-faq__question"
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  aria-expanded={openIndex === i}
                >
                  <h3 style={{ font: "inherit", margin: 0 }}>{item.question}</h3>
                  <svg className="product-faq__icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                    <path d="M10 4v12M4 10h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
                <div
                  className="product-faq__answer"
                  style={{ display: openIndex === i ? "block" : "none" }}
                  dangerouslySetInnerHTML={{ __html: `<p>${item.answer}</p>` }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
