const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
let activeIngredient = null, stateIndex = 0;
function load(file, overrides = {}) {
  const code = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  const mod = { exports: {} };
  new Function('require', 'module', 'exports', code)(name => {
    if (name in overrides) return overrides[name];
    if (name === 'react') return {
      ...React,
      useState: initial => [stateIndex++ === 0 && activeIngredient ? activeIngredient : initial, () => {}],
      useEffect: () => {}, useRef: initial => ({ current: initial }), useCallback: fn => fn,
    };
    if (name === 'next/link') return props => React.createElement('a', props, props.children);
    if (name.startsWith('@/app/components/')) return new Proxy({}, { get: () => () => null });
    if (name.startsWith('@/')) {
      const base = path.resolve(name.slice(2));
      return load(fs.existsSync(base + '.ts') ? base + '.ts' : base + '.tsx', overrides);
    }
    return require(name);
  }, mod, mod.exports);
  return mod.exports;
}
const Panel = load('app/components/IngredientDetailPanel.tsx').SupplementFactsWithPanel;
function panel(formula, active = null) {
  stateIndex = 0; activeIngredient = active;
  return renderToStaticMarkup(React.createElement(Panel, { formula }));
}
const grapefruit = panel('grapefruit');
for (const expected of ['7.91', 'Calories</span><span>20', 'Total Carbohydrate</strong> 5g', 'Calcium-D-Pantothenate', 'Grapefruit Oil Blend', 'Maltodextrin']) assert.ok(grapefruit.includes(expected), expected);
for (const excluded of ['Chloride', '469mg', 'Allulose', 'Stevia', 'Strawberry']) assert.ok(!grapefruit.includes(excluded), excluded);
assert.ok(panel('grapefruit', 'vitaminb5').includes('Provided as Calcium-D-Pantothenate.'));
assert.ok(panel('current').includes('(as Pantethine) 12mg'));
let config;
const Page = load('app/products/grapefruit/page.tsx', {
  '@/app/components/ProductPage': { default: props => { config = props.config; return null; }, __esModule: true },
});
const markup = renderToStaticMarkup(React.createElement(Page.default));
assert.equal(config.supplementFactsProps.formula, 'grapefruit');
for (const text of [markup, JSON.stringify(Page.metadata), renderToStaticMarkup(React.createElement(React.Fragment, null, ...config.accordionItems.map(item => item.content)))]) {
  assert.ok(!/1,769|1769mg|469mg|Chloride/.test(text));
}
const Product = load('app/components/ProductPage.tsx', {
  '@/app/context/CartContext': { useCart: () => ({ addToCart: () => {} }), BOTTLE_DISCOUNT_LIVE: false },
}).default;
stateIndex = 0; activeIngredient = null;
const product = renderToStaticMarkup(React.createElement(Product, { config }));
assert.ok(product.includes('20 Calories'));
assert.ok(!product.includes('1,769'));
assert.ok(!product.includes('25 Calories'));
console.log('Grapefruit facts, B5 detail/fallback, metadata, accordion, hero, and Strawberry isolation regressions passed');
