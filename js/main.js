/* ========================================
   Atlas Hydration — Main JS
   ======================================== */

// Wave text — split characters for wavy animation
(function() {
  var els = document.querySelectorAll('.wave-text');
  els.forEach(function(el) {
    var text = el.textContent;
    el.innerHTML = '';
    for (var i = 0; i < text.length; i++) {
      var span = document.createElement('span');
      span.className = 'wave-char';
      span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
      span.style.animationDelay = (i * 0.06) + 's';
      el.appendChild(span);
    }
  });
})();

// Mobile menu toggle
(function() {
  var toggle = document.getElementById('menuToggle');
  var menu = document.getElementById('mobileMenu');

  if (toggle && menu) {
    toggle.addEventListener('click', function() {
      var isOpen = menu.classList.toggle('active');
      menu.setAttribute('aria-hidden', !isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
      toggle.classList.toggle('open');
    });

    menu.querySelectorAll('a').forEach(function(link) {
      link.addEventListener('click', function() {
        menu.classList.remove('active');
        menu.setAttribute('aria-hidden', 'true');
        toggle.classList.remove('open');
      });
    });
  }
})();

// Scroll-based fade-in animations
(function() {
  var targets = document.querySelectorAll(
    '.science__accordion, .science__left, .how-it-works__step, .testimonial, .product-card, .sf-highlight, .mission__content, .mission__visual'
  );

  targets.forEach(function(el) {
    el.classList.add('fade-in');
  });

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  targets.forEach(function(el) {
    observer.observe(el);
  });
})();

// Animate stat numbers on scroll
(function() {
  var stats = document.querySelectorAll('.stat__number[data-count]');
  if (!stats.length) return;

  var animated = false;

  function animateCounters() {
    stats.forEach(function(el) {
      var target = parseInt(el.getAttribute('data-count'), 10);
      var duration = 1500;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(eased * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target;
        }
      }

      requestAnimationFrame(step);
    });
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  var statsBar = document.querySelector('.stats-bar');
  if (statsBar) observer.observe(statsBar);
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Header: hide on scroll down, show on scroll up
(function() {
  var header = document.querySelector('.header');
  if (!header) return;

  var lastScrollY = 0;
  var ticking = false;

  // Offset header below announcement bar
  var announcementBar = document.querySelector('.announcement-bar');
  var barHeight = announcementBar ? announcementBar.offsetHeight : 0;

  // Set initial position immediately so logo/cart are visible on load
  header.style.top = barHeight + 'px';
  document.documentElement.style.setProperty('--sticky-top', (barHeight + header.offsetHeight + 40) + 'px');

  function onScroll() {
    var currentScrollY = window.scrollY;

    // Slide header up as announcement bar scrolls away
    var offset = Math.max(0, barHeight - currentScrollY);
    header.style.top = offset + 'px';

    var headerHidden = currentScrollY > 80 && currentScrollY > lastScrollY;
    if (headerHidden) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }

    // Sync product info sticky top with header position
    var stickyTop = headerHidden ? 40 : (offset + header.offsetHeight + 40);
    document.documentElement.style.setProperty('--sticky-top', stickyTop + 'px');

    // Only toggle solid bg on pages without a hero (product pages start solid)
    var isAlwaysSolid = !document.querySelector('.hero');
    if (currentScrollY > 50 || isAlwaysSolid) {
      header.classList.add('header--solid');
    } else {
      header.classList.remove('header--solid');
    }

    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', function() {
    if (!ticking) {
      requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
})();

// Science accordion toggle
(function() {
  var headers = document.querySelectorAll('.science__accordion-header');
  headers.forEach(function(header) {
    header.addEventListener('click', function() {
      var accordion = header.parentElement;
      var isOpen = accordion.classList.contains('science__accordion--open');

      // Close all
      document.querySelectorAll('.science__accordion').forEach(function(a) {
        a.classList.remove('science__accordion--open');
        var body = a.querySelector('.science__accordion-body');
        if (body) body.style.display = 'none';
      });

      // Toggle clicked one
      if (!isOpen) {
        accordion.classList.add('science__accordion--open');
        var body = accordion.querySelector('.science__accordion-body');
        if (body) body.style.display = 'block';
      }
    });
  });

  // Initialize: hide closed accordion bodies
  document.querySelectorAll('.science__accordion').forEach(function(a) {
    if (!a.classList.contains('science__accordion--open')) {
      var body = a.querySelector('.science__accordion-body');
      if (body) body.style.display = 'none';
    }
  });
})();

// Product description accordion toggle
(function() {
  var headers = document.querySelectorAll('.product-accordion__header');
  headers.forEach(function(header) {
    header.addEventListener('click', function() {
      var expanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', !expanded);
      var body = header.nextElementSibling;
      if (body) body.style.display = expanded ? 'none' : 'block';
    });
  });
})();

// (Product gallery thumbnail + arrow logic moved to bottom of file)

// Purchase option toggle (subscribe vs one-time)
(function() {
  var options = document.querySelectorAll('.purchase-option');
  if (!options.length) return;

  options.forEach(function(option) {
    option.addEventListener('click', function() {
      options.forEach(function(o) { o.classList.remove('active'); });
      option.classList.add('active');
      var radio = option.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;
    });
  });

  // Frequency selector
  var freqBtns = document.querySelectorAll('.frequency-selector__btn');
  freqBtns.forEach(function(btn) {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation();
      freqBtns.forEach(function(b) { b.classList.remove('active'); });
      btn.classList.add('active');
    });
  });
})();

// Quantity selector (product pages)
(function() {
  var qtyInput = document.getElementById('productQty');
  var minus = document.getElementById('qtyMinus');
  var plus = document.getElementById('qtyPlus');

  if (!qtyInput || !minus || !plus) return;

  minus.addEventListener('click', function() {
    var val = parseInt(qtyInput.value, 10) || 1;
    if (val > 1) qtyInput.value = val - 1;
  });

  plus.addEventListener('click', function() {
    var val = parseInt(qtyInput.value, 10) || 1;
    var max = parseInt(qtyInput.max, 10) || 10;
    if (val < max) qtyInput.value = val + 1;
  });

  qtyInput.addEventListener('change', function() {
    var val = parseInt(qtyInput.value, 10);
    var min = parseInt(qtyInput.min, 10) || 1;
    var max = parseInt(qtyInput.max, 10) || 10;
    if (isNaN(val) || val < min) qtyInput.value = min;
    if (val > max) qtyInput.value = max;
  });
})();

// 10% Off Popup — minimalist email signup
(function() {
  var overlay = document.getElementById('popupOverlay');
  if (!overlay) return;
  var closeBtn = document.getElementById('popupClose');
  var dismissBtn = document.getElementById('popupDismiss');
  var emailInput = document.getElementById('popupEmail');
  var emailSubmit = document.getElementById('popupEmailSubmit');

  if (sessionStorage.getItem('atlas_popup_dismissed')) return;

  setTimeout(function() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }, 3000);

  function closePopup() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    sessionStorage.setItem('atlas_popup_dismissed', '1');
  }

  closeBtn.addEventListener('click', closePopup);
  dismissBtn.addEventListener('click', closePopup);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closePopup();
  });

  if (emailSubmit) {
    emailSubmit.addEventListener('click', function() {
      var email = emailInput.value.trim();
      if (email && email.indexOf('@') > -1) {
        emailSubmit.textContent = 'Code: ATLAS10';
        emailSubmit.style.background = '#22c55e';
        emailSubmit.style.color = '#fff';
        setTimeout(closePopup, 2500);
      } else {
        emailInput.style.borderColor = '#ef4444';
        emailInput.focus();
        setTimeout(function() { emailInput.style.borderColor = ''; }, 1500);
      }
    });
    emailInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') emailSubmit.click();
    });
  }
})();

// Why Atlas cards — mouse-follow glow effect
(function() {
  var cards = document.querySelectorAll('.why-atlas__card');
  cards.forEach(function(card) {
    card.addEventListener('mousemove', function(e) {
      var rect = card.getBoundingClientRect();
      var x = ((e.clientX - rect.left) / rect.width * 100).toFixed(1);
      var y = ((e.clientY - rect.top) / rect.height * 100).toFixed(1);
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
    });
  });
})();

// Easter egg — double-click logo for confetti
(function() {
  var logoLink = document.querySelector('.header__logo');
  if (!logoLink) return;
  var colors = ['#e85d75', '#F5A623', '#22c55e', '#3b82f6', '#a855f7', '#ffffff'];
  var messages = [
    'Stay hydrated, legend.',
    'You found the secret. Now drink water.',
    'Atlas approves this curiosity.',
    '1,769mg of easter egg detected.'
  ];

  logoLink.addEventListener('dblclick', function(e) {
    e.preventDefault();
    // Confetti burst
    for (var i = 0; i < 60; i++) {
      var piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = (Math.random() * 100) + 'vw';
      piece.style.background = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = (Math.random() * 0.8) + 's';
      piece.style.animationDuration = (1.5 + Math.random() * 2) + 's';
      piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
      piece.style.width = (5 + Math.random() * 8) + 'px';
      piece.style.height = (5 + Math.random() * 8) + 'px';
      document.body.appendChild(piece);
      setTimeout(function(p) { p.remove(); }.bind(null, piece), 4000);
    }
    // Toast message
    var toast = document.createElement('div');
    toast.className = 'easter-egg-toast';
    toast.textContent = messages[Math.floor(Math.random() * messages.length)];
    document.body.appendChild(toast);
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { toast.classList.add('active'); });
    });
    setTimeout(function() {
      toast.classList.remove('active');
      setTimeout(function() { toast.remove(); }, 500);
    }, 2500);
  });
})();

// Patriotic "Made in USA" hover — bald eagle flies across
(function() {
  var usaEls = document.querySelectorAll('.js-usa-hover');
  usaEls.forEach(function(el) {
    var active = false;
    el.addEventListener('mouseenter', function() {
      if (active) return;
      active = true;

      // SVG bald eagle that flies across
      var eagle = document.createElement('div');
      eagle.className = 'usa-eagle';
      eagle.innerHTML = '<svg viewBox="0 0 120 80" width="120" height="80" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<g>' +
        // Body
        '<ellipse cx="60" cy="48" rx="18" ry="14" fill="#3B2314"/>' +
        // White head
        '<circle cx="72" cy="36" r="11" fill="#FFFFFF"/>' +
        // Eye
        '<circle cx="76" cy="34" r="2" fill="#1a1a1a"/>' +
        // Beak
        '<polygon points="83,36 92,38 83,40" fill="#F5A623"/>' +
        // Left wing (spread)
        '<path d="M52 44 Q30 20 5 12 Q10 22 18 30 Q8 24 2 18 Q10 32 22 38 Q14 36 6 30 Q16 40 32 44 Z" fill="#3B2314"/>' +
        // Right wing (spread)
        '<path d="M68 44 Q78 24 98 10 Q92 22 86 28 Q94 20 102 14 Q92 30 82 36 Q90 32 100 26 Q88 38 76 44 Z" fill="#3B2314"/>' +
        // Tail feathers
        '<path d="M42 52 Q30 58 20 68 Q32 62 38 56 Q28 64 22 72 Q34 64 42 58 Z" fill="#3B2314"/>' +
        // White tail tips
        '<path d="M22 66 Q18 72 20 68" stroke="#fff" stroke-width="2"/>' +
        '<path d="M24 70 Q20 76 22 72" stroke="#fff" stroke-width="2"/>' +
        // Feet/talons
        '<path d="M54 60 L50 70 L48 68 M50 70 L52 68" stroke="#F5A623" stroke-width="1.5" fill="none"/>' +
        '<path d="M64 60 L66 70 L64 68 M66 70 L68 68" stroke="#F5A623" stroke-width="1.5" fill="none"/>' +
        '</g></svg>';
      document.body.appendChild(eagle);

      // Red-white-blue star burst from the element
      var rect = el.getBoundingClientRect();
      var cx = rect.left + rect.width / 2;
      var cy = rect.top + rect.height / 2;
      var patriotColors = ['#B22234', '#FFFFFF', '#3C3B6E'];
      for (var i = 0; i < 24; i++) {
        var star = document.createElement('div');
        star.className = 'usa-star';
        var angle = (Math.PI * 2 / 24) * i;
        var dist = 40 + Math.random() * 80;
        star.style.setProperty('--tx', (Math.cos(angle) * dist) + 'px');
        star.style.setProperty('--ty', (Math.sin(angle) * dist) - 30 + 'px');
        star.style.left = cx + 'px';
        star.style.top = cy + 'px';
        star.style.background = patriotColors[i % 3];
        star.style.animationDelay = (Math.random() * 0.15) + 's';
        document.body.appendChild(star);
        setTimeout(function(s) { s.remove(); }.bind(null, star), 1200);
      }

      setTimeout(function() { eagle.remove(); active = false; }, 2500);
    });
  });
})();

// FAQ accordion toggle
(function() {
  var questions = document.querySelectorAll('.product-faq__question');
  questions.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.parentElement;
      var isOpen = item.classList.contains('open');
      // Close all
      document.querySelectorAll('.product-faq__item').forEach(function(i) {
        i.classList.remove('open');
      });
      // Toggle clicked
      if (!isOpen) {
        item.classList.add('open');
      }
    });
  });
})();

// Subtle WebGL-style particle animation in header
(function() {
  var canvas = document.getElementById('headerCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var count = 30;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function create() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.2,
      vy: (Math.random() - 0.5) * 0.1,
      r: Math.random() * 1.2 + 0.3,
      o: Math.random() * 0.15 + 0.03
    };
  }

  function init() {
    resize();
    for (var i = 0; i < count; i++) particles.push(create());
    animate();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -5 || p.x > canvas.width + 5) p.vx *= -1;
      if (p.y < -5 || p.y > canvas.height + 5) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, ' + p.o + ')';
      ctx.fill();
    }
    // Draw subtle connections
    for (var a = 0; a < particles.length; a++) {
      for (var b = a + 1; b < particles.length; b++) {
        var dx = particles[a].x - particles[b].x;
        var dy = particles[a].y - particles[b].y;
        var dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.strokeStyle = 'rgba(255, 255, 255, ' + (0.03 * (1 - dist / 100)) + ')';
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
})();

// Subtle WebGL-style hydration animation in hero
(function() {
  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var drops = [];
  var bubbles = [];
  var time = 0;

  function resize() {
    canvas.width = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }

  function createDrop() {
    return {
      x: Math.random() * canvas.width,
      y: -10,
      speed: Math.random() * 0.3 + 0.1,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.08 + 0.02,
      drift: (Math.random() - 0.5) * 0.15
    };
  }

  function createBubble() {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      speed: Math.random() * 0.2 + 0.05,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.06 + 0.01,
      wobble: Math.random() * Math.PI * 2
    };
  }

  function init() {
    resize();
    for (var i = 0; i < 40; i++) {
      var d = createDrop();
      d.y = Math.random() * canvas.height;
      drops.push(d);
    }
    for (var j = 0; j < 12; j++) {
      var b = createBubble();
      b.y = Math.random() * canvas.height;
      bubbles.push(b);
    }
    animate();
  }

  function animate() {
    time += 0.01;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Subtle flowing water drops
    for (var i = 0; i < drops.length; i++) {
      var d = drops[i];
      d.y += d.speed;
      d.x += d.drift + Math.sin(time + i) * 0.05;
      if (d.y > canvas.height + 10) {
        drops[i] = createDrop();
        continue;
      }
      ctx.beginPath();
      ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(150, 200, 255, ' + d.opacity + ')';
      ctx.fill();
    }

    // Rising bubbles
    for (var j = 0; j < bubbles.length; j++) {
      var b = bubbles[j];
      b.y -= b.speed;
      b.x += Math.sin(time * 2 + b.wobble) * 0.3;
      if (b.y < -10) {
        bubbles[j] = createBubble();
        continue;
      }
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(180, 220, 255, ' + b.opacity + ')';
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }

    // Subtle wave lines
    ctx.beginPath();
    for (var x = 0; x < canvas.width; x += 4) {
      var y1 = canvas.height * 0.7 + Math.sin(x * 0.008 + time) * 20 + Math.sin(x * 0.015 + time * 1.5) * 10;
      if (x === 0) ctx.moveTo(x, y1);
      else ctx.lineTo(x, y1);
    }
    ctx.strokeStyle = 'rgba(150, 200, 255, 0.03)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    for (var x2 = 0; x2 < canvas.width; x2 += 4) {
      var y2 = canvas.height * 0.5 + Math.sin(x2 * 0.006 + time * 0.7) * 25 + Math.sin(x2 * 0.012 + time * 1.2) * 12;
      if (x2 === 0) ctx.moveTo(x2, y2);
      else ctx.lineTo(x2, y2);
    }
    ctx.strokeStyle = 'rgba(150, 200, 255, 0.02)';
    ctx.stroke();

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
})();

// Flavor selector → purchase option border color matching
(function() {
  var FLAVOR_COLORS = {
    'strawberry': { color: 'rgba(232, 93, 117, 0.5)', shadow: 'rgba(232, 93, 117, 0.12)' },
    'grapefruit': { color: 'rgba(245, 166, 35, 0.5)', shadow: 'rgba(245, 166, 35, 0.12)' }
  };

  function updatePurchaseColors() {
    var active = document.querySelector('.flavor-circle.active');
    if (!active) return;
    var options = active.closest('.featured-product__info, .product-hero__info');
    if (!options) options = document;
    var purchaseOptions = options.querySelectorAll('.purchase-options');
    if (!purchaseOptions.length) purchaseOptions = document.querySelectorAll('.purchase-options');

    var flavor = null;
    if (active.classList.contains('flavor-circle--strawberry')) flavor = 'strawberry';
    else if (active.classList.contains('flavor-circle--grapefruit')) flavor = 'grapefruit';

    var colors = FLAVOR_COLORS[flavor];
    if (!colors) return;

    purchaseOptions.forEach(function(container) {
      container.style.setProperty('--flavor-color', colors.color);
      container.style.setProperty('--flavor-shadow', colors.shadow);
    });
  }

  // Run on load
  updatePurchaseColors();

  // Flavor data for sticky bar switching
  var STICKY_FLAVORS = {
    'strawberry': {
      name: 'Strawberry Lemonade',
      price: '$29.99',
      product: 'strawberry-lemonade',
      btnText: 'Buy Now',
      cssClass: 'sticky-buy--strawberry',
      thumb: 'https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_e4b7eae7-01d9-430c-9655-7949d910deb6.jpg?v=1771507844'
    },
    'grapefruit': {
      name: 'Grapefruit',
      price: '$29.99',
      product: 'grapefruit',
      btnText: 'Buy Now',
      tag: 'Pre-Order',
      cssClass: 'sticky-buy--grapefruit',
      thumb: 'https://cdn.shopify.com/s/files/1/0595/8133/3578/files/1_1a252c57-dc62-4c7b-a6b1-0f9677ce6b6f.jpg?v=1769181320'
    }
  };

  function updateStickyBar(flavor) {
    var bar = document.getElementById('stickyBuy');
    var data = STICKY_FLAVORS[flavor];
    if (!bar || !data) return;

    // Swap color class
    bar.className = bar.className.replace(/sticky-buy--(?:strawberry|lemon-lime|grapefruit)/g, '');
    bar.classList.add(data.cssClass);

    // Update content
    var nameEl = document.getElementById('stickyBuyName');
    var priceEl = document.getElementById('stickyBuyPrice');
    var thumbEl = document.getElementById('stickyBuyThumb');
    var btnEl = document.getElementById('stickyBuyBtn');
    if (nameEl) nameEl.textContent = data.name;
    if (priceEl) priceEl.textContent = data.price;
    if (thumbEl) { thumbEl.src = data.thumb; thumbEl.alt = data.name; }
    if (btnEl) { btnEl.textContent = data.btnText; btnEl.setAttribute('data-product', data.product); }

    // Show/hide pre-order tag
    var tagEl = bar.querySelector('.sticky-buy__tag');
    if (data.tag) {
      if (!tagEl) {
        tagEl = document.createElement('span');
        tagEl.className = 'sticky-buy__tag';
        var infoEl = bar.querySelector('.sticky-buy__info');
        if (infoEl) infoEl.insertBefore(tagEl, priceEl);
      }
      tagEl.textContent = data.tag;
    } else if (tagEl) {
      tagEl.remove();
    }

    // Update active flavor dot
    bar.querySelectorAll('.sticky-buy__flavor-dot').forEach(function(dot) {
      dot.classList.toggle('active', dot.getAttribute('data-sticky-flavor') === flavor);
    });

    // Also sync the main flavor circles if they exist
    var mainCircle = document.querySelector('.flavor-circle--' + flavor);
    if (mainCircle && !mainCircle.classList.contains('active')) {
      document.querySelectorAll('.flavor-circle').forEach(function(c) { c.classList.remove('active'); });
      mainCircle.classList.add('active');
      updatePurchaseColors();
    }
  }

  // Sticky bar flavor dot click handler
  document.querySelectorAll('.sticky-buy__flavor-dot').forEach(function(dot) {
    dot.addEventListener('click', function() {
      var flavor = dot.getAttribute('data-sticky-flavor');
      if (flavor) updateStickyBar(flavor);
    });
  });

  // Update when flavor circles are clicked (for SPA-style switching)
  document.querySelectorAll('.flavor-circle').forEach(function(circle) {
    circle.addEventListener('click', function() {
      document.querySelectorAll('.flavor-circle').forEach(function(c) { c.classList.remove('active'); });
      circle.classList.add('active');
      updatePurchaseColors();

      // Update sticky bar on landing page
      var flavor = null;
      if (circle.classList.contains('flavor-circle--strawberry')) flavor = 'strawberry';
      else if (circle.classList.contains('flavor-circle--grapefruit')) flavor = 'grapefruit';
      if (flavor) updateStickyBar(flavor);
    });
  });
})();

// Ingredient popup for science accordions
(function() {
  var INGREDIENT_DATA = {
    electrolytes: {
      title: 'Electrolytes',
      dose: '1,300mg Total',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2C10 6 6 10 6 14a6 6 0 1012 0c0-4-4-8-6-12z"/></svg>',
      items: [
        { name: 'Sodium', form: 'as Sodium Citrate', dose: '600mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>', desc: 'Essential for fluid balance, nerve signaling, and preventing dehydration during exercise.', link: 'blog/sodium-science.html' },
        { name: 'Potassium', form: 'as Potassium Citrate', dose: '500mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>', desc: 'Supports muscle contractions, heart rhythm, and helps regulate cellular fluid balance.', link: 'blog/potassium-heart.html' },
        { name: 'Magnesium', form: 'as Magnesium Citrate', dose: '200mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>', desc: 'Vital for muscle recovery, energy production, and reducing cramps and fatigue.', link: 'blog/magnesium-deficiency.html' }
      ]
    },
    vitamins: {
      title: 'Vitamins',
      dose: '116mg Total',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      items: [
        { name: 'Vitamin C', form: 'Ascorbic Acid', dose: '90mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/></svg>', desc: 'Powerful antioxidant that supports immune function and aids muscle recovery.', link: 'blog/vitamin-c-immunity.html' },
        { name: 'Vitamin B3', form: 'as Niacin', dose: '24mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12h8"/></svg>', desc: 'Converts food into energy and supports cardiovascular health.', link: 'blog/b-vitamins-energy.html' },
        { name: 'Vitamin B5', form: 'as Pantethine', dose: '12mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>', desc: 'Supports adrenal function, stress response, and energy metabolism.', link: 'blog/b-vitamins-energy.html' },
        { name: 'Vitamin B6', form: 'as Pyridoxal-5-phosphate', dose: '2mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', desc: 'Aids neurotransmitter synthesis and energy metabolism from protein.', link: 'blog/b-vitamins-energy.html' },
        { name: 'Vitamin B12', form: 'as Methylcobalamin', dose: '8mcg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>', desc: 'Boosts natural energy levels, supports nerve function, and aids red blood cell formation.', link: 'blog/b-vitamins-energy.html' }
      ]
    },
    amino: {
      title: 'Amino Acids',
      dose: '1,200mg Total',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
      items: [
        { name: 'L-Glutamine', form: '', dose: '1,000mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>', desc: 'The most abundant amino acid in the body. Supports gut health, immune function, and muscle recovery after intense exercise.', link: 'blog/glutamine-recovery.html' },
        { name: 'L-Taurine', form: '', dose: '200mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>', desc: 'Supports cardiovascular function, exercise performance, and helps regulate hydration at the cellular level.', link: 'blog/taurine-endurance.html' }
      ]
    }
  };

  var overlay = document.getElementById('ingredientPopupOverlay');
  if (!overlay) return;

  var closeBtn = document.getElementById('ingredientPopupClose');
  var titleEl = document.getElementById('ingredientPopupTitle');
  var doseEl = document.getElementById('ingredientPopupDose');
  var badgeEl = document.getElementById('ingredientPopupBadge');
  var gridEl = document.getElementById('ingredientPopupGrid');

  // Bind science accordions on landing page
  var accordions = document.querySelectorAll('.science__accordion[data-popup]');
  accordions.forEach(function(acc) {
    acc.addEventListener('click', function(e) {
      e.preventDefault();
      var key = acc.getAttribute('data-popup');
      var data = INGREDIENT_DATA[key];
      if (!data) return;
      openIngredientPopup(data);
    });
  });

  function openIngredientPopup(data) {
    titleEl.textContent = data.title;
    doseEl.textContent = data.dose;
    badgeEl.innerHTML = data.icon;

    var html = '';
    for (var i = 0; i < data.items.length; i++) {
      var item = data.items[i];
      var basePath = window.location.pathname.indexOf('/products/') !== -1 ? '../' : '';
      var tag = item.link ? 'a' : 'div';
      var linkAttr = item.link ? ' href="' + basePath + item.link + '"' : '';
      html += '<' + tag + ' class="ingredient-popup__card"' + linkAttr + '>' +
        '<div class="ingredient-popup__card-icon">' + item.icon + '</div>' +
        '<div class="ingredient-popup__card-content">' +
          '<div class="ingredient-popup__card-top">' +
            '<span class="ingredient-popup__card-name">' + item.name + '</span>' +
            (item.form ? '<span class="ingredient-popup__card-form">' + item.form + '</span>' : '') +
            '<span class="ingredient-popup__card-dose">' + item.dose + '</span>' +
          '</div>' +
          '<p class="ingredient-popup__card-desc">' + item.desc + '</p>' +
          (item.link ? '<div class="ingredient-popup__card-link">Learn more <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></div>' : '') +
        '</div>' +
      '</' + tag + '>';
    }
    gridEl.innerHTML = html;

    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeIngredientPopup() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  closeBtn.addEventListener('click', closeIngredientPopup);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeIngredientPopup();
  });
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && overlay.classList.contains('active')) closeIngredientPopup();
  });
})();

// Supplement facts — ingredient detail panel on hover
(function() {
  var rows = document.querySelectorAll('.sf-row--hoverable[data-ingredient]');
  var panel = document.getElementById('sfDetailPanel');
  if (!rows.length || !panel) return;

  var defaultView = panel.querySelector('.sf-detail-panel__default');
  var contentView = panel.querySelector('.sf-detail-panel__content');
  var nameEl = panel.querySelector('.sf-detail-panel__name');
  var doseEl = panel.querySelector('.sf-detail-panel__dose');
  var descEl = panel.querySelector('.sf-detail-panel__desc');
  var listEl = panel.querySelector('.sf-detail-panel__list');

  var ingredientData = {
    sodium: {
      name: 'Sodium',
      dose: '600mg',
      desc: 'Delivered as Sodium Citrate and Pink Himalayan Salt for optimal bioavailability. Sodium is the primary electrolyte lost in sweat and critical for hydration.',
      effects: [
        'Regulates fluid balance between cells and blood plasma',
        'Enables nerve impulse transmission for muscle contractions',
        'Drives intestinal absorption of water and glucose',
        'Prevents hyponatremia during prolonged exercise'
      ],
      goodFor: ['Hydration', 'Endurance', 'Nerve Function']
    },
    magnesium: {
      name: 'Magnesium',
      dose: '200mg',
      desc: 'Provided as Magnesium Malate — one of the most bioavailable forms. Magnesium is involved in over 300 enzymatic reactions in the body.',
      effects: [
        'Supports ATP energy production at the cellular level',
        'Relaxes smooth and skeletal muscle fibers, reducing cramps',
        'Regulates nervous system signaling and stress response',
        'Contributes to bone density and cardiovascular function'
      ],
      goodFor: ['Muscle Recovery', 'Energy', 'Sleep']
    },
    potassium: {
      name: 'Potassium',
      dose: '500mg',
      desc: 'Delivered as Potassium Citrate for gentle absorption. Works alongside sodium to maintain your body\'s electrical gradient.',
      effects: [
        'Maintains cellular membrane potential for heart rhythm',
        'Counterbalances sodium to regulate blood pressure',
        'Prevents muscle cramps and supports contraction strength',
        'Aids kidney function and fluid balance'
      ],
      goodFor: ['Heart Health', 'Cramp Prevention', 'Blood Pressure']
    },
    vitaminb3: {
      name: 'Vitamin B3 (Niacin)',
      dose: '24mg — 150% DV',
      desc: 'Niacin is essential for converting food into cellular energy. It supports over 400 enzymatic reactions as a precursor to NAD+.',
      effects: [
        'Converts carbohydrates, fats, and proteins into usable energy',
        'Supports healthy cholesterol metabolism',
        'Promotes DNA repair and cellular signaling',
        'Enhances skin barrier function and circulation'
      ],
      goodFor: ['Energy', 'Cholesterol', 'Skin Health']
    },
    vitaminb5: {
      name: 'Vitamin B5 (Pantothenic Acid)',
      dose: '5mg — 100% DV',
      desc: 'A key component of Coenzyme A (CoA), which is involved in fatty acid synthesis, energy metabolism, and hormone production.',
      effects: [
        'Essential for synthesis of Coenzyme A (CoA)',
        'Metabolizes fats and carbohydrates for energy',
        'Supports adrenal gland function and stress hormones',
        'Aids in red blood cell production'
      ],
      goodFor: ['Metabolism', 'Stress Response', 'Hormones']
    },
    vitaminb6: {
      name: 'Vitamin B6 (P-5-P)',
      dose: '2mg — 118% DV',
      desc: 'Provided as Pyridoxal-5-phosphate (P5P), the bioactive form that bypasses liver conversion. Critical for amino acid metabolism.',
      effects: [
        'Metabolizes amino acids for muscle protein synthesis',
        'Produces serotonin, dopamine, and GABA neurotransmitters',
        'Supports hemoglobin production for oxygen transport',
        'Regulates homocysteine levels for cardiovascular health'
      ],
      goodFor: ['Brain Health', 'Mood', 'Muscle Growth']
    },
    vitaminb12: {
      name: 'Vitamin B12',
      dose: '8mcg — 333% DV',
      desc: 'Premium Methylcobalamin form — the most bioavailable B12 that requires no conversion by the body. Essential for energy and nervous system health.',
      effects: [
        'Forms red blood cells that carry oxygen to muscles',
        'Maintains myelin sheath protecting nerve fibers',
        'Required for DNA synthesis during cell division',
        'Prevents megaloblastic anemia and chronic fatigue'
      ],
      goodFor: ['Energy', 'Focus', 'Nervous System']
    },
    vitaminc: {
      name: 'Vitamin C',
      dose: '90mg — 100% DV',
      desc: 'Ascorbic Acid — a powerful antioxidant that neutralizes free radicals generated during exercise and supports immune defense.',
      effects: [
        'Neutralizes exercise-induced oxidative stress',
        'Stimulates white blood cell production and function',
        'Required for collagen synthesis in joints and skin',
        'Enhances iron absorption from plant-based foods'
      ],
      goodFor: ['Immunity', 'Skin & Joints', 'Antioxidant Protection']
    },
    glutamine: {
      name: 'L-Glutamine',
      dose: '1,000mg',
      desc: 'The most abundant amino acid in muscle tissue. Glutamine stores are rapidly depleted during intense exercise, making supplementation critical for recovery.',
      effects: [
        'Fuels rapidly dividing immune cells post-exercise',
        'Maintains intestinal barrier integrity (gut health)',
        'Prevents muscle protein breakdown during stress',
        'Supports glycogen replenishment after training'
      ],
      goodFor: ['Gut Health', 'Recovery', 'Immune Support']
    },
    alanine: {
      name: 'L-Alanine',
      dose: '200mg',
      desc: 'A glucogenic amino acid that plays a key role in the glucose-alanine cycle between muscles and the liver during exercise.',
      effects: [
        'Transports nitrogen from muscles to liver for detox',
        'Provides substrate for gluconeogenesis (new glucose)',
        'Buffers acid buildup in muscles during high intensity',
        'Supports stable blood sugar during prolonged activity'
      ],
      goodFor: ['Endurance', 'Blood Sugar', 'Detox']
    }
  };

  rows.forEach(function(row) {
    row.addEventListener('mouseenter', function() {
      var key = row.getAttribute('data-ingredient');
      var data = ingredientData[key];
      if (!data) return;

      nameEl.textContent = data.name;
      doseEl.textContent = data.dose;
      descEl.textContent = data.desc;
      listEl.innerHTML = '';
      data.effects.forEach(function(effect) {
        var li = document.createElement('li');
        li.textContent = effect;
        listEl.appendChild(li);
      });

      // Good For section
      var goodForEl = panel.querySelector('.sf-detail-panel__goodfor');
      if (goodForEl && data.goodFor) {
        var gfHtml = '';
        data.goodFor.forEach(function(item) {
          gfHtml += '<span class="sf-detail-panel__goodfor-tag">' + item + '</span>';
        });
        goodForEl.querySelector('.sf-detail-panel__goodfor-tags').innerHTML = gfHtml;
        goodForEl.style.display = 'block';
      }

      defaultView.style.display = 'none';
      contentView.style.display = 'block';
    });

    row.addEventListener('mouseleave', function() {
      defaultView.style.display = '';
      contentView.style.display = 'none';
    });
  });

  // Mobile: tap ingredient row to open bottom sheet
  var sheet = document.getElementById('ingredientSheet');
  var sheetOverlay = document.getElementById('ingredientSheetOverlay');
  if (sheet && sheetOverlay) {
    var sheetName = document.getElementById('sheetName');
    var sheetDose = document.getElementById('sheetDose');
    var sheetDesc = document.getElementById('sheetDesc');
    var sheetEffects = document.getElementById('sheetEffects');
    var sheetTags = document.getElementById('sheetTags');

    function openSheet(data) {
      sheetName.textContent = data.name;
      sheetDose.textContent = data.dose;
      sheetDesc.textContent = data.desc;
      sheetEffects.innerHTML = '';
      data.effects.forEach(function(effect) {
        var li = document.createElement('li');
        li.textContent = effect;
        sheetEffects.appendChild(li);
      });
      sheetTags.innerHTML = '';
      if (data.goodFor) {
        data.goodFor.forEach(function(tag) {
          var span = document.createElement('span');
          span.className = 'ingredient-sheet__tag';
          span.textContent = tag;
          sheetTags.appendChild(span);
        });
      }
      sheet.classList.add('active');
      sheetOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeSheet() {
      sheet.classList.remove('active');
      sheetOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }

    rows.forEach(function(row) {
      row.addEventListener('click', function() {
        if (window.innerWidth > 768) return;
        var key = row.getAttribute('data-ingredient');
        var data = ingredientData[key];
        if (data) openSheet(data);
      });
    });

    sheetOverlay.addEventListener('click', closeSheet);

    // Swipe down to dismiss
    var sheetStartY = 0, sheetDeltaY = 0, sheetDragging = false;
    sheet.addEventListener('touchstart', function(e) {
      sheetStartY = e.touches[0].clientY;
      sheetDragging = true;
      sheet.style.transition = 'none';
    });
    sheet.addEventListener('touchmove', function(e) {
      if (!sheetDragging) return;
      sheetDeltaY = e.touches[0].clientY - sheetStartY;
      if (sheetDeltaY > 0) {
        sheet.style.transform = 'translateY(' + sheetDeltaY + 'px)';
      }
    });
    sheet.addEventListener('touchend', function() {
      sheetDragging = false;
      sheet.style.transition = '';
      if (sheetDeltaY > 80) {
        closeSheet();
      }
      sheet.style.transform = '';
      sheetDeltaY = 0;
    });
  }
})();

// Global subtle water background animation
(function() {
  var canvas = document.getElementById('globalWaterCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var time = 0;
  var particles = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 0.5,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: Math.random() * -0.1 - 0.02,
      opacity: Math.random() * 0.04 + 0.01,
      phase: Math.random() * Math.PI * 2
    };
  }

  function init() {
    resize();
    for (var i = 0; i < 50; i++) {
      particles.push(createParticle());
    }
    animate();
  }

  function animate() {
    time += 0.005;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Flowing wave lines across the viewport
    for (var w = 0; w < 3; w++) {
      ctx.beginPath();
      var yBase = canvas.height * (0.3 + w * 0.2);
      for (var x = 0; x < canvas.width; x += 6) {
        var y = yBase + Math.sin(x * 0.004 + time * (0.5 + w * 0.3)) * 40 + Math.sin(x * 0.008 + time * (0.8 + w * 0.2)) * 20;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(100, 170, 230, ' + (0.015 - w * 0.003) + ')';
      ctx.lineWidth = 1;
      ctx.stroke();
    }

    // Floating particles
    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.speedX + Math.sin(time + p.phase) * 0.1;
      p.y += p.speedY;
      if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100, 170, 230, ' + p.opacity + ')';
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
})();

// Science accordion dose count-up on scroll
(function() {
  var doses = document.querySelectorAll('.science__accordion-dose');
  if (!doses.length) return;

  var animated = false;

  function parseNum(text) {
    return parseInt(text.replace(/[^0-9]/g, ''), 10);
  }

  function formatNum(n, hasComma) {
    if (hasComma && n >= 1000) return n.toLocaleString();
    return n.toString();
  }

  function animateDoses() {
    doses.forEach(function(el) {
      var text = el.textContent.trim();
      var suffix = text.replace(/[0-9,]/g, '');
      var target = parseNum(text);
      var hasComma = text.indexOf(',') > -1;
      var duration = 2500;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        // Smooth ease-out-quart for a gentle landing
        var eased = 1 - Math.pow(1 - progress, 4);
        var current = Math.floor(eased * target);
        el.textContent = formatNum(current, hasComma) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = formatNum(target, hasComma) + suffix;
      }

      el.textContent = '0' + suffix;
      requestAnimationFrame(step);
    });
  }

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting && !animated) {
        animated = true;
        animateDoses();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  var scienceSection = document.querySelector('.science__right');
  if (scienceSection) observer.observe(scienceSection);
})();

// Hydration ripple hover on science accordions
(function() {
  var accordions = document.querySelectorAll('.science__accordion');
  accordions.forEach(function(acc) {
    acc.addEventListener('mouseenter', function() {
      acc.classList.add('science__accordion--ripple');
    });
    acc.addEventListener('mouseleave', function() {
      acc.classList.remove('science__accordion--ripple');
    });
  });
})();

// Interactive Comparison Table
(function() {
  var section = document.querySelector('.compare');
  if (!section) return;

  // --- Data ---
  var BRANDS = {
    lmnt:  { name: 'LMNT',       cls: 'compare__th-brand--lmnt',  logo: 'images/logos/lmnt.svg' },
    liv:   { name: 'Liquid I.V.', cls: 'compare__th-brand--liv',   logo: 'images/logos/liquid-iv.svg' },
    wb:    { name: 'WaterBoy',    cls: 'compare__th-brand--wb',    logo: 'images/logos/waterboy.svg' },
    drip:  { name: 'DripDrop',    cls: 'compare__th-brand--drip',  logo: 'images/logos/dripdrop.svg' },
    nuun:  { name: 'Nuun',        cls: 'compare__th-brand--nuun',  logo: 'images/logos/nuun.svg' }
  };

  var CATS = [
    {
      key: 'electrolytes', label: 'Electrolytes', unit: 'mg', atlas: 1769,
      lmnt: 1260, liv: 930, wb: 1540, drip: 1330, nuun: 900, lowerBetter: false,
      subs: {
        Sodium:    { atlas: 600, lmnt: 1000, liv: 500, wb: 950, drip: 330, nuun: 300 },
        Potassium: { atlas: 500, lmnt: 200,  liv: 380, wb: 390, drip: 400, nuun: 150 },
        Magnesium: { atlas: 200, lmnt: 60,   liv: 50,  wb: 200, drip: 0,   nuun: 25  },
        Chloride:  { atlas: 469, lmnt: 0,    liv: 0,   wb: 0,   drip: 600, nuun: 425 }
      }
    },
    {
      key: 'vitaminb', label: 'Vitamin B', unit: 'mg', atlas: 38,
      lmnt: 0, liv: 36, wb: 0, drip: 0, nuun: 0, lowerBetter: false,
      subs: {
        'B3 (Niacin)': { atlas: 24, lmnt: 0, liv: 30, wb: 0, drip: 0, nuun: 0 },
        'B5':          { atlas: 5,  lmnt: 0, liv: 3,  wb: 0, drip: 0, nuun: 0 },
        'B6':          { atlas: 2,  lmnt: 0, liv: 3,  wb: 0, drip: 0, nuun: 0 },
        'B12 (mcg)':   { atlas: 8,  lmnt: 0, liv: 0,  wb: 0, drip: 0, nuun: 0 }
      }
    },
    {
      key: 'vitaminc', label: 'Vitamin C', unit: 'mg', atlas: 90,
      lmnt: 0, liv: 62, wb: 0, drip: 0, nuun: 0, lowerBetter: false
    },
    {
      key: 'aminos', label: 'Amino Acids', unit: 'mg', atlas: 1200,
      lmnt: 0, liv: 0, wb: 0, drip: 0, nuun: 0, lowerBetter: false,
      subs: {
        'L-Glutamine': { atlas: 1000, lmnt: 0, liv: 0, wb: 0, drip: 0, nuun: 0 },
        'L-Alanine':   { atlas: 200,  lmnt: 0, liv: 0, wb: 0, drip: 0, nuun: 0 }
      }
    },
    {
      key: 'sugar', label: 'Sugar', unit: 'g', atlas: 0,
      lmnt: 0, liv: 11, wb: 0, drip: 6, nuun: 1, lowerBetter: true
    }
  ];

  // --- State ---
  var activeBrands = ['lmnt', 'liv', 'wb'];

  // --- Elements ---
  var thead = document.getElementById('compareHead');
  var tbody = document.getElementById('compareBody');
  var modal = document.getElementById('compareModal');
  var breakdownClose = document.getElementById('breakdownClose');
  var modalBackdrop = document.getElementById('modalBackdrop');

  // --- Brand toggles ---
  document.getElementById('brandToggles').addEventListener('click', function(e) {
    var btn = e.target.closest('.compare__toggle');
    if (!btn) return;
    btn.classList.toggle('active');
    activeBrands = [];
    document.querySelectorAll('#brandToggles .compare__toggle.active').forEach(function(b) {
      activeBrands.push(b.dataset.brand);
    });
    render();
  });

  // --- Render table ---
  function render() {
    section.classList.remove('animated');

    var headHTML = '<th></th><th class="compare__th-atlas"><img src="logo.svg" alt="Atlas" height="20"></th>';
    activeBrands.forEach(function(b) {
      var brand = BRANDS[b];
      headHTML += '<th class="compare__th-logo"><img src="' + brand.logo + '" alt="' + brand.name + '" width="60" height="20" class="compare__brand-logo" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'inline\'"><span class="compare__th-brand ' + brand.cls + '" style="display:none">' + brand.name + '</span></th>';
    });
    thead.innerHTML = headHTML;

    var atlasWins = 0;
    var totalCats = CATS.length;

    var bodyHTML = '';
    CATS.forEach(function(cat) {
      // Determine if Atlas wins this row
      var isWinner = true;
      activeBrands.forEach(function(b) {
        var val = cat[b];
        if (cat.lowerBetter) {
          if (val < cat.atlas) isWinner = false;
        } else {
          if (val > cat.atlas) isWinner = false;
        }
      });
      if (isWinner) atlasWins++;

      var winBadge = isWinner ? '<span class="compare__win-badge">Winner</span>' : '';

      bodyHTML += '<tr data-cat="' + cat.key + '">';
      bodyHTML += '<td class="compare__label">' + cat.label + '</td>';
      bodyHTML += '<td class="compare__value compare__value--atlas"><div class="compare__bar" style="--bar-width:100%"><strong>' + fmtVal(cat.atlas, cat.unit) + '</strong>' + winBadge + '</div></td>';

      activeBrands.forEach(function(b) {
        var val = cat[b];
        if (val === 0 && !cat.lowerBetter) {
          bodyHTML += '<td class="compare__value"><span class="compare__zero">&mdash;</span></td>';
        } else if (cat.key === 'sugar' && val > 0) {
          bodyHTML += '<td class="compare__value"><span class="compare__sugar-bad">' + fmtVal(val, cat.unit) + '</span></td>';
        } else if (cat.key === 'sugar' && val === 0) {
          bodyHTML += '<td class="compare__value"><div class="compare__check"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg> ' + fmtVal(val, cat.unit) + '</div></td>';
        } else {
          var pct = cat.atlas === 0 ? 100 : Math.min(100, (val / cat.atlas) * 100);
          bodyHTML += '<td class="compare__value"><div class="compare__bar" style="--bar-width:' + Math.round(pct) + '%">' + fmtVal(val, cat.unit) + '</div></td>';
        }
      });
      bodyHTML += '</tr>';
    });

    // Score summary row
    bodyHTML += '<tr class="compare__score-row">';
    bodyHTML += '<td class="compare__label" style="color:rgba(255,255,255,0.3);font-size:var(--text-xs);text-transform:uppercase;letter-spacing:0.1em;">Categories Won</td>';
    bodyHTML += '<td class="compare__value compare__value--atlas"><span class="compare__score-atlas">' + atlasWins + '/' + totalCats + '</span></td>';
    activeBrands.forEach(function(b) {
      var bWins = 0;
      CATS.forEach(function(cat) {
        var val = cat[b];
        var atlasVal = cat.atlas;
        var wins = cat.lowerBetter ? (val < atlasVal) : (val > atlasVal);
        if (wins) bWins++;
      });
      bodyHTML += '<td class="compare__value"><span class="compare__score-rival">' + bWins + '/' + totalCats + '</span></td>';
    });
    bodyHTML += '</tr>';

    tbody.innerHTML = bodyHTML;
    requestAnimationFrame(function() {
      requestAnimationFrame(function() { section.classList.add('animated'); });
    });
  }

  function fmtVal(val, unit) {
    return (val >= 1000 ? val.toLocaleString() : val) + (unit ? ' ' + unit.toUpperCase() : '');
  }

  function getCat(key) {
    for (var i = 0; i < CATS.length; i++) { if (CATS[i].key === key) return CATS[i]; }
    return null;
  }

  // --- Row click → modal ---
  tbody.addEventListener('click', function(e) {
    var tr = e.target.closest('tr');
    if (!tr) return;
    var catKey = tr.dataset.cat;
    if (!catKey || activeBrands.length === 0) return;

    var td = e.target.closest('td');
    var cellIndex = td ? Array.from(tr.children).indexOf(td) : -1;
    var brandIndex = cellIndex - 2;
    var rivalKey = (brandIndex >= 0 && brandIndex < activeBrands.length) ? activeBrands[brandIndex] : activeBrands[0];

    openModal(catKey, rivalKey);
  });

  // Close modal
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  breakdownClose.addEventListener('click', closeModal);
  modalBackdrop.addEventListener('click', closeModal);
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modal.getAttribute('aria-hidden') === 'false') closeModal();
  });

  function openModal(catKey, rivalKey) {
    var cat = getCat(catKey);
    var rival = BRANDS[rivalKey];
    var av = cat.atlas;
    var rv = cat[rivalKey];
    var maxVal = Math.max(av, rv, 1);

    document.getElementById('breakdownRival').textContent = rival.name;
    document.getElementById('breakdownCat').textContent = cat.label;
    document.getElementById('breakdownAtlasVal').textContent = fmtVal(av, cat.unit);
    document.getElementById('breakdownRivalName').textContent = rival.name;
    document.getElementById('breakdownRivalVal').textContent = fmtVal(rv, cat.unit);

    var atlasBar = document.getElementById('breakdownAtlasBar');
    var rivalBar = document.getElementById('breakdownRivalBar');
    atlasBar.style.width = '0';
    rivalBar.style.width = '0';

    // Show modal
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Animate bars after transition starts
    setTimeout(function() {
      atlasBar.style.width = ((av / maxVal) * 100) + '%';
      rivalBar.style.width = ((rv / maxVal) * 100) + '%';
    }, 80);

    // Verdict
    var badge = document.getElementById('breakdownBadge');
    var detail = document.getElementById('breakdownDetail');
    var atlasWins = cat.lowerBetter ? av < rv : av > rv;
    var isTie = av === rv;

    badge.className = 'compare-modal__badge';
    if (isTie) {
      badge.textContent = 'Tie';
      badge.classList.add('compare-modal__badge--tie');
      detail.textContent = 'Both deliver ' + fmtVal(av, cat.unit) + ' of ' + cat.label.toLowerCase() + '.';
    } else if (atlasWins) {
      badge.textContent = 'Atlas Wins';
      badge.classList.add('compare-modal__badge--win');
      if (cat.lowerBetter) {
        detail.textContent = 'Atlas has ' + (rv === 0 ? 'zero' : fmtVal(rv - av, cat.unit) + ' less') + ' ' + cat.label.toLowerCase() + ' than ' + rival.name + '.';
      } else if (rv === 0) {
        detail.textContent = rival.name + ' has no ' + cat.label.toLowerCase() + '. Atlas delivers ' + fmtVal(av, cat.unit) + '.';
      } else {
        var pct = Math.round(((av - rv) / rv) * 100);
        detail.textContent = 'Atlas delivers ' + pct + '% more (' + fmtVal(av, cat.unit) + ' vs ' + fmtVal(rv, cat.unit) + ').';
      }
    } else {
      badge.textContent = rival.name + ' Leads';
      badge.classList.add('compare-modal__badge--lose');
      if (cat.lowerBetter) {
        detail.textContent = rival.name + ' has ' + fmtVal(rv, cat.unit) + ' vs Atlas\u2019s ' + fmtVal(av, cat.unit) + '.';
      } else {
        var pct = Math.round(((rv - av) / av) * 100);
        detail.textContent = rival.name + ' has ' + pct + '% more (' + fmtVal(rv, cat.unit) + ' vs ' + fmtVal(av, cat.unit) + ').';
      }
    }

    // Sub-ingredients
    var subsEl = document.getElementById('breakdownSubs');
    if (cat.subs) {
      var html = '<h4>Ingredient Breakdown</h4>';
      Object.keys(cat.subs).forEach(function(sk) {
        var sa = cat.subs[sk].atlas;
        var sr = cat.subs[sk][rivalKey];
        var sm = Math.max(sa, sr, 1);
        html += '<div class="compare__sub-row"><span class="compare__sub-label">' + sk + '</span><div class="compare__sub-tracks"><div class="compare__sub-track"><div class="compare__sub-fill compare__sub-fill--atlas" style="width:0" data-w="' + ((sa / sm) * 100) + '%"></div></div><div class="compare__sub-track"><div class="compare__sub-fill compare__sub-fill--rival" style="width:0" data-w="' + ((sr / sm) * 100) + '%"></div></div></div><div class="compare__sub-vals"><span class="compare__sub-val compare__sub-val--atlas">' + sa + '</span><span class="compare__sub-val compare__sub-val--rival">' + sr + '</span></div></div>';
      });
      subsEl.innerHTML = html;
      subsEl.style.display = 'block';
      setTimeout(function() {
        subsEl.querySelectorAll('.compare__sub-fill').forEach(function(bar) {
          bar.style.width = bar.dataset.w;
        });
      }, 120);
    } else {
      subsEl.style.display = 'none';
    }
  }

  // --- Water wave background ---
  var canvas = document.createElement('canvas');
  canvas.className = 'compare__canvas';
  section.insertBefore(canvas, section.firstChild);
  var ctx = canvas.getContext('2d');
  var waveTime = 0;

  function resizeCanvas() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }

  function animateWaves() {
    waveTime += 0.008;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var w = 0; w < 4; w++) {
      ctx.beginPath();
      var yBase = canvas.height * (0.2 + w * 0.2);
      for (var x = 0; x < canvas.width; x += 5) {
        var y = yBase + Math.sin(x * 0.005 + waveTime * (0.4 + w * 0.15)) * 30 + Math.sin(x * 0.01 + waveTime * (0.6 + w * 0.1)) * 15;
        if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(100, 170, 230, ' + (0.04 - w * 0.008) + ')';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
    requestAnimationFrame(animateWaves);
  }

  resizeCanvas();
  animateWaves();
  window.addEventListener('resize', resizeCanvas);

  // Initial render
  render();
})();

// ========================================
// Animated Section Backgrounds
// ========================================
(function() {
  var BLUE = { r: 64, g: 160, b: 220 };

  // Shared: create canvas for a section
  function addCanvas(selector) {
    var el = document.querySelector(selector);
    if (!el) return null;
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    var c = document.createElement('canvas');
    c.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
    el.insertBefore(c, el.firstChild);
    // Ensure content sits above canvas
    Array.from(el.children).forEach(function(child) {
      if (child !== c && getComputedStyle(child).position === 'static') {
        child.style.position = 'relative';
        child.style.zIndex = '1';
      }
    });
    var ctx = c.getContext('2d');
    function resize() {
      c.width = el.offsetWidth * (window.devicePixelRatio || 1);
      c.height = el.offsetHeight * (window.devicePixelRatio || 1);
      c.style.width = el.offsetWidth + 'px';
      c.style.height = el.offsetHeight + 'px';
      ctx.setTransform(window.devicePixelRatio || 1, 0, 0, window.devicePixelRatio || 1, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize);
    return { canvas: c, ctx: ctx, el: el, w: function() { return el.offsetWidth; }, h: function() { return el.offsetHeight; }, resize: resize };
  }

  // Only animate when section is near viewport
  function onVisible(el, cb) {
    var active = false;
    var obs = new IntersectionObserver(function(entries) {
      active = entries[0].isIntersecting;
    }, { rootMargin: '200px' });
    obs.observe(el);
    function loop(t) {
      if (active) cb(t);
      requestAnimationFrame(loop);
    }
    requestAnimationFrame(loop);
  }

  // --- 1. Hero: DNA Helix (light strands on dark #0a1628) ---
  (function() {
    var s = addCanvas('.hero');
    if (!s) return;
    var alpha = 0.08;
    onVisible(s.el, function(t) {
      var w = s.w(), h = s.h();
      s.resize();
      var time = t * 0.0004;
      var helixCount = 4;
      var spacing = w / (helixCount + 1);
      for (var hi = 0; hi < helixCount; hi++) {
        var cx = spacing * (hi + 1);
        var amp = 35 + hi * 8;
        var phase = hi * 2.1;
        var steps = 70;
        // Rungs
        for (var i = 0; i < steps; i++) {
          if (i % 4 !== 0) continue;
          var yy = (i / steps) * (h + 40) - 20;
          var tt = (i / steps) * Math.PI * 6 + time + phase;
          var x1 = cx + Math.sin(tt) * amp;
          var x2 = cx + Math.sin(tt + Math.PI) * amp;
          var depth = (Math.cos(tt) + 1) * 0.5;
          s.ctx.beginPath();
          s.ctx.moveTo(x1, yy);
          s.ctx.lineTo(x2, yy);
          s.ctx.strokeStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + (alpha * 0.4 * depth) + ')';
          s.ctx.lineWidth = 1;
          s.ctx.stroke();
        }
        // Strands
        for (var strand = 0; strand < 2; strand++) {
          s.ctx.beginPath();
          for (var i = 0; i < steps; i++) {
            var yy = (i / steps) * (h + 40) - 20;
            var tt = (i / steps) * Math.PI * 6 + time + phase;
            var xx = cx + Math.sin(tt + strand * Math.PI) * amp;
            if (i === 0) s.ctx.moveTo(xx, yy); else s.ctx.lineTo(xx, yy);
          }
          s.ctx.strokeStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + alpha + ')';
          s.ctx.lineWidth = 1.2;
          s.ctx.stroke();
        }
      }
    });
  })();

  // --- 2. Science: Water Molecules (on #f5f5f5) ---
  (function() {
    var s = addCanvas('.science');
    if (!s) return;
    var alpha = 0.07;
    var molecules = [];
    for (var i = 0; i < 14; i++) {
      molecules.push({
        x: Math.random() * 1400, y: Math.random() * 800,
        vx: (Math.random() - 0.5) * 0.25, vy: (Math.random() - 0.5) * 0.25,
        rot: Math.random() * Math.PI * 2, rotSpd: (Math.random() - 0.5) * 0.002,
        sc: 0.5 + Math.random() * 0.5
      });
    }
    function drawMol(ctx, x, y, rot, sc) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.scale(sc, sc);
      var bl = 28, a = 52.25 * Math.PI / 180;
      var hx1 = -Math.sin(a) * bl, hy1 = -Math.cos(a) * bl;
      var hx2 = Math.sin(a) * bl, hy2 = -Math.cos(a) * bl;
      ctx.beginPath(); ctx.moveTo(hx1, hy1); ctx.lineTo(0, 0); ctx.lineTo(hx2, hy2);
      ctx.strokeStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + (alpha * 0.7) + ')';
      ctx.lineWidth = 2; ctx.stroke();
      // Oxygen
      ctx.beginPath(); ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + (alpha * 0.5) + ')';
      ctx.fill();
      ctx.strokeStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + alpha + ')';
      ctx.lineWidth = 1.5; ctx.stroke();
      // Hydrogens
      [[hx1, hy1], [hx2, hy2]].forEach(function(p) {
        ctx.beginPath(); ctx.arc(p[0], p[1], 4.5, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + (alpha * 0.3) + ')';
        ctx.fill();
        ctx.strokeStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + (alpha * 0.8) + ')';
        ctx.lineWidth = 1.2; ctx.stroke();
      });
      ctx.restore();
    }
    onVisible(s.el, function() {
      var w = s.w(), h = s.h();
      s.resize();
      molecules.forEach(function(m) {
        m.x += m.vx; m.y += m.vy; m.rot += m.rotSpd;
        if (m.x < -60) m.x = w + 60; if (m.x > w + 60) m.x = -60;
        if (m.y < -60) m.y = h + 60; if (m.y > h + 60) m.y = -60;
        drawMol(s.ctx, m.x, m.y, m.rot, m.sc);
      });
      // Hydrogen bonds
      for (var i = 0; i < molecules.length; i++) {
        for (var j = i + 1; j < molecules.length; j++) {
          var dx = molecules[i].x - molecules[j].x;
          var dy = molecules[i].y - molecules[j].y;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            s.ctx.beginPath(); s.ctx.setLineDash([4, 6]);
            s.ctx.moveTo(molecules[i].x, molecules[i].y);
            s.ctx.lineTo(molecules[j].x, molecules[j].y);
            s.ctx.strokeStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + (alpha * 0.25 * (1 - dist / 140)) + ')';
            s.ctx.lineWidth = 1; s.ctx.stroke(); s.ctx.setLineDash([]);
          }
        }
      }
    });
  })();

  // --- 3. Testimonials: Hydration Bubbles (on #f5f5f5) ---
  (function() {
    var s = addCanvas('.testimonials');
    if (!s) return;
    var alpha = 0.06;
    var bubbles = [];
    for (var i = 0; i < 25; i++) {
      bubbles.push({
        x: Math.random() * 1400, y: Math.random() * 600,
        r: 4 + Math.random() * 20,
        speed: 0.12 + Math.random() * 0.3,
        wobAmp: 10 + Math.random() * 18,
        wobFreq: 0.5 + Math.random() * 1.2,
        phase: Math.random() * Math.PI * 2
      });
    }
    onVisible(s.el, function(t) {
      var w = s.w(), h = s.h();
      s.resize();
      var time = t * 0.001;
      bubbles.forEach(function(b) {
        b.y -= b.speed;
        if (b.y < -b.r * 2) { b.y = h + b.r * 2; b.x = Math.random() * w; }
        var bx = b.x + Math.sin(time * b.wobFreq + b.phase) * b.wobAmp;
        var sa = 0.3 + (1 - b.r / 24) * 0.7;
        // Glow
        s.ctx.beginPath(); s.ctx.arc(bx, b.y, b.r + 3, 0, Math.PI * 2);
        s.ctx.fillStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + (alpha * 0.12 * sa) + ')';
        s.ctx.fill();
        // Ring
        s.ctx.beginPath(); s.ctx.arc(bx, b.y, b.r, 0, Math.PI * 2);
        s.ctx.strokeStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + (alpha * sa) + ')';
        s.ctx.lineWidth = 1; s.ctx.stroke();
        // Highlight
        s.ctx.beginPath(); s.ctx.arc(bx - b.r * 0.25, b.y - b.r * 0.3, b.r * 0.2, 0, Math.PI * 2);
        s.ctx.fillStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + (alpha * 0.5 * sa) + ')';
        s.ctx.fill();
      });
    });
  })();

  // --- 4. Founder: Topographic Contours (on #f5f5f5) ---
  (function() {
    var s = addCanvas('.founder');
    if (!s) return;
    var alpha = 0.05;
    onVisible(s.el, function(t) {
      var w = s.w(), h = s.h();
      s.resize();
      var time = t * 0.00015;
      for (var li = 0; li < 10; li++) {
        s.ctx.beginPath();
        for (var x = 0; x < w; x += 4) {
          var n = Math.sin(x * 0.005 + time * 0.8 + li * 0.5) * 0.3
                + Math.sin(x * 0.012 - time * 0.5 + li * 1.2) * 0.2
                + Math.cos(x * 0.008 + time * 0.3 + li * 0.8) * 0.15 + 0.5;
          var y = h * (0.08 + 0.84 * (li / 10)) + n * 60 - 30;
          if (x === 0) s.ctx.moveTo(x, y); else s.ctx.lineTo(x, y);
        }
        s.ctx.strokeStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + (alpha * (0.5 + 0.5 * Math.sin(li * 0.7 + time))) + ')';
        s.ctx.lineWidth = 1;
        s.ctx.stroke();
      }
    });
  })();

  // --- 5. CTA Dark: Electrolyte Pulse Grid (on #0a0a0a) ---
  function initPulseGrid(selector, alpha) {
    var s = addCanvas(selector);
    if (!s) return;
    var cellSize = 50;
    onVisible(s.el, function(t) {
      var w = s.w(), h = s.h();
      s.resize();
      var time = t * 0.001;
      var cols = Math.ceil(w / cellSize) + 1;
      var rows = Math.ceil(h / cellSize) + 1;
      for (var r = 0; r <= rows; r++) {
        s.ctx.beginPath(); s.ctx.moveTo(0, r * cellSize); s.ctx.lineTo(w, r * cellSize);
        s.ctx.strokeStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + (alpha * 0.2) + ')';
        s.ctx.lineWidth = 0.5; s.ctx.stroke();
      }
      for (var c = 0; c <= cols; c++) {
        s.ctx.beginPath(); s.ctx.moveTo(c * cellSize, 0); s.ctx.lineTo(c * cellSize, h);
        s.ctx.strokeStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + (alpha * 0.2) + ')';
        s.ctx.lineWidth = 0.5; s.ctx.stroke();
      }
      for (var r = 0; r <= rows; r++) {
        for (var c = 0; c <= cols; c++) {
          var ix = c * cellSize, iy = r * cellSize;
          var dx = ix - w / 2, dy = iy - h / 2;
          var dist = Math.sqrt(dx * dx + dy * dy);
          var pulse = Math.sin(dist * 0.02 - time * 1.5) * 0.5 + 0.5;
          if (pulse > 0.15) {
            s.ctx.beginPath(); s.ctx.arc(ix, iy, 5 + pulse * 3, 0, Math.PI * 2);
            s.ctx.fillStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + (alpha * pulse * 0.25) + ')';
            s.ctx.fill();
            s.ctx.beginPath(); s.ctx.arc(ix, iy, 1.5 + pulse * 1, 0, Math.PI * 2);
            s.ctx.fillStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + (alpha * pulse) + ')';
            s.ctx.fill();
          }
        }
      }
    });
  }
  initPulseGrid('.cta-dark', 0.06);
  initPulseGrid('.cta-section', 0.06);

  // --- 6. Featured Product: Ocean Waves (on #ffffff) ---
  (function() {
    var s = addCanvas('.featured-product');
    if (!s) return;
    var alpha = 0.04;
    onVisible(s.el, function(t) {
      var w = s.w(), h = s.h();
      s.resize();
      var time = t * 0.0003;
      for (var wi = 0; wi < 6; wi++) {
        var baseY = h * 0.12 + (h * 0.76) * (wi / 5);
        var amp = 18 + Math.sin(wi * 0.8) * 10;
        var freq = 0.004 + wi * 0.0007;
        var speed = (wi % 2 === 0 ? 1 : -1) * (0.8 + wi * 0.12);
        s.ctx.beginPath();
        for (var x = -10; x <= w + 10; x += 4) {
          var y = baseY + Math.sin(x * freq + time * speed + wi) * amp + Math.sin(x * freq * 2.3 + time * speed * 0.7 + wi * 3) * amp * 0.3;
          if (x === -10) s.ctx.moveTo(x, y); else s.ctx.lineTo(x, y);
        }
        s.ctx.strokeStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + (alpha * (0.4 + 0.6 * Math.sin(wi * 0.5 + 0.5))) + ')';
        s.ctx.lineWidth = 1.2; s.ctx.stroke();
      }
    });
  })();

  // --- 7. Blog: DNA Helix (on #ffffff, subtle) ---
  (function() {
    var s = addCanvas('.blog');
    if (!s) return;
    var alpha = 0.04;
    onVisible(s.el, function(t) {
      var w = s.w(), h = s.h();
      s.resize();
      var time = t * 0.0004;
      var helixCount = 3;
      var spacing = w / (helixCount + 1);
      for (var hi = 0; hi < helixCount; hi++) {
        var cx = spacing * (hi + 1);
        var amp = 30 + hi * 6;
        var phase = hi * 2.1;
        var steps = 60;
        for (var i = 0; i < steps; i++) {
          if (i % 4 !== 0) continue;
          var yy = (i / steps) * (h + 40) - 20;
          var tt = (i / steps) * Math.PI * 6 + time + phase;
          var x1 = cx + Math.sin(tt) * amp;
          var x2 = cx + Math.sin(tt + Math.PI) * amp;
          var depth = (Math.cos(tt) + 1) * 0.5;
          s.ctx.beginPath(); s.ctx.moveTo(x1, yy); s.ctx.lineTo(x2, yy);
          s.ctx.strokeStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + (alpha * 0.35 * depth) + ')';
          s.ctx.lineWidth = 1; s.ctx.stroke();
        }
        for (var strand = 0; strand < 2; strand++) {
          s.ctx.beginPath();
          for (var i = 0; i < steps; i++) {
            var yy = (i / steps) * (h + 40) - 20;
            var tt = (i / steps) * Math.PI * 6 + time + phase;
            var xx = cx + Math.sin(tt + strand * Math.PI) * amp;
            if (i === 0) s.ctx.moveTo(xx, yy); else s.ctx.lineTo(xx, yy);
          }
          s.ctx.strokeStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + alpha + ')';
          s.ctx.lineWidth = 1; s.ctx.stroke();
        }
      }
    });
  })();

  // --- 8. Footer: Flowing particle constellation (on #1a1a1c) ---
  (function() {
    var s = addCanvas('.footer');
    if (!s) return;
    var alpha = 0.12;
    var particles = [];
    var count = 40;
    function initParticles() {
      particles = [];
      for (var i = 0; i < count; i++) {
        particles.push({
          x: Math.random(), y: Math.random(),
          vx: (Math.random() - 0.5) * 0.0003,
          vy: (Math.random() - 0.5) * 0.0003,
          r: 1.5 + Math.random() * 1.5
        });
      }
    }
    initParticles();
    onVisible(s.el, function(t) {
      var w = s.w(), h = s.h();
      s.resize();
      // Update particles
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        if (p.y < 0) p.y = 1; if (p.y > 1) p.y = 0;
      }
      // Draw connections
      for (var i = 0; i < particles.length; i++) {
        for (var j = i + 1; j < particles.length; j++) {
          var dx = (particles[i].x - particles[j].x) * w;
          var dy = (particles[i].y - particles[j].y) * h;
          var dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            var lineAlpha = alpha * (1 - dist / 120) * 0.5;
            s.ctx.beginPath();
            s.ctx.moveTo(particles[i].x * w, particles[i].y * h);
            s.ctx.lineTo(particles[j].x * w, particles[j].y * h);
            s.ctx.strokeStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + lineAlpha + ')';
            s.ctx.lineWidth = 0.5;
            s.ctx.stroke();
          }
        }
      }
      // Draw particles
      for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        s.ctx.beginPath();
        s.ctx.arc(p.x * w, p.y * h, p.r, 0, Math.PI * 2);
        s.ctx.fillStyle = 'rgba(' + BLUE.r + ',' + BLUE.g + ',' + BLUE.b + ',' + alpha + ')';
        s.ctx.fill();
      }
    });
  })();

})();

// Product page gallery — stacked (desktop) / swipeable carousel with arrows + thumbs (mobile)
(function() {
  var gallery = document.querySelector('.product-gallery--stacked');
  if (!gallery) return;

  var container = gallery.querySelector('.product-gallery__stacked-images');
  var imgs = gallery.querySelectorAll('.product-gallery__stacked-img');
  var dotsWrap = gallery.querySelector('.product-gallery__dots');
  var thumbsWrap = gallery.querySelector('.product-gallery__thumbs');
  var prevBtn = gallery.querySelector('.product-gallery__arrow--prev');
  var nextBtn = gallery.querySelector('.product-gallery__arrow--next');
  if (!container || !imgs.length) return;

  var currentIndex = 0;

  function goTo(index) {
    if (index < 0) index = 0;
    if (index >= imgs.length) index = imgs.length - 1;
    currentIndex = index;
    container.scrollTo({ left: index * container.offsetWidth, behavior: 'smooth' });
    updateActive(index);
  }

  function updateActive(index) {
    dots.forEach(function(d, i) { d.classList.toggle('active', i === index); });
    thumbImgs.forEach(function(t, i) { t.classList.toggle('active', i === index); });
  }

  // Build dot indicators
  imgs.forEach(function(_, i) {
    var dot = document.createElement('button');
    dot.className = 'product-gallery__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', 'Image ' + (i + 1));
    dot.addEventListener('click', function() { goTo(i); });
    dotsWrap.appendChild(dot);
  });

  // Build thumbnail strip
  imgs.forEach(function(slide, i) {
    var thumb = document.createElement('div');
    thumb.className = 'product-gallery__thumb-img' + (i === 0 ? ' active' : '');
    var img = slide.querySelector('img');
    if (img) {
      var thumbImg = document.createElement('img');
      thumbImg.src = img.src;
      thumbImg.alt = img.alt || '';
      thumbImg.loading = 'lazy';
      thumb.appendChild(thumbImg);
    }
    thumb.addEventListener('click', function() { goTo(i); });
    thumbsWrap.appendChild(thumb);
  });

  var dots = dotsWrap.querySelectorAll('.product-gallery__dot');
  var thumbImgs = thumbsWrap.querySelectorAll('.product-gallery__thumb-img');

  // Arrow navigation
  if (prevBtn) prevBtn.addEventListener('click', function() { goTo(currentIndex - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function() { goTo(currentIndex + 1); });

  // Track scroll position to sync dots/thumbs
  var scrollTimeout;
  container.addEventListener('scroll', function() {
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(function() {
      var index = Math.round(container.scrollLeft / container.offsetWidth);
      currentIndex = index;
      updateActive(index);
    }, 50);
  }, { passive: true });
})();

// Featured product gallery — main image + thumbnails (LMNT-style)
(function() {
  var gallery = document.querySelector('.fp-gallery');
  if (!gallery) return;

  var slides = gallery.querySelectorAll('.fp-gallery__slide');
  var thumbs = gallery.querySelectorAll('.fp-gallery__thumb');
  var prevBtn = gallery.querySelector('.fp-gallery__arrow--prev');
  var nextBtn = gallery.querySelector('.fp-gallery__arrow--next');
  if (!slides.length) return;

  var current = 0;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function(s) { s.classList.remove('active'); });
    slides[current].classList.add('active');
    thumbs.forEach(function(t) { t.classList.remove('active'); });
    if (thumbs[current]) thumbs[current].classList.add('active');
  }

  thumbs.forEach(function(thumb) {
    thumb.addEventListener('click', function() {
      goTo(parseInt(this.getAttribute('data-index')));
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); });

  // Touch swipe on main area
  var main = gallery.querySelector('.fp-gallery__main');
  var startX = 0, deltaX = 0, swiping = false;
  if (main) {
    main.addEventListener('touchstart', function(e) {
      startX = e.touches[0].clientX;
      swiping = true;
      deltaX = 0;
    }, { passive: true });
    main.addEventListener('touchmove', function(e) {
      if (!swiping) return;
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });
    main.addEventListener('touchend', function() {
      if (!swiping) return;
      swiping = false;
      if (deltaX > 50) goTo(current - 1);
      else if (deltaX < -50) goTo(current + 1);
    });
  }
})();

// Natural Flavors section — animate features on scroll
(function() {
  var features = document.querySelectorAll('.natural-flavors__feature');
  if (!features.length) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        var items = entry.target.querySelectorAll('.natural-flavors__feature');
        items.forEach(function(item, i) {
          setTimeout(function() {
            item.classList.add('animated');
          }, i * 150);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  var section = document.querySelector('.natural-flavors__features');
  if (section) observer.observe(section);
})();

// Sticky Buy Now bar — show after hero, hide on scroll down, show on scroll up
(function() {
  var bar = document.getElementById('stickyBuy');
  if (!bar) return;
  var shown = false;
  var lastScrollY = window.scrollY;
  var scrollingDown = false;

  function checkScroll() {
    var currentY = window.scrollY;
    var shouldShow = currentY > window.innerHeight * 0.6;
    var isDown = currentY > lastScrollY + 5;
    var isUp = currentY < lastScrollY - 5;

    if (shouldShow !== shown) {
      shown = shouldShow;
      if (shown) bar.classList.add('visible');
      else bar.classList.remove('visible');
    }

    if (shown) {
      if (isDown && !scrollingDown) {
        scrollingDown = true;
        bar.classList.add('sticky-buy--hidden');
      } else if (isUp && scrollingDown) {
        scrollingDown = false;
        bar.classList.remove('sticky-buy--hidden');
      }
    }

    lastScrollY = currentY;
  }
  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
})();
