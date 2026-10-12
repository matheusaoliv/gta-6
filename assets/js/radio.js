/* Rádio Leonida — player das prévias oficiais das estações de GTA VI.
   O áudio vem direto de rockstargames.com (sem CORS), então o visualizador
   usa envelopes de energia pré-calculados (radio-levels.js) sincronizados
   com o tempo de reprodução. */
(function () {
  'use strict';

  var STORAGE_KEY = 'vi-radio';
  var data = window.VI_DATA;
  var stations = data.stations;

  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    var m = Math.floor(t / 60), s = Math.floor(t % 60);
    return m + ':' + (s < 10 ? '0' : '') + s;
  }
  function load() { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); } catch (e) { return {}; } }
  function save(obj) { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(obj)); } catch (e) { /* storage indisponível */ } }

  var ALPH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
  var LUT = {};
  for (var i = 0; i < ALPH.length; i++) LUT[ALPH.charAt(i)] = i / 63;

  var Radio = {
    index: 0,
    playing: false,
    started: false,
    trackIndex: -1,
    listeners: [],
    bars: [],
    barVals: [],
    bands: [0, 0, 0, 0],

    init: function (opts) {
      opts = opts || {};
      this.toast = opts.toast || function () {};
      this.reduce = !!opts.reduce;
      var saved = load();
      this.volume = typeof saved.volume === 'number' ? saved.volume : 0.8;
      this.index = typeof saved.index === 'number' && saved.index < stations.length ? saved.index : 0;

      this.audio = new Audio();
      this.audio.preload = 'none';
      this.audio.volume = this.volume;
      this.audio.setAttribute('playsinline', '');
      this._bindAudio();

      this.root = $('#radio');
      this.wheel = $('#radioWheel');
      this.stationsEl = $('.wheel__stations', this.wheel);
      this.hubLogo = $('.hub__logo', this.wheel);
      this.hubHosts = $('.hub__hosts', this.wheel);
      this.ring = $('.hub__progress-bar', this.wheel);
      this.trackEl = $('.radio__track', this.root);
      this.artistEl = $('.radio__artist', this.root);
      this.tracksEl = $('.radio__tracks', this.root);
      this.vizEl = $('.radio__viz', this.root);
      this.curEl = $('[data-radio-cur]', this.root);
      this.durEl = $('[data-radio-dur]', this.root);
      this.seekEl = $('[data-radio-seek]', this.root);
      this.seekFill = $('span', this.seekEl);
      this.bgImgs = $$('.radio__bg-img', this.root);
      this.hud = $('#radioHud');
      this.dock = $('#dock');

      this._buildWheel();
      this._buildViz();
      this._bindUI();
      this._applyStation(false);
      this._loop = this._loop.bind(this);
      requestAnimationFrame(this._loop);
    },

    on: function (fn) { this.listeners.push(fn); },
    _emit: function () {
      for (var i = 0; i < this.listeners.length; i++) this.listeners[i](this);
    },

    /* ---------- construção da interface ---------- */
    _buildWheel: function () {
      var self = this;
      var step = 360 / stations.length;
      stations.forEach(function (st, i) {
        var b = document.createElement('button');
        b.type = 'button';
        b.className = 'station';
        b.setAttribute('role', 'radio');
        b.setAttribute('aria-checked', 'false');
        b.setAttribute('aria-label', st.name + ' — ' + st.genre);
        b.style.setProperty('--a', (-90 + i * step) + 'deg');
        b.style.setProperty('--glow', st.color);
        b.dataset.cursor = 'Sintonizar';
        var img = document.createElement('img');
        img.src = 'assets/img/radio/' + st.key + '-icon.webp';
        img.alt = '';
        img.width = 480; img.height = 480;
        img.loading = 'lazy';
        img.decoding = 'async';
        b.appendChild(img);
        b.addEventListener('click', function () {
          if (self.index === i && self.playing) return;
          self.tune(i, true);
        });
        self.stationsEl.appendChild(b);
      });
      this.stationBtns = $$('.station', this.stationsEl);
      // navegação por setas no grupo de rádio
      this.stationsEl.addEventListener('keydown', function (e) {
        var k = e.key;
        if (k !== 'ArrowRight' && k !== 'ArrowLeft' && k !== 'ArrowUp' && k !== 'ArrowDown') return;
        e.preventDefault();
        var dir = (k === 'ArrowRight' || k === 'ArrowDown') ? 1 : -1;
        var n = (self.index + dir + stations.length) % stations.length;
        self.tune(n, self.playing);
        self.stationBtns[n].focus();
      });
    },

    _buildViz: function () {
      var count = window.innerWidth < 640 ? 22 : 34;
      var frag = document.createDocumentFragment();
      for (var i = 0; i < count; i++) {
        var bar = document.createElement('i');
        frag.appendChild(bar);
        this.barVals.push(0);
      }
      this.vizEl.appendChild(frag);
      this.bars = $$('i', this.vizEl);
    },

    _bindUI: function () {
      var self = this;
      document.addEventListener('click', function (e) {
        var t = e.target.closest('[data-radio-toggle], [data-radio-next], [data-radio-prev]');
        if (!t) return;
        if (t.hasAttribute('data-radio-toggle')) self.toggle();
        else if (t.hasAttribute('data-radio-next')) self.next();
        else self.prev();
      });
      var vol = $('[data-radio-volume]');
      if (vol) {
        vol.value = this.volume;
        vol.addEventListener('input', function () { self.setVolume(parseFloat(vol.value)); });
      }
      // barra de progresso (clique/arrasto/teclado)
      var dragging = false;
      function seekFromEvent(e) {
        var r = self.seekEl.getBoundingClientRect();
        var p = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
        if (isFinite(self.audio.duration)) self.audio.currentTime = p * self.audio.duration;
      }
      this.seekEl.addEventListener('pointerdown', function (e) {
        if (!self.started) return;
        dragging = true;
        self.seekEl.setPointerCapture(e.pointerId);
        seekFromEvent(e);
      });
      this.seekEl.addEventListener('pointermove', function (e) { if (dragging) seekFromEvent(e); });
      this.seekEl.addEventListener('pointerup', function () { dragging = false; });
      this.seekEl.addEventListener('keydown', function (e) {
        if (!isFinite(self.audio.duration)) return;
        if (e.key === 'ArrowRight') { self.audio.currentTime = Math.min(self.audio.duration, self.audio.currentTime + 5); e.preventDefault(); }
        if (e.key === 'ArrowLeft') { self.audio.currentTime = Math.max(0, self.audio.currentTime - 5); e.preventDefault(); }
      });
    },

    _bindAudio: function () {
      var self = this, a = this.audio;
      a.addEventListener('playing', function () { self.playing = true; self._emit(); });
      a.addEventListener('pause', function () { self.playing = false; self._emit(); });
      a.addEventListener('ended', function () { self.next(true); });
      a.addEventListener('loadedmetadata', function () {
        self.durEl.textContent = fmt(a.duration);
        if (self._pendingSeek != null) { a.currentTime = self._pendingSeek; self._pendingSeek = null; }
      });
      a.addEventListener('timeupdate', function () { self._onTime(); });
      a.addEventListener('error', function () {
        if (!a.getAttribute('src')) return;
        self.playing = false;
        self._emit();
        self.toast('Não foi possível carregar a prévia desta estação agora. Ouça no site oficial: rockstargames.com/VI/music');
      });
    },

    /* ---------- controle ---------- */
    _ensureAudioCtx: function () {
      if (this.ctx || this.reduce) return;
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      try {
        this.ctx = new AC();
        var len = Math.floor(this.ctx.sampleRate * 0.6);
        var buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
        var d = buf.getChannelData(0);
        for (var i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (0.6 + 0.4 * Math.sin(i / 90));
        this.noise = buf;
      } catch (e) { this.ctx = null; }
    },

    _static: function () {
      if (!this.ctx || !this.noise) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      var t = this.ctx.currentTime;
      var src = this.ctx.createBufferSource();
      src.buffer = this.noise;
      var bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(1800, t);
      bp.frequency.exponentialRampToValueAtTime(600, t + 0.45);
      bp.Q.value = 0.8;
      var g = this.ctx.createGain();
      var v = 0.16 * this.volume;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, v), t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.5);
      src.connect(bp); bp.connect(g); g.connect(this.ctx.destination);
      src.start(t);
      src.stop(t + 0.55);
    },

    /* Chamado dentro de um gesto do usuário (clique). */
    start: function () {
      this.tune(this.index, true);
    },

    tune: function (i, autoplay) {
      var st = stations[i];
      var changed = i !== this.index || !this.audio.getAttribute('src');
      this.index = i;
      this.trackIndex = -1;
      save({ index: i, volume: this.volume });
      this._ensureAudioCtx();
      if (changed) {
        this.audio.src = st.src;
        this.curEl.textContent = '0:00';
        this.durEl.textContent = '0:00';
      }
      this._applyStation(true);
      if (autoplay) {
        if (changed) this._static();
        this.started = true;
        var p = this.audio.play();
        var self = this;
        if (p && p.catch) {
          p.catch(function (err) {
            if (err && err.name === 'NotAllowedError') self.toast('Toque em “Tocar” para ligar a rádio.');
          });
        }
        this._showHud(st.name, st.genre + ' · com ' + st.hosts);
      }
      this._emit();
    },

    toggle: function () {
      if (!this.audio.getAttribute('src') || !this.started) { this.tune(this.index, true); return; }
      if (this.audio.paused) {
        this._ensureAudioCtx();
        this.audio.play().catch(function () {});
      } else {
        this.audio.pause();
      }
    },

    play: function () { if (this.audio.paused) this.toggle(); },
    pause: function () { if (!this.audio.paused) this.audio.pause(); },
    next: function (auto) { this.tune((this.index + 1) % stations.length, auto === true ? true : (this.playing || !this.started)); },
    prev: function () { this.tune((this.index - 1 + stations.length) % stations.length, this.playing || !this.started); },

    seekTo: function (t) {
      if (!this.started || !this.audio.getAttribute('src')) {
        this._pendingSeek = t;
        this.tune(this.index, true);
        return;
      }
      if (this.audio.readyState >= 1) this.audio.currentTime = t;
      else this._pendingSeek = t;
      if (this.audio.paused) this.audio.play().catch(function () {});
    },

    setVolume: function (v) {
      this.volume = v;
      this.audio.volume = v;
      save({ index: this.index, volume: v });
    },

    /* Pausa temporária (ex.: ao abrir um trailer) e retomada. */
    duck: function () {
      this._wasPlaying = this.playing;
      this.pause();
    },
    unduck: function () {
      if (this._wasPlaying) this.play();
      this._wasPlaying = false;
    },

    /* ---------- estado visual ---------- */
    _applyStation: function (animate) {
      var st = stations[this.index];
      var self = this;
      this.stationBtns.forEach(function (b, i) { b.setAttribute('aria-checked', i === self.index ? 'true' : 'false'); b.tabIndex = i === self.index ? 0 : -1; });
      var angle = -90 + this.index * (360 / stations.length);
      this.wheel.style.setProperty('--pointer', angle + 'deg');
      this.root.style.setProperty('--station', st.color);
      this.ring.style.stroke = st.color;

      var swap = function () {
        self.hubLogo.src = 'assets/img/radio/' + st.key + '-logo.webp';
        self.hubLogo.alt = st.name;
        self.hubHosts.textContent = 'Com ' + st.hosts;
      };
      if (animate && window.gsap && !this.reduce) {
        gsap.timeline()
          .to([this.hubLogo, this.hubHosts], { autoAlpha: 0, scale: 0.85, filter: 'blur(8px)', duration: 0.22, ease: 'power2.in', onComplete: swap })
          .to([this.hubLogo, this.hubHosts], { autoAlpha: 1, scale: 1, filter: 'blur(0px)', duration: 0.6, ease: 'back.out(2)' });
      } else swap();

      // fundo desfocado em crossfade
      var next = this.bgImgs[0].classList.contains('is-active') ? this.bgImgs[1] : this.bgImgs[0];
      var cur = next === this.bgImgs[0] ? this.bgImgs[1] : this.bgImgs[0];
      var url = 'assets/img/radio/' + st.key + '-bg.webp';
      if (cur.getAttribute('src') !== url) {
        next.onload = function () { next.classList.add('is-active'); cur.classList.remove('is-active'); };
        next.src = url;
      }

      // lista de faixas
      this.tracksEl.innerHTML = '';
      st.tracks.forEach(function (tr, i) {
        var li = document.createElement('li');
        var b = document.createElement('button');
        b.type = 'button';
        b.className = tr.dj ? 'is-dj' : '';
        b.innerHTML = '<span class="t-time"></span><span><span class="t-title"></span><span class="t-artist"></span></span>';
        b.querySelector('.t-time').textContent = fmt(tr.t);
        b.querySelector('.t-title').textContent = tr.dj ? 'Locução · ' + tr.artist : tr.title;
        b.querySelector('.t-artist').textContent = tr.dj ? st.name : tr.artist;
        b.setAttribute('aria-label', (tr.dj ? 'Locução de ' + tr.artist : tr.title + ', de ' + tr.artist) + ' — ' + fmt(tr.t));
        b.addEventListener('click', function () { self.seekTo(tr.t + 0.05); });
        li.appendChild(b);
        self.tracksEl.appendChild(li);
      });
      this.trackBtns = $$('button', this.tracksEl);
      this._setNow(st.tracks[0], 0, false);
      this._updateDock();
      this._updateMediaSession();
    },

    _setNow: function (tr, idx, announce) {
      var st = stations[this.index];
      this.trackIndex = idx;
      this.trackEl.textContent = tr.dj ? st.name : tr.title;
      this.artistEl.textContent = tr.dj ? 'No ar: ' + tr.artist : tr.artist;
      if (this.trackBtns) this.trackBtns.forEach(function (b, i) { b.classList.toggle('is-current', i === idx); });
      this._updateDock();
      this._updateMediaSession();
      if (announce && !tr.dj && this.playing) this._showHud(st.name, tr.title + ' — ' + tr.artist);
    },

    _onTime: function () {
      var a = this.audio, st = stations[this.index], t = a.currentTime;
      var idx = 0;
      for (var i = 0; i < st.tracks.length; i++) if (t >= st.tracks[i].t) idx = i;
      if (idx !== this.trackIndex) this._setNow(st.tracks[idx], idx, true);
      this.curEl.textContent = fmt(t);
      var p = isFinite(a.duration) && a.duration > 0 ? t / a.duration : 0;
      this.seekFill.style.transform = 'scaleX(' + p + ')';
      this.seekEl.setAttribute('aria-valuenow', Math.round(p * 100));
      this.ring.style.strokeDashoffset = String(351.86 * (1 - p));
      var dp = this.dock && this.dock.querySelector('.dock__progress span');
      if (dp) dp.style.transform = 'scaleX(' + p + ')';
    },

    _updateDock: function () {
      if (!this.dock) return;
      var st = stations[this.index];
      var tr = st.tracks[Math.max(0, this.trackIndex)];
      $('.dock__art img', this.dock).src = 'assets/img/radio/' + st.key + '-icon.webp';
      $('.dock__station', this.dock).textContent = st.name;
      $('.dock__track-inner', this.dock).textContent = tr.dj ? 'Locução · ' + tr.artist : tr.title + ' — ' + tr.artist;
    },

    _updateMediaSession: function () {
      if (!('mediaSession' in navigator) || !window.MediaMetadata) return;
      var st = stations[this.index];
      var tr = st.tracks[Math.max(0, this.trackIndex)];
      var self = this;
      try {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: tr.dj ? st.name : tr.title,
          artist: tr.dj ? tr.artist : tr.artist,
          album: st.name + ' · GTA VI (prévia oficial)',
          artwork: [{ src: new URL('assets/img/radio/' + st.key + '-icon.webp', location.href).href, sizes: '480x480', type: 'image/webp' }]
        });
        if (!this._msBound) {
          this._msBound = true;
          navigator.mediaSession.setActionHandler('play', function () { self.play(); });
          navigator.mediaSession.setActionHandler('pause', function () { self.pause(); });
          navigator.mediaSession.setActionHandler('nexttrack', function () { self.next(); });
          navigator.mediaSession.setActionHandler('previoustrack', function () { self.prev(); });
        }
      } catch (e) { /* Media Session opcional */ }
    },

    _showHud: function (title, sub) {
      if (!this.hud) return;
      var s = $('.radio-hud__station', this.hud), t = $('.radio-hud__track', this.hud);
      s.textContent = title;
      t.textContent = sub;
      if (!window.gsap) return;
      gsap.killTweensOf(this.hud);
      gsap.timeline()
        .fromTo(this.hud, { autoAlpha: 0, y: -12 }, { autoAlpha: 1, y: 0, duration: 0.35, ease: 'power3.out' })
        .to(this.hud, { autoAlpha: 0, y: -8, duration: 0.6, ease: 'power2.in' }, '+=2.6');
    },

    /* ---------- visualizador ---------- */
    _levelsAt: function (t) {
      var lv = window.VI_LEVELS && window.VI_LEVELS[stations[this.index].key];
      if (!lv) return null;
      var f = t * lv.fps;
      var i0 = Math.floor(f), fr = f - i0;
      var out = [];
      for (var b = 0; b < lv.bands.length; b++) {
        var s = lv.bands[b];
        if (i0 >= s.length - 1) { out.push(0); continue; }
        var a = LUT[s.charAt(i0)] || 0, c = LUT[s.charAt(i0 + 1)] || 0;
        out.push(a + (c - a) * fr);
      }
      return out;
    },

    _loop: function (now) {
      requestAnimationFrame(this._loop);
      if (this.reduce) return;
      var active = this.playing && !this.audio.paused;
      var lv = active ? this._levelsAt(this.audio.currentTime) : null;
      var n = this.bars.length;
      var time = now / 1000;
      for (var b = 0; b < 4; b++) {
        var target = lv ? lv[b] : 0;
        this.bands[b] += (target - this.bands[b]) * (target > this.bands[b] ? 0.55 : 0.12);
      }
      if (!this.vizVisible && !active) return;
      for (var i = 0; i < n; i++) {
        var x = i / (n - 1) * 3; // 0..3 ao longo das 4 bandas
        var k = Math.min(2, Math.floor(x)), fr = x - k;
        var v = this.bands[k] * (1 - fr) + this.bands[k + 1] * fr;
        var wob = (0.45 + 0.55 * (0.5 + 0.5 * Math.sin(time * (4.2 + i * 0.53) + i * 2.1))) * (0.7 + 0.3 * Math.sin(time * 1.7 + i * 0.9));
        var tgt = active ? Math.max(0.04, Math.min(1, v * wob * 1.35)) : 0.04;
        var cur = this.barVals[i];
        cur += (tgt - cur) * (tgt > cur ? 0.5 : 0.14);
        this.barVals[i] = cur;
        this.bars[i].style.transform = 'scaleY(' + cur.toFixed(3) + ')';
      }
      this.root.style.setProperty('--bass', this.bands[0].toFixed(3));
    }
  };

  window.Radio = Radio;
})();
