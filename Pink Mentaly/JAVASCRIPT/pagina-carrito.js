/* Carrito + checkout (demo) */
document.addEventListener('DOMContentLoaded', function () {
  var cont = document.getElementById('contenidoCarrito'), base = pmAvatarLoad();

  function thumb(p, i) { return pmRenderAvatar(pmAplicarItem(base, p.slot, p.item), { id: 'ct' + i, focus: pmFocusDeSlot(p.slot), noShadow: true }); }

  function render() {
    var c = pmLeerCarrito();
    if (!c.length) {
      cont.innerHTML = '<div class="estado-vacio"><div class="grande">🛍️</div><h2 class="seccion-titulo">Tu carrito está vacío</h2><p class="seccion-sub" style="margin-bottom:24px">Explora la colección y agrega lo que más te guste.</p><a class="boton-grad boton" href="camisas.html">Ir a la tienda</a></div>';
      return;
    }
    var html = '<div class="carrito-layout"><div class="carrito-lista">' + c.map(function (p, i) {
      return '<div class="carrito-item"><div class="mini">' + thumb(p, i) + '</div><div class="carrito-info"><h4>' + p.nombre + '</h4><p>' + pmPrecio(p.precio) + ' c/u</p><button class="link-quitar" data-quitar="' + p.id + '">Quitar</button></div>' +
        '<div class="cantidad"><button data-id="' + p.id + '" data-d="-1" aria-label="Menos">−</button><b>' + p.cantidad + '</b><button data-id="' + p.id + '" data-d="1" aria-label="Más">+</button></div></div>';
    }).join('') + '</div><aside class="resumen cristal"><h3>Resumen</h3><div class="fila-precio"><span>Subtotal</span><span>' + pmPrecio(pmTotalPrecio()) + '</span></div>' +
      '<div class="fila-precio"><span>Entrega digital</span><span>Gratis</span></div><div class="fila-precio total"><span>Total</span><span>' + pmPrecio(pmTotalPrecio()) + '</span></div>' +
      '<div id="zonaPago"><button class="boton-grad boton" id="btnPagar" style="width:100%;margin-top:14px">Finalizar compra</button><button class="boton" id="btnVaciar" style="width:100%;margin-top:10px">Vaciar carrito</button></div></aside></div>';
    cont.innerHTML = html;
  }

  cont.addEventListener('click', function (e) {
    var b;
    if ((b = e.target.closest('[data-d]'))) { pmCambiarCantidad(b.dataset.id, parseInt(b.dataset.d, 10)); render(); return; }
    if ((b = e.target.closest('[data-quitar]'))) { pmQuitarDelCarrito(b.dataset.quitar); render(); return; }
    if (e.target.closest('#btnVaciar')) { pmVaciarCarrito(); render(); return; }
    if (e.target.closest('#btnPagar')) {
      var s = pmSesion();
      if (!s) { pmToast('Inicia sesión para finalizar tu compra 💗'); setTimeout(function () { location.href = 'login.html?next=carrito.html'; }, 900); return; }
      document.getElementById('zonaPago').innerHTML =
        '<form id="formPago" class="formulario" style="margin-top:14px"><div class="campo"><label>Nombre</label><input id="pNombre" value="' + s.nombre + '" required></div>' +
        '<div class="campo"><label>Correo</label><input id="pCorreo" type="email" value="' + s.email + '" required></div>' +
        '<div class="campo"><label>Método de pago (demo)</label><select id="pMetodo"><option>Tarjeta de crédito/débito</option><option>Nequi</option><option>PSE</option></select></div>' +
        '<button class="boton-grad boton" type="submit">Confirmar pedido</button><p style="font-size:.74rem;color:var(--ink-faint);margin:0">Demostración: no se realiza ningún cobro real.</p></form>';
      return;
    }
  });
  cont.addEventListener('submit', function (e) {
    if (e.target.id !== 'formPago') return; e.preventDefault();
    var items = pmLeerCarrito(), total = pmTotalPrecio();
    var ped = pmGuardarPedido(items, total, { metodo: document.getElementById('pMetodo').value });
    pmVaciarCarrito();
    cont.innerHTML = '<div class="pedido-ok cristal"><div class="check">✓</div><h2 class="seccion-titulo">¡Gracias por tu compra!</h2><p style="color:var(--ink-dim)">Tu pedido <b>' + ped.id + '</b> por ' + pmPrecio(total) + ' quedó registrado.</p>' +
      '<p style="color:var(--ink-faint);font-size:.85rem">Esto es una demostración: aún no está conectado a una pasarela de pago real.</p><div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;margin-top:18px"><a class="boton-grad boton" href="avatar.html">Vestir mi avatar</a><a class="boton" href="cuenta.html">Ver mis pedidos</a></div></div>';
  });
  render();
});
