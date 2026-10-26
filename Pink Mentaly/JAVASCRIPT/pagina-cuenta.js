/* Mi cuenta */
document.addEventListener('DOMContentLoaded', function () {
  var cont = document.getElementById('cuentaContenido'), s = pmSesion();
  if (!s) {
    cont.innerHTML = '<div class="estado-vacio"><div class="grande">💗</div><h2 class="seccion-titulo">Entra a tu espacio</h2><p class="seccion-sub" style="margin-bottom:24px">Inicia sesión para ver tu clóset, tus favoritos y tus pedidos.</p><a class="boton-grad boton" href="login.html?next=cuenta.html">Iniciar sesión</a> <a class="boton" href="login.html#registro">Crear cuenta</a></div>';
    return;
  }
  var base = pmAvatarLoad(), tabActual = 'resumen';
  function fecha(iso) { return new Date(iso).toLocaleDateString('es-CO', { day: 'numeric', month: 'long', year: 'numeric' }); }

  function vistas() {
    var closet = pmCloset(), favs = pmFavs(), pedidos = pmPedidos();
    if (tabActual === 'resumen') {
      return '<div class="stats"><div class="stat"><b>' + pedidos.length + '</b><span>Pedidos</span></div><div class="stat"><b>' + closet.length + '</b><span>Diseños en mi clóset</span></div><div class="stat"><b>' + favs.length + '</b><span>Favoritos</span></div><div class="stat"><b>' + pmTotalItems() + '</b><span>En el carrito</span></div></div>' +
        '<div class="bloques"><a class="bloque" href="avatar.html" style="text-decoration:none"><div class="icono">✦</div><h3>Seguir con mi avatar</h3><p>Cambia su estilo y ropa.</p></a><a class="bloque" href="ropa.html" style="text-decoration:none"><div class="icono">🎨</div><h3>Diseñar una prenda</h3><p>Crea algo que nadie más tiene.</p></a><a class="bloque" href="camisas.html" style="text-decoration:none"><div class="icono">🛍️</div><h3>Ver la colección</h3><p>Novedades para tu look.</p></a></div>';
    }
    if (tabActual === 'closet') {
      return closet.length ? '<div class="galeria">' + closet.map(function (d, i) { return '<div class="look-card"><div class="vista">' + pmRenderAvatar(pmAplicarItem(base, d.tipo, d.item), { id: 'cc' + i, focus: d.tipo === 'dress' ? 'full' : d.tipo === 'top' ? 'torso' : 'legs', noShadow: true }) + '</div><h4>' + d.nombre + '</h4><p style="margin:0;color:var(--rose-d);font-weight:700">' + pmPrecio(d.precio) + '</p></div>'; }).join('') + '</div><p style="text-align:center;margin-top:20px"><a class="boton" href="ropa.html">Editar en el diseñador</a></p>'
        : '<p class="vacio">Aún no has guardado diseños. <a href="ropa.html" style="color:var(--rose-d)">Crea el primero →</a></p>';
    }
    if (tabActual === 'favoritos') {
      var lista = favs.map(pmProducto).filter(Boolean);
      return lista.length ? '<div class="galeria">' + lista.map(function (p, i) { return '<a class="look-card" href="' + p.cat + '.html" style="text-decoration:none;color:inherit"><div class="vista">' + pmRenderAvatar(pmAplicarItem(base, p.slot, p.item), { id: 'cf' + i, focus: pmFocusDeSlot(p.slot), noShadow: true }) + '</div><h4>' + p.nombre + '</h4><p style="margin:0;color:var(--rose-d);font-weight:700">' + pmPrecio(p.precio) + '</p></a>'; }).join('') + '</div>'
        : '<p class="vacio">Toca el corazón ♡ en cualquier prenda y aparecerá aquí.</p>';
    }
    if (tabActual === 'pedidos') {
      return pedidos.length ? pedidos.map(function (p) { return '<div class="pedido"><h4>Pedido ' + p.id + ' · ' + pmPrecio(p.total) + '</h4><p>' + fecha(p.fecha) + ' · ' + p.items.reduce(function (a, i) { return a + i.cantidad; }, 0) + ' artículos · ' + (p.extra.metodo || '') + '</p><p style="color:var(--ink-faint)">' + p.items.map(function (i) { return i.nombre + ' ×' + i.cantidad; }).join(', ') + '</p></div>'; }).join('')
        : '<p class="vacio">Todavía no tienes pedidos. ¡Estrena tu primer look! 🛍️</p>';
    }
    return '<form id="formPerfil" class="formulario" style="max-width:420px"><div class="campo"><label>Nombre</label><input id="pfNombre" value="' + s.nombre + '"></div><div class="campo"><label>Correo</label><input value="' + s.email + '" disabled></div>' +
      '<div style="display:flex;gap:10px;flex-wrap:wrap"><button class="boton-grad boton" type="submit">Guardar cambios</button><button class="boton" type="button" id="btnSalir">Cerrar sesión</button></div></form>';
  }
  function pintar() {
    cont.innerHTML = '<div class="cuenta-cab cristal"><div class="vista">' + pmRenderAvatar(base, { id: 'cab', focus: 'full', noShadow: true }) + '</div><div><h2>Hola, ' + s.nombre.split(' ')[0] + ' 💗</h2><p>' + s.email + '</p></div></div>' +
      '<div class="cuenta-contenido"><div class="pestanas">' + [['resumen', 'Resumen'], ['closet', 'Mi clóset'], ['favoritos', 'Favoritos'], ['pedidos', 'Pedidos'], ['perfil', 'Perfil']].map(function (t) { return '<button class="pestana' + (tabActual === t[0] ? ' activo' : '') + '" data-tab="' + t[0] + '">' + t[1] + '</button>'; }).join('') + '</div><div id="cuerpoCuenta">' + vistas() + '</div></div>';
  }
  cont.addEventListener('click', function (e) {
    var t = e.target.closest('.pestana'); if (t) { tabActual = t.dataset.tab; pintar(); return; }
    if (e.target.closest('#btnSalir')) { pmSalir(); location.href = 'public.html'; }
  });
  cont.addEventListener('submit', function (e) { if (e.target.id === 'formPerfil') { e.preventDefault(); var n = document.getElementById('pfNombre').value.trim(); if (n.length > 1) { pmActualizarNombre(n); s.nombre = n; pmRenderChip(); pmToast('Perfil actualizado ✨'); pintar(); } } });
  pintar();
});
