/* ========================================
   Atlas Hydration — SVG Animations
   Premium scroll-triggered SVG animations
   ======================================== */

(function() {
  'use strict';

  // ── Utility: IntersectionObserver wrapper ──
  function onReveal(selector, callback, options) {
    var els = document.querySelectorAll(selector);
    if (!els.length) return;
    var defaults = { threshold: 0.2, rootMargin: '0px 0px -60px 0px' };
    var opts = Object.assign({}, defaults, options);
    var observer = new IntersectionObserver(function(entries) {
      entries.forEach(function(entry) {
        if (entry.isIntersecting) {
          callback(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, opts);
    els.forEach(function(el) { observer.observe(el); });
  }

  // ── 1. Animated SVG Wave Dividers — Realistic Flowing Water ──
  function insertWaveDividers() {
    var waveSections = [
      { selector: '.hero', position: 'bottom', color: '#ffffff', id: 'wave-hero' },
      { selector: '.science', position: 'top', color: '#f5f5f5', id: 'wave-science-top' },
      { selector: '.science', position: 'bottom', color: '#ffffff', id: 'wave-science-bottom' },
      { selector: '.hydration-benefits', position: 'bottom', color: '#f7f7f5', id: 'wave-benefits' },
      { selector: '.electrolytes-daily', position: 'bottom', color: '#ffffff', id: 'wave-electrolytes' },
      { selector: '.founder', position: 'top', color: '#f5f5f5', id: 'wave-founder-top' },
      { selector: '.founder', position: 'bottom', color: '#ffffff', id: 'wave-founder-bottom' }
    ];

    waveSections.forEach(function(w) {
      var section = document.querySelector(w.selector);
      if (!section) return;
      if (section.querySelector('.svg-wave-divider--' + w.position)) return;

      // Container wraps overflow for the scrolling waves
      var wrapper = document.createElement('div');
      wrapper.className = 'svg-wave-divider svg-wave-divider--' + w.position;
      wrapper.id = w.id;
      wrapper.setAttribute('aria-hidden', 'true');

      // Three wave layers at different speeds/amplitudes for realistic water
      var layers = [
        { cls: 'wave-layer--1', opacity: 0.3, d: 'M0,30 C60,10 120,45 180,30 C240,15 300,50 360,30 C420,10 480,45 540,30 C600,15 660,50 720,30 C780,10 840,45 900,30 C960,15 1020,50 1080,30 C1140,10 1200,45 1260,30 C1320,15 1380,50 1440,30 L1440,80 L0,80 Z' },
        { cls: 'wave-layer--2', opacity: 0.5, d: 'M0,40 C80,25 160,55 240,40 C320,25 400,55 480,40 C560,25 640,55 720,40 C800,25 880,55 960,40 C1040,25 1120,55 1200,40 C1280,25 1360,55 1440,40 L1440,80 L0,80 Z' },
        { cls: 'wave-layer--3', opacity: 1.0, d: 'M0,50 C100,38 200,60 300,48 C400,36 500,58 600,48 C700,38 800,60 900,48 C1000,36 1100,58 1200,48 C1300,38 1400,60 1440,50 L1440,80 L0,80 Z' }
      ];

      layers.forEach(function(layer) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'wave-layer ' + layer.cls);
        // Double-wide viewBox so we can scroll half and loop seamlessly
        svg.setAttribute('viewBox', '0 0 2880 80');
        svg.setAttribute('preserveAspectRatio', 'none');

        // Duplicate the path: original 0-1440, copy shifted 1440-2880
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        // Build the duplicated path: first half + second half shifted by 1440
        var secondD = layer.d.replace(/L1440,80 L0,80 Z/, '');
        var shifted = secondD.replace(/(\d+\.?\d*)/g, function(match, num, offset, str) {
          // Only shift x-coordinates (every other number in the path)
          return match; // we'll use a cleaner approach
        });
        // Simpler: just concat two copies with a translate on the second path
        var p1 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p1.setAttribute('d', layer.d);
        p1.setAttribute('fill', w.color);
        p1.setAttribute('opacity', layer.opacity);

        var p2 = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        p2.setAttribute('d', layer.d);
        p2.setAttribute('fill', w.color);
        p2.setAttribute('opacity', layer.opacity);
        p2.setAttribute('transform', 'translate(1440, 0)');

        svg.appendChild(p1);
        svg.appendChild(p2);
        wrapper.appendChild(svg);
      });

      section.style.position = section.style.position || 'relative';
      if (w.position === 'top') {
        section.insertBefore(wrapper, section.firstChild);
      } else {
        section.appendChild(wrapper);
      }
    });
  }

  // ── 2. Floating Molecule SVGs in Science Section ──
  function insertScienceMolecules() {
    var science = document.querySelector('.science');
    if (!science || science.querySelector('.science-molecules')) return;

    var container = document.createElement('div');
    container.className = 'science-molecules';
    container.setAttribute('aria-hidden', 'true');

    var molecules = [
      // Water molecule (H2O)
      '<svg class="science-molecule science-molecule--1" viewBox="0 0 80 80" width="80" height="80"><circle cx="40" cy="28" r="12" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.12"/><circle cx="24" cy="52" r="8" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.12"/><circle cx="56" cy="52" r="8" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.12"/><line x1="33" y1="37" x2="27" y2="46" stroke="currentColor" stroke-width="1" opacity="0.1"/><line x1="47" y1="37" x2="53" y2="46" stroke="currentColor" stroke-width="1" opacity="0.1"/></svg>',
      // Sodium ion
      '<svg class="science-molecule science-molecule--2" viewBox="0 0 60 60" width="60" height="60"><circle cx="30" cy="30" r="20" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.1"/><circle cx="30" cy="30" r="8" fill="none" stroke="currentColor" stroke-width="1" opacity="0.08"/><text x="30" y="34" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.1" font-weight="600">Na+</text></svg>',
      // Potassium ion
      '<svg class="science-molecule science-molecule--3" viewBox="0 0 60 60" width="60" height="60"><circle cx="30" cy="30" r="22" fill="none" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" opacity="0.08"/><circle cx="30" cy="30" r="10" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.1"/><text x="30" y="34" text-anchor="middle" font-size="9" fill="currentColor" opacity="0.1" font-weight="600">K+</text></svg>',
      // Magnesium ion
      '<svg class="science-molecule science-molecule--4" viewBox="0 0 70 70" width="70" height="70"><circle cx="35" cy="35" r="18" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.1"/><circle cx="35" cy="35" r="26" fill="none" stroke="currentColor" stroke-width="0.8" stroke-dasharray="3 6" opacity="0.06"/><text x="35" y="39" text-anchor="middle" font-size="10" fill="currentColor" opacity="0.1" font-weight="600">Mg</text></svg>',
      // Water droplet
      '<svg class="science-molecule science-molecule--5" viewBox="0 0 40 50" width="40" height="50"><path d="M20 4 C16 12 8 20 8 30 a12 12 0 0024 0 C32 20 24 12 20 4z" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.1"/></svg>',
      // Hexagonal molecule
      '<svg class="science-molecule science-molecule--6" viewBox="0 0 60 60" width="60" height="60"><polygon points="30,5 52,17.5 52,42.5 30,55 8,42.5 8,17.5" fill="none" stroke="currentColor" stroke-width="1" opacity="0.07"/><polygon points="30,15 42,22.5 42,37.5 30,45 18,37.5 18,22.5" fill="none" stroke="currentColor" stroke-width="0.8" opacity="0.05"/></svg>'
    ];

    container.innerHTML = molecules.join('');
    science.style.position = 'relative';
    science.insertBefore(container, science.firstChild);
  }

  // ── 3. SVG Line-Draw Animations for Benefit Icons ──
  function setupLineDrawAnimations() {
    // Target the electrolytes-daily benefit icons
    onReveal('.ed__benefit-icon', function(el) {
      el.classList.add('svg-draw-active');
      var svgPaths = el.querySelectorAll('svg path, svg circle, svg line, svg polyline');
      svgPaths.forEach(function(path) {
        var length = path.getTotalLength ? path.getTotalLength() : 100;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.classList.add('svg-draw-path');
      });
    }, { threshold: 0.3 });

    // Also apply to science badges
    onReveal('.science__badge', function(el) {
      el.classList.add('svg-draw-active');
      var svgPaths = el.querySelectorAll('svg path, svg circle');
      svgPaths.forEach(function(path) {
        var length = path.getTotalLength ? path.getTotalLength() : 100;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.classList.add('svg-draw-path');
      });
    }, { threshold: 0.3 });

    // Hero benefit icons
    onReveal('.hero__benefit-icon', function(el) {
      el.classList.add('svg-draw-active');
      var svgPaths = el.querySelectorAll('svg path, svg circle');
      svgPaths.forEach(function(path) {
        var length = path.getTotalLength ? path.getTotalLength() : 100;
        path.style.strokeDasharray = length;
        path.style.strokeDashoffset = length;
        path.classList.add('svg-draw-path');
      });
    }, { threshold: 0.5 });
  }

  // ── 4. Animated Circular Progress Rings for Stat Cards ──
  function insertProgressRings() {
    var statCards = document.querySelectorAll('.ed__stat-card');
    if (!statCards.length) return;

    var ringData = [
      { percent: 75, color: '#1a3a5c' },   // 75% dehydrated
      { percent: 100, color: '#1a3a5c' },  // 1300mg = max
      { percent: 0, color: '#22c55e' },     // 0g sugar = 0% on gauge (good)
      { percent: 5, color: '#1a3a5c' }      // 5 calories
    ];

    statCards.forEach(function(card, i) {
      if (card.querySelector('.stat-ring')) return;
      var data = ringData[i] || { percent: 50, color: '#1a3a5c' };

      var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('class', 'stat-ring');
      svg.setAttribute('viewBox', '0 0 120 120');
      svg.setAttribute('aria-hidden', 'true');

      var circumference = 2 * Math.PI * 50;
      var offset = circumference - (data.percent / 100) * circumference;

      svg.innerHTML =
        '<circle class="stat-ring__bg" cx="60" cy="60" r="50" fill="none" stroke="#e5e5e5" stroke-width="3"/>' +
        '<circle class="stat-ring__fill" cx="60" cy="60" r="50" fill="none" stroke="' + data.color + '" stroke-width="4" stroke-linecap="round" stroke-dasharray="' + circumference + '" stroke-dashoffset="' + circumference + '" data-target-offset="' + offset + '" transform="rotate(-90 60 60)" opacity="0.25"/>';

      card.style.position = 'relative';
      card.insertBefore(svg, card.firstChild);
    });

    // Animate on scroll
    onReveal('.ed__stat-card', function(card) {
      var fill = card.querySelector('.stat-ring__fill');
      if (fill) {
        var targetOffset = fill.getAttribute('data-target-offset');
        fill.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
        requestAnimationFrame(function() {
          fill.setAttribute('stroke-dashoffset', targetOffset);
        });
      }
    }, { threshold: 0.4 });
  }

  // ── 5. Hero Section Animated SVG Particles ──
  function insertHeroParticles() {
    var hero = document.querySelector('.hero');
    if (!hero || hero.querySelector('.hero-particles')) return;

    var container = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    container.setAttribute('class', 'hero-particles');
    container.setAttribute('viewBox', '0 0 1440 800');
    container.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    container.setAttribute('aria-hidden', 'true');

    var particles = '';
    var shapes = [
      // Water droplets
      function(x, y, delay, dur) {
        return '<path class="hero-particle" d="M' + x + ' ' + (y - 8) + ' C' + (x - 3) + ' ' + (y - 2) + ' ' + (x - 5) + ' ' + (y + 3) + ' ' + x + ' ' + (y + 8) + ' C' + (x + 5) + ' ' + (y + 3) + ' ' + (x + 3) + ' ' + (y - 2) + ' ' + x + ' ' + (y - 8) + 'Z" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="1" style="animation-delay:' + delay + 's;animation-duration:' + dur + 's"/>';
      },
      // Small circles
      function(x, y, delay, dur) {
        return '<circle class="hero-particle" cx="' + x + '" cy="' + y + '" r="3" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="1" style="animation-delay:' + delay + 's;animation-duration:' + dur + 's"/>';
      },
      // Plus signs
      function(x, y, delay, dur) {
        return '<g class="hero-particle" style="animation-delay:' + delay + 's;animation-duration:' + dur + 's"><line x1="' + (x - 4) + '" y1="' + y + '" x2="' + (x + 4) + '" y2="' + y + '" stroke="rgba(255,255,255,0.1)" stroke-width="1"/><line x1="' + x + '" y1="' + (y - 4) + '" x2="' + x + '" y2="' + (y + 4) + '" stroke="rgba(255,255,255,0.1)" stroke-width="1"/></g>';
      }
    ];

    for (var i = 0; i < 20; i++) {
      var x = Math.random() * 1440;
      var y = Math.random() * 800;
      var delay = Math.random() * 8;
      var dur = 6 + Math.random() * 8;
      var shape = shapes[i % shapes.length];
      particles += shape(Math.round(x), Math.round(y), delay.toFixed(1), dur.toFixed(1));
    }

    container.innerHTML = particles;
    hero.appendChild(container);
  }

  // ── 6. Animated DNA-Helix SVG for Science Section ──
  function insertDNAHelix() {
    var scienceLeft = document.querySelector('.science__left');
    if (!scienceLeft || scienceLeft.querySelector('.dna-helix')) return;

    var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'dna-helix');
    svg.setAttribute('viewBox', '0 0 100 300');
    svg.setAttribute('aria-hidden', 'true');

    var helixPaths = '';
    for (var i = 0; i < 12; i++) {
      var y = i * 25 + 10;
      var x1 = 30 + 20 * Math.sin(i * 0.6);
      var x2 = 70 - 20 * Math.sin(i * 0.6);
      helixPaths += '<line x1="' + x1.toFixed(1) + '" y1="' + y + '" x2="' + x2.toFixed(1) + '" y2="' + y + '" stroke="currentColor" stroke-width="1" opacity="0.08" class="dna-rung" style="animation-delay:' + (i * 0.15) + 's"/>';
    }
    // Helix strands
    helixPaths += '<path d="M30,10 C30,35 70,60 70,85 C70,110 30,135 30,160 C30,185 70,210 70,235 C70,260 30,285 30,300" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.1" class="dna-strand dna-strand--1"/>';
    helixPaths += '<path d="M70,10 C70,35 30,60 30,85 C30,110 70,135 70,160 C70,185 30,210 30,235 C30,260 70,285 70,300" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.1" class="dna-strand dna-strand--2"/>';

    svg.innerHTML = helixPaths;
    scienceLeft.style.position = 'relative';
    scienceLeft.appendChild(svg);
  }

  // ── 7. Animated Section Eyebrow Underlines ──
  function setupEyebrowAnimations() {
    onReveal('.section-eyebrow', function(el) {
      el.classList.add('eyebrow-animated');
    }, { threshold: 0.8 });
  }

  // ── 8. Founder Section — Animated Compass & Plane SVGs ──
  function animateFounderIllustrations() {
    var founder = document.querySelector('.founder');
    if (!founder) return;

    onReveal('.founder', function() {
      var plane = founder.querySelector('.founder__illus--plane');
      var compass = founder.querySelector('.founder__illus--compass');
      if (plane) plane.classList.add('founder-illus-animate');
      if (compass) compass.classList.add('founder-illus-animate');
    }, { threshold: 0.2 });
  }

  // ── 9. Blog Card Hover SVG Arrow Animation ──
  function setupBlogCardAnimations() {
    var blogCards = document.querySelectorAll('.blog__card');
    blogCards.forEach(function(card) {
      // Add animated arrow SVG
      var arrow = document.createElement('div');
      arrow.className = 'blog__card-arrow';
      arrow.innerHTML = '<svg viewBox="0 0 40 40" width="40" height="40"><circle cx="20" cy="20" r="18" fill="none" stroke="currentColor" stroke-width="1.5" class="blog-arrow-circle"/><path d="M16 14l8 6-8 6" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      var content = card.querySelector('.blog__card-content');
      if (content && !card.querySelector('.blog__card-arrow')) {
        content.appendChild(arrow);
      }
    });
  }

  // ── 10. Comparison Table Row Animations ──
  function setupCompareAnimations() {
    // Animate table rows on scroll
    onReveal('.compare', function() {
      var rows = document.querySelectorAll('.compare__table tbody tr');
      rows.forEach(function(row, i) {
        row.style.animationDelay = (i * 0.1) + 's';
        row.classList.add('compare-row-animate');
      });
    }, { threshold: 0.15 });
  }

  // ── 11. Hydration Benefits Cards — Scroll Reveal with Stagger ──
  function setupBenefitCardAnimations() {
    var cards = document.querySelectorAll('.hb__card');
    cards.forEach(function(card, i) {
      card.classList.add('hb-card-reveal');
      card.style.transitionDelay = (i * 0.15) + 's';
    });

    onReveal('.hydration-benefits', function() {
      var cards = document.querySelectorAll('.hb__card');
      cards.forEach(function(card) {
        card.classList.add('hb-card-visible');
      });
    }, { threshold: 0.1 });
  }

  // ── 12. Accordion Pulse Ring on Hover ──
  function setupAccordionAnimations() {
    var accordions = document.querySelectorAll('.science__accordion');
    accordions.forEach(function(acc) {
      var header = acc.querySelector('.science__accordion-header');
      if (!header || header.querySelector('.accordion-pulse-ring')) return;

      var ring = document.createElement('div');
      ring.className = 'accordion-pulse-ring';
      ring.innerHTML = '<svg viewBox="0 0 50 50" width="50" height="50"><circle cx="25" cy="25" r="22" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.15"/><circle cx="25" cy="25" r="16" fill="none" stroke="currentColor" stroke-width="1" opacity="0.1" stroke-dasharray="4 4"><animateTransform attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="20s" repeatCount="indefinite"/></circle></svg>';
      header.style.position = 'relative';
      header.insertBefore(ring, header.firstChild);
    });
  }

  // ── Initialize All Animations ──
  function init() {
    insertWaveDividers();
    insertScienceMolecules();
    insertHeroParticles();
    insertDNAHelix();
    insertProgressRings();
    setupLineDrawAnimations();
    setupEyebrowAnimations();
    animateFounderIllustrations();
    setupBlogCardAnimations();
    setupCompareAnimations();
    setupBenefitCardAnimations();
    setupAccordionAnimations();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
