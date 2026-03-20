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

// Header: hide on scroll down, show on scroll up
(function() {
  var header = document.querySelector('.header');
  if (!header) return;

  var lastScrollY = 0;
  var ticking = false;

  function onScroll() {
    var currentScrollY = window.scrollY;

    if (currentScrollY > 80 && currentScrollY > lastScrollY) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }

    if (currentScrollY > 50) {
      header.style.background = 'rgba(29, 29, 31, 0.96)';
    } else {
      header.style.background = 'rgba(29, 29, 31, 0.92)';
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

// 10% Off Popup — email signup with WebGL water background
(function() {
  var overlay = document.getElementById('popupOverlay');
  if (!overlay) return;
  var closeBtn = document.getElementById('popupClose');
  var dismissBtn = document.getElementById('popupDismiss');
  var emailInput = document.getElementById('popupEmail');
  var emailSubmit = document.getElementById('popupEmailSubmit');
  var canvas = document.getElementById('popupCanvas');

  if (sessionStorage.getItem('atlas_popup_dismissed')) return;

  // --- WebGL fluid water shader ---
  var gl, program, timeUniform, resUniform, startTime, animId;
  function initWaterGL() {
    if (!canvas) return;
    gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    var vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0,1);}';
    var fs = [
      'precision mediump float;',
      'uniform float t;',
      'uniform vec2 r;',
      'void main(){',
      '  vec2 uv=(gl_FragCoord.xy/r)*2.0-1.0;',
      '  uv.x*=r.x/r.y;',
      '  float d=length(uv);',
      '  float w=0.0;',
      '  for(float i=1.0;i<6.0;i++){',
      '    float s=i*1.2;',
      '    w+=sin(uv.x*s+t*0.8+i*0.7)*0.12/i;',
      '    w+=sin(uv.y*s*1.3-t*0.6+i*1.1)*0.10/i;',
      '    w+=sin((uv.x+uv.y)*s*0.7+t*0.5)*0.08/i;',
      '  }',
      '  vec3 deep=vec3(0.035,0.07,0.14);',
      '  vec3 mid=vec3(0.06,0.14,0.28);',
      '  vec3 lite=vec3(0.12,0.25,0.42);',
      '  vec3 col=mix(deep,mid,w+0.5);',
      '  col=mix(col,lite,smoothstep(0.3,0.8,w+0.5)*0.5);',
      '  float caustic=sin(uv.x*8.0+t)*sin(uv.y*6.0-t*0.7)*0.04;',
      '  col+=caustic;',
      '  col*=1.0-d*0.25;',
      '  gl_FragColor=vec4(col,1);',
      '}'
    ].join('\n');

    function sh(type, src) {
      var s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    }
    program = gl.createProgram();
    gl.attachShader(program, sh(gl.VERTEX_SHADER, vs));
    gl.attachShader(program, sh(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(program);
    gl.useProgram(program);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,1,1]), gl.STATIC_DRAW);
    var pos = gl.getAttribLocation(program, 'p');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    timeUniform = gl.getUniformLocation(program, 't');
    resUniform = gl.getUniformLocation(program, 'r');
    startTime = Date.now();
  }

  function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (gl) gl.viewport(0, 0, canvas.width, canvas.height);
  }

  function renderWater() {
    if (!gl) return;
    var elapsed = (Date.now() - startTime) / 1000;
    gl.uniform1f(timeUniform, elapsed);
    gl.uniform2f(resUniform, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    animId = requestAnimationFrame(renderWater);
  }

  setTimeout(function() {
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    initWaterGL();
    resizeCanvas();
    renderWater();
    window.addEventListener('resize', resizeCanvas);
  }, 3000);

  function closePopup() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    sessionStorage.setItem('atlas_popup_dismissed', '1');
    if (animId) cancelAnimationFrame(animId);
    window.removeEventListener('resize', resizeCanvas);
  }

  closeBtn.addEventListener('click', closePopup);
  dismissBtn.addEventListener('click', closePopup);

  // Email submit
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

  // Update when flavor circles are clicked (for SPA-style switching)
  document.querySelectorAll('.flavor-circle').forEach(function(circle) {
    circle.addEventListener('click', function() {
      document.querySelectorAll('.flavor-circle').forEach(function(c) { c.classList.remove('active'); });
      circle.classList.add('active');
      updatePurchaseColors();
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
        { name: 'Sodium', form: 'as Sodium Citrate', dose: '600mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M8 12h8M12 8v8"/></svg>', desc: 'Essential for fluid balance, nerve signaling, and preventing dehydration during exercise.' },
        { name: 'Potassium', form: 'as Potassium Citrate', dose: '500mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>', desc: 'Supports muscle contractions, heart rhythm, and helps regulate cellular fluid balance.' },
        { name: 'Magnesium', form: 'as Magnesium Citrate', dose: '200mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>', desc: 'Vital for muscle recovery, energy production, and reducing cramps and fatigue.' }
      ]
    },
    vitamins: {
      title: 'Vitamins',
      dose: '116mg Total',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>',
      items: [
        { name: 'Vitamin C', form: 'Ascorbic Acid', dose: '90mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 8v4l2 2"/></svg>', desc: 'Powerful antioxidant that supports immune function and aids muscle recovery.' },
        { name: 'Vitamin B3', form: 'as Niacin', dose: '24mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="4"/><path d="M8 12h8"/></svg>', desc: 'Converts food into energy and supports cardiovascular health.' },
        { name: 'Vitamin B5', form: 'as Pantethine', dose: '12mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4"/></svg>', desc: 'Supports adrenal function, stress response, and energy metabolism.' },
        { name: 'Vitamin B6', form: 'as Pyridoxal-5-phosphate', dose: '2mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', desc: 'Aids neurotransmitter synthesis and energy metabolism from protein.' },
        { name: 'Vitamin B12', form: 'as Methylcobalamin', dose: '8mcg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>', desc: 'Boosts natural energy levels, supports nerve function, and aids red blood cell formation.' }
      ]
    },
    amino: {
      title: 'Amino Acids',
      dose: '1,200mg Total',
      icon: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>',
      items: [
        { name: 'L-Glutamine', form: '', dose: '1,000mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>', desc: 'The most abundant amino acid in the body. Supports gut health, immune function, and muscle recovery after intense exercise.' },
        { name: 'L-Taurine', form: '', dose: '200mg', icon: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>', desc: 'Supports cardiovascular function, exercise performance, and helps regulate hydration at the cellular level.' }
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
      html += '<div class="ingredient-popup__card">' +
        '<div class="ingredient-popup__card-icon">' + item.icon + '</div>' +
        '<div class="ingredient-popup__card-content">' +
          '<div class="ingredient-popup__card-top">' +
            '<span class="ingredient-popup__card-name">' + item.name + '</span>' +
            (item.form ? '<span class="ingredient-popup__card-form">' + item.form + '</span>' : '') +
            '<span class="ingredient-popup__card-dose">' + item.dose + '</span>' +
          '</div>' +
          '<p class="ingredient-popup__card-desc">' + item.desc + '</p>' +
        '</div>' +
      '</div>';
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

// Supplement facts hover interaction (product pages)
(function() {
  var rows = document.querySelectorAll('.sf-row--hoverable');
  var highlights = document.querySelectorAll('.sf-highlight');
  var container = document.querySelector('.supplement-facts__highlights');
  if (!rows.length || !highlights.length) return;

  rows.forEach(function(row) {
    row.addEventListener('mouseenter', function() {
      var target = row.getAttribute('data-highlight');
      if (!target) return;
      if (container) container.classList.add('sf-has-hover');
      highlights.forEach(function(h) {
        if (h.getAttribute('data-highlight-target') === target) {
          h.classList.add('sf-highlight--active');
        } else {
          h.classList.remove('sf-highlight--active');
        }
      });
    });

    row.addEventListener('mouseleave', function() {
      if (container) container.classList.remove('sf-has-hover');
      highlights.forEach(function(h) {
        h.classList.remove('sf-highlight--active');
      });
    });
  });
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
