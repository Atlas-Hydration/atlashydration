'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { CLOSEOUT_BUNDLES, CLOSEOUT_IMAGE, CLOSEOUT_LIVE, type CloseoutSize } from '@/app/data/closeoutOffer';
import { buildCloseoutCheckoutUrl } from '@/app/lib/closeoutCheckout';
import { useCart } from '@/app/context/CartContext';
import styles from './WarehouseCloseout.module.css';

function Arrow() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7" /></svg>;
}

export function CloseoutNavigation() {
  const { cartCount, toggleCart } = useCart();
  return <>
    <div className={styles.announcement}>Warehouse closeout <span>·</span> Free standard U.S. shipping on both bundles</div>
    <header className={styles.nav}>
      <nav className={styles.navInner} aria-label="Main navigation">
        <Link href="/" className={styles.logo} aria-label="Atlas Hydration home"><img src="/logo.svg" alt="Atlas" width="106" height="36" /></Link>
        <div className={styles.navLinks}><Link href="/#closeout-bundles">Shop the sale</Link><Link href="/products/strawberry-lemonade#supplement-facts">The formula</Link><Link href="/contact">Support</Link></div>
        <button className={styles.bag} onClick={toggleCart} aria-label={`Open shopping bag${cartCount ? `, ${cartCount} items` : ''}`}><svg width="20" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M5 7h14l1 14H4L5 7Z" /><path d="M8 8V6a4 4 0 018 0v2" /></svg><span>Bag{cartCount > 0 ? ` (${cartCount})` : ''}</span></button>
      </nav>
    </header>
  </>;
}

export function CloseoutProductBanner() {
  return <aside className={styles.productBanner} aria-label="Warehouse closeout offer"><div><span className={styles.eyebrow}>The warehouse closeout</span><h2>5 pouches. $50. Big hydration.</h2><p>Or choose 2 for $32. Free standard U.S. shipping on both.</p></div><Link className={styles.primary} href="/#closeout-bundles">Shop the closeout <Arrow /></Link></aside>;
}

export default function WarehouseCloseout({ preview = false }: { preview?: boolean }) {
  const [selected, setSelected] = useState<CloseoutSize>(5);
  const [leaving, setLeaving] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const navigating = useRef(false);
  const { cartCount } = useCart();
  const bundle = CLOSEOUT_BUNDLES[selected];
  const enabled = CLOSEOUT_LIVE && Boolean(bundle.variantId) && !preview;

  useEffect(() => {
    // Back from Shopify must restore a usable button, including bfcache restores.
    const reset = () => { navigating.current = false; setLeaving(false); };
    window.addEventListener('pageshow', reset);
    return () => window.removeEventListener('pageshow', reset);
  }, []);

  function buyBundle() {
    if (!enabled || navigating.current) return;
    const url = buildCloseoutCheckoutUrl(selected);
    if (!url) return;
    navigating.current = true;
    setLeaving(true);
    setCheckoutError('');
    try {
      window.location.assign(url);
    } catch {
      navigating.current = false;
      setLeaving(false);
      setCheckoutError('Checkout could not open. Please try again.');
    }
  }

  const purchaseLabel = leaving ? 'Opening secure checkout…' : `Buy ${selected} pouches · $${bundle.price}`;

  return <main data-closeout-page className={`${styles.sale} ${preview ? styles.preview : ''}`}>
    {preview && <><CloseoutNavigation /><p className={styles.review}>Design preview · Checkout disabled until the offer is verified</p></>}
    <section className={styles.hero} aria-labelledby="closeout-title">
      <div className={styles.heroCopy}>
        <p className={styles.eyebrow}><span className={styles.dot} /> The warehouse closeout event</p>
        <h1 id="closeout-title">Big hydration.<br /><span>Our biggest sale.</span></h1>
        <p className={styles.heroDescription}>The Strawberry Lemonade you love.<br />A whole lot more, for a whole lot less.</p>
        <div className={styles.heroPrice}><span>5 pouches.</span> <strong>$50.</strong></div>
        <p className={styles.heroMeta}>80 stick packs <span>·</span> Just $10 per pouch</p>
        <a className={styles.primary} href="#closeout-bundles">Shop the closeout <Arrow /></a>
        <p className={styles.heroShipping}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="M3 5h12v12H3zM15 9h4l3 4v4h-7" /><circle cx="7" cy="18" r="2" /><circle cx="18" cy="18" r="2" /></svg>Free standard U.S. shipping</p>
      </div>
      <figure className={styles.heroPhoto}>
        <img src={CLOSEOUT_IMAGE} alt="Original Atlas Strawberry Lemonade product photograph, showing the pouch and individual stick pack" width="960" height="1200" fetchPriority="high" />
      </figure>
    </section>
    <section className={styles.facts} aria-label="Inside every pouch"><div><strong>0g</strong><span>Sugar</span></div><div><strong>1,769<span>mg</span></strong><span>Electrolytes per stick</span></div><div><strong>16</strong><span>Sticks per pouch</span></div><div><strong>One-time</strong><span>No subscription</span></div></section>
    <section className={styles.bundles} id="closeout-bundles" aria-labelledby="bundle-title">
      <div className={styles.sectionHeading}><p className={styles.eyebrow}>Two ways to stock up</p><h2 id="bundle-title">Your favorite flavor.<br /><span>Your kind of bundle.</span></h2><p>Strawberry Lemonade. Free standard U.S. shipping. Simple.</p></div>
      <div className={styles.shopGrid}>
        <div className={styles.selection}>
          <fieldset className={styles.options}><legend className={styles.srOnly}>Choose your Strawberry Lemonade bundle</legend>{([5, 2] as const).map(size => {
            const option = CLOSEOUT_BUNDLES[size];
            return <label key={size} className={`${styles.option} ${selected === size ? styles.selected : ''}`}>
              <input type="radio" name="closeout-bundle" value={size} checked={selected === size} onChange={() => setSelected(size)} />
              <span className={styles.radio} aria-hidden="true" />
              <span className={styles.optionCopy}><span className={styles.optionTitle}>{size} pouches {size === 5 && <span className={styles.bestValue}>Best value</span>}</span><span className={styles.optionDetail}>{option.sticks} sticks · ${option.perPouch} per pouch</span></span>
              <strong className={styles.optionPrice}>${option.price}</strong>
            </label>;
          })}</fieldset>
          <div className={styles.orderSummary} aria-live="polite"><span>{bundle.pouches} pouches · {bundle.sticks} stick packs</span><strong>${bundle.price}<small> USD</small></strong></div>
          <button className={styles.primary} onClick={buyBundle} disabled={!enabled || leaving}>{purchaseLabel}<Arrow /></button>
          {checkoutError && <p role="alert" className={styles.checkoutError}>{checkoutError}</p>}
          <p className={styles.purchaseNote}>{preview ? 'Preview only. Purchase controls are not live.' : cartCount > 0 ? 'This bundle checks out separately from your bag.' : 'One-time purchase · Secure Shopify checkout'}</p>
          <p className={styles.terms}>Strawberry Lemonade only. Free standard shipping within the United States. Taxes, if applicable, calculated at checkout. Sale bundles cannot be combined with other promotional discounts.</p>
        </div>
        <div className={styles.bundleStory}><span className={styles.storyNumber}>01 / EVERYDAY HYDRATION</span><h3>Small sticks.<br />Big daily potential.</h3><p>From your morning routine to your next workout, take your hydration with you. Just add water.</p><ul><li><span>01</span>16 individually wrapped sticks per pouch</li><li><span>02</span>Zero sugar, with vitamins and amino acids</li><li><span>03</span>Mix one stick with 12–16 oz of cold water</li></ul><Link href="/products/strawberry-lemonade#supplement-facts" className={styles.textLink}>Explore the formula <Arrow /></Link></div>
      </div>
    </section>
    <section className={styles.formula} id="science" aria-labelledby="formula-title"><p className={styles.eyebrow}>Made for your everyday</p><h2 id="formula-title">Everything you love about Atlas.<br />{' '}<span>More of it.</span></h2><div className={styles.formulaGrid}><article><span>01</span><h3>Electrolytes.</h3><p>Sodium, potassium and magnesium in each easy-to-mix stick.</p></article><article><span>02</span><h3>Vitamins.</h3><p>B vitamins and vitamin C, alongside L-Glutamine and L-Alanine.</p></article><article><span>03</span><h3>Zero sugar.</h3><p>Bright Strawberry Lemonade flavor. Zero grams of sugar.</p></article></div><Link href="/products/strawberry-lemonade#supplement-facts" className={styles.textLink}>See the full Supplement Facts <Arrow /></Link></section>
    <section className={styles.faq} aria-labelledby="closeout-faq"><div><p className={styles.eyebrow}>Good to know</p><h2 id="closeout-faq">A few details.<br />No guesswork.</h2><p>Need a hand? <a href="mailto:support@atlas-hydration.com">Get in touch.</a></p></div><div className={styles.questions}>
      <details><summary>What is included in each bundle?<span aria-hidden="true">+</span></summary><p>The 5-pouch bundle includes 80 Strawberry Lemonade stick packs for $50. The 2-pouch bundle includes 32 stick packs for $32. Each pouch contains 16 sticks. A bottle is not included.</p></details>
      <details><summary>Is shipping included?<span aria-hidden="true">+</span></summary><p>Yes. Both closeout bundles include free standard shipping within the United States. Taxes, if applicable, are calculated at checkout. Expedited delivery is not included.</p></details>
      <details><summary>Is this a subscription?<span aria-hidden="true">+</span></summary><p>No. Both bundles are one-time purchases. There are no recurring charges.</p></details>
      <details><summary>Can I use another discount code?<span aria-hidden="true">+</span></summary><p>Closeout pricing cannot be combined with other promotional discounts, including welcome codes. Your bundle includes the closeout price and free standard U.S. shipping.</p></details>
      <details><summary>Where can I see the ingredients?<span aria-hidden="true">+</span></summary><p>See the complete <Link href="/products/strawberry-lemonade#supplement-facts">Supplement Facts and ingredient list</Link> on the Strawberry Lemonade product page.</p></details>
    </div></section>
    <section className={styles.finalCta}><p className={styles.eyebrow}>The Atlas warehouse closeout</p><h2>Hydration worth<br />stocking up on.</h2><a href="#closeout-bundles" className={styles.lightButton}>Choose your bundle <Arrow /></a><p>5 pouches for $50 or 2 for $32. Free standard U.S. shipping.</p></section>
    <div className={styles.sticky} aria-label="Selected closeout bundle"><div><strong>{selected} pouches · ${bundle.price}</strong><span>Free standard U.S. shipping</span></div><button onClick={buyBundle} disabled={!enabled || leaving}>{leaving ? 'Opening…' : `Buy for $${bundle.price}`}<Arrow /></button></div>
  </main>;
}
