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
    'grapefruit': {
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
        quantity: qty,
        image: VARIANTS[slug].image || null
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
      // Detect flavor color from current page
      var spinnerColor = '#4a90d9'; // default blue
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

    var html = '';
    for (var k = 0; k < items.length; k++) {
      var imgHtml = '';
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

    // Buy 3 Get 1 Free promo
    var totalQty = 0;
    for (var q = 0; q < items.length; q++) {
      totalQty += items[q].quantity;
    }
    var freeItems = Math.floor(totalQty / 3);
    var discount = 0;
    if (freeItems > 0) {
      // Find the cheapest item price for free item
      var cheapest = Infinity;
      for (var p = 0; p < items.length; p++) {
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
    var finalTotal = subtotal - discount;
    var subtotalEl = document.getElementById('cartSubtotal');
    if (subtotalEl) {
      if (discount > 0) {
        subtotalEl.innerHTML = '<span style="text-decoration:line-through;color:#999;font-size:0.85em;">$' + subtotal.toFixed(2) + '</span> $' + finalTotal.toFixed(2);
      } else {
        subtotalEl.textContent = '$' + subtotal.toFixed(2);
      }
    }
  }

  function getCartItems() {
    if (checkout && checkout.lineItems && checkout.lineItems.length > 0) {
      return checkout.lineItems.map(function(item) {
        var img = null;
        if (item.variant && item.variant.image && item.variant.image.src) {
          img = item.variant.image.src;
        }
        // Fallback to VARIANTS image
        if (!img) {
          for (var slug in VARIANTS) {
            if (item.title && item.title.toLowerCase().indexOf(slug.replace('-', ' ').replace('-', ' ')) > -1) {
              img = VARIANTS[slug].image;
              break;
            }
          }
        }
        return {
          title: item.title + (item.variant && item.variant.title !== 'Default Title' ? ' — ' + item.variant.title : ''),
          price: parseFloat(item.variant ? item.variant.price.amount || item.variant.price : 0),
          quantity: item.quantity,
          image: img
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
    7862662103114: 'grapefruit'
  };

  function preloadImage(src) {
    var img = new Image();
    img.src = src;
  }

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

            // Preload all images into browser cache
            for (var j = 0; j < images.length; j++) {
              preloadImage(images[j].src);
            }

            injectProductImage(slug, imgSrc, product.title);
          }

          // Update product details from Shopify data
          if (product.variants && product.variants.length > 0) {
            var variant = product.variants[0];
            var price = variant.price;
            VARIANTS[slug].price = price;
            VARIANTS[slug].shopifyTitle = product.title;
            VARIANTS[slug].shopifyDesc = product.body_html;
          }

          // Update prices on the product page if this is the current product
          updateProductPagePrices(slug, product);
        }
      })
      .catch(function() {
        // Silently fail — static content remains as fallback
      });
  }

  function updateProductPagePrices(slug, product) {
    // Check if we're on this product's page
    var addBtn = document.querySelector('.js-add-to-cart[data-product="' + slug + '"]');
    if (!addBtn) return;

    var variant = product.variants && product.variants[0];
    if (!variant) return;

    var price = parseFloat(variant.price);
    var subscribePrice = (price * 0.8).toFixed(2);
    var perStick = (price / 16).toFixed(2);
    var subPerStick = (subscribePrice / 16).toFixed(2);

    // Update one-time price
    var onetimeEl = document.getElementById('onetimePrice');
    if (onetimeEl) onetimeEl.textContent = '$' + price.toFixed(2);

    // Update subscribe price
    var subscribeEl = document.getElementById('subscribePrice');
    if (subscribeEl) subscribeEl.textContent = '$' + subscribePrice;

    // Update per-stick prices
    var perEls = document.querySelectorAll('.purchase-option__per');
    if (perEls.length >= 2) {
      perEls[0].textContent = '$' + subPerStick + ' / Stick';
      perEls[1].textContent = '$' + perStick + ' / Stick';
    }

    // Update CTA button price
    var ctaBtn = document.querySelector('.cta-section .js-add-to-cart');
    if (ctaBtn) {
      ctaBtn.textContent = 'Add to Cart — $' + price.toFixed(2);
    }
  }

  function injectProductImage(slug, imgSrc, altText) {
    var allImages = VARIANTS[slug].allImages || [imgSrc];

    // Update product card visuals on landing page
    var cards = document.querySelectorAll('.product-card__visual--' + getVisualClass(slug));
    for (var i = 0; i < cards.length; i++) {
      cards[i].innerHTML = '<img src="' + imgSrc + '" alt="' + (altText || slug) + '" style="width:100%;height:100%;object-fit:cover;">';
    }

    // Update featured product image on landing page
    var featuredImg = document.querySelector('.featured-product__image .product-card__visual--' + getVisualClass(slug));
    if (featuredImg) {
      featuredImg.innerHTML = '<img src="' + imgSrc + '" alt="' + (altText || slug) + '" style="width:100%;height:100%;object-fit:cover;border-radius:24px;">';
    }

    // Update product gallery main slide on product detail pages
    var gallerySlide = document.querySelector('.product-gallery__slide[data-slide="0"]');
    if (gallerySlide) {
      // Check if we're on the right product page
      var addBtn = document.querySelector('.js-add-to-cart[data-product="' + slug + '"]');
      if (addBtn && gallerySlide) {
        gallerySlide.innerHTML = '<img src="' + imgSrc + '" alt="' + (altText || slug) + '" style="width:100%;height:100%;object-fit:contain;padding:20px;">';

        // Update first thumbnail
        var firstThumb = document.querySelector('.product-gallery__thumb[data-thumb="0"]');
        if (firstThumb) {
          firstThumb.innerHTML = '<img src="' + imgSrc + '" alt="Product" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">';
        }

        // Inject additional images into other slides if available
        if (allImages.length > 1) {
          var brandSlide = document.querySelector('.product-gallery__slide[data-slide="1"]');
          if (brandSlide) {
            brandSlide.innerHTML = '<img src="' + allImages[1] + '" alt="' + (altText || slug) + '" style="width:100%;height:100%;object-fit:contain;padding:20px;">';
          }
          var brandThumb = document.querySelector('.product-gallery__thumb[data-thumb="1"]');
          if (brandThumb) {
            brandThumb.innerHTML = '<img src="' + allImages[1] + '" alt="Brand" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">';
          }
        }
        if (allImages.length > 2) {
          var ingredSlide = document.querySelector('.product-gallery__slide[data-slide="2"]');
          if (ingredSlide) {
            ingredSlide.innerHTML = '<img src="' + allImages[2] + '" alt="' + (altText || slug) + '" style="width:100%;height:100%;object-fit:contain;padding:20px;">';
          }
          var ingredThumb = document.querySelector('.product-gallery__thumb[data-thumb="2"]');
          if (ingredThumb) {
            ingredThumb.innerHTML = '<img src="' + allImages[2] + '" alt="Facts" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">';
          }
        }
        if (allImages.length > 3) {
          var lifeSlide = document.querySelector('.product-gallery__slide[data-slide="3"]');
          if (lifeSlide) {
            lifeSlide.innerHTML = '<img src="' + allImages[3] + '" alt="' + (altText || slug) + '" style="width:100%;height:100%;object-fit:contain;padding:20px;">';
          }
          var lifeThumb = document.querySelector('.product-gallery__thumb[data-thumb="3"]');
          if (lifeThumb) {
            lifeThumb.innerHTML = '<img src="' + allImages[3] + '" alt="Clean" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">';
          }
        }
      }
    }

    // Update hero right panel if on landing page (show first product found)
    var heroRight = document.querySelector('.hero__right-bg');
    if (heroRight && !heroRight.dataset.filled) {
      heroRight.dataset.filled = 'true';
      heroRight.style.backgroundImage = 'url(' + imgSrc + ')';
      heroRight.style.backgroundSize = 'cover';
      heroRight.style.backgroundPosition = 'center';
    }

    // Inject product art throughout the site
    if (slug === 'strawberry-lemonade') {
      // Dark CTA background art
      var ctaArt = document.getElementById('ctaDarkArt');
      if (ctaArt && !ctaArt.dataset.filled && allImages.length > 0) {
        ctaArt.dataset.filled = 'true';
        var ctaImg = allImages.length > 1 ? allImages[1] : imgSrc;
        ctaArt.innerHTML = '<img src="' + ctaImg + '" alt="Atlas Hydration" style="width:100%;height:100%;object-fit:contain;opacity:0.12;filter:brightness(1.2);">';
      }

      // Founder section — video embed, no image injection needed

      // Science section art removed — was overlapping content
    }
  }

  function getVisualClass(slug) {
    if (slug === 'strawberry-lemonade') return 'strawberry';
    if (slug === 'grapefruit') return 'lemon';
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
