const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const {renderToStaticMarkup} = require('react-dom/server');
let states = [], cursor = 0, effects = [], cart = [], pathname = '/products/strawberry-lemonade';
const hooks = {...React,
  useState(initial) { const i = cursor++; if (!(i in states)) states[i] = initial; return [states[i], v => { states[i] = v; }]; },
  useRef: v => ({current:v}), useEffect: fn => effects.push(fn), useCallback: fn => fn,
};
function load(relative, overrides = {}) {
  const filename = path.resolve(relative);
  const code = ts.transpileModule(fs.readFileSync(filename, 'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  const mod = {exports:{}};
  new Function('require','module','exports',code)(name => {
    if(name in overrides) return overrides[name];
    if(name === 'react') return hooks;
    if(name === 'next/link') return p => React.createElement('a',p,p.children);
    if(name.startsWith('@/app/components/')) return new Proxy({}, {get: () => () => null});
    if(name.startsWith('@/')) { const base=name.slice(2); return load(fs.existsSync(base+'.ts')?base+'.ts':base+'.tsx',overrides); }
    return require(name);
  },mod,mod.exports);
  return mod.exports;
}
const ProductPage = load('app/components/ProductPage.tsx', {
  '@/app/context/CartContext': {useCart:()=>({addToCart:(...args)=>cart.push(args)}),BOTTLE_DISCOUNT_LIVE:false},
}).default;
const config = {slug:'strawberry-lemonade',flavorName:'Strawberry Lemonade',images:[],accordionItems:[],ctaText:'Nutrition copy unchanged.',ctaTitle:'Ready?',activeFlavorClass:'strawberry'};
function render(option, qty=1, frequency=2, slug='strawberry-lemonade') {
  states=[option,frequency,qty,false,false,null,true]; cursor=0; effects=[];
  const tree=ProductPage({config:{...config,slug}});
  return {tree,html:renderToStaticMarkup(tree)};
}
function nodes(tree, predicate) {
  if(!tree || typeof tree!=='object') return [];
  return (predicate(tree)?[tree]:[]).concat(React.Children.toArray(tree.props?.children).flatMap(n=>nodes(n,predicate)));
}
for(const [option,qty,frequency,price,sticks,slug] of [
  ['starter',1,2,'50.00',32,'strawberry-lemonade'],
  ['onetime',1,2,'31.99',16,'strawberry-lemonade'],
  ['onetime',3,2,'88.47',48,'strawberry-lemonade'],
  ['subscribe',1,4,'25.59',16,'strawberry-lemonade'],
  ['subscribe',3,6,'76.77',48,'strawberry-lemonade'],
  ['subscribe',1,2,'25.59',16,'grapefruit'],
  ['onetime',2,2,'58.98',32,'grapefruit'],
]) {
  const {tree,html}=render(option,qty,frequency,slug);
  assert.ok(html.includes(`<strong>$${price}</strong>`));
  for(const cls of ['product-hero__packs','cta-section__text']) {
    const text=html.match(new RegExp(`class="${cls}">([^<]*)`))[1];
    assert.ok(text.includes(`${sticks} stick packs`),`${option}: ${cls}`);
    if(option==='starter') assert.ok(text.includes('2 pouches + 1 free Atlas bottle'));
  }
  assert.ok(html.includes(`${sticks} sticks`));
  const buttons=nodes(tree,n=>n.type==='button' && n.props.onClick && React.Children.toArray(n.props.children).join('').includes(price));
  assert.equal(buttons.length,3);
  for(const button of buttons) {
    cart=[]; button.props.onClick();
    assert.deepEqual(cart,option==='starter'?[['atlas-starter-kit',1]]:[[slug,qty,option==='subscribe'?frequency:undefined]]);
  }
}
// Exercise the actual provider timer: kit route stays quiet; manual opening works.
let tick;
global.window={setInterval:fn=>(tick=fn,1),clearInterval:()=>{}};
const realNow=Date.now; let now=0; Date.now=()=>now;
const Provider=load('app/components/SignupPopup.tsx', {
  'next/navigation':{usePathname:()=>pathname},
  '@/app/lib/welcomeSignup':{autoOpenSuppressed:()=>false,markDismissed:()=>{}},
  '@/app/lib/klaviyo':{},
}).SignupPopupProvider;
function provider() { cursor=0; effects=[]; return Provider({children:null}); }
for(const route of ['/products/strawberry-lemonade','/products/strawberry-lemonade/','/cart','/checkout','/app']) {
  pathname=route; states=[]; now=0;
  const tree=provider(); effects.forEach(fn=>fn()); now=9000; tick(); assert.equal(states[0],false,route);
  tree.props.value.openSignup(); assert.equal(states[0],true,'manual signup remains available');
}
for(const route of ['/','/products/grapefruit']) {
  pathname=route; states=[]; now=0; provider(); effects.forEach(fn=>fn()); now=9000; tick(); assert.equal(states[0],!load('app/data/closeoutOffer.ts').CLOSEOUT_LIVE,route);
}
Date.now=realNow;
console.log('7 selected-offer render/cart cases and 7 popup-route cases passed');

// Render the homepage CTA with the real selection provider's values and handler.
const SelectionProvider = load('app/context/PurchaseSelectionContext.tsx', {
  '@/app/context/CartContext': {useCart:()=>({addToCart:(...args)=>cart.push(args)}), BOTTLE_DISCOUNT_LIVE:false},
}).PurchaseSelectionProvider;
let selection;
const DarkCta = load('app/components/home/DarkCta.tsx', {
  '@/app/context/PurchaseSelectionContext': {usePurchaseSelection:()=>selection},
}).default;
(async () => {
  for (const [flavor,option,qty,frequency,price,sticks] of [
    ['strawberry-lemonade','starter',1,2,'50.00',32],
    ['strawberry-lemonade','onetime',1,2,'31.99',16],
    ['strawberry-lemonade','onetime',3,2,'88.47',48],
    ['strawberry-lemonade','subscribe',3,6,'76.77',48],
    ['grapefruit','subscribe',1,4,'25.59',16],
    ['grapefruit','onetime',2,2,'58.98',32],
  ]) {
    states=[flavor,option,frequency,qty,false,false]; cursor=0;
    selection=SelectionProvider({children:null}).props.value;
    const tree=DarkCta(); const html=renderToStaticMarkup(tree);
    assert.ok(html.includes(`${sticks} stick packs`));
    assert.ok(html.includes(`$${price}`));
    if(option==='starter') {
      assert.ok(html.includes('2 pouches + 1 free Atlas bottle'));
      assert.ok(html.includes('Order starter kit'));
    }
    if(flavor==='grapefruit') assert.ok(html.includes('Pre-Order'));
    cart=[];
    await nodes(tree,n=>n.type==='button')[0].props.onClick();
    assert.deepEqual(cart,option==='starter'?[['atlas-starter-kit',1]]:[[flavor,qty,option==='subscribe'?frequency:undefined]]);
  }
  // Override constants to prove FAQ copy is derived rather than hard-coded.
  const Faq=load('app/components/home/FaqSection.tsx', {
    '@/app/data/pricing':{POUCH_PRICES:{perStick:2.17,subscribePerStick:1.74}},
  }).default;
  states=[]; cursor=0;
  const faq=renderToStaticMarkup(Faq());
  assert.ok(faq.includes('For a single pouch'));
  assert.ok(faq.includes('$2.17 per stick, or $1.74 with a subscription'));
  for(const file of ['ProductPage.tsx','home/FeaturedProduct.tsx','home/HeroSection.tsx','home/ProofStrip.tsx']) {
    const source=fs.readFileSync(`app/components/${file}`,'utf8');
    assert.ok(source.includes('Free standard shipping on orders $'));
    assert.ok(source.includes('{FREE_SHIPPING_THRESHOLD} and up'));
    assert.ok(!source.includes('Free shipping over'));
  }
  for(const flavor of ['strawberry-lemonade','grapefruit']) {
    const source=fs.readFileSync(`app/products/${flavor}/page.tsx`,'utf8');
    assert.ok(source.includes('orders ${FREE_SHIPPING_THRESHOLD} and up'));
    assert.ok(source.includes('${SHIPPING_RATE.toFixed(2)} (estimated 3–4 business days after processing)'));
    assert.ok(!source.includes('$4.99'));
  }
  console.log('6 homepage selection/cart cases plus FAQ constant and shipping-copy regressions passed');
})().catch(error => { console.error(error); process.exitCode=1; });
