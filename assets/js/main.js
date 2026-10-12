/* =========================================================================
   GTA VI — Contagem Regressiva · orquestração de movimento e interações
   GSAP 3 (ScrollTrigger, SplitText, CustomEase) + Lenis + WebGL
   ========================================================================= */
(function () {
  'use strict';

  var DATA = window.VI_DATA;
  var root = document.documentElement;
  var body = document.body;
  var reduceMQ = window.matchMedia('(prefers-reduced-motion: reduce)');
  var REDUCE = reduceMQ.matches;
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var HAS_GSAP = !!window.gsap;

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
  function pad(n, l) { n = String(n); while (n.length < (l || 2)) n = '0' + n; return n; }
  function dateFrom(arr) { return new Date(arr[0], arr[1], arr[2], arr[3] || 0, arr[4] || 0, arr[5] || 0); }

  var RELEASE = dateFrom(DATA.release);
  var PRELOAD = dateFrom(DATA.preload);
  var T1 = new Date(DATA.trailer1);

  /* ---------------------------------------------------------------------
     Toast
     --------------------------------------------------------------------- */
  var toastEl = $('#toast');
  var toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 4200);
  }

  /* ---------------------------------------------------------------------
     Fallback sem GSAP (CDN/arquivo ausente): site continua utilizável
     --------------------------------------------------------------------- */
  if (!HAS_GSAP) {
    body.classList.remove('is-loading');
    $('#loader').remove();
    root.classList.remove('js');
    return;
  }

  gsap.registerPlugin(ScrollTrigger, SplitText, CustomEase);
  CustomEase.create('vice', '0.22, 1, 0.36, 1');
  CustomEase.create('viceInOut', '0.76, 0, 0.24, 1');
  gsap.defaults({ ease: 'vice', duration: 1 });
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------------------------------------------------------------------
     Lenis (scroll suave) sincronizado com ScrollTrigger
     --------------------------------------------------------------------- */
  var lenis = null;
  if (!REDUCE && window.Lenis) {
    lenis = new Lenis({ lerp: 0.09, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.2 });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    lenis.stop();
  }
  function scrollToTarget(target, opts) {
    opts = opts || {};
    if (lenis) lenis.scrollTo(target, { duration: opts.immediate ? 0 : 1.6, immediate: !!opts.immediate, offset: opts.offset || 0, easing: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; } });
    else {
      var y = typeof target === 'number' ? target : target.getBoundingClientRect().top + window.scrollY + (opts.offset || 0);
      window.scrollTo({ top: y, behavior: REDUCE || opts.immediate ? 'auto' : 'smooth' });
    }
  }

  /* ---------------------------------------------------------------------
     Contagem regressiva (dígitos que rolam como num caça-níquel)
     --------------------------------------------------------------------- */
  function getParts(now) {
    var diff = RELEASE - now;
    var launched = diff <= 0;
    var d = Math.abs(diff);
    var days = Math.floor(d / 86400000);
    var hours = Math.floor((d % 86400000) / 3600000);
    var minutes = Math.floor((d % 3600000) / 60000);
    var seconds = Math.floor((d % 60000) / 1000);
    return {
      launched: launched,
      days: days, hours: hours, minutes: minutes, seconds: seconds,
      str: { days: pad(days, 2), hours: pad(hours), minutes: pad(minutes), seconds: pad(seconds) }
    };
  }

  function Countdown(el) {
    this.el = el;
    this.units = {};
    this.spinning = false;
    var self = this;
    $$('.countdown__unit', el).forEach(function (u) {
      self.units[u.dataset.unit] = { wrap: $('.countdown__digits', u), label: $('.countdown__label', u), slots: [] };
    });
  }
  Countdown.prototype.slot = function (u, i) {
    while (u.slots.length <= i) {
      var s = document.createElement('span');
      s.className = 'digit';
      var inner = document.createElement('span');
      inner.textContent = '0';
      s.appendChild(inner);
      u.wrap.appendChild(s);
      u.slots.push({ el: s, cur: inner, val: '0' });
    }
    return u.slots[i];
  };
  Countdown.prototype.slide = function (slot, val, mode) {
    if (slot.val === val && mode !== 'force') return;
    slot.val = val;
    if (mode === 'instant' || REDUCE) {
      slot.cur.textContent = val;
      gsap.set(slot.cur, { yPercent: 0, opacity: 1, filter: 'none' });
      return;
    }
    var old = slot.cur;
    var nxt = document.createElement('span');
    nxt.textContent = val;
    slot.el.appendChild(nxt);
    slot.cur = nxt;
    if (mode === 'fast') {
      gsap.fromTo(nxt, { yPercent: 100 }, { yPercent: 0, duration: 0.09, ease: 'none' });
      gsap.to(old, { yPercent: -100, duration: 0.09, ease: 'none', onComplete: function () { old.remove(); } });
    } else if (mode === 'land') {
      gsap.fromTo(nxt, { yPercent: 110, filter: 'blur(4px)' }, { yPercent: 0, filter: 'blur(0px)', duration: 0.9, ease: 'back.out(1.6)' });
      gsap.to(old, { yPercent: -110, opacity: 0, duration: 0.35, ease: 'power2.in', onComplete: function () { old.remove(); } });
    } else {
      gsap.fromTo(nxt, { yPercent: 100, filter: 'blur(5px)', opacity: 0.4 }, { yPercent: 0, filter: 'blur(0px)', opacity: 1, duration: 0.7, ease: 'expo.out' });
      gsap.to(old, { yPercent: -100, filter: 'blur(5px)', opacity: 0, duration: 0.6, ease: 'expo.out', onComplete: function () { old.remove(); } });
    }
  };
  Countdown.prototype.render = function (parts, mode) {
    if (this.spinning) return;
    var self = this;
    Object.keys(this.units).forEach(function (k) {
      var u = self.units[k], str = parts.str[k];
      // remove slots excedentes (ex.: 100 dias -> 99 dias)
      while (u.slots.length > str.length) { var s = u.slots.pop(); s.el.remove(); }
      for (var i = 0; i < str.length; i++) self.slide(self.slot(u, i), str.charAt(i), mode);
    });
    var labels = { days: ['Dia', 'Dias'], hours: ['Hora', 'Horas'], minutes: ['Minuto', 'Minutos'], seconds: ['Segundo', 'Segundos'] };
    Object.keys(this.units).forEach(function (k) {
      self.units[k].label.textContent = parts[k] === 1 ? labels[k][0] : labels[k][1];
    });
    this.el.classList.toggle('is-launched', parts.launched);
  };
  Countdown.prototype.spin = function (getParts, onDone) {
    var self = this;
    if (REDUCE) { self.render(getParts(), 'instant'); if (onDone) onDone(); return; }
    var initial = getParts();
    this.spinning = true;
    var order = ['days', 'hours', 'minutes', 'seconds'];
    var total = 0, landed = 0;
    order.forEach(function (k, ui) {
      var u = self.units[k];
      var str = initial.str[k];
      for (var i = 0; i < str.length; i++) {
        (function (slot, di, uiIdx) {
          total++;
          var steps = 9 + uiIdx * 3 + di * 2;
          var tl = gsap.timeline({ delay: uiIdx * 0.08 });
          for (var s = 0; s < steps; s++) {
            tl.call(function () { self.slide(slot, String(Math.floor(Math.random() * 10)), 'fast'); }, null, s * 0.075);
          }
          tl.call(function () {
            var now = getParts();
            var finalStr = now.str[order[uiIdx]];
            self.slide(slot, finalStr.charAt(di) || '0', 'land');
            landed++;
            if (landed === total) {
              gsap.delayedCall(0.6, function () {
                self.spinning = false;
                self.render(getParts(), 'tick');
                if (onDone) onDone();
              });
            }
          }, null, steps * 0.075);
        })(self.slot(u, i), i, ui);
      }
    });
  };

  var countdowns = $$('[data-countdown]').map(function (el) { return new Countdown(el); });
  var heroCountdown = countdowns[0];
  var miniEls = $$('[data-mini-countdown]');
  var srEls = $$('[data-countdown-sr]');
  var preloadChip = $('[data-preload-chip]');
  var heroEyebrow = $('.hero__eyebrow [data-scramble]');
  var lastMinute = -1;

  function updateTexts(parts, now) {
    var mini = parts.days + 'd ' + parts.str.hours + ':' + parts.str.minutes + ':' + parts.str.seconds;
    miniEls.forEach(function (m) { m.textContent = parts.launched ? 'Já disponível' : mini; });
    if (parts.minutes !== lastMinute) {
      lastMinute = parts.minutes;
      if (parts.launched) {
        srEls.forEach(function (el) { el.textContent = 'GTA VI já foi lançado. Lançado há ' + parts.days + ' dias e ' + parts.hours + ' horas.'; });
        document.title = 'GTA VI — Já disponível em Leonida';
        if (heroEyebrow) heroEyebrow.textContent = 'Leonida está aberta — tempo desde o lançamento';
      } else {
        srEls.forEach(function (el) { el.textContent = 'Faltam ' + parts.days + ' dias, ' + parts.hours + ' horas e ' + parts.minutes + ' minutos para o lançamento de GTA VI.'; });
        document.title = 'GTA VI em ' + parts.days + (parts.days === 1 ? ' dia' : ' dias') + ' — Contagem Regressiva';
      }
      if (preloadChip) {
        var pd = Math.ceil((PRELOAD - now) / 86400000);
        if (now < PRELOAD) preloadChip.textContent = 'Pré-download em ' + pd + (pd === 1 ? ' dia' : ' dias') + ' · 12/11';
        else if (!parts.launched) preloadChip.textContent = 'Pré-download liberado';
        else preloadChip.textContent = 'Disponível agora';
      }
    }
  }

  var tickTimer;
  function tick() {
    var now = new Date();
    var parts = getParts(now);
    countdowns.forEach(function (c) {
      c.render(parts, 'tick');
      c.el.classList.add('is-tick');
      setTimeout(function () { c.el.classList.remove('is-tick'); }, 450);
    });
    updateTexts(parts, now);
    clearTimeout(tickTimer);
    tickTimer = setTimeout(tick, 1000 - (Date.now() % 1000) + 8);
  }
  // render inicial instantâneo (antes da animação de entrada)
  (function () {
    var p = getParts(new Date());
    countdowns.forEach(function (c, i) { c.render(p, i === 0 ? 'instant' : 'instant'); });
    updateTexts(p, new Date());
  })();

  /* ---------------------------------------------------------------------
     Embaralhamento de texto (efeito de sintonia)
     --------------------------------------------------------------------- */
  var GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&@$';
  function scramble(el, duration) {
    if (REDUCE) return;
    var final = el.dataset.final || el.textContent;
    el.dataset.final = final;
    var obj = { p: 0 };
    gsap.to(obj, {
      p: 1, duration: duration || 1, ease: 'power2.out',
      onUpdate: function () {
        var n = Math.floor(obj.p * final.length);
        var out = final.slice(0, n);
        for (var i = n; i < final.length; i++) {
          var ch = final.charAt(i);
          out += ch === ' ' ? ' ' : GLYPHS.charAt(Math.floor(Math.random() * GLYPHS.length));
        }
        el.textContent = out;
      },
      onComplete: function () { el.textContent = final; }
    });
  }

  /* ---------------------------------------------------------------------
     Rádio
     --------------------------------------------------------------------- */
  var navSound = $('#navSound');
  Radio.init({ toast: toast, reduce: REDUCE });
  var dock = $('#dock');
  var toggleLabels = $$('[data-radio-toggle-label]');
  Radio.on(function (r) {
    root.classList.toggle('is-radio-playing', r.playing);
    navSound.setAttribute('aria-pressed', r.playing ? 'true' : 'false');
    navSound.setAttribute('aria-label', r.playing ? 'Pausar rádio' : 'Ligar rádio');
    toggleLabels.forEach(function (l) { l.textContent = r.playing ? 'Pausar a rádio' : 'Ligar a rádio'; });
    $$('[data-radio-toggle]').forEach(function (b) { if (b.hasAttribute('aria-label')) b.setAttribute('aria-label', r.playing ? 'Pausar rádio' : 'Tocar rádio'); });
    if (r.started && dock.hidden) {
      dock.hidden = false;
      gsap.set(dock, { y: 140, autoAlpha: 0 });
      syncDock();
    }
  });
  // o dock some no hero (que já tem o botão da rádio) e dentro da seção da rádio
  var inRadioSection = false, inHero = true;
  function syncDock() {
    if (dock.hidden) return;
    var away = inRadioSection || inHero;
    gsap.to(dock, { y: away ? 140 : 0, autoAlpha: away ? 0 : 1, duration: REDUCE ? 0 : 0.8, ease: 'expo.out', overwrite: true });
  }
  ScrollTrigger.create({
    trigger: '.hero', start: 'top top', end: 'bottom 35%',
    onToggle: function (s) { inHero = s.isActive; syncDock(); }
  });
  navSound.addEventListener('click', function () { Radio.toggle(); });
  $('[data-goto-radio]').addEventListener('click', function () { scrollToTarget($('#radio')); });

  /* ---------------------------------------------------------------------
     Hero WebGL
     --------------------------------------------------------------------- */
  var heroImg = $('#heroImg');
  var heroGl = null;
  function initGL() {
    if (REDUCE || !window.HeroGL) return;
    try {
      var portrait = window.matchMedia('(max-aspect-ratio: 4/5)').matches;
      heroGl = new HeroGL($('#heroGl'), heroImg, {
        focus: portrait ? [0.5, 0.5] : [0.5, 0.7],
        onLost: function () { root.classList.remove('has-webgl'); heroGl = null; }
      });
      root.classList.add('has-webgl');
      heroGl.render();
    } catch (e) {
      heroGl = null;
      root.classList.remove('has-webgl');
    }
  }

  /* ---------------------------------------------------------------------
     Preloader + portão de som
     --------------------------------------------------------------------- */
  var loader = $('#loader');
  var pctEl = $('#loaderPct');
  var statusEl = $('#loaderStatus');
  var gate = $('#loaderGate');
  var fill = $('.loader__logo-fill');
  var main = $('#main');
  main.inert = true;
  $('#nav').inert = true;

  var progress = { v: 0 };
  function setProgress(v) {
    gsap.to(progress, {
      v: v, duration: 0.8, ease: 'power2.out', overwrite: true,
      onUpdate: function () {
        var p = progress.v;
        pctEl.textContent = pad(Math.round(p), 3);
        fill.style.clipPath = 'inset(' + (100 - p) + '% 0 0 0)';
      }
    });
  }

  function loadImage(src) {
    return new Promise(function (res) {
      var im = new Image();
      im.onload = im.onerror = function () { res(); };
      im.src = src;
    });
  }
  function waitHero() {
    return new Promise(function (res) {
      if (heroImg.complete && heroImg.naturalWidth) return res();
      heroImg.addEventListener('load', res, { once: true });
      heroImg.addEventListener('error', res, { once: true });
    });
  }

  var tasks = [
    waitHero(),
    loadImage('assets/img/brand/logo-gtavi.webp'),
    loadImage('assets/img/brand/vi.webp'),
    loadImage('assets/img/key/vice-skyline.webp'),
    document.fonts ? document.fonts.ready : Promise.resolve()
  ];
  var done = 0;
  var statuses = ['Sintonizando Leonida…', 'Abastecendo o carro…', 'Passando protetor solar…', 'Ligando o néon de Vice City…', 'Quase lá…'];
  tasks.forEach(function (t) {
    t.then(function () {
      done++;
      setProgress((done / tasks.length) * 100);
      statusEl.textContent = statuses[Math.min(done, statuses.length - 1)];
    });
  });
  var minTime = new Promise(function (r) { setTimeout(r, REDUCE ? 300 : 1500); });
  var maxTime = new Promise(function (r) { setTimeout(r, 9000); });
  Promise.race([Promise.all(tasks.concat([minTime])), maxTime]).then(function () {
    setProgress(100);
    gsap.delayedCall(0.6, showGate);
  });

  function showGate() {
    statusEl.textContent = 'Pronto. Bem-vindo a Leonida.';
    gate.hidden = false;
    gsap.from(gate.children, { y: 20, autoAlpha: 0, stagger: 0.08, duration: 0.9 });
    gsap.to('.loader__meter', { autoAlpha: 0.5, duration: 0.6 });
    var first = $('[data-enter="sound"]', gate);
    first.focus({ preventScroll: true });
  }

  var entered = false;
  gate.addEventListener('click', function (e) {
    var b = e.target.closest('[data-enter]');
    if (!b || entered) return;
    entered = true;
    // o play precisa acontecer dentro do gesto do usuário
    if (b.dataset.enter === 'sound') Radio.start();
    enter();
  });

  function enter() {
    initGL();
    main.inert = false;
    $('#nav').inert = false;
    var tl = gsap.timeline({
      onComplete: function () {
        loader.remove();
        body.classList.remove('is-loading');
        if (lenis) lenis.start();
        ScrollTrigger.refresh();
        tick();
        if (location.hash && location.hash.length > 1) {
          var t = document.getElementById(location.hash.slice(1));
          if (t && t.id !== 'contagem') scrollToTarget(t, { immediate: true });
        }
      }
    });

    if (REDUCE) {
      tl.to(loader, { autoAlpha: 0, duration: 0.4 });
      if (heroGl) heroGl.setReveal(1);
      return;
    }

    // mergulho pelo "I" do logo
    tl.to('.loader__inner > :not(.loader__logo)', { autoAlpha: 0, y: 12, duration: 0.4, ease: 'power2.in' }, 0)
      .to('.loader__legal', { autoAlpha: 0, duration: 0.3 }, 0)
      .to('.loader__logo', { scale: 26, transformOrigin: '85% 52%', duration: 1.25, ease: 'expo.in' }, 0.15)
      .to(loader, { autoAlpha: 0, duration: 0.5, ease: 'power1.inOut' }, 1.05);

    // revelação do hero
    var reveal = { v: 0 };
    if (heroGl) {
      heroGl.play();
      tl.to(reveal, { v: 1, duration: 2.6, ease: 'power2.inOut', onUpdate: function () { heroGl.setReveal(reveal.v); } }, 0.95);
    } else {
      tl.fromTo('.hero__img', { scale: 1.25, filter: 'blur(18px) brightness(0.4)' }, { scale: 1, filter: 'blur(0px) brightness(1)', duration: 2.4, ease: 'expo.out' }, 0.95);
    }
    tl.from('.hero__shade', { autoAlpha: 0, duration: 1.6 }, 1.2)
      .from('.hero__logo', { yPercent: 18, scale: 0.86, autoAlpha: 0, filter: 'blur(14px)', duration: 1.5, ease: 'expo.out' }, 1.35)
      .add(function () { heroCountdown.spin(function () { return getParts(new Date()); }); }, 1.55)
      .from('.countdown--hero .digit', { autoAlpha: 0, duration: 0.3, stagger: 0.03 }, 1.55)
      .from('.countdown--hero .countdown__sep', { autoAlpha: 0, scale: 0.4, duration: 0.6, stagger: 0.08 }, 1.7)
      .from('.countdown--hero .countdown__label', { y: 16, autoAlpha: 0, duration: 0.9, stagger: 0.06 }, 1.9)
      .add(function () { scramble(heroEyebrow, 1); }, 1.8)
      .from('.hero__eyebrow', { autoAlpha: 0, duration: 0.6 }, 1.8)
      .from('.hero__meta > *, .hero__actions > *', { y: 26, autoAlpha: 0, duration: 1, stagger: 0.07 }, 2.0)
      .from('#nav > *', { y: -28, autoAlpha: 0, duration: 1.1, stagger: 0.08, clearProps: 'transform' }, 2.1)
      .from('.hero__ticker', { yPercent: 100, duration: 1.1 }, 2.1)
      .from('.hero__scroll', { autoAlpha: 0, duration: 1 }, 2.4);
  }

  // Enter no teclado ativa o botão em foco (comportamento nativo); Esc entra sem som
  document.addEventListener('keydown', function (e) {
    if (!entered && !gate.hidden && e.key === 'Escape') { $('[data-enter="mute"]', gate).click(); }
  });

  /* ---------------------------------------------------------------------
     Hero: scroll + mouse
     --------------------------------------------------------------------- */
  ScrollTrigger.create({
    trigger: '.hero',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
    onUpdate: function (self) {
      if (heroGl) heroGl.setScroll(self.progress);
    },
    onToggle: function (self) { if (heroGl) heroGl.setVisible(self.isActive); }
  });
  if (!REDUCE) {
    gsap.to('.hero__content', {
      yPercent: -14, autoAlpha: 0, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 15%', scrub: true }
    });
    if (!heroGl) gsap.to('.hero__img', { scale: 1.12, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  }
  if (FINE) {
    window.addEventListener('pointermove', function (e) {
      if (!heroGl) return;
      heroGl.setMouse((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
    }, { passive: true });
  }
  document.addEventListener('visibilitychange', function () {
    if (!heroGl) return;
    if (document.hidden) heroGl.stop(); else if (heroGl.visible) heroGl.play();
  });

  /* ---------------------------------------------------------------------
     Navegação
     --------------------------------------------------------------------- */
  var nav = $('#nav');
  var lastY = 0;
  function onScrollNav(y) {
    nav.classList.toggle('is-scrolled', y > 40);
    var goingDown = y > lastY + 4, goingUp = y < lastY - 4;
    if (goingDown && y > window.innerHeight * 0.8 && !menuOpen) nav.classList.add('is-hidden');
    else if (goingUp || y < 80) nav.classList.remove('is-hidden');
    lastY = y;
  }
  if (lenis) lenis.on('scroll', function (l) { onScrollNav(l.scroll); });
  else window.addEventListener('scroll', function () { onScrollNav(window.scrollY); }, { passive: true });

  // links âncora suaves
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]');
    if (!a) return;
    var id = a.getAttribute('href').slice(1);
    var t = id ? document.getElementById(id) : null;
    if (!t) return;
    e.preventDefault();
    if (menuOpen) closeMenu();
    scrollToTarget(t);
    history.replaceState(null, '', '#' + id);
  });

  // link ativo
  $$('.nav__links a').forEach(function (a) {
    var sec = document.getElementById(a.getAttribute('href').slice(1));
    if (!sec) return;
    ScrollTrigger.create({
      trigger: sec, start: 'top 55%', end: 'bottom 45%',
      onToggle: function (self) { a.classList.toggle('is-active', self.isActive); }
    });
  });

  // menu mobile
  var menu = $('#menu');
  var menuBtn = $('#navMenuBtn');
  var menuOpen = false;
  function openMenu() {
    menuOpen = true;
    menu.hidden = false;
    menuBtn.setAttribute('aria-expanded', 'true');
    menuBtn.setAttribute('aria-label', 'Fechar menu');
    if (lenis) lenis.stop();
    gsap.fromTo(menu, { clipPath: 'circle(0% at 100% 0%)' }, { clipPath: 'circle(150% at 100% 0%)', duration: 0.9, ease: 'viceInOut' });
    gsap.from($$('.menu li'), { yPercent: 60, autoAlpha: 0, stagger: 0.05, duration: 0.8, delay: 0.25 });
  }
  function closeMenu() {
    menuOpen = false;
    menuBtn.setAttribute('aria-expanded', 'false');
    menuBtn.setAttribute('aria-label', 'Abrir menu');
    if (lenis) lenis.start();
    gsap.to(menu, { clipPath: 'circle(0% at 100% 0%)', duration: 0.6, ease: 'viceInOut', onComplete: function () { menu.hidden = true; } });
  }
  menuBtn.addEventListener('click', function () { menuOpen ? closeMenu() : openMenu(); });

  // barra de progresso do scroll
  gsap.to('.scroll-progress span', { scaleX: 1, ease: 'none', scrollTrigger: { trigger: body, start: 'top top', end: 'bottom bottom', scrub: 0.3 } });

  /* ---------------------------------------------------------------------
     Revelações genéricas
     --------------------------------------------------------------------- */
  if (!REDUCE) {
    $$('[data-split]').forEach(function (el) {
      SplitText.create(el, {
        type: 'lines,words',
        mask: 'lines',
        linesClass: 'split-line',
        autoSplit: true,
        onSplit: function (self) {
          return gsap.from(self.words, {
            yPercent: 115, rotate: 4, duration: 1.25, stagger: 0.06, ease: 'expo.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true }
          });
        }
      });
    });
    ScrollTrigger.batch('[data-reveal]', {
      start: 'top 90%',
      once: true,
      onEnter: function (els) { gsap.from(els, { y: 40, autoAlpha: 0, duration: 1.2, stagger: 0.1 }); }
    });
  }
  $$('[data-scramble]').forEach(function (el) {
    if (el.closest('.hero')) return;
    ScrollTrigger.create({ trigger: el, start: 'top 92%', once: true, onEnter: function () { scramble(el, 0.9); } });
  });

  /* ---------------------------------------------------------------------
     2. Mergulho pelo "VI"
     --------------------------------------------------------------------- */
  (function dive() {
    var svg = $('.dive__mask');
    var vis = $$('.dive__vi', svg);
    var rects = $$('.dive__mask-rect', svg);
    var stroke = $('.dive__stroke', svg);
    var media = $('.dive__media img');
    var W = 0, H = 0, base = 1, kEnd = 20;
    var state = { p: 0 };

    function layout() {
      W = window.innerWidth; H = window.innerHeight;
      svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
      rects.forEach(function (r) { r.setAttribute('width', W); r.setAttribute('height', H); });
      base = Math.min((W * 0.7) / 1210, (H * 0.58) / 936);
      kEnd = Math.max((W * 1.25) / (357 * base), (H * 1.25) / (916 * base));
      apply();
    }
    function apply() {
      var p = state.p;
      var k = Math.pow(kEnd, p);
      var e = p * p * (3 - 2 * p);
      var ox = 605 + (1031.5 - 605) * e;
      var oy = 468 + (458 - 468) * e;
      var cx = W / 2, cy = H * 0.53;
      var tf = 'translate(' + cx + ' ' + cy + ') scale(' + (base * k) + ') translate(' + (-ox) + ' ' + (-oy) + ')';
      vis.forEach(function (v) { v.setAttribute('transform', tf); });
    }
    layout();
    window.addEventListener('resize', layout);

    var words = null;
    if (!REDUCE) {
      var split = SplitText.create('.dive__text', { type: 'words' });
      words = split.words;
    }

    if (REDUCE) {
      gsap.set('.dive__mask, .dive__intro', { autoAlpha: 0 });
      gsap.set('.dive__copy', { autoAlpha: 1 });
      gsap.set('.dive__veil', { autoAlpha: 1 });
      return;
    }

    var tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: '.dive',
        pin: '.dive__pin',
        start: 'top top',
        end: '+=230%',
        scrub: 1,
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });
    tl.fromTo(media, { scale: 1.45 }, { scale: 1.02, duration: 0.6, ease: 'power1.out' }, 0)
      .to(state, { p: 1, duration: 0.55, ease: 'power1.in', onUpdate: apply }, 0.02)
      .to('.dive__intro', { autoAlpha: 0, y: -40, duration: 0.15 }, 0.02)
      .to(stroke, { opacity: 0, duration: 0.2 }, 0.3)
      .set(svg, { autoAlpha: 0 }, 0.58)
      .to('.dive__veil', { autoAlpha: 1, duration: 0.2 }, 0.5)
      .set('.dive__copy', { autoAlpha: 1 }, 0.6)
      .from('.dive__copy .kicker', { autoAlpha: 0, x: -30, duration: 0.12, ease: 'power2.out' }, 0.6)
      .from('.dive__title', { yPercent: 60, autoAlpha: 0, duration: 0.18, ease: 'power3.out' }, 0.62)
      .from(words, { autoAlpha: 0, y: 18, filter: 'blur(6px)', duration: 0.12, stagger: 0.004, ease: 'power2.out' }, 0.7)
      .to(media, { scale: 1.1, duration: 0.4 }, 0.6);
  })();

  /* ---------------------------------------------------------------------
     3. Trailers + modal de vídeo
     --------------------------------------------------------------------- */
  if (!REDUCE) {
    $$('[data-reveal-card]').forEach(function (card, i) {
      var img = $('.tcard__media img', card);
      var tl = gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 88%', once: true } });
      tl.fromTo(card, { clipPath: 'inset(22% 12% 22% 12% round 24px)', autoAlpha: 0 }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', autoAlpha: 1, duration: 1.4, ease: 'expo.out', delay: i * 0.12 })
        .fromTo(img, { scale: 1.4 }, { scale: 1.02, duration: 1.8, ease: 'expo.out' }, '<')
        .from($$('.tcard__meta > *', card), { y: 24, autoAlpha: 0, stagger: 0.07, duration: 1 }, '<0.3')
        .from($('.tcard__play', card), { scale: 0, rotate: -90, duration: 1, ease: 'back.out(2)' }, '<0.1');
    });
  }

  var vmodal = $('#videoModal');
  var vframe = $('#vmodalFrame');
  var vwin = $('.vmodal__window', vmodal);
  var lastFocus = null;
  var modalOpen = false;
  var player = null;
  var ducked = false;
  var barLink = $('.vmodal__yt', vmodal);

  // Monta o conteúdo do modal: verificação de idade -> player ou painel do YouTube
  function stageVideo(key) {
    var cfg = DATA.videos[key];
    if (player) { player.destroy(); player = null; }
    vframe.innerHTML = '';
    $('#vmodalTitle').textContent = cfg.title;
    var link = cfg.youtube ? { label: 'Abrir no YouTube ↗', href: 'https://www.youtube.com/watch?v=' + cfg.youtube } : { label: 'Ver no site oficial ↗', href: 'https://www.rockstargames.com/VI/an-extended-look' };
    barLink.textContent = link.label;
    barLink.href = link.href;
    if (!ViMedia.ageOk()) {
      ViMedia.renderAgeGate(vframe, cfg, { onPass: function () { stageVideo(key); } });
      return;
    }
    if (cfg.sources) {
      if (!ducked) { Radio.duck(); ducked = true; }
      player = ViMedia.mountPlayer(vframe, cfg, { key: key, autoplay: true });
    } else {
      ViMedia.renderYoutubeOnly(vframe, cfg, {
        onSwitch: function (k) { stageVideo(k); },
        onPopup: function () { Radio.pause(); }
      });
    }
  }

  function openVideo(key, fromEl) {
    if (!DATA.videos[key]) return;
    lastFocus = document.activeElement;
    modalOpen = true;
    vmodal.hidden = false;
    root.classList.add('is-modal-open');
    if (lenis) lenis.stop();
    stageVideo(key);
    if (REDUCE) { gsap.set(vmodal, { autoAlpha: 1 }); }
    else {
      var r = fromEl.getBoundingClientRect();
      var w = vframe.getBoundingClientRect();
      gsap.fromTo('.vmodal__backdrop', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.6 });
      gsap.fromTo(vwin, {
        x: r.left + r.width / 2 - (w.left + w.width / 2),
        y: r.top + r.height / 2 - (w.top + w.height / 2),
        scale: r.width / w.width, autoAlpha: 0.4
      }, { x: 0, y: 0, scale: 1, autoAlpha: 1, duration: 0.9, ease: 'expo.out' });
    }
    if (!vframe.contains(document.activeElement)) $('.vmodal__close', vmodal).focus({ preventScroll: true });
  }
  function closeVideo() {
    if (!modalOpen) return;
    modalOpen = false;
    if (player) { player.destroy(); player = null; }
    var finish = function () {
      vframe.innerHTML = '';
      vmodal.hidden = true;
      root.classList.remove('is-modal-open');
      if (lenis) lenis.start();
      if (ducked) { Radio.unduck(); ducked = false; }
      if (lastFocus) lastFocus.focus({ preventScroll: true });
    };
    if (REDUCE) return finish();
    gsap.to(vwin, { scale: 0.92, autoAlpha: 0, duration: 0.35, ease: 'power2.in' });
    gsap.to('.vmodal__backdrop', { autoAlpha: 0, duration: 0.4, onComplete: finish });
  }
  $$('[data-video]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey) return;
      e.preventDefault();
      openVideo(a.dataset.video, a);
    });
  });
  vmodal.addEventListener('click', function (e) { if (e.target.closest('[data-close]')) closeVideo(); });

  /* ---------------------------------------------------------------------
     4. Protagonistas
     --------------------------------------------------------------------- */
  $$('[data-lead]').forEach(function (lead, li) {
    var imgs = $$('.lead__img', lead);
    var dots = $$('.lead__dots button', lead);
    var idx = 0, timer = null, inView = false;
    function show(n) {
      idx = (n + imgs.length) % imgs.length;
      imgs.forEach(function (im, i) { im.classList.toggle('is-active', i === idx); });
      dots.forEach(function (d, i) { d.setAttribute('aria-selected', i === idx ? 'true' : 'false'); });
    }
    function schedule() {
      clearInterval(timer);
      if (!inView || REDUCE) return;
      timer = setInterval(function () { show(idx + 1); }, 4200 + li * 700);
    }
    dots.forEach(function (d, i) { d.addEventListener('click', function () { show(i); schedule(); }); });
    ScrollTrigger.create({ trigger: lead, start: 'top 80%', end: 'bottom 20%', onToggle: function (s) { inView = s.isActive; schedule(); } });

    if (!REDUCE) {
      var fromClip = li === 0 ? 'inset(0% 0% 0% 100% round 24px)' : 'inset(0% 100% 0% 0% round 24px)';
      var tl = gsap.timeline({ scrollTrigger: { trigger: lead, start: 'top 80%', once: true } });
      tl.fromTo(lead, { clipPath: fromClip }, { clipPath: 'inset(0% 0% 0% 0% round 24px)', duration: 1.6, ease: 'expo.inOut' })
        .from($$('.lead__media', lead), { scale: 1.3, duration: 2, ease: 'expo.out' }, '<0.2')
        .from($$('.lead__name span', lead), { yPercent: 100, autoAlpha: 0, stagger: 0.1, duration: 1.2 }, '<0.6')
        .from($$('.lead__bio, .lead__dots, .lead__index', lead), { y: 20, autoAlpha: 0, stagger: 0.08, duration: 1 }, '<0.2');
      if (FINE) {
        var mediaEl = $('.lead__media', lead);
        var qx = gsap.quickTo(mediaEl, 'x', { duration: 1.2, ease: 'power3' });
        var qy = gsap.quickTo(mediaEl, 'y', { duration: 1.2, ease: 'power3' });
        lead.addEventListener('pointermove', function (e) {
          var r = lead.getBoundingClientRect();
          qx(((e.clientX - r.left) / r.width - 0.5) * -24);
          qy(((e.clientY - r.top) / r.height - 0.5) * -16);
        });
        lead.addEventListener('pointerleave', function () { qx(0); qy(0); });
      }
    }
  });
  if (!REDUCE) {
    gsap.fromTo('.leads__marquee', { xPercent: 0 }, { xPercent: -28, ease: 'none', scrollTrigger: { trigger: '.leads', start: 'top bottom', end: 'bottom top', scrub: true } });
  }

  /* ---------------------------------------------------------------------
     5. Elenco — scroll horizontal fixado
     --------------------------------------------------------------------- */
  var mm = gsap.matchMedia();
  mm.add({ desktop: '(min-width: 900px)', motion: '(prefers-reduced-motion: no-preference)' }, function (ctx) {
    var c = ctx.conditions;
    if (!c.desktop || !c.motion) return;
    var section = $('.cast');
    var track = $('.cast__track');
    var bar = $('.cast__progress span');
    section.classList.add('is-pinned-cast');
    function dist() { return Math.max(0, track.scrollWidth - document.documentElement.clientWidth); }
    var tween = gsap.to(track, {
      x: function () { return -dist(); },
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        pin: '.cast__pin',
        start: 'top top',
        end: function () { return '+=' + dist(); },
        scrub: 1,
        invalidateOnRefresh: true,
        onUpdate: function (s) { gsap.set(bar, { scaleX: s.progress }); }
      }
    });
    $$('.ccard').forEach(function (card) {
      gsap.fromTo($('.ccard__fg img', card), { xPercent: 12 }, { xPercent: -12, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      gsap.fromTo($('.ccard__bg img', card), { xPercent: -6 }, { xPercent: 6, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      gsap.from(card, { rotate: 4, yPercent: 8, scale: 0.92, ease: 'none', scrollTrigger: { trigger: card, containerAnimation: tween, start: 'left right', end: 'center 60%', scrub: true } });
    });
    return function () { section.classList.remove('is-pinned-cast'); };
  });

  /* ---------------------------------------------------------------------
     6. Leonida — lugares
     --------------------------------------------------------------------- */
  (function places() {
    var medias = $$('.place-media');
    var tabs = $$('.places__list button');
    var logo = $('.places__logo');
    var desc = $('.places__desc');
    var card = $('.places__postcard');
    var cardImg = $('img', card);
    var counter = $('.places__current');
    var current = 0;
    var count = medias.length;
    var st = null;

    medias.forEach(function (m, i) { m.style.zIndex = i === 0 ? 2 : 0; });

    function setPlace(i, instant) {
      if (i === current) return;
      var dir = i > current ? 1 : -1;
      var prev = medias[current];
      var next = medias[i];
      var info = DATA.places[i];
      current = i;
      tabs.forEach(function (t, k) { t.setAttribute('aria-selected', k === i ? 'true' : 'false'); });
      counter.textContent = pad(i + 1);
      medias.forEach(function (m) { if (m !== prev && m !== next) { m.style.zIndex = 0; m.classList.remove('is-active'); } });
      prev.style.zIndex = 1;
      next.style.zIndex = 2;
      next.classList.add('is-active');
      var nimg = $('img', next);
      if (REDUCE || instant) {
        gsap.set(next, { clipPath: 'inset(0% 0% 0% 0%)' });
        prev.classList.remove('is-active');
        gsap.set(prev, { clipPath: 'inset(100% 0% 0% 0%)' });
      } else {
        gsap.killTweensOf([next, nimg]);
        gsap.fromTo(next, { clipPath: dir > 0 ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)' }, {
          clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'viceInOut',
          onComplete: function () { if (prev !== medias[current]) { prev.classList.remove('is-active'); gsap.set(prev, { clipPath: 'inset(100% 0% 0% 0%)' }); } }
        });
        gsap.fromTo(nimg, { scale: 1.3, yPercent: dir * 6 }, { scale: 1, yPercent: 0, duration: 1.8, ease: 'expo.out' });
      }
      var swap = function () {
        logo.src = 'assets/img/places/' + info.key + '-logo.webp';
        logo.alt = info.name;
        desc.textContent = info.desc;
        cardImg.src = 'assets/img/places/' + info.key + '-2.webp';
      };
      if (REDUCE || instant) { swap(); return; }
      gsap.timeline()
        .to([logo, desc], { autoAlpha: 0, y: -14 * dir, filter: 'blur(6px)', duration: 0.3, ease: 'power2.in', stagger: 0.04 })
        .add(swap)
        .fromTo([logo, desc], { y: 18 * dir, filter: 'blur(6px)' }, { autoAlpha: 1, y: 0, filter: 'blur(0px)', duration: 0.8, ease: 'expo.out', stagger: 0.06 });
      gsap.timeline()
        .to(card, { rotateY: 90, duration: 0.3, ease: 'power2.in' })
        .set(card, { rotate: dir > 0 ? -3 + Math.random() * 8 : 2 - Math.random() * 6 })
        .to(card, { rotateY: 0, duration: 0.7, ease: 'back.out(1.7)' });
    }

    tabs.forEach(function (t, i) {
      t.addEventListener('click', function () {
        if (st) {
          var y = st.start + ((i + 0.5) / count) * (st.end - st.start);
          scrollToTarget(y);
        } else setPlace(i);
      });
    });

    if (REDUCE) return;
    st = ScrollTrigger.create({
      trigger: '.places',
      pin: '.places__pin',
      start: 'top top',
      end: function () { return '+=' + (count * 75) + '%'; },
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: function (self) {
        var i = Math.min(count - 1, Math.floor(self.progress * count));
        setPlace(i);
      }
    });
    gsap.from('.places__head .display', { yPercent: 40, autoAlpha: 0, duration: 1.4, scrollTrigger: { trigger: '.places', start: 'top 70%', once: true } });
    gsap.from('.places__list li', { x: -40, autoAlpha: 0, stagger: 0.06, duration: 1.1, scrollTrigger: { trigger: '.places', start: 'top 60%', once: true } });
  })();

  /* ---------------------------------------------------------------------
     7. Rádio — entrada e dock
     --------------------------------------------------------------------- */
  ScrollTrigger.create({
    trigger: '#radio', start: 'top 70%', end: 'bottom 30%',
    onToggle: function (s) {
      Radio.vizVisible = s.isActive;
      inRadioSection = s.isActive;
      syncDock();
    }
  });
  if (!REDUCE) {
    gsap.from('.station', {
      scale: 0, autoAlpha: 0, duration: 1.1, stagger: 0.07, ease: 'back.out(1.8)',
      scrollTrigger: { trigger: '#radioWheel', start: 'top 80%', once: true },
      clearProps: 'scale'
    });
    gsap.from('.wheel__hub', { scale: 0.6, autoAlpha: 0, duration: 1.4, ease: 'expo.out', scrollTrigger: { trigger: '#radioWheel', start: 'top 80%', once: true } });
    gsap.from('.radio__panel', { x: 60, autoAlpha: 0, duration: 1.3, scrollTrigger: { trigger: '.radio__panel', start: 'top 85%', once: true } });
  }

  /* ---------------------------------------------------------------------
     8. A capa se monta
     --------------------------------------------------------------------- */
  (function assemble() {
    var shards = $$('.shard');
    var logo = $('.assemble__logo');
    if (REDUCE) return;
    var rnd = function (a, b) { return a + Math.random() * (b - a); };
    var tl = gsap.timeline({
      scrollTrigger: { trigger: '.assemble', pin: '.assemble__pin', start: 'top top', end: '+=170%', scrub: 1, invalidateOnRefresh: true }
    });
    shards.forEach(function (s, i) {
      var x = parseFloat(s.style.getPropertyValue('--x')) + parseFloat(s.style.getPropertyValue('--w')) / 2 - 1280;
      var y = parseFloat(s.style.getPropertyValue('--y')) + parseFloat(s.style.getPropertyValue('--h')) / 2 - 720;
      tl.fromTo(s, {
        xPercent: x / 4 + rnd(-60, 60),
        yPercent: y / 3 + rnd(-80, 80),
        z: rnd(-900, 500),
        rotate: rnd(-38, 38),
        rotateX: rnd(-50, 50),
        rotateY: rnd(-50, 50),
        scale: rnd(0.55, 1.25),
        autoAlpha: 0
      }, {
        xPercent: 0, yPercent: 0, z: 0, rotate: 0, rotateX: 0, rotateY: 0, scale: 1, autoAlpha: 1,
        duration: 0.6, ease: 'power3.out'
      }, i * 0.035);
    });
    tl.fromTo(logo, { scale: 2.6, autoAlpha: 0, filter: 'blur(16px)' }, { scale: 1, autoAlpha: 1, filter: 'blur(0px)', duration: 0.35, ease: 'back.out(1.6)' }, 0.62)
      .fromTo('.assemble__canvas', { scale: 0.96 }, { scale: 1.02, duration: 0.4, ease: 'none' }, 0.6)
      .from('.assemble__copy .display', { yPercent: 50, autoAlpha: 0, duration: 0.25 }, 0.1);
  })();

  /* ---------------------------------------------------------------------
     9. Galeria — esteiras infinitas + lightbox
     --------------------------------------------------------------------- */
  var originals = $$('.gitem');
  originals.forEach(function (item, i) { item.dataset.index = i; });
  (function rows() {
    $$('.grow').forEach(function (row) {
      var track = $('.grow__track', row);
      var dir = parseFloat(row.dataset.dir) || -1;
      $$('.gitem', track).forEach(function (item) {
        var c = item.cloneNode(true);
        c.setAttribute('aria-hidden', 'true');
        c.tabIndex = -1;
        c.dataset.clone = '1';
        track.appendChild(c);
      });
      var x = 0, half = 0, speedK = 1, hover = false, dragging = false, startX = 0, startPos = 0, moved = 0;
      function measure() { half = track.scrollWidth / 2; }
      measure();
      window.addEventListener('resize', measure);
      var setX = gsap.quickSetter(track, 'x', 'px');
      var setSkew = gsap.quickSetter(track, 'skewX', 'deg');
      var skew = 0;
      gsap.ticker.add(function (t, dt) {
        if (REDUCE) return;
        var vel = lenis ? lenis.velocity : 0;
        speedK += ((hover ? 0.15 : 1) - speedK) * 0.06;
        if (!dragging) x += dir * (0.045 * dt * speedK) + dir * vel * 0.35;
        if (half > 0) x = gsap.utils.wrap(-half, 0, x);
        setX(x);
        skew += ((clamp(vel * -0.25, -6, 6)) - skew) * 0.12;
        setSkew(skew);
      });
      row.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hover = true; });
      row.addEventListener('pointerleave', function () { hover = false; });
      row.addEventListener('pointerdown', function (e) {
        dragging = true; moved = 0; startX = e.clientX; startPos = x;
      });
      window.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        var dx = e.clientX - startX;
        moved = Math.max(moved, Math.abs(dx));
        x = startPos + dx;
      });
      window.addEventListener('pointerup', function () { dragging = false; });
      window.addEventListener('pointercancel', function () { dragging = false; });
      row.addEventListener('click', function (e) {
        if (moved > 8) { e.preventDefault(); e.stopPropagation(); }
      }, true);
    });
  })();

  var lb = $('#lightbox');
  var lbImg = $('.lightbox__img', lb);
  var lbIndex = 0;
  var lbOpen = false;
  function lbShow(i, dir) {
    lbIndex = (i + originals.length) % originals.length;
    var item = originals[lbIndex];
    var im = $('img', item);
    var apply = function () {
      lbImg.src = item.dataset.full;
      lbImg.alt = im.alt;
      $('.lightbox__count', lb).textContent = pad(lbIndex + 1) + ' / ' + pad(originals.length);
      $('.lightbox__text', lb).textContent = im.alt;
    };
    if (REDUCE || !dir) { apply(); return; }
    gsap.timeline()
      .to(lbImg, { x: -60 * dir, autoAlpha: 0, duration: 0.25, ease: 'power2.in' })
      .add(apply)
      .fromTo(lbImg, { x: 60 * dir }, { x: 0, autoAlpha: 1, duration: 0.7, ease: 'expo.out' });
  }
  function lbOpenAt(i) {
    lastFocus = document.activeElement;
    lbOpen = true;
    lb.hidden = false;
    if (lenis) lenis.stop();
    lbShow(i);
    if (!REDUCE) {
      gsap.fromTo('.lightbox__backdrop', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.5 });
      gsap.fromTo(lbImg, { scale: 0.9, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.9, ease: 'expo.out' });
    }
    $('.lightbox__close', lb).focus({ preventScroll: true });
  }
  function lbClose() {
    if (!lbOpen) return;
    lbOpen = false;
    var fin = function () { lb.hidden = true; if (lenis) lenis.start(); if (lastFocus) lastFocus.focus({ preventScroll: true }); };
    if (REDUCE) return fin();
    gsap.to(lbImg, { scale: 0.94, autoAlpha: 0, duration: 0.3, ease: 'power2.in' });
    gsap.to('.lightbox__backdrop', { autoAlpha: 0, duration: 0.35, onComplete: fin });
  }
  $('.gallery__rows').addEventListener('click', function (e) {
    var item = e.target.closest('.gitem');
    if (!item) return;
    lbOpenAt(parseInt(item.dataset.index, 10) || 0);
  });
  lb.addEventListener('click', function (e) {
    if (e.target.closest('[data-close]')) lbClose();
    else if (e.target.closest('[data-lb-prev]')) lbShow(lbIndex - 1, -1);
    else if (e.target.closest('[data-lb-next]')) lbShow(lbIndex + 1, 1);
  });
  (function swipe() {
    var sx = null;
    lb.addEventListener('pointerdown', function (e) { sx = e.clientX; });
    lb.addEventListener('pointerup', function (e) {
      if (sx === null) return;
      var dx = e.clientX - sx; sx = null;
      if (Math.abs(dx) > 50) lbShow(lbIndex + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
    });
  })();

  /* Teclado global: Esc fecha diálogos, setas navegam no lightbox, Tab fica preso no diálogo */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      if (modalOpen && !document.fullscreenElement && !(e.target.closest && e.target.closest('.vp__menu'))) closeVideo();
      else if (lbOpen) lbClose();
      else if (menuOpen) closeMenu();
    }
    if (lbOpen && e.key === 'ArrowRight') lbShow(lbIndex + 1, 1);
    if (lbOpen && e.key === 'ArrowLeft') lbShow(lbIndex - 1, -1);
    if (e.key === 'Tab' && (modalOpen || lbOpen)) {
      var dlg = modalOpen ? vmodal : lb;
      var f = $$('button, a[href], iframe, select, input, [tabindex="0"]', dlg).filter(function (n) { return n.offsetParent !== null && !n.disabled; });
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  /* ---------------------------------------------------------------------
     10. Jornada — percentual da espera e linha do tempo
     --------------------------------------------------------------------- */
  (function journey() {
    var pctEl = $('[data-wait-pct]');
    var bar = $('[data-wait-bar]');
    var car = $('[data-wait-car]');
    var now = new Date();
    var total = RELEASE - T1;
    function pct() { return clamp(((Date.now() - T1) / total) * 100, 0, 100); }
    var inView = false;
    function frame() {
      if (inView) pctEl.textContent = pct().toFixed(7).replace('.', ',');
      requestAnimationFrame(frame);
    }
    pctEl.textContent = pct().toFixed(7).replace('.', ',');
    requestAnimationFrame(frame);
    ScrollTrigger.create({ trigger: '.wait', start: 'top bottom', end: 'bottom top', onToggle: function (s) { inView = s.isActive; } });
    var p = pct() / 100;
    if (REDUCE) { gsap.set(bar, { scaleX: p }); gsap.set(car, { left: p * 100 + '%' }); }
    else {
      gsap.fromTo(bar, { scaleX: 0 }, { scaleX: p, duration: 2.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.wait', start: 'top 80%', once: true } });
      gsap.fromTo(car, { left: '0%' }, { left: p * 100 + '%', duration: 2.4, ease: 'expo.inOut', scrollTrigger: { trigger: '.wait', start: 'top 80%', once: true } });
    }

    // itens passados + marcador "hoje"
    var list = $('.timeline');
    var items = $$('.tl', list);
    var lastPast = null;
    items.forEach(function (li) {
      var d = new Date(li.dataset.date + 'T12:00:00');
      if (d <= now) { li.classList.add('is-past'); lastPast = li; }
    });
    var fillEl = document.createElement('li');
    fillEl.className = 'timeline__fill';
    fillEl.setAttribute('aria-hidden', 'true');
    list.prepend(fillEl);
    var today = null;
    if (lastPast && lastPast !== items[items.length - 1]) {
      today = document.createElement('li');
      today.className = 'tl--today';
      var fmt = now.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).replace('.', '');
      today.textContent = 'Você está aqui · ' + fmt;
      lastPast.after(today);
    }
    function todayFrac() {
      var target = today || lastPast;
      if (!target) return 0;
      return clamp((target.offsetTop + target.offsetHeight / 2) / list.offsetHeight, 0, 1);
    }
    if (REDUCE) gsap.set(fillEl, { scaleY: todayFrac() });
    else {
      gsap.fromTo(fillEl, { scaleY: 0 }, {
        scaleY: function () { return todayFrac(); }, ease: 'none',
        scrollTrigger: { trigger: list, start: 'top 70%', end: function () { return 'top+=' + (todayFrac() * list.offsetHeight) + ' 55%'; }, scrub: 0.6, invalidateOnRefresh: true }
      });
      $$('.tl, .tl--today', list).forEach(function (li) {
        gsap.from(li, { y: 50, autoAlpha: 0, duration: 1.1, scrollTrigger: { trigger: li, start: 'top 88%', once: true } });
      });
    }
  })();

  /* ---------------------------------------------------------------------
     11. Final — parallax, agenda (.ics) e compartilhar
     --------------------------------------------------------------------- */
  if (!REDUCE) {
    gsap.fromTo('.finale__bg img', { yPercent: -12 }, { yPercent: 0, ease: 'none', scrollTrigger: { trigger: '.finale', start: 'top bottom', end: 'bottom bottom', scrub: true } });
    gsap.from('.finale__title .script', { autoAlpha: 0, scale: 0.8, rotate: -12, duration: 1.4, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.finale', start: 'top 60%', once: true } });
    gsap.from('.finale__title .display', { yPercent: 40, autoAlpha: 0, duration: 1.6, scrollTrigger: { trigger: '.finale', start: 'top 60%', once: true } });
    gsap.from('.finale .countdown, .finale__note, .finale__actions > *', { y: 30, autoAlpha: 0, duration: 1.2, stagger: 0.08, scrollTrigger: { trigger: '.finale', start: 'top 45%', once: true } });
  }

  $('#addCalendar').addEventListener('click', function () {
    var stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    var ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Contagem GTA VI (fa)//PT-BR',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      'UID:gtavi-preload-20261112@contagem-fa',
      'DTSTAMP:' + stamp,
      'DTSTART;VALUE=DATE:20261112',
      'DTEND;VALUE=DATE:20261113',
      'SUMMARY:GTA VI — começa o pré-download',
      'DESCRIPTION:Pré-download de Grand Theft Auto VI liberado (PS5 e Xbox Series X|S).',
      'END:VEVENT',
      'BEGIN:VEVENT',
      'UID:gtavi-launch-20261119@contagem-fa',
      'DTSTAMP:' + stamp,
      'DTSTART;VALUE=DATE:20261119',
      'DTEND;VALUE=DATE:20261120',
      'SUMMARY:Lançamento de GTA VI',
      'DESCRIPTION:Grand Theft Auto VI chega ao PlayStation 5 e Xbox Series X|S. Nos vemos em Leonida!',
      'URL:https://www.rockstargames.com/VI',
      'BEGIN:VALARM',
      'TRIGGER:-PT12H',
      'ACTION:DISPLAY',
      'DESCRIPTION:GTA VI chega amanhã!',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    var blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'gta-vi-lancamento.ics';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast('Arquivo de agenda baixado: pré-download (12/11) e lançamento (19/11).');
  });

  $('#shareBtn').addEventListener('click', function () {
    var p = getParts(new Date());
    var text = p.launched ? 'GTA VI já chegou! Nos vemos em Leonida.' : 'Faltam ' + p.days + ' dias para GTA VI. Nos vemos em Leonida!';
    var url = location.href.split('#')[0];
    if (navigator.share) {
      navigator.share({ title: 'GTA VI — Contagem Regressiva', text: text, url: url }).catch(function () {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(text + ' ' + url).then(function () { toast('Link copiado para a área de transferência!'); }, function () { toast(url); });
    } else toast(url);
  });

  /* ---------------------------------------------------------------------
     Cursor personalizado + botões magnéticos
     --------------------------------------------------------------------- */
  if (FINE && !REDUCE) {
    root.classList.add('has-cursor');
    var cursor = $('.cursor');
    var dot = $('.cursor__dot', cursor);
    var ring = $('.cursor__ring', cursor);
    var label = $('.cursor__label', cursor);
    var dX = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power3' });
    var dY = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power3' });
    var rX = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3' });
    var rY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3' });
    window.addEventListener('pointermove', function (e) {
      if (e.pointerType !== 'mouse') return;
      dX(e.clientX); dY(e.clientY); rX(e.clientX); rY(e.clientY);
      cursor.classList.remove('is-hidden');
    }, { passive: true });
    document.addEventListener('pointerover', function (e) {
      var t = e.target.closest('[data-cursor]');
      var l = e.target.closest('a, button, [role="slider"], input');
      if (t && !(l && t !== l && t.contains(l) && l.closest('[data-cursor]') !== t)) {
        label.textContent = t.dataset.cursor;
        cursor.classList.add('is-label');
        cursor.classList.remove('is-link');
      } else {
        cursor.classList.remove('is-label');
        cursor.classList.toggle('is-link', !!l);
      }
    });
    document.addEventListener('pointerdown', function () { cursor.classList.add('is-down'); });
    document.addEventListener('pointerup', function () { cursor.classList.remove('is-down'); });
    document.addEventListener('mouseleave', function () { cursor.classList.add('is-hidden'); });

    $$('[data-magnetic]').forEach(function (el) {
      var qx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' });
      var qy = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' });
      el.addEventListener('pointermove', function (e) {
        var r = el.getBoundingClientRect();
        qx((e.clientX - (r.left + r.width / 2)) * 0.25);
        qy((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      el.addEventListener('pointerleave', function () {
        gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.4)' });
      });
    });
  }

  /* ---------------------------------------------------------------------
     Acabamento: recalcular após imagens tardias e mudanças de movimento
     --------------------------------------------------------------------- */
  window.addEventListener('load', function () { ScrollTrigger.refresh(); });
  reduceMQ.addEventListener && reduceMQ.addEventListener('change', function () { location.reload(); });
})();
