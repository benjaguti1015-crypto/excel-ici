/* Interfaz: inicio, lecciones, quiz y práctica en la hoja. Sin dependencias. */
(function () {
  'use strict';
  var XL = window.XL, COURSE = window.COURSE;
  var view = document.getElementById('view'), fxText = document.getElementById('fx-text'),
    nameBox = document.getElementById('name-box'), xpChip = document.getElementById('xp'), tabs = document.getElementById('tabs');

  /* ---------- utilidades ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(sel, el) { return (el || view).querySelector(sel); }
  function $$(sel, el) { return Array.prototype.slice.call((el || view).querySelectorAll(sel)); }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- progreso (localStorage, por nombre) ---------- */
  var KEY = 'excel-ici:', S = null;
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(KEY + k); if (v === null) localStorage.removeItem(KEY + k); else localStorage.setItem(KEY + k, v); } catch (e) { } return null; }
  function load(name) {
    S = null;
    try { S = JSON.parse(store('u:' + name.toLowerCase())); } catch (e) { }
    if (!S || typeof S !== 'object') S = { xp: 0, lesson: {}, quiz: {}, ex: {} };
    S.name = name; store('current', name); save();
  }
  function save() { store('u:' + S.name.toLowerCase(), JSON.stringify(S)); }

  var LEVELS = [[0, 'Aprendiz'], [120, 'Explorador de celdas'], [300, 'Analista'], [520, 'Experto en fórmulas'], [760, 'Maestro de la hoja']];
  function level() {
    var i = 0; while (i + 1 < LEVELS.length && S.xp >= LEVELS[i + 1][0]) i++;
    var next = LEVELS[i + 1];
    return { n: i + 1, name: LEVELS[i][1], next: next, pct: next ? (S.xp - LEVELS[i][0]) / (next[0] - LEVELS[i][0]) : 1 };
  }
  function gain(n) {
    if (!n) return;
    S.xp += n; save(); xpChip.textContent = S.xp + ' XP';
    var f = document.createElement('span'); f.className = 'xp-float'; f.textContent = '+' + n;
    xpChip.appendChild(f);
    if (f.animate) f.animate([{ opacity: 0, transform: 'translateY(4px)' }, { opacity: 1, transform: 'translateY(-14px)', offset: .3 }, { opacity: 0, transform: 'translateY(-26px)' }],
      { duration: reduced ? 1 : 1100, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' }).onfinish = function () { f.remove(); };
    else setTimeout(function () { f.remove(); }, 900);
  }
  function progress(m) {
    return {
      lesson: Math.min(S.lesson[m.id] || 0, m.lesson.length), quiz: S.quiz[m.id] || 0,
      ex: m.practice.filter(function (e) { return S.ex[e.id]; }).length
    };
  }

  /* ---------- tablas y gráficos estáticos ---------- */
  function miniTable(data, hi, color) {
    var cols = 1, rows = 1, sh = new XL.Sheet(data), h = '<div class="mini-wrap"><table class="grid mini"><thead><tr><th></th>';
    Object.keys(data).concat(hi || []).forEach(function (k) { var p = XL.parseRef(k); cols = Math.max(cols, p.c); rows = Math.max(rows, p.r); });
    for (var c = 1; c <= cols; c++) h += '<th>' + XL.ref(c, 1).replace(/\d+/, '') + '</th>';
    h += '</tr></thead><tbody>';
    for (var r = 1; r <= rows; r++) {
      h += '<tr><th>' + r + '</th>';
      for (c = 1; c <= cols; c++) {
        var k = XL.ref(c, r), v = sh.value(k), on = hi && hi.indexOf(k) >= 0;
        h += '<td data-ref="' + k + '" class="' + (typeof v.v === 'number' ? 'num' : '') + (on ? ' hi' : '') + '"' + (on && color ? ' data-cf="' + color + '"' : '') + '><span class="v">' + esc(v.e || XL.format(v.v)) + '</span></td>';
      }
      h += '</tr>';
    }
    return h + '</tbody></table></div>';
  }

  function niceMax(m) { var p = Math.pow(10, Math.floor(Math.log(m) / Math.LN10)), f = m / p; return (f <= 1 ? 1 : f <= 2 ? 2 : f <= 5 ? 5 : 10) * p; }
  function chartSVG(type, labels, values, title) {
    var W = 360, H = 220, n = values.length, s = '<svg class="chart" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + esc(title || 'Gráfico') + '">';
    values = values.map(function (v) { return v > 0 ? v : 0; });
    if (title) s += '<text class="c-title" x="' + W / 2 + '" y="18" text-anchor="middle">' + esc(title) + '</text>';
    if (!n) return s + '</svg>';
    if (type === 'pie') {
      var tot = values.reduce(function (a, b) { return a + b; }, 0) || 1, cx = 104, cy = 124, R = 80, ang = -Math.PI / 2;
      values.forEach(function (v, i) {
        var f = v / tot, a2 = ang + f * 2 * Math.PI, cls = 'c-fill c' + (i % 6);
        if (f > 0.999) s += '<circle class="' + cls + '" cx="' + cx + '" cy="' + cy + '" r="' + R + '"/>';
        else if (f > 0) s += '<path class="' + cls + '" d="M' + cx + ' ' + cy + ' L' + (cx + R * Math.cos(ang)).toFixed(1) + ' ' + (cy + R * Math.sin(ang)).toFixed(1) +
          ' A' + R + ' ' + R + ' 0 ' + (f > .5 ? 1 : 0) + ' 1 ' + (cx + R * Math.cos(a2)).toFixed(1) + ' ' + (cy + R * Math.sin(a2)).toFixed(1) + ' Z"/>';
        ang = a2;
        var y = 52 + i * 22;
        if (i < 7) s += '<rect class="' + cls + '" x="208" y="' + (y - 9) + '" width="10" height="10" rx="2"/><text class="c-lab" x="224" y="' + y + '">' + esc(String(labels[i]).slice(0, 10)) + ' · ' + Math.round(f * 100) + '%</text>';
      });
      return s + '</svg>';
    }
    var x0 = 38, y0 = H - 30, w = W - x0 - 10, hh = y0 - 36, max = niceMax(Math.max.apply(null, values) || 1), pts = [];
    for (var g = 0; g <= 4; g++) {
      var gy = y0 - hh * g / 4;
      s += '<line class="c-grid" x1="' + x0 + '" x2="' + (x0 + w) + '" y1="' + gy + '" y2="' + gy + '"/><text class="c-tick" x="' + (x0 - 6) + '" y="' + (gy + 3) + '" text-anchor="end">' + XL.format(max * g / 4) + '</text>';
    }
    values.forEach(function (v, i) {
      var cx2 = x0 + w / n * (i + .5), y = y0 - v / max * hh, bw = Math.min(46, w / n * .62);
      if (type === 'col') s += '<rect class="c-fill c0" x="' + (cx2 - bw / 2).toFixed(1) + '" y="' + y.toFixed(1) + '" width="' + bw.toFixed(1) + '" height="' + (y0 - y).toFixed(1) + '" rx="3"/>';
      pts.push(cx2.toFixed(1) + ',' + y.toFixed(1));
      s += '<text class="c-val" x="' + cx2.toFixed(1) + '" y="' + (y - 6).toFixed(1) + '" text-anchor="middle">' + XL.format(v) + '</text>' +
        '<text class="c-lab" x="' + cx2.toFixed(1) + '" y="' + (y0 + 15) + '" text-anchor="middle">' + esc(String(labels[i]).slice(0, n > 5 ? 5 : 8)) + '</text>';
    });
    if (type === 'line') {
      s += '<polyline class="c-line" points="' + pts.join(' ') + '"/>';
      pts.forEach(function (p) { var q = p.split(','); s += '<circle class="c-dot" cx="' + q[0] + '" cy="' + q[1] + '" r="3.5"/>'; });
    }
    return s + '<line class="c-axis" x1="' + x0 + '" x2="' + (x0 + w) + '" y1="' + y0 + '" y2="' + y0 + '"/></svg>';
  }

  /* ---------- corrección ---------- */
  var ERR_HELP = {};
  ERR_HELP[XL.E.NAME] = 'Excel no reconoce el nombre de una función: revisa cómo está escrita.';
  ERR_HELP[XL.E.DIV] = 'Estás dividiendo por cero o por una celda vacía.';
  ERR_HELP[XL.E.VALUE] = 'Estás calculando con un texto como si fuera un número.';
  ERR_HELP[XL.E.REF] = 'La fórmula apunta a sí misma o a una celda que no existe.';
  ERR_HELP[XL.E.NA] = 'No se encontró el valor buscado.';
  ERR_HELP[XL.E.SYN] = 'La fórmula está incompleta: revisa paréntesis, comillas y los punto y coma.';

  function eq(a, b) {
    if (typeof a === 'number' && typeof b === 'number') return Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));
    if (typeof a === 'string' && typeof b === 'string') return a.trim().toLowerCase() === b.trim().toLowerCase();
    return a === b;
  }
  /* Copia de la hoja con los datos numéricos cambiados al azar. */
  function trial(cells, vary) {
    var out = {}; Object.keys(cells).forEach(function (k) { out[k] = cells[k]; });
    (vary || []).forEach(function (v) {
      XL.expand(v[0]).forEach(function (r) {
        var raw = out[r];
        if (raw == null || String(raw)[0] === '=' || typeof XL.literal(raw) !== 'number') return;
        out[r] = String(+(v[1] + Math.random() * (v[2] - v[1])).toFixed(v[3] || 0));
      });
    });
    return out;
  }
  function targets(t) {
    var refs = XL.expand(t.cells || t.cell), f = XL.parseRef(refs[0]);
    return refs.map(function (r) { var p = XL.parseRef(r); return { ref: r, sol: XL.shift(t.sol, p.r - f.r, p.c - f.c) }; });
  }
  /* Compara lo que escribió el estudiante con la solución, en la hoja real y en 3 hojas con otros datos. */
  function checkFormula(t, cells, vary) {
    var base = new XL.Sheet(cells), trials = null, ts = targets(t), tip = t.tip ? ' ' + t.tip : '';
    for (var i = 0; i < ts.length; i++) {
      var g = ts[i], raw = cells[g.ref];
      if (raw == null || raw === '') return { ok: false, empty: true, msg: 'Falta completar <b>' + g.ref + '</b>.' };
      if (String(raw)[0] !== '=') return { ok: false, msg: 'En <b>' + g.ref + '</b> hay un valor escrito a mano. Usa una fórmula (empieza con <code>=</code>) para que se actualice sola.' };
      var sv = base.value(g.ref), ev = base.evalFormula(g.sol);
      if (sv.e) return { ok: false, msg: '<b>' + g.ref + '</b> muestra ' + sv.e + '. ' + ERR_HELP[sv.e] + tip };
      if (!eq(sv.v, ev.v)) return { ok: false, msg: '<b>' + g.ref + '</b> da ' + esc(XL.format(sv.v)) + ', pero debería dar ' + esc(XL.format(ev.v)) + '.' + tip };
      trials = trials || [0, 1, 2].map(function () { return new XL.Sheet(trial(cells, vary)); });
      for (var k = 0; k < trials.length; k++) {
        var s2 = trials[k].value(g.ref), e2 = trials[k].evalFormula(g.sol);
        if (e2.e) continue;
        if (s2.e || !eq(s2.v, e2.v)) return { ok: false, msg: '<b>' + g.ref + '</b> acierta con estos datos, pero falla si los datos cambian. Apunta a las celdas en vez de escribir los números.' + tip };
      }
    }
    return { ok: true };
  }
  function checkTask(t, st, vary) {
    if (t.sol) return checkFormula(t, st.cells, vary);
    if (t.format) {
      var sh = new XL.Sheet(st.cells), ok = st.cf.length > 0;
      XL.expand(t.format.range).forEach(function (r) {
        var v = sh.value(r).v;
        t.format.probe.concat(typeof v === 'number' ? [v] : []).forEach(function (x) { if (st.hit(r, x) !== t.format.test(x)) ok = false; });
      });
      return ok ? { ok: true } : { ok: false, empty: !st.cf.length, msg: st.cf.length ? 'La regla todavía no pinta exactamente las celdas pedidas. Revisa el rango (<b>' + t.format.range + '</b>) y la condición.' : 'Aún no hay ninguna regla de formato condicional.' };
    }
    if (!st.chart) return { ok: false, empty: true, msg: 'Aún no has insertado un gráfico.' };
    if (t.chart.ranges.indexOf(st.chart.range) < 0) return { ok: false, msg: 'El gráfico usa <b>' + st.chart.range + '</b>. Selecciona <b>' + t.chart.ranges[0] + '</b> antes de insertarlo.' };
    if (t.chart.types.indexOf(st.chart.type) < 0) return { ok: false, msg: 'Los datos están bien, pero para este caso conviene un gráfico de <b>' + t.chart.want + '</b>.' };
    return { ok: true };
  }

  /* ---------- la hoja interactiva ---------- */
  var OPS = [['<', 'menor que'], ['>', 'mayor que'], ['=', 'igual a'], ['<=', 'menor o igual que'], ['>=', 'mayor o igual que']];
  function opTest(op, v, x) { return op === '<' ? v < x : op === '>' ? v > x : op === '=' ? v === x : op === '<=' ? v <= x : v >= x; }

  function Grid(root, ex, onChange) {
    var cols = ex.cols, rows = ex.rows, cells = {}, locked = {}, tgt = {}, tds = {}, cf = [], chart = null, clip = null;
    var a = { c: 1, r: 1 }, b = a, editing = false, orig = '', pick = null, drag = null, popKind = null;
    var tools = ex.tools || [];
    Object.keys(ex.data).forEach(function (k) { cells[k] = ex.data[k]; locked[k] = 1; });
    ex.tasks.forEach(function (t) { if (t.sol) XL.expand(t.cells || t.cell).forEach(function (r) { tgt[r] = 1; }); });

    var h = '<div class="sheet"><div class="tools">' +
      (tools.indexOf('cf') >= 0 ? '<button type="button" class="tool" data-act="cf"><i class="ico ico-cf"></i>Formato condicional</button>' : '') +
      (tools.indexOf('chart') >= 0 ? '<button type="button" class="tool" data-act="chart"><i class="ico ico-ch"></i>Insertar gráfico</button>' : '') +
      '<button type="button" class="tool quiet" data-act="reset">Reiniciar</button></div><div class="pop" hidden></div>' +
      '<div class="fbar"><span class="namebox"></span><button type="button" class="fb-btn" data-act="cancel" aria-label="Cancelar">✕</button><button type="button" class="fb-btn ok" data-act="ok" aria-label="Aceptar">✓</button><span class="fx">fx</span>' +
      '<input class="finput" aria-label="Barra de fórmulas" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"></div>' +
      '<div class="quick">' + ['=', '(', ')', ';', ':', '$', '"', '+', '-', '*', '/', '>', '<'].map(function (k) { return '<button type="button" data-k="' + esc(k) + '">' + esc(k) + '</button>'; }).join('') + '</div>' +
      '<div class="gridwrap" tabindex="0" aria-label="Hoja de cálculo"><table class="grid"><thead><tr><th></th>';
    for (var c = 1; c <= cols; c++) h += '<th>' + XL.ref(c, 1).replace(/\d+/, '') + '</th>';
    h += '</tr></thead><tbody>';
    for (var r = 1; r <= rows; r++) {
      h += '<tr><th>' + r + '</th>';
      for (c = 1; c <= cols; c++) h += '<td data-c="' + c + '" data-r="' + r + '"><span class="v"></span></td>';
      h += '</tr>';
    }
    root.innerHTML = h + '</tbody></table></div><div class="chartbox" hidden></div></div>';

    var input = $('.finput', root), wrap = $('.gridwrap', root), nb = $('.namebox', root), pop = $('.pop', root), box = $('.chartbox', root), fbar = $('.fbar', root);
    var handle = document.createElement('i'); handle.className = 'fill';
    $$('td', root).forEach(function (td) { tds[XL.ref(+td.dataset.c, +td.dataset.r)] = td; });
    function key(p) { return XL.ref(p.c, p.r); }
    function selRange() { var s = XL.ref(Math.min(a.c, b.c), Math.min(a.r, b.r)), e = XL.ref(Math.max(a.c, b.c), Math.max(a.r, b.r)); return s === e ? s : s + ':' + e; }
    function hit(refK, v) { var on = false; cf.forEach(function (rule) { if (rule.set[refK]) on = typeof v === 'number' && opTest(rule.op, v, rule.val) ? rule.color : on; }); return on; }

    function recalc() {
      var sh = new XL.Sheet(cells);
      Object.keys(tds).forEach(function (k) {
        var td = tds[k], v = sh.value(k), cl = td.classList;
        td.firstChild.textContent = v.e || XL.format(v.v);
        cl.toggle('num', typeof v.v === 'number'); cl.toggle('ctr', typeof v.v === 'boolean'); cl.toggle('err', !!v.e);
        cl.toggle('target', !!tgt[k] && !cells[k]); cl.remove('edit');
        td.dataset.cf = hit(k, v.v) || '';
      });
      drawChart(sh);
    }
    function paint() {
      var inR = {}; XL.expand(selRange()).forEach(function (k) { inR[k] = 1; });
      var multi = a.c !== b.c || a.r !== b.r;
      Object.keys(tds).forEach(function (k) { tds[k].classList.toggle('in', multi && !!inR[k]); tds[k].classList.toggle('act', k === key(a)); });
      nb.textContent = key(a);
      if (multi) handle.remove(); else tds[key(a)].appendChild(handle);
    }
    function select(c, r, ext) {
      var p = { c: Math.max(1, Math.min(cols, c)), r: Math.max(1, Math.min(rows, r)) };
      if (ext) b = p; else a = b = p;
      if (!editing) { input.value = cells[key(a)] || ''; input.readOnly = !!locked[key(a)]; }
      paint();
    }
    function mirror() { var td = tds[key(a)]; td.firstChild.textContent = input.value; td.classList.add('edit'); td.classList.remove('target'); }
    function clearPick() { pick = null; $$('td.picked', root).forEach(function (td) { td.classList.remove('picked'); }); }
    function startEdit(text) {
      if (locked[key(a)]) { onChange('locked'); return; }
      b = a; paint();
      editing = true; orig = cells[key(a)] || ''; fbar.classList.add('on');
      if (text != null) { input.value = text; mirror(); }
      input.focus(); input.setSelectionRange(input.value.length, input.value.length);
    }
    function endEdit() { editing = false; clearPick(); fbar.classList.remove('on'); }
    function commit(dc, dr) {
      if (!editing) return;
      var k = key(a), v = input.value.trim();
      endEdit();
      if (v) cells[k] = v; else delete cells[k];
      recalc(); select(a.c + (dc || 0), a.r + (dr || 0)); onChange(k);
    }
    function cancel() { if (!editing) return; endEdit(); recalc(); select(a.c, a.r); }

    /* clic en una celda mientras se escribe una fórmula: inserta la referencia */
    function canPick() {
      if (input.value[0] !== '=') return false;
      if (pick) return true;
      var before = input.value.slice(0, input.selectionStart).replace(/\s+$/, '');
      return '=+-*/^&(;,:<>'.indexOf(before.slice(-1)) >= 0;
    }
    function insertPick(p, q) {
      var s = XL.ref(Math.min(p.c, q.c), Math.min(p.r, q.r)), e = XL.ref(Math.max(p.c, q.c), Math.max(p.r, q.r)), text = s === e ? s : s + ':' + e;
      var from = pick ? pick.s : input.selectionStart, to = pick ? pick.e : input.selectionEnd;
      input.value = input.value.slice(0, from) + text + input.value.slice(to);
      $$('td.picked', root).forEach(function (td) { td.classList.remove('picked'); });
      XL.expand(text).forEach(function (k) { tds[k].classList.add('picked'); });
      pick = { s: from, e: from + text.length };
      input.focus(); input.setSelectionRange(pick.e, pick.e); mirror();
    }
    function fillTo(p) {
      var raw = cells[key(a)], dr = p.r - a.r, dc = p.c - a.c;
      XL.expand(key(a) + ':' + XL.ref(p.c, p.r)).forEach(function (k) {
        if (k === key(a) || locked[k]) return;
        var q = XL.parseRef(k);
        if (raw) cells[k] = XL.shift(raw, q.r - a.r, q.c - a.c); else delete cells[k];
      });
      recalc(); b = p; paint();
      if (dr || dc) onChange(XL.ref(p.c, p.r));
    }
    function cellAt(e) {
      var el = document.elementFromPoint(e.clientX, e.clientY), td = el && el.closest ? el.closest('td[data-c]') : null;
      return td && wrap.contains(td) ? { c: +td.dataset.c, r: +td.dataset.r } : null;
    }

    wrap.addEventListener('pointerdown', function (e) {
      if (e.button) return;
      if (e.target === handle) { if (editing) commit(); drag = { mode: 'fill', to: a }; e.preventDefault(); return; }
      var p = cellAt(e); if (!p) return;
      if (editing && canPick()) { insertPick(p, p); drag = { mode: 'pick', from: p }; return; }
      var same = !editing && p.c === a.c && p.r === a.r && a === b && !e.shiftKey && document.activeElement === wrap;
      if (editing) commit();
      if (same && !locked[key(a)]) { startEdit(); return; }
      select(p.c, p.r, e.shiftKey); drag = { mode: 'sel' };
    });
    wrap.addEventListener('mousedown', function (e) { if (editing || e.target === handle) e.preventDefault(); });
    function onMove(e) {
      if (!drag) return;
      var p = cellAt(e); if (!p) return;
      if (drag.mode === 'sel') select(p.c, p.r, true);
      else if (drag.mode === 'pick') insertPick(drag.from, p);
      else {
        var dr = p.r - a.r, dc = p.c - a.c;
        drag.to = Math.abs(dr) >= Math.abs(dc) ? { c: a.c, r: p.r } : { c: p.c, r: a.r };
        var inF = {}; XL.expand(key(a) + ':' + XL.ref(drag.to.c, drag.to.r)).forEach(function (k) { inF[k] = 1; });
        Object.keys(tds).forEach(function (k) { tds[k].classList.toggle('filling', !!inF[k] && k !== key(a)); });
      }
    }
    function onUp() {
      if (!drag) return;
      var d = drag; drag = null;
      if (d.mode === 'fill') { $$('td.filling', root).forEach(function (td) { td.classList.remove('filling'); }); fillTo(d.to); }
    }
    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);

    wrap.addEventListener('keydown', function (e) {
      if (editing) return;
      var k = e.key, mod = e.ctrlKey || e.metaKey, mv = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0] }[k];
      if (mv) { e.preventDefault(); var from = e.shiftKey ? b : a; select(from.c + mv[0], from.r + mv[1], e.shiftKey); }
      else if (k === 'Enter' || k === 'F2') { e.preventDefault(); startEdit(); }
      else if (k === 'Delete' || k === 'Backspace') {
        e.preventDefault();
        XL.expand(selRange()).forEach(function (x) { if (!locked[x]) delete cells[x]; });
        recalc(); select(a.c, a.r); onChange(key(a));
      }
      else if (mod && k.toLowerCase() === 'c') clip = { raw: cells[key(a)], c: a.c, r: a.r };
      else if (mod && k.toLowerCase() === 'v' && clip) {
        e.preventDefault();
        XL.expand(selRange()).forEach(function (x) {
          if (locked[x]) return;
          var q = XL.parseRef(x);
          if (clip.raw) cells[x] = XL.shift(clip.raw, q.r - clip.r, q.c - clip.c); else delete cells[x];
        });
        recalc(); onChange(XL.ref(Math.max(a.c, b.c), Math.max(a.r, b.r)));
      }
      else if (k.length === 1 && !mod && !e.altKey) { e.preventDefault(); startEdit(k); }
    });
    input.addEventListener('focus', function () { if (!editing) { if (locked[key(a)]) onChange('locked'); else { editing = true; orig = cells[key(a)] || ''; fbar.classList.add('on'); b = a; paint(); } } });
    input.addEventListener('input', function () { if (!editing) return; clearPick(); mirror(); });
    input.addEventListener('keydown', function (e) {
      if (!editing) return;
      if (e.key === 'Enter') { e.preventDefault(); commit(0, 1); wrap.focus({ preventScroll: true }); }
      else if (e.key === 'Tab') { e.preventDefault(); commit(1, 0); wrap.focus({ preventScroll: true }); }
      else if (e.key === 'Escape') { e.preventDefault(); cancel(); wrap.focus({ preventScroll: true }); }
    });

    /* barra, teclas rápidas y herramientas */
    root.addEventListener('click', function (e) {
      var q = e.target.closest('[data-k]'), btn = e.target.closest('[data-act]');
      if (q) {
        if (!editing) startEdit(cells[key(a)] ? null : '');
        if (!editing) return;
        var s = input.selectionStart, ch = q.dataset.k;
        input.value = input.value.slice(0, s) + ch + input.value.slice(input.selectionEnd);
        input.focus(); input.setSelectionRange(s + 1, s + 1); clearPick(); mirror();
        return;
      }
      if (!btn) return;
      var act = btn.dataset.act;
      if (act === 'ok') { commit(); wrap.focus({ preventScroll: true }); }
      else if (act === 'cancel') { cancel(); wrap.focus({ preventScroll: true }); }
      else if (act === 'reset') onChange('reset');
      else if (act === 'cf' || act === 'chart') { if (editing) commit(); openPop(popKind === act ? null : act); }
      else if (act === 'pop-close') openPop(null);
      else if (act === 'cf-clear') { cf = []; recalc(); openPop(null); onChange('cf'); }
      else if (act === 'mk-chart') { chart = { type: btn.dataset.type, range: selRange() }; recalc(); openPop(null); onChange('chart'); }
      else if (act === 'rm-chart') { chart = null; recalc(); onChange('chart'); }
    });
    root.addEventListener('submit', function (e) {
      e.preventDefault();
      var f = e.target, val = XL.literal(f.val.value);
      if (typeof val !== 'number') { f.val.focus(); f.val.classList.add('bad'); return; }
      var set = {}; XL.expand(selRange()).forEach(function (k) { set[k] = 1; });
      cf.push({ set: set, op: f.op.value, val: val, color: f.color.value });
      recalc(); openPop(null); onChange('cf');
    });

    function openPop(kind) {
      popKind = kind;
      $$('.tool', root).forEach(function (t) { t.classList.toggle('on', t.dataset.act === kind); });
      if (!kind) { pop.hidden = true; pop.innerHTML = ''; return; }
      var rg = selRange();
      pop.dataset.kind = kind;
      pop.innerHTML = kind === 'cf'
        ? '<form class="popform"><p class="pop-t">Formato condicional <span>se aplica a <b>' + rg + '</b></span></p>' +
        '<div class="pop-row"><label>Resaltar si el valor es <select name="op">' + OPS.map(function (o) { return '<option value="' + esc(o[0]) + '">' + o[1] + '</option>'; }).join('') + '</select></label>' +
        '<input name="val" inputmode="decimal" placeholder="valor" aria-label="Valor" autocomplete="off"></div>' +
        '<div class="pop-row swatches"><label><input type="radio" name="color" value="r" checked><i data-cf="r"></i>Rojo</label><label><input type="radio" name="color" value="y"><i data-cf="y"></i>Amarillo</label><label><input type="radio" name="color" value="g"><i data-cf="g"></i>Verde</label></div>' +
        '<div class="pop-actions"><button type="button" class="btn ghost sm" data-act="cf-clear">Quitar reglas</button><button class="btn sm">Aplicar</button></div></form>'
        : '<div class="popform"><p class="pop-t">Insertar gráfico <span>con los datos de <b>' + rg + '</b></span></p><div class="pop-row types">' +
        [['col', 'Columnas'], ['line', 'Líneas'], ['pie', 'Circular']].map(function (t) { return '<button type="button" class="type" data-act="mk-chart" data-type="' + t[0] + '"><i class="ico ico-' + t[0] + '"></i>' + t[1] + '</button>'; }).join('') +
        '</div><p class="pop-note">' + (rg.indexOf(':') < 0 ? 'Primero selecciona un rango arrastrando sobre las celdas.' : 'Elige el tipo que mejor responde la pregunta.') + '</p></div>';
      pop.hidden = false;
    }
    function drawChart(sh) {
      if (!chart) { box.hidden = true; box.innerHTML = ''; return; }
      var R = XL.expand(chart.range), p1 = XL.parseRef(R[0]), p2 = XL.parseRef(R[R.length - 1]), labels = [], values = [], title = '', start = p1.r;
      var first = sh.value(XL.ref(p2.c, p1.r)).v;
      if (typeof first !== 'number' && p2.r > p1.r) { title = XL.format(first); start++; }
      for (var y = start; y <= p2.r; y++) {
        var v = sh.value(XL.ref(p2.c, y)).v;
        labels.push(p2.c > p1.c ? XL.format(sh.value(XL.ref(p1.c, y)).v) : String(y - start + 1));
        values.push(typeof v === 'number' ? v : 0);
      }
      var fresh = box.hidden;
      box.innerHTML = '<button type="button" class="fb-btn rm" data-act="rm-chart" aria-label="Quitar gráfico">✕</button>' + chartSVG(chart.type, labels, values, title);
      box.hidden = false;
      if (fresh && box.animate && !reduced) box.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
    }

    recalc();
    var firstT = Object.keys(tgt)[0], fp = firstT ? XL.parseRef(firstT) : { c: 1, r: 1 };
    select(fp.c, fp.r);
    return {
      state: function () { return { cells: cells, cf: cf, chart: chart, hit: function (k, v) { return !!hit(k, v); } }; },
      destroy: function () { document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerup', onUp); document.removeEventListener('pointercancel', onUp); }
    };
  }

  /* ---------- vistas ---------- */
  var cleanup = null;
  function show(html, cls) {
    if (cleanup) { cleanup(); cleanup = null; }
    view.className = 'view ' + (cls || '');
    view.innerHTML = html;
    if (view.animate && !reduced) view.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
  }
  function chrome(box, formula, tab) {
    nameBox.textContent = box; fxText.textContent = formula;
    document.body.classList.toggle('anon', !S);
    if (!S) return;
    xpChip.firstChild.textContent = S.xp + ' XP';
    var m = COURSE.filter(function (x) { return x.id === S.last; })[0] || COURSE[0];
    tabs.innerHTML = [['inicio', 'Inicio', '#/'], ['aprende', 'Aprende', '#/m/' + m.id + '/aprende'], ['quiz', 'Quiz', '#/m/' + m.id + '/quiz'], ['practica', 'Practica', '#/m/' + m.id + '/practica']]
      .map(function (t) { return '<a href="' + t[2] + '"' + (t[0] === tab ? ' class="on" aria-current="page"' : '') + '>' + t[1] + '</a>'; }).join('');
  }
  function crumbs(m, stage) { return '<p class="crumbs"><a href="#/">Inicio</a><span>/</span>' + esc(m.name) + '<span>/</span>' + stage + '</p>'; }
  function fb(el, kind, html) { el.dataset.kind = kind; el.innerHTML = html; el.hidden = !html; }

  function viewLogin() {
    chrome('A1', '=HOLA("…")');
    show('<form class="login card"><p class="eyebrow">Excel ICI · Ayudantía</p><h1>Aprende Excel<br>jugando.</h1>' +
      '<p class="lead">Materia corta, quizzes y una hoja de cálculo que te corrige al instante. Solo necesitas tu nombre.</p>' +
      '<label class="namecell"><span>=HOLA("</span><input name="n" maxlength="24" placeholder="tu nombre" autocomplete="given-name" required><span>")</span></label>' +
      '<button class="btn big">Entrar</button><p class="fine">Tu avance se guarda solo en este dispositivo.</p></form>', 'center');
    var f = $('form');
    f.n.focus();
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var n = f.n.value.trim().replace(/\s+/g, ' ');
      if (!n) return;
      load(n); location.hash = '#/'; route();
    });
  }

  function viewHome() {
    var lv = level();
    chrome('A1', '=HOLA("' + S.name + '")', 'inicio');
    function cell(m, i, stage, done, total, label) {
      var full = done >= total;
      return '<td class="pcell' + (full ? ' full' : done ? ' part' : '') + '"><a href="#/m/' + m.id + '/' + stage + '" aria-label="' + label + ' de ' + esc(m.name) + ': ' + done + ' de ' + total + '">' +
        '<b>' + (full ? '✓' : done + '/' + total) + '</b><i><u style="transform:scaleX(' + (total ? done / total : 0) + ')"></u></i></a></td>';
    }
    show('<section class="hero"><p class="eyebrow">Nivel ' + lv.n + ' · ' + lv.name + '</p><h1>Hola, ' + esc(S.name) + '.</h1>' +
      '<p class="lead">Cinco filas te separan de dominar Excel. En cada una: aprende, ponte a prueba y practica en la hoja.</p>' +
      '<div class="xpbar" role="progressbar" aria-valuenow="' + Math.round(lv.pct * 100) + '" aria-valuemin="0" aria-valuemax="100"><i style="transform:scaleX(' + lv.pct + ')"></i></div>' +
      '<p class="fine">' + S.xp + ' XP' + (lv.next ? ' · te faltan ' + (lv.next[0] - S.xp) + ' para ser ' + lv.next[1] : ' · llegaste al nivel máximo') + '</p></section>' +
      '<div class="map-wrap"><table class="grid map"><thead><tr><th></th><th>A</th><th>B</th><th>C</th><th>D</th></tr>' +
      '<tr class="heads"><th>&nbsp;</th><td>Tema</td><td>Aprende</td><td>Quiz</td><td>Practica</td></tr></thead><tbody class="stagger">' +
      COURSE.map(function (m, i) {
        var p = progress(m);
        return '<tr><th>' + (i + 1) + '</th><td class="topic"><a href="#/m/' + m.id + '/aprende"><b>' + esc(m.name) + '</b><span>' + esc(m.desc) + '</span></a></td>' +
          cell(m, i, 'aprende', p.lesson, m.lesson.length, 'Aprende') + cell(m, i, 'quiz', p.quiz, m.quiz.length, 'Quiz') + cell(m, i, 'practica', p.ex, m.practice.length, 'Practica') + '</tr>';
      }).join('') + '</tbody></table></div>');
  }

  function viewMe() {
    var lv = level(), lines = COURSE.map(function (m) { var p = progress(m); return m.name + ': materia ' + p.lesson + '/' + m.lesson.length + ', quiz ' + p.quiz + '/' + m.quiz.length + ', práctica ' + p.ex + '/' + m.practice.length; });
    var summary = 'Excel ICI — ' + S.name + '\nNivel ' + lv.n + ' (' + lv.name + ') · ' + S.xp + ' XP\n' + lines.join('\n');
    chrome('A1', '=PROGRESO("' + S.name + '")');
    show('<article class="card"><p class="eyebrow">Tu progreso</p><h1>' + esc(S.name) + '</h1><p class="lead">Nivel ' + lv.n + ' · ' + lv.name + ' · ' + S.xp + ' XP</p>' +
      '<pre class="summary">' + esc(lines.join('\n')) + '</pre>' +
      '<div class="actions wrap"><button class="btn" data-a="copy">Copiar resumen</button><button class="btn ghost" data-a="switch">Cambiar de nombre</button><button class="btn ghost danger" data-a="wipe">Borrar mi avance</button></div><p class="fb" hidden></p></article>');
    view.onclick = function (e) {
      var k = e.target.dataset && e.target.dataset.a;
      if (k === 'copy') {
        var done = function () { fb($('.fb'), 'ok', 'Resumen copiado. Pégalo donde tu ayudante te lo pida.'); };
        if (navigator.clipboard) navigator.clipboard.writeText(summary).then(done, function () { fb($('.fb'), 'info', 'No se pudo copiar: selecciona el texto de arriba.'); });
        else fb($('.fb'), 'info', 'Selecciona y copia el texto de arriba.');
      } else if (k === 'switch') { S = null; store('current', null); location.hash = '#/'; route(); }
      else if (k === 'wipe' && confirm('¿Borrar todo tu avance? No se puede deshacer.')) { var n = S.name; store('u:' + n.toLowerCase(), null); load(n); route(); }
    };
  }

  function viewLesson(m, idx) {
    var steps = m.lesson, done = Math.min(S.lesson[m.id] || 0, steps.length), i = done >= steps.length ? 0 : done;
    draw();
    function draw() {
      var st = steps[i], solved = i < done || !(st.find || st.try || st.pick), tries = 0;
      chrome('B' + idx, '=APRENDER("' + m.name + '")', 'aprende');
      var body = '';
      if (st.chart) body += '<div class="figure">' + chartSVG(st.chart.type, st.chart.labels, st.chart.values, st.chart.title) + '</div>';
      if (st.t) body += miniTable(st.t, st.hi, st.hiColor);
      if (st.find) body += '<div class="task"><p class="ask">' + st.ask + '</p>' + miniTable({}, ['D4']).replace('mini"', 'mini findable"').replace(' hi"', '"') + '</div>';
      if (st.try) body += '<form class="task"><p class="ask">' + st.try.ask + '</p><div class="fbar on"><span class="fx">fx</span><input class="finput" name="f" placeholder="=" aria-label="Tu fórmula" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false"><button class="btn sm">Probar</button></div><p class="live">&nbsp;</p></form>';
      if (st.pick) body += '<div class="task"><p class="ask">' + st.pick.q + '</p><div class="opts">' + shuffle(st.pick.o.map(function (o, k) { return k; })).map(function (k) { return '<button type="button" class="opt" data-i="' + k + '">' + esc(st.pick.o[k]) + '</button>'; }).join('') + '</div></div>';
      show('<article class="card lesson">' + crumbs(m, 'Aprende') +
        '<div class="dots" aria-label="Paso ' + (i + 1) + ' de ' + steps.length + '">' + steps.map(function (s, k) { return '<i class="' + (k === i ? 'now' : k < done ? 'past' : '') + '"></i>'; }).join('') + '</div>' +
        '<h1>' + st.h + '</h1><div class="prose"><p>' + st.p + '</p></div>' + body + '<p class="fb" hidden></p>' +
        '<div class="actions"><button class="btn ghost" data-a="back"' + (i ? '' : ' disabled') + '>Atrás</button><button class="btn" data-a="next"' + (solved ? '' : ' disabled') + '>' + (i === steps.length - 1 ? 'Terminar' : 'Siguiente') + '</button></div></article>');
      var out = $('.fb'), next = $('[data-a=next]');
      function win(msg) { solved = true; next.disabled = false; fb(out, 'ok', msg); }

      if (st.find) $('.findable').addEventListener('click', function (e) {
        var td = e.target.closest('td'); if (!td) return;
        $$('.findable td').forEach(function (x) { x.classList.remove('act', 'miss'); });
        if (td.dataset.ref === st.find) { td.classList.add('act'); win('Exacto: columna ' + st.find[0] + ', fila ' + st.find.slice(1) + '.'); }
        else { td.classList.add('miss'); fb(out, 'bad', 'Esa es <b>' + td.dataset.ref + '</b>. Busca la columna ' + st.find[0] + ' y baja hasta la fila ' + st.find.slice(1) + '.'); }
      });
      if (st.pick) $('.opts').addEventListener('click', function (e) {
        var o = e.target.closest('.opt'); if (!o || solved && i >= done) return;
        if (+o.dataset.i === st.pick.a) { $$('.opt').forEach(function (x) { x.disabled = true; }); o.classList.add('right'); win(st.pick.why); }
        else { o.classList.add('wrong'); o.disabled = true; fb(out, 'bad', 'No es esa. Vuelve a leer la explicación e inténtalo otra vez.'); }
      });
      if (st.try) {
        var f = $('form.task'), live = $('.live'), cells = st.t || {};
        f.f.addEventListener('input', function () {
          var v = f.f.value.trim(), r = v[0] === '=' && v.length > 1 ? new XL.Sheet(cells).evalFormula(v) : null;
          live.textContent = r ? 'Resultado: ' + (r.e || XL.format(r.v)) : ' ';
        });
        f.addEventListener('submit', function (e) {
          e.preventDefault();
          var v = f.f.value.trim(), flat = v.toUpperCase().replace(/\s/g, '');
          if (!v) return;
          var miss = (st.try.must || []).filter(function (x) { return flat.indexOf(x) < 0; })[0];
          var res = v[0] !== '=' ? { msg: 'Toda fórmula empieza con el signo <code>=</code>.' } : checkFormula({ cell: 'Z99', sol: st.try.sol }, withCell(cells, v), st.try.vary);
          if (res.ok && miss) res = { msg: 'El resultado es correcto, pero el ejercicio pide usar <code>' + esc(miss) + '</code>.' };
          if (res.ok) return win('Correcto. <code>' + esc(v) + '</code> hace justo lo que se pedía.');
          tries++;
          fb(out, 'bad', res.msg.replace(/<b>Z99<\/b>/g, 'Tu fórmula') + (tries >= 2 ? ' <button type="button" class="link" data-a="reveal">Ver la respuesta</button>' : ''));
        });
      }
      view.onclick = function (e) {
        var k = e.target.dataset && e.target.dataset.a;
        if (k === 'reveal') { var inp = $('form.task').f; inp.value = st.try.sol; inp.dispatchEvent(new Event('input')); inp.focus(); fb(out, 'info', 'Esta es una forma de hacerlo. Léela y presiona Probar.'); }
        else if (k === 'back' && i) { i--; draw(); }
        else if (k === 'next' && solved) {
          if (i + 1 > done) { done = i + 1; S.lesson[m.id] = done; save(); gain(5); }
          if (i < steps.length - 1) { i++; draw(); } else finish();
        }
      };
    }
    function withCell(cells, v) { var o = { Z99: v }; Object.keys(cells).forEach(function (k) { o[k] = cells[k]; }); return o; }
    function finish() {
      view.onclick = null;
      show('<article class="card end"><p class="eyebrow">Materia completa</p><h1>' + esc(m.name) + ', lista.</h1><p class="lead">Ya conoces la teoría. Ahora comprueba cuánto quedó.</p>' +
        '<div class="actions"><a class="btn ghost" href="#/">Volver al inicio</a><a class="btn" href="#/m/' + m.id + '/quiz">Ir al quiz</a></div></article>', 'center');
    }
  }

  function viewQuiz(m, idx) {
    var qs = m.quiz, i = 0, score = 0, streak = 0;
    chrome('C' + idx, '=QUIZ("' + m.name + '")', 'quiz');
    draw();
    function draw() {
      var q = qs[i], answered = false;
      show('<article class="card quiz">' + crumbs(m, 'Quiz') +
        '<div class="qhead"><span>Pregunta ' + (i + 1) + ' de ' + qs.length + '</span><span class="streak"' + (streak > 1 ? '' : ' hidden') + '>Racha de ' + streak + '</span></div>' +
        '<div class="xpbar thin"><i style="transform:scaleX(' + i / qs.length + ')"></i></div><h1 class="q">' + esc(q.q) + '</h1>' +
        '<div class="opts">' + shuffle(q.o.map(function (o, k) { return k; })).map(function (k) { return '<button type="button" class="opt" data-i="' + k + '">' + esc(q.o[k]) + '</button>'; }).join('') + '</div>' +
        '<p class="fb" hidden></p><div class="actions end-only"><button class="btn" data-a="next" disabled>' + (i === qs.length - 1 ? 'Ver resultado' : 'Siguiente') + '</button></div></article>');
      view.onclick = function (e) {
        var o = e.target.closest('.opt');
        if (o && !answered) {
          answered = true;
          var ok = +o.dataset.i === q.a;
          $$('.opt').forEach(function (x) { x.disabled = true; if (+x.dataset.i === q.a) x.classList.add('right'); });
          if (ok) { score++; streak++; } else { o.classList.add('wrong'); streak = 0; }
          fb($('.fb'), ok ? 'ok' : 'bad', (ok ? '<b>Correcto.</b> ' : '<b>No era esa.</b> ') + esc(q.why));
          var n = $('[data-a=next]'); n.disabled = false; n.focus();
        } else if (e.target.dataset.a === 'next' && answered) { if (++i < qs.length) draw(); else finish(); }
      };
    }
    function finish() {
      var best = S.quiz[m.id] || 0, pct = score / qs.length, stars = pct >= .9 ? 3 : pct >= .6 ? 2 : 1;
      if (score > best) { S.quiz[m.id] = score; save(); gain((score - best) * 10); }
      view.onclick = function (e) { if (e.target.dataset.a === 'again') { i = 0; score = 0; streak = 0; draw(); } };
      show('<article class="card end"><p class="eyebrow">Resultado del quiz</p><div class="stars" aria-label="' + stars + ' de 3 estrellas">' + [1, 2, 3].map(function (k) { return '<i class="' + (k <= stars ? 'on' : '') + '">★</i>'; }).join('') + '</div>' +
        '<h1>' + score + ' de ' + qs.length + '</h1><p class="lead">' + (pct === 1 ? 'Perfecto. Estás para la hoja de cálculo.' : pct >= .6 ? 'Bien. Repite el quiz si quieres el puntaje completo, o pasa a practicar.' : 'Te conviene repasar la materia y volver a intentarlo.') + '</p>' +
        '<div class="actions wrap"><button class="btn ghost" data-a="again">Repetir quiz</button>' + (pct < .6 ? '<a class="btn" href="#/m/' + m.id + '/aprende">Repasar materia</a>' : '<a class="btn" href="#/m/' + m.id + '/practica">Ir a practicar</a>') + '</div></article>', 'center');
    }
  }

  function viewPractice(m, idx, n) {
    n = Math.max(0, Math.min(m.practice.length - 1, n || 0));
    var ex = m.practice[n], hints = {}, used = 0, finished = false;
    chrome('D' + idx, '=PRACTICAR("' + ex.title + '")', 'practica');
    show('<article class="card practice">' + crumbs(m, 'Practica') +
      '<div class="pills">' + m.practice.map(function (e, k) { return '<a href="#/m/' + m.id + '/practica/' + k + '" class="' + (k === n ? 'on' : '') + (S.ex[e.id] ? ' done' : '') + '">' + (S.ex[e.id] ? '✓ ' : '') + (k + 1) + '</a>'; }).join('') + '</div>' +
      '<h1>' + esc(ex.title) + '</h1><p class="lead">' + esc(ex.story) + '</p>' +
      '<ol class="tasks">' + ex.tasks.map(function (t) { return '<li><i class="tick"></i><span>' + t.text + '</span></li>'; }).join('') + '</ol>' +
      '<div class="coach"><p class="fb" data-kind="info">Escribe en las celdas con borde punteado. Enter para aceptar.</p><button type="button" class="btn ghost sm" data-a="hint">Pista</button></div>' +
      '<div class="sheet-host"></div><div class="solved" hidden></div></article>');
    var out = $('.fb'), lis = $$('.tasks li');
    var grid = Grid($('.sheet-host'), ex, function (ref) {
      if (ref === 'reset') return viewPractice(m, idx, n);
      if (ref === 'locked') return fb(out, 'info', 'Esa celda trae los datos del ejercicio. Escribe en las celdas con borde punteado.');
      evaluate(ref);
    });
    cleanup = grid.destroy;

    function results() { var st = grid.state(); return ex.tasks.map(function (t) { return checkTask(t, st, ex.vary); }); }
    function touches(t, ref) { return ref === 'cf' ? !!t.format : ref === 'chart' ? !!t.chart : !!t.sol && XL.expand(t.cells || t.cell).indexOf(ref) >= 0; }
    function evaluate(ref) {
      var res = results(), allOk = true, shown = false;
      res.forEach(function (r, k) {
        lis[k].classList.toggle('ok', r.ok); if (!r.ok) allOk = false;
        if (!shown && touches(ex.tasks[k], ref)) { shown = true; if (r.ok) fb(out, 'ok', 'Bien. Paso ' + (k + 1) + ' listo.'); else fb(out, r.empty ? 'info' : 'bad', r.msg); }
      });
      if (!shown) { var k2 = firstOpen(res); if (k2 >= 0) fb(out, 'info', 'Ese cambio no era parte del ejercicio. Sigue con el paso ' + (k2 + 1) + '.'); }
      if (allOk && !finished) finish();
    }
    function firstOpen(res) { for (var k = 0; k < res.length; k++) if (!res[k].ok) return k; return -1; }
    function finish() {
      finished = true;
      var xp = Math.max(10, 30 - used * 5), first = !S.ex[ex.id];
      if (first) { S.ex[ex.id] = 1; save(); gain(xp); }
      var nextEx = n + 1 < m.practice.length, nextM = COURSE[idx];
      var d = $('.solved');
      d.innerHTML = '<div><p class="eyebrow">Ejercicio resuelto' + (first ? ' · +' + xp + ' XP' : '') + '</p><p class="lead">' + (used ? 'Lo lograste con ' + used + (used === 1 ? ' pista.' : ' pistas.') : 'Sin pistas. Impecable.') + '</p></div>' +
        (nextEx ? '<a class="btn" href="#/m/' + m.id + '/practica/' + (n + 1) + '">Siguiente ejercicio</a>' : nextM ? '<a class="btn" href="#/m/' + nextM.id + '/aprende">Siguiente tema: ' + esc(nextM.name) + '</a>' : '<a class="btn" href="#/">Volver al inicio</a>');
      d.hidden = false;
      fb(out, 'ok', 'Todos los pasos están correctos.');
      $$('.pills a')[n].classList.add('done');
      if (d.scrollIntoView) d.scrollIntoView({ block: 'nearest', behavior: reduced ? 'auto' : 'smooth' });
    }
    view.onclick = function (e) {
      if (e.target.dataset.a !== 'hint') return;
      var k = firstOpen(results());
      if (k < 0) return;
      var hs = ex.tasks[k].hints, j = Math.min(hints[k] || 0, hs.length - 1);
      if ((hints[k] || 0) < hs.length) { hints[k] = j + 1; used++; }
      fb(out, 'hint', '<b>Pista del paso ' + (k + 1) + ':</b> ' + hs[j]);
    };
  }

  /* ---------- rutas ---------- */
  function route() {
    view.onclick = null;
    if (!S) return viewLogin();
    var p = location.hash.replace(/^#\/?/, '').split('/'), idx = -1;
    COURSE.forEach(function (m, k) { if (m.id === p[1]) idx = k; });
    window.scrollTo(0, 0);
    if (p[0] === 'yo') return viewMe();
    if (p[0] !== 'm' || idx < 0) return viewHome();
    var m = COURSE[idx];
    if (S.last !== m.id) { S.last = m.id; save(); }
    if (p[2] === 'quiz') viewQuiz(m, idx + 1);
    else if (p[2] === 'practica') viewPractice(m, idx + 1, +p[3]);
    else viewLesson(m, idx + 1);
  }
  xpChip.addEventListener('click', function () { location.hash = '#/yo'; });
  window.addEventListener('hashchange', route);
  var cur = store('current');
  if (cur) load(cur);
  route();
})();
