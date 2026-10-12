/* Verificação de idade + player de vídeo próprio (HTML5).
   - O "An Extended Look" é transmitido em MP4 direto do CDN de vídeo da Rockstar,
     com legendas oficiais (pt-BR incluída), seletor de qualidade e retomada.
   - Os trailers 1 e 2 só podem ser vistos no YouTube (embed bloqueado pelo dono),
     então mostramos um painel com o player oficial em janela. */
(function () {
  'use strict';

  var MIN_AGE = 18;
  var KEY_OK = 'vi-age-ok';
  var KEY_DENIED = 'vi-age-denied';
  var KEY_VOL = 'vi-video-volume';
  var KEY_QUALITY = 'vi-video-quality';

  var store = {
    get: function (s, k) { try { return window[s].getItem(k); } catch (e) { return null; } },
    set: function (s, k, v) { try { window[s].setItem(k, v); } catch (e) { /* armazenamento indisponível */ } },
    del: function (s, k) { try { window[s].removeItem(k); } catch (e) { /* idem */ } }
  };

  var ICON = {
    play: 'M8 5v14l11-7z',
    pause: 'M6 5h4v14H6zM14 5h4v14h-4z',
    back: 'M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z',
    fwd: 'M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z',
    vol: 'M3 10v4h4l5 4V6L7 10H3zm13.5 2A4.5 4.5 0 0 0 14 8v8a4.47 4.47 0 0 0 2.5-4zM14 3.2v2.1a7 7 0 0 1 0 13.4v2.1a9 9 0 0 0 0-17.6z',
    mute: 'M3 10v4h4l5 4V6L7 10H3zm17.7-1.3-1.4-1.4L17 9.6l-2.3-2.3-1.4 1.4 2.3 2.3-2.3 2.3 1.4 1.4 2.3-2.3 2.3 2.3 1.4-1.4-2.3-2.3z',
    cc: 'M19 4H5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm-8 7H9.5v-.5h-2v3h2V13H11v1a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1zm7 0h-1.5v-.5h-2v3h2V13H18v1a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1z',
    pip: 'M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z',
    fs: 'M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z',
    fsExit: 'M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z'
  };
  function svg(d) { return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '"/></svg>'; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(t) {
    if (!isFinite(t) || t < 0) t = 0;
    var h = Math.floor(t / 3600), m = Math.floor((t % 3600) / 60), s = Math.floor(t % 60);
    return (h ? h + ':' + (m < 10 ? '0' : '') : '') + m + ':' + (s < 10 ? '0' : '') + s;
  }

  /* ------------------------------------------------------------------
     Verificação de idade (autodeclaração, como no site da Rockstar)
     ------------------------------------------------------------------ */
  function ageOk() {
    return store.get('localStorage', KEY_OK) === '1' || store.get('sessionStorage', KEY_OK) === '1';
  }
  function denied() { return store.get('sessionStorage', KEY_DENIED) === '1'; }

  var MONTHS = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  function renderDenied(container, cfg) {
    container.innerHTML =
      '<div class="agegate">' +
        '<img class="agegate__bg" alt="" src="' + esc(cfg.poster) + '">' +
        '<div class="agegate__body">' +
          '<span class="tag">Classificação 18 anos</span>' +
          '<p class="agegate__title">Conteúdo indisponível</p>' +
          '<p class="agegate__text">Os vídeos de Grand Theft Auto VI são destinados a maiores de 18 anos. Mas a contagem, a rádio e a galeria continuam liberadas para você.</p>' +
        '</div>' +
      '</div>';
  }

  function renderAgeGate(container, cfg, opts) {
    if (denied()) { renderDenied(container, cfg); return; }
    var year = new Date().getFullYear();
    var days = '<option value="">Dia</option>', months = '<option value="">Mês</option>', years = '<option value="">Ano</option>';
    for (var d = 1; d <= 31; d++) days += '<option value="' + d + '">' + (d < 10 ? '0' : '') + d + '</option>';
    for (var m = 0; m < 12; m++) months += '<option value="' + (m + 1) + '">' + MONTHS[m] + '</option>';
    for (var y = year; y >= year - 100; y--) years += '<option value="' + y + '">' + y + '</option>';

    container.innerHTML =
      '<div class="agegate agegate--form">' +
        '<img class="agegate__bg" alt="" src="' + esc(cfg.poster) + '">' +
        '<form class="agegate__body" novalidate>' +
          '<span class="tag tag--hot">Classificação 18 anos · ESRB Mature 17+</span>' +
          '<p class="agegate__title" id="ageTitle">Verificação de idade</p>' +
          '<p class="agegate__text">Os vídeos de GTA VI mostram violência, drogas e linguagem forte. Informe sua data de nascimento para continuar.</p>' +
          '<fieldset class="dob" aria-labelledby="ageTitle">' +
            '<label><span>Dia</span><select name="d" required>' + days + '</select></label>' +
            '<label><span>Mês</span><select name="m" required>' + months + '</select></label>' +
            '<label><span>Ano</span><select name="y" required>' + years + '</select></label>' +
          '</fieldset>' +
          '<label class="check"><input type="checkbox" name="remember" checked> <span>Lembrar neste dispositivo</span></label>' +
          '<p class="agegate__error" role="alert" hidden></p>' +
          '<button class="btn btn--sun" type="submit"><span class="btn__icon" aria-hidden="true">' + svg(ICON.play) + '</span><span class="btn__label">Confirmar e assistir</span></button>' +
          '<p class="agegate__fine">Autodeclaração, como no site oficial da Rockstar. Nada é enviado: a resposta fica só no seu navegador.</p>' +
        '</form>' +
      '</div>';

    var form = container.querySelector('form');
    var err = form.querySelector('.agegate__error');
    form.querySelector('select').focus({ preventScroll: true });
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var dd = parseInt(form.d.value, 10), mm = parseInt(form.m.value, 10), yy = parseInt(form.y.value, 10);
      if (!dd || !mm || !yy) { err.textContent = 'Preencha dia, mês e ano.'; err.hidden = false; return; }
      var birth = new Date(yy, mm - 1, dd);
      if (birth.getDate() !== dd || birth.getMonth() !== mm - 1) { err.textContent = 'Essa data não existe. Confira o dia e o mês.'; err.hidden = false; return; }
      var now = new Date();
      var age = now.getFullYear() - yy - ((now.getMonth() < mm - 1 || (now.getMonth() === mm - 1 && now.getDate() < dd)) ? 1 : 0);
      if (age < MIN_AGE) {
        store.set('sessionStorage', KEY_DENIED, '1');
        renderDenied(container, cfg);
        if (opts.onDenied) opts.onDenied();
        return;
      }
      store.set('sessionStorage', KEY_OK, '1');
      if (form.remember.checked) store.set('localStorage', KEY_OK, '1');
      opts.onPass();
    });
  }

  /* ------------------------------------------------------------------
     Painel para vídeos que só tocam no YouTube
     ------------------------------------------------------------------ */
  function renderYoutubeOnly(container, cfg, opts) {
    var watch = 'https://www.youtube.com/watch?v=' + cfg.youtube;
    container.innerHTML =
      '<div class="agegate ytonly">' +
        '<img class="agegate__bg" alt="" src="' + esc(cfg.poster) + '">' +
        '<div class="agegate__body">' +
          '<span class="tag">' + esc(cfg.meta) + '</span>' +
          '<p class="agegate__title">Este trailer só toca no YouTube</p>' +
          '<p class="agegate__text">A Rockstar bloqueou a reprodução deste vídeo fora do YouTube (erro 150 do player), então nenhum site consegue exibi-lo incorporado, nem com verificação de idade. Abra o player oficial numa janela por cima do site:</p>' +
          '<div class="agegate__actions">' +
            '<button class="btn btn--sun" type="button" data-yt-popup><span class="btn__icon" aria-hidden="true">' + svg(ICON.play) + '</span><span class="btn__label">Assistir em janela</span></button>' +
            '<a class="btn btn--glass" target="_blank" rel="noopener" href="' + watch + '"><span class="btn__label">Abrir no YouTube ↗</span></a>' +
          '</div>' +
          '<p class="agegate__fine">Quer o arquivo original em 4K? A Rockstar oferece o download (' + esc(cfg.download.size) + ') na <a href="https://www.rockstargames.com/VI/media" target="_blank" rel="noopener">página oficial de mídia</a>; ele abre no VLC e em players de desktop.</p>' +
          '<button class="link-arrow" type="button" data-switch="extended-look">Ou assista ao An Extended Look aqui mesmo <span aria-hidden="true">→</span></button>' +
        '</div>' +
      '</div>';
    container.querySelector('[data-yt-popup]').addEventListener('click', function () {
      var w = Math.min(1280, screen.availWidth - 80), h = Math.round(w * 9 / 16) + 60;
      var left = Math.max(0, Math.round((screen.availWidth - w) / 2)), top = Math.max(0, Math.round((screen.availHeight - h) / 2));
      var win = window.open(watch, 'gtavi-trailer', 'popup=yes,width=' + w + ',height=' + h + ',left=' + left + ',top=' + top);
      if (!win) window.open(watch, '_blank', 'noopener');
      if (opts.onPopup) opts.onPopup();
    });
    container.querySelector('[data-switch]').addEventListener('click', function () { opts.onSwitch('extended-look'); });
  }

  /* ------------------------------------------------------------------
     Player
     ------------------------------------------------------------------ */
  function pickSource(sources) {
    var saved = store.get('localStorage', KEY_QUALITY);
    for (var i = 0; i < sources.length; i++) if (sources[i].label === saved) return i;
    var conn = navigator.connection || {};
    var w = window.innerWidth * Math.min(window.devicePixelRatio || 1, 2);
    var target = conn.saveData ? 360 : (w >= 1200 ? 1080 : 720);
    var best = sources.length - 1;
    for (var j = 0; j < sources.length; j++) if (sources[j].height <= target) { best = j; break; }
    return best;
  }

  function mountPlayer(container, cfg, opts) {
    opts = opts || {};
    var resumeKey = 'vi-resume-' + (opts.key || 'video');
    var srcIdx = pickSource(cfg.sources);
    var captions = cfg.captions || [];

    var root = document.createElement('div');
    root.className = 'vp is-paused';
    root.tabIndex = 0;
    root.setAttribute('role', 'region');
    root.setAttribute('aria-label', 'Player: ' + cfg.title + '. Espaço para tocar ou pausar, setas para avançar e voltar.');
    root.innerHTML =
      '<video class="vp__video" playsinline preload="metadata" crossorigin="anonymous"></video>' +
      '<div class="vp__spinner" aria-hidden="true"></div>' +
      '<button class="vp__big" type="button" aria-label="Tocar">' + svg(ICON.play) + '</button>' +
      '<div class="vp__overlay" hidden></div>' +
      '<div class="vp__menu" role="menu" hidden></div>' +
      '<div class="vp__bar">' +
        '<div class="vp__progress" role="slider" tabindex="0" aria-label="Posição do vídeo" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">' +
          '<span class="vp__rail"></span><span class="vp__buffer"></span><span class="vp__played"></span><span class="vp__thumb"></span><span class="vp__tip">0:00</span>' +
        '</div>' +
        '<div class="vp__row">' +
          '<button class="vp__btn" type="button" data-act="toggle" aria-label="Tocar">' + svg(ICON.play) + '</button>' +
          '<button class="vp__btn" type="button" data-act="back" aria-label="Voltar 10 segundos">' + svg(ICON.back) + '</button>' +
          '<button class="vp__btn" type="button" data-act="fwd" aria-label="Avançar 10 segundos">' + svg(ICON.fwd) + '</button>' +
          '<span class="vp__time"><span data-cur>0:00</span> / <span data-dur>0:00</span></span>' +
          '<span class="vp__spacer"></span>' +
          '<button class="vp__btn" type="button" data-act="mute" aria-label="Silenciar">' + svg(ICON.vol) + '</button>' +
          '<input class="vp__vol" type="range" min="0" max="1" step="0.05" aria-label="Volume">' +
          (captions.length ? '<button class="vp__btn" type="button" data-act="cc" aria-label="Legendas" aria-haspopup="menu">' + svg(ICON.cc) + '</button>' : '') +
          (cfg.sources.length > 1 ? '<button class="vp__pill" type="button" data-act="quality" aria-haspopup="menu" aria-label="Qualidade"></button>' : '') +
          (document.pictureInPictureEnabled ? '<button class="vp__btn vp__btn--opt" type="button" data-act="pip" aria-label="Picture-in-picture">' + svg(ICON.pip) + '</button>' : '') +
          '<button class="vp__btn" type="button" data-act="fs" aria-label="Tela cheia">' + svg(ICON.fs) + '</button>' +
        '</div>' +
      '</div>';
    container.innerHTML = '';
    container.appendChild(root);

    var video = root.querySelector('video');
    var big = root.querySelector('.vp__big');
    var overlay = root.querySelector('.vp__overlay');
    var menu = root.querySelector('.vp__menu');
    var progress = root.querySelector('.vp__progress');
    var played = root.querySelector('.vp__played');
    var buffer = root.querySelector('.vp__buffer');
    var thumb = root.querySelector('.vp__thumb');
    var tip = root.querySelector('.vp__tip');
    var curEl = root.querySelector('[data-cur]');
    var durEl = root.querySelector('[data-dur]');
    var vol = root.querySelector('.vp__vol');
    var btn = function (a) { return root.querySelector('[data-act="' + a + '"]'); };

    video.poster = cfg.poster;
    captions.forEach(function (c, i) {
      var t = document.createElement('track');
      t.kind = 'subtitles';
      t.srclang = c.lang;
      t.label = c.label;
      t.src = c.src;
      if (i === 0) t.default = true;
      video.appendChild(t);
    });
    var savedVol = parseFloat(store.get('localStorage', KEY_VOL));
    video.volume = isFinite(savedVol) ? savedVol : 0.9;
    vol.value = video.volume;
    video.src = cfg.sources[srcIdx].src;
    if (btn('quality')) btn('quality').textContent = cfg.sources[srcIdx].label;

    var destroyed = false;
    var hideTimer = null;
    var pendingSeek = null;
    var lastSave = 0;
    var resumeAsked = false;

    function showUI() {
      root.classList.remove('is-idle');
      clearTimeout(hideTimer);
      hideTimer = setTimeout(function () { if (!video.paused && menu.hidden) root.classList.add('is-idle'); }, 2600);
    }
    function setIcon(el, d) { if (el) el.querySelector('path').setAttribute('d', d); }

    function play() {
      var p = video.play();
      if (p && p.catch) p.catch(function () { root.classList.add('is-paused'); });
    }
    function toggle() { if (video.paused || video.ended) play(); else video.pause(); }
    function seekBy(s) { if (isFinite(video.duration)) video.currentTime = Math.max(0, Math.min(video.duration - 0.1, video.currentTime + s)); showUI(); }

    function updateTime() {
      var d = video.duration, t = video.currentTime;
      var p = isFinite(d) && d > 0 ? t / d : 0;
      curEl.textContent = fmt(t);
      played.style.transform = 'scaleX(' + p + ')';
      thumb.style.left = (p * 100) + '%';
      progress.setAttribute('aria-valuenow', Math.round(p * 100));
      progress.setAttribute('aria-valuetext', fmt(t) + ' de ' + fmt(d));
      if (isFinite(d) && d > 120 && t - lastSave > 4) {
        lastSave = t;
        if (t > 30 && t < d - 30) store.set('localStorage', resumeKey, String(Math.floor(t)));
      }
    }
    function updateBuffer() {
      var d = video.duration, b = video.buffered, end = 0;
      for (var i = 0; i < b.length; i++) if (b.start(i) <= video.currentTime + 1) end = Math.max(end, b.end(i));
      buffer.style.transform = 'scaleX(' + (isFinite(d) && d > 0 ? end / d : 0) + ')';
    }

    function closeMenu() { menu.hidden = true; menu.innerHTML = ''; }
    function openMenu(kind) {
      if (!menu.hidden && menu.dataset.kind === kind) { closeMenu(); return; }
      menu.dataset.kind = kind;
      var items = [];
      if (kind === 'quality') {
        items = cfg.sources.map(function (s, i) { return { label: s.label + (s.height >= 2160 ? ' · Ultra HD' : ''), checked: i === srcIdx, run: function () { setSource(i); } }; });
      } else {
        var tracks = video.textTracks;
        var anyOn = false;
        for (var i = 0; i < tracks.length; i++) if (tracks[i].mode === 'showing') anyOn = true;
        items.push({ label: 'Desativadas', checked: !anyOn, run: function () { setCaption(-1); } });
        captions.forEach(function (c, i) { items.push({ label: c.label, checked: tracks[i] && tracks[i].mode === 'showing', run: function () { setCaption(i); } }); });
      }
      menu.innerHTML = '<p class="vp__menu-title">' + (kind === 'quality' ? 'Qualidade' : 'Legendas') + '</p>';
      items.forEach(function (it) {
        var b = document.createElement('button');
        b.type = 'button';
        b.setAttribute('role', 'menuitemradio');
        b.setAttribute('aria-checked', it.checked ? 'true' : 'false');
        b.textContent = it.label;
        b.addEventListener('click', function () { it.run(); closeMenu(); root.focus({ preventScroll: true }); });
        menu.appendChild(b);
      });
      menu.hidden = false;
      var first = menu.querySelector('[aria-checked="true"]') || menu.querySelector('button');
      if (first) first.focus({ preventScroll: true });
    }

    function setCaption(i) {
      var tracks = video.textTracks;
      for (var k = 0; k < tracks.length; k++) tracks[k].mode = k === i ? 'showing' : 'disabled';
      if (btn('cc')) btn('cc').classList.toggle('is-on', i >= 0);
    }

    function setSource(i) {
      if (i === srcIdx) return;
      var t = video.currentTime, wasPlaying = !video.paused;
      srcIdx = i;
      store.set('localStorage', KEY_QUALITY, cfg.sources[i].label);
      btn('quality').textContent = cfg.sources[i].label;
      var tracksState = [];
      for (var k = 0; k < video.textTracks.length; k++) tracksState.push(video.textTracks[k].mode);
      pendingSeek = { t: t, play: wasPlaying, tracks: tracksState };
      root.classList.add('is-waiting');
      video.src = cfg.sources[i].src;
      video.load();
    }

    function showOverlay(html) { overlay.innerHTML = html; overlay.hidden = false; }
    function hideOverlay() { overlay.hidden = true; overlay.innerHTML = ''; }

    // eventos do vídeo
    video.addEventListener('play', function () { root.classList.remove('is-paused'); setIcon(btn('toggle'), ICON.pause); btn('toggle').setAttribute('aria-label', 'Pausar'); showUI(); if (opts.onPlay) opts.onPlay(); });
    video.addEventListener('pause', function () { root.classList.add('is-paused'); root.classList.remove('is-idle'); setIcon(btn('toggle'), ICON.play); btn('toggle').setAttribute('aria-label', 'Tocar'); });
    video.addEventListener('waiting', function () { root.classList.add('is-waiting'); });
    video.addEventListener('playing', function () { root.classList.remove('is-waiting'); });
    video.addEventListener('canplay', function () { root.classList.remove('is-waiting'); });
    video.addEventListener('timeupdate', updateTime);
    video.addEventListener('progress', updateBuffer);
    video.addEventListener('ended', function () { store.del('localStorage', resumeKey); });
    video.addEventListener('volumechange', function () {
      setIcon(btn('mute'), video.muted || video.volume === 0 ? ICON.mute : ICON.vol);
      vol.value = video.muted ? 0 : video.volume;
      store.set('localStorage', KEY_VOL, String(video.volume));
    });
    video.addEventListener('loadedmetadata', function () {
      durEl.textContent = fmt(video.duration);
      if (pendingSeek) {
        video.currentTime = pendingSeek.t;
        for (var k = 0; k < video.textTracks.length; k++) if (pendingSeek.tracks[k]) video.textTracks[k].mode = pendingSeek.tracks[k];
        if (pendingSeek.play) play();
        pendingSeek = null;
        return;
      }
      if (!resumeAsked) {
        resumeAsked = true;
        var saved = parseFloat(store.get('localStorage', resumeKey));
        if (saved > 30 && saved < video.duration - 30) {
          video.pause();
          showOverlay(
            '<div class="vp__card"><p class="vp__card-title">Continuar de onde parou?</p>' +
            '<p class="vp__card-text">Você assistiu até ' + fmt(saved) + '.</p>' +
            '<div class="vp__card-actions"><button class="btn btn--sun" type="button" data-resume>Continuar de ' + fmt(saved) + '</button>' +
            '<button class="btn btn--ghost" type="button" data-restart>Do início</button></div></div>'
          );
          overlay.querySelector('[data-resume]').addEventListener('click', function () { video.currentTime = saved; hideOverlay(); play(); });
          overlay.querySelector('[data-restart]').addEventListener('click', function () { video.currentTime = 0; hideOverlay(); play(); });
          overlay.querySelector('[data-resume]').focus({ preventScroll: true });
          return;
        }
      }
    });
    video.addEventListener('error', function () {
      if (destroyed || !video.getAttribute('src')) return;
      root.classList.remove('is-waiting');
      var lower = srcIdx < cfg.sources.length - 1 ? srcIdx + 1 : -1;
      var links = (cfg.links || []).map(function (l) { return '<a class="btn btn--glass" target="_blank" rel="noopener" href="' + esc(l.href) + '">' + esc(l.label) + ' ↗</a>'; }).join('');
      showOverlay(
        '<div class="vp__card"><p class="vp__card-title">Não deu para carregar o vídeo</p>' +
        '<p class="vp__card-text">O servidor não respondeu ou o seu navegador não aceitou o arquivo. ' + (lower >= 0 ? 'Tente uma qualidade menor ou assista na fonte:' : 'Tente de novo em instantes ou assista na fonte:') + '</p>' +
        '<div class="vp__card-actions">' + (lower >= 0 ? '<button class="btn btn--sun" type="button" data-lower>Tentar ' + esc(cfg.sources[lower].label) + '</button>' : '') + links + '</div></div>'
      );
      var lb = overlay.querySelector('[data-lower]');
      if (lb) lb.addEventListener('click', function () { hideOverlay(); setSource(lower); play(); });
    });

    // controles
    big.addEventListener('click', function () { play(); root.focus({ preventScroll: true }); });
    // toque: o primeiro mostra os controles, o seguinte pausa/toca
    var lastPointer = 'mouse', wasIdle = false;
    root.addEventListener('pointerdown', function (e) {
      lastPointer = e.pointerType;
      wasIdle = root.classList.contains('is-idle');
      showUI();
    }, true);
    video.addEventListener('click', function () {
      if (!menu.hidden) { closeMenu(); return; }
      if (lastPointer === 'touch' && wasIdle) return;
      toggle();
    });
    video.addEventListener('dblclick', function () { toggleFs(); });
    root.querySelector('.vp__row').addEventListener('click', function (e) {
      var b = e.target.closest('[data-act]');
      if (!b) return;
      var a = b.dataset.act;
      if (a === 'toggle') toggle();
      else if (a === 'back') seekBy(-10);
      else if (a === 'fwd') seekBy(10);
      else if (a === 'mute') video.muted = !video.muted;
      else if (a === 'cc' || a === 'quality') openMenu(a === 'cc' ? 'cc' : 'quality');
      else if (a === 'pip') { if (document.pictureInPictureElement) document.exitPictureInPicture(); else video.requestPictureInPicture().catch(function () {}); }
      else if (a === 'fs') toggleFs();
    });
    vol.addEventListener('input', function () { video.volume = parseFloat(vol.value); video.muted = video.volume === 0; });

    function toggleFs() {
      if (document.fullscreenElement) { document.exitFullscreen(); return; }
      if (root.requestFullscreen) root.requestFullscreen().catch(function () {});
      else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    }
    function onFs() { setIcon(btn('fs'), document.fullscreenElement === root ? ICON.fsExit : ICON.fs); }
    document.addEventListener('fullscreenchange', onFs);

    // barra de progresso: clique, arrasto, hover com tempo
    var dragging = false;
    function ratioAt(e) { var r = progress.getBoundingClientRect(); return Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)); }
    progress.addEventListener('pointerdown', function (e) {
      dragging = true;
      progress.setPointerCapture(e.pointerId);
      if (isFinite(video.duration)) video.currentTime = ratioAt(e) * video.duration;
    });
    progress.addEventListener('pointermove', function (e) {
      var r = ratioAt(e);
      tip.textContent = fmt(r * (video.duration || 0));
      tip.style.left = (r * 100) + '%';
      if (dragging && isFinite(video.duration)) video.currentTime = r * video.duration;
    });
    progress.addEventListener('pointerup', function () { dragging = false; });
    progress.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { seekBy(5); e.preventDefault(); e.stopPropagation(); }
      if (e.key === 'ArrowLeft') { seekBy(-5); e.preventDefault(); e.stopPropagation(); }
    });

    // atalhos de teclado
    root.addEventListener('keydown', function (e) {
      if (e.target.closest('.vp__menu')) {
        if (e.key === 'Escape') { closeMenu(); root.focus({ preventScroll: true }); e.stopPropagation(); }
        return;
      }
      if (e.target.tagName === 'INPUT' || (e.target.tagName === 'BUTTON' && (e.key === ' ' || e.key === 'Enter'))) return;
      var k = e.key.toLowerCase(), handled = true;
      if (k === ' ' || k === 'k') toggle();
      else if (k === 'arrowright' || k === 'l') seekBy(k === 'l' ? 10 : 5);
      else if (k === 'arrowleft' || k === 'j') seekBy(k === 'j' ? -10 : -5);
      else if (k === 'arrowup') video.volume = Math.min(1, video.volume + 0.1);
      else if (k === 'arrowdown') video.volume = Math.max(0, video.volume - 0.1);
      else if (k === 'm') video.muted = !video.muted;
      else if (k === 'f') toggleFs();
      else if (k === 'c' && captions.length) {
        var on = -1;
        for (var i = 0; i < video.textTracks.length; i++) if (video.textTracks[i].mode === 'showing') on = i;
        setCaption(on >= 0 ? -1 : 0);
      } else if (/^[0-9]$/.test(k) && isFinite(video.duration)) video.currentTime = video.duration * parseInt(k, 10) / 10;
      else handled = false;
      if (handled) { e.preventDefault(); showUI(); }
    });
    root.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse') showUI(); });
    root.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse' && !video.paused && menu.hidden) root.classList.add('is-idle'); });

    // legendas em português ligadas por padrão
    setTimeout(function () { if (!destroyed && captions.length) setCaption(0); }, 0);

    root.focus({ preventScroll: true });
    if (opts.autoplay) play();

    return {
      el: root,
      video: video,
      destroy: function () {
        destroyed = true;
        clearTimeout(hideTimer);
        document.removeEventListener('fullscreenchange', onFs);
        if (document.fullscreenElement === root) document.exitFullscreen().catch(function () {});
        if (document.pictureInPictureElement === video) document.exitPictureInPicture().catch(function () {});
        video.pause();
        video.removeAttribute('src');
        video.load();
      }
    };
  }

  window.ViMedia = {
    ageOk: ageOk,
    renderAgeGate: renderAgeGate,
    renderYoutubeOnly: renderYoutubeOnly,
    mountPlayer: mountPlayer
  };
})();
