/* ========================================
   Atlas Hydration — Main JS
   ======================================== */

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

// Header background on scroll (matte black)
(function() {
  var header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(30, 30, 30, 0.99)';
    } else {
      header.style.background = 'rgba(30, 30, 30, 0.97)';
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

// Product gallery thumbnail switching
(function() {
  var gallery = document.querySelector('.product-gallery');
  if (!gallery) return;

  var thumbs = gallery.querySelectorAll('.product-gallery__thumb');
  var slides = gallery.querySelectorAll('.product-gallery__slide');

  thumbs.forEach(function(thumb) {
    thumb.addEventListener('click', function() {
      var index = this.getAttribute('data-thumb');

      thumbs.forEach(function(t) { t.classList.remove('active'); });
      slides.forEach(function(s) { s.classList.remove('active'); });

      this.classList.add('active');
      var targetSlide = gallery.querySelector('.product-gallery__slide[data-slide="' + index + '"]');
      if (targetSlide) targetSlide.classList.add('active');
    });
  });
})();

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

// 10% Off Popup — 3 second delay, once per session
(function() {
  var overlay = document.getElementById('popupOverlay');
  if (!overlay) return;
  var closeBtn = document.getElementById('popupClose');
  var dismissBtn = document.getElementById('popupDismiss');
  var claimBtn = document.getElementById('popupClaim');
  var emailInput = document.getElementById('popupEmail');

  // Only show once per session
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

  claimBtn.addEventListener('click', function() {
    var email = emailInput.value.trim();
    if (email && email.indexOf('@') > -1) {
      claimBtn.textContent = 'Code: ATLAS10';
      claimBtn.style.background = '#22c55e';
      setTimeout(closePopup, 2500);
    } else {
      emailInput.style.outline = '2px solid #ef4444';
      emailInput.focus();
      setTimeout(function() { emailInput.style.outline = ''; }, 1500);
    }
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
