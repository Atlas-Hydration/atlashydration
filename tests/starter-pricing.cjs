const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const cache = {};
function load(file) {
  if(cache[file]) return cache[file].exports;
  const mod = {exports:{}}; cache[file]=mod;
  const code = ts.transpileModule(fs.readFileSync(file,'utf8'), {compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}}).outputText;
  new Function('require','module','exports',code)((name)=> {
    if(name==='react') return {createContext:()=>({})};
    if(name==='react/jsx-runtime') return {};
    if(name.includes('metaPixel')) return {trackMeta:()=>{}};
    if(name.startsWith('@/')) { const base=path.resolve(name.slice(2)); return load(fs.existsSync(base+'.ts')?base+'.ts':base+'.tsx'); }
    return require(name);
  },mod,mod.exports);
  return mod.exports;
}
const {computeCartPricing,computeBottlePromo}=load(path.resolve('app/context/CartContext.tsx'));
const item=(slug,price,quantity,subscriptionFrequency)=>({slug,title:slug,price,quantity,image:null,subscriptionFrequency});
const kit=(n)=>item('atlas-starter-kit',83.97,n);
assert.equal(computeCartPricing([kit(1)]).total,50);
assert.equal(computeCartPricing([kit(2)]).total,100);
assert.equal(computeCartPricing([kit(1),item('strawberry-lemonade',31.99,2)]).total,113.98); // no stacked ATLAS2PACK
assert.equal(computeCartPricing([kit(1),item('bottle',19.99,1)]).total,69.99);
assert.equal(computeCartPricing([item('strawberry-lemonade',31.99,2)]).total,58.98);
assert.equal(computeBottlePromo([item('strawberry-lemonade',31.99,2)]).tier,'none');
assert.equal(computeCartPricing([item('strawberry-lemonade',31.99,4),item('bottle',19.99,1)]).total,127.96);
assert.equal(computeCartPricing([item('strawberry-lemonade',25.59,1,2)]).total,25.59);
assert.equal(computeCartPricing([kit(1),item('strawberry-lemonade',31.99,20)]).total,673.77); // best eligible discount wins
assert.equal(computeCartPricing([kit(1)]).displaySubtotal,50);
assert.equal(83.97-computeCartPricing([kit(1)]).starterUnitDiscount,50);
assert.equal(computeCartPricing([kit(2)]).displaySubtotal,100);
assert.equal(computeCartPricing([kit(1),item('strawberry-lemonade',31.99,2)]).displaySubtotal,113.98);
assert.equal(computeCartPricing([kit(1),item('strawberry-lemonade',31.99,20)]).starterUnitDiscount,0);
console.log('14 starter/legacy/subscription and displayed-price cases passed');
