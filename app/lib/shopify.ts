/* ========================================
   Atlas Hydration — Shopify Buy SDK Integration
   TypeScript ES Module for React/Remix
   ======================================== */

declare const ShopifyBuy: any;

// =============================================
// CONFIGURATION
// =============================================
const CONFIG = {
  domain: '7fa7b7-42.myshopify.com',
  storefrontAccessToken: '390caf7f28b55c8958daeab3fcd55f76',
};

// =============================================
// TYPES
// =============================================
interface VariantInfo {
  id: string;
  title: string;
  price: string;
  comparePrice?: string;
  image: string | null;
  allImages?: string[];
  shopifyTitle?: string;
  shopifyDesc?: string;
}

interface LocalCartItem {
  slug: string;
  title: string;
  price: number;
  quantity: number;
  image: string | null;
}

interface CartItem {
  title: string;
  price: number;
  quantity: number;
  image: string | null;
}

// =============================================
// VARIANT MAP
// =============================================
const VARIANTS: Record<string, VariantInfo> = {
  'strawberry-lemonade': {
    id: 'gid://shopify/ProductVariant/42739482067018',
    title: 'Strawberry Lemonade — 16 Pack',
    price: '29.99',
    comparePrice: '32.99',
    image: null,
  },
  'grapefruit': {
    id: 'gid://shopify/ProductVariant/41850457817162',
    title: 'Grapefruit — 16 Pack',
    price: '29.99',
    image: null,
  },
};

// Product ID to slug mapping
const PRODUCT_MAP: Record<number, string> = {
  7693950255178: 'strawberry-lemonade',
  7862662103114: 'grapefruit',
};

// =============================================
// STATE
// =============================================
let client: any = null;
let checkout: any = null;
let cartOpen = false;
let localCart: LocalCartItem[] = [];

// =============================================
// INITIALIZATION
// =============================================
export function initShopify(): void {
  buildCartDrawer();
  bindCartEvents();
  bindAddToCartButtons();
  loadCheckout();
  fetchProductImages();
}

function loadCheckout(): void {
  const savedCheckoutId = localStorage.getItem('atlas_checkout_id');

  if (typeof ShopifyBuy !== 'undefined' && CONFIG.storefrontAccessToken) {
    try {
      client = ShopifyBuy.buildClient({
        domain: CONFIG.domain,
        storefrontAccessToken: CONFIG.storefrontAccessToken,
      });

      if (savedCheckoutId) {
        client.checkout.fetch(savedCheckoutId).then((existingCheckout: any) => {
          if (existingCheckout && !existingCheckout.completedAt) {
            checkout = existingCheckout;
            updateCartUI();
          } else {
            createNewCheckout();
          }
        }).catch(() => {
          client = null;
          loadLocalCart();
        });
      } else {
        createNewCheckout();
      }
    } catch (e) {
      client = null;
      loadLocalCart();
    }
  } else {
    loadLocalCart();
  }
}

function createNewCheckout(): void {
  if (!client) {
    loadLocalCart();
    return;
  }
  client.checkout.create().then((newCheckout: any) => {
    checkout = newCheckout;
    localStorage.setItem('atlas_checkout_id', checkout.id);
    updateCartUI();
  }).catch(() => {
    client = null;
    loadLocalCart();
  });
}

// =============================================
// LOCAL CART FALLBACK
// =============================================
function loadLocalCart(): void {
  try {
    const saved = localStorage.getItem('atlas_cart');
    if (saved) localCart = JSON.parse(saved);
  } catch (e) {
    localCart = [];
  }
  updateCartUI();
}

function saveLocalCart(): void {
  localStorage.setItem('atlas_cart', JSON.stringify(localCart));
}

// =============================================
// ADD TO CART
// =============================================
export function addToCart(productSlug: string, quantity?: number): void {
  const qty = quantity || 1;
  const variant = VARIANTS[productSlug];
  if (!variant) return;

  const btn = document.querySelector('[data-product="' + productSlug + '"]') as HTMLElement | null;
  if (btn) {
    btn.classList.add('btn--loading');
    btn.textContent = 'Adding...';
  }

  if (client && checkout) {
    const lineItems = [{ variantId: variant.id, quantity: qty }];
    client.checkout.addLineItems(checkout.id, lineItems).then((updatedCheckout: any) => {
      checkout = updatedCheckout;
      localStorage.setItem('atlas_checkout_id', checkout.id);
      updateCartUI();
      openCart();
      resetButton(btn, 'Add to Cart');
    }).catch(() => {
      addToLocalCart(productSlug, qty);
      resetButton(btn, 'Add to Cart');
    });
  } else {
    addToLocalCart(productSlug, qty);
    resetButton(btn, 'Add to Cart');
  }
}

function addToLocalCart(slug: string, qty: number): void {
  let existing: LocalCartItem | null = null;
  for (let i = 0; i < localCart.length; i++) {
    if (localCart[i].slug === slug) {
      existing = localCart[i];
      break;
    }
  }
  if (existing) {
    existing.quantity += qty;
  } else {
    localCart.push({
      slug: slug,
      title: VARIANTS[slug].title,
      price: parseFloat(VARIANTS[slug].price),
      quantity: qty,
      image: VARIANTS[slug].image || null,
    });
  }
  saveLocalCart();
  updateCartUI();
  openCart();
}

export function removeFromCart(index: number): void {
  if (client && checkout && checkout.lineItems && checkout.lineItems[index]) {
    const lineItemId = checkout.lineItems[index].id;
    client.checkout.removeLineItems(checkout.id, [lineItemId]).then((updatedCheckout: any) => {
      checkout = updatedCheckout;
      updateCartUI();
    });
  } else {
    localCart.splice(index, 1);
    saveLocalCart();
    updateCartUI();
  }
}

export function updateQuantity(index: number, newQty: number): void {
  if (newQty < 1) {
    removeFromCart(index);
    return;
  }

  if (client && checkout && checkout.lineItems && checkout.lineItems[index]) {
    const lineItemId = checkout.lineItems[index].id;
    client.checkout.updateLineItems(checkout.id, [{ id: lineItemId, quantity: newQty }]).then((updatedCheckout: any) => {
      checkout = updatedCheckout;
      updateCartUI();
    });
  } else if (localCart[index]) {
    localCart[index].quantity = newQty;
    saveLocalCart();
    updateCartUI();
  }
}

function resetButton(btn: HTMLElement | null, text: string): void {
  if (!btn) return;
  btn.classList.remove('btn--loading');
  btn.textContent = text;
  btn.classList.add('btn--added');
  btn.textContent = 'Added!';
  setTimeout(() => {
    btn.classList.remove('btn--added');
    btn.textContent = text;
  }, 1500);
}

// =============================================
// CART UI
// =============================================
function buildCartDrawer(): void {
  const drawer = document.createElement('div');
  drawer.className = 'cart-drawer';
  drawer.id = 'cartDrawer';
  drawer.setAttribute('aria-hidden', 'true');
  drawer.innerHTML =
    '<div class="cart-drawer__overlay" id="cartOverlay"></div>' +
    '<div class="cart-drawer__panel">' +
      '<div class="cart-drawer__header">' +
        '<h2>Your Cart</h2>' +
        '<button class="cart-drawer__close" id="cartClose" aria-label="Close cart">' +
          '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>' +
      '</div>' +
      '<div class="cart-drawer__items" id="cartItems"></div>' +
      '<div class="cart-drawer__footer" id="cartFooter">' +
        '<div class="cart-drawer__subtotal">' +
          '<span>Subtotal</span>' +
          '<span id="cartSubtotal">$0.00</span>' +
        '</div>' +
        '<button class="btn btn--primary btn--full" id="cartCheckout">Checkout</button>' +
        '<p class="cart-drawer__note">Shipping & taxes calculated at checkout</p>' +
      '</div>' +
    '</div>';

  document.body.appendChild(drawer);
}

function updateCartUI(): void {
  const items = getCartItems();
  let count = 0;
  let subtotal = 0;

  for (let i = 0; i < items.length; i++) {
    count += items[i].quantity;
    subtotal += items[i].price * items[i].quantity;
  }

  // Update cart count badges
  const badges = document.querySelectorAll('.cart-count') as NodeListOf<HTMLElement>;
  for (let j = 0; j < badges.length; j++) {
    badges[j].textContent = String(count);
    badges[j].style.display = count > 0 ? 'flex' : 'none';
  }

  // Update cart items list
  const container = document.getElementById('cartItems');
  const footer = document.getElementById('cartFooter');
  if (!container) return;

  if (items.length === 0) {
    let spinnerColor = '#4a90d9';
    if (document.querySelector('.flavor-circle--strawberry.active') || window.location.href.indexOf('strawberry') > -1) {
      spinnerColor = '#e85d75';
    } else if (document.querySelector('.flavor-circle--grapefruit.active') || window.location.href.indexOf('grapefruit') > -1) {
      spinnerColor = '#f5a623';
    }
    container.innerHTML =
      '<div class="cart-drawer__empty">' +
        '<div class="cart-spinner" style="border-color: ' + spinnerColor + '22; border-top-color: ' + spinnerColor + ';"></div>' +
        '<p>Your cart is empty</p>' +
        '<a href="/#products" class="btn btn--outline btn--sm" onclick="AtlasShop.closeCart()">Shop Now</a>' +
      '</div>';
    if (footer) footer.style.display = 'none';
    return;
  }

  if (footer) footer.style.display = 'block';

  let html = '';
  for (let k = 0; k < items.length; k++) {
    let imgHtml = '';
    if (items[k].image) {
      imgHtml = '<div class="cart-item__image"><img src="' + items[k].image + '" alt="' + items[k].title + '"></div>';
    }
    html +=
      '<div class="cart-item">' +
        imgHtml +
        '<div class="cart-item__info">' +
          '<h4 class="cart-item__title">' + items[k].title + '</h4>' +
          '<p class="cart-item__price">$' + items[k].price.toFixed(2) + '</p>' +
        '</div>' +
        '<div class="cart-item__actions">' +
          '<div class="cart-item__qty">' +
            '<button class="cart-item__qty-btn" onclick="AtlasShop.updateQuantity(' + k + ',' + (items[k].quantity - 1) + ')">&#8722;</button>' +
            '<span>' + items[k].quantity + '</span>' +
            '<button class="cart-item__qty-btn" onclick="AtlasShop.updateQuantity(' + k + ',' + (items[k].quantity + 1) + ')">+</button>' +
          '</div>' +
          '<button class="cart-item__remove" onclick="AtlasShop.removeFromCart(' + k + ')" aria-label="Remove item">' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>';
  }

  // Buy 3 Get 1 Free promo
  let totalQty = 0;
  for (let q = 0; q < items.length; q++) {
    totalQty += items[q].quantity;
  }
  const freeItems = Math.floor(totalQty / 3);
  let discount = 0;
  if (freeItems > 0) {
    let cheapest = Infinity;
    for (let p = 0; p < items.length; p++) {
      if (items[p].price < cheapest) cheapest = items[p].price;
    }
    discount = cheapest * freeItems;
    html += '<div class="cart-promo">' +
      '<span class="cart-promo__badge">BUY 3 GET 1 FREE</span>' +
      '<span class="cart-promo__detail">' + freeItems + ' free item' + (freeItems > 1 ? 's' : '') + ' applied!</span>' +
      '<span class="cart-promo__savings">You save $' + discount.toFixed(2) + '</span>' +
    '</div>';
  }
  container.innerHTML = html;

  // Update subtotal
  const finalTotal = subtotal - discount;
  const subtotalEl = document.getElementById('cartSubtotal');
  if (subtotalEl) {
    if (discount > 0) {
      subtotalEl.innerHTML = '<span style="text-decoration:line-through;color:#999;font-size:0.85em;">$' + subtotal.toFixed(2) + '</span> $' + finalTotal.toFixed(2);
    } else {
      subtotalEl.textContent = '$' + subtotal.toFixed(2);
    }
  }
}

function getCartItems(): CartItem[] {
  if (checkout && checkout.lineItems && checkout.lineItems.length > 0) {
    return checkout.lineItems.map((item: any) => {
      let img: string | null = null;
      if (item.variant && item.variant.image && item.variant.image.src) {
        img = item.variant.image.src;
      }
      // Fallback to VARIANTS image
      if (!img) {
        for (const slug in VARIANTS) {
          if (item.title && item.title.toLowerCase().indexOf(slug.replace(/-/g, ' ')) > -1) {
            img = VARIANTS[slug].image;
            break;
          }
        }
      }
      return {
        title: item.title + (item.variant && item.variant.title !== 'Default Title' ? ' — ' + item.variant.title : ''),
        price: parseFloat(item.variant ? item.variant.price.amount || item.variant.price : 0),
        quantity: item.quantity,
        image: img,
      };
    });
  }
  return localCart;
}

// =============================================
// CART OPEN / CLOSE
// =============================================
export function openCart(): void {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  drawer.classList.add('cart-drawer--open');
  drawer.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  cartOpen = true;
}

export function closeCart(): void {
  const drawer = document.getElementById('cartDrawer');
  if (!drawer) return;
  drawer.classList.remove('cart-drawer--open');
  drawer.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  cartOpen = false;
}

export function toggleCart(): void {
  if (cartOpen) closeCart();
  else openCart();
}

// =============================================
// CHECKOUT
// =============================================
function goToCheckout(): void {
  if (checkout && checkout.webUrl) {
    window.location.href = checkout.webUrl;
  } else if (localCart.length > 0) {
    const parts: string[] = [];
    for (let i = 0; i < localCart.length; i++) {
      const variant = VARIANTS[localCart[i].slug];
      if (variant && variant.id) {
        const numericId = variant.id.replace('gid://shopify/ProductVariant/', '');
        parts.push(numericId + ':' + localCart[i].quantity);
      }
    }
    if (parts.length > 0) {
      window.location.href = 'https://' + CONFIG.domain + '/cart/' + parts.join(',');
    } else {
      window.location.href = 'https://' + CONFIG.domain;
    }
  }
}

// =============================================
// EVENT BINDING
// =============================================
function bindCartEvents(): void {
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    if (target.id === 'cartClose' || target.closest('#cartClose')) {
      closeCart();
    }
    if (target.id === 'cartOverlay') {
      closeCart();
    }
    if (target.id === 'cartCheckout') {
      goToCheckout();
    }
  });

  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    const cartToggle = target.closest('.js-cart-toggle');
    if (cartToggle) {
      e.preventDefault();
      toggleCart();
    }
  });

  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && cartOpen) closeCart();
  });
}

function bindAddToCartButtons(): void {
  document.addEventListener('click', (e: Event) => {
    const target = e.target as HTMLElement;
    const btn = target.closest('.js-add-to-cart') as HTMLElement | null;
    if (!btn) return;
    e.preventDefault();

    const slug = btn.getAttribute('data-product');
    const qtyInput = document.getElementById('productQty') as HTMLInputElement | null;
    const qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

    if (slug) addToCart(slug, qty);
  });
}

// =============================================
// FETCH PRODUCT IMAGES FROM SHOPIFY
// =============================================
function preloadImage(src: string): void {
  const img = new Image();
  img.src = src;
}

function fetchProductImages(): void {
  fetch('https://' + CONFIG.domain + '/products.json')
    .then((res) => res.json())
    .then((data: any) => {
      if (!data || !data.products) return;

      for (let i = 0; i < data.products.length; i++) {
        const product = data.products[i];
        const slug = PRODUCT_MAP[product.id];
        if (!slug) continue;

        const images = product.images;
        if (images && images.length > 0) {
          const imgSrc = images[0].src;
          VARIANTS[slug].image = imgSrc;
          VARIANTS[slug].allImages = images.map((img: any) => img.src);

          for (let j = 0; j < images.length; j++) {
            preloadImage(images[j].src);
          }

          injectProductImage(slug, imgSrc, product.title);
        }

        if (product.variants && product.variants.length > 0) {
          const variant = product.variants[0];
          const price = variant.price;
          VARIANTS[slug].price = price;
          VARIANTS[slug].shopifyTitle = product.title;
          VARIANTS[slug].shopifyDesc = product.body_html;
        }

        updateProductPagePrices(slug, product);
      }
    })
    .catch(() => {
      // Silently fail — static content remains as fallback
    });
}

function updateProductPagePrices(slug: string, product: any): void {
  const addBtn = document.querySelector('.js-add-to-cart[data-product="' + slug + '"]');
  if (!addBtn) return;

  const variant = product.variants && product.variants[0];
  if (!variant) return;

  const price = parseFloat(variant.price);
  const subscribePrice = (price * 0.8).toFixed(2);
  const perStick = (price / 16).toFixed(2);
  const subPerStick = (parseFloat(subscribePrice) / 16).toFixed(2);

  const onetimeEl = document.getElementById('onetimePrice');
  if (onetimeEl) onetimeEl.textContent = '$' + price.toFixed(2);

  const subscribeEl = document.getElementById('subscribePrice');
  if (subscribeEl) subscribeEl.textContent = '$' + subscribePrice;

  const perEls = document.querySelectorAll('.purchase-option__per');
  if (perEls.length >= 2) {
    perEls[0].textContent = '$' + subPerStick + ' / Stick';
    perEls[1].textContent = '$' + perStick + ' / Stick';
  }

  const ctaBtn = document.querySelector('.cta-section .js-add-to-cart');
  if (ctaBtn) {
    ctaBtn.textContent = 'Add to Cart — $' + price.toFixed(2);
  }
}

function injectProductImage(slug: string, imgSrc: string, altText: string): void {
  const allImages = VARIANTS[slug].allImages || [imgSrc];

  // Update product card visuals on landing page
  const cards = document.querySelectorAll('.product-card__visual--' + getVisualClass(slug));
  for (let i = 0; i < cards.length; i++) {
    cards[i].innerHTML = '<img src="' + imgSrc + '" alt="' + (altText || slug) + '" style="width:100%;height:100%;object-fit:cover;">';
  }

  // Update featured product image on landing page
  const featuredImg = document.querySelector('.featured-product__image .product-card__visual--' + getVisualClass(slug));
  if (featuredImg) {
    featuredImg.innerHTML = '<img src="' + imgSrc + '" alt="' + (altText || slug) + '" style="width:100%;height:100%;object-fit:cover;border-radius:24px;">';
  }

  // Update product gallery main slide on product detail pages
  const gallerySlide = document.querySelector('.product-gallery__slide[data-slide="0"]');
  if (gallerySlide) {
    const addBtn = document.querySelector('.js-add-to-cart[data-product="' + slug + '"]');
    if (addBtn && gallerySlide) {
      gallerySlide.innerHTML = '<img src="' + imgSrc + '" alt="' + (altText || slug) + '" style="width:100%;height:100%;object-fit:contain;padding:20px;">';

      const firstThumb = document.querySelector('.product-gallery__thumb[data-thumb="0"]');
      if (firstThumb) {
        firstThumb.innerHTML = '<img src="' + imgSrc + '" alt="Product" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">';
      }

      if (allImages.length > 1) {
        const brandSlide = document.querySelector('.product-gallery__slide[data-slide="1"]');
        if (brandSlide) {
          brandSlide.innerHTML = '<img src="' + allImages[1] + '" alt="' + (altText || slug) + '" style="width:100%;height:100%;object-fit:contain;padding:20px;">';
        }
        const brandThumb = document.querySelector('.product-gallery__thumb[data-thumb="1"]');
        if (brandThumb) {
          brandThumb.innerHTML = '<img src="' + allImages[1] + '" alt="Brand" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">';
        }
      }
      if (allImages.length > 2) {
        const ingredSlide = document.querySelector('.product-gallery__slide[data-slide="2"]');
        if (ingredSlide) {
          ingredSlide.innerHTML = '<img src="' + allImages[2] + '" alt="' + (altText || slug) + '" style="width:100%;height:100%;object-fit:contain;padding:20px;">';
        }
        const ingredThumb = document.querySelector('.product-gallery__thumb[data-thumb="2"]');
        if (ingredThumb) {
          ingredThumb.innerHTML = '<img src="' + allImages[2] + '" alt="Facts" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">';
        }
      }
      if (allImages.length > 3) {
        const lifeSlide = document.querySelector('.product-gallery__slide[data-slide="3"]');
        if (lifeSlide) {
          lifeSlide.innerHTML = '<img src="' + allImages[3] + '" alt="' + (altText || slug) + '" style="width:100%;height:100%;object-fit:contain;padding:20px;">';
        }
        const lifeThumb = document.querySelector('.product-gallery__thumb[data-thumb="3"]');
        if (lifeThumb) {
          lifeThumb.innerHTML = '<img src="' + allImages[3] + '" alt="Clean" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">';
        }
      }
    }
  }

  // Update hero right panel if on landing page
  const heroRight = document.querySelector('.hero__right-bg') as HTMLElement | null;
  if (heroRight && !heroRight.dataset.filled) {
    heroRight.dataset.filled = 'true';
    heroRight.style.backgroundImage = 'url(' + imgSrc + ')';
    heroRight.style.backgroundSize = 'cover';
    heroRight.style.backgroundPosition = 'center';
  }

  // Inject product art throughout the site
  if (slug === 'strawberry-lemonade') {
    const ctaArt = document.getElementById('ctaDarkArt');
    if (ctaArt && !(ctaArt as HTMLElement & { dataset: DOMStringMap }).dataset.filled && allImages.length > 0) {
      (ctaArt as HTMLElement).dataset.filled = 'true';
      const ctaImg = allImages.length > 1 ? allImages[1] : imgSrc;
      ctaArt.innerHTML = '<img src="' + ctaImg + '" alt="Atlas Hydration" style="width:100%;height:100%;object-fit:contain;opacity:0.12;filter:brightness(1.2);">';
    }
  }
}

function getVisualClass(slug: string): string {
  if (slug === 'strawberry-lemonade') return 'strawberry';
  if (slug === 'grapefruit') return 'lemon';
  return slug;
}

// =============================================
// EXPOSE ON WINDOW FOR INLINE ONCLICK HANDLERS
// =============================================
if (typeof window !== 'undefined') {
  (window as any).AtlasShop = {
    init: initShopify,
    addToCart,
    removeFromCart,
    updateQuantity,
    openCart,
    closeCart,
    toggleCart,
  };
}
