/* ========================================
   Atlas Hydration — Shopify Buy SDK Integration
   ========================================

   SETUP INSTRUCTIONS:
   1. In your Shopify admin, go to Apps > Develop apps
   2. Create a new app with Storefront API access
   3. Enable: unauthenticated_read_product_listings, unauthenticated_write_checkouts, unauthenticated_read_checkouts
   4. Copy your Storefront access token and shop domain below
   5. Replace the VARIANT_IDs with your actual Shopify product variant GIDs
   ======================================== */

var AtlasShop = (function() {
  'use strict';

  // =============================================
  // CONFIGURATION — Update these values
  // =============================================
  var CONFIG = {
    domain: '7fa7b7-42.myshopify.com',
    storefrontAccessToken: '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'
  };

  // Map product slugs to Shopify variant GIDs
  // Format: 'gid://shopify/ProductVariant/XXXXXXXXXX'
  var VARIANTS = {
    'strawberry-lemonade': {
      id: 'gid://shopify/ProductVariant/42739482067018',
      title: 'Strawberry Lemonade — 16 Pack',
      price: '29.99',
      comparePrice: '32.99',
      image: null
    },
    'lemon-lime': {
      id: 'gid://shopify/ProductVariant/41850457817162',
      title: 'Grapefruit — 16 Pack',
      price: '29.99',
      image: null
    }
  };

  // =============================================
  // STATE
  // =============================================
  var client = null;
  var checkout = null;
  var cartOpen = false;

  // =============================================
  // INITIALIZATION
  // =============================================
  function init() {
    buildCartDrawer();
    bindCartEvents();
    bindAddToCartButtons();
    loadCheckout();
    fetchProductImages();
  }

  function loadCheckout() {
    // Try to restore a saved checkout
    var savedCheckoutId = localStorage.getItem('atlas_checkout_id');

    if (typeof ShopifyBuy !== 'undefined') {
      client = ShopifyBuy.buildClient({
        domain: CONFIG.domain,
        storefrontAccessToken: CONFIG.storefrontAccessToken
      });

      if (savedCheckoutId) {
        client.checkout.fetch(savedCheckoutId).then(function(existingCheckout) {
          if (existingCheckout && !existingCheckout.completedAt) {
            checkout = existingCheckout;
            updateCartUI();
          } else {
            createNewCheckout();
          }
        }).catch(function() {
          createNewCheckout();
        });
      } else {
        createNewCheckout();
      }
    } else {
      // SDK not loaded — use local cart fallback
      loadLocalCart();
    }
  }

  function createNewCheckout() {
    if (!client) return;
    client.checkout.create().then(function(newCheckout) {
      checkout = newCheckout;
      localStorage.setItem('atlas_checkout_id', checkout.id);
      updateCartUI();
    });
  }

  // =============================================
  // LOCAL CART FALLBACK (works without SDK)
  // =============================================
  var localCart = [];

  function loadLocalCart() {
    try {
      var saved = localStorage.getItem('atlas_cart');
      if (saved) localCart = JSON.parse(saved);
    } catch(e) {
      localCart = [];
    }
    updateCartUI();
  }

  function saveLocalCart() {
    localStorage.setItem('atlas_cart', JSON.stringify(localCart));
  }

  // =============================================
  // ADD TO CART
  // =============================================
  function addToCart(productSlug, quantity) {
    quantity = quantity || 1;
    var variant = VARIANTS[productSlug];
    if (!variant) return;

    // Show loading state on button
    var btn = document.querySelector('[data-product="' + productSlug + '"]');
    if (btn) {
      btn.classList.add('btn--loading');
      btn.textContent = 'Adding...';
    }

    if (client && checkout) {
      // Use Shopify Buy SDK
      var lineItems = [{ variantId: variant.id, quantity: quantity }];
      client.checkout.addLineItems(checkout.id, lineItems).then(function(updatedCheckout) {
        checkout = updatedCheckout;
        localStorage.setItem('atlas_checkout_id', checkout.id);
        updateCartUI();
        openCart();
        resetButton(btn, 'Add to Cart');
      }).catch(function() {
        // Fallback to local cart
        addToLocalCart(productSlug, quantity);
        resetButton(btn, 'Add to Cart');
      });
    } else {
      // Local cart fallback
      addToLocalCart(productSlug, quantity);
      resetButton(btn, 'Add to Cart');
    }
  }

  function addToLocalCart(slug, qty) {
    var existing = null;
    for (var i = 0; i < localCart.length; i++) {
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
        quantity: qty
      });
    }
    saveLocalCart();
    updateCartUI();
    openCart();
  }

  function removeFromCart(index) {
    if (client && checkout && checkout.lineItems && checkout.lineItems[index]) {
      var lineItemId = checkout.lineItems[index].id;
      client.checkout.removeLineItems(checkout.id, [lineItemId]).then(function(updatedCheckout) {
        checkout = updatedCheckout;
        updateCartUI();
      });
    } else {
      localCart.splice(index, 1);
      saveLocalCart();
      updateCartUI();
    }
  }

  function updateQuantity(index, newQty) {
    if (newQty < 1) {
      removeFromCart(index);
      return;
    }

    if (client && checkout && checkout.lineItems && checkout.lineItems[index]) {
      var lineItemId = checkout.lineItems[index].id;
      client.checkout.updateLineItems(checkout.id, [{ id: lineItemId, quantity: newQty }]).then(function(updatedCheckout) {
        checkout = updatedCheckout;
        updateCartUI();
      });
    } else if (localCart[index]) {
      localCart[index].quantity = newQty;
      saveLocalCart();
      updateCartUI();
    }
  }

  function resetButton(btn, text) {
    if (!btn) return;
    btn.classList.remove('btn--loading');
    btn.textContent = text;
    btn.classList.add('btn--added');
    btn.textContent = 'Added!';
    setTimeout(function() {
      btn.classList.remove('btn--added');
      btn.textContent = text;
    }, 1500);
  }

  // =============================================
  // CART UI
  // =============================================
  function buildCartDrawer() {
    var drawer = document.createElement('div');
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

  function updateCartUI() {
    var items = getCartItems();
    var count = 0;
    var subtotal = 0;

    // Count items
    for (var i = 0; i < items.length; i++) {
      count += items[i].quantity;
      subtotal += items[i].price * items[i].quantity;
    }

    // Update cart count badges
    var badges = document.querySelectorAll('.cart-count');
    for (var j = 0; j < badges.length; j++) {
      badges[j].textContent = count;
      badges[j].style.display = count > 0 ? 'flex' : 'none';
    }

    // Update cart items list
    var container = document.getElementById('cartItems');
    var footer = document.getElementById('cartFooter');
    if (!container) return;

    if (items.length === 0) {
      container.innerHTML =
        '<div class="cart-drawer__empty">' +
          '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>' +
          '<p>Your cart is empty</p>' +
          '<a href="/#products" class="btn btn--outline btn--sm" onclick="AtlasShop.closeCart()">Shop Now</a>' +
        '</div>';
      if (footer) footer.style.display = 'none';
      return;
    }

    if (footer) footer.style.display = 'block';

    var html = '';
    for (var k = 0; k < items.length; k++) {
      html +=
        '<div class="cart-item">' +
          '<div class="cart-item__info">' +
            '<h4 class="cart-item__title">' + items[k].title + '</h4>' +
            '<p class="cart-item__price">$' + items[k].price.toFixed(2) + '</p>' +
          '</div>' +
          '<div class="cart-item__actions">' +
            '<div class="cart-item__qty">' +
              '<button class="cart-item__qty-btn" onclick="AtlasShop.updateQuantity(' + k + ',' + (items[k].quantity - 1) + ')">−</button>' +
              '<span>' + items[k].quantity + '</span>' +
              '<button class="cart-item__qty-btn" onclick="AtlasShop.updateQuantity(' + k + ',' + (items[k].quantity + 1) + ')">+</button>' +
            '</div>' +
            '<button class="cart-item__remove" onclick="AtlasShop.removeFromCart(' + k + ')" aria-label="Remove item">' +
              '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>' +
            '</button>' +
          '</div>' +
        '</div>';
    }
    container.innerHTML = html;

    // Update subtotal
    var subtotalEl = document.getElementById('cartSubtotal');
    if (subtotalEl) subtotalEl.textContent = '$' + subtotal.toFixed(2);
  }

  function getCartItems() {
    if (checkout && checkout.lineItems && checkout.lineItems.length > 0) {
      return checkout.lineItems.map(function(item) {
        return {
          title: item.title + (item.variant && item.variant.title !== 'Default Title' ? ' — ' + item.variant.title : ''),
          price: parseFloat(item.variant ? item.variant.price.amount || item.variant.price : 0),
          quantity: item.quantity
        };
      });
    }
    return localCart;
  }

  // =============================================
  // CART OPEN / CLOSE
  // =============================================
  function openCart() {
    var drawer = document.getElementById('cartDrawer');
    if (!drawer) return;
    drawer.classList.add('cart-drawer--open');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    cartOpen = true;
  }

  function closeCart() {
    var drawer = document.getElementById('cartDrawer');
    if (!drawer) return;
    drawer.classList.remove('cart-drawer--open');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    cartOpen = false;
  }

  function toggleCart() {
    if (cartOpen) closeCart();
    else openCart();
  }

  // =============================================
  // CHECKOUT
  // =============================================
  function goToCheckout() {
    if (checkout && checkout.webUrl) {
      window.location.href = checkout.webUrl;
    } else if (localCart.length > 0) {
      // Build a Shopify cart permalink as fallback
      // Format: https://DOMAIN/cart/VARIANT_ID:QTY,VARIANT_ID:QTY
      var parts = [];
      for (var i = 0; i < localCart.length; i++) {
        var variant = VARIANTS[localCart[i].slug];
        if (variant && variant.id) {
          // Extract numeric ID from GID if needed
          var numericId = variant.id.replace('gid://shopify/ProductVariant/', '');
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
  function bindCartEvents() {
    // Close cart button
    document.addEventListener('click', function(e) {
      if (e.target.id === 'cartClose' || e.target.closest('#cartClose')) {
        closeCart();
      }
      if (e.target.id === 'cartOverlay') {
        closeCart();
      }
      if (e.target.id === 'cartCheckout') {
        goToCheckout();
      }
    });

    // Cart toggle from header
    document.addEventListener('click', function(e) {
      var cartToggle = e.target.closest('.js-cart-toggle');
      if (cartToggle) {
        e.preventDefault();
        toggleCart();
      }
    });

    // Escape key closes cart
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && cartOpen) closeCart();
    });
  }

  function bindAddToCartButtons() {
    document.addEventListener('click', function(e) {
      var btn = e.target.closest('.js-add-to-cart');
      if (!btn) return;
      e.preventDefault();

      var slug = btn.getAttribute('data-product');
      var qtyInput = document.getElementById('productQty');
      var qty = qtyInput ? parseInt(qtyInput.value, 10) || 1 : 1;

      addToCart(slug, qty);
    });
  }

  // =============================================
  // FETCH PRODUCT IMAGES FROM SHOPIFY
  // =============================================
  // Product ID to slug mapping
  var PRODUCT_MAP = {
    7693950255178: 'strawberry-lemonade',
    7862662103114: 'lemon-lime'
  };

  function fetchProductImages() {
    fetch('https://' + CONFIG.domain + '/products.json')
      .then(function(res) { return res.json(); })
      .then(function(data) {
        if (!data || !data.products) return;

        for (var i = 0; i < data.products.length; i++) {
          var product = data.products[i];
          var slug = PRODUCT_MAP[product.id];
          if (!slug) continue;

          var images = product.images;
          if (images && images.length > 0) {
            var imgSrc = images[0].src;
            VARIANTS[slug].image = imgSrc;
            VARIANTS[slug].allImages = images.map(function(img) { return img.src; });
            injectProductImage(slug, imgSrc, product.title);
          }
        }
      })
      .catch(function() {
        // Silently fail — CSS sachet illustrations remain as fallback
      });
  }

  function injectProductImage(slug, imgSrc, altText) {
    // Update product card visuals on landing page
    var cards = document.querySelectorAll('.product-card__visual--' + getVisualClass(slug));
    for (var i = 0; i < cards.length; i++) {
      cards[i].innerHTML = '<img src="' + imgSrc + '" alt="' + (altText || slug) + '" style="width:100%;height:100%;object-fit:cover;">';
    }

    // Update product hero image on product detail pages
    var heroImages = document.querySelectorAll('.product-hero__image--' + getVisualClass(slug));
    for (var j = 0; j < heroImages.length; j++) {
      heroImages[j].innerHTML = '<img src="' + imgSrc + '" alt="' + (altText || slug) + '" style="width:100%;height:100%;object-fit:cover;border-radius:var(--radius-lg);">';
    }

    // Update hero right panel if on landing page (show first product found)
    var heroRight = document.querySelector('.hero__right-bg');
    if (heroRight && !heroRight.dataset.filled) {
      heroRight.dataset.filled = 'true';
      heroRight.style.backgroundImage = 'url(' + imgSrc + ')';
      heroRight.style.backgroundSize = 'cover';
      heroRight.style.backgroundPosition = 'center';
    }
  }

  function getVisualClass(slug) {
    if (slug === 'strawberry-lemonade') return 'strawberry';
    if (slug === 'lemon-lime') return 'lemon';
    return slug;
  }

  // =============================================
  // PUBLIC API
  // =============================================
  return {
    init: init,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    updateQuantity: updateQuantity,
    openCart: openCart,
    closeCart: closeCart,
    toggleCart: toggleCart
  };

})();

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
  AtlasShop.init();
});
