/**
 * "Hydration Explained" articles.
 *
 * Editorial rules for this file:
 * - General education, not medical advice. Hedge where the evidence is mixed.
 * - Product facts come from the Supplement Facts label (see formula.ts).
 * - Keep sources to ones we can name precisely; no invented statistics.
 */

export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "callout"; title: string; text: string };

export interface Article {
  slug: string;
  tag: string;
  title: string;
  dek: string;
  readTime: string;
  /** ISO date (YYYY-MM-DD). */
  published: string;
  /** Typographic cover: one real figure from the article. */
  cover: { figure: string; caption: string; tone: "dark" | "stone" | "rose" };
  takeaways: string[];
  body: Block[];
  sources: string[];
  sourceNote?: string;
}

export const ARTICLES: Article[] = [
  {
    slug: "sodium-science",
    tag: "Electrolytes",
    title: "Why Sodium Matters More Than You Think",
    dek: "Sodium is the main electrolyte in sweat, and the one most hydration advice skips past.",
    readTime: "5 min read",
    published: "2026-09-30",
    cover: { figure: "200–2,000", caption: "mg of sodium per liter of sweat. The reported range across people.", tone: "dark" },
    takeaways: [
      "Sodium is the main electrolyte lost in sweat, and how much you lose varies a lot from person to person.",
      "It helps your body hold on to the fluid you drink and is involved in nerve and muscle signaling.",
      "Over many hours of heavy sweating, drinking only plain water can dilute blood sodium. Drinking to thirst is the main safeguard.",
      "For a short, easy session, water and a normal diet are usually enough. Sodium matters most for long, hot, or heavy-sweating efforts.",
    ],
    body: [
      { type: "p", text: "Ask most people what hydration means and they will say water. Ask a sports physiologist and they will talk about sodium. The two answers are connected, and understanding how is the quickest way to make better decisions about what you drink when you train, travel, or spend time in the heat." },
      { type: "h2", text: "What sodium actually does" },
      { type: "p", text: "Sodium is the main electrolyte in the fluid outside your cells. Electrolytes are minerals that carry an electrical charge when dissolved, and sodium's charge is part of what lets nerves fire and muscles contract. Sodium also strongly influences how much water your body holds in the blood and surrounding tissues. When sodium is low relative to water, your body tends to make more urine. When it is adequate, the fluid you drink is retained more effectively." },
      { type: "h2", text: "What sweat takes with it" },
      { type: "p", text: "Sweat is mostly water with dissolved salts. Sodium and chloride make up most of those salts, with smaller amounts of potassium, magnesium, and calcium. The amount of sodium in sweat varies enormously. Published reviews report a range of roughly 200 to 2,000 milligrams of sodium per liter of sweat, and sweat rates during exercise commonly fall between about 0.5 and 2 liters per hour, higher in hot conditions." },
      { type: "p", text: "That means two people finishing the same hour-long session in the same room can have lost very different amounts of sodium. It also explains why some people finish a workout with white salt marks on their clothes or hat, and others never do." },
      { type: "h2", text: "Why plain water can fall short" },
      { type: "p", text: "For short, easy sessions, water is enough and your normal diet restores the rest. The picture changes during long or hot efforts. If you sweat heavily for hours and replace the loss with only plain water, blood sodium can be diluted. In endurance events this can progress to exercise-associated hyponatremia, a condition of low blood sodium that can be serious." },
      { type: "p", text: "The international consensus statement on the condition is clear that its main cause is drinking more than you lose, and its main advice is to drink according to thirst rather than on a fixed schedule. Replacing sodium through food or a drink can help offset what sweat removes, but it does not make overdrinking safe." },
      { type: "h2", text: "A practical way to think about it" },
      { type: "ul", items: [
        "Under about an hour at moderate effort: water is usually enough.",
        "Long sessions, heat, or heavy sweating: include sodium from food or a drink, and drink to thirst.",
        "Salt crusting on your skin or clothing: you may be a saltier sweater than average.",
        "Weigh yourself before and after a hard session. Each kilogram lost is roughly a liter of fluid, which gives you a rough idea of your sweat rate.",
      ] },
      { type: "p", text: "Those are starting points, not rules. Needs depend on the person, the conditions, and what else you eat." },
      { type: "callout", title: "Where Atlas fits", text: "Each Atlas Strawberry Lemonade stick contains 600 mg of sodium (26% of the Daily Value), 500 mg of potassium, and 200 mg of magnesium, with 0 g sugar and 25 calories. It is meant to be mixed into water around training, travel, and hot days. If you are on a sodium-restricted diet or have high blood pressure, or kidney or heart conditions, check with your clinician first." },
    ],
    sources: [
      "Baker LB. Sweating rate and sweat sodium concentration in athletes: a review of methodology and intra/interindividual variability. Sports Medicine. 2017;47(Suppl 1):111-128.",
      "Hew-Butler T, et al. Statement of the Third International Exercise-Associated Hyponatremia Consensus Development Conference, Carlsbad, California, 2015. Clinical Journal of Sport Medicine. 2015;25(4):303-320.",
    ],
  },
  {
    slug: "amino-acids-hydration",
    tag: "Ingredients",
    title: "L-Glutamine and L-Alanine: Why There Are Amino Acids in an Electrolyte Mix",
    dek: "What these two amino acids do, what the research does and does not show, and why we include them.",
    readTime: "4 min read",
    published: "2026-09-30",
    cover: { figure: "1,200", caption: "mg of amino acids in every Atlas stick: 1,000 mg L-Glutamine and 200 mg L-Alanine.", tone: "rose" },
    takeaways: [
      "Glutamine is the most abundant free amino acid in the body. Alanine helps move nitrogen between muscle and liver.",
      "Research on glutamine supplements for recovery or immunity in athletes is mixed, so we do not treat them as a performance promise.",
      "Some amino acids are absorbed in the gut together with sodium, which is why they have been studied in oral rehydration formulas.",
      "Each Atlas stick has 1,000 mg of L-Glutamine and 200 mg of L-Alanine, printed on the label.",
    ],
    body: [
      { type: "p", text: "Most electrolyte mixes stop at minerals. Atlas also includes two amino acids, L-glutamine and L-alanine. Here is what each one is, what the evidence says, and our reasoning." },
      { type: "h2", text: "Two amino acids, two jobs" },
      { type: "p", text: "Amino acids are the building blocks of protein. Glutamine is the most abundant free amino acid in your blood and muscles. Immune cells and the cells lining the intestine use it as a fuel source, and muscle releases it into the bloodstream, particularly under stress." },
      { type: "p", text: "Alanine is a smaller player with a useful job: it carries nitrogen from muscle to the liver, where it can be used to make glucose during prolonged exercise or fasting. Your body makes both, which is why they are called non-essential, although glutamine is sometimes described as conditionally essential during heavy physical stress." },
      { type: "h2", text: "What the research does and does not show" },
      { type: "p", text: "Blood glutamine can fall after prolonged, intense exercise, and that observation is behind many supplement claims. But when researchers test glutamine supplements in athletes, the results are mixed. A widely cited review by Michael Gleeson found little consistent evidence that glutamine supplementation improves performance or reliably protects against the infections some athletes get after heavy training. Studies are often short and small, and doses vary." },
      { type: "p", text: "That is why you will not see us promise faster recovery from a glutamine stick. The honest summary is that it is a well-tolerated amino acid with a plausible role and limited proof of a measurable training benefit." },
      { type: "h2", text: "The hydration angle" },
      { type: "p", text: "There is a separate reason amino acids show up in hydration research. In the small intestine, water follows sodium as it is absorbed, and sodium crosses the gut wall together with other molecules. Glucose is the classic partner. Several amino acids, including glutamine and alanine, use sodium-coupled transporters as well, and researchers have explored them in oral rehydration solutions for that reason." },
      { type: "p", text: "The everyday evidence for athletes drinking an electrolyte mix is more limited than the laboratory mechanism suggests, so we treat this as a reasonable design choice rather than a guaranteed benefit." },
      { type: "h2", text: "Why we include them" },
      { type: "p", text: "We include 1,000 mg of L-glutamine and 200 mg of L-alanine in each stick because they fit a formula meant for use around training and travel, they add no sugar, and the amounts are printed on the label so you can judge for yourself." },
      { type: "callout", title: "Where Atlas fits", text: "Atlas Strawberry Lemonade provides 1,000 mg of L-Glutamine and 200 mg of L-Alanine per stick, alongside sodium, potassium, magnesium, vitamin C, and B vitamins." },
    ],
    sources: [
      "Gleeson M. Dosing and efficacy of glutamine supplementation in human exercise and sport training. Journal of Nutrition. 2008;138(10):2045S-2049S.",
    ],
  },
  {
    slug: "allulose-performance",
    tag: "Ingredients",
    title: "Allulose: The Zero-Sugar Sweetener, Explained",
    dek: "A rare sugar that tastes like sugar and is counted differently on the label. What it is and what to know.",
    readTime: "4 min read",
    published: "2026-09-30",
    cover: { figure: "0.4", caption: "calories per gram of allulose, compared with 4 for table sugar.", tone: "stone" },
    takeaways: [
      "Allulose is a naturally occurring rare sugar, roughly 70% as sweet as table sugar.",
      "Most of it is absorbed but not used for energy, so it contributes about 0.4 calories per gram instead of 4.",
      "In the US it is not counted as sugar on the label, though it still counts toward total carbohydrate.",
      "Very large amounts can upset digestion in some people, so the dose matters.",
    ],
    body: [
      { type: "p", text: "When people hear \"zero sugar\", they often assume the sweetness comes from artificial chemicals. Atlas uses two sweeteners: stevia leaf extract and allulose. Stevia is familiar. Allulose is the one people ask about." },
      { type: "h2", text: "What allulose is" },
      { type: "p", text: "Allulose, also called psicose, is a simple sugar with the same chemical formula as fructose, arranged differently. It occurs naturally in small amounts in foods such as figs, raisins, and wheat, and is produced commercially by converting fructose with enzymes. It is roughly 70 percent as sweet as table sugar with a similar taste and texture, which is why formulators use it to keep zero-sugar products from tasting thin." },
      { type: "h2", text: "Why it has so few calories" },
      { type: "p", text: "Your body absorbs most allulose in the small intestine but does not use it for energy. Most of it leaves in urine and the rest passes through to the colon. The FDA recognizes an energy value of about 0.4 calories per gram, compared with 4 for sugar." },
      { type: "h2", text: "How it appears on the label" },
      { type: "p", text: "In 2019 the FDA announced it would allow allulose to be left out of the Total Sugars and Added Sugars declarations, while still requiring it to be counted in Total Carbohydrate. That is how a product can list 0 g of sugar and still contain carbohydrate. Atlas lists 0 g of sugar and 6 g of total carbohydrate per stick. Zero sugar on a label does not mean zero carbohydrate, and we would rather say so plainly." },
      { type: "h2", text: "Blood sugar and digestion" },
      { type: "p", text: "In human studies, allulose has had little effect on blood glucose or insulin in healthy adults, which is a reason it is popular in low-sugar products. Tolerance is the main caveat. Amounts much larger than a flavored drink mix provides can cause bloating, gas, or loose stools in some people, and sensitivity varies. If you manage diabetes, ask your clinician how a new sweetener fits your plan." },
      { type: "h2", text: "Why pair it with stevia" },
      { type: "p", text: "Stevia leaf extract is intensely sweet in tiny amounts but can leave a lingering aftertaste on its own. Allulose rounds out the flavor and adds body, which is a common reason formulators combine the two." },
      { type: "callout", title: "Where Atlas fits", text: "Atlas is sweetened with stevia leaf and allulose, with 0 g of sugar and 25 calories per stick." },
    ],
    sources: [
      "U.S. Food and Drug Administration. The Declaration of Allulose and Calories from Allulose on Nutrition and Supplement Facts Labels: Guidance for Industry. 2020.",
    ],
  },
  {
    slug: "water-and-electrolytes",
    tag: "Hydration",
    title: "Water vs. Electrolytes: When Plain Water Isn't Enough",
    dek: "For most of your day, water is exactly right. Here is when adding electrolytes makes a difference, and when it does not.",
    readTime: "5 min read",
    published: "2026-09-30",
    cover: { figure: "13", caption: "drinks compared against still water in the Beverage Hydration Index study.", tone: "dark" },
    takeaways: [
      "Plain water is the right default for most people most of the day.",
      "In a well-known beverage study, drinks containing sodium were retained better than still water.",
      "Electrolytes matter most when you sweat a lot: long sessions, heat, or several hard days in a row.",
      "Any fluid can be overdone. Drink to thirst and adjust to conditions.",
    ],
    body: [
      { type: "p", text: "We make an electrolyte drink mix, and we will start by telling you that for most of your day you do not need one. Water is the right drink for ordinary hydration. The interesting question is what changes when you sweat." },
      { type: "h2", text: "How your body decides to keep a drink" },
      { type: "p", text: "After you drink, your kidneys adjust urine output to keep the body's water and sodium in balance. A drink that dilutes your blood, such as a large volume of plain water, tends to be followed by more urine. A drink with sodium, some energy, or protein tends to be followed by less." },
      { type: "h2", text: "What the beverage study found" },
      { type: "p", text: "In 2016, researchers gave 72 volunteers a liter of each of 13 different drinks on separate days and measured urine output over the following four hours. They scored each drink against still water on a beverage hydration index. An oral rehydration solution, which contains sodium, potassium, and glucose, came out ahead of water, as did full-fat and skim milk and orange juice. Volunteers held on to more of those drinks. Sodium, and in milk's case energy and protein, were the likely reasons. Most of the other drinks, including coffee, tea, and common sports drinks, were similar to water." },
      { type: "h2", text: "When electrolytes start to matter" },
      { type: "p", text: "The benefit is about replacement, not magic. If you are sitting at a desk, your diet covers your sodium. The case for adding electrolytes builds with how much you sweat: long training sessions, hot weather, heavy sweaters, or several hard days back to back. There is no universal threshold, and nothing here says that more is better." },
      { type: "h2", text: "Do not overdo it" },
      { type: "p", text: "Fluid balance is a range. Drinking far more than you lose, especially plain water, can dilute blood sodium. Thirst is a reliable guide for most people in most situations, and pale yellow urine is a rough everyday check." },
      { type: "callout", title: "Where Atlas fits", text: "Atlas is meant for the situations in this article where sweat losses are high, with 600 mg of sodium, 500 mg of potassium, and 200 mg of magnesium per stick. For everyday sipping, water is still the right choice." },
    ],
    sources: [
      "Maughan RJ, et al. A randomized trial to assess the potential of different beverages to affect hydration status: development of a beverage hydration index. American Journal of Clinical Nutrition. 2016;103(3):717-723.",
      "Hew-Butler T, et al. Statement of the Third International Exercise-Associated Hyponatremia Consensus Development Conference, Carlsbad, California, 2015. Clinical Journal of Sport Medicine. 2015;25(4):303-320.",
    ],
  },
  {
    slug: "morning-hydration",
    tag: "Wellness",
    title: "Morning Hydration: What the Research Actually Says",
    dek: "You wake up after hours without a drink. Does a glass of water first thing change anything? An honest look.",
    readTime: "4 min read",
    published: "2026-09-30",
    cover: { figure: "1–2%", caption: "of body weight lost as fluid in studies of mild dehydration.", tone: "stone" },
    takeaways: [
      "You go hours without drinking overnight, but a healthy body regulates water tightly. You do not wake up in trouble.",
      "Lab studies link mild dehydration (about 1 to 2% of body weight) with worse mood and concentration, but they induce it with heat or exercise, not sleep.",
      "A glass of water when you wake up is a harmless habit. Coffee still counts toward your fluids.",
      "Add electrolytes if you train early or sweat heavily, not as a required ritual.",
    ],
    body: [
      { type: "p", text: "Plenty of hydration advice says to drink water first thing in the morning, often with promises about energy, focus, and digestion. Some of it holds up and some of it does not. Here is how we read the research." },
      { type: "h2", text: "What happens overnight" },
      { type: "p", text: "You lose water while you sleep through breathing and through the skin, and you do not replace it for seven to nine hours. Your body responds by releasing hormones that reduce urine output, which is why first-morning urine is usually darker. That is the system working as designed, not a sign of a problem." },
      { type: "h2", text: "What mild dehydration does" },
      { type: "p", text: "Researchers have studied what happens when healthy volunteers lose around 1 to 2 percent of their body weight in fluid. In small studies, volunteers reported worse mood, more difficulty concentrating, and more headaches, and performed worse on some mental tasks." },
      { type: "p", text: "The key detail is how the dehydration was produced: through exercise, heat, or fluid restriction, then compared against a hydrated day. Those results do not show that a normal night's sleep leaves you impaired until you drink a glass of water." },
      { type: "h2", text: "What about coffee" },
      { type: "p", text: "Many people reach for coffee before water. In a controlled study of habitual coffee drinkers, moderate intake (four cups a day) produced hydration markers similar to the same amount of water. Coffee can be part of your fluid intake." },
      { type: "h2", text: "A sensible morning routine" },
      { type: "ul", items: [
        "Drink a glass of water when you wake up if you like it. It costs nothing and is an easy habit to anchor to.",
        "If you train early, drink before and after, and consider electrolytes if you sweat heavily or the session is long.",
        "Keep drinking through the morning. One glass does not cover the day.",
        "Judge by thirst and urine color rather than a fixed number of glasses.",
      ] },
      { type: "callout", title: "Where Atlas fits", text: "If your morning includes a hard session, an early flight, or a hot commute, mixing an Atlas stick into a bottle of water gives you electrolytes without sugar. On a quiet morning, plain water is fine." },
    ],
    sources: [
      "Armstrong LE, et al. Mild dehydration affects mood in healthy young women. Journal of Nutrition. 2012;142(2):382-388.",
      "Ganio MS, et al. Mild dehydration impairs cognitive performance and mood of men. British Journal of Nutrition. 2011;106(10):1535-1543.",
      "Killer SC, Blannin AK, Jeukendrup AE. No evidence of dehydration with moderate daily coffee intake: a counterbalanced cross-over study in a free-living population. PLoS ONE. 2014;9(1):e84154.",
    ],
  },
  {
    slug: "cabin-air-and-hydration",
    tag: "Travel",
    title: "Flying and Hydration: What Cabin Air Really Does",
    dek: "Airplane cabins are very dry. Whether that dehydrates you is more nuanced, and so is what to do about it.",
    readTime: "5 min read",
    published: "2026-09-30",
    cover: { figure: "10–20%", caption: "commonly reported cabin relative humidity at cruising altitude.", tone: "rose" },
    takeaways: [
      "Cabin humidity at cruise is commonly reported at about 10 to 20 percent, far drier than most homes.",
      "That dryness clearly affects eyes, skin, and nasal passages. Evidence that it causes significant whole-body dehydration is limited.",
      "Most in-flight dehydration comes from drinking less than usual, plus alcohol and caffeine.",
      "Hydration does not cure jet lag, which is a body-clock problem.",
    ],
    body: [
      { type: "p", text: "Atlas was started by a pilot, so cabin air is something we think about. The claims you hear about it, from brain fog to weakened immunity, often go further than the evidence. Here is what is solid." },
      { type: "h2", text: "How dry is the cabin" },
      { type: "p", text: "At cruising altitude the outside air contains almost no moisture. The cabin is supplied with that air, and relative humidity inside commonly runs around 10 to 20 percent, compared with the roughly 30 to 60 percent most people find comfortable indoors. The dryness is most noticeable in your eyes, lips, skin, and nose." },
      { type: "h2", text: "Does dry air dehydrate you" },
      { type: "p", text: "Breathing dry air does increase the water you lose through your breath a little. But studies on whether cabin humidity itself causes meaningful dehydration are few and small, so we would not overstate it either way." },
      { type: "p", text: "The more dependable reasons people feel dried out on a plane are behavioral: long stretches without drinking because service is infrequent, avoiding the restroom, and choosing alcohol or coffee in place of water." },
      { type: "h2", text: "What about jet lag and brain fog" },
      { type: "p", text: "Jet lag comes from your internal clock being out of sync with local time. Hydration will not fix it, though feeling thirsty and tired at the same time can make everything feel worse. Claims that cabin air suppresses the immune system are not well supported by direct evidence. Crowded, shared spaces are a more plausible reason people catch colds while traveling." },
      { type: "h2", text: "Practical habits" },
      { type: "ul", items: [
        "Bring an empty bottle through security and fill it after. Drinking on your own schedule beats waiting for the cart.",
        "Drink regularly rather than all at once, and go easy on alcohol.",
        "Use lip balm, moisturizer, and saline nasal spray for the dryness you can feel.",
        "On a long-haul flight or when landing into heat, an electrolyte stick in your water bottle is a convenient way to get sodium and potassium without sugar.",
      ] },
      { type: "callout", title: "Where Atlas fits", text: "Atlas comes in 12 g stick packs that fit in a carry-on. Our founder, Garrett Ray, flies long-haul 787 routes and built Atlas to hold up in a carry-on, a gym bag, or a desk drawer." },
    ],
    sources: [],
    sourceNote: "This article summarizes commonly reported cabin conditions and general hydration physiology. It does not rest on a single study.",
  },
];

export function getArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function formatArticleDate(iso: string): string {
  return new Date(`${iso}T12:00:00Z`).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}
