/* Diseñador de ropa: crea tu prenda, dibuja tu estampado y guárdala en tu clóset */
document.addEventListener('DOMContentLoaded', function () {
  var avatarBase = pmAvatarLoad();
  var ESTILOS = {
    top: [['tirantes', 'Top de tirantes'], ['crop', 'Crop top'], ['camiseta', 'Camiseta'], ['manga', 'Blusa manga larga'], ['chaqueta', 'Chaqueta'], ['kimono', 'Kimono']],
    bottom: [['short', 'Short'], ['mini', 'Mini falda'], ['midi', 'Falda midi'], ['larga', 'Falda larga'], ['pantalon', 'Pantalón'], ['ancho', 'Palazzo']],
    dress: [['corto', 'Corto'], ['midi', 'Midi'], ['largo', 'Largo'], ['tirantes', 'De tirantes']]
  };
  var BASE = { top: 69000, bottom: 79000, dress: 129000 };
  var ROPA = ['#ffffff', '#ff9ccb', '#ff7ab8', '#c9a6ff', '#7fe3cf', '#ffb89c', '#8ecbff', '#ffd166', '#3a2a48'];
  var dis = { tipo: 'top', style: 'camiseta', color: '#ff9ccb', color2: '#ffffff', pattern: 'ninguno', img: null, nombre: 'Mi primera prenda' };

  var $ = function (id) { return document.getElementById(id); };
  function swHTML(id, key) {
    return ROPA.map(function (c) { return '<button class="swatch" data-key="' + key + '" data-val="' + c + '" style="background:' + c + '"></button>'; }).join('') + '<input type="color" data-key-input="' + key + '" value="#ff9ccb" aria-label="Color personalizado">';
  }
  $('swColor').innerHTML = swHTML('c', 'color'); $('swColor2').innerHTML = swHTML('c2', 'color2');

  function item() { return { style: dis.style, color: dis.color, color2: dis.color2, pattern: dis.pattern, img: dis.img }; }
  function precio() { return BASE[dis.tipo] + (dis.pattern === 'imagen' ? 20000 : dis.pattern !== 'ninguno' ? 10000 : 0); }
  function llenarEstilos() {
    $('selEstilo').innerHTML = ESTILOS[dis.tipo].map(function (e) { return '<option value="' + e[0] + '">' + e[1] + '</option>'; }).join('');
    $('selEstilo').value = dis.style;
  }
  function pintar() {
    var st = pmAplicarItem(avatarBase, dis.tipo, item());
    $('vistaDiseno').innerHTML = pmRenderAvatar(st, { id: 'dis' });
    $('precioDiseno').textContent = pmPrecio(precio());
    document.querySelectorAll('.swatch[data-key]').forEach(function (b) { b.classList.toggle('activo', dis[b.dataset.key].toLowerCase() === b.dataset.val.toLowerCase()); });
    $('selTipo').value = dis.tipo; $('selPatron').value = dis.pattern;
    $('avisoImg').style.display = dis.pattern === 'imagen' ? 'block' : 'none';
  }
  llenarEstilos(); pintar();

  $('selTipo').addEventListener('change', function () { dis.tipo = this.value; dis.style = ESTILOS[dis.tipo][0][0]; llenarEstilos(); pintar(); });
  $('selEstilo').addEventListener('change', function () { dis.style = this.value; pintar(); });
  $('selPatron').addEventListener('change', function () {
    if (this.value === 'imagen' && !dis.img) { pmToast('Primero dibuja tu estampado abajo y toca «Usar mi dibujo» ✏️'); this.value = dis.pattern; return; }
    dis.pattern = this.value; pintar();
  });
  $('nombreDiseno').addEventListener('input', function () { dis.nombre = this.value || 'Mi prenda'; });
  document.querySelector('.diseno-controles').addEventListener('click', function (e) { var s = e.target.closest('.swatch[data-key]'); if (s) { dis[s.dataset.key] = s.dataset.val; pintar(); } });
  document.querySelector('.diseno-controles').addEventListener('input', function (e) { var c = e.target.closest('input[data-key-input]'); if (c) { dis[c.dataset.keyInput] = c.value; pintar(); } });

  function disenoGuardable() { return { id: 'mi-' + Date.now().toString(36), nombre: dis.nombre, tipo: dis.tipo, item: item(), precio: precio() }; }
  $('btnPoner').addEventListener('click', function () { avatarBase = pmAplicarItem(avatarBase, dis.tipo, item()); pmAvatarSave(avatarBase); pmToast('¡Tu avatar estrenó tu diseño! 💖'); });
  $('btnCloset').addEventListener('click', function () { pmGuardarEnCloset(disenoGuardable()); pmToast('Guardado en tu clóset ✨'); pintarCloset(); });
  $('btnCarrito').addEventListener('click', function () { var d = disenoGuardable(); pmAgregarAlCarrito({ id: d.id, nombre: d.nombre + ' (diseño propio)', precio: d.precio, slot: d.tipo, item: d.item }); });

  /* ---------- lienzo de dibujo ---------- */
  var cv = $('lienzo'), cx = cv.getContext('2d'), fondo = '#ffffff';
  function limpiar() { cx.fillStyle = fondo; cx.fillRect(0, 0, cv.width, cv.height); }
  limpiar(); cx.lineCap = 'round'; cx.lineJoin = 'round';
  var dibujando = false, borrador = false, sello = null, grosores = { fino: 4, medio: 10, grueso: 20, extra: 36 };
  function pos(e) { var r = cv.getBoundingClientRect(), t = e.touches && e.touches[0] ? e.touches[0] : e; return { x: (t.clientX - r.left) * cv.width / r.width, y: (t.clientY - r.top) * cv.height / r.height }; }
  function ini(e) {
    var p = pos(e);
    if (sello) { cx.font = (grosores[$('selGrosor').value] * 3 + 24) + 'px serif'; cx.textAlign = 'center'; cx.textBaseline = 'middle'; cx.fillStyle = $('colorPincel').value; cx.fillText(sello, p.x, p.y); e.preventDefault(); return; }
    dibujando = true; cx.beginPath(); cx.moveTo(p.x, p.y); cx.lineTo(p.x + 0.1, p.y); cx.strokeStyle = borrador ? fondo : $('colorPincel').value; cx.lineWidth = grosores[$('selGrosor').value]; cx.stroke(); e.preventDefault();
  }
  function mov(e) { if (!dibujando) return; var p = pos(e); cx.strokeStyle = borrador ? fondo : $('colorPincel').value; cx.lineWidth = grosores[$('selGrosor').value]; cx.lineTo(p.x, p.y); cx.stroke(); e.preventDefault(); }
  function fin() { dibujando = false; }
  cv.addEventListener('mousedown', ini); cv.addEventListener('mousemove', mov); window.addEventListener('mouseup', fin);
  cv.addEventListener('touchstart', ini, { passive: false }); cv.addEventListener('touchmove', mov, { passive: false }); cv.addEventListener('touchend', fin);

  var pincelColores = ['#ff5fa8', '#c58bff', '#7fe3cf', '#ffb89c', '#ffd166', '#3a2a48', '#ffffff'];
  $('paletaPincel').innerHTML = pincelColores.map(function (c) { return '<button class="swatch" data-pincel="' + c + '" style="background:' + c + '"></button>'; }).join('');
  $('paletaPincel').addEventListener('click', function (e) { var b = e.target.closest('[data-pincel]'); if (b) { $('colorPincel').value = b.dataset.pincel; borrador = false; $('btnBorrador').classList.remove('activo'); } });
  $('btnBorrador').addEventListener('click', function () { borrador = !borrador; sello = null; this.classList.toggle('activo', borrador); document.querySelectorAll('.sello').forEach(function (s) { s.classList.remove('activo'); }); });
  document.querySelectorAll('.sello').forEach(function (b) {
    b.addEventListener('click', function () {
      var on = !b.classList.contains('activo'); document.querySelectorAll('.sello').forEach(function (s) { s.classList.remove('activo'); });
      sello = on ? b.textContent : null; b.classList.toggle('activo', on); if (on) { borrador = false; $('btnBorrador').classList.remove('activo'); }
    });
  });
  $('colorFondo').addEventListener('input', function () { fondo = this.value; limpiar(); });
  $('btnLimpiar').addEventListener('click', limpiar);
  $('btnDescargarDibujo').addEventListener('click', function () { var a = document.createElement('a'); a.download = 'mi-estampado-pink-mentaly.png'; a.href = cv.toDataURL('image/png'); a.click(); });
  $('btnUsarDibujo').addEventListener('click', function () {
    var t = document.createElement('canvas'); t.width = t.height = 140; t.getContext('2d').drawImage(cv, 0, 0, 140, 140);
    dis.img = t.toDataURL('image/png'); dis.pattern = 'imagen'; pintar(); pmToast('¡Tu dibujo ahora es el estampado! 🎨');
    $('vistaDiseno').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  /* ---------- clóset ---------- */
  function pintarCloset() {
    var lista = pmCloset(), g = $('galeriaCloset');
    if (!lista.length) { g.innerHTML = '<p class="vacio">Tu clóset está vacío. Diseña una prenda y toca «Guardar en mi clóset» ✨</p>'; return; }
    g.innerHTML = lista.map(function (d, i) {
      var st = pmAplicarItem(avatarBase, d.tipo, d.item);
      return '<div class="look-card"><div class="vista">' + pmRenderAvatar(st, { id: 'cl' + i, focus: d.tipo === 'dress' ? 'full' : d.tipo === 'top' ? 'torso' : 'legs', noShadow: true }) + '</div><h4>' + d.nombre + '</h4><p style="margin:0 0 8px;color:var(--rose-d);font-weight:700">' + pmPrecio(d.precio) + '</p>' +
        '<div class="fila"><button class="boton mini" data-usar="' + d.id + '">Editar</button><button class="boton mini" data-comprar="' + d.id + '">Carrito</button><button class="link-quitar" data-borrar="' + d.id + '">Borrar</button></div></div>';
    }).join('');
  }
  $('galeriaCloset').addEventListener('click', function (e) {
    var id, d, lista = pmCloset();
    if ((id = (e.target.closest('[data-borrar]') || {}).dataset)) { pmQuitarDeCloset(id.borrar); pintarCloset(); return; }
    if ((id = (e.target.closest('[data-comprar]') || {}).dataset)) { d = lista.filter(function (x) { return x.id === id.comprar; })[0]; pmAgregarAlCarrito({ id: d.id, nombre: d.nombre + ' (diseño propio)', precio: d.precio, slot: d.tipo, item: d.item }); return; }
    if ((id = (e.target.closest('[data-usar]') || {}).dataset)) {
      d = lista.filter(function (x) { return x.id === id.usar; })[0]; dis = { tipo: d.tipo, style: d.item.style, color: d.item.color, color2: d.item.color2, pattern: d.item.pattern, img: d.item.img || null, nombre: d.nombre };
      $('nombreDiseno').value = d.nombre; llenarEstilos(); pintar(); window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });
  pintarCloset();
});
