/* Tienda: vitrina con avatar puesto, filtros, buscador, favoritos y vista previa flotante */
document.addEventListener('DOMContentLoaded', function () {
  var cat = document.body.dataset.cat, meta = PM_CATEGORIAS[cat];
  var prods = PM_CATALOGO.filter(function (p) { return p.cat === cat; });
  var base = pmAvatarLoad(), vit = document.getElementById('vitrina');
  var filtroEstilo = 'todos', texto = '', seleccion = null;

  /* chips de filtro */
  var estilos = []; prods.forEach(function (p) { if (estilos.indexOf(p.estilo) === -1) estilos.push(p.estilo); });
  var fCont = document.getElementById('filtros');
  if (fCont && estilos.length > 1) {
    fCont.innerHTML = '<button class="filtro activo" data-e="todos">Todos</button>' + estilos.map(function (e) { return '<button class="filtro" data-e="' + e + '">' + PM_ESTILOS[e] + '</button>'; }).join('');
    fCont.addEventListener('click', function (ev) {
      var b = ev.target.closest('.filtro'); if (!b) return;
      fCont.querySelectorAll('.filtro').forEach(function (x) { x.classList.remove('activo'); }); b.classList.add('activo');
      filtroEstilo = b.dataset.e; pintar();
    });
  }
  document.getElementById('buscador').addEventListener('input', function (e) { texto = e.target.value.trim().toLowerCase(); pintar(); });

  function pintar() {
    var lista = prods.filter(function (p) { return (filtroEstilo === 'todos' || p.estilo === filtroEstilo) && p.nombre.toLowerCase().indexOf(texto) !== -1; });
    if (!lista.length) { vit.innerHTML = '<p class="vacio-busqueda">No encontramos nada con esa búsqueda 🔍</p>'; return; }
    vit.innerHTML = lista.map(function (p, i) {
      var st = pmAplicarItem(base, p.slot, p.item);
      return '<article class="producto-card reveal visible' + (seleccion && seleccion.id === p.id ? ' activo' : '') + '" data-id="' + p.id + '">' +
        '<button class="fav' + (pmEsFav(p.id) ? ' on' : '') + '" data-fav="' + p.id + '" aria-label="Favorito">' + (pmEsFav(p.id) ? '♥' : '♡') + '</button>' +
        '<div class="producto-img">' + pmRenderAvatar(st, { id: 'v' + i, focus: pmFocusDeSlot(p.slot), noShadow: true }) + '</div>' +
        '<div class="producto-info"><h3 class="producto-nombre">' + p.nombre + '</h3><p class="producto-precio">' + pmPrecio(p.precio) + '</p>' +
        '<div class="producto-acciones"><button data-probar="' + p.id + '">Probar</button><button class="prim" data-add="' + p.id + '">Agregar</button></div></div></article>';
    }).join('');
  }

  /* vista previa flotante */
  var prev = document.createElement('div'); prev.className = 'previa-flotante'; prev.style.display = 'none'; document.body.appendChild(prev);
  function mostrarPrev(p) {
    seleccion = p; var st = pmAplicarItem(base, p.slot, p.item);
    prev.style.display = 'block';
    prev.innerHTML = '<button class="cerrar" aria-label="Cerrar">×</button><div class="vista">' + pmRenderAvatar(st, { id: 'pv', focus: 'full' }) + '</div>' +
      '<p><b>' + p.nombre + '</b><br>' + pmPrecio(p.precio) + '</p><button class="boton-grad boton mini" data-poner="1">Ponérmelo ✨</button>';
    document.querySelectorAll('.producto-card').forEach(function (c) { c.classList.toggle('activo', c.dataset.id === p.id); });
  }
  prev.addEventListener('click', function (e) {
    if (e.target.closest('.cerrar')) { prev.style.display = 'none'; return; }
    if (e.target.closest('[data-poner]') && seleccion) {
      base = pmAplicarItem(base, seleccion.slot, seleccion.item); pmAvatarSave(base);
      pmToast('¡Listo! Tu avatar ahora lleva «' + seleccion.nombre + '» 💖'); pintar();
      prev.innerHTML += ''; mostrarPrev(seleccion);
    }
  });

  vit.addEventListener('click', function (e) {
    var fav = e.target.closest('[data-fav]');
    if (fav) { e.stopPropagation(); var on = pmToggleFav(fav.dataset.fav); fav.classList.toggle('on', on); fav.textContent = on ? '♥' : '♡'; return; }
    var add = e.target.closest('[data-add]');
    if (add) { e.stopPropagation(); var p = pmProducto(add.dataset.add); pmAgregarAlCarrito({ id: p.id, nombre: p.nombre, precio: p.precio, slot: p.slot, item: p.item }); return; }
    var card = e.target.closest('.producto-card'); if (card) mostrarPrev(pmProducto(card.dataset.id));
  });
  pintar();
});
