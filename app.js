/* ============================================================
   APP.JS · Lógica del sitio y del cotizador · UltraNova San José
   No lleva precios (están en precios.js) ni datos del negocio
   (están en config.js). Todo el texto se inserta con textContent.
   ============================================================ */
(function () {
  'use strict';

  var P = window.PRECIOS, C = window.CONFIG;
  if (!P || !C) { console.error('Faltan precios.js o config.js'); return; }

  /* ---------- utilidades ---------- */
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, props, kids) {
    var e = document.createElement(tag);
    Object.keys(props || {}).forEach(function (k) {
      if (k === 'text') e.textContent = props[k];
      else if (k === 'class') e.className = props[k];
      else e.setAttribute(k, props[k]);
    });
    (kids || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }
  function clear(n) { while (n.firstChild) n.removeChild(n.firstChild); }
  function fmt(n) { return '$ ' + String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  function m(n) { return (Math.round(n * 100) / 100).toString().replace('.', ','); }
  function num(s) {
    s = String(s == null ? '' : s).trim().replace(/\s/g, '');
    if (!/^\d+([.,]\d+)?$/.test(s)) return NaN;
    return parseFloat(s.replace(',', '.'));
  }
  function waLink(texto) {
    return 'https://wa.me/' + encodeURIComponent(C.whatsapp) + (texto ? '?text=' + encodeURIComponent(texto) : '');
  }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- índices de precios ---------- */
  var FILA = {}, KIT = {}, CAT = {};
  P.categorias.forEach(function (c) { CAT[c.id] = c; c.filas.forEach(function (f) { FILA[f.id] = f; }); });
  P.kits.forEach(function (k) { KIT[k.id] = k; });
  function F(id) { if (!FILA[id]) throw new Error('Falta el precio ' + id); return FILA[id]; }

  /* ---------- tema y datos del negocio ---------- */
  var TEMAS = ['marino-dorado', 'esmeralda', 'vino', 'grafito', 'oceano', 'noche'];
  var tema = TEMAS.indexOf(C.tema) >= 0 ? C.tema : 'marino-dorado';
  document.documentElement.setAttribute('data-theme', tema);
  try {
    var tc = document.querySelector('meta[name="theme-color"]');
    var col = getComputedStyle(document.documentElement).getPropertyValue('--hero-1').trim();
    if (tc && col) tc.setAttribute('content', col);
  } catch (e) { /* sin problema */ }

  var saludo = 'Hola, quiero cotizar un servicio con ' + C.negocio + '.';
  $$('[data-wa]').forEach(function (a) { a.setAttribute('href', waLink(saludo)); a.setAttribute('target', '_blank'); a.setAttribute('rel', 'noopener noreferrer'); });
  $('#waVisible').textContent = C.whatsappVisible;
  var ig = $('#lnkIg');
  ig.setAttribute('href', 'https://www.instagram.com/' + encodeURIComponent(C.instagram) + '/');
  ig.textContent = 'Instagram @' + C.instagram;
  $('#anio').textContent = new Date().getFullYear();
  $('#verLista').textContent = P.version;
  $('#tituloPrecios').textContent = P.version.replace('Lista de ', '');
  $$('.entrega-txt, #chipEntrega').forEach(function (n) { n.textContent = P.entrega; });
  $$('.motor-txt').forEach(function (n) { n.textContent = fmt(P.motorizadaRecargo); });

  /* menú móvil */
  var menuBtn = $('#menuBtn'), nav = $('#nav');
  menuBtn.addEventListener('click', function () {
    var ab = nav.classList.toggle('abierto');
    menuBtn.setAttribute('aria-expanded', ab ? 'true' : 'false');
  });
  $$('#nav a').forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('abierto'); menuBtn.setAttribute('aria-expanded', 'false'); }); });

  /* ============================================================
     LISTA DE PRECIOS (pestañas)
     ============================================================ */
  function kitBox(c) {
    if (!C.mostrarKits || !c.kits || !c.kits.length) return null;
    var box = el('div', { class: 'kit-box' }, [el('h4', { text: 'Kit de mecanismo — ' + c.nombre.split(' · ')[0] })]);
    c.kits.forEach(function (id) {
      var k = KIT[id]; if (!k) return;
      box.appendChild(el('div', { class: 'kit' }, [
        el('div', {}, [el('span', { class: 'kit-n', text: k.nombre }), el('small', { text: k.incluye })]),
        el('strong', { text: fmt(k.precio) })
      ]));
    });
    box.appendChild(el('p', { class: 'nota', text: c.notaKit ? c.notaKit + ' ' + P.notaKits : P.notaKits }));
    return box;
  }

  function renderPrecios() {
    var tabs = $('#tabsPrecios'), cont = $('#panelesPrecios');
    clear(tabs); clear(cont);
    P.categorias.forEach(function (c, i) {
      var tb = el('button', { class: 'tab', type: 'button', role: 'tab', id: 'tab-' + c.id, 'aria-controls': 'pan-' + c.id, 'aria-selected': i === 0 ? 'true' : 'false', tabindex: i === 0 ? '0' : '-1', text: c.nombre });
      tabs.appendChild(tb);

      var tabla = el('table', { class: 'tarifas' });
      var hr = el('tr', {}, [el('th', { text: 'Descripción', scope: 'col' })]);
      var cols = c.columnas || ['Precio por unidad'];
      cols.forEach(function (n) { hr.appendChild(el('th', { class: 'v', scope: 'col', text: n })); });
      tabla.appendChild(el('thead', {}, [hr]));
      var tb2 = el('tbody');
      c.filas.forEach(function (f) {
        var tr = el('tr', {}, [el('td', { text: f.d }), el('td', { class: 'v', text: fmt(f.p) })]);
        if (c.columnas && c.columnas.length > 1) tr.appendChild(el('td', { class: 'v', text: fmt(f.p2) }));
        tb2.appendChild(tr);
      });
      tabla.appendChild(tb2);

      var pan = el('div', { class: 'panel-precio', role: 'tabpanel', id: 'pan-' + c.id, 'aria-labelledby': 'tab-' + c.id }, [el('h3', { text: c.nombre })]);
      if (i !== 0) pan.setAttribute('hidden', '');
      if (c.subtitulo) pan.appendChild(el('p', { class: 'sub', text: c.subtitulo }));
      pan.appendChild(el('div', { class: 'tabla-scroll' }, [tabla]));
      if (c.nota) pan.appendChild(el('p', { class: 'nota', text: c.nota }));
      var kb = kitBox(c); if (kb) pan.appendChild(kb);
      cont.appendChild(pan);
    });

    var tabEls = $$('.tab', tabs);
    function activar(idx, foco) {
      tabEls.forEach(function (t, j) {
        var on = j === idx;
        t.setAttribute('aria-selected', on ? 'true' : 'false');
        t.setAttribute('tabindex', on ? '0' : '-1');
        var p = $('#' + t.getAttribute('aria-controls'));
        if (on) p.removeAttribute('hidden'); else p.setAttribute('hidden', '');
      });
      if (foco) tabEls[idx].focus();
    }
    tabEls.forEach(function (t, i) {
      t.addEventListener('click', function () { activar(i, false); });
      t.addEventListener('keydown', function (ev) {
        var n = tabEls.length, j = -1;
        if (ev.key === 'ArrowRight') j = (i + 1) % n;
        else if (ev.key === 'ArrowLeft') j = (i - 1 + n) % n;
        else if (ev.key === 'Home') j = 0;
        else if (ev.key === 'End') j = n - 1;
        if (j >= 0) { ev.preventDefault(); activar(j, true); }
      });
    });

    var ad = $('#adicionales'); clear(ad);
    ad.appendChild(el('p', { text: 'Motorizadas: recargo ' + fmt(P.motorizadaRecargo) + ' por cortina.' }));
    ad.appendChild(el('p', { text: 'Entrega de ' + P.entrega + '.' }));
  }
  renderPrecios();
  $('#btnImprimir').addEventListener('click', function () { window.print(); });

  /* ============================================================
     ILUSTRACIONES (se reemplazan por fotos con config.fotosTipos)
     ============================================================ */
  var NS = 'http://www.w3.org/2000/svg';
  function S(tag, a) {
    var e = document.createElementNS(NS, tag);
    Object.keys(a).forEach(function (k) { e.setAttribute(k, a[k]); });
    return e;
  }
  var R = function (x, y, w, h, cls, rx) { return S('rect', { x: x, y: y, width: w, height: h, class: cls, rx: rx || 0 }); };
  var L = function (d, cls) { return S('path', { d: d, class: cls }); };
  var O = function (x, y, r, cls) { return S('circle', { cx: x, cy: y, r: r, class: cls }); };
  var FOCO = function (x, y, r) { return O(x, y, r, 'il-foco'); };

  var DIBUJOS = {
    enrollable: function () {
      return [R(20, 24, 80, 44, 'il-t2'), R(20, 66, 80, 4, 'il-t1', 1), R(16, 12, 88, 12, 'il-t1', 6),
        L('M98 24 V52', 'il-trazo-d'), O(98, 30, 1.6, 'il-t3'), O(98, 37, 1.6, 'il-t3'), O(98, 44, 1.6, 'il-t3'), O(98, 51, 1.6, 'il-t3'), FOCO(94, 26, 15)];
    },
    romana: function () {
      var a = [R(20, 12, 80, 5, 'il-t1'), R(20, 17, 80, 56, 'il-t2')];
      [28, 40, 52, 64].forEach(function (y) { a.push(L('M20 ' + y + ' Q60 ' + (y + 8) + ' 100 ' + y, 'il-trazo-d')); });
      a.push(FOCO(60, 40, 17)); return a;
    },
    sheer: function () {
      var a = [R(20, 12, 80, 5, 'il-t1'), R(20, 17, 80, 56, 'il-velo')];
      [20, 35, 50, 63].forEach(function (y) { a.push(R(20, y, 80, 8, 'il-t2')); });
      a.push(FOCO(60, 36, 19)); return a;
    },
    royal: function () {
      var a = [R(20, 12, 80, 5, 'il-t1'), R(20, 17, 80, 56, 'il-velo')];
      [22, 40, 58].forEach(function (y) { a.push(R(20, y, 80, 10, 'il-t2')); a.push(R(20, y, 80, 1.6, 'il-t3')); });
      a.push(FOCO(34, 28, 14)); return a;
    },
    vertesse: function () {
      var a = [R(18, 12, 84, 5, 'il-t1')];
      for (var i = 0; i < 8; i++) a.push(R(20 + i * 10.4, 18, 8, 58, i % 2 ? 'il-t2' : 'il-velo'));
      a.push(FOCO(60, 46, 24)); return a;
    },
    celular: function () {
      var a = [R(20, 12, 80, 5, 'il-t1'), R(20, 17, 80, 56, 'il-t2')];
      [30, 44, 58].forEach(function (y) {
        var d = 'M20 ' + y; for (var x = 20; x < 100; x += 10) d += ' l5 -7 l5 7';
        a.push(L(d, 'il-trazo-d'));
      });
      a.push(FOCO(28, 44, 15)); return a;
    },
    verticales: function () {
      var a = [R(18, 12, 84, 6, 'il-t1')];
      for (var i = 0; i < 6; i++) { a.push(R(20 + i * 14, 18, 11, 58, i % 2 ? 'il-t2' : 'il-t1')); a.push(O(25.5 + i * 14, 15, 1.8, 'il-t3')); }
      a.push(FOCO(30, 15, 12)); return a;
    },
    aluminio: function () {
      var a = [R(18, 11, 84, 4, 'il-t1')];
      for (var i = 0; i < 11; i++) a.push(R(20, 17 + i * 5.4, 80, 3.4, 'il-t2', 1));
      a.push(L('M32 15 V74', 'il-trazo-d')); a.push(L('M88 15 V74', 'il-trazo-d'));
      a.push(FOCO(94, 44, 14)); return a;
    },
    madera: function () {
      var a = [R(18, 11, 84, 5, 'il-t1')];
      for (var i = 0; i < 6; i++) a.push(R(20, 18 + i * 10.4, 80, 7.5, 'il-t3', 1.5));
      a.push(L('M34 16 V72', 'il-trazo-d')); a.push(L('M86 16 V72', 'il-trazo-d'));
      a.push(FOCO(34, 30, 13)); return a;
    },
    tradicional: function () {
      return [L('M14 15 H106', 'il-trazo-d'), O(14, 15, 3, 'il-t3'), O(106, 15, 3, 'il-t3'),
        L('M20 17 Q28 46 20 76 L46 76 Q38 46 46 17 Z', 'il-t1'), L('M74 17 Q82 46 74 76 L100 76 Q92 46 100 17 Z', 'il-t1'),
        L('M28 20 Q33 46 28 74', 'il-trazo'), L('M36 20 Q41 46 36 74', 'il-trazo'), L('M82 20 Q87 46 82 74', 'il-trazo'), L('M90 20 Q95 46 90 74', 'il-trazo'),
        FOCO(26, 15, 11)];
    },
    tapetes: function () {
      var a = [R(24, 22, 72, 48, 'il-t2', 2), R(30, 28, 60, 36, 'il-marco', 1), S('rect', { x: 50, y: 36, width: 20, height: 20, class: 'il-t3', transform: 'rotate(45 60 46)' })];
      for (var i = 0; i < 9; i++) { a.push(L('M24 ' + (26 + i * 5) + ' h-5', 'il-trazo-d')); a.push(L('M96 ' + (26 + i * 5) + ' h5', 'il-trazo-d')); }
      a.push(FOCO(100, 46, 13)); return a;
    },
    panel: function () {
      return [R(16, 12, 88, 4, 'il-t1'), R(20, 16, 32, 58, 'il-t2'), R(44, 16, 32, 58, 'il-t1'), R(68, 16, 32, 58, 'il-t2'),
        L('M44 16 V74', 'il-trazo'), L('M68 16 V74', 'il-trazo'), FOCO(60, 14, 13)];
    }
  };

  function ilus(id, nombre) {
    var foto = C.fotosTipos && C.fotosTipos[id];
    if (foto && /^[\w\-. ]+\.(jpe?g|png|webp|avif|gif)$/i.test(foto)) {
      var im = el('img', { src: foto, alt: 'Referencia: ' + nombre, loading: 'lazy' });
      return im;
    }
    var svg = S('svg', { viewBox: '0 0 120 90', role: 'img', 'aria-label': 'Ilustración de referencia: ' + nombre, preserveAspectRatio: 'xMidYMid slice' });
    svg.appendChild(R(0, 0, 120, 90, 'il-fondo'));
    svg.appendChild(R(14, 8, 92, 74, 'il-marco', 3));
    (DIBUJOS[id] ? DIBUJOS[id]() : []).forEach(function (n) { svg.appendChild(n); });
    return svg;
  }

  /* ============================================================
     TIPOS Y CÁLCULO
     ============================================================ */
  function main(t, det, q, u, uni) { q = uni ? Math.round(q * 100) / 100 : q; return { t: t, det: det || '', q: q, u: u, uni: uni || '', tot: Math.round(q * u), sub: false }; }
  function sub(t, q, u, det) { return { t: t, det: det || '', q: q, u: u, uni: '', tot: Math.round(q * u), sub: true }; }
  function medidas(v) { var area = v.ancho * v.alto; return { area: area, txt: m(v.ancho) + ' × ' + m(v.alto) + ' m (' + m(area) + ' m²)' }; }
  function tier(area, ids) { return area <= 1 ? ids[0] : (area <= 6 ? ids[1] : ids[2]); }
  function extrasPieza(filas, v) {
    if (v.motor) filas.push(sub('Recargo cortina motorizada', v.cant, P.motorizadaRecargo));
    if (v.kit && KIT[v.kit]) filas.push(sub(KIT[v.kit].nombre, v.cant, KIT[v.kit].precio, KIT[v.kit].incluye));
  }
  function extrasQty(filas, v) {
    if (v.riel > 0) filas.push(main(F(v.rielId || 'vrt_riel').d, '', v.riel, F(v.rielId || 'vrt_riel').p));
    if (v.motor > 0) filas.push(sub('Recargo cortina motorizada', v.motor, P.motorizadaRecargo));
    if (v.kit > 0) { var k = KIT[v.kitId]; filas.push(sub(k.nombre, v.kit, k.precio, k.incluye)); }
  }

  /* campos reutilizables */
  var fAncho = { k: 'ancho', t: 'num', l: 'Ancho (m)', min: 0.1, max: 20, ph: 'Ej: 1,20' };
  var fAlto = { k: 'alto', t: 'num', l: 'Alto (m)', min: 0.1, max: 20, ph: 'Ej: 1,50' };
  var fCant = { k: 'cant', t: 'int', l: 'Cantidad de piezas iguales', def: '1', min: 1, max: 999 };
  var fMotor = { k: 'motor', t: 'chk', l: 'Motorizada', s: 'Recargo de ' + fmt(P.motorizadaRecargo) + ' por cortina.' };
  function fKit(ids) {
    if (!C.mostrarKits) return null;
    var op = [['', 'Sin kit']];
    ids.forEach(function (id) { if (KIT[id]) op.push([id, KIT[id].nombre + ' — ' + fmt(KIT[id].precio)]); });
    return { k: 'kit', t: 'sel', l: 'Kit de mecanismo (opcional)', op: op, s: P.notaKits };
  }
  function qty(k, l, s) { return { k: k, t: 'int', l: l, def: '0', min: 0, max: 9999, s: s || '' }; }

  var TIPOS = [
    { id: 'enrollable', nombre: 'Enrollable',
      reconoce: 'Una tela lisa que se enrolla en un tubo superior, con control de cadena a un lado. Algunas traen casetera (la caja que cubre el rollo).',
      campos: [fAncho, fAlto, fCant, { k: 'casetera', t: 'sel', l: 'Casetera', op: [['sin', 'Sin casetera'], ['con', 'Con casetera']] }, fMotor, fKit(['k_cadena'])],
      calc: function (v) {
        var md = medidas(v), f = F(tier(md.area, ['enr_h1', 'enr_h6', 'enr_m6'])), con = v.casetera === 'con';
        var fl = [main(f.d + (con ? ' · con casetera' : ' · sin casetera'), md.txt, v.cant, con ? f.p2 : f.p)];
        extrasPieza(fl, v); return fl;
      } },
    { id: 'romana', nombre: 'Romana (Viewtex)',
      reconoce: 'Tela con pliegues horizontales que se recogen hacia arriba cuando se sube. Persiana Viewtex.',
      campos: [fAncho, fAlto, fCant, fMotor, fKit(['k_rom_continua', 'k_rom_semi'])],
      calc: function (v) {
        var md = medidas(v), f = F(tier(md.area, ['rom_h1', 'rom_h6', 'rom_m6']));
        var fl = [main(f.d, md.txt, v.cant, f.p)]; extrasPieza(fl, v); return fl;
      } },
    { id: 'sheer', nombre: 'Sheer Elegance',
      reconoce: 'Bandas de tela y velo alternadas entre dos capas: al subir o bajar se alinean y dejan pasar la luz.',
      campos: [fAncho, fAlto, fCant, fMotor, fKit(['k_cadena'])],
      calc: function (v) {
        var md = medidas(v), f = F(tier(md.area, ['she_h1', 'she_h6', 'she_m6']));
        var fl = [main(f.d, md.txt + ' · incluye refilada si la tela viene deshilada', v.cant, f.p)]; extrasPieza(fl, v); return fl;
      } },
    { id: 'royal', nombre: 'Sheer Royal · Nuance',
      reconoce: 'Bandas de tela y velo alternadas, línea Royal–Nuance. Si dudas entre esta y Sheer Elegance, envía una foto por WhatsApp.',
      campos: [fAncho, fAlto, fCant, fMotor],
      calc: function (v) {
        var md = medidas(v), f = F(tier(md.area, ['roy_h1', 'roy_h6', 'roy_m6']));
        var fl = [main(f.d, md.txt, v.cant, f.p)]; extrasPieza(fl, v); return fl;
      } },
    { id: 'vertesse', nombre: 'Vertesse · Sheer vertical',
      reconoce: 'Lamas verticales de velo que giran y se recogen hacia un lado.',
      campos: [fAncho, fAlto, fCant, fMotor],
      calc: function (v) {
        var md = medidas(v), fl, conf = false;
        if (md.area <= 1) fl = [main(F('ver_h1').d, md.txt, v.cant, F('ver_h1').p)];
        else {
          fl = [main(F('ver_h3').d, md.txt, v.cant, F('ver_h3').p)];
          if (md.area > 3) {
            var anchoRef = 3 / v.alto, pasos = Math.ceil((v.ancho - anchoRef) / 0.5 - 1e-9);
            if (pasos > 0) fl.push(sub(F('ver_extra').d, pasos * v.cant, F('ver_extra').p, 'Pasos de 50 cm sobre el ancho equivalente a 3 MT2'));
            fl[0].det += ' · valor por confirmar en el diagnóstico';
            conf = true;
          }
        }
        extrasPieza(fl, v); fl.confirmar = conf; return fl;
      } },
    { id: 'celular', nombre: 'Cortina celular',
      reconoce: 'Celdas en forma de panal que se ven en el borde de la cortina. Puede ser sencilla (solo velo o solo blackout) o doble (velo + blackout).',
      campos: [fAncho, fAlto, fCant, { k: 'tipo', t: 'sel', l: 'Tipo', op: [['s', 'Sencilla (solo velo o solo blackout)'], ['d', 'Doble (velo + blackout)']] }, fMotor],
      calc: function (v) {
        var md = medidas(v), p = v.tipo === 'd' ? 'cel_d_' : 'cel_s_', f = F(tier(md.area, [p + 'h1', p + 'h6', p + 'm6']));
        var fl = [main(f.d, md.txt, v.cant, f.p)]; extrasPieza(fl, v); return fl;
      } },
    { id: 'verticales', nombre: 'Verticales',
      reconoce: 'Lamas verticales sueltas, colgadas de un riel superior, con cadena y cordón.',
      campos: [qty('lamas', 'Número de lamas a lavar'), qty('riel', 'Rieles a lavar (cantidad)', 'Lavado de riel, cambio de cordón y lubricación.'), C.mostrarKits ? qty('kit', 'Kits de mecanismo (cantidad)', P.notaKits) : null, qty('motor', 'Cortinas motorizadas (cantidad)', 'Recargo de ' + fmt(P.motorizadaRecargo) + ' por cortina.')],
      minAlgo: ['lamas', 'riel', 'kit'],
      calc: function (v) {
        var fl = [];
        if (v.lamas > 0) { var f = v.lamas > 100 ? F('vrt_lama100') : F('vrt_lama'); fl.push(main(f.d, '', v.lamas, f.p)); }
        v.kitId = 'k_vertical'; extrasQty(fl, v); return fl;
      } },
    { id: 'aluminio', nombre: 'Persiana de aluminio',
      reconoce: 'Lamas metálicas finas y horizontales, unidas por cordones o escalerillas.',
      campos: [fAncho, fAlto, fCant, { k: 'cordon', t: 'chk', l: 'Cambio de cordón o escalerilla', s: 'Mano de obra por persiana: ' + fmt(F('alu_cordon').p) + '.' }],
      calc: function (v) {
        var md = medidas(v), f = F(tier(md.area, ['alu_h1', 'alu_h6', 'alu_m6']));
        var fl = [main(f.d, md.txt, v.cant, f.p)];
        if (v.cordon) fl.push(sub(F('alu_cordon').d, v.cant, F('alu_cordon').p)); return fl;
      } },
    { id: 'madera', nombre: 'Persiana de madera',
      reconoce: 'Lamas gruesas de madera, horizontales, con cordón para subir e inclinar.',
      campos: [fAncho, fAlto, fCant, { k: 'cordon', t: 'chk', l: 'Cambio de cordón o escalerilla', s: 'Mano de obra por persiana: ' + fmt(F('mad_cordon').p) + '.' }, fKit(['k_madera'])],
      calc: function (v) {
        var md = medidas(v), f = md.area <= 6 ? F('mad_h6') : F('mad_m6');
        var fl = [main(f.d, md.txt, v.cant, f.p)];
        if (v.cordon) fl.push(sub(F('mad_cordon').d, v.cant, F('mad_cordon').p));
        if (v.kit && KIT[v.kit]) fl.push(sub(KIT[v.kit].nombre, v.cant, KIT[v.kit].precio, KIT[v.kit].incluye)); return fl;
      } },
    { id: 'tradicional', nombre: 'Cortina tradicional',
      reconoce: 'Telas con caída y pliegues, colgadas de riel o barra: velo, pesada o forrada. También galerías (ondas, cascadas o tapizadas).',
      campos: [
        { k: 'tipo', t: 'sel', l: 'Tipo', op: [['velo', 'Cortina en velo (por ML)'], ['pesada', 'Cortina pesada (por ML)'], ['forrada', 'Cortina forrada (por ML)'], ['ondas', 'Galería ondas y cascadas (hasta 3 ML)'], ['tap', 'Galería tapizada (hasta 3 ML)']] },
        { k: 'ml', t: 'dec', l: 'Metros lineales (ML)', min: 0.1, max: 200, ph: 'Ej: 3,5', si: ['velo', 'pesada', 'forrada'] },
        { k: 'gal', t: 'int', l: 'Cantidad de galerías', def: '1', min: 1, max: 99, s: 'Cada una de hasta 3 ML.', si: ['ondas', 'tap'] },
        C.mostrarKits ? qty('kit', 'Kits de mecanismo para riel (cantidad)', P.notaKits) : null],
      calc: function (v) {
        var fl = [], map = { velo: 'tra_velo', pesada: 'tra_pesada', forrada: 'tra_forrada', ondas: 'tra_gal_ondas', tap: 'tra_gal_tap' };
        var f = F(map[v.tipo]);
        if (v.tipo === 'velo' || v.tipo === 'pesada' || v.tipo === 'forrada') fl.push(main(f.d, m(v.ml) + ' ML', v.ml, f.p, 'ML'));
        else fl.push(main(f.d, '', v.gal, f.p));
        if (v.kit > 0) fl.push(sub(KIT.k_riel_trad.nombre + ' (riel)', v.kit, KIT.k_riel_trad.precio, KIT.k_riel_trad.incluye));
        return fl;
      } },
    { id: 'tapetes', nombre: 'Tapete liso',
      reconoce: 'Tapetes lisos. Se cobra por metro cuadrado.',
      campos: [fAncho, fAlto, fCant],
      calc: function (v) { var md = medidas(v); return [main(F('tap_liso').d, md.txt, md.area * v.cant, F('tap_liso').p, 'm²')]; } },
    { id: 'panel', nombre: 'Panel japonés',
      reconoce: 'Paneles planos de tela que se deslizan sobre un riel. Se lavan por telo.',
      campos: [qty('telos', 'Telos a lavar (unidades)'), qty('velcro', 'Cambio de velcro (unidades)'), qty('riel', 'Rieles a lavar (cantidad)', 'Lavado de riel, cambio de cordón y lubricación.'), C.mostrarKits ? qty('kit', 'Kits de mecanismo (cantidad)', P.notaKits) : null, qty('motor', 'Cortinas motorizadas (cantidad)', 'Recargo de ' + fmt(P.motorizadaRecargo) + ' por cortina.')],
      minAlgo: ['telos', 'velcro', 'riel', 'kit'],
      calc: function (v) {
        var fl = [];
        if (v.telos > 0) fl.push(main(F('pan_telo').d, '', v.telos, F('pan_telo').p));
        if (v.velcro > 0) fl.push(main(F('pan_velcro').d, '', v.velcro, F('pan_velcro').p));
        v.rielId = 'pan_riel'; v.kitId = 'k_panel'; extrasQty(fl, v); return fl;
      } }
  ];
  TIPOS.forEach(function (t) { t.campos = t.campos.filter(Boolean); });

  /* ============================================================
     COTIZADOR (estado y pasos)
     ============================================================ */
  var quote = [], contador = 0, actual = null, pasoActual = 1;

  function total() { return quote.reduce(function (s, q) { return s + q.total; }, 0); }
  function mensaje(txt) { var e = $('#estado'); e.textContent = txt; if (txt) setTimeout(function () { if (e.textContent === txt) e.textContent = ''; }, 5000); }

  function ir(n, foco) {
    pasoActual = n;
    [1, 2, 3].forEach(function (i) { $('#paso' + i).hidden = i !== n; });
    $$('#pasos li').forEach(function (li) {
      var i = +li.getAttribute('data-p');
      li.classList.toggle('on', i === n);
      li.classList.toggle('hecho', i < n);
      if (i === n) li.setAttribute('aria-current', 'step'); else li.removeAttribute('aria-current');
    });
    actualizarMini();
    if (foco !== false) {
      $('#cotizador').scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
      var h = $('#paso' + n + ' h3'); if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    }
  }
  function actualizarMini() {
    var mini = $('#mini');
    if (quote.length && pasoActual !== 3) {
      mini.hidden = false;
      $('#miniTxt').textContent = 'Tu cotización: ' + quote.length + (quote.length === 1 ? ' pieza' : ' piezas') + ' · ' + fmt(total());
    } else mini.hidden = true;
  }
  $('#miniVer').addEventListener('click', function () { renderResumen(); ir(3); });
  $$('#pasos li').forEach(function (li) {
    li.addEventListener('click', function () {
      var i = +li.getAttribute('data-p');
      if (i === 1) ir(1);
      else if (i === 3 && quote.length) { renderResumen(); ir(3); }
    });
  });

  /* ---- Paso 1 ---- */
  function renderTipos() {
    var g = $('#tipos'); clear(g);
    TIPOS.forEach(function (t) {
      var b = el('button', { class: 'tipo', type: 'button' }, [el('div', { class: 'ilus' }, [ilus(t.id, t.nombre)]), el('b', { text: t.nombre })]);
      b.addEventListener('click', function () { abrirTipo(t); });
      g.appendChild(b);
    });
  }

  /* ---- Paso 2 ---- */
  function leer(t, form) {
    var v = {}, errores = [];
    t.campos.forEach(function (c) {
      var inp = form.elements[c.k]; if (!inp) return;
      if (c.si && c.si.indexOf(form.elements.tipo.value) < 0) { v[c.k] = c.t === 'int' || c.t === 'dec' ? 0 : ''; return; }
      if (c.t === 'chk') { v[c.k] = inp.checked; return; }
      if (c.t === 'sel') { v[c.k] = inp.value; return; }
      var raw = inp.value.trim();
      if (raw === '' && c.def !== undefined) raw = c.def;
      var n = num(raw);
      if (isNaN(n)) { errores.push(c.l + ': escribe un número.'); return; }
      if (c.t === 'int' && Math.floor(n) !== n) { errores.push(c.l + ': usa un número entero.'); return; }
      if (n < c.min || n > c.max) { errores.push(c.l + ': debe estar entre ' + m(c.min) + ' y ' + m(c.max) + '.'); return; }
      v[c.k] = n;
    });
    if (!errores.length && t.minAlgo) {
      var alguno = t.minAlgo.some(function (k) { return v[k] > 0; });
      if (!alguno) errores.push('Escribe al menos una cantidad mayor a cero.');
    }
    return { v: v, errores: errores };
  }
  function calcular(t, form) {
    var r = leer(t, form);
    if (r.errores.length) return { errores: r.errores };
    try {
      var filas = t.calc(r.v);
      return { filas: filas, total: filas.reduce(function (s, f) { return s + f.tot; }, 0), confirmar: !!filas.confirmar };
    } catch (e) { console.error(e); return { errores: ['No pude calcular esta pieza. Escríbenos por WhatsApp y la cotizamos.'] }; }
  }

  function abrirTipo(t) {
    actual = t;
    var cont = $('#confirmar'); clear(cont);
    var form = el('form', { novalidate: '', autocomplete: 'off' });
    form.addEventListener('submit', function (ev) { ev.preventDefault(); agregar(); });
    var grid = el('div', { class: 'form-grid' });
    t.campos.forEach(function (c) {
      var id = 'f-' + c.k, w;
      if (c.t === 'chk') {
        w = el('div', { class: 'campo check' }, [el('input', { type: 'checkbox', id: id, name: c.k }), el('div', {}, [el('label', { for: id, text: c.l }), c.s ? el('small', { text: c.s }) : null])]);
      } else if (c.t === 'sel') {
        var s = el('select', { id: id, name: c.k });
        c.op.forEach(function (o) { s.appendChild(el('option', { value: o[0], text: o[1] })); });
        w = el('div', { class: 'campo' }, [el('label', { for: id, text: c.l }), s, c.s ? el('small', { text: c.s }) : null]);
      } else {
        var inp = el('input', { type: 'text', id: id, name: c.k, inputmode: c.t === 'int' ? 'numeric' : 'decimal', maxlength: '8', placeholder: c.ph || '' });
        if (c.def !== undefined) inp.value = c.def;
        w = el('div', { class: 'campo' }, [el('label', { for: id, text: c.l }), inp, c.s ? el('small', { text: c.s }) : null]);
      }
      if (c.t === 'sel' && c.op.length > 2 || c.k === 'kit') w.className += ' ancha';
      if (c.si) w.setAttribute('data-si', c.si.join(','));
      grid.appendChild(w);
    });
    var vista = el('div', { class: 'vista', 'aria-live': 'polite' });
    var err = el('p', { class: 'error', role: 'alert' });
    var btnAdd = el('button', { class: 'btn btn-gold', type: 'submit', text: 'Agregar a la cotización' });
    var btnVolver = el('button', { class: 'btn btn-ghost-d', type: 'button', text: '← No es esta, volver' });
    btnVolver.addEventListener('click', function () { ir(1); });
    form.appendChild(grid); form.appendChild(vista); form.appendChild(err);
    form.appendChild(el('div', { class: 'acciones' }, [btnAdd, btnVolver]));

    cont.appendChild(el('div', { class: 'conf' }, [
      el('div', { class: 'ilus' }, [ilus(t.id, t.nombre)]),
      el('div', {}, [
        el('h3', { text: '¿Es una ' + t.nombre + '?' }),
        el('p', { class: 'reconoce', text: 'Se reconoce por: ' + t.reconoce }),
        form
      ])
    ]));

    function refrescar() {
      var tipoSel = form.elements.tipo ? form.elements.tipo.value : null;
      $$('[data-si]', form).forEach(function (w) { w.hidden = w.getAttribute('data-si').split(',').indexOf(tipoSel) < 0; });
      var r = calcular(t, form);
      clear(vista);
      if (r.errores) {
        vista.appendChild(document.createTextNode('Completa las medidas para ver el valor de esta pieza.'));
      } else {
        vista.appendChild(document.createTextNode('Valor de esta pieza: '));
        vista.appendChild(el('b', { text: fmt(r.total) }));
        if (r.confirmar) vista.appendChild(document.createTextNode(' (por confirmar con el diagnóstico)'));
      }
    }
    form.addEventListener('input', refrescar);
    form.addEventListener('change', refrescar);
    refrescar();

    function agregar() {
      var r = calcular(t, form);
      if (r.errores) { err.textContent = r.errores[0]; var primero = form.querySelector('input:not([hidden])'); return; }
      err.textContent = '';
      contador++;
      quote.push({ id: contador, tipo: t.nombre, filas: r.filas, total: r.total, confirmar: r.confirmar });
      renderResumen(); ir(3);
      mensaje('Pieza agregada a la cotización.');
    }
    ir(2);
    var primerInput = form.querySelector('input[type=text]:not([hidden]), select'); if (primerInput) setTimeout(function () { primerInput.focus({ preventScroll: true }); }, 50);
  }

  /* ---- Paso 3 ---- */
  function hayKits() { return quote.some(function (q) { return q.filas.some(function (f) { return f.sub && /^KIT/i.test(f.t); }); }); }
  function notas() {
    var n = ['Entrega: ' + P.entrega + '.', 'Valor estimado: se confirma con el diagnóstico técnico al recibir las piezas.'];
    if (quote.some(function (q) { return q.confirmar; })) n.push('Hay piezas marcadas "por confirmar" por sus medidas.');
    if (hayKits()) n.push('Kits de mecanismo: ' + P.notaKits);
    if (C.validezDias > 0) n.push('Cotización válida por ' + C.validezDias + ' días.');
    return n;
  }

  function renderResumen() {
    var cont = $('#resumen'); clear(cont);
    var vacio = !quote.length;
    $('#accionesCot').hidden = vacio;
    $('#btnVaciar').hidden = vacio;
    if (vacio) { cont.appendChild(el('p', { 'data-vacio': '', text: 'Aún no hay piezas en la cotización. Agrega la primera.' })); actualizarMini(); return; }
    var tabla = el('table', { class: 'cot' });
    tabla.appendChild(el('thead', {}, [el('tr', {}, [el('th', { text: 'Descripción', scope: 'col' }), el('th', { class: 'n', text: 'Cant.', scope: 'col' }), el('th', { class: 'n u', text: 'Valor unit.', scope: 'col' }), el('th', { class: 'n', text: 'Subtotal', scope: 'col' })])]));
    var tb = el('tbody');
    quote.forEach(function (q, i) {
      q.filas.forEach(function (f, j) {
        var d = el('td', {}, [document.createTextNode((j === 0 ? (i + 1) + '. ' : '') + f.t)]);
        if (f.det) d.appendChild(el('small', { text: f.det }));
        if (j === 0) {
          var rm = el('button', { class: 'quitar', type: 'button', text: 'Quitar', 'aria-label': 'Quitar la pieza ' + (i + 1) + ' (' + q.tipo + ')' });
          rm.addEventListener('click', function () { quote = quote.filter(function (x) { return x.id !== q.id; }); renderResumen(); mensaje('Pieza quitada.'); });
          d.appendChild(rm);
        }
        tb.appendChild(el('tr', { class: f.sub ? 'sub' : '' }, [d, el('td', { class: 'n', text: f.uni ? m(f.q) + ' ' + f.uni : String(f.q) }), el('td', { class: 'n u', text: fmt(f.u) }), el('td', { class: 'n', text: fmt(f.tot) })]));
      });
    });
    tabla.appendChild(tb);
    tabla.appendChild(el('tfoot', {}, [el('tr', {}, [el('td', { text: 'TOTAL' }), el('td', {}), el('td', { class: 'u' }), el('td', { class: 'n', text: fmt(total()) })])]));
    cont.appendChild(tabla);
    cont.appendChild(el('p', { class: 'pie-cot', text: notas().join(' ') }));
    actualizarMini();
  }

  /* texto plano (copiar y WhatsApp) */
  function nombreCliente() { return $('#cliente').value.trim().replace(/\s+/g, ' ').slice(0, 60); }
  function fechaHoy() { return new Date().toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  function textoPlano() {
    var l = ['*Cotización · ' + C.negocio + '*'];
    var cli = nombreCliente(); if (cli) l.push('Cliente: ' + cli);
    l.push('Fecha: ' + fechaHoy(), '');
    quote.forEach(function (q, i) {
      q.filas.forEach(function (f, j) {
        var cant = f.uni ? m(f.q) + ' ' + f.uni : f.q;
        var linea = (j === 0 ? (i + 1) + ') ' : '   + ') + f.t + (f.det ? ' — ' + f.det : '') + ' × ' + cant + ': ' + fmt(f.tot);
        l.push(linea);
      });
    });
    l.push('', '*TOTAL: ' + fmt(total()) + '*', '');
    notas().forEach(function (n) { l.push(n); });
    l.push('', C.promesa);
    return l.join('\n');
  }
  function copiar(txt) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(txt);
    return new Promise(function (ok, no) {
      var ta = el('textarea', { readonly: '', 'aria-hidden': 'true', class: 'fuera' }); ta.value = txt; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? ok() : no(); } catch (e) { no(e); } document.body.removeChild(ta);
    });
  }
  $('#btnCopiar').addEventListener('click', function () {
    copiar(textoPlano()).then(function () { mensaje('Texto copiado. Pégalo donde lo necesites.'); }, function () { mensaje('No pude copiar automáticamente. Usa “Enviar solo texto por WhatsApp”.'); });
  });
  $('#btnWaTxt').addEventListener('click', function () { window.open(waLink(textoPlano()), '_blank', 'noopener,noreferrer'); });
  $('#btnMas').addEventListener('click', function () { ir(1); });
  $('#btnVaciar').addEventListener('click', function () { quote = []; renderResumen(); mensaje('Cotización vaciada.'); });

  /* ---- PDF ---- */
  var logoCache = null;
  function cargarLogo() {
    if (logoCache !== null) return Promise.resolve(logoCache);
    return new Promise(function (ok) {
      var im = new Image();
      im.onload = function () {
        try {
          var cv = document.createElement('canvas'), w = 360, h = Math.round(360 * im.naturalHeight / im.naturalWidth);
          cv.width = w; cv.height = h; var cx = cv.getContext('2d'); cx.fillStyle = 'rgb(10,26,58)'; cx.fillRect(0, 0, w, h); cx.drawImage(im, 0, 0, w, h);
          logoCache = { data: cv.toDataURL('image/jpeg', 0.92), r: w / h }; ok(logoCache);
        } catch (e) { logoCache = false; ok(false); }
      };
      im.onerror = function () { logoCache = false; ok(false); };
      im.src = 'logo-blanco.png';
    });
  }
  function pdfT(x) { return String(x).replace(/²/g, '2'); }
  var NAVY = [10, 26, 58], ORO = [217, 164, 65], GRIS = [90, 100, 120];

  function dibujarPdf(doc, esc, dibujar, logo) {
    var W = 210, ML = 15, MR = 15, x1 = ML, wDesc = 98, xQ = ML + wDesc, wQ = 24, xU = xQ + wQ, wU = 29, xS = xU + wU, wS = W - MR - xS;
    var y = 0;
    function nuevaPagina() { doc.addPage(); y = 18; }
    // Encabezado
    if (dibujar) {
      doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]); doc.rect(0, 0, W, 34, 'F');
      doc.setFillColor(ORO[0], ORO[1], ORO[2]); doc.rect(0, 34, W, 1.4, 'F');
      if (logo) { var lh = 24; doc.addImage(logo.data, 'JPEG', ML, 5, lh * logo.r, lh); }
      else { doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.text(C.negocio, ML, 20); }
      doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.text('COTIZACIÓN', W - MR, 17, { align: 'right' });
      doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(ORO[0], ORO[1], ORO[2]);
      doc.text(P.version, W - MR, 23.5, { align: 'right' });
    }
    y = 44;
    var cli = nombreCliente();
    if (dibujar) {
      doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]); doc.setFontSize(10);
      doc.setFont('helvetica', 'bold'); doc.text('Cliente:', ML, y); doc.setFont('helvetica', 'normal'); doc.text(cli || '—', ML + 15, y);
      doc.setFont('helvetica', 'bold'); doc.text('Fecha:', W - MR - 38, y); doc.setFont('helvetica', 'normal'); doc.text(fechaHoy(), W - MR, y, { align: 'right' });
    }
    y += 8;
    function cabecera() {
      if (dibujar) {
        doc.setFillColor(245, 240, 228); doc.rect(ML, y - 5, W - ML - MR, 7.5, 'F');
        doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]); doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5 * esc);
        doc.text('DESCRIPCIÓN', x1 + 2, y);
        doc.text('CANT.', xQ + wQ - 2, y, { align: 'right' }); doc.text('VALOR UNIT.', xU + wU - 2, y, { align: 'right' }); doc.text('SUBTOTAL', xS + wS - 1, y, { align: 'right' });
      }
      y += 6;
    }
    cabecera();
    var fs = 9.5 * esc, fd = 7.8 * esc, lh = 4.4 * esc;
    quote.forEach(function (q, i) {
      q.filas.forEach(function (f, j) {
        var ind = f.sub ? 5 : 0;
        doc.setFont('helvetica', f.sub ? 'normal' : 'bold'); doc.setFontSize(fs);
        var t = doc.splitTextToSize(pdfT((j === 0 ? (i + 1) + '. ' : '') + f.t), wDesc - 4 - ind);
        doc.setFont('helvetica', 'normal'); doc.setFontSize(fd);
        var dt = f.det ? doc.splitTextToSize(pdfT(f.det), wDesc - 4 - ind) : [];
        var alto = t.length * lh + dt.length * (lh - 0.6) + 2.2;
        if (y + alto > 268) { nuevaPagina(); cabecera(); }
        if (dibujar) {
          doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]); doc.setFont('helvetica', f.sub ? 'normal' : 'bold'); doc.setFontSize(fs);
          doc.text(t, x1 + 2 + ind, y);
          doc.setFont('helvetica', 'normal'); doc.setFontSize(fd); doc.setTextColor(GRIS[0], GRIS[1], GRIS[2]);
          if (dt.length) doc.text(dt, x1 + 2 + ind, y + t.length * lh - 0.6);
          doc.setFontSize(fs); doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]); doc.setFont('helvetica', 'normal');
          doc.text(pdfT(f.uni ? m(f.q) + ' ' + f.uni : String(f.q)), xQ + wQ - 2, y, { align: 'right' });
          doc.text(fmt(f.u), xU + wU - 2, y, { align: 'right' });
          doc.setFont('helvetica', 'bold'); doc.text(fmt(f.tot), xS + wS - 1, y, { align: 'right' });
          doc.setDrawColor(228, 222, 208); doc.setLineWidth(0.2); doc.line(ML, y + alto - 3.4, W - MR, y + alto - 3.4);
        }
        y += alto;
      });
    });
    // Total
    if (y + 40 > 285) { nuevaPagina(); }
    y += 2;
    if (dibujar) {
      doc.setFillColor(NAVY[0], NAVY[1], NAVY[2]); doc.rect(ML + 75, y - 5.5, W - ML - MR - 75, 11, 'F');
      doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.text('TOTAL', ML + 80, y + 1.6);
      doc.setTextColor(ORO[0], ORO[1], ORO[2]); doc.setFontSize(13); doc.text(fmt(total()), W - MR - 3, y + 1.8, { align: 'right' });
    }
    y += 14;
    var ns = notas();
    doc.setFontSize(8.5 * Math.min(esc, 1)); doc.setFont('helvetica', 'normal');
    ns.forEach(function (n) {
      var ls = doc.splitTextToSize(pdfT('• ' + n), W - ML - MR - 2);
      if (dibujar) { doc.setTextColor(GRIS[0], GRIS[1], GRIS[2]); doc.text(ls, ML + 1, y); }
      y += ls.length * 4;
    });
    if (dibujar) {
      var pie = 285;
      doc.setDrawColor(ORO[0], ORO[1], ORO[2]); doc.setLineWidth(0.6); doc.line(ML, pie - 7, W - MR, pie - 7);
      doc.setTextColor(NAVY[0], NAVY[1], NAVY[2]); doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
      doc.text(C.promesa, ML, pie - 2);
      doc.setFont('helvetica', 'normal'); doc.text('WhatsApp ' + C.whatsappVisible + '  ·  @' + C.instagram, W - MR, pie - 2, { align: 'right' });
    }
    return doc.getNumberOfPages();
  }

  function crearPdf() {
    if (!quote.length) return;
    if (!window.jspdf || !window.jspdf.jsPDF) { mensaje('No cargó el generador de PDF. Usa “Copiar texto” o “Enviar solo texto por WhatsApp”.'); return; }
    mensaje('Creando el PDF…');
    cargarLogo().then(function (logo) {
      var jsPDF = window.jspdf.jsPDF, esc = 1, doc;
      var escalas = [1, 0.92, 0.85, 0.78, 0.7];
      for (var i = 0; i < escalas.length; i++) {
        doc = new jsPDF({ unit: 'mm', format: 'a4' });
        esc = escalas[i];
        if (dibujarPdf(doc, esc, false, logo) === 1) break;
      }
      doc = new jsPDF({ unit: 'mm', format: 'a4' });
      doc.setProperties({ title: 'Cotización ' + C.negocio, author: C.negocio });
      dibujarPdf(doc, esc, true, logo);
      var cli = nombreCliente().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 30);
      var d = new Date(), ymd = d.getFullYear() + ('0' + (d.getMonth() + 1)).slice(-2) + ('0' + d.getDate()).slice(-2);
      doc.save('Cotizacion-UltraNova' + (cli ? '-' + cli : '') + '-' + ymd + '.pdf');
      mensaje('PDF listo. Revisa tus descargas.');
    }).catch(function (e) { console.error(e); mensaje('No pude crear el PDF. Usa “Copiar texto”.'); });
  }
  $('#btnPdf').addEventListener('click', crearPdf);

  /* ============================================================
     SECCIONES OPCIONALES (galería, opiniones, dirección/horarios)
     ============================================================ */
  var okImg = function (s) { return typeof s === 'string' && /^[\w\-. ]+\.(jpe?g|png|webp|avif|gif)$/i.test(s); };
  var GAL = window.GALERIA;
  if (Array.isArray(GAL) && GAL.length) {
    var gg = $('#galeriaGrid');
    GAL.forEach(function (g) {
      if (!okImg(g.antes) || !okImg(g.despues)) return;
      gg.appendChild(el('figure', {}, [
        el('div', { class: 'par' }, [
          el('div', {}, [el('img', { src: g.antes, alt: 'Antes: ' + (g.texto || ''), loading: 'lazy' }), el('span', { class: 'et', text: 'Antes' })]),
          el('div', {}, [el('img', { src: g.despues, alt: 'Después: ' + (g.texto || ''), loading: 'lazy' }), el('span', { class: 'et', text: 'Después' })])
        ]),
        g.texto ? el('figcaption', { text: g.texto }) : null
      ]));
    });
    if (gg.children.length) $('#galeria').hidden = false;
  }
  if (Array.isArray(C.opiniones) && C.opiniones.length) {
    var og = $('#opinionesGrid');
    C.opiniones.forEach(function (o) {
      if (!o || !o.texto) return;
      og.appendChild(el('article', { class: 'card' }, [el('blockquote', { text: '“' + o.texto + '”' }), el('cite', { text: o.nombre || 'Cliente' })]));
    });
    if (og.children.length) $('#opiniones').hidden = false;
  }
  var dl = $('#datosLocal'), hay = false;
  if (C.direccion) { dl.appendChild(el('p', { text: '📍 ' + C.direccion })); hay = true; }
  if (C.mapaUrl && /^https:\/\//.test(C.mapaUrl)) { dl.appendChild(el('p', {}, [el('a', { href: C.mapaUrl, target: '_blank', rel: 'noopener noreferrer', text: 'Ver en el mapa' })])); hay = true; }
  if (Array.isArray(C.horarios) && C.horarios.length) { C.horarios.forEach(function (h) { dl.appendChild(el('p', { text: h })); }); hay = true; }
  if (hay) dl.hidden = false;

  if ('IntersectionObserver' in window) {
    var fab = $('.wa-flotante');
    new IntersectionObserver(function (en) { fab.classList.toggle('oculto', en[0].isIntersecting); }, { threshold: 0.15 }).observe($('#cotizador'));
  }

  /* ---------- arranque ---------- */
  renderTipos();
  renderResumen();
  ir(1, false);
})();
