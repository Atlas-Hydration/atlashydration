"use client";

import { useState } from "react";
import { FORMULA, FORMULA_TOTAL, FORMULA_ELECTROLYTE_BREAKDOWN } from "@/app/data/formula";

const LEGACY_ELECTROLYTE_ANSWER =
  'Each stick pack contains <strong>1,769mg of total electrolytes</strong>: 600mg Sodium (from Sodium Citrate and Pink Himalayan Salt), 500mg Potassium (from Potassium Citrate), 200mg Magnesium (from Magnesium Malate), and 469mg Chloride (from Pink Himalayan Salt).';

const CURRENT_ELECTROLYTE_ANSWER = `Each Strawberry Lemonade stick pack contains <strong>${FORMULA_TOTAL}mg of total electrolytes</strong>, including ${FORMULA_ELECTROLYTE_BREAKDOWN}. Sodium comes from sodium citrate and pink Himalayan salt, magnesium from magnesium malate, and potassium from potassium citrate.`;

function buildFaqItems(formula: "current" | "legacy") {
  return [
    {
      question: "What electrolytes does Atlas contain?",
      answer: formula === "current" ? CURRENT_ELECTROLYTE_ANSWER : LEGACY_ELECTROLYTE_ANSWER,
    },
    {
      question: "Is Atlas sugar-free?",
      answer: `Yes. Atlas has <strong>zero grams of sugar</strong> and <strong>${FORMULA.calories} calories per stick pack</strong>. It is sweetened with stevia leaf extract and allulose.`,
    },
    {
      question: "How does Atlas compare to other electrolyte mixes?",
      answer: `Every brand formulates differently, so we suggest comparing labels side by side. Atlas provides <strong>${FORMULA_TOTAL}mg total electrolytes</strong>, zero sugar, and ${FORMULA.calories} calories per stick, plus B vitamins, vitamin C, L-Glutamine, and L-Alanine. That works out to $1.87 per stick, or $1.50 with a subscription.`,
    },
    {
      question: "What vitamins and amino acids are included?",
      answer:
        '<strong>Vitamin C</strong> (90mg), <strong>B3</strong> (24mg), <strong>B5</strong> (5mg), <strong>B6</strong> (2mg), and <strong>B12</strong> (8mcg). For recovery support: <strong>1,000mg L-Glutamine</strong> and <strong>200mg L-Alanine</strong>.',
    },
    {
      question: "How do I use Atlas?",
      answer:
        "Mix one stick pack with 12–16 oz of cold water and shake or stir until dissolved. Use it around training, travel, time in the heat, or any time you want to replace electrolytes.",
    },
    {
      question: "Who founded Atlas and why?",
      answer:
        'Atlas was founded by <strong>Garrett Ray</strong>, a 787 pilot who travels internationally and also trains, runs, and plays padel. He wanted a hydration product that worked across travel, training, heat, recovery, and long workdays, with clean ingredients and no sugar. Atlas is a 1% for the Planet member and donates 1% of every sale to clean-water organizations.',
    },
  ];
}

export default function FaqSection({ formula = "current" }: { formula?: "current" | "legacy" }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqItems = buildFaqItems(formula);

  return (
    <section className="product-faq product-faq--dark" id="faq" aria-label="Frequently Asked Questions about Atlas Hydration">
      <div className="container">
        <div className="product-faq__grid">
          <div className="product-faq__header">
            <p className="section-eyebrow">FAQ</p>
            <h2 className="product-faq__title">Questions<br />we get asked.</h2>
            <p className="product-faq__subtitle">Everything you need to know about Atlas, from ingredients to how to use it.</p>
          </div>
          <div className="product-faq__list">
            {faqItems.map((item, i) => (
              <div className={`product-faq__item${openIndex === i ? " open" : ""}`} key={i}>
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
                <div className="product-faq__answer">
                  <p dangerouslySetInnerHTML={{ __html: item.answer }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
