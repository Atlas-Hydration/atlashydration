import styles from './StrawberrySale.module.css';

/** Design review only. No cart action until Shopify checkout and date wording pass release review. */
export default function StrawberrySale() {
  return (
    <main className={styles.sale}>
      <nav className={styles.nav} aria-label="Sale preview navigation"><img src="/logo.svg" alt="Atlas Hydration" width="110" height="36" /><a href="#sale-options">Explore the sale ↗</a></nav>
      <aside className={styles.review}>PRIVATE DESIGN PREVIEW · NOT A LIVE OFFER · Checkout disabled pending release review</aside>
      <div className={styles.ribbon}>STRAWBERRY LEMONADE SALE <span>5 POUCHES / $50 / FREE STANDARD SHIPPING</span></div>
      <section className={styles.hero} aria-labelledby="sale-title">
        <div className={styles.copy}>
          <p className={styles.eyebrow}>Atlas · Strawberry Lemonade</p>
          <h1 id="sale-title">Big hydration.<br /><em>Small price.</em></h1>
          <p className={styles.lead}>Your daily hydration, at $10 a pouch.</p>
          <div className={styles.price}><strong>5 pouches.</strong><span>$50.</span></div>
          <p className={styles.shipping}>80 stick packs · Free standard shipping</p>
          <div className={styles.date}><strong>This batch is short-dated: January 1, 2027.</strong><span>Please consider the date when choosing your quantity.</span></div>
          <a className={styles.primary} href="#sale-options">Choose your bundle <span aria-hidden="true">↗</span></a>
          <p className={styles.micro}>One-time purchase · Strawberry Lemonade only</p>
        </div>
        <figure className={styles.photo}>
          <img src="https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_e4b7eae7-01d9-430c-9655-7949d910deb6.jpg?v=1771507844" alt="Atlas Strawberry Lemonade pouch and stick pack, shown in the original product photograph" width="960" height="1200" fetchPriority="high" />
          <figcaption>STRAWBERRY LEMONADE <span>16 STICKS PER POUCH</span></figcaption>
        </figure>
      </section>
      <div className={styles.facts} aria-label="Product facts"><span>Zero sugar</span><span>1,769 mg electrolytes</span><span>16 sticks per pouch</span></div>
      <section className={styles.options} id="sale-options" aria-labelledby="options-title">
        <div className={styles.sectionHeading}><p className={styles.eyebrow}>The Strawberry sale</p><h2 id="options-title">Choose your supply.</h2><p>Same flavor. Two ways to save.</p></div>
        <div className={styles.cards}>
          <article className={`${styles.card} ${styles.featured}`}>
            <p className={styles.tag}>LOWEST PRICE PER POUCH</p><h3>5-pouch bundle</h3><p className={styles.cardPrice}>$50 <span>$10 / pouch</span></p><p>80 stick packs · Free standard shipping</p>
            <p className={styles.cardDate}>This batch is short-dated: <strong>January 1, 2027.</strong></p>
            <button type="button" disabled className={styles.primary}>Get 5 pouches — $50</button>
            <small>Design preview · Purchase not yet enabled</small>
          </article>
          <article className={styles.card}>
            <p className={styles.tag}>SMALLER BUNDLE</p><h3>2-pouch bundle</h3><p className={styles.cardPrice}>$32</p><p>32 stick packs · Free standard shipping</p>
            <p className={styles.cardDate}>This batch is short-dated: <strong>January 1, 2027.</strong></p>
            <button type="button" disabled className={styles.secondary}>Get 2 pouches — $32</button>
            <small>Design preview · Purchase not yet enabled</small>
          </article>
        </div>
        <p className={styles.terms}>Strawberry Lemonade only. One-time purchases. Taxes, if applicable, calculated at checkout. Final checkout pricing and shipping must be verified before this offer goes live.</p>
      </section>
      <section className={styles.details} aria-labelledby="details-title"><h2 id="details-title">A great deal.<br />A date to know.</h2><div><p>We’re offering this Strawberry Lemonade batch at a lower price because it is short-dated.</p><p className={styles.detailDate}>January 1, 2027</p><p>The date is shown here and beside each bundle before purchase. Choose the quantity that fits your routine.</p><p className={styles.reviewNote}>Review note: confirm the exact printed date label before launch. No expiry or best-before wording has been inferred.</p></div></section>
    </main>
  );
}
