/* Inicio: hero con avatar, categorías y destacados */
document.addEventListener('DOMContentLoaded', function () {
  var base = pmAvatarLoad();
  var hero = document.getElementById('heroAvatar'); if (hero) hero.innerHTML = pmRenderAvatar(base, { id: 'hero' });

  var cats = document.getElementById('categorias');
  if (cats) {
    var rep = { camisas: 'camisas-5', faldas: 'faldas-2', pantalones: 'pantalones-4', vestidos: 'vestidos-3', zapatos: 'zapatos-4', aretes: 'aretes-4', accesorios: 'accesorios-5' };
    cats.innerHTML = Object.keys(PM_CATEGORIAS).map(function (k, i) {
      var p = pmProducto(rep[k]), m = PM_CATEGORIAS[k], n = PM_CATALOGO.filter(function (x) { return x.cat === k; }).length;
      return '<a class="cat-card reveal d' + (i % 4) + '" href="' + k + '.html"><div class="miniatura">' + pmRenderAvatar(pmAplicarItem(base, p.slot, p.item), { id: 'c' + i, focus: pmFocusDeSlot(p.slot), noShadow: true }) + '</div><h3>' + m.titulo + '</h3><p>' + n + ' piezas</p></a>';
    }).join('');
    cats.querySelectorAll('.reveal').forEach(function (r) { if (window.pmObservar) pmObservar(r); else r.classList.add('visible'); });
  }

  var dest = document.getElementById('destacados');
  if (dest) {
    var ids = ['vestidos-3', 'camisas-12', 'zapatos-4', 'accesorios-5', 'faldas-9'];
    dest.innerHTML = ids.map(pmProducto).map(function (p, i) {
      return '<a class="producto-card reveal d' + (i % 4) + '" href="' + p.cat + '.html" style="text-decoration:none;color:inherit"><div class="producto-img">' + pmRenderAvatar(pmAplicarItem(base, p.slot, p.item), { id: 'd' + i, focus: pmFocusDeSlot(p.slot), noShadow: true }) + '</div><div class="producto-info"><h3 class="producto-nombre">' + p.nombre + '</h3><p class="producto-precio">' + pmPrecio(p.precio) + '</p></div></a>';
    }).join('');
    dest.querySelectorAll('.reveal').forEach(function (r) { if (window.pmObservar) pmObservar(r); else r.classList.add('visible'); });
  }
});
