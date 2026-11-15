/* Passagem para Vice City — gerador de cartão de embarque (projeto de fã).
   O bilhete é desenhado num <canvas>: o mesmo desenho serve de prévia ao vivo e de imagem
   exportada (cartão, story 9:16 e feed 4:5). Nada sai do navegador: os dados vivem na URL
   (que o QR code abre) e no localStorage. */
(function () {
  'use strict';

  var D = window.VI_DATA;
  var RELEASE = new Date(D.release[0], D.release[1], D.release[2], D.release[3] || 0, D.release[4] || 0);
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var STORE = 'vi-passagem';

  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function pad(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------------------------------------------------------------------
     Dados
     --------------------------------------------------------------------- */
  var AIRPORTS = [
    ['Cidades da série GTA', [['LSI', 'Los Santos', 'GTA V'], ['LCI', 'Liberty City', 'GTA IV']]],
    ['Brasil', [['AJU', 'Aracaju'], ['BEL', 'Belém'], ['CNF', 'Belo Horizonte'], ['BVB', 'Boa Vista'], ['BSB', 'Brasília'],
      ['VCP', 'Campinas'], ['CGR', 'Campo Grande'], ['CGB', 'Cuiabá'], ['CWB', 'Curitiba'], ['FLN', 'Florianópolis'],
      ['FOR', 'Fortaleza'], ['IGU', 'Foz do Iguaçu'], ['GYN', 'Goiânia'], ['JPA', 'João Pessoa'], ['JOI', 'Joinville'],
      ['LDB', 'Londrina'], ['MCP', 'Macapá'], ['MCZ', 'Maceió'], ['MAO', 'Manaus'], ['NAT', 'Natal'], ['PMW', 'Palmas'],
      ['POA', 'Porto Alegre'], ['BPS', 'Porto Seguro'], ['PVH', 'Porto Velho'], ['REC', 'Recife'], ['RAO', 'Ribeirão Preto'],
      ['RBR', 'Rio Branco'], ['GIG', 'Rio de Janeiro'], ['SSA', 'Salvador'], ['SLZ', 'São Luís'], ['GRU', 'São Paulo'],
      ['THE', 'Teresina'], ['UDI', 'Uberlândia'], ['VIX', 'Vitória']]],
    ['Portugal e África', [['LIS', 'Lisboa'], ['OPO', 'Porto'], ['FAO', 'Faro'], ['FNC', 'Funchal'], ['LAD', 'Luanda'], ['MPM', 'Maputo']]],
    ['Mundo', [['EZE', 'Buenos Aires'], ['SCL', 'Santiago'], ['MVD', 'Montevidéu'], ['BOG', 'Bogotá'], ['LIM', 'Lima'],
      ['MEX', 'Cidade do México'], ['MIA', 'Miami', 'a Vice City da vida real'], ['MCO', 'Orlando'], ['JFK', 'Nova York'],
      ['LAX', 'Los Angeles'], ['LHR', 'Londres'], ['CDG', 'Paris'], ['MAD', 'Madri'], ['FCO', 'Roma'], ['HND', 'Tóquio']]]
  ];
  var CITY = {};
  AIRPORTS.forEach(function (g) { g[1].forEach(function (a) { CITY[a[0]] = a[1]; }); });

  var IMG = 'assets/img/';
  var THEMES = {
    eco: { label: 'Econômica', name: 'Pôr do sol', img: IMG + 'places/vice-city-1.webp', fy: 0.42, dark: false,
      paper: '#fff6ee', ink: '#1d002e', muted: '#8a6b93', line: 'rgba(29,0,46,0.12)',
      head: ['#ff4f9a', '#ff7a5c', '#ffc56b'], accent: '#e8317f', tile: '#1d002e', tileInk: '#ffc56b', group: '4' },
    exe: { label: 'Executiva', name: 'Leonida Keys', img: IMG + 'places/leonida-keys-1.webp', fy: 0.5, dark: false,
      paper: '#f1fffb', ink: '#06283a', muted: '#4f7584', line: 'rgba(6,40,58,0.12)',
      head: ['#2fd8c4', '#59b8ff', '#8a7bff'], accent: '#0f9e93', tile: '#06283a', tileInk: '#45f0d1', group: '2' },
    pri: { label: 'Primeira Classe', name: 'Noite de Vice', img: IMG + 'places/vice-city-2.webp', fy: 0.4, dark: true, foil: true,
      paper: '#140b1f', ink: '#fff4ea', muted: '#b6a1c4', line: 'rgba(255,217,138,0.18)',
      head: ['#9c6a1e', '#ffd98a', '#b8862f'], accent: '#ffd98a', tile: '#07030c', tileInk: '#ffd98a', group: '1' },
    vercetti: { label: 'Bilhete secreto', name: 'Vercetti Estate', img: IMG + 'key/vice-skyline.webp', fy: 0.55, dark: true, foil: true,
      paper: '#0b1a39', ink: '#ffffff', muted: '#9fb3d9', line: 'rgba(69,240,209,0.2)',
      head: ['#ff4f9a', '#ff7ad1', '#45f0d1'], accent: '#45f0d1', tile: '#030b1f', tileInk: '#ff7ad1', group: 'VIP',
      secret: 'Assento reservado para o dono da cidade.' },
    foragido: { label: 'Bilhete secreto', name: 'Procurados em Leonida', img: IMG + 'places/port-gellhorn-1.webp', fy: 0.4, dark: true,
      paper: '#120c0c', ink: '#fff4ea', muted: '#b9928b', line: 'rgba(255,90,74,0.2)',
      head: ['#c81d2b', '#ff5a4a', '#ff9a4c'], accent: '#ff5a4a', tile: '#000000', tileInk: '#ff5a4a', group: '—',
      secret: 'Viajando com nome falso. Não conte para ninguém.' }
  };
  // nomes que destravam bilhetes secretos (comparados sem acento e em minúsculas)
  var SECRETS = { 'tommy': 'vercetti', 'tommy vercetti': 'vercetti', 'vercetti': 'vercetti',
    'jason': 'foragido', 'jason duval': 'foragido', 'lucia': 'foragido', 'lucia caminos': 'foragido' };
  var COMPANY = { ambos: 'Jason & Lucia', jason: 'Jason Duval', lucia: 'Lucia Caminos', solo: 'Sozinho' };
  var STATIONS = {};
  D.stations.forEach(function (s) { STATIONS[s.key] = s; });

  /* ---------------------------------------------------------------------
     Estado (URL > localStorage > padrão)
     --------------------------------------------------------------------- */
  var DEFAULTS = { n: '', de: 'LSI', c: 'eco', com: 'ambos', r: 'flash-fm' };
  function clean(s) {
    // texto livre do usuário: sem caracteres de controle, espaços colapsados, até 22 caracteres
    return String(s || '').replace(/[\u0000-\u001f\u007f-\u009f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 22);
  }
  function valid(st) {
    return {
      n: clean(st.n),
      de: CITY[st.de] ? st.de : DEFAULTS.de,
      c: THEMES[st.c] && !THEMES[st.c].secret ? st.c : DEFAULTS.c,
      com: COMPANY[st.com] ? st.com : DEFAULTS.com,
      r: STATIONS[st.r] ? st.r : DEFAULTS.r
    };
  }
  function fromURL() {
    var p = new URLSearchParams(location.search), o = {};
    ['n', 'de', 'c', 'com', 'r'].forEach(function (k) { if (p.has(k)) o[k] = p.get(k); });
    return o;
  }
  var urlState = fromURL();
  var saved = {};
  try { saved = JSON.parse(localStorage.getItem(STORE) || '{}') || {}; } catch (e) {}
  var shared = !!urlState.n && clean(urlState.n) !== clean(saved.n);
  var state = valid(Object.assign({}, DEFAULTS, saved, urlState));

  function shareURL(st) {
    var u = new URL('passagem.html', location.href);
    u.search = new URLSearchParams({ n: st.n || 'Passageiro', de: st.de, c: st.c, com: st.com, r: st.r }).toString();
    return u.href;
  }

  /* ---------------------------------------------------------------------
     Dados derivados do bilhete (determinísticos: mesmo nome, mesmo bilhete)
     --------------------------------------------------------------------- */
  function fold(s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim(); }
  function hash(s) {
    var h = 2166136261;
    for (var i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    return h >>> 0;
  }
  function rng(seed) { // mulberry32
    return function () {
      seed = (seed + 0x6D2B79F5) | 0;
      var t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }
  var LOC_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  function ticket(st) {
    var name = st.n || 'Seu nome aqui';
    var themeKey = SECRETS[fold(st.n)] || st.c;
    var th = THEMES[themeKey];
    var r = rng(hash(fold(name) + '|' + st.de + '|' + themeKey));
    var loc = '';
    for (var i = 0; i < 6; i++) loc += LOC_CHARS.charAt(Math.floor(r() * LOC_CHARS.length));
    var seat;
    if (themeKey === 'pri' || themeKey === 'vercetti') seat = (1 + Math.floor(r() * 3)) + 'ACDF'.charAt(Math.floor(r() * 4));
    else if (themeKey === 'exe') seat = (4 + Math.floor(r() * 6)) + 'ACDFHK'.charAt(Math.floor(r() * 6));
    else seat = (10 + Math.floor(r() * 33)) + 'ABCDEF'.charAt(Math.floor(r() * 6));
    return {
      st: st, th: th, theme: themeKey, name: name.toUpperCase(), placeholder: !st.n,
      de: st.de, city: CITY[st.de], seat: seat, loc: loc, flight: 'LA 1119', gate: 'VI',
      company: COMPANY[st.com], station: STATIONS[st.r], seed: hash(loc)
    };
  }

  /* ---------------------------------------------------------------------
     Recursos: fontes, imagens, ícone de avião
     --------------------------------------------------------------------- */
  var F = { display: '"Big Shoulders Display", Impact, sans-serif', body: 'Manrope, system-ui, sans-serif',
    mono: '"IBM Plex Mono", ui-monospace, monospace', script: '"Mr Dafoe", cursive' };
  var images = {};
  function img(src) {
    if (!images[src]) {
      images[src] = new Promise(function (res) {
        var im = new Image();
        im.decoding = 'async';
        im.onload = function () { res(im); };
        im.onerror = function () { res(null); };
        im.src = src;
      });
    }
    return images[src];
  }
  // ícone "flight" do Material Icons (Apache 2.0), apontando para cima em 24x24
  var PLANE = new Path2D('M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z');

  /* ---------------------------------------------------------------------
     Primitivas de desenho
     --------------------------------------------------------------------- */
  function rr(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  // texto com espaçamento entre letras (ctx.letterSpacing ainda não existe em todo navegador)
  function text(ctx, s, x, y, opt) {
    ctx.font = opt.font;
    ctx.fillStyle = opt.color;
    ctx.textBaseline = opt.base || 'alphabetic';
    var sp = opt.spacing || 0;
    if (!sp) { ctx.textAlign = opt.align || 'left'; ctx.fillText(s, x, y); return ctx.measureText(s).width; }
    ctx.textAlign = 'left';
    var w = 0, i;
    for (i = 0; i < s.length; i++) w += ctx.measureText(s[i]).width + (i < s.length - 1 ? sp : 0);
    var cx = opt.align === 'right' ? x - w : opt.align === 'center' ? x - w / 2 : x;
    for (i = 0; i < s.length; i++) { ctx.fillText(s[i], cx, y); cx += ctx.measureText(s[i]).width + sp; }
    return w;
  }
  // maior corpo de fonte (até `size`) em que o texto cabe em `maxW`
  function fit(ctx, s, maxW, size, tpl) {
    for (; size > 12; size -= 2) { ctx.font = tpl.replace('#', size); if (ctx.measureText(s).width <= maxW) break; }
    return tpl.replace('#', size);
  }
  function cover(ctx, im, x, y, w, h, fy) {
    if (!im) return;
    var s = Math.max(w / im.width, h / im.height);
    var sw = w / s, sh = h / s;
    ctx.drawImage(im, (im.width - sw) / 2, (im.height - sh) * (fy == null ? 0.5 : fy), sw, sh, x, y, w, h);
  }
  function gradient(ctx, x0, y0, x1, y1, stops) {
    var g = ctx.createLinearGradient(x0, y0, x1, y1);
    stops.forEach(function (c, i) { g.addColorStop(i / (stops.length - 1), c); });
    return g;
  }
  function plane(ctx, x, y, size, color, angle) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle == null ? Math.PI / 2 : angle);
    ctx.scale(size / 24, size / 24);
    ctx.translate(-12, -12);
    ctx.fillStyle = color;
    ctx.fill(PLANE);
    ctx.restore();
  }
  // sol listrado de Leonida (o símbolo da companhia)
  function sun(ctx, x, y, r, colors, bg) {
    ctx.save();
    ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.clip();
    ctx.fillStyle = gradient(ctx, x, y - r, x, y + r, colors);
    ctx.fillRect(x - r, y - r, r * 2, r * 2);
    ctx.fillStyle = bg;
    for (var i = 0; i < 4; i++) ctx.fillRect(x - r, y + r * (0.12 + i * 0.22), r * 2, r * (0.05 + i * 0.03));
    ctx.restore();
  }

  /* ---------------------------------------------------------------------
     Letreiro de aeroporto: letras giram até parar no valor (animação "split-flap")
     --------------------------------------------------------------------- */
  var FLAP = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var flaps = {};
  function setFlap(key, value, now) {
    var f = flaps[key];
    if (f && f.to === value) return;
    flaps[key] = { to: value, start: REDUCE ? -1e9 : now };
  }
  function flapText(key, t) {
    var f = flaps[key];
    if (!f) return '';
    var out = '';
    for (var i = 0; i < f.to.length; i++) {
      var ch = f.to.charAt(i);
      out += ch !== ' ' && t < f.start + 260 + i * 55 ? FLAP.charAt(Math.floor(Math.random() * FLAP.length)) : ch;
    }
    return out;
  }
  function flapping(t) {
    return Object.keys(flaps).some(function (k) { return t < flaps[k].start + 260 + flaps[k].to.length * 55; });
  }

  /* ---------------------------------------------------------------------
     O cartão de embarque (1080 x 1800)
     --------------------------------------------------------------------- */
  var TW = 1080, TH = 1800;
  function tile(ctx, x, y, w, h, ch, th) {
    rr(ctx, x, y, w, h, 14);
    ctx.fillStyle = th.tile;
    ctx.fill();
    ctx.save();
    rr(ctx, x, y, w, h / 2, 14); ctx.clip();
    ctx.fillStyle = 'rgba(255,255,255,0.07)';
    ctx.fillRect(x, y, w, h / 2);
    ctx.restore();
    text(ctx, ch, x + w / 2, y + h * 0.79, { font: '900 ' + Math.round(h * 0.78) + 'px ' + F.display, color: th.tileInk, align: 'center' });
    ctx.fillStyle = 'rgba(0,0,0,0.55)';
    ctx.fillRect(x, y + h / 2 - 1.5, w, 3);
  }
  function code(ctx, s, x, y, th, alignRight) {
    var w = 112, h = 150, gap = 10, total = s.length * w + (s.length - 1) * gap;
    var x0 = alignRight ? x - total : x;
    for (var i = 0; i < s.length; i++) tile(ctx, x0 + i * (w + gap), y, w, h, s.charAt(i), th);
  }
  function field(ctx, x, y, label, value, th, opt) {
    opt = opt || {};
    text(ctx, label, x, y, { font: '600 21px ' + F.mono, color: th.muted, spacing: 4 });
    var font = fit(ctx, value, opt.maxW || 220, opt.size || 56, '900 #px ' + F.display);
    text(ctx, value, x, y + 66, { font: font, color: opt.color || th.ink });
  }

  function drawTicket(ctx, tk, t, im) {
    var th = tk.th, W = TW, H = TH, M = 70;
    ctx.clearRect(0, 0, W, H);

    // corpo com recortes da linha de destaque
    var tearY = 1290;
    ctx.save();
    rr(ctx, 0, 0, W, H, 46);
    ctx.clip();
    ctx.fillStyle = th.paper;
    ctx.fillRect(0, 0, W, H);

    // cabeçalho
    ctx.fillStyle = gradient(ctx, 0, 0, W, 0, th.head);
    ctx.fillRect(0, 0, W, 150);
    var headInk = th.foil ? '#1a0b02' : th === THEMES.exe ? '#04202e' : th.dark ? '#fff4ea' : '#1a0624';
    sun(ctx, M + 40, 75, 40, ['#fff4ea', '#ffe9c7'], th.head[1]);
    text(ctx, 'LEONIDA', M + 100, 82, { font: '900 58px ' + F.display, color: headInk, spacing: 2 });
    text(ctx, 'AIRWAYS', M + 102, 116, { font: '600 21px ' + F.mono, color: headInk, spacing: 9 });
    rr(ctx, W - M - 330, 48, 330, 56, 28);
    ctx.fillStyle = 'rgba(0,0,0,0.82)';
    ctx.fill();
    text(ctx, 'CARTÃO DE EMBARQUE', W - M - 165, 85, { font: '800 23px ' + F.body, color: '#fff4ea', align: 'center', spacing: 2 });

    // foto do destino
    var py = 150, ph = 380;
    cover(ctx, im, 0, py, W, ph, th.fy);
    ctx.fillStyle = gradient(ctx, 0, py, 0, py + ph, ['rgba(0,0,0,0.05)', 'rgba(0,0,0,0.12)', 'rgba(8,2,16,0.82)']);
    ctx.fillRect(0, py, W, ph);
    text(ctx, 'DESTINO FINAL', M, py + ph - 128, { font: '600 22px ' + F.mono, color: 'rgba(255,244,234,0.85)', spacing: 7 });
    ctx.save();
    ctx.shadowColor = th.accent; ctx.shadowBlur = 34;
    text(ctx, 'Vice City', M - 6, py + ph - 26, { font: '400 132px ' + F.script, color: '#fff4ea' });
    ctx.restore();
    if (th.secret) {
      // faixa do bilhete secreto sobre a foto
      ctx.font = '800 22px ' + F.body;
      var sw = ctx.measureText(th.secret).width + 48;
      rr(ctx, W - M - sw, py + 34, sw, 50, 25);
      ctx.fillStyle = th.accent; ctx.fill();
      text(ctx, th.secret, W - M - sw / 2, py + 67, { font: '800 22px ' + F.body, color: '#0d0518', align: 'center' });
      text(ctx, th.name.toUpperCase(), W - M, py + 112, { font: '600 20px ' + F.mono, color: '#fff4ea', align: 'right', spacing: 4 });
    }
    text(ctx, 'LEONIDA · EUA', W - M, py + ph - 40, { font: '600 22px ' + F.mono, color: 'rgba(255,244,234,0.85)', align: 'right', spacing: 6 });

    // rota
    var ry = 600;
    text(ctx, 'PARTIDA', M, ry, { font: '600 21px ' + F.mono, color: th.muted, spacing: 5 });
    text(ctx, 'CHEGADA', W - M, ry, { font: '600 21px ' + F.mono, color: th.muted, spacing: 5, align: 'right' });
    code(ctx, flapText('de', t) || tk.de, M, ry + 24, th, false);
    code(ctx, 'VCI', W - M, ry + 24, th, true);
    // trajeto pontilhado com o avião no meio
    ctx.save();
    ctx.strokeStyle = th.accent; ctx.lineWidth = 3; ctx.setLineDash([2, 10]); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(W / 2 - 70, ry + 99); ctx.quadraticCurveTo(W / 2, ry + 60, W / 2 + 70, ry + 99); ctx.stroke();
    ctx.restore();
    plane(ctx, W / 2, ry + 82, 54, th.accent);
    var cityFont = fit(ctx, tk.city.toUpperCase(), 400, 38, '900 #px ' + F.display);
    text(ctx, tk.city.toUpperCase(), M, ry + 228, { font: cityFont, color: th.ink });
    text(ctx, '18 NOV 2026 · 23:00', M, ry + 268, { font: '500 24px ' + F.mono, color: th.muted });
    text(ctx, 'VICE CITY', W - M, ry + 228, { font: '900 38px ' + F.display, color: th.ink, align: 'right' });
    text(ctx, '19 NOV 2026 · 00:00', W - M, ry + 268, { font: '500 24px ' + F.mono, color: th.muted, align: 'right' });

    // passageiro
    var ny = 920;
    ctx.fillStyle = th.ink; ctx.fillRect(M, ny - 34, W - M * 2, 3);
    text(ctx, 'PASSAGEIRO', M, ny + 12, { font: '600 21px ' + F.mono, color: th.muted, spacing: 5 });
    var nm = flapText('n', t) || tk.name;
    text(ctx, nm, M - 3, ny + 98, { font: fit(ctx, tk.name, W - M * 2, 96, '900 #px ' + F.display), color: tk.placeholder ? th.muted : th.ink });

    // grade de dados
    var gy = 1078, cw = (W - M * 2) / 4;
    ctx.fillStyle = th.line;
    ctx.fillRect(M, gy - 30, W - M * 2, 2);
    for (var c = 1; c < 4; c++) ctx.fillRect(M + cw * c - 16, gy - 8, 2, 192);
    field(ctx, M, gy, 'VOO', tk.flight, th, { color: th.accent });
    field(ctx, M + cw, gy, 'ASSENTO', flapText('seat', t) || tk.seat, th);
    field(ctx, M + cw * 2, gy, 'PORTÃO', tk.gate, th, { color: th.accent });
    field(ctx, M + cw * 3, gy, 'GRUPO', th.group, th);
    field(ctx, M, gy + 118, 'CLASSE', th.label.replace(' Classe', '').toUpperCase(), th, { size: 40, maxW: cw - 24 });
    field(ctx, M + cw, gy + 118, 'EMBARQUE', '22:20', th, { size: 40 });
    field(ctx, M + cw * 2, gy + 118, 'RÁDIO', tk.station.name.toUpperCase(), th, { size: 40, maxW: cw - 24 });
    field(ctx, M + cw * 3, gy + 118, 'COM', tk.company.toUpperCase(), th, { size: 40, maxW: cw - 10 });
    ctx.restore();

    // linha de destaque: semicírculos recortados + tracejado
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath(); ctx.arc(0, tearY, 34, 0, Math.PI * 2); ctx.arc(W, tearY, 34, 0, Math.PI * 2); ctx.fill();
    ctx.restore();
    ctx.save();
    ctx.strokeStyle = th.line; ctx.lineWidth = 4; ctx.setLineDash([18, 14]);
    ctx.beginPath(); ctx.moveTo(56, tearY); ctx.lineTo(W - 56, tearY); ctx.stroke();
    ctx.restore();

    // canhoto: QR, localizador e status
    var sy = tearY + 64, qs = 300;
    rr(ctx, M, sy, qs, qs, 22);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    drawQR(ctx, shareURL(tk.st), M + 22, sy + 22, qs - 44);
    var tx = M + qs + 44;
    text(ctx, 'LOCALIZADOR', tx, sy + 30, { font: '600 21px ' + F.mono, color: th.muted, spacing: 5 });
    text(ctx, flapText('loc', t) || tk.loc, tx, sy + 98, { font: '600 64px ' + F.mono, color: th.ink, spacing: 8 });
    var st = status();
    text(ctx, st.label, tx, sy + 160, { font: '600 21px ' + F.mono, color: th.muted, spacing: 5 });
    text(ctx, st.value, tx, sy + 222, { font: '900 60px ' + F.display, color: th.accent });
    text(ctx, 'Escaneie para abrir este bilhete', tx, sy + 280, { font: '600 22px ' + F.body, color: th.muted });

    // código de barras decorativo
    var by = H - 120, bx = M, r = rng(tk.seed);
    ctx.fillStyle = th.ink;
    while (bx < W - M) { var bw = 2 + Math.floor(r() * 7); if (r() > 0.35) ctx.fillRect(bx, by, bw, 58); bx += bw + 3; }
    text(ctx, 'PROJETO DE FÃ · NÃO OFICIAL · ' + tk.loc + ' · ' + tk.flight + ' · ' + tk.de + '-VCI', W / 2, H - 34, { font: '500 19px ' + F.mono, color: th.muted, align: 'center', spacing: 3 });

    // carimbo de chegada, a partir do lançamento
    if (Date.now() >= RELEASE) stamp(ctx, W - 250, sy + 190, th);

    // brilho metálico na Primeira e nos secretos
    if (th.foil) {
      ctx.save();
      rr(ctx, 0, 0, W, H, 46); ctx.clip();
      ctx.globalCompositeOperation = 'overlay';
      ctx.fillStyle = gradient(ctx, 0, 0, W, H, ['rgba(255,255,255,0)', 'rgba(255,238,190,0.28)', 'rgba(255,255,255,0)', 'rgba(150,230,255,0.18)', 'rgba(255,255,255,0)']);
      ctx.fillRect(0, 0, W, H);
      ctx.restore();
      ctx.save();
      ctx.strokeStyle = th.accent; ctx.lineWidth = 6;
      rr(ctx, 3, 3, W - 6, H - 6, 44); ctx.stroke();
      ctx.restore();
    }
  }

  function stamp(ctx, x, y, th) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(-0.2);
    ctx.globalAlpha = 0.88;
    ctx.strokeStyle = '#e8314a'; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.arc(0, 0, 150, 0, Math.PI * 2); ctx.stroke();
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, 134, 0, Math.PI * 2); ctx.stroke();
    text(ctx, 'IMIGRAÇÃO · LEONIDA', 0, -50, { font: '700 22px ' + F.mono, color: '#e8314a', align: 'center', spacing: 3 });
    text(ctx, 'CHEGOU', 0, 22, { font: '900 78px ' + F.display, color: '#e8314a', align: 'center' });
    text(ctx, '19 · 11 · 2026', 0, 72, { font: '700 26px ' + F.mono, color: '#e8314a', align: 'center', spacing: 3 });
    ctx.restore();
  }

  function status() {
    var ms = RELEASE - Date.now();
    if (ms <= 0) return { label: 'STATUS', value: 'POUSOU EM VICE CITY' };
    var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
    return { label: 'DECOLA EM', value: d > 0 ? d + 'D ' + pad(h) + 'H ' + pad(m) + 'MIN' : pad(h) + 'H ' + pad(m) + 'MIN' };
  }

  var qrCache = {};
  function drawQR(ctx, url, x, y, size) {
    if (!window.qrcode) return;
    var q = qrCache[url];
    if (!q) {
      q = qrcode(0, 'M');
      q.addData(url);
      q.make();
      qrCache = {}; qrCache[url] = q;
    }
    var n = q.getModuleCount(), s = size / n;
    ctx.fillStyle = '#0d0518';
    for (var r = 0; r < n; r++) for (var c = 0; c < n; c++) if (q.isDark(r, c)) ctx.fillRect(x + c * s, y + r * s, Math.ceil(s), Math.ceil(s));
  }

  /* ---------------------------------------------------------------------
     Formatos de saída: cartão, story (1080x1920) e feed (1080x1350)
     --------------------------------------------------------------------- */
  var FORMATS = {
    card: { w: TW, h: TH, label: 'Cartão', file: 'cartao' },
    story: { w: 1080, h: 1920, label: 'Story', file: 'story' },
    feed: { w: 1080, h: 1350, label: 'Feed', file: 'feed' }
  };
  var ticketCanvas = document.createElement('canvas');
  ticketCanvas.width = TW; ticketCanvas.height = TH;

  function drawPoster(ctx, f, tk, im) {
    var W = f.w, H = f.h, th = tk.th, story = H > 1500;
    ctx.fillStyle = '#0d0518';
    ctx.fillRect(0, 0, W, H);
    ctx.save();
    ctx.globalAlpha = 0.55;
    cover(ctx, im, -40, -40, W + 80, H + 80, th.fy);
    ctx.restore();
    ctx.fillStyle = gradient(ctx, 0, 0, 0, H, ['rgba(13,5,24,0.55)', 'rgba(13,5,24,0.35)', 'rgba(13,5,24,0.92)']);
    ctx.fillRect(0, 0, W, H);
    var top = story ? 150 : 74;
    text(ctx, 'MINHA PASSAGEM PARA', W / 2, top, { font: '900 ' + (story ? 70 : 54) + 'px ' + F.display, color: '#fff4ea', align: 'center', spacing: 2 });
    ctx.save();
    ctx.shadowColor = th.accent; ctx.shadowBlur = 40;
    ctx.fillStyle = gradient(ctx, 0, top, 0, top + 200, ['#ffd98a', '#ff7a5c', '#ff4f9a']);
    ctx.font = '400 ' + (story ? 190 : 140) + 'px ' + F.script;
    ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    ctx.fillText('Vice City', W / 2, top + (story ? 190 : 140));
    ctx.restore();
    var avail = H - (top + (story ? 260 : 175)) - (story ? 170 : 92);
    var s = Math.min(avail / TH, (W - 120) / TW);
    var tw = TW * s, tx = (W - tw) / 2, ty = top + (story ? 250 : 170);
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.6)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 24;
    ctx.translate(tx + tw / 2, ty + TH * s / 2);
    ctx.rotate(story ? -0.035 : 0);
    ctx.drawImage(ticketCanvas, -tw / 2, -TH * s / 2, tw, TH * s);
    ctx.restore();
    var host = location.host && !/^(localhost|127\.)/.test(location.host) ? location.host + location.pathname.replace(/passagem\.html$/, '') : 'matheusaoliv.github.io/gta-6/';
    if (story) text(ctx, 'GTA VI · 19.11.2026', W / 2, H - 110, { font: '900 46px ' + F.display, color: '#fff4ea', align: 'center', spacing: 3 });
    text(ctx, 'EMITA A SUA EM ' + host.replace(/\/$/, '').toUpperCase(), W / 2, H - (story ? 56 : 40), { font: '600 ' + (story ? 26 : 22) + 'px ' + F.mono, color: 'rgba(255,244,234,0.75)', align: 'center', spacing: 3 });
  }

  function render(target, fmt, tk, t, im) {
    var f = FORMATS[fmt];
    if (target.width !== f.w || target.height !== f.h) { target.width = f.w; target.height = f.h; }
    var ctx = target.getContext('2d');
    if (fmt === 'card') { drawTicket(ctx, tk, t, im); return; }
    drawTicket(ticketCanvas.getContext('2d'), tk, t, im);
    drawPoster(ctx, f, tk, im);
  }

  /* ---------------------------------------------------------------------
     Interface
     --------------------------------------------------------------------- */
  var form = $('#desk');
  var canvas = $('#passCanvas');
  var stage = $('#pass');
  var fmt = 'card';
  var current = null;
  var raf = 0;

  // monta o seletor de cidades
  var sel = $('#de');
  AIRPORTS.forEach(function (g) {
    var og = document.createElement('optgroup');
    og.label = g[0];
    g[1].forEach(function (a) {
      var o = document.createElement('option');
      o.value = a[0];
      o.textContent = a[1] + ' (' + a[0] + ')' + (a[2] ? ' · ' + a[2] : '');
      og.appendChild(o);
    });
    sel.appendChild(og);
  });
  // rádios de bordo a partir dos dados da rádio do site
  var radios = $('#radios');
  D.stations.forEach(function (s) {
    var l = document.createElement('label');
    l.className = 'chip-radio chip-radio--station';
    l.innerHTML = '<input type="radio" name="r"><img alt="" width="44" height="44"><span></span>';
    $('input', l).value = s.key;
    $('img', l).src = IMG + 'radio/' + s.key + '-icon.webp';
    $('span', l).textContent = s.name;
    radios.appendChild(l);
  });

  function fill() {
    form.elements.n.value = state.n;
    sel.value = state.de;
    ['c', 'com', 'r'].forEach(function (k) {
      $$('input[name="' + k + '"]', form).forEach(function (i) { i.checked = i.value === state[k]; });
    });
  }

  function read() {
    var fd = new FormData(form);
    return valid({ n: fd.get('n'), de: fd.get('de'), c: fd.get('c'), com: fd.get('com'), r: fd.get('r') });
  }

  function describe(tk) {
    return 'Cartão de embarque de ' + (tk.placeholder ? 'passageiro sem nome' : tk.st.n) + ', de ' + tk.city + ' (' + tk.de + ') para Vice City (VCI), ' +
      tk.th.label + ', assento ' + tk.seat + ', voo ' + tk.flight + ', portão VI, em 19 de novembro de 2026. Localizador ' + tk.loc + '.';
  }

  function frame() {
    raf = 0;
    if (!current) return;
    var t = performance.now();
    render(canvas, fmt, current.tk, t, current.im);
    if (flapping(t)) raf = requestAnimationFrame(frame);
  }
  function draw() { if (!raf) raf = requestAnimationFrame(frame); }

  var urlTimer;
  function update(animate) {
    state = read();
    var tk = ticket(state);
    var t = performance.now();
    var a = animate === false ? -1e9 : t;
    setFlap('n', tk.name, a); setFlap('de', tk.de, a); setFlap('seat', tk.seat, a); setFlap('loc', tk.loc, a);
    document.documentElement.dataset.passTheme = tk.theme;
    $('#secretNote').hidden = !tk.th.secret;
    if (tk.th.secret) $('#secretNote').textContent = 'Bilhete secreto desbloqueado: ' + tk.th.name + '.';
    canvas.setAttribute('aria-label', describe(tk));
    img(tk.th.img).then(function (im) {
      current = { tk: tk, im: im };
      draw();
    });
    try { localStorage.setItem(STORE, JSON.stringify(state)); } catch (e) {}
    clearTimeout(urlTimer);
    urlTimer = setTimeout(function () {
      if (state.n) history.replaceState(null, '', shareURL(state));
    }, 400);
  }

  form.addEventListener('input', function () { update(); });
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.elements.n.blur();
    stage.scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth', block: 'center' });
    // no celular a prévia fica abaixo do formulário: o letreiro gira de novo quando ela aparece
    setTimeout(function () { flaps = {}; update(); }, REDUCE ? 0 : 450);
  });

  $$('[data-format]').forEach(function (b) {
    b.addEventListener('click', function () {
      fmt = b.dataset.format;
      $$('[data-format]').forEach(function (x) { x.setAttribute('aria-pressed', x === b ? 'true' : 'false'); });
      stage.dataset.format = fmt;
      draw();
    });
  });

  /* exportação */
  var toastEl = $('#toast'), toastTimer;
  function toast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 3200);
  }
  function slug(s) { return fold(s || 'passageiro').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'passageiro'; }
  function exportBlob() {
    var c = document.createElement('canvas');
    render(c, fmt, current.tk, 1e12, current.im); // tempo "infinito": letras já paradas
    return new Promise(function (res) { c.toBlob(res, 'image/png'); });
  }
  function fileName() { return 'passagem-vice-city-' + slug(state.n) + '-' + FORMATS[fmt].file + '.png'; }
  function needName() {
    if (state.n) return false;
    toast('Escreva seu nome ou apelido primeiro.');
    form.elements.n.focus();
    return true;
  }

  $('#download').addEventListener('click', function () {
    if (needName() || !current) return;
    exportBlob().then(function (blob) {
      var a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = fileName();
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(function () { URL.revokeObjectURL(a.href); }, 2000);
      toast('Imagem salva: ' + FORMATS[fmt].label.toLowerCase() + ' pronto para postar.');
    });
  });

  var shareBtn = $('#share');
  if (!navigator.share) shareBtn.hidden = true;
  shareBtn.addEventListener('click', function () {
    if (needName() || !current) return;
    var url = shareURL(state);
    var text = 'Minha passagem para Vice City já está emitida: voo LA 1119, portão VI, 19/11. Emita a sua:';
    exportBlob().then(function (blob) {
      var file = new File([blob], fileName(), { type: 'image/png' });
      var data = navigator.canShare && navigator.canShare({ files: [file] })
        ? { files: [file], title: 'Passagem para Vice City', text: text + ' ' + url }
        : { title: 'Passagem para Vice City', text: text, url: url };
      return navigator.share(data);
    }).catch(function () {});
  });

  $('#copy').addEventListener('click', function () {
    if (needName()) return;
    var url = shareURL(state);
    (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(
      function () { toast('Link do bilhete copiado. Quem abrir vê a sua passagem.'); },
      function () { window.prompt('Copie o link da sua passagem:', url); }
    );
  });

  /* inclinação holográfica do cartão (mouse) */
  if (FINE && !REDUCE) {
    stage.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      stage.style.setProperty('--rx', ((0.5 - y) * 10).toFixed(2) + 'deg');
      stage.style.setProperty('--ry', ((x - 0.5) * 12).toFixed(2) + 'deg');
      stage.style.setProperty('--mx', (x * 100).toFixed(1) + '%');
      stage.style.setProperty('--my', (y * 100).toFixed(1) + '%');
    });
    stage.addEventListener('pointerleave', function () {
      ['--rx', '--ry', '--mx', '--my'].forEach(function (p) { stage.style.removeProperty(p); });
    });
  }

  /* contagem no topo e status do bilhete atualizados a cada minuto */
  function tickClock() {
    var ms = Math.max(0, RELEASE - Date.now());
    var d = Math.floor(ms / 864e5), h = Math.floor(ms % 864e5 / 36e5), m = Math.floor(ms % 36e5 / 6e4);
    $('[data-mini]').textContent = ms ? d + 'd ' + pad(h) + 'h ' + pad(m) + 'min' : 'Já em Leonida';
    draw();
  }
  setInterval(tickClock, 60000);

  // bilhete compartilhado: avisa de quem é e convida a emitir o próprio
  if (shared) {
    var note = $('#sharedNote');
    note.hidden = false;
    $('strong', note).textContent = clean(urlState.n);
  }

  fill();
  var fontsReady = document.fonts ? Promise.all([
    document.fonts.load('900 60px "Big Shoulders Display"'), document.fonts.load('400 60px "Mr Dafoe"'),
    document.fonts.load('600 20px "IBM Plex Mono"'), document.fonts.load('500 20px "IBM Plex Mono"'),
    document.fonts.load('800 20px Manrope')
  ]) : Promise.resolve();
  fontsReady.then(function () { tickClock(); update(true); }, function () { update(true); });
})();
