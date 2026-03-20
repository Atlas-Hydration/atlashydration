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
    '.science__card, .science__ingredient-card, .how-it-works__step, .testimonial, .product-card, .sf-highlight, .mission__content, .mission__visual, .compare__table-wrap'
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

// Header background on scroll
(function() {
  var header = document.querySelector('.header');
  if (!header) return;

  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(10, 22, 40, 0.95)';
    } else {
      header.style.background = 'rgba(10, 22, 40, 0.85)';
    }
  }, { passive: true });
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

// Ingredient card expand/collapse toggles
(function() {
  var toggles = document.querySelectorAll('.science__ingredient-toggle');
  toggles.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var card = btn.closest('.science__ingredient-card');
      var detail = card.querySelector('.science__ingredient-detail');
      if (!detail) return;

      var expanded = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', !expanded);

      if (expanded) {
        detail.hidden = true;
        btn.firstChild.textContent = 'Learn More ';
      } else {
        detail.hidden = false;
        btn.firstChild.textContent = 'Show Less ';
      }
    });
  });
})();

// Product gallery (product pages)
(function() {
  var thumbs = document.querySelectorAll('.product-gallery__thumb');
  var slides = document.querySelectorAll('.product-gallery__slide');

  if (!thumbs.length || !slides.length) return;

  thumbs.forEach(function(thumb) {
    thumb.addEventListener('click', function() {
      var index = parseInt(thumb.getAttribute('data-thumb'), 10);

      // Update active thumb
      thumbs.forEach(function(t) { t.classList.remove('product-gallery__thumb--active'); });
      thumb.classList.add('product-gallery__thumb--active');

      // Update active slide
      slides.forEach(function(s) { s.classList.remove('product-gallery__slide--active'); });
      var target = document.querySelector('.product-gallery__slide[data-slide="' + index + '"]');
      if (target) target.classList.add('product-gallery__slide--active');
    });
  });
})();

// Hero canvas — subtle particle effect
(function() {
  var canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  var ctx = canvas.getContext('2d');
  var particles = [];
  var particleCount = 50;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    return {
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -Math.random() * 0.5 - 0.1,
      radius: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.3 + 0.05
    };
  }

  function init() {
    resize();
    for (var i = 0; i < particleCount; i++) {
      particles.push(createParticle());
    }
    animate();
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.y < -10 || p.x < -10 || p.x > canvas.width + 10) {
        particles[i] = createParticle();
        particles[i].y = canvas.height + 10;
      }

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(59, 130, 246, ' + p.opacity + ')';
      ctx.fill();
    }

    requestAnimationFrame(animate);
  }

  window.addEventListener('resize', resize);
  init();
})();
