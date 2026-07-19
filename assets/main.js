


document.addEventListener('DOMContentLoaded', () => {

  // ─── NAV SCROLL ───
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 20) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ─── MOBILE MENU ───
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => mobileMenu.classList.toggle('open'));
    mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
  }

  // ─── INTERSECTION OBSERVER — REVEAL (all types) ───
  const revealClasses = ['.reveal', '.reveal-left', '.reveal-right', '.reveal-scale'];
  const allRevealEls = document.querySelectorAll(revealClasses.join(', '));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10, rootMargin: '0px 0px -50px 0px' });
  allRevealEls.forEach((el, i) => { el.style.setProperty('--i', i % 8); io.observe(el); });

  // ─── REVEAL-STAGGER ───
  const staggerGroups = document.querySelectorAll('.reveal-stagger');
  const staggerIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        staggerIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  staggerGroups.forEach(el => staggerIo.observe(el));

  // ─── SCROLL-TRIGGERED PARALLAX ───
  // For .scene-img and scene images inside scroll-scene-full and split panels
  const parallaxEls = document.querySelectorAll('.scene-img, .scroll-scene-split .scene-visual img, .hero-bg');

  function updateParallax() {
    const scrollY = window.scrollY;
    parallaxEls.forEach(el => {
      const rect = el.closest('.scroll-scene-full, .scroll-scene-split, .hero') 
                   || el.parentElement;
      if (!rect) return;
      const container = el.closest('.scroll-scene-full, .scroll-scene-split, .hero');
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const centerY = containerRect.top + containerRect.height / 2;
      const viewportCenter = window.innerHeight / 2;
      const offset = (centerY - viewportCenter) * 0.15;
      el.style.transform = `scale(1.1) translateY(${offset}px)`;
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  // ─── COUNTERS ───
  const counters = document.querySelectorAll('[data-count]');
  const cio = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseFloat(el.dataset.count);
      const decimals = el.dataset.decimals ? parseInt(el.dataset.decimals) : 0;
      const suffix = el.dataset.suffix || '';
      const dur = 1400;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = target * eased;
        el.textContent = val.toFixed(decimals) + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      cio.unobserve(el);
    });
  }, { threshold: 0.4 });
  counters.forEach(el => cio.observe(el));

  // ─── TABS ───
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const btns = group.querySelectorAll('.tab-btn');
    const panelsWrap = document.querySelector(group.dataset.tabs);
    if (!panelsWrap) return;
    const panels = panelsWrap.querySelectorAll('.tab-panel');
    btns.forEach((btn, i) => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        if (panels[i]) panels[i].classList.add('active');
      });
    });
  });

  // ─── CONSOLE ANIMATION ───
  document.querySelectorAll('.console-body').forEach(body => {
    const lines = body.querySelectorAll('.console-line');
    lines.forEach((line, i) => {
      line.style.animationDelay = (i * 0.35) + 's';
    });
  });

  // ─── MESH CANVAS ───
  const canvas = document.getElementById('mesh-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, nodes, dpr;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initNodes() {
      const count = Math.round((w * h) / 38000) + 16;
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.30,
        vy: (Math.random() - 0.5) * 0.30,
        r: Math.random() * 1.8 + 0.8,
        pulse: Math.random() * Math.PI * 2,
        // World Cup: 80% gold, 20% red accent
        hue: Math.random() > 0.80 ? 'red' : 'gold'
      }));
    }

    function step() {
      ctx.clearRect(0, 0, w, h);
      const maxDist = Math.min(190, w * 0.18);

      nodes.forEach(n => {
        n.x += n.vx; n.y += n.vy;
        n.pulse += 0.018;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      });

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.32;
            ctx.strokeStyle = `rgba(255,184,0,${alpha})`;
            ctx.lineWidth = 0.8;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }

      nodes.forEach(n => {
        const glow = (Math.sin(n.pulse) + 1) / 2;
        // World Cup palette: gold nodes (80%) + red accent nodes (20%)
        if (n.hue === 'red') {
          ctx.fillStyle = `rgba(200,16,46,${0.45 + glow * 0.55})`;
        } else {
          ctx.fillStyle = `rgba(255,184,0,${0.55 + glow * 0.45})`;
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r + glow * 1.4, 0, Math.PI * 2);
        ctx.fill();
        // glow ring
        if (glow > 0.7) {
          ctx.strokeStyle = n.hue === 'red' ? `rgba(200,16,46,${(glow-0.7)*0.4})` : `rgba(255,184,0,${(glow-0.7)*0.4})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.r + glow * 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      requestAnimationFrame(step);
    }

    resize();
    initNodes();
    step();
    window.addEventListener('resize', () => { resize(); initNodes(); });
  }

  // ─── OFFLINE TOGGLE (demo console) ───
  const offlineToggle = document.getElementById('offline-toggle');
  const demoConsole = document.getElementById('demo-console');
  if (offlineToggle && demoConsole) {
    offlineToggle.addEventListener('click', () => {
      const isOffline = demoConsole.classList.toggle('is-offline');
      offlineToggle.classList.toggle('active', isOffline);
      const statusEl = demoConsole.querySelector('.console-status');
      const label = demoConsole.querySelector('.console-status span:last-child');
      if (isOffline) {
        label.textContent = 'EDGE MODE · NETWORK DOWN';
        statusEl.style.color = 'var(--gold)';
        demoConsole.querySelectorAll('.edge-line').forEach(l => l.style.display = 'flex');
        demoConsole.querySelectorAll('.cloud-line').forEach(l => l.style.display = 'none');
      } else {
        label.textContent = 'MESH ACTIVE';
        statusEl.style.color = 'var(--signal)';
        demoConsole.querySelectorAll('.edge-line').forEach(l => l.style.display = 'none');
        demoConsole.querySelectorAll('.cloud-line').forEach(l => l.style.display = 'flex');
      }
    });
  }

  // ─── CONTACT FORM ───
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const submitNote = document.getElementById('submitNote');
      const submitError = document.getElementById('submitError');
      const btn = contactForm.querySelector('button[type="submit"]');
      
      submitNote.style.display = 'none';
      submitError.style.display = 'none';
      btn.disabled = true;
      btn.textContent = 'Sending...';

      const formData = new FormData(contactForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const response = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (response.ok) {
          submitNote.style.display = 'block';
          contactForm.reset();
        } else {
          submitError.style.display = 'block';
        }
      } catch (err) {
        console.error(err);
        submitError.style.display = 'block';
      } finally {
        btn.disabled = false;
        btn.textContent = 'Send Request';
      }
    });
  }

  // ─── SCENE BLOCK STAGGER ───
  // Stagger reveal for scene-block elements
  document.querySelectorAll('.scene-block').forEach((el, i) => {
    el.classList.add('reveal-scale');
    el.style.transitionDelay = `${i * 120}ms`;
    io.observe(el);
  });

});
