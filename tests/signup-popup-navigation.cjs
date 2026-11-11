const assert = require('node:assert/strict');
const fs = require('node:fs');
const ts = require('typescript');
const React = require('react');

// Exercise provider state across rerenders, including persistent refs and
// dependency-aware effects, without mounting or submitting the signup form.
let hooks, cursor, pending, pathname, now, tick, dismissals;
const closeout = { CLOSEOUT_LIVE: false };
const react = {
  ...React,
  useState(initial) {
    const i = cursor++;
    if (!(i in hooks)) hooks[i] = initial;
    return [hooks[i], value => { hooks[i] = typeof value === 'function' ? value(hooks[i]) : value; }];
  },
  useRef(initial) {
    const i = cursor++;
    return hooks[i] ?? (hooks[i] = { current: initial });
  },
  useEffect(fn, deps) {
    const i = cursor++, previous = hooks[i];
    if (!previous || deps.some((value, j) => !Object.is(value, previous.deps[j]))) {
      pending.push(() => {
        previous?.cleanup?.();
        hooks[i] = { deps, cleanup: fn() };
      });
    }
  },
  useCallback: fn => fn,
};
global.window = { setInterval: fn => (tick = fn, 1), clearInterval: () => {} };
const originalNow = Date.now;
Date.now = () => now;
const source = ts.transpileModule(fs.readFileSync('app/components/SignupPopup.tsx', 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const mod = { exports: {} };
new Function('require', 'module', 'exports', source)(name => {
  if (name === 'react') return react;
  if (name === 'next/navigation') return { usePathname: () => pathname };
  if (name === 'next/link') return () => null;
  if (name === '@/app/lib/welcomeSignup') return {
    autoOpenSuppressed: () => false,
    markDismissed: () => { dismissals++; },
  };
  if (name === '@/app/lib/klaviyo') return {};
  if (name === '@/app/data/closeoutOffer') return closeout;
  if (name === '@/app/data/starterOffer') return { STARTER_OFFER_LIVE: true };
  return require(name);
}, mod, mod.exports);
const Provider = mod.exports.SignupPopupProvider;
function render() {
  cursor = 0; pending = [];
  const tree = Provider({ children: null });
  pending.forEach(fn => fn());
  return tree;
}
function reset(route) {
  hooks = []; pathname = route; now = 0; dismissals = 0;
  render();
}
function navigate(route) { pathname = route; return render(); }
function popupOpen() { return hooks[0]; }

try {
  for (const destination of [
    '/products/strawberry-lemonade', '/products/strawberry-lemonade/',
    '/cart', '/checkout', '/app', '/shipping', '/products/grapefruit',
  ]) {
    reset('/');
    now = 9000; tick();
    assert.equal(popupOpen(), true, 'homepage auto-opens after delay');
    navigate(destination);
    assert.equal(popupOpen(), false, `navigation closes old popup: ${destination}`);
    assert.equal(dismissals, 0, 'navigation does not save a dismissal preference');
    tick();
    assert.equal(popupOpen(), false, 'timer does not reopen the earlier popup');
    const tree = render();
    tree.props.value.openSignup();
    assert.equal(popupOpen(), true, 'manual signup remains available');
    render();
    assert.equal(popupOpen(), true, 'same-path rerender preserves manual popup');
    render().props.children[1].props.onClose();
    assert.equal(popupOpen(), false, 'Close dismisses manual popup');
    assert.equal(dismissals, 1);
    tick();
    assert.equal(popupOpen(), false, 'Close stays closed');
  }
  for (const route of [
    '/products/strawberry-lemonade', '/products/strawberry-lemonade/',
    '/cart', '/checkout', '/app',
  ]) {
    reset(route);
    now = 9000; tick();
    assert.equal(popupOpen(), false, `suppressed route remains quiet: ${route}`);
    render().props.value.openSignup();
    render();
    assert.equal(popupOpen(), true, 'manual popup remains open on suppressed route');
    navigate('/');
    assert.equal(popupOpen(), false);
    navigate(route);
    tick();
    assert.equal(popupOpen(), false, 'back/forward-style navigation does not reopen it');
  }
  reset('/products/strawberry-lemonade');
  now = 9000; tick();
  navigate('/products/grapefruit');
  tick();
  assert.equal(popupOpen(), true, 'eligible later page can still auto-open when never shown');
  closeout.CLOSEOUT_LIVE = true;
  for (const route of ['/', '/products/strawberry-lemonade', '/products/grapefruit', '/shipping']) {
    reset(route); now = 9000; tick(); assert.equal(popupOpen(), false, 'closeout never interrupts with welcome promo');
    render().props.value.openSignup(); assert.equal(popupOpen(), true, 'explicit welcome signup still works');
  }
  closeout.CLOSEOUT_LIVE = false;
  reset('/closeout-preview'); now = 9000; tick(); assert.equal(popupOpen(), false);
  console.log('18 popup navigation cases passed: route changes, same-path rerenders, manual open/Close, and back/forward-style transitions');
} finally {
  Date.now = originalNow;
}
