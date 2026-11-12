/* Motor de fórmulas: un mini Excel en español (separador ; y coma decimal). */
(function (g) {
  'use strict';

  var E = { NAME: '#¿NOMBRE?', DIV: '#¡DIV/0!', VALUE: '#¡VALOR!', REF: '#¡REF!', NA: '#N/D', SYN: '#¡ERROR!' };
  function FErr(code) { this.code = code; }

  /* ---------- referencias ---------- */
  function colToN(s) { var n = 0; for (var i = 0; i < s.length; i++) n = n * 26 + s.charCodeAt(i) - 64; return n; }
  function nToCol(n) { var s = ''; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = (n - m - 1) / 26; } return s; }
  function ref(c, r) { return nToCol(c) + r; }
  function parseRef(s) {
    var m = /^(\$?)([A-Z]{1,2})(\$?)(\d+)$/.exec(String(s).toUpperCase());
    return m ? { c: colToN(m[2]), r: +m[4], ac: !!m[1], ar: !!m[3] } : null;
  }
  function expand(range) {
    var p = String(range).toUpperCase().split(':'), a = parseRef(p[0]), b = parseRef(p[1] || p[0]), out = [];
    for (var r = Math.min(a.r, b.r); r <= Math.max(a.r, b.r); r++)
      for (var c = Math.min(a.c, b.c); c <= Math.max(a.c, b.c); c++) out.push(ref(c, r));
    return out;
  }

  /* ---------- tokenizador ---------- */
  var RE_NUM = /^\d+(?:[.,]\d+)?/;
  var RE_REF = /^\$?[A-Za-z]{1,2}\$?\d+(?![A-Za-z0-9_.(])/;
  var RE_ID = /^[A-Za-zÁÉÍÓÚÑáéíóúñ_][A-Za-zÁÉÍÓÚÑáéíóúñ0-9_.]*/;
  var RE_OP = /^(<=|>=|<>|[-+*\/^&=<>():;,%])/;

  function tokenize(src) {
    var t = [], i = 0, n = src.length, m;
    while (i < n) {
      var ch = src[i];
      if (/\s/.test(ch)) { i++; continue; }
      if (ch === '"') {
        var j = i + 1, s = '';
        for (;;) {
          if (j >= n) throw new FErr(E.SYN);
          if (src[j] === '"') { if (src[j + 1] === '"') { s += '"'; j += 2; continue; } break; }
          s += src[j++];
        }
        t.push({ k: 'str', v: s, a: i, b: j + 1 }); i = j + 1; continue;
      }
      var rest = src.slice(i), k;
      if ((m = RE_NUM.exec(rest))) k = { k: 'num', v: parseFloat(m[0].replace(',', '.')) };
      else if ((m = RE_REF.exec(rest))) k = { k: 'ref', v: m[0].toUpperCase() };
      else if ((m = RE_ID.exec(rest))) k = { k: 'id', v: m[0].toUpperCase() };
      else if ((m = RE_OP.exec(rest))) k = { k: 'op', v: m[0] };
      else throw new FErr(E.SYN);
      k.a = i; k.b = i + m[0].length; t.push(k); i = k.b;
    }
    return t;
  }

  /* ---------- parser ---------- */
  var cache = {};
  function parse(src) {
    if (cache[src]) return cache[src];
    var t = tokenize(src), p = 0;
    function peek(v) { return t[p] && t[p].k === 'op' && t[p].v === v; }
    function eat(v) { if (peek(v)) { p++; return true; } return false; }
    function bin(next, ops) {
      return function () {
        var l = next();
        while (t[p] && t[p].k === 'op' && ops.indexOf(t[p].v) >= 0) { var o = t[p++].v; l = { k: 'bin', o: o, l: l, r: next() }; }
        return l;
      };
    }
    function prim() {
      var k = t[p++];
      if (!k) throw new FErr(E.SYN);
      if (k.k === 'num' || k.k === 'str') return k;
      if (k.k === 'ref') {
        var a = k.v.replace(/\$/g, '');
        if (eat(':')) {
          var k2 = t[p++];
          if (!k2 || k2.k !== 'ref') throw new FErr(E.SYN);
          return { k: 'range', a: a, b: k2.v.replace(/\$/g, '') };
        }
        return { k: 'ref', v: a };
      }
      if (k.k === 'id') {
        if (eat('(')) {
          var args = [];
          if (!eat(')')) {
            do { args.push(cmp()); } while (eat(';') || eat(','));
            if (!eat(')')) throw new FErr(E.SYN);
          }
          return { k: 'fn', n: k.v, args: args };
        }
        if (k.v === 'VERDADERO' || k.v === 'TRUE') return { k: 'bool', v: true };
        if (k.v === 'FALSO' || k.v === 'FALSE') return { k: 'bool', v: false };
        throw new FErr(E.NAME);
      }
      if (k.k === 'op' && k.v === '(') { var x = cmp(); if (!eat(')')) throw new FErr(E.SYN); return x; }
      throw new FErr(E.SYN);
    }
    function post() { var x = prim(); while (eat('%')) x = { k: 'pct', x: x }; return x; }
    function un() { if (eat('-')) return { k: 'neg', x: un() }; if (eat('+')) return un(); return post(); }
    var pow = bin(un, ['^']), mul = bin(pow, ['*', '/']), add = bin(mul, ['+', '-']), cat = bin(add, ['&']);
    var cmp = bin(cat, ['=', '<>', '<', '>', '<=', '>=']);
    var ast = cmp();
    if (p < t.length) throw new FErr(E.SYN);
    return (cache[src] = ast);
  }

  /* ---------- valores ---------- */
  function literal(raw) {
    var s = String(raw).trim();
    if (/^-?\d+([.,]\d+)?$/.test(s)) return parseFloat(s.replace(',', '.'));
    if (/^-?\d+([.,]\d+)?%$/.test(s)) return parseFloat(s.replace(',', '.')) / 100;
    var u = s.toUpperCase();
    if (u === 'VERDADERO') return true;
    if (u === 'FALSO') return false;
    return s;
  }
  function format(v) {
    if (v == null) return '';
    if (typeof v === 'number') return String(parseFloat(v.toFixed(4))).replace('.', ',');
    if (typeof v === 'boolean') return v ? 'VERDADERO' : 'FALSO';
    return String(v);
  }
  function scalar(v) {
    if (v && v.rng) { if (v.rows.length === 1 && v.rows[0].length === 1) return v.rows[0][0]; throw new FErr(E.VALUE); }
    return v;
  }
  function num(v) {
    v = scalar(v);
    if (v == null) return 0;
    if (typeof v === 'number') return v;
    if (typeof v === 'boolean') return v ? 1 : 0;
    var l = literal(v);
    if (typeof l === 'number') return l;
    throw new FErr(E.VALUE);
  }
  function truthy(v) {
    v = scalar(v);
    if (typeof v === 'boolean') return v;
    if (typeof v === 'number') return v !== 0;
    if (v == null) return false;
    throw new FErr(E.VALUE);
  }
  function compare(a, b) {
    if (a == null) a = typeof b === 'string' ? '' : 0;
    if (b == null) b = typeof a === 'string' ? '' : 0;
    if (typeof a === 'boolean') a = a ? 1 : 0;
    if (typeof b === 'boolean') b = b ? 1 : 0;
    if (typeof a === typeof b) {
      if (typeof a === 'number') return a - b;
      a = a.toLowerCase(); b = b.toLowerCase();
      return a < b ? -1 : a > b ? 1 : 0;
    }
    return typeof a === 'number' ? -1 : 1; // en Excel los números van antes que el texto
  }
  function flat(args) {
    var out = [];
    args.forEach(function (x) { if (x && x.rng) x.rows.forEach(function (r) { out.push.apply(out, r); }); else out.push(x); });
    return out;
  }
  function nums(args) {
    var out = [];
    args.forEach(function (x) {
      if (x && x.rng) x.rows.forEach(function (r) { r.forEach(function (v) { if (typeof v === 'number') out.push(v); }); });
      else out.push(num(x));
    });
    return out;
  }
  function sum(a) { return a.reduce(function (s, x) { return s + x; }, 0); }
  function needRange(x) { if (!x || !x.rng) throw new FErr(E.VALUE); return x; }

  /* criterio de CONTAR.SI / SUMAR.SI: ">=4", "<>Chips", "Chips", 10 */
  function criterion(c) {
    c = scalar(c);
    var op = '=', x = c, m;
    if (typeof c === 'string' && (m = /^(<=|>=|<>|<|>|=)(.*)$/.exec(c))) { op = m[1]; x = literal(m[2]); }
    else if (typeof c === 'string') x = literal(c);
    function same(v) {
      if (typeof x === 'number') return typeof v === 'number' && v === x;
      if (typeof x === 'boolean') return v === x;
      if (x === '') return v == null || v === '';
      return typeof v === 'string' && v.toLowerCase() === String(x).toLowerCase();
    }
    return function (v) {
      if (op === '=') return same(v);
      if (op === '<>') return !same(v);
      if (typeof v !== 'number' || typeof x !== 'number') return false;
      return op === '<' ? v < x : op === '>' ? v > x : op === '<=' ? v <= x : v >= x;
    };
  }
  function ifAgg(args, pickSum) {
    var rg = needRange(args[0]), test = criterion(args[1]), sr = args[2] ? needRange(args[2]) : rg, out = [];
    rg.rows.forEach(function (row, i) {
      row.forEach(function (v, j) {
        if (!test(v)) return;
        var s = pickSum ? (sr.rows[i] || [])[j] : 1;
        if (typeof s === 'number') out.push(s);
      });
    });
    return out;
  }

  var FN = {
    'SUMA': function (a) { return sum(nums(a)); },
    'PROMEDIO': function (a) { var n = nums(a); if (!n.length) throw new FErr(E.DIV); return sum(n) / n.length; },
    'MAX': function (a) { var n = nums(a); return n.length ? Math.max.apply(null, n) : 0; },
    'MIN': function (a) { var n = nums(a); return n.length ? Math.min.apply(null, n) : 0; },
    'CONTAR': function (a) { return flat(a).filter(function (v) { return typeof v === 'number'; }).length; },
    'CONTARA': function (a) { return flat(a).filter(function (v) { return v != null && v !== ''; }).length; },
    'Y': function (a) { return flat(a).filter(function (v) { return v != null; }).every(truthy); },
    'O': function (a) { return flat(a).filter(function (v) { return v != null; }).some(truthy); },
    'NO': function (a) { return !truthy(a[0]); },
    'CONTAR.SI': function (a) { return ifAgg([a[0], a[1]], false).length; },
    'SUMAR.SI': function (a) { return sum(ifAgg(a, true)); },
    'PROMEDIO.SI': function (a) { var n = ifAgg(a, true); if (!n.length) throw new FErr(E.DIV); return sum(n) / n.length; },
    'REDONDEAR': function (a) { var p = Math.pow(10, a.length > 1 ? num(a[1]) : 0), x = num(a[0]); return Math.round((x + Number.EPSILON * (x < 0 ? -1 : 1)) * p) / p; },
    'ABS': function (a) { return Math.abs(num(a[0])); },
    'ENTERO': function (a) { return Math.floor(num(a[0])); },
    'RAIZ': function (a) { var x = num(a[0]); if (x < 0) throw new FErr(E.VALUE); return Math.sqrt(x); },
    'POTENCIA': function (a) { return Math.pow(num(a[0]), num(a[1])); },
    'CONCATENAR': function (a) { return flat(a).map(format).join(''); },
    'MAYUSC': function (a) { return format(scalar(a[0])).toUpperCase(); },
    'MINUSC': function (a) { return format(scalar(a[0])).toLowerCase(); },
    'LARGO': function (a) { return format(scalar(a[0])).length; },
    'BUSCARV': function (a) {
      var v = scalar(a[0]), rows = needRange(a[1]).rows, col = num(a[2]), approx = a.length > 3 ? truthy(a[3]) : true, hit = null;
      if (col < 1 || col > rows[0].length) throw new FErr(E.REF);
      for (var i = 0; i < rows.length; i++) {
        var k = rows[i][0];
        if (k == null) continue;
        if (compare(k, v) === 0) { hit = rows[i]; break; }
        if (approx && typeof k === typeof v && compare(k, v) < 0) hit = rows[i];
      }
      if (!hit) throw new FErr(E.NA);
      return hit[col - 1];
    }
  };
  var ALIAS = {
    SUM: 'SUMA', AVERAGE: 'PROMEDIO', COUNT: 'CONTAR', COUNTA: 'CONTARA', IF: 'SI', AND: 'Y', OR: 'O', NOT: 'NO',
    COUNTIF: 'CONTAR.SI', SUMIF: 'SUMAR.SI', AVERAGEIF: 'PROMEDIO.SI', ROUND: 'REDONDEAR', VLOOKUP: 'BUSCARV',
    CONCAT: 'CONCATENAR', CONCATENATE: 'CONCATENAR', IFERROR: 'SI.ERROR', SQRT: 'RAIZ', UPPER: 'MAYUSC', LOWER: 'MINUSC', LEN: 'LARGO'
  };

  /* ---------- hoja ---------- */
  function Sheet(cells) { this.cells = cells; this.memo = {}; this.busy = {}; }

  Sheet.prototype.get = function (r) {
    if (r in this.memo) { var m = this.memo[r]; if (m instanceof FErr) throw m; return m; }
    if (this.busy[r]) throw new FErr(E.REF); // referencia circular
    this.busy[r] = true;
    var v;
    try {
      var raw = this.cells[r];
      v = raw == null || raw === '' ? null : String(raw)[0] === '=' ? scalar(this.ev(parse(String(raw).slice(1)))) : literal(raw);
    } catch (e) { v = e instanceof FErr ? e : new FErr(E.SYN); }
    this.busy[r] = false;
    this.memo[r] = v;
    if (v instanceof FErr) throw v;
    return v;
  };

  Sheet.prototype.ev = function (n) {
    var self = this, l, r;
    switch (n.k) {
      case 'num': case 'str': case 'bool': return n.v;
      case 'ref': return this.get(n.v);
      case 'range':
        var a = parseRef(n.a), b = parseRef(n.b), rows = [];
        for (var y = Math.min(a.r, b.r); y <= Math.max(a.r, b.r); y++) {
          var row = [];
          for (var x = Math.min(a.c, b.c); x <= Math.max(a.c, b.c); x++) row.push(this.get(ref(x, y)));
          rows.push(row);
        }
        return { rng: true, rows: rows };
      case 'neg': return -num(this.ev(n.x));
      case 'pct': return num(this.ev(n.x)) / 100;
      case 'bin':
        l = scalar(this.ev(n.l)); r = scalar(this.ev(n.r));
        switch (n.o) {
          case '+': return num(l) + num(r);
          case '-': return num(l) - num(r);
          case '*': return num(l) * num(r);
          case '/': if (num(r) === 0) throw new FErr(E.DIV); return num(l) / num(r);
          case '^': return Math.pow(num(l), num(r));
          case '&': return format(l) + format(r);
          case '=': return compare(l, r) === 0;
          case '<>': return compare(l, r) !== 0;
          case '<': return compare(l, r) < 0;
          case '>': return compare(l, r) > 0;
          case '<=': return compare(l, r) <= 0;
          default: return compare(l, r) >= 0;
        }
      case 'fn':
        var name = ALIAS[n.n] || n.n;
        if (name === 'SI') { // perezosa: solo evalúa la rama que corresponde
          if (n.args.length < 2) throw new FErr(E.SYN);
          return truthy(this.ev(n.args[0])) ? this.ev(n.args[1]) : n.args[2] ? this.ev(n.args[2]) : false;
        }
        if (name === 'SI.ERROR') {
          try { return scalar(this.ev(n.args[0])); } catch (e) { if (e instanceof FErr && n.args[1]) return this.ev(n.args[1]); throw e; }
        }
        if (!FN[name]) throw new FErr(E.NAME);
        return FN[name](n.args.map(function (x) { return self.ev(x); }));
    }
    throw new FErr(E.SYN);
  };

  /* value(ref) y evalFormula(f) nunca lanzan: devuelven {v, e} */
  function safe(fn) { try { return { v: fn(), e: null }; } catch (e) { return { v: null, e: e instanceof FErr ? e.code : E.SYN }; } }
  Sheet.prototype.value = function (r) { var s = this; return safe(function () { return s.get(r); }); };
  Sheet.prototype.evalFormula = function (f) { var s = this; return safe(function () { return scalar(s.ev(parse(String(f).replace(/^=/, '')))); }); };

  /* Desplaza las referencias relativas de una fórmula (copiar / rellenar). */
  function shift(formula, dr, dc) {
    formula = String(formula);
    if (formula[0] !== '=' || (!dr && !dc)) return formula;
    var body = formula.slice(1), t, out = '', pos = 0;
    try { t = tokenize(body); } catch (e) { return formula; }
    t.forEach(function (k) {
      if (k.k !== 'ref') return;
      var p = parseRef(k.v), c = p.ac ? p.c : p.c + dc, r = p.ar ? p.r : p.r + dr;
      out += body.slice(pos, k.a) + (c < 1 || r < 1 ? E.REF : (p.ac ? '$' : '') + nToCol(c) + (p.ar ? '$' : '') + r);
      pos = k.b;
    });
    return '=' + out + body.slice(pos);
  }

  g.XL = { Sheet: Sheet, E: E, ref: ref, parseRef: parseRef, expand: expand, literal: literal, format: format, shift: shift };
})(typeof window !== 'undefined' ? window : globalThis);
