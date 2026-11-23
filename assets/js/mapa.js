/* Mapa de Leonida — Leaflet sobre os blocos e os lugares da GTA VI Mapping Community
   (gtadb.org, CC BY 4.0), gerados por tools/build-mapa.py.
   Geometria do gtadb: 32.768 unidades do jogo, origem deslocada em 16.384, y para cima;
   no zoom 0 o mapa tem 1.024 px (4 x 4 blocos de 256 px). */
(function () {
  'use strict';

  var V = '20261123c';
  // jsDelivr recusa parte das fotos (o repositório passa do limite de 50 MB dele); o raw do GitHub serve todas
  var PHOTO = 'https://raw.githubusercontent.com/rolux/gtadb.org/main/map/photos/6/L';
  var STORE = 'vi-mapa';
  var REDUCE = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function fold(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function fmt(n) { return n.toLocaleString('pt-BR'); }

  // ordem da lista de filtros; "on" = ligada na primeira visita
  var CATS = [
    { id: 'safehouse', name: 'Esconderijos', color: '#ff4f9a', on: true },
    { id: 'guns', name: 'Armas e receptadores', color: '#ff5a4a', on: true },
    { id: 'auto', name: 'Postos, oficinas e Pay ’n’ Spray', color: '#ffb347', on: true },
    { id: 'style', name: 'Roupas, cabelo e tatuagem', color: '#ff8ad8', on: true },
    { id: 'shops', name: 'Lojas e mercados', color: '#ffd98a', on: true },
    { id: 'food', name: 'Comida, bares e baladas', color: '#ff7a5c', on: true },
    { id: 'transit', name: 'Transporte', color: '#59b8ff', on: true },
    { id: 'emergency', name: 'Polícia, hospitais e prisões', color: '#8a7bff', on: true },
    { id: 'fun', name: 'Esporte e lazer', color: '#45f0d1', on: true },
    { id: 'hotel', name: 'Hotéis', color: '#c58cff', on: true },
    { id: 'landmark', name: 'Pontos turísticos', color: '#fff4ea', on: true },
    { id: 'nature', name: 'Natureza', color: '#7ee08a', on: true },
    { id: 'public', name: 'Prédios públicos', color: '#b6c4d9', on: true },
    { id: 'industry', name: 'Indústria e serviços', color: '#9aa3ad', on: true },
    { id: 'office', name: 'Escritórios', color: '#a3b8ff', on: true },
    { id: 'home', name: 'Casas e prédios residenciais', color: '#e6b8a2', on: false },
    { id: 'other', name: 'Outros prédios reconhecidos', color: '#d9d2e9', on: false }
  ];
  var CAT = {};
  CATS.forEach(function (c) { CAT[c.id] = c; });
  // os serviços do jogo ganham ponto maior: são o que quem joga procura
  var BIG = { safehouse: 1, guns: 1, auto: 1, style: 1, shops: 1, food: 1, transit: 1, emergency: 1, fun: 1 };
  var FLAG = [[1, 'Dá para entrar'], [2, 'Não confirmado'], [4, 'Demolido na vida real'], [8, 'Fechado na vida real'], [16, 'Prédio reaproveitado'], [32, 'Espelhado da vida real']];

  /* ---------------- estado salvo no aparelho ---------------- */
  var st = { cats: {}, saved: [], visited: [], only: {} };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(STORE) || '{}')); } catch (e) {}
  function persist() { try { localStorage.setItem(STORE, JSON.stringify(st)); } catch (e) {} }
  var saved = new Set(st.saved), visited = new Set(st.visited);
  function catOn(id) { return st.cats[id] == null ? CAT[id].on : st.cats[id]; }

  var toastEl = $('#toast'), toastT;
  function toast(m) {
    toastEl.textContent = m;
    toastEl.classList.add('is-visible');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2600);
  }

  /* ---------------- mapa ---------------- */
  var S = 1 / 32;
  var crs = L.extend({}, L.CRS.Simple, { transformation: new L.Transformation(S, 512, -S, 512) });
  var map = L.map('map', {
    crs: crs, zoomControl: false, attributionControl: false,
    minZoom: 0.5, maxZoom: 7, zoomSnap: 0.25, zoomDelta: 1, wheelPxPerZoomLevel: 110,
    maxBounds: L.latLngBounds([-12500, -14500], [12500, 7500]), maxBoundsViscosity: 0.8,
    preferCanvas: true, fadeAnimation: !REDUCE, zoomAnimation: !REDUCE, markerZoomAnimation: !REDUCE
  });
  var LAND = L.latLngBounds([-8600, -10400], [9700, 4400]);
  var msg = $('[data-msg]');

  fetch('assets/mapa/mapa.json?v=' + V).then(function (r) {
    if (!r.ok) throw new Error(r.status);
    return r.json();
  }).then(start).catch(function () {
    msg.textContent = 'Não deu para carregar o mapa. Confira a conexão e recarregue a página.';
  });

  function start(data) {
    // índice dos blocos que existem (o resto é mar, pintado pelo fundo do mapa)
    var have = {};
    Object.keys(data.tiles.rows).forEach(function (z) {
      data.tiles.rows[z].forEach(function (r) {
        for (var i = 1; i < r.length; i += 2) for (var x = r[i]; x <= r[i + 1]; x++) have[z + '/' + x + '/' + r[0]] = 1;
      });
    });
    var Tiles = L.TileLayer.extend({
      createTile: function (c, done) {
        if (!have[c.z + '/' + c.x + '/' + c.y]) {
          var sea = document.createElement('div');
          setTimeout(function () { done(null, sea); }, 0);
          return sea;
        }
        return L.TileLayer.prototype.createTile.call(this, c, done);
      }
    });
    new Tiles('assets/mapa/tiles/{z}/{x}_{y}.webp', {
      maxNativeZoom: data.tiles.maxZoom, maxZoom: 7, minZoom: 0, tileSize: 256,
      noWrap: true, keepBuffer: 3, updateWhenZooming: false
    }).addTo(map);

    var places = data.places.map(function (p) {
      return { id: p[0], name: p[1], area: p[2], x: p[3], y: p[4], cat: p[5], flags: p[6], real: p[7], lat: p[8], lng: p[9], ph: p[10],
        key: fold(p[1] + ' | ' + p[2] + ' | ' + p[7]) };
    });
    var byId = {};
    places.forEach(function (p) { byId[p.id] = p; });
    $('[data-total]').textContent = fmt(places.length) + ' lugares';

    /* marcadores em canvas: milhares de pontos sem pesar */
    var renderer = L.canvas({ padding: 0.5, tolerance: 6 });
    var layer = L.layerGroup().addTo(map);
    var active = null;
    function radius(p) {
      var z = map.getZoom(), big = BIG[p.cat];
      return Math.max(2, (big ? 3.2 : 2) + (z - 1) * (big ? 1.1 : 0.7));
    }
    places.forEach(function (p) {
      p.m = L.circleMarker([p.y, p.x], {
        renderer: renderer, radius: 3, weight: 1.5, color: '#120720', fillColor: CAT[p.cat].color, fillOpacity: 0.95
      });
      p.m.on('click', function () { open(p, false); });
      p.m.bindTooltip(function () { return label(p); }, { direction: 'top', offset: [0, -4], className: 'mtip' });
    });
    function restyle() {
      places.forEach(function (p) {
        p.m.setRadius(radius(p) + (p === active ? 3 : 0));
        p.m.setStyle({ color: p === active ? '#fff4ea' : visited.has(p.id) ? '#45f0d1' : '#120720', weight: p === active ? 3 : 1.5, fillOpacity: visited.has(p.id) ? 0.55 : 0.95 });
      });
    }
    map.on('zoomend', restyle);

    /* rótulos das regiões no centro dos lugares de cada uma */
    var regions = {};
    places.forEach(function (p) {
      var r = p.area.split(', ').pop();
      if (!r) return;
      (regions[r] = regions[r] || { n: 0, x: 0, y: 0 });
      regions[r].n++; regions[r].x += p.x; regions[r].y += p.y;
    });
    var regionLayer = L.layerGroup();
    Object.keys(regions).forEach(function (name) {
      var r = regions[name];
      if (r.n < 25) return;
      L.marker([r.y / r.n, r.x / r.n], {
        interactive: false, keyboard: false, n: r.n,
        icon: L.divIcon({ className: 'mregion', html: '<span>' + name + '</span>', iconSize: null })
      }).addTo(regionLayer);
    });
    function syncRegions() {
      var z = map.getZoom();
      if (z >= 3.5) { regionLayer.remove(); return; }
      regionLayer.addTo(map);
      // regiões com mais lugares primeiro; uma que encostaria noutra já mostrada fica oculta
      var shown = [];
      regionLayer.getLayers().sort(function (a, b) { return b.options.n - a.options.n; }).forEach(function (m) {
        var el = m.getElement();
        el.classList.remove('is-hidden');
        var r = el.firstChild.getBoundingClientRect();
        var box = map.getContainer().getBoundingClientRect();
        var hit = r.left < box.left + 4 || r.right > box.right - 4 ||
          shown.some(function (s) { return r.left < s.right + 8 && r.right > s.left - 8 && r.top < s.bottom + 4 && r.bottom > s.top - 4; });
        el.classList.toggle('is-hidden', hit);
        if (!hit) shown.push(r);
      });
    }
    map.on('zoomend moveend', syncRegions);

    /* segredos: easter eggs e carros raros do guia (guias-data.js, progresso de guias.html) */
    var SG = window.VI_GUIAS, secById = {};
    if (!st.secrets) st.secrets = {};
    if (SG) {
      var guideDone = new Set();
      try { guideDone = new Set(JSON.parse(localStorage.getItem('vi-guias') || '{}').done || []); } catch (e) {}
      [['eggs', SG.eggs, '#ff4f9a', SG.EGG_KIND, 'kind'], ['cars', SG.cars, '#ff9a3c', SG.CAR_GRP, 'grp']].forEach(function (g) {
        var group = L.layerGroup(), box = $('[data-secret="' + g[0] + '"]');
        g[1].forEach(function (it, i) {
          // sem ponto exato publicado: o círculo mostra a área onde procurar
          if (!it.exact && it.r) {
            L.circle([it.y, it.x], { radius: it.r, color: g[2], weight: 1.5, dashArray: '5 6', fillColor: g[2], fillOpacity: 0.1, interactive: false }).addTo(group);
          }
          var m = L.marker([it.y, it.x], {
            title: it.t, riseOnHover: true, zIndexOffset: 1000,
            icon: L.divIcon({ className: 'msec msec--' + g[0].slice(0, -1) + (guideDone.has(it.id) ? ' is-done' : ''), html: g[0] === 'eggs' ? '✦' : String(i + 1), iconSize: [30, 30] })
          });
          m.bindPopup(secretPopup(it, g[3][it[g[4]]], g[2]), {
            maxWidth: 280,
            autoPanPaddingTopLeft: L.point(window.innerWidth >= 900 ? 410 : 16, 76),
            autoPanPaddingBottomRight: L.point(16, window.innerWidth >= 900 ? 16 : 170)
          });
          m.addTo(group);
          secById[it.id] = { m: m, box: box };
        });
        $('[data-nsec="' + g[0] + '"]').textContent = g[1].length;
        box.checked = st.secrets[g[0]] !== false;
        if (box.checked) group.addTo(map);
        box.addEventListener('change', function () {
          st.secrets[g[0]] = box.checked;
          persist();
          if (box.checked) group.addTo(map); else group.remove();
        });
      });
    }
    function secretPopup(it, tag, color) {
      var d = document.createElement('div');
      d.className = 'spop';
      d.innerHTML = '<span class="spop__tag"></span><h3></h3><p></p><p class="spop__area"></p><a></a>';
      $('.spop__tag', d).textContent = tag + (it.ok ? ' · confirmado' : ' · relatado');
      $('.spop__tag', d).style.color = color;
      $('h3', d).textContent = it.t;
      $('p', d).textContent = it.where;
      $('.spop__area', d).textContent = it.exact ? 'Ponto exato.' : 'O círculo tracejado marca a área onde procurar.';
      $('a', d).href = 'guias.html#g=' + it.id;
      $('a', d).textContent = 'Passo a passo →';
      return d;
    }

    /* ---------------- filtros ---------------- */
    var counts = {};
    places.forEach(function (p) { counts[p.cat] = (counts[p.cat] || 0) + 1; });
    var catList = $('[data-cats]');
    CATS.forEach(function (c) {
      if (!counts[c.id]) return;
      var li = document.createElement('li');
      li.innerHTML = '<label class="cat" style="--c:' + c.color + '"><input type="checkbox"><span class="cat__dot" aria-hidden="true"></span><span class="cat__name"></span><span class="cat__n"></span></label>';
      $('input', li).checked = catOn(c.id);
      $('input', li).dataset.cat = c.id;
      $('.cat__name', li).textContent = c.name;
      $('.cat__n', li).textContent = fmt(counts[c.id]);
      catList.appendChild(li);
    });
    $$('[data-only]').forEach(function (i) { i.checked = !!st.only[i.dataset.only]; });

    var search = $('#busca'), query = '';
    function visible(p) {
      if (!catOn(p.cat)) return false;
      if (st.only.enter && !(p.flags & 1)) return false;
      if (st.only.photo && !p.ph) return false;
      if (st.only.unvisited && visited.has(p.id)) return false;
      return true;
    }
    function matches(p) {
      if (!query) return true;
      return query.split(' ').every(function (w) { return p.key.indexOf(w) !== -1; });
    }
    var results = [];
    function apply() {
      layer.clearLayers();
      results = [];
      places.forEach(function (p) {
        var ok = (query ? matches(p) : visible(p));
        if (ok) { layer.addLayer(p.m); results.push(p); }
      });
      if (active && !layer.hasLayer(active.m)) layer.addLayer(active.m);
      // nomes primeiro e, na busca, quem começa com o termo
      results.sort(function (a, b) {
        if (query) {
          var sa = fold(a.name).indexOf(query) === 0 ? 0 : 1, sb = fold(b.name).indexOf(query) === 0 ? 0 : 1;
          if (sa !== sb) return sa - sb;
        }
        return (a.name ? 0 : 1) - (b.name ? 0 : 1) || (BIG[b.cat] ? 1 : 0) - (BIG[a.cat] ? 1 : 0) || a.name.localeCompare(b.name);
      });
      $('[data-nres]').textContent = fmt(results.length);
      renderList($('[data-results]'), results, query ? 'Nenhum lugar com esse nome. Tente o bairro ou o endereço real.' : 'Nenhum lugar com esses filtros.');
      restyle();
    }
    function persistAndApply() {
      st.saved = Array.from(saved); st.visited = Array.from(visited);
      persist(); apply(); renderSaved();
    }

    catList.addEventListener('change', function (e) {
      st.cats[e.target.dataset.cat] = e.target.checked;
      persistAndApply();
    });
    $$('[data-only]').forEach(function (i) {
      i.addEventListener('change', function () { st.only[i.dataset.only] = i.checked; persistAndApply(); });
    });
    $$('[data-all]').forEach(function (b) {
      b.addEventListener('click', function () {
        var on = b.dataset.all === 'on';
        $$('input', catList).forEach(function (i) { i.checked = on; st.cats[i.dataset.cat] = on; });
        persistAndApply();
      });
    });
    var qT;
    search.addEventListener('input', function () {
      clearTimeout(qT);
      qT = setTimeout(function () {
        query = fold(search.value.trim()).replace(/\s+/g, ' ');
        apply();
        if (query) tab('lista');
      }, 120);
    });
    search.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && results[0]) { open(results[0], true); search.blur(); }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === '/' && document.activeElement !== search && !/input|textarea|select/i.test(document.activeElement.tagName)) { e.preventDefault(); setPanel('open'); search.focus(); }
      if (e.key === 'Escape' && active) close();
    });

    /* ---------------- lista ---------------- */
    var LIMIT = 80;
    function label(p) { return p.name || (p.real ? p.real.split(',')[0] : 'Prédio sem nome'); }
    function renderList(ol, list, empty) {
      ol.innerHTML = '';
      if (!list.length) { ol.innerHTML = '<li class="results__empty"></li>'; ol.firstChild.textContent = empty; return; }
      list.slice(0, LIMIT).forEach(function (p) {
        var li = document.createElement('li');
        li.innerHTML = '<button type="button" style="--c:' + CAT[p.cat].color + '"><span class="r__dot" aria-hidden="true"></span><span class="r__txt"><strong></strong><small></small></span></button>';
        $('strong', li).textContent = (saved.has(p.id) ? '★ ' : '') + label(p) + (visited.has(p.id) ? ' ✓' : '');
        $('small', li).textContent = p.name ? p.area : (p.area + ' · na vida real');
        $('button', li).addEventListener('click', function () { open(p, true); });
        ol.appendChild(li);
      });
      if (list.length > LIMIT) {
        var more = document.createElement('li');
        more.className = 'results__more';
        more.textContent = 'Mostrando ' + LIMIT + ' de ' + fmt(list.length) + '. Refine a busca para achar mais.';
        ol.appendChild(more);
      }
    }
    function renderSaved() {
      var list = places.filter(function (p) { return saved.has(p.id); });
      $('[data-nsaved]').textContent = list.length ? fmt(list.length) : '';
      renderList($('[data-saved]'), list, 'Nenhum lugar salvo ainda. Abra um lugar e toque em Salvar.');
    }

    /* ---------------- painel: abas e gaveta no celular ---------------- */
    function tab(name) {
      $$('[data-tab]').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.tab === name ? 'true' : 'false'); });
      $$('[data-pane]').forEach(function (p) { p.hidden = p.dataset.pane !== name; });
    }
    $$('[data-tab]').forEach(function (b) { b.addEventListener('click', function () { tab(b.dataset.tab); setPanel('open'); }); });
    var panel = $('#panel'), grip = $('[data-grip]');
    function setPanel(s) {
      panel.dataset.state = s;
      grip.setAttribute('aria-expanded', s === 'open' ? 'true' : 'false');
    }
    grip.addEventListener('click', function () { setPanel(panel.dataset.state === 'open' ? 'peek' : 'open'); });
    search.addEventListener('focus', function () { setPanel('open'); });
    // arrastar a alça no celular
    var dragY = null;
    grip.addEventListener('pointerdown', function (e) { dragY = e.clientY; grip.setPointerCapture(e.pointerId); });
    grip.addEventListener('pointerup', function (e) {
      if (dragY == null) return;
      var dy = e.clientY - dragY; dragY = null;
      if (Math.abs(dy) > 30) setPanel(dy < 0 ? 'open' : 'peek');
    });

    /* ---------------- ficha do lugar ---------------- */
    var home = $('[data-view="home"]'), card = $('[data-view="place"]');
    var lastFocus = null;
    function open(p, fly) {
      active = p;
      lastFocus = document.activeElement;
      layer.addLayer(p.m);
      restyle();
      p.m.bringToFront();
      var c = CAT[p.cat];
      $('[data-p-cat]').textContent = c.name;
      $('[data-p-cat]').style.setProperty('--c', c.color);
      $('[data-p-name]').textContent = label(p);
      $('[data-p-area]').textContent = p.name ? p.area : 'Nome no jogo ainda não identificado · ' + p.area;
      var flags = $('[data-p-flags]');
      flags.innerHTML = '';
      FLAG.forEach(function (f) {
        if (!(p.flags & f[0])) return;
        var li = document.createElement('li');
        li.textContent = f[1];
        if (f[0] === 1) li.className = 'is-good';
        flags.appendChild(li);
      });
      // fotos: com as duas, comparação arrastável; com uma, foto simples
      var cmp = $('[data-p-compare]'), single = $('[data-p-single]');
      cmp.hidden = single.hidden = true;
      if ((p.ph & 3) === 3) {
        $('[data-p-ig]').src = PHOTO + p.id + ',ig.jpg';
        $('[data-p-ig]').alt = 'Foto no jogo: ' + label(p);
        $('[data-p-rl]').src = PHOTO + p.id + ',rl.jpg';
        $('[data-p-rl]').alt = 'Foto na vida real: ' + (p.real.split(',')[0] || label(p));
        $('[data-p-range]').value = 50;
        split(50);
        cmp.hidden = false;
      } else if (p.ph) {
        var ig = p.ph & 1;
        $('img', single).src = PHOTO + p.id + (ig ? ',ig.jpg' : ',rl.jpg');
        $('img', single).alt = (ig ? 'Foto no jogo: ' : 'Foto na vida real: ') + label(p);
        $('figcaption', single).textContent = ig ? 'No jogo' : 'Na vida real';
        single.hidden = false;
      }
      var real = $('[data-p-real]');
      real.hidden = !p.real;
      if (p.real) {
        $('[data-p-realaddr]').textContent = p.real;
        var a = $('[data-p-gmaps]');
        a.hidden = !p.lat;
        a.href = 'https://www.google.com/maps/search/?api=1&query=' + p.lat + ',' + p.lng;
      }
      $('[data-p-coords]').textContent = 'Coordenadas no jogo: x ' + fmt(Math.round(p.x)) + ', y ' + fmt(Math.round(p.y)) + ' · gtadb L' + p.id;
      syncButtons();
      home.hidden = true;
      card.hidden = false;
      setPanel(window.innerWidth < 900 ? 'place' : 'open');
      card.scrollTop = 0;
      $('[data-close]').focus({ preventScroll: true });
      if (fly) focus(p, Math.max(map.getZoom(), 5), true);
      history.replaceState(null, '', '#l=' + p.id);
      document.title = label(p) + ' — Mapa de Leonida';
    }
    function close() {
      active = null;
      card.hidden = true;
      home.hidden = false;
      apply();
      history.replaceState(null, '', location.pathname + location.search);
      document.title = 'Mapa de Leonida — GTA VI · 3.663 lugares com a versão da vida real';
      if (lastFocus && document.body.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
    }
    $('[data-close]').addEventListener('click', close);
    // centraliza o lugar na parte do mapa que o painel não cobre (à direita no desktop, acima no celular)
    function focus(p, z, animate) {
      // no celular a gaveta da ficha ocupa 60% da altura (ver mapa.css); a medida direta pegaria a animação no meio
      var mobile = window.innerWidth < 900;
      var shift = mobile ? [0, map.getSize().y * 0.3] : [-(panel.getBoundingClientRect().right + 14) / 2, 0];
      var c = map.unproject(map.project([p.y, p.x], z).add(shift), z);
      if (animate && !REDUCE) map.flyTo(c, z, { duration: 0.9 }); else map.setView(c, z, { animate: false });
    }
    function syncButtons() {
      var p = active;
      $('[data-p-save] .btn__label').textContent = saved.has(p.id) ? '★ Salvo' : 'Salvar';
      $('[data-p-visit] .btn__label').textContent = visited.has(p.id) ? '✓ Visitado' : 'Já visitei';
    }
    $('[data-p-save]').addEventListener('click', function () {
      if (saved.has(active.id)) saved.delete(active.id); else saved.add(active.id);
      syncButtons(); persistAndApply();
      toast(saved.has(active.id) ? 'Salvo na sua lista.' : 'Removido da sua lista.');
    });
    $('[data-p-visit]').addEventListener('click', function () {
      if (visited.has(active.id)) visited.delete(active.id); else visited.add(active.id);
      syncButtons(); persistAndApply();
    });
    $('[data-p-share]').addEventListener('click', function () {
      var url = location.href.split('#')[0] + '#l=' + active.id;
      (navigator.clipboard ? navigator.clipboard.writeText(url) : Promise.reject()).then(
        function () { toast('Link do lugar copiado.'); },
        function () { window.prompt('Copie o link do lugar:', url); }
      );
    });
    // foto que não carregar some sem deixar moldura vazia
    $$('[data-view="place"] img').forEach(function (im) {
      im.addEventListener('error', function () { (im.closest('[data-p-compare]') || im.closest('[data-p-single]')).hidden = true; });
    });
    var range = $('[data-p-range]');
    function split(v) {
      var c = $('[data-p-compare]');
      c.style.setProperty('--split', v + '%');
      // a etiqueta some quando o lado dela quase não aparece, para nunca ficar sobre a foto errada
      $('.compare__tag--ig', c).hidden = v < 22;
      $('.compare__tag--rl', c).hidden = v > 78;
    }
    range.addEventListener('input', function () { split(+range.value); });

    /* ---------------- controles ---------------- */
    $$('[data-zoom]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.dataset.zoom === 'in') map.zoomIn();
        else if (b.dataset.zoom === 'out') map.zoomOut();
        else map.flyToBounds(LAND, { duration: REDUCE ? 0 : 0.8 });
      });
    });
    var coord = $('[data-coord]');
    map.on('mousemove', function (e) { coord.textContent = 'x ' + fmt(Math.round(e.latlng.lng)) + ' · y ' + fmt(Math.round(e.latlng.lat)); });
    map.on('click', function () { if (active && window.innerWidth < 900) setPanel('peek'); });

    /* início: lugar do link, ou Leonida inteira */
    map.fitBounds(LAND, { animate: false });
    syncRegions();
    apply();
    renderSaved();
    msg.hidden = true;
    var m = location.hash.match(/^#l=(\d+)/);
    if (m && byId[m[1]]) { open(byId[m[1]], false); focus(byId[m[1]], 5, false); }
    var g = location.hash.match(/^#g=([\w-]+)/);
    if (g && secById[g[1]]) {
      var sec = secById[g[1]];
      if (!sec.box.checked) { sec.box.checked = true; sec.box.dispatchEvent(new Event('change')); }
      map.setView(sec.m.getLatLng(), 4.5, { animate: false });
      sec.m.openPopup();
    }
    if (!(m && byId[m[1]]) && window.innerWidth < 900) setPanel('peek');
  }
})();
