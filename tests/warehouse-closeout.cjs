const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
let hooks=[],cursor=0,effects=[],navigations=[];
const config = { CLOSEOUT_LIVE: true, CLOSEOUT_SHIPPING_CODE: 'TEST-STANDARD-SHIPPING', CLOSEOUT_IMAGE: 'https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_e4b7eae7-01d9-430c-9655-7949d910deb6.jpg?v=1771507844', CLOSEOUT_BUNDLES: {
  5:{pouches:5,sticks:80,price:50,perPouch:10,variantId:'67946324754506'},
  2:{pouches:2,sticks:32,price:32,perPouch:16,variantId:'67946326261834'},
}};
const events = {};
global.window={ location:{assign:url=>navigations.push(url)}, addEventListener:(name,fn)=>{events[name]=fn},removeEventListener:()=>{} };
const react={...React,useState(initial){const i=cursor++;if(!(i in hooks))hooks[i]=initial;return[hooks[i],v=>{hooks[i]=v}];},useRef(initial){const i=cursor++;return hooks[i]??(hooks[i]={current:initial});},useEffect:fn=>effects.push(fn)};
function load(file){const mod={exports:{}};const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;new Function('require','module','exports',code)(name=>{
 if(name==='react')return react;
 if(name.endsWith('.css'))return {default:new Proxy({},{get:(_,k)=>k})};
 if(name==='next/link')return p=>React.createElement('a',p,p.children);
 if(name==='@/app/data/closeoutOffer')return config;
 if(name==='@/app/context/CartContext')return{useCart:()=>({cartCount:0,toggleCart:()=>{}})};
 if(name==='@/app/lib/checkoutAttribution')return{buildOneTimeCheckoutUrl:lines=>`https://7fa7b7-42.myshopify.com/buy/${lines.join(',')}?ucp%2Fversion=2026-08-25&attribution%2Futm_campaign=closeout`};
 if(name==='@/app/lib/closeoutCheckout')return load('app/lib/closeoutCheckout.ts');
 return require(name);
 },mod,mod.exports);return mod.exports;}
const {buildCloseoutCheckoutUrl}=load('app/lib/closeoutCheckout.ts');
for(const size of [5,2]){const url=new URL(buildCloseoutCheckoutUrl(size));assert.equal(url.pathname,`/buy/${config.CLOSEOUT_BUNDLES[size].variantId}:1`);assert.equal(url.searchParams.get('discount'),size===2?config.CLOSEOUT_SHIPPING_CODE:null);assert.equal(url.searchParams.get('attribution/utm_campaign'),'closeout');assert.equal(url.searchParams.get('ucp/version'),'2026-08-25');}
config.CLOSEOUT_LIVE=false;assert.equal(buildCloseoutCheckoutUrl(5),null);config.CLOSEOUT_LIVE=true;
const Sale=load('app/components/home/WarehouseCloseout.tsx').default;
function render(preview=false){cursor=0;effects=[];const tree=Sale({preview});return{tree,html:renderToStaticMarkup(tree)};}
function nodes(tree,test){if(!tree||typeof tree!=='object')return[];return(test(tree)?[tree]:[]).concat(React.Children.toArray(tree.props?.children).flatMap(n=>nodes(n,test)));}
let view=render();
assert.ok(view.html.includes('Our biggest sale.'));
assert.ok(view.html.includes('Buy 5 pouches · $50'));
assert.ok(!/expires|expiration|best.before|January|warehouse move|moving warehouse|selling fast|low stock|countdown/i.test(view.html));
assert.equal(nodes(view.tree,n=>n.type==='input'&&n.props.checked)[0].props.value,5);
const radio2=nodes(view.tree,n=>n.type==='input'&&n.props.value===2)[0];radio2.props.onChange();view=render();
assert.ok(view.html.includes('Buy 2 pouches · $32'));
assert.ok(view.html.includes('Buy for $32'));
assert.equal(nodes(view.tree,n=>n.type==='input'&&n.props.checked)[0].props.value,2);
let buy=nodes(view.tree,n=>n.type==='button'&&n.props.onClick&&n.props.children?.[0]==='Buy 2 pouches · $32')[0];
assert.equal(buy.props.disabled,false);buy.props.onClick();buy.props.onClick();assert.equal(navigations.length,1,'synchronous repeat-click guard');
assert.ok(navigations[0].includes('/67946326261834:1?'));
view=render();assert.ok(view.html.includes('Opening secure checkout'));
effects.forEach(fn=>fn());events.pageshow();view=render();assert.ok(view.html.includes('Buy 2 pouches · $32'),'Back restores usable checkout control');
buy=nodes(view.tree,n=>n.type==='button'&&n.props.children?.[0]==='Buy 2 pouches · $32')[0];buy.props.onClick();assert.equal(navigations.length,2);
events.pageshow();view=render(true);assert.equal(nodes(view.tree,n=>n.type==='button'&&n.props.children?.[0]==='Buy 2 pouches · $32')[0].props.disabled,true);
config.CLOSEOUT_LIVE=false;view=render();assert.equal(nodes(view.tree,n=>n.type==='button'&&n.props.children?.[0]==='Buy 2 pouches · $32')[0].props.disabled,true);
const routes=fs.readFileSync('app/closeout-preview/page.tsx','utf8');assert.ok(routes.includes("process.env.NODE_ENV === 'production') notFound()"));
console.log('Closeout: correct inventory-linked variants, one-bundle quantities, shipping-code transport, attribution retention, 5/2 selector and sticky parity, repeat-click guard, Back recovery, no unsupported claims, and launch/preview gates passed.');
