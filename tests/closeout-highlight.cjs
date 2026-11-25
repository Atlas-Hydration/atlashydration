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
    if(name.startsWith('./') && !name.endsWith('.css')) { const base=path.resolve(path.dirname(file),name); return load(fs.existsSync(base+'.ts')?base+'.ts':base+'.tsx'); }
    if(name.startsWith('@/')) {const base=path.resolve(name.slice(2)); return load(fs.existsSync(base+'.ts')?base+'.ts':base+'.tsx');}
    return require(name);
  }, mod, mod.exports);
  return mod.exports;
}
const {buildBlackFridayCheckoutUrl} = load(path.resolve('app/lib/blackFridayCheckout.ts'));
const offer = new URL(buildBlackFridayCheckoutUrl());
assert.equal(offer.origin,'https://7fa7b7-42.myshopify.com');
assert.equal(offer.pathname,'/buy/42739482067018:1');
assert.equal(offer.searchParams.get('discount'),'ATLASBLACKFRIDAY');
assert.equal(offer.searchParams.get('ucp/version'),'2026-08-25');
assert(!offer.href.includes('selling_plan'));
const Component = load(path.resolve('app/components/home/CloseoutHighlight.tsx')).default;
const render = () => {cursor = 0; refCursor = 0; return Component();};
const all = node => !node || typeof node !== 'object' ? [] : Array.isArray(node) ? node.flatMap(all) : [node,...all(node.props?.children)];
const text = node => typeof node === 'string' || typeof node === 'number' ? String(node) : Array.isArray(node) ? node.map(text).join('') : text(node?.props?.children || '');
let tree = render();
const find = (type,predicate=()=>true) => all(tree).find(x=>x.type===type && predicate(x));
assert(text(find('button')).includes('Shop the Black Friday Sale'));
const quote=load(path.resolve('app/components/BlackFridayPrice.tsx')).default();
assert(text(quote).includes('$36.99'));
assert(text(quote).includes('$20'));
assert(text(quote).includes('Save $16.99'));
assert(text(tree).includes('Black Friday Sale'));
assert(text(tree).includes('Sale ends Monday, November 30'));
assert(text(tree).includes('Free standard U.S. shipping'));
assert.equal(all(tree).filter(x=>x.type==='input').length,0);
assert.equal(all(tree).filter(x=>x.type==='img').length,1);
assert(find('img').props.src.includes('1_e4b7eae7-01d9-430c-9655-7949d910deb6'));
find('button').props.onClick(); find('button').props.onClick();
assert.equal(attempts,1); assert.equal(destination,offer.href); tree=render(); assert(find('button').props.disabled);
listeners.get('pageshow')(); tree=render(); assert(!find('button').props.disabled);
fail=true; find('button').props.onClick(); tree=render();
assert(!find('button').props.disabled); assert(text(find('p',x=>x.props.role==='alert')).includes('try again'));
assert(!/expires|expiration|countdown|only \d+ left/i.test(text(tree)));

const baseline = file => cp.execFileSync('git',['show',`65641af:${file}`],{encoding:'utf8'});
const home = fs.readFileSync('app/page.tsx','utf8');
assert.equal(home.slice(home.indexOf('export default function Home')), baseline('app/page.tsx').split('export default function Home').slice(1).map(x=>'export default function Home'+x)[0]);
for(const file of ['app/globals.css','app/products/grapefruit/page.tsx','app/components/home/WhyAtlasSection.tsx']) assert.equal(fs.readFileSync(file,'utf8'),baseline(file),`${file} must stay unchanged`);
assert(fs.readFileSync('app/components/ProductPage.tsx','utf8').includes('!isSale && <PurchaseOptions'));
assert(fs.readFileSync('app/components/home/FeaturedProduct.tsx','utf8').includes('BLACK_FRIDAY.shipping}</p> : <PurchaseOptions'));
assert(fs.readFileSync('app/context/CartContext.tsx','utf8').includes('stored.filter(item => !isBlackFridayProduct(item.slug)'));
console.log('Single offer display, approved imagery, exact checkout quantity and code, Back recovery, error handling and unchanged homepage layout passed.');
