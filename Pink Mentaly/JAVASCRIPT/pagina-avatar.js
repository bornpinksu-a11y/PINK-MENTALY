/* Mi Avatar: panel de personalización con pestañas */
document.addEventListener('DOMContentLoaded', function () {
  var est = pmAvatarLoad();
  var vista = document.getElementById('vistaAvatar');

  var PIEL = ['#fde3d0', '#f7d3b5', '#e5b48a', '#c98f64', '#9a6444', '#6b4330'];
  var CAB = ['#3a2030', '#6b3a2a', '#8b3d6b', '#d9a066', '#ffd166', '#ff9ccb', '#c9a6ff', '#7fe3cf', '#8ecbff', '#f4f4f4'];
  var OJOS = ['#8a5cf0', '#3b7de0', '#2fbf9b', '#a0522d', '#e0368a', '#444444'];
  var ROPA = ['#ffffff', '#ff9ccb', '#ff7ab8', '#c9a6ff', '#7fe3cf', '#ffb89c', '#8ecbff', '#ffd166', '#3a2a48'];
  var PATRONES = [['ninguno', 'Liso'], ['rayas', 'Rayas'], ['lunares', 'Lunares'], ['corazones', 'Corazones'], ['estrellas', 'Estrellas'], ['cuadros', 'Cuadros'], ['flores', 'Flores']];
  var DEFAULTS = {
    top: { style: 'tirantes', color: '#ffffff', color2: '#ff7ab8', pattern: 'ninguno' }, bottom: { style: 'short', color: '#b9a6ff', color2: '#ffffff', pattern: 'ninguno' },
    dress: { style: 'corto', color: '#ff9ccb', color2: '#ffffff', pattern: 'ninguno' }, shoes: { style: 'tenis', color: '#ffffff' },
    earrings: { style: 'aro', color: '#ffd166' }, bag: { color: '#ff7ab8' }, glasses: { style: 'redondas', color: '#ff5fa8' }, bow: { color: '#ff7ab8' }, band: { color: '#c9a6ff' }
  };

  function sw(path, colores, extra) {
    return '<div class="swatches" data-path="' + path + '">' + colores.map(function (c) { return '<button class="swatch" data-val="' + c + '" style="background:' + c + '" aria-label="' + c + '"></button>'; }).join('') +
      '<input type="color" data-color-path="' + path + '" value="' + colores[0] + '" aria-label="Color personalizado"></div>';
  }
  function opts(path, lista) { return '<div class="opciones" data-path="' + path + '">' + lista.map(function (o) { return '<button class="opcion" data-val="' + o[0] + '">' + o[1] + '</button>'; }).join('') + '</div>'; }
  function sel(path, lista) { return '<select data-sel="' + path + '">' + lista.map(function (o) { return '<option value="' + o[0] + '">' + o[1] + '</option>'; }).join('') + '</select>'; }
  function grupo(t, html) { return '<div class="control-grupo"><h3>' + t + '</h3>' + html + '</div>'; }

  function prendaCtl(slot, titulo, estilos, conPatron) {
    return '<div class="cristal" style="padding:18px;box-shadow:none;border-radius:20px;display:flex;flex-direction:column;gap:14px"><h3 style="margin:0;font-family:var(--font-display);font-style:italic;font-weight:500">' + titulo + '</h3>' +
      grupo('Estilo', sel(slot + '.style', [['', 'Ninguno']].concat(estilos))) +
      '<div data-detalle="' + slot + '" style="display:flex;flex-direction:column;gap:14px">' + grupo('Color', sw(slot + '.color', ROPA)) +
      (conPatron ? grupo('Patrón', sel(slot + '.pattern', PATRONES)) + grupo('Color del patrón / detalles', sw(slot + '.color2', ROPA)) : '') + '</div></div>';
  }

  var panels = {
    cuerpo: grupo('Tono de piel', sw('skin', PIEL)) + grupo('Color de ojos', sw('eyes', OJOS)) +
      '<div class="fila-2">' + grupo('Estatura', sel('height', [['baja', 'Baja'], ['media', 'Media'], ['alta', 'Alta']])) + grupo('Contextura', sel('build', [['delgada', 'Delgada'], ['media', 'Media'], ['robusta', 'Robusta']])) + '</div>',
    cabello: grupo('Estilo de cabello', opts('hairStyle', [['largo', 'Largo'], ['corto', 'Bob'], ['coletas', 'Coletas'], ['mono', 'Moño'], ['ondas', 'Ondas']])) + grupo('Color de cabello', sw('hair', CAB)),
    ropa: prendaCtl('top', 'Parte de arriba', [['tirantes', 'Top de tirantes'], ['crop', 'Crop top'], ['camiseta', 'Camiseta'], ['manga', 'Blusa manga larga'], ['chaqueta', 'Chaqueta'], ['kimono', 'Kimono']], true) +
      prendaCtl('bottom', 'Parte de abajo', [['short', 'Short'], ['mini', 'Mini falda'], ['midi', 'Falda midi'], ['larga', 'Falda larga'], ['pantalon', 'Pantalón'], ['ancho', 'Palazzo']], true) +
      prendaCtl('dress', 'Vestido (reemplaza arriba y abajo)', [['corto', 'Corto'], ['midi', 'Midi'], ['largo', 'Largo'], ['tirantes', 'De tirantes']], true),
    calzado: grupo('Estilo', sel('shoes.style', [['', 'Descalza'], ['tenis', 'Tenis'], ['tacones', 'Tacones'], ['botas', 'Botas'], ['plataformas', 'Plataformas'], ['sandalias', 'Sandalias']])) + grupo('Color', sw('shoes.color', ROPA)),
    extras: grupo('Aretes', sel('earrings.style', [['', 'Ninguno'], ['aro', 'Aros'], ['gota', 'Gotas'], ['perla', 'Perlas']]) + '<div style="height:10px"></div>' + sw('earrings.color', ROPA.concat(['#ffd166']))) +
      grupo('Gafas', sel('glasses.style', [['', 'Ninguna'], ['redondas', 'Redondas'], ['gato', 'Ojo de gato']]) + '<div style="height:10px"></div>' + sw('glasses.color', ['#ff5fa8', '#3a2a48', '#9a6dff', '#7fe3cf'])) +
      grupo('Bolso', sel('bag.style', [['', 'Ninguno'], ['si', 'Bolso cruzado']]) + '<div style="height:10px"></div>' + sw('bag.color', ROPA)) +
      grupo('Lazo', sel('bow.style', [['', 'Ninguno'], ['si', 'Lazo']]) + '<div style="height:10px"></div>' + sw('bow.color', ROPA)) +
      grupo('Diadema', sel('band.style', [['', 'Ninguna'], ['si', 'Diadema']]) + '<div style="height:10px"></div>' + sw('band.color', ROPA))
  };
  var nombres = { cuerpo: 'Cuerpo', cabello: 'Cabello', ropa: 'Ropa', calzado: 'Calzado', extras: 'Extras' };
  var tabsHTML = '<div class="pestanas">' + Object.keys(nombres).map(function (k, i) { return '<button class="pestana' + (i === 0 ? ' activo' : '') + '" data-tab="' + k + '">' + nombres[k] + '</button>'; }).join('') + '</div>';
  var panelsHTML = Object.keys(panels).map(function (k, i) { return '<div class="pestana-panel' + (i === 0 ? ' activo' : '') + '" data-panel="' + k + '">' + panels[k] + '</div>'; }).join('');
  var cont = document.getElementById('controles'); cont.innerHTML = tabsHTML + panelsHTML;

  /* acceso a rutas "a.b" */
  function getP(path) { return path.split('.').reduce(function (o, k) { return o == null ? null : o[k]; }, est); }
  function setP(path, val) {
    var ks = path.split('.');
    if (ks.length === 1) { est[ks[0]] = val; return; }
    var slot = ks[0], prop = ks[1];
    if (prop === 'style' && (slot === 'bag' || slot === 'bow' || slot === 'band')) { est[slot] = val ? (est[slot] || JSON.parse(JSON.stringify(DEFAULTS[slot]))) : null; return; }
    if (prop === 'style' && val === '') { est[slot] = null; return; }
    if (!est[slot]) est[slot] = JSON.parse(JSON.stringify(DEFAULTS[slot]));
    est[slot][prop] = val;
    if (slot === 'dress' && est.dress) { /* un vestido reemplaza arriba/abajo visualmente */ }
    if ((slot === 'top' || slot === 'bottom') && est.dress && prop === 'style') est.dress = null;
  }

  function sync() {
    cont.querySelectorAll('.swatches[data-path]').forEach(function (g) {
      var v = getP(g.dataset.path); g.querySelectorAll('.swatch').forEach(function (b) { b.classList.toggle('activo', b.dataset.val.toLowerCase() === String(v).toLowerCase()); });
      var ci = g.querySelector('input[type=color]'); if (ci && v) { try { ci.value = v; } catch (e) {} }
    });
    cont.querySelectorAll('.opciones[data-path]').forEach(function (g) { var v = getP(g.dataset.path); g.querySelectorAll('.opcion').forEach(function (b) { b.classList.toggle('activo', b.dataset.val === v); }); });
    cont.querySelectorAll('select[data-sel]').forEach(function (s) {
      var p = s.dataset.sel, ks = p.split('.'), v = getP(p);
      if (ks.length === 2 && (ks[0] === 'bag' || ks[0] === 'bow' || ks[0] === 'band')) v = est[ks[0]] ? 'si' : '';
      s.value = v == null ? '' : v;
    });
    ['top', 'bottom', 'dress'].forEach(function (s) { var d = cont.querySelector('[data-detalle="' + s + '"]'); if (d) d.style.display = est[s] ? 'flex' : 'none'; });
    vista.innerHTML = pmRenderAvatar(est, { id: 'main' });
    pmAvatarSave(est);
  }

  cont.addEventListener('click', function (e) {
    var t = e.target.closest('.pestana');
    if (t) { cont.querySelectorAll('.pestana').forEach(function (x) { x.classList.toggle('activo', x === t); }); cont.querySelectorAll('.pestana-panel').forEach(function (p) { p.classList.toggle('activo', p.dataset.panel === t.dataset.tab); }); return; }
    var s = e.target.closest('.swatch'); if (s) { setP(s.parentElement.dataset.path, s.dataset.val); sync(); return; }
    var o = e.target.closest('.opcion'); if (o) { setP(o.parentElement.dataset.path, o.dataset.val); sync(); }
  });
  cont.addEventListener('input', function (e) { var c = e.target.closest('input[type=color]'); if (c) { setP(c.dataset.colorPath, c.value); sync(); } });
  cont.addEventListener('change', function (e) { var s = e.target.closest('select[data-sel]'); if (s) { setP(s.dataset.sel, s.value); sync(); } });

  /* acciones */
  function rnd(a) { return a[Math.floor(Math.random() * a.length)]; }
  document.getElementById('btnAleatorio').addEventListener('click', function () {
    est.skin = rnd(PIEL); est.hair = rnd(CAB); est.eyes = rnd(OJOS); est.hairStyle = rnd(['largo', 'corto', 'coletas', 'mono', 'ondas']);
    var tipoVestido = Math.random() < 0.35;
    est.dress = tipoVestido ? { style: rnd(['corto', 'midi', 'largo', 'tirantes']), color: rnd(ROPA), color2: rnd(ROPA), pattern: rnd(PATRONES)[0] } : null;
    est.top = { style: rnd(['tirantes', 'crop', 'camiseta', 'manga', 'chaqueta', 'kimono']), color: rnd(ROPA), color2: rnd(ROPA), pattern: rnd(PATRONES)[0] };
    est.bottom = { style: rnd(['short', 'mini', 'midi', 'larga', 'pantalon', 'ancho']), color: rnd(ROPA), color2: rnd(ROPA), pattern: rnd(PATRONES)[0] };
    est.shoes = { style: rnd(['tenis', 'tacones', 'botas', 'plataformas', 'sandalias']), color: rnd(ROPA) };
    est.earrings = Math.random() < 0.6 ? { style: rnd(['aro', 'gota', 'perla']), color: rnd(ROPA) } : null;
    est.bow = Math.random() < 0.3 ? { color: rnd(ROPA) } : null; est.band = Math.random() < 0.25 ? { color: rnd(ROPA) } : null;
    est.bag = Math.random() < 0.3 ? { color: rnd(ROPA) } : null; est.glasses = Math.random() < 0.25 ? { style: rnd(['redondas', 'gato']), color: rnd(['#ff5fa8', '#3a2a48', '#9a6dff']) } : null;
    sync(); pmToast('¡Look sorpresa! 🎲');
  });
  document.getElementById('btnReset').addEventListener('click', function () { est = pmAvatarDefaults(); sync(); pmToast('Avatar restablecido'); });
  document.getElementById('btnGuardar').addEventListener('click', function () { pmAvatarSave(est); pmToast('Tu avatar quedó guardado en este navegador 💖'); });
  document.getElementById('btnDescargar').addEventListener('click', function () {
    var svg = pmRenderAvatar(est, { id: 'dl' }).replace('<svg ', '<svg width="780" height="1410" ');
    var img = new Image(), url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
    img.onload = function () {
      var c = document.createElement('canvas'); c.width = 780; c.height = 1410; var x = c.getContext('2d');
      var g = x.createLinearGradient(0, 0, 0, 1410); g.addColorStop(0, '#fff2f8'); g.addColorStop(1, '#ffd0e6'); x.fillStyle = g; x.fillRect(0, 0, 780, 1410);
      x.drawImage(img, 0, 0); URL.revokeObjectURL(url);
      var a = document.createElement('a'); a.download = 'mi-avatar-pink-mentaly.png'; a.href = c.toDataURL('image/png'); a.click();
    };
    img.src = url;
  });
  sync();
});
