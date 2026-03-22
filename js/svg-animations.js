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

  // ── 1. WebGL Water Wave Dividers ──
  // Each section divider gets a <canvas> running a GLSL fragment shader
  // that renders realistic flowing, translucent water.

  var WAVE_VERT = [
    'attribute vec2 a_pos;',
    'void main() { gl_Position = vec4(a_pos, 0.0, 1.0); }'
  ].join('\n');

  var WAVE_FRAG = [
    'precision mediump float;',
    'uniform float u_time;',
    'uniform vec2  u_res;',
    'uniform vec3  u_color;',  // target fill color (section bg)
    'uniform float u_flip;',   // 1.0 = bottom, -1.0 = top
    '',
    '// Smooth noise hash',
    'float hash(vec2 p) {',
    '  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);',
    '}',
    '',
    '// Value noise',
    'float noise(vec2 p) {',
    '  vec2 i = floor(p);',
    '  vec2 f = fract(p);',
    '  f = f * f * (3.0 - 2.0 * f);',
    '  float a = hash(i);',
    '  float b = hash(i + vec2(1.0, 0.0));',
    '  float c = hash(i + vec2(0.0, 1.0));',
    '  float d = hash(i + vec2(1.0, 1.0));',
    '  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);',
    '}',
    '',
    'void main() {',
    '  vec2 uv = gl_FragCoord.xy / u_res;',
    '  float y = u_flip > 0.0 ? uv.y : 1.0 - uv.y;',
    '',
    '  // Build multiple wave layers',
    '  float t = u_time;',
    '  float wave = 0.0;',
    '',
    '  // Layer 1: broad, slow swell',
    '  wave += sin(uv.x * 6.0 + t * 1.5) * 0.12;',
    '  wave += sin(uv.x * 4.0 - t * 1.1 + 0.5) * 0.08;',
    '',
    '  // Layer 2: medium ripples',
    '  wave += sin(uv.x * 14.0 + t * 2.5 + 1.0) * 0.04;',
    '  wave += sin(uv.x * 10.0 - t * 1.8 + 2.0) * 0.05;',
    '',
    '  // Layer 3: fine surface detail via noise',
    '  wave += noise(vec2(uv.x * 8.0 + t * 0.8, t * 0.3)) * 0.06;',
    '  wave += noise(vec2(uv.x * 12.0 - t * 0.6, t * 0.5 + 5.0)) * 0.03;',
    '',
    '  // Wave threshold — position the water surface',
    '  float surface = 0.45 + wave;',
    '',
    '  // Soft edge (anti-alias the water line)',
    '  float edge = smoothstep(surface - 0.04, surface + 0.02, y);',
    '',
    '  // Water body with depth shading',
    '  float depth = smoothstep(surface, 0.0, y);',
    '',
    '  // Caustic / light ripple on the surface',
    '  float caustic = noise(vec2(uv.x * 20.0 + t * 1.2, y * 10.0 - t * 0.4));',
    '  caustic = smoothstep(0.4, 0.8, caustic) * 0.15;',
    '',
    '  // Fresnel-like highlight at the water line',
    '  float highlight = smoothstep(surface + 0.02, surface - 0.01, y);',
    '  highlight *= smoothstep(surface - 0.06, surface, y);',
    '  highlight *= 0.3 + caustic;',
    '',
    '  // Compose color: section bg color with water shading',
    '  vec3 waterTint = u_color * (0.92 + depth * 0.08 + caustic);',
    '  waterTint += highlight * vec3(0.12, 0.14, 0.16);',
    '',
    '  // Alpha: transparent above the wave, opaque below',
    '  float alpha = edge;',
    '',
    '  gl_FragColor = vec4(waterTint, alpha);',
    '}'
  ].join('\n');

  function createWaveGL(canvas, color, flip) {
    var gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false, antialias: true });
    if (!gl) return null;

    function compileShader(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.warn('Wave shader error:', gl.getShaderInfoLog(s));
        return null;
      }
      return s;
    }

    var vs = compileShader(gl.VERTEX_SHADER, WAVE_VERT);
    var fs = compileShader(gl.FRAGMENT_SHADER, WAVE_FRAG);
    if (!vs || !fs) return null;

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;

    gl.useProgram(prog);

    // Full-screen quad
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

    var aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    var uTime  = gl.getUniformLocation(prog, 'u_time');
    var uRes   = gl.getUniformLocation(prog, 'u_res');
    var uColor = gl.getUniformLocation(prog, 'u_color');
    var uFlip  = gl.getUniformLocation(prog, 'u_flip');

    // Parse hex color to 0-1 RGB
    var r = parseInt(color.substring(1,3), 16) / 255;
    var g = parseInt(color.substring(3,5), 16) / 255;
    var b = parseInt(color.substring(5,7), 16) / 255;

    gl.uniform3f(uColor, r, g, b);
    gl.uniform1f(uFlip, flip);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    return { gl: gl, uTime: uTime, uRes: uRes };
  }

  var waveInstances = [];

  function insertWaveDividers() {
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) return;

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
      if (section.querySelector('.wave-gl-divider--' + w.position)) return;

      var wrapper = document.createElement('div');
      wrapper.className = 'wave-gl-divider wave-gl-divider--' + w.position;
      wrapper.setAttribute('aria-hidden', 'true');

      var canvas = document.createElement('canvas');
      canvas.className = 'wave-gl-canvas';
      wrapper.appendChild(canvas);

      section.style.position = section.style.position || 'relative';
      if (w.position === 'top') {
        section.insertBefore(wrapper, section.firstChild);
      } else {
        section.appendChild(wrapper);
      }

      var flip = w.position === 'bottom' ? 1.0 : -1.0;
      var inst = createWaveGL(canvas, w.color, flip);
      if (inst) {
        inst.canvas = canvas;
        inst.wrapper = wrapper;
        waveInstances.push(inst);
      }
    });

    // Resize all canvases
    function resizeAll() {
      waveInstances.forEach(function(inst) {
        var rect = inst.wrapper.getBoundingClientRect();
        var dpr = Math.min(window.devicePixelRatio || 1, 2);
        inst.canvas.width = rect.width * dpr;
        inst.canvas.height = rect.height * dpr;
        inst.gl.viewport(0, 0, inst.canvas.width, inst.canvas.height);
        inst.gl.uniform2f(inst.uRes, inst.canvas.width, inst.canvas.height);
      });
    }

    resizeAll();
    window.addEventListener('resize', resizeAll);

    // Animation loop
    if (waveInstances.length && !window._waveGLRunning) {
      window._waveGLRunning = true;
      var start = performance.now();

      function frame(now) {
        var t = (now - start) / 1000;
        waveInstances.forEach(function(inst) {
          inst.gl.uniform1f(inst.uTime, t);
          inst.gl.clearColor(0, 0, 0, 0);
          inst.gl.clear(inst.gl.COLOR_BUFFER_BIT);
          inst.gl.drawArrays(inst.gl.TRIANGLE_STRIP, 0, 4);
        });
        requestAnimationFrame(frame);
      }

      requestAnimationFrame(frame);
    }
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
