/**
 * EmpowerOne Landing — Interaction & Motion System
 * Brand-only. No external dependencies. prefers-reduced-motion respected.
 */
(function () {
  'use strict';

  var REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var THEME_KEY = 'empowerone-theme';
  var themeToggleBtn = null;

  /* ── Theme ─────────────────────────────────────────────────────── */
  function getSystemTheme() {
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function getStoredTheme() {
    try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; }
  }
  function storeTheme(t) {
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
  }
  function applyTheme(theme, animate) {
    var root = document.documentElement;
    if (animate && !REDUCED) {
      root.classList.add('theme-transitioning');
      setTimeout(function () { root.classList.remove('theme-transitioning'); }, 360);
    }
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    updateThemeIcon(theme);
  }
  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    var isDark = theme === 'dark';
    themeToggleBtn.setAttribute('aria-pressed', String(isDark));
    themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  function initTheme() {
    var stored = getStoredTheme();
    var theme = stored || getSystemTheme();
    applyTheme(theme, false);
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!getStoredTheme()) applyTheme(e.matches ? 'dark' : 'light', true);
    });
  }
  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    storeTheme(next);
    applyTheme(next, true);
  }

  /* ── Inject theme toggle ────────────────────────────────────────── */
  function injectThemeToggle() {
    if (document.getElementById('theme-toggle')) return;
    var actions = document.querySelector('.lnav-actions');
    if (!actions) return;
    var btn = document.createElement('button');
    btn.id = 'theme-toggle';
    btn.type = 'button';
    btn.className = 'lnav-theme-toggle';
    btn.setAttribute('aria-label', 'Switch to dark mode');
    btn.setAttribute('aria-pressed', 'false');
    btn.innerHTML =
      '<span class="ti ti-light" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg></span>' +
      '<span class="ti ti-dark" aria-hidden="true"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg></span>';
    btn.addEventListener('click', toggleTheme);
    actions.insertBefore(btn, actions.firstChild);
    themeToggleBtn = btn;
  }

  /* ── Scroll progress bar ────────────────────────────────────────── */
  function injectScrollProgress() {
    if (document.getElementById('scroll-progress')) return;
    var bar = document.createElement('div');
    bar.id = 'scroll-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.prepend(bar);
  }
  function initScrollProgress() {
    var bar = document.getElementById('scroll-progress');
    if (!bar) return;
    var t = false;
    window.addEventListener('scroll', function () {
      if (!t) {
        requestAnimationFrame(function () {
          var max = document.documentElement.scrollHeight - window.innerHeight;
          var pct = max > 0 ? window.scrollY / max : 0;
          bar.style.transform = 'scaleX(' + pct + ')';
          t = false;
        });
        t = true;
      }
    }, { passive: true });
  }

  /* ── Navigation ─────────────────────────────────────────────────── */
  function initNav() {
    var nav = document.getElementById('lnav');
    var mt = document.querySelector('.lnav-menu-toggle');
    if (!nav) return;

    var tick = false;
    window.addEventListener('scroll', function () {
      if (!tick) {
        requestAnimationFrame(function () {
          nav.classList.toggle('scrolled', window.scrollY > 40);
          tick = false;
        });
        tick = true;
      }
    }, { passive: true });

    if (mt) {
      function closeMenu() {
        nav.classList.remove('menu-open');
        mt.setAttribute('aria-expanded', 'false');
        mt.setAttribute('aria-label', 'Open navigation menu');
      }
      function openMenu() {
        nav.classList.add('menu-open');
        mt.setAttribute('aria-expanded', 'true');
        mt.setAttribute('aria-label', 'Close navigation menu');
      }
      mt.addEventListener('click', function () {
        nav.classList.contains('menu-open') ? closeMenu() : openMenu();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('menu-open')) closeMenu();
      });
      document.addEventListener('click', function (e) {
        if (nav.classList.contains('menu-open') && !nav.contains(e.target)) closeMenu();
      });
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          var t = document.querySelector(a.getAttribute('href'));
          if (t) {
            e.preventDefault();
            closeMenu();
            t.scrollIntoView({ behavior: REDUCED ? 'auto' : 'smooth', block: 'start' });
          }
        });
      });
    }
  }

  /* ── Nav link active tracking ───────────────────────────────────── */
  function initNavActive() {
    var sectionIds = ['why','the-shift','platform','courses','how','roles','dashboard-preview','contact'];
    var linkMap = {};
    sectionIds.forEach(function (id) {
      var a = document.querySelector('.lnav-links a[href="#' + id + '"]');
      if (a) linkMap[id] = a;
    });
    if (!('IntersectionObserver' in window)) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          Object.values(linkMap).forEach(function (a) { a.classList.remove('nav-active'); });
          var a = linkMap[entry.target.id];
          if (a) a.classList.add('nav-active');
        }
      });
    }, { rootMargin: '-68px 0px -40% 0px', threshold: 0 });
    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el) obs.observe(el);
    });
  }

  /* ── Hero entry sequence ────────────────────────────────────────── */
  function initHeroEntry() {
    var items   = document.querySelectorAll('.he');
    var visuals = document.querySelectorAll('.he-v');
    var hasAny  = items.length || visuals.length;
    if (!hasAny) return;

    if (REDUCED) {
      items.forEach(function (el) { el.classList.add('he-in'); });
      visuals.forEach(function (el) { el.classList.add('he-in'); });
      return;
    }

    /* Left-side content: staggered 0–800ms */
    var delays = [0, 80, 200, 320, 460, 620, 800];
    items.forEach(function (el, i) {
      setTimeout(function () { el.classList.add('he-in'); },
        delays[i] !== undefined ? delays[i] : i * 120);
    });

    /* Hero visual: enters ~300ms after page load */
    visuals.forEach(function (el) {
      setTimeout(function () { el.classList.add('he-in'); }, 300);
    });
  }

  /* ── Hero mockup bar entry ──────────────────────────────────────── */
  function initHeroMockupBars() {
    if (REDUCED) return;
    var fills = document.querySelectorAll('.hero-mockup .mbar-fill, .hero-mockup .ml-fill');
    fills.forEach(function (fill) {
      fill._t = fill.style.width || '0%';
      fill.style.width = '0%';
      fill.style.transition = 'none';
    });
    /* Animate bars after the visual has had time to appear */
    setTimeout(function () {
      fills.forEach(function (fill, i) {
        setTimeout(function () {
          fill.style.transition = 'width .9s cubic-bezier(.25,.7,.25,1)';
          fill.style.width = fill._t;
        }, i * 90);
      });
    }, 1100);
  }

  /* ── Hero parallax ──────────────────────────────────────────────── */
  function initParallax() {
    if (REDUCED) return;
    if (!matchMedia('(min-width: 1100px)').matches) return;
    var hc = document.querySelector('.hero-content');
    var hv = document.querySelector('.hero-visual');
    if (!hc || !hv) return;
    var t = false;
    window.addEventListener('scroll', function () {
      if (!t) {
        requestAnimationFrame(function () {
          var y = window.scrollY;
          if (y < window.innerHeight * 1.2) {
            hc.style.transform = 'translateY(' + (y * 0.055).toFixed(1) + 'px)';
            hv.style.transform = 'translateY(' + (y * 0.09).toFixed(1) + 'px)';
          }
          t = false;
        });
        t = true;
      }
    }, { passive: true });
  }

  /* ── Mockup tilt ────────────────────────────────────────────────── */
  function initMockupTilt() {
    var vis = document.querySelector('.hero-visual');
    if (!vis || REDUCED) return;
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    vis.addEventListener('pointermove', function (e) {
      var r = vis.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      vis.style.setProperty('--tilt-x', (-y * 3).toFixed(2) + 'deg');
      vis.style.setProperty('--tilt-y', (x * 5).toFixed(2) + 'deg');
    }, { passive: true });
    vis.addEventListener('pointerleave', function () {
      vis.style.setProperty('--tilt-x', '0deg');
      vis.style.setProperty('--tilt-y', '0deg');
    });
  }

  /* ── Section reveal ─────────────────────────────────────────────── */
  function initReveal() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll('[data-reveal]').forEach(function (el) { el.classList.add('rev'); });
      return;
    }
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var d = parseInt(el.getAttribute('data-delay') || '0', 10);
          setTimeout(function () { el.classList.add('rev'); }, REDUCED ? 0 : d);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -36px 0px' });
    document.querySelectorAll('[data-reveal]').forEach(function (el) { obs.observe(el); });

    // Stagger groups
    var sobs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var children = entry.target.querySelectorAll('[data-stagger]');
          children.forEach(function (child, i) {
            setTimeout(function () { child.classList.add('rev'); }, REDUCED ? 0 : i * 65);
          });
          sobs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });
    document.querySelectorAll('[data-stagger-parent]').forEach(function (el) { sobs.observe(el); });
  }

  /* ── Gap cards stagger delay ────────────────────────────────────── */
  function initGapReveal() {
    if (REDUCED) return;
    if (!('IntersectionObserver' in window)) return;
    var grid = document.querySelector('.gap-grid');
    if (!grid) return;
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        grid.querySelectorAll('.gap-card').forEach(function (card, i) {
          card.style.transitionDelay = (i * 100) + 'ms';
        });
        obs.unobserve(grid);
      }
    }, { threshold: 0.1 });
    obs.observe(grid);
  }

  /* ── Shift section reveal ───────────────────────────────────────── */
  function initShiftReveal() {
    if (REDUCED) return;
    if (!('IntersectionObserver' in window)) return;
    var compare = document.querySelector('.shift-compare');
    if (!compare) return;
    var cols = compare.querySelectorAll('.shift-col, .shift-arrow');
    cols.forEach(function (el) {
      el.style.opacity = '0';
      el.style.transform = el.classList.contains('shift-future') ? 'translateX(20px)' :
        el.classList.contains('shift-today') ? 'translateX(-20px)' : 'scale(0.8)';
      el.style.transition = 'none';
    });
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        cols.forEach(function (el, i) {
          setTimeout(function () {
            el.style.transition = 'opacity .55s ease, transform .55s cubic-bezier(.2,.7,.2,1)';
            el.style.opacity = '';
            el.style.transform = '';
          }, i * 160);
        });
        obs.unobserve(compare);
      }
    }, { threshold: 0.25 });
    obs.observe(compare);
  }

  /* ── Steps active ───────────────────────────────────────────────── */
  function initSteps() {
    if (REDUCED || !('IntersectionObserver' in window)) return;
    var steps = document.querySelectorAll('.step-card');
    if (!steps.length) return;
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        e.target.classList.toggle('step-lit', e.isIntersecting);
      });
    }, { threshold: 0.55 });
    steps.forEach(function (s) { obs.observe(s); });
  }

  /* ── Dashboard counters ─────────────────────────────────────────── */
  function countUp(el, target, isFloat, suffix, dur) {
    if (REDUCED) { el.textContent = target + (suffix || ''); return; }
    var n = parseFloat(target);
    var t0 = null;
    function step(ts) {
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var e = 1 - Math.pow(1 - p, 4);
      var v = n * e;
      el.textContent = (isFloat ? v.toFixed(1) : Math.round(v)) + (suffix || '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function initDashboardCounters() {
    if (REDUCED || !('IntersectionObserver' in window)) return;
    var wrap = document.querySelector('.dp-wrap');
    if (!wrap) return;
    var done = false;
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !done) {
        done = true;
        var kpis = wrap.querySelectorAll('.dpk-v');
        var data = [
          ['86', false, '', 700],
          ['68', false, '%', 800],
          ['94', false, '%', 900],
          ['2.6', true, ' hrs', 650]
        ];
        kpis.forEach(function (kpi, i) {
          if (!data[i]) return;
          kpi.textContent = '0' + (data[i][2] || '');
          setTimeout(function () {
            countUp(kpi, data[i][0], data[i][1], data[i][2], data[i][3]);
          }, i * 100);
        });
        var bars = wrap.querySelectorAll('.dpbar-fill');
        bars.forEach(function (bar, i) {
          var tw = bar.style.width;
          bar.style.width = '0%';
          bar.style.transition = 'none';
          setTimeout(function () {
            bar.style.transition = 'width .9s cubic-bezier(.2,.7,.2,1)';
            bar.style.width = tw;
          }, 180 + i * 110);
        });
        obs.unobserve(wrap);
      }
    }, { threshold: 0.2 });
    obs.observe(wrap);
  }

  /* ── Role card hover ────────────────────────────────────────────── */
  function initRoleHover() {
    document.querySelectorAll('.role-card').forEach(function (card) {
      card.addEventListener('mouseenter', function () {
        card.querySelectorAll('.role-tags span').forEach(function (t) { t.classList.add('rtag-lit'); });
      });
      card.addEventListener('mouseleave', function () {
        card.querySelectorAll('.role-tags span').forEach(function (t) { t.classList.remove('rtag-lit'); });
      });
    });
  }

  /* ── Dashboard hover ────────────────────────────────────────────── */
  function initDashHover() {
    document.querySelectorAll('.dp-dept-row').forEach(function (row) {
      row.addEventListener('mouseenter', function () {
        var f = row.querySelector('.dpbar-fill');
        if (f) f.classList.add('dpbar-hi');
      });
      row.addEventListener('mouseleave', function () {
        var f = row.querySelector('.dpbar-fill');
        if (f) f.classList.remove('dpbar-hi');
      });
    });
    document.querySelectorAll('.dpst-item').forEach(function (item) {
      item.addEventListener('mouseenter', function () { item.classList.add('dpst-hi'); });
      item.addEventListener('mouseleave', function () { item.classList.remove('dpst-hi'); });
    });
  }

  /* ── Platform card step numbers ─────────────────────────────────── */
  function initPlatformNumbers() {
    document.querySelectorAll('.platform-card').forEach(function (card, i) {
      if (!card.querySelector('.pc-num')) {
        var n = document.createElement('div');
        n.className = 'pc-num';
        n.setAttribute('aria-hidden', 'true');
        n.textContent = String(i + 1).padStart(2, '0');
        card.appendChild(n);
      }
    });
  }

  /* ── Live indicator ─────────────────────────────────────────────── */
  function initLiveIndicator() {
    var topbar = document.querySelector('.dp-topbar-right');
    if (!topbar || topbar.querySelector('.dp-live')) return;
    var ind = document.createElement('div');
    ind.className = 'dp-live';
    ind.setAttribute('aria-hidden', 'true');
    ind.innerHTML = '<span class="dp-live-dot"></span><span>Example workspace</span>';
    // Replace the existing label
    var lbl = topbar.querySelector('.dp-org-label');
    if (lbl) lbl.replaceWith(ind);
  }

  /* ── Footer reveal ──────────────────────────────────────────────── */
  function initFooter() {
    if (REDUCED || !('IntersectionObserver' in window)) return;
    var footer = document.querySelector('.lfooter');
    if (!footer) return;
    footer.style.opacity = '0';
    footer.style.transform = 'translateY(16px)';
    footer.style.transition = 'none';
    var obs = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        footer.style.transition = 'opacity .6s ease, transform .6s cubic-bezier(.2,.7,.2,1)';
        footer.style.opacity = '';
        footer.style.transform = '';
        obs.unobserve(footer);
      }
    }, { threshold: 0.05 });
    obs.observe(footer);
  }

  /* ── Button lift ────────────────────────────────────────────────── */
  function initButtonHover() {
    document.querySelectorAll('.lbtn').forEach(function (btn) {
      btn.addEventListener('mouseenter', function () { btn.classList.add('lbtn-hovered'); });
      btn.addEventListener('mouseleave', function () { btn.classList.remove('lbtn-hovered'); });
      btn.addEventListener('mousedown', function () { btn.classList.add('lbtn-pressed'); });
      btn.addEventListener('mouseup', function () { btn.classList.remove('lbtn-pressed'); });
    });
  }

  /* ── Init ───────────────────────────────────────────────────────── */
  function init() {
    initTheme();
    injectThemeToggle();
    injectScrollProgress();
    initScrollProgress();
    initNav();
    initNavActive();
    initHeroEntry();
    initHeroMockupBars();
    initParallax();
    initMockupTilt();
    initReveal();
    initGapReveal();
    initShiftReveal();
    initSteps();
    initDashboardCounters();
    initRoleHover();
    initDashHover();
    initPlatformNumbers();
    initLiveIndicator();
    initFooter();
    initButtonHover();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
