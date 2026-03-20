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

  // Offset header below announcement bar
  var announcementBar = document.querySelector('.announcement-bar');
  var barHeight = announcementBar ? announcementBar.offsetHeight : 0;

  function onScroll() {
    var currentScrollY = window.scrollY;

    // Slide header up as announcement bar scrolls away
    var offset = Math.max(0, barHeight - currentScrollY);
    header.style.top = offset + 'px';

    if (currentScrollY > 80 && currentScrollY > lastScrollY) {
      header.classList.add('header--hidden');
    } else {
      header.classList.remove('header--hidden');
    }

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

// Gallery arrow navigation (next/prev)
(function() {
  var gallery = document.querySelector('.product-gallery');
  if (!gallery) return;

  var slides = gallery.querySelectorAll('.product-gallery__slide');
  var thumbs = gallery.querySelectorAll('.product-gallery__thumb');
  var nextBtn = gallery.querySelector('.product-gallery__nav--next');
  var prevBtn = gallery.querySelector('.product-gallery__nav--prev');
  if (!nextBtn || !prevBtn || slides.length === 0) return;

  function getActiveIndex() {
    for (var i = 0; i < slides.length; i++) {
      if (slides[i].classList.contains('active')) return i;
    }
    return 0;
  }

  function goToSlide(index) {
    slides.forEach(function(s) { s.classList.remove('active'); });
    thumbs.forEach(function(t) { t.classList.remove('active'); });
    slides[index].classList.add('active');
    if (thumbs[index]) thumbs[index].classList.add('active');
  }

  nextBtn.addEventListener('click', function() {
    var current = getActiveIndex();
    var next = (current + 1) % slides.length;
    goToSlide(next);
  });

  prevBtn.addEventListener('click', function() {
    var current = getActiveIndex();
    var prev = (current - 1 + slides.length) % slides.length;
    goToSlide(prev);
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
      '  vec2 uv=gl_FragCoord.xy/r;',
      '  vec2 p=uv*2.0-1.0;',
      '  p.x*=r.x/r.y;',
      // Layered horizontal waves
      '  float w1=sin(uv.x*4.0-t*0.4+sin(uv.y*3.0+t*0.3)*0.8)*0.5+0.5;',
      '  float w2=sin(uv.x*2.5+t*0.3+sin(uv.y*2.0-t*0.25)*1.2)*0.5+0.5;',
      '  float w3=sin(uv.y*3.0+t*0.35+sin(uv.x*1.5+t*0.2)*0.6)*0.5+0.5;',
      '  float w4=sin((uv.x+uv.y)*3.0-t*0.5)*0.5+0.5;',
      '  float w5=sin(uv.x*6.0-t*0.6+uv.y*2.0)*0.5+0.5;',
      '  float waves=w1*0.3+w2*0.25+w3*0.2+w4*0.15+w5*0.1;',
      // Deep ocean color palette
      '  vec3 deep=vec3(0.01,0.04,0.12);',
      '  vec3 mid=vec3(0.04,0.12,0.28);',
      '  vec3 light=vec3(0.08,0.22,0.42);',
      '  vec3 crest=vec3(0.12,0.30,0.52);',
      '  vec3 col=mix(deep,mid,waves);',
      '  col=mix(col,light,smoothstep(0.4,0.7,waves));',
      '  col=mix(col,crest,smoothstep(0.65,0.85,waves)*0.5);',
      // Subtle caustic highlights
      '  float c=sin(uv.x*8.0+t*0.7)*sin(uv.y*6.0-t*0.5)*0.04;',
      '  col+=c*vec3(0.3,0.5,0.7);',
      // Gentle vignette
      '  float v=1.0-length(p)*0.25;',
      '  col*=v;',
      '  gl_FragColor=vec4(col,1.0);',
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
  overlay.addEventListener('click', function(e) {
    var inner = overlay.querySelector('.popup__inner');
    if (inner && inner.contains(e.target)) return;
    closePopup();
  });

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

// Compare section animated water background
(function() {
  var section = document.querySelector('.compare');
  if (!section) return;

  var canvas = document.createElement('canvas');
  canvas.className = 'compare__canvas';
  section.style.position = 'relative';
  section.insertBefore(canvas, section.firstChild);

  var ctx = canvas.getContext('2d');
  var time = 0;

  function resize() {
    canvas.width = section.offsetWidth;
    canvas.height = section.offsetHeight;
  }

  function animate() {
    time += 0.008;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (var w = 0; w < 4; w++) {
      ctx.beginPath();
      var yBase = canvas.height * (0.2 + w * 0.2);
      for (var x = 0; x < canvas.width; x += 5) {
        var y = yBase + Math.sin(x * 0.005 + time * (0.4 + w * 0.15)) * 30 + Math.sin(x * 0.01 + time * (0.6 + w * 0.1)) * 15;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = 'rgba(100, 170, 230, ' + (0.06 - w * 0.012) + ')';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }

    requestAnimationFrame(animate);
  }

  resize();
  animate();
  window.addEventListener('resize', resize);

  // Animate bars on scroll
  var compareObs = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        compareObs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });
  compareObs.observe(section);
})();

// Featured product gallery
(function() {
  var gallery = document.querySelector('.fp-gallery');
  if (!gallery) return;

  var slides = gallery.querySelectorAll('.fp-gallery__slide');
  var dots = gallery.querySelectorAll('.fp-gallery__dot');
  var prevBtn = gallery.querySelector('.fp-gallery__arrow--prev');
  var nextBtn = gallery.querySelector('.fp-gallery__arrow--next');
  var current = 0;

  function goTo(index) {
    current = (index + slides.length) % slides.length;
    slides.forEach(function(s) { s.classList.remove('active'); });
    dots.forEach(function(d) { d.classList.remove('active'); });
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  dots.forEach(function(dot) {
    dot.addEventListener('click', function() {
      goTo(parseInt(this.getAttribute('data-index')));
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', function() { goTo(current - 1); });
  if (nextBtn) nextBtn.addEventListener('click', function() { goTo(current + 1); });
})();
