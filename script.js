/* =========================================================
   MEHEK DUSEJA — portfolio behaviour
   ========================================================= */

(() => {
  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = 'ontouchstart' in window || window.innerWidth <= 768;

  /* ---------- intro loader ---------- */
  const intro      = $('#intro');
  const introCount = $('#introCount');

  function runIntro() {
    if (prefersReducedMotion) {
      intro.classList.add('is-gone');
      document.body.classList.add('is-ready');
      return;
    }
    let n = 0;
    const tick = () => {
      n += Math.max(1, Math.floor((100 - n) / 8));
      if (n >= 100) n = 100;
      introCount.textContent = n.toString().padStart(2, '0');
      if (n < 100) requestAnimationFrame(tick);
      else {
        setTimeout(() => {
          intro.classList.add('is-gone');
          document.body.classList.add('is-ready');
        }, 380);
      }
    };
    requestAnimationFrame(tick);
  }
  runIntro();

  /* ---------- custom cursor with label ---------- */
  const cursor = $('.cursor');
  const dot    = $('.cursor__dot');
  const ring   = $('.cursor__ring');
  const label  = $('#cursorLabel');
  let mx = innerWidth / 2, my = innerHeight / 2;
  let dx = mx, dy = my, rx = mx, ry = my, lx = mx, ly = my;

  window.addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
  });

  function animateCursor() {
    dx += (mx - dx) * 0.45;
    dy += (my - dy) * 0.45;
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    lx += (mx - lx) * 0.22;
    ly += (my - ly) * 0.22;
    if (dot)   dot.style.transform   = `translate3d(${dx}px, ${dy}px, 0) translate(-50%,-50%)`;
    if (ring)  ring.style.transform  = `translate3d(${rx}px, ${ry}px, 0) translate(-50%,-50%)`;
    if (label) label.style.transform = `translate3d(${lx}px, ${ly}px, 0) translate(-50%,-50%)`;
    requestAnimationFrame(animateCursor);
  }
  if (!isTouch) {
    animateCursor();
  } else {
    cursor && (cursor.style.display = 'none');
  }

  // generic hover
  const hoverables = 'a, button, .service, .stat, .btn';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hoverables)) cursor && cursor.classList.add('is-hover');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hoverables)) cursor && cursor.classList.remove('is-hover');
  });

  // label on case study media + gallery hover
  const labelTargets = $$('.case__media--double, .case__gallery figure, .case__visual');
  labelTargets.forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (!cursor) return;
      cursor.classList.add('is-label', 'is-hover');
      label.textContent = 'View →';
    });
    el.addEventListener('mouseleave', () => {
      if (!cursor) return;
      cursor.classList.remove('is-label', 'is-hover');
    });
  });

  /* ---------- 3D tilt on case images & mockups ---------- */
  if (!prefersReducedMotion && !isTouch) {
    const tiltables = $$('.case__media--double img, .case__gallery figure img, .window, .phone, .poster, .ww');
    tiltables.forEach(el => {
      const parent = el.parentElement;
      const wrap   = parent.classList.contains('case__visual') ? parent : el;
      wrap.addEventListener('mousemove', (e) => {
        const r = wrap.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width  - 0.5;
        const py = (e.clientY - r.top)  / r.height - 0.5;
        const ry = px * 10;
        const rx = -py * 10;
        const base = (el.classList.contains('window')) ? 'perspective(1400px) rotateY(-4deg) rotateX(2deg)' : '';
        if (el.classList.contains('window')) {
          el.style.transform = `perspective(1400px) rotateY(${-4 + ry * 0.4}deg) rotateX(${2 + rx * 0.4}deg)`;
        } else if (el.classList.contains('phone')) {
          el.style.transform = `rotate(-6deg) perspective(900px) rotateY(${ry * 0.6}deg) rotateX(${rx * 0.6}deg)`;
        } else if (el.classList.contains('poster')) {
          el.style.transform = `rotate(2deg) perspective(900px) rotateY(${ry * 0.6}deg) rotateX(${rx * 0.6}deg)`;
        } else if (el.classList.contains('ww')) {
          el.style.transform = `rotate(-1.5deg) perspective(900px) rotateY(${ry * 0.6}deg) rotateX(${rx * 0.6}deg)`;
        } else {
          el.style.transform = `perspective(900px) rotateY(${ry}deg) rotateX(${rx}deg) scale(1.02)`;
        }
      });
      wrap.addEventListener('mouseleave', () => {
        el.style.transform = '';
      });
    });
  }

  /* ---------- scroll reveal ---------- */
  const revealTargets = $$('section .kicker, section h2, .about__col--body p, .stat, .service, .case, .process__steps > li, .cta h2 span, .cta__buttons, .marquee, .hero__lede, .hero__scroll, .case__pullquote, .rule');
  revealTargets.forEach(el => el.classList.add('reveal'));

  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) {
        en.target.classList.add('in-view');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
  revealTargets.forEach(el => io.observe(el));

  /* ---------- text scramble on case h3 hover ---------- */
  const CHARS = '!<>-_\\/[]{}—=+*^?#________';
  class Scramble {
    constructor(el) {
      this.el = el;
      this.text = el.textContent;
      // also handle italic children
      this.html = el.innerHTML;
      this.queue = [];
      this.frame = 0;
      this.frameReq = 0;
    }
    setText(newText) {
      const old = this.text;
      const len = Math.max(old.length, newText.length);
      this.queue = [];
      for (let i = 0; i < len; i++) {
        const from = old[i] || '';
        const to   = newText[i] || '';
        const start = Math.floor(Math.random() * 30);
        const end   = start + Math.floor(Math.random() * 30);
        this.queue.push({ from, to, start, end });
      }
      cancelAnimationFrame(this.frameReq);
      this.frame = 0;
      return new Promise(res => this.resolve = res);
    }
    update = () => {
      let out = '', done = 0;
      for (let i = 0; i < this.queue.length; i++) {
        let { from, to, start, end, char } = this.queue[i];
        if (this.frame >= end) {
          done++;
          out += to;
        } else if (this.frame >= start) {
          if (!char || Math.random() < 0.28) {
            char = CHARS[Math.floor(Math.random() * CHARS.length)];
            this.queue[i].char = char;
          }
          out += `<span style="color:var(--accent);opacity:.7">${char}</span>`;
        } else {
          out += from;
        }
      }
      this.el.innerHTML = out;
      if (done === this.queue.length) {
        this.resolve();
        // restore original html (preserves <em>)
        this.el.innerHTML = this.html;
      } else {
        this.frame++;
        this.frameReq = requestAnimationFrame(this.update);
      }
    };
  }

  if (!prefersReducedMotion && !isTouch) {
    $$('.case__copy h3, .case--gallery h3').forEach(h => {
      const s = new Scramble(h);
      const original = h.textContent;
      h.addEventListener('mouseenter', () => {
        s.setText(original).then(() => {});
        requestAnimationFrame(s.update);
      });
    });
  }

  /* ---------- count-up stats ---------- */
  const stats = $$('.stat__num');
  const cIO = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      const el     = en.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      if (isNaN(target)) return;
      const dur = 1400;
      const t0  = performance.now();
      const step = (t) => {
        const p   = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        const val = Math.floor(target * eased);
        el.textContent = val + (p === 1 ? suffix : '');
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      cIO.unobserve(el);
    });
  }, { threshold: 0.5 });
  stats.forEach(el => cIO.observe(el));

  /* ---------- live clock (IST) ---------- */
  const clock = $('#clock');
  function tickClock() {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Asia/Kolkata',
      hour: '2-digit', minute: '2-digit', hour12: false
    });
    clock.textContent = fmt.format(new Date()) + ' IST';
  }
  tickClock();
  setInterval(tickClock, 1000 * 30);

  /* ---------- hero parallax ---------- */
  if (!prefersReducedMotion) {
    const hero = $('.hero__title');
    if (hero) {
      let raf = null;
      window.addEventListener('scroll', () => {
        if (raf) return;
        raf = requestAnimationFrame(() => {
          const y = window.scrollY;
          hero.style.transform = `translateY(${y * 0.06}px)`;
          raf = null;
        });
      }, { passive: true });
    }
  }

  /* ---------- magnetic CTA ---------- */
  if (!prefersReducedMotion && !isTouch) {
    $$('.btn, .nav__cta').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const dx = (e.clientX - cx) * 0.20;
        const dy = (e.clientY - cy) * 0.30;
        btn.style.transform = `translate(${dx}px, ${dy}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }

  /* ---------- marquee speed-shift on scroll ---------- */
  if (!prefersReducedMotion) {
    const tracks = $$('.marquee__track');
    if (tracks.length) {
      let lastY = window.scrollY, vel = 0;
      window.addEventListener('scroll', () => {
        const y = window.scrollY;
        vel = y - lastY;
        lastY = y;
        const dur = Math.max(8, 38 - Math.abs(vel) * 0.6) + 's';
        tracks.forEach(t => { t.style.animationDuration = dur; });
      }, { passive: true });
    }
  }

  /* ---------- global cursor spotlight ---------- */
  const spotlight = $('#spotlight');
  if (spotlight && !isTouch && !prefersReducedMotion) {
    let sx = innerWidth / 2, sy = innerHeight / 2;
    let stx = sx, sty = sy;
    const animateSpot = () => {
      stx += (mx - stx) * 0.08;
      sty += (my - sty) * 0.08;
      spotlight.style.transform = `translate3d(${stx}px, ${sty}px, 0) translate(-50%, -50%)`;
      requestAnimationFrame(animateSpot);
    };
    animateSpot();
  }

  /* ---------- hero dot field follows cursor ---------- */
  if (!prefersReducedMotion && !isTouch) {
    const dots = $('.hero__dots');
    const hero = $('.hero');
    if (dots && hero) {
      hero.addEventListener('mousemove', (e) => {
        const r = hero.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width  - 0.5;
        const y = (e.clientY - r.top)  / r.height - 0.5;
        dots.style.setProperty('--px', (x * -18) + 'px');
        dots.style.setProperty('--py', (y * -18) + 'px');
      });
    }
  }

  /* ---------- spotlight cursor on dark cases ---------- */
  if (!prefersReducedMotion && !isTouch) {
    $$('.case--dark').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width)  * 100;
        const y = ((e.clientY - r.top)  / r.height) * 100;
        card.style.setProperty('--mx', x + '%');
        card.style.setProperty('--my', y + '%');
      });
    });
  }

  /* ---------- rotating "currently" word ---------- */
  const swap = $('#heroSwap');
  if (swap) {
    const items = Array.from(swap.children);
    let idx = 0;
    setInterval(() => {
      const cur = items[idx];
      const next = items[(idx + 1) % items.length];
      cur.classList.remove('is-on');
      cur.classList.add('is-out');
      next.classList.remove('is-out');
      next.classList.add('is-on');
      // reset the leaving one shortly
      setTimeout(() => cur.classList.remove('is-out'), 700);
      idx = (idx + 1) % items.length;
    }, 3200);
  }

  /* ---------- word-stagger on about lead paragraphs ---------- */
  const staggerEls = [];
  $$('.about__lead, .case__deck').forEach(p => {
    if (p.dataset.staggered) return;
    p.dataset.staggered = '1';
    p.classList.add('word-stagger');
    const text = p.innerHTML;
    const out = text.replace(/(\S+)/g, (m, w) => {
      if (w.startsWith('<') || w.includes('</')) return w;
      return '<span class="w">' + w + '</span>';
    });
    p.innerHTML = out;
    const ws = $$('.w', p);
    ws.forEach((s, i) => { s.style.transitionDelay = (i * 0.025) + 's'; });
    staggerEls.push(p);
  });
  // Observe the stagger paragraphs so they get .in-view when they intersect
  staggerEls.forEach(el => io.observe(el));

  /* ---------- magnetic index preview ---------- */
  const indexPreview = $('#indexPreview');
  const indexImg     = $('#indexPreviewImg');
  const indexLinks   = $$('.index__list a');
  if (indexPreview && indexImg && indexLinks.length && !isTouch) {
    let ipx = innerWidth / 2, ipy = innerHeight / 2;
    let ipTx = ipx, ipTy = ipy;
    let pActive = false;

    indexLinks.forEach(a => {
      a.addEventListener('mouseenter', () => {
        const img = a.dataset.img;
        if (img) {
          indexImg.src = 'assets/' + img;
        }
        indexPreview.classList.add('is-on');
        pActive = true;
        // place at current mouse immediately
        ipTx = mx; ipTy = my;
      });
      a.addEventListener('mouseleave', () => {
        indexPreview.classList.remove('is-on');
        pActive = false;
      });
    });

    const animatePreview = () => {
      // smoother follow than the cursor (gives it weight)
      ipTx += (mx - ipTx) * 0.12;
      ipTy += (my - ipTy) * 0.12;
      indexPreview.style.transform =
        `translate3d(${ipTx}px, ${ipTy}px, 0) translate(-50%, -50%) scale(${pActive ? 1 : 0.84})`;
      requestAnimationFrame(animatePreview);
    };
    animatePreview();
  }

  /* ---------- scroll progress bar ---------- */
  const progressBar = $('#progress');
  if (progressBar) {
    let pRaf = null;
    const updateProgress = () => {
      const doc = document.documentElement;
      const total = doc.scrollHeight - doc.clientHeight;
      const pct = total > 0 ? (window.scrollY / total) * 100 : 0;
      progressBar.style.width = pct + '%';
      pRaf = null;
    };
    window.addEventListener('scroll', () => {
      if (pRaf) return;
      pRaf = requestAnimationFrame(updateProgress);
    }, { passive: true });
    updateProgress();
  }

  /* ---------- random shimmer on stat numbers every few seconds ---------- */
  if (!prefersReducedMotion) {
    const statNums = $$('.stat__num');
    setInterval(() => {
      if (!statNums.length) return;
      const target = statNums[Math.floor(Math.random() * statNums.length)];
      target.animate(
        [
          { color: 'var(--accent)', transform: 'translateY(0)' },
          { color: 'var(--accent-2)', transform: 'translateY(-3px)' },
          { color: 'var(--accent)', transform: 'translateY(0)' }
        ],
        { duration: 700, easing: 'cubic-bezier(.2,.6,.2,1)' }
      );
    }, 4000);
  }
})();
