const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const cp = require('node:child_process');
const ts = require('typescript');
const cache = {};
const states = [], refs = [];
let cursor = 0, refCursor = 0;
const listeners = new Map();
let destination = '', attempts = 0, fail = false;
global.localStorage = {getItem: () => null};
global.window = {
  location: {assign: url => { attempts++; if (fail) throw new Error('blocked'); destination = url; }},
  addEventListener: (name, fn) => listeners.set(name,fn),
  removeEventListener: (name) => listeners.delete(name),
};
const React = {
  useState: initial => { const i = cursor++; if (!(i in states)) states[i] = initial; return [states[i], x => { states[i] = x; }]; },
  useRef: initial => {const i = refCursor++; return refs[i] ||= {current: initial};},
  useEffect: fn => fn(),
};
function load(file) {
  if(cache[file]) return cache[file].exports;
  const mod = {exports:{}}; cache[file] = mod;
  const code = ts.transpileModule(fs.readFileSync(file,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  new Function('require','module','exports',code)((name) => {
    if(name==='react') return React;
    if(name==='react/jsx-runtime') return {jsx:(type,props)=>({type,props}),jsxs:(type,props)=>({type,props})};
    if(name.endsWith('.css')) return {default:new Proxy({},{get:(_,k)=>k})};
    if(name.startsWith('@/')) {const base=path.resolve(name.slice(2)); return load(fs.existsSync(base+'.ts')?base+'.ts':base+'.tsx');}
    return require(name);
  }, mod, mod.exports);
  return mod.exports;
}
const {buildCloseoutCheckoutUrl} = load(path.resolve('app/lib/closeoutCheckout.ts'));
const five = new URL(buildCloseoutCheckoutUrl(5)), two = new URL(buildCloseoutCheckoutUrl(2));
assert.equal(five.pathname,'/buy/67946324754506:1');
assert.equal(two.pathname,'/buy/67946326261834:1');
assert.equal(five.searchParams.get('discount'),null);
assert.equal(two.searchParams.get('discount'),'ATLAS-CLOSEOUT-SHIP');
for(const url of [five,two]) {assert.equal(url.origin,'https://7fa7b7-42.myshopify.com'); assert.equal(url.searchParams.get('ucp/version'),'2026-08-25'); assert(!url.href.includes('selling_plan'));}
const Component = load(path.resolve('app/components/home/CloseoutHighlight.tsx')).default;
const render = () => {cursor = 0; refCursor = 0; return Component();};
const all = (node) => !node || typeof node !== 'object' ? [] : Array.isArray(node) ? node.flatMap(all) : [node,...all(node.props?.children)];
const text = node => typeof node === 'string' || typeof node === 'number' ? String(node) : Array.isArray(node) ? node.map(text).join('') : text(node?.props?.children || '');
let tree = render();
const find = (type,predicate=()=>true) => all(tree).find(x=>x.type===type && predicate(x));
assert(text(find('button')).includes('$50'));
find('input',x=>x.props.value===2).props.onChange(); tree=render();
assert(text(find('button')).includes('$32'));
assert(find('input',x=>x.props.value===2).props.checked);
find('button').props.onClick(); find('button').props.onClick();
assert.equal(attempts,1); assert.equal(destination,two.href); tree=render(); assert(find('button').props.disabled);
listeners.get('pageshow')(); tree=render(); assert(!find('button').props.disabled);
find('input',x=>x.props.value===5).props.onChange(); tree=render();
find('button').props.onClick(); assert.equal(destination,five.href);
listeners.get('pageshow')(); tree=render(); fail=true; find('button').props.onClick(); tree=render();
assert(!find('button').props.disabled); assert(text(find('p',x=>x.props.role==='alert')).includes('try again'));
assert.equal(find('a').props.href,'#products');
assert(text(tree).includes('Sale bundles check out separately from your bag.'));

const original = file => cp.execFileSync('git',['show',`953388d4843d6386fbdecec881f2e82ed0c64e7d:${file}`],{encoding:'utf8'});
const home = fs.readFileSync('app/page.tsx','utf8');
assert.equal(home.replace('import CloseoutHighlight from "@/app/components/home/CloseoutHighlight";\n','').replace('      <CloseoutHighlight />\n',''), original('app/page.tsx'));
for(const name of ['HeroSection','ProofStrip','FeaturedProduct','ReviewsSection','BottleSection','ScienceSection','WhyAtlasSection','FounderSection','HydrationBenefits','BlogSection','GrapefruitWaitlist','FaqSection','CtaSection','DarkCta']) {
 const file=`app/components/home/${name}.tsx`; assert.equal(fs.readFileSync(file,'utf8'),original(file),`${name} must remain unchanged`);
}
for(const file of ['app/components/Footer.tsx','app/components/CartDrawer.tsx','app/components/PurchaseOptions.tsx','app/context/CartContext.tsx','app/context/PurchaseSelectionContext.tsx','app/products/strawberry-lemonade/page.tsx','app/products/grapefruit/page.tsx','app/globals.css']) assert.equal(fs.readFileSync(file,'utf8'),original(file),`${file} must remain unchanged`);
const source=fs.readFileSync('app/components/home/CloseoutHighlight.tsx','utf8');
assert(!/expires|expiration|countdown|moving warehouses|selling fast|only \d+ left/i.test(source));
const header=fs.readFileSync('app/components/Header.tsx','utf8');
for(const lead of ['Free shipping','Subscribe & Save 20%','Unlock 10% off','Atlas starter offer','Made in USA','Inside every stick','30-day guarantee','New flavor']) assert(header.includes(`lead: "${lead}"`));
console.log('Additive scope, all original homepage sections and product/cart files, exact checkout variants, prices, shipping, selector, double-click guard, Back restoration and retry behavior passed.');

const published = file => cp.execFileSync('git',['show',`fc076cf47a1f8e7c6c137093a36008e989c9cdb9:${file}`],{encoding:'utf8'});
for(const file of ['app/components/Header.tsx','app/components/FooterSignup.tsx','app/components/SignupPopup.tsx','app/components/home/StickyBuyBar.tsx','app/page.tsx','app/shipping/page.tsx','app/data/closeoutOffer.ts','app/lib/closeoutCheckout.ts']) assert.equal(fs.readFileSync(file,'utf8'),published(file),`${file} unchanged from live`);
assert(text(tree).includes('Big hydration.Our biggest sale.'));
assert(text(tree).includes('The warehouse closeout event'));
assert(text(tree).includes('Save $109.95'));
assert(text(tree).includes('Save $31.98'));
assert(text(tree).includes('$159.95'));
assert(text(tree).includes('$63.98'));
assert(text(tree).includes('Value when purchased separately'));
assert.equal(all(tree).filter(x=>x.type==='input' && x.props.type==='radio').length,2);
assert.equal(all(tree).filter(x=>x.type==='img').length,2);
assert(all(tree).filter(x=>x.type==='img').every(x=>x.props.src.includes('1_e4b7eae7-01d9-430c-9655-7949d910deb6')));
console.log('Zest styling: original live copy and site preserved, accurate $109.95/$31.98 savings, approved pouch images only, native radio inputs retained.');
