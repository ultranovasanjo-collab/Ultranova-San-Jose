(function () {
  'use strict';

  // Anti-clickjacking (respaldo; lo ideal es la cabecera frame-ancestors, ver README)
  if (window.top !== window.self) { try { window.top.location = window.self.location; } catch (e) { document.documentElement.hidden = true; } }

  /* =====================  CONFIGURACIÓN (edite aquí)  ===================== */
  var CONFIG = {
    whatsapp: '573213183368',          // 57 + número, sin espacios
    // Cuando tenga estos datos, llénelos y aparecen solos:
    direccion: '',                      // ej: 'Calle 00 # 00-00, Bogotá'
    horarios: '',                       // ej: 'Lunes a viernes 8:00 a. m. – 5:00 p. m.'
    // Fotos en la carpeta assets/fotos/. Ej: { antes:'fotos/rom1-antes.jpg', despues:'fotos/rom1-despues.jpg', texto:'Persiana enrollable' }
    galeria: [],
    // Opiniones REALES de clientes (con su permiso). Ej: { texto:'Quedaron como nuevas', autor:'Nombre, ciudad' }
    opiniones: []
  };

  /* =====================  PRECIOS 2026 (3 % ya aplicado)  ===================== */
  var MOT = 19400, EXP_1_5 = 27200, EXP_6_15 = 37800;
  var CATS = [
    { id: 'enrollable', name: 'Enrollable', cols: ['Sin casetera', 'Con casetera'], unit: 'unidades',
      note: 'El lavado incluye refilada cuando la tela viene deshilada.',
      rows: [['Lavado hasta 1 m²', 23300, 26200], ['Lavado de 1 a 6 m²', 43700, 48500], ['Lavado más de 6 m²', 53400, 58200], ['Corte (ancho o alto)', 24300, 29100]] },
    { id: 'romana', name: 'Romana (Viewtex)', cols: ['Precio por unidad'], unit: 'unidades',
      note: 'Incluye cambio de cordón, guías de cordón y tapas de perfil pliegue cuando estén deterioradas.',
      rows: [['Lavado hasta 1 m²', 41700], ['Lavado de 1 a 6 m²', 69800], ['Lavado más de 6 m²', 72800], ['Corte (ancho o alto)', 31000]] },
    { id: 'sheer', name: 'Sheer Elegance', cols: ['Precio por unidad'], unit: 'unidades',
      note: 'El lavado incluye refilada cuando la tela viene deshilada.',
      rows: [['Lavado hasta 1 m²', 41700], ['Lavado de 1 a 6 m²', 82500], ['Lavado más de 6 m²', 87300], ['Corte (ancho o alto)', 58200]] },
    { id: 'royal', name: 'Sheer Royal-Nuance', cols: ['Precio por unidad'], unit: 'unidades', note: '',
      rows: [['Lavado hasta 1 m²', 62100], ['Lavado de 1 a 6 m²', 101900], ['Lavado más de 6 m²', 111600], ['Corte (ancho o alto)', 67900]] },
    { id: 'vertesse', name: 'Vertesse (sheer vertical)', cols: ['Precio por unidad'], unit: 'unidades', note: '',
      rows: [['Lavado hasta 1 m²', 93100], ['Lavado de 1 a 3 m de ancho', 184300], ['Cada 50 cm adicional en la misma cortina (recargo)', 28800]] },
    { id: 'celular', name: 'Cortina celular', cols: ['Precio por unidad'], unit: 'unidades', note: '',
      rows: [['Sencilla (solo velo o solo blackout) hasta 1 m²', 82500], ['Sencilla de 1 a 6 m²', 155200], ['Sencilla más de 6 m²', 166800], ['Doble (velo + blackout) hasta 1 m²', 113500], ['Doble de 1 a 6 m²', 165900], ['Doble más de 6 m²', 189200]] },
    { id: 'vertical', name: 'Verticales', cols: ['Precio por unidad'], unit: 'unidades', note: '',
      rows: [['Lavado de lamas (unidad)', 5500], ['Lavado de lamas, más de 100 unidades (cada una)', 4500], ['Lavado de riel, cambio de cordón y lubricación', 72800]] },
    { id: 'aluminio', name: 'Persianas de aluminio', cols: ['Precio por unidad'], unit: 'unidades', note: '',
      rows: [['Lavado hasta 1 m²', 46600], ['Lavado de 1 a 6 m²', 67900], ['Lavado más de 6 m²', 73700], ['Mano de obra cambio de cordón o escalerilla (por persiana)', 43700]] },
    { id: 'madera', name: 'Persianas de madera', cols: ['Precio por unidad'], unit: 'unidades', note: '',
      rows: [['Limpieza y lubricación de 1 a 6 m²', 82500], ['Limpieza y lubricación más de 6 m²', 99900], ['Mano de obra cambio de cordón o escalerilla (por persiana)', 43700]] },
    { id: 'tradicional', name: 'Cortinas tradicionales', cols: ['Precio'], unit: 'metros lineales / unidades', note: 'Cortinas por metro lineal (ML). Galerías hasta 3 ML.',
      rows: [['Cortina en velo, por ML (dobladillo)', 10700], ['Cortina pesada, por ML (dobladillo)', 13600], ['Cortina forrada, por ML (dobladillo)', 24300], ['Galería ondas y cascadas hasta 3 ML', 93100], ['Galería tapizada hasta 3 ML', 70800]] },
    { id: 'tapetes', name: 'Tapetes', cols: ['Precio por m²'], unit: 'm²', note: '',
      rows: [['Lavado tapete liso (m²)', 44600], ['Lavado tapete peludo (m²)', 53400]] },
    { id: 'japones', name: 'Panel japonés', cols: ['Precio por unidad'], unit: 'unidades', note: '',
      rows: [['Lavado de telo (unidad)', 18400], ['Cambio de velcro (unidad)', 6800], ['Corte (ancho o alto)', 6300], ['Lavado de riel, cambio de cordón y lubricación', 72800]] }
  ];

  /* =====================  utilidades  ===================== */
  var fmt = new Intl.NumberFormat('es-CO');
  function money(n) { return '$ ' + fmt.format(n); }
  function el(tag, props, kids) {
    var e = document.createElement(tag);
    if (props) { Object.keys(props).forEach(function (k) { if (k === 'text') e.textContent = props[k]; else e.setAttribute(k, props[k]); }); }
    (kids || []).forEach(function (c) { e.appendChild(c); });
    return e;
  }
  function $(id) { return document.getElementById(id); }
  function clampInt(v, min, max) { var n = Math.floor(Number(v)); if (!isFinite(n)) n = min; return Math.min(max, Math.max(min, n)); }
  function waLink(text) { return 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent(String(text).slice(0, 1500)); }
  function clear(node) { while (node.firstChild) node.removeChild(node.firstChild); }

  /* =====================  WhatsApp directo  ===================== */
  Array.prototype.forEach.call(document.querySelectorAll('[data-wa]'), function (a) {
    a.setAttribute('href', waLink(a.getAttribute('data-wa')));
    a.setAttribute('target', '_blank');
    a.setAttribute('rel', 'noopener noreferrer');
  });

  /* =====================  tabla de precios  ===================== */
  var tabs = $('tabs'), panel = $('panel'), panelNote = $('panel-note');
  function buildTable(cat) {
    var head = el('tr', null, [el('th', { text: 'Descripción' })].concat(cat.cols.map(function (c) { var th = el('th', { text: c }); th.className = 'p'; return th; })));
    var body = cat.rows.map(function (r) {
      var cells = [el('td', { text: r[0] })];
      for (var i = 1; i < r.length; i++) { var td = el('td', { text: money(r[i]) }); td.className = 'p'; cells.push(td); }
      return el('tr', null, cells);
    });
    return el('table', null, [el('thead', null, [head]), el('tbody', null, body)]);
  }
  function showCat(i) {
    Array.prototype.forEach.call(tabs.children, function (b, j) { b.setAttribute('aria-selected', j === i ? 'true' : 'false'); b.tabIndex = j === i ? 0 : -1; });
    clear(panel); panel.appendChild(buildTable(CATS[i]));
    panelNote.textContent = CATS[i].note;
  }
  CATS.forEach(function (c, i) {
    var b = el('button', { type: 'button', role: 'tab', 'class': 'tab', text: c.name });
    b.addEventListener('click', function () { showCat(i); });
    b.addEventListener('keydown', function (e) {
      var n = null;
      if (e.key === 'ArrowRight') n = (i + 1) % CATS.length; if (e.key === 'ArrowLeft') n = (i - 1 + CATS.length) % CATS.length;
      if (n !== null) { e.preventDefault(); showCat(n); tabs.children[n].focus(); }
    });
    tabs.appendChild(b);
  });
  showCat(0);
  $('btn-print').addEventListener('click', function () { window.print(); });
  window.addEventListener('beforeprint', function () {
    clear(panel);
    CATS.forEach(function (c) { panel.appendChild(el('h3', { text: c.name })); panel.appendChild(buildTable(c)); });
    panelNote.textContent = 'UltraNova San José · WhatsApp 321 318 3368 · Precios 2026 con 3 % de descuento incluido.';
  });
  window.addEventListener('afterprint', function () {
    var sel = 0; Array.prototype.forEach.call(tabs.children, function (b, j) { if (b.getAttribute('aria-selected') === 'true') sel = j; });
    showCat(sel);
  });

  /* =====================  cotizador  ===================== */
  var qCat = $('q-cat'), qItem = $('q-item'), qQty = $('q-qty'), qMot = $('q-mot'), qMsg = $('q-msg');
  var lines = [];
  var OPTS = []; // por categoría: [{label, price}]
  CATS.forEach(function (c, ci) {
    var o = [];
    c.rows.forEach(function (r) { for (var k = 1; k < r.length; k++) o.push({ label: r[0] + (c.cols.length > 1 ? ' · ' + c.cols[k - 1] : ''), price: r[k] }); });
    OPTS[ci] = o;
    qCat.appendChild(el('option', { value: String(ci), text: c.name }));
  });
  function fillItems() {
    clear(qItem);
    OPTS[Number(qCat.value)].forEach(function (o, i) { qItem.appendChild(el('option', { value: String(i), text: o.label + ' — ' + money(o.price) })); });
    $('q-qty-l').textContent = 'Cantidad (' + CATS[Number(qCat.value)].unit + ')';
  }
  qCat.addEventListener('change', fillItems); fillItems();

  $('q-add').addEventListener('click', function () {
    var ci = clampInt(qCat.value, 0, CATS.length - 1), ii = clampInt(qItem.value, 0, OPTS[ci].length - 1);
    var qty = clampInt(qQty.value, 1, 999), mot = clampInt(qMot.value, 0, 999);
    if (mot > qty) { qMsg.textContent = 'Las motorizadas no pueden ser más que la cantidad.'; return; }
    if (lines.length >= 30) { qMsg.textContent = 'Para pedidos más grandes, escríbanos por WhatsApp.'; return; }
    qMsg.textContent = '';
    var o = OPTS[ci][ii];
    lines.push({ cat: CATS[ci].name, label: o.label, price: o.price, qty: qty, mot: mot });
    qQty.value = 1; qMot.value = 0; render();
  });
  $('q-exp').addEventListener('change', render);

  function totals() {
    var base = 0, mot = 0, units = 0;
    lines.forEach(function (l) { base += l.price * l.qty; mot += MOT * l.mot; units += l.qty; });
    var exp = 0, over = false;
    if ($('q-exp').checked && units > 0) { if (units <= 5) exp = EXP_1_5; else if (units <= 15) exp = EXP_6_15; else over = true; }
    return { base: base, mot: mot, exp: exp, over: over, total: base + mot + exp, units: units };
  }
  function render() {
    var ul = $('q-lines'); clear(ul);
    lines.forEach(function (l, i) {
      var left = el('span', { text: l.cat }); left.appendChild(el('small', { text: l.qty + ' × ' + l.label + (l.mot ? ' (' + l.mot + ' motorizada' + (l.mot > 1 ? 's' : '') + ')' : '') }));
      var rm = el('button', { type: 'button', 'aria-label': 'Quitar ' + l.cat, text: 'Quitar' });
      rm.addEventListener('click', function () { lines.splice(i, 1); render(); });
      ul.appendChild(el('li', null, [left, el('b', { text: money(l.price * l.qty + MOT * l.mot) }), rm]));
    });
    $('q-empty').hidden = lines.length > 0;
    var t = totals();
    $('s-base').textContent = money(t.base); $('s-mot').textContent = money(t.mot);
    $('s-exp').textContent = t.over ? 'A confirmar' : money(t.exp); $('s-tot').textContent = money(t.total);
    $('q-fine').textContent = t.over ? 'Más de 15 unidades: el exprés se confirma por WhatsApp. Precios con 3 % de descuento incluido.' : 'Precios con 3 % de descuento incluido.';
    var msg = 'Hola UltraNova San José, quiero cotizar:\n';
    if (!lines.length) msg = 'Hola UltraNova San José, quiero cotizar el lavado de cortinas y persianas.';
    else {
      lines.forEach(function (l) { msg += '- ' + l.qty + ' × ' + l.cat + ': ' + l.label + (l.mot ? ' (' + l.mot + ' motorizada/s)' : '') + '\n'; });
      if ($('q-exp').checked) msg += 'Entrega en 24 horas.\n';
      msg += 'Total estimado: ' + money(t.total);
    }
    $('q-wa').setAttribute('href', waLink(msg)); $('q-wa').setAttribute('target', '_blank'); $('q-wa').setAttribute('rel', 'noopener noreferrer');
  }
  render();

  /* =====================  secciones opcionales  ===================== */
  var safeImg = /^fotos\/[\w\-./]+\.(jpe?g|png|webp)$/i;
  var gal = CONFIG.galeria.filter(function (g) { return safeImg.test(g.antes) && safeImg.test(g.despues); });
  if (gal.length) {
    var g = $('gallery');
    gal.forEach(function (p) {
      var pair = el('div', { 'class': 'pair' }, [el('img', { src: 'assets/' + p.antes, alt: 'Antes: ' + (p.texto || ''), loading: 'lazy' }), el('img', { src: 'assets/' + p.despues, alt: 'Después: ' + (p.texto || ''), loading: 'lazy' })]);
      g.appendChild(el('figure', null, [pair, el('div', { 'class': 'tag' }, [el('span', { text: 'Antes' }), el('span', { text: 'Después' })]), el('figcaption', { text: p.texto || '' })]));
    });
    $('galeria').hidden = false;
  }
  if (CONFIG.opiniones.length) {
    CONFIG.opiniones.forEach(function (o) { $('quotes').appendChild(el('blockquote', null, [el('p', { text: '“' + o.texto + '”' }), el('footer', { text: o.autor })])); });
    $('opiniones').hidden = false;
  }
  var info = $('contact-info');
  if (CONFIG.direccion) info.appendChild(el('li', { text: 'Dirección: ' + CONFIG.direccion }));
  if (CONFIG.horarios) info.appendChild(el('li', { text: 'Horario: ' + CONFIG.horarios }));
  if (info.children.length) info.hidden = false;
})();
