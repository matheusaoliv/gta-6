/* Segredos de Leonida — fichas, busca, progresso salvo e modo treino das trapaças.
   Dados em guias-data.js; o mapa (mapa.js) lê o mesmo arquivo e o mesmo progresso. */
(function () {
  'use strict';

  var G = window.VI_GUIAS;
  var STORE = 'vi-guias';
  var ARROW = { U: '↑', D: '↓', L: '←', R: '→' };
  var ARROW_NAME = { U: 'cima', D: 'baixo', L: 'esquerda', R: 'direita' };
  function $(s, c) { return (c || document).querySelector(s); }
  function $$(s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); }
  function fold(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function el(tag, cls, text) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text != null) e.textContent = text;
    return e;
  }

  /* ---------------- estado no aparelho (compartilhado com o mapa) ---------------- */
  var st = { done: [], hide: false };
  try { st = Object.assign(st, JSON.parse(localStorage.getItem(STORE) || '{}')); } catch (e) {}
  var done = new Set(st.done);
  function persist() {
    st.done = Array.from(done);
    try { localStorage.setItem(STORE, JSON.stringify(st)); } catch (e) {}
  }

  var toastEl = $('#toast'), toastT;
  function toast(m) {
    toastEl.textContent = m;
    toastEl.classList.add('is-visible');
    clearTimeout(toastT);
    toastT = setTimeout(function () { toastEl.classList.remove('is-visible'); }, 2600);
  }

  /* ---------------- abas ---------------- */
  var TABS = {
    ovos: { items: G.eggs, group: 'kind', names: G.EGG_KIND, hide: 'Esconder os que já achei', search: 'Buscar easter egg, bairro ou referência' },
    carros: { items: G.cars, group: 'grp', names: G.CAR_GRP, hide: 'Esconder os que já peguei', search: 'Buscar carro ou bairro' },
    trapacas: { items: G.cheats, group: 'cat', names: G.CHEAT_CAT, hide: 'Esconder as que já liberei', search: 'Buscar trapaça, efeito ou desafio', extra: { code: 'Com código publicado' } }
  };
  Object.keys(TABS).forEach(function (k) {
    TABS[k].items.forEach(function (it) {
      it.tab = k;
      it.key = fold([it.t, it.sub, it.sum, it.where, it.fx, it.unlock, TABS[k].names[it[TABS[k].group]]].join(' '));
    });
  });
  var cur = 'ovos', filter = '', query = '';

  function tab(name, keepHash) {
    cur = name;
    filter = '';
    $$('[data-tab]').forEach(function (b) { b.setAttribute('aria-selected', b.dataset.tab === name ? 'true' : 'false'); });
    $$('[data-pane]').forEach(function (p) { p.hidden = p.dataset.pane !== name; });
    $('#gbusca').placeholder = TABS[name].search;
    $('[data-hide-label]').textContent = TABS[name].hide;
    renderChips();
    apply();
    if (!keepHash) history.replaceState(null, '', '#' + name);
  }
  $$('[data-tab]').forEach(function (b) { b.addEventListener('click', function () { tab(b.dataset.tab); }); });
  // setas trocam de aba, como pede o padrão de tablist
  $('.gtabs').addEventListener('keydown', function (e) {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    var names = Object.keys(TABS), i = names.indexOf(cur) + (e.key === 'ArrowRight' ? 1 : -1);
    var next = names[(i + names.length) % names.length];
    tab(next);
    $('[data-tab="' + next + '"]').focus();
  });

  function renderChips() {
    var box = $('[data-chips]'), T = TABS[cur];
    box.innerHTML = '';
    var opts = [['', 'Todos']].concat(Object.keys(T.names).map(function (k) { return [k, T.names[k]]; }));
    if (T.extra) Object.keys(T.extra).forEach(function (k) { opts.push(['+' + k, T.extra[k]]); });
    opts.forEach(function (o) {
      var n = o[0] === '' ? T.items.length : o[0] === '+code' ? T.items.filter(function (i) { return i.code; }).length
        : T.items.filter(function (i) { return i[T.group] === o[0]; }).length;
      if (!n) return;
      var b = el('button', 'gchip');
      b.type = 'button';
      b.dataset.f = o[0];
      b.setAttribute('aria-pressed', filter === o[0] ? 'true' : 'false');
      b.textContent = o[1] + ' ';
      b.appendChild(el('small', '', n));
      b.addEventListener('click', function () { filter = o[0]; renderChips(); apply(); });
      box.appendChild(b);
    });
  }

  /* ---------------- fichas ---------------- */
  function chip(text, cls) { return el('span', 'gtag ' + (cls || ''), text); }
  function sources(list) {
    var p = el('p', 'gsrc');
    p.appendChild(document.createTextNode('Fontes: '));
    list.forEach(function (s, i) {
      if (i) p.appendChild(document.createTextNode(' · '));
      var a = el('a', '', s[0]);
      a.href = s[1]; a.target = '_blank'; a.rel = 'noopener';
      p.appendChild(a);
    });
    return p;
  }
  function checkBtn(it, word) {
    var b = el('button', 'gcheck');
    b.type = 'button';
    b.dataset.check = it.id;
    b.innerHTML = '<span aria-hidden="true">✓</span>';
    b.appendChild(el('span', 'sr-only', word + ': ' + it.t));
    b.addEventListener('click', function () {
      if (done.has(it.id)) done.delete(it.id); else done.add(it.id);
      persist();
      syncChecks();
      if (st.hide) apply();
      toast(done.has(it.id) ? '“' + it.t + '” marcado. ' + progressText(cur) : 'Marcação removida.');
    });
    return b;
  }
  function field(dl, label, text) {
    if (!text) return;
    dl.appendChild(el('dt', '', label));
    dl.appendChild(el('dd', '', text));
  }
  function money(n) { return 'US$ ' + n.toLocaleString('pt-BR'); }

  function placeCard(it, i) {
    var T = TABS[it.tab];
    var art = el('article', 'gcard');
    art.id = 'g-' + it.id;
    art.dataset.id = it.id;
    art.appendChild(checkBtn(it, it.tab === 'carros' ? 'Já peguei' : 'Já achei'));
    var det = el('details');
    var sum = el('summary');
    var head = el('div', 'gcard__head');
    var num = el('span', 'gcard__n', String(i + 1).padStart(2, '0'));
    num.setAttribute('aria-hidden', 'true');
    head.appendChild(num);
    var tags = el('p', 'gcard__tags');
    tags.appendChild(chip(T.names[it[T.group]], 'gtag--' + it[T.group]));
    tags.appendChild(chip(it.ok ? 'Confirmado' : 'Relatado', it.ok ? 'gtag--ok' : 'gtag--rel'));
    var txt = el('div', 'gcard__txt');
    txt.appendChild(tags);
    txt.appendChild(el('h3', '', it.t));
    if (it.sub) txt.appendChild(el('p', 'gcard__sub', it.sub));
    txt.appendChild(el('p', 'gcard__sum', it.sum || it.where));
    head.appendChild(txt);
    sum.appendChild(head);
    det.appendChild(sum);

    var body = el('div', 'gcard__body');
    var dl = el('dl', 'gfacts');
    if (it.sum) field(dl, 'Onde fica', it.where);
    field(dl, it.tab === 'carros' ? 'O que precisa' : 'Quando', it.when);
    body.appendChild(dl);
    body.appendChild(el('h4', '', it.tab === 'carros' ? 'Como pegar' : 'Como encontrar'));
    var ol = el('ol', 'gsteps');
    it.steps.forEach(function (s) { ol.appendChild(el('li', '', s)); });
    body.appendChild(ol);
    var dl2 = el('dl', 'gfacts');
    field(dl2, 'O que você ganha', it.reward);
    if (it.value) field(dl2, 'Valor de venda', money(it.value) + ' (segundo o MapGenie)');
    body.appendChild(dl2);
    if (it.note) body.appendChild(el('p', 'gnote', it.note));

    var act = el('div', 'gcard__act');
    var map = el('a', 'btn btn--sun');
    map.href = 'mapa.html#g=' + it.id;
    map.innerHTML = '<span class="btn__label">Ver no mapa</span>';
    act.appendChild(map);
    var link = it.car || it.egg;
    if (link) {
      var other = el('a', 'btn btn--glass');
      other.href = '#g=' + link;
      other.innerHTML = '<span class="btn__label"></span>';
      other.firstChild.textContent = it.car ? 'Passo a passo do carro' : 'Ver o easter egg';
      act.appendChild(other);
    }
    var share = el('button', 'btn btn--ghost');
    share.type = 'button';
    share.innerHTML = '<span class="btn__label">Copiar link</span>';
    share.addEventListener('click', function () { copy(location.href.split('#')[0] + '#g=' + it.id, 'Link copiado.'); });
    act.appendChild(share);
    body.appendChild(act);
    body.appendChild(sources(it.src));
    det.appendChild(body);
    art.appendChild(det);
    return art;
  }

  function codeKeys(code) {
    var ol = el('ol', 'gcode');
    ol.setAttribute('aria-label', 'Sequência: ' + code.split('').map(function (c) { return ARROW_NAME[c]; }).join(', '));
    code.split('').forEach(function (c) {
      var li = el('li', '', ARROW[c]);
      li.setAttribute('aria-hidden', 'true');
      ol.appendChild(li);
    });
    return ol;
  }
  function cheatCard(it) {
    var art = el('article', 'gcheat' + (it.code ? '' : ' gcheat--nocode'));
    art.id = 'g-' + it.id;
    art.dataset.id = it.id;
    art.appendChild(checkBtn(it, 'Já liberei'));
    var txt = el('div', 'gcheat__txt');
    var tags = el('p', 'gcard__tags');
    tags.appendChild(chip(G.CHEAT_CAT[it.cat], 'gtag--' + it.cat));
    txt.appendChild(tags);
    txt.appendChild(el('h3', '', it.t));
    txt.appendChild(el('p', 'gcheat__fx', it.fx));
    var un = el('p', 'gcheat__un');
    un.appendChild(el('strong', '', 'Libera: '));
    un.appendChild(document.createTextNode(it.unlock));
    txt.appendChild(un);
    art.appendChild(txt);
    var side = el('div', 'gcheat__code');
    if (it.code) {
      side.appendChild(codeKeys(it.code));
      var row = el('div', 'gcheat__btns');
      var tr = el('button', 'gmini gmini--hot', 'Treinar');
      tr.type = 'button';
      tr.addEventListener('click', function () { train(it); });
      var cp = el('button', 'gmini', 'Copiar');
      cp.type = 'button';
      cp.addEventListener('click', function () {
        copy(it.t + ': ' + it.code.split('').map(function (c) { return ARROW[c]; }).join(' '), 'Sequência copiada.');
      });
      row.appendChild(tr); row.appendChild(cp);
      side.appendChild(row);
    } else {
      side.appendChild(el('p', 'gcheat__wait', 'Código ainda não publicado'));
    }
    art.appendChild(side);
    return art;
  }

  // monta tudo uma vez; filtros e busca só escondem
  Object.keys(TABS).forEach(function (k) {
    var list = $('[data-pane="' + k + '"] [data-list]');
    TABS[k].items.forEach(function (it, i) {
      it.node = k === 'trapacas' ? cheatCard(it) : placeCard(it, i);
      list.appendChild(it.node);
    });
    var empty = el('p', 'gempty', 'Nada encontrado. Tente outra palavra ou limpe o filtro.');
    empty.hidden = true;
    list.appendChild(empty);
    TABS[k].empty = empty;
  });
  var rl = $('[data-randy]');
  G.randy.steps.forEach(function (s) { rl.appendChild(el('li', '', s)); });
  $('[data-randy-src]').replaceWith(sources(G.randy.src));
  $('[data-cheat-src]').replaceWith(sources(G.cheatSrc));

  function apply() {
    var T = TABS[cur], n = 0;
    T.items.forEach(function (it) {
      var ok = (!filter || (filter === '+code' ? !!it.code : it[T.group] === filter)) &&
        (!query || query.split(' ').every(function (w) { return it.key.indexOf(w) !== -1; })) &&
        !(st.hide && done.has(it.id));
      it.node.hidden = !ok;
      if (ok) n++;
    });
    T.empty.hidden = n > 0;
  }
  var qT;
  $('#gbusca').addEventListener('input', function (e) {
    clearTimeout(qT);
    qT = setTimeout(function () { query = fold(e.target.value.trim()).replace(/\s+/g, ' '); apply(); }, 100);
  });
  var hideBox = $('[data-hide-done]');
  hideBox.checked = !!st.hide;
  hideBox.addEventListener('change', function () { st.hide = hideBox.checked; persist(); apply(); });

  /* ---------------- progresso ---------------- */
  function progressText(k) {
    var T = TABS[k], d = T.items.filter(function (i) { return done.has(i.id); }).length;
    return d + ' de ' + T.items.length + (k === 'trapacas' ? ' liberadas' : k === 'carros' ? ' pegos' : ' achados');
  }
  function syncChecks() {
    var all = 0, of = 0;
    Object.keys(TABS).forEach(function (k) {
      var T = TABS[k], d = 0;
      T.items.forEach(function (it) {
        var on = done.has(it.id);
        if (on) d++;
        it.node.classList.toggle('is-done', on);
        $('[data-check]', it.node).setAttribute('aria-pressed', on ? 'true' : 'false');
      });
      all += d; of += T.items.length;
      var pane = $('[data-pane="' + k + '"]');
      $('.gprog__bar span', pane).style.width = (100 * d / T.items.length) + '%';
      $('.gprog p', pane).textContent = progressText(k);
      $('[data-count="' + k + '"]').textContent = d + '/' + T.items.length;
    });
    $('[data-total-n]').textContent = all;
    $('[data-total-of]').textContent = of;
    $('[data-total-bar]').style.width = (100 * all / of) + '%';
  }

  function copy(text, ok) {
    (navigator.clipboard ? navigator.clipboard.writeText(text) : Promise.reject()).then(
      function () { toast(ok); },
      function () { window.prompt('Copie:', text); }
    );
  }

  /* ---------------- modo treino: controle, teclado ou direcional na tela ---------------- */
  var dlg = $('#treino'), seqEl = $('[data-seq]'), msg = $('[data-tmsg]'), padMsg = $('[data-tpad]');
  var drill = null, pos = 0, t0 = 0, raf = 0, prev = {};
  var PAD = { 12: 'U', 13: 'D', 14: 'L', 15: 'R' };
  function train(it) {
    drill = it;
    $('[data-tname]').textContent = it.t;
    seqEl.innerHTML = '';
    it.code.split('').forEach(function (c) { seqEl.appendChild(el('li', '', ARROW[c])); });
    reset();
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    prev = {};
    poll();
  }
  function reset() {
    pos = 0; t0 = 0;
    paint();
    msg.textContent = 'Digite a sequência. O cronômetro começa no primeiro toque.';
  }
  function paint(bad) {
    $$('li', seqEl).forEach(function (li, i) {
      li.className = i < pos ? 'is-ok' : i === pos ? 'is-next' : '';
    });
    if (bad) {
      seqEl.classList.remove('is-bad');
      void seqEl.offsetWidth; // reinicia a animação
      seqEl.classList.add('is-bad');
    }
  }
  function press(dir) {
    if (!drill || !dlg.open) return;
    var btn = $('[data-dir="' + dir + '"]', dlg);
    btn.classList.add('is-hit');
    setTimeout(function () { btn.classList.remove('is-hit'); }, 120);
    if (pos >= drill.code.length) reset();
    if (!t0) t0 = performance.now();
    if (drill.code[pos] === dir) {
      pos++;
      paint();
      if (pos === drill.code.length) {
        var s = ((performance.now() - t0) / 1000).toFixed(1).replace('.', ',');
        msg.textContent = 'Certinho, em ' + s + ' s! No jogo: ↑ abre o celular, segure L1 + R1 (LB + RB) e digite. Toque em qualquer direção para repetir.';
      } else {
        msg.textContent = (drill.code.length - pos) + ' para terminar.';
      }
    } else {
      // errou: volta ao começo, aproveitando o toque se ele já for o primeiro da sequência
      pos = drill.code[0] === dir ? 1 : 0;
      t0 = pos ? performance.now() : 0;
      paint(true);
      msg.textContent = 'Errou. Do começo!';
    }
  }
  $$('[data-dir]', dlg).forEach(function (b) { b.addEventListener('click', function () { press(b.dataset.dir); }); });
  $('[data-treset]').addEventListener('click', reset);
  dlg.addEventListener('keydown', function (e) {
    var k = { ArrowUp: 'U', ArrowDown: 'D', ArrowLeft: 'L', ArrowRight: 'R' }[e.key];
    if (k) { e.preventDefault(); press(k); }
  });
  dlg.addEventListener('close', function () { cancelAnimationFrame(raf); drill = null; });
  // clique no fundo escuro fecha
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  function poll() {
    cancelAnimationFrame(raf);
    var pads = navigator.getGamepads ? navigator.getGamepads() : [];
    var pad = Array.prototype.find.call(pads, function (p) { return p && p.connected; });
    padMsg.textContent = pad ? 'Controle conectado: ' + pad.id.replace(/\s*\(.*$/, '') + '. Use o direcional.' : 'Sem controle conectado: use as setas do teclado ou o direcional acima. Um controle USB ou Bluetooth funciona depois de apertar qualquer botão.';
    if (pad) {
      Object.keys(PAD).forEach(function (i) {
        var b = pad.buttons[i], on = !!(b && b.pressed);
        if (on && !prev[i]) press(PAD[i]);
        prev[i] = on;
      });
    }
    if (dlg.open) raf = requestAnimationFrame(poll);
  }

  /* ---------------- início: aba e ficha do link ---------------- */
  function route() {
    var h = location.hash.slice(1);
    var g = h.match(/^g=([\w-]+)/);
    var it = g && [].concat(G.eggs, G.cars, G.cheats).find(function (x) { return x.id === g[1]; });
    if (it) {
      tab(it.tab, true);
      var det = $('details', it.node);
      if (det) det.open = true;
      it.node.scrollIntoView({ block: 'start' });
      it.node.classList.add('is-target');
      setTimeout(function () { it.node.classList.remove('is-target'); }, 2000);
    } else {
      tab(TABS[h] ? h : 'ovos', true);
    }
  }
  window.addEventListener('hashchange', route);
  syncChecks();
  route();
})();
