/* ============================================================
   PINK MENTALY — Carrito de compras (demo front-end)
   Se guarda en localStorage del navegador: funciona de verdad
   una vez el sitio esté publicado en un hosting real.
   ============================================================ */

var CARRITO_KEY = 'pinkMentalyCarrito';

function pmLeerCarrito() {
  try {
    var datos = localStorage.getItem(CARRITO_KEY);
    return datos ? JSON.parse(datos) : [];
  } catch (e) {
    return [];
  }
}

function pmGuardarCarrito(carrito) {
  try {
    localStorage.setItem(CARRITO_KEY, JSON.stringify(carrito));
  } catch (e) { /* almacenamiento no disponible */ }
  pmActualizarBadge();
}

function pmAgregarAlCarrito(producto) {
  var carrito = pmLeerCarrito();
  var existente = carrito.find(function (p) { return p.id === producto.id; });
  if (existente) {
    existente.cantidad += 1;
  } else {
    producto.cantidad = 1;
    carrito.push(producto);
  }
  pmGuardarCarrito(carrito);
  pmMostrarToast('"' + producto.nombre + '" se agregó al carrito ✨');
}

function pmQuitarDelCarrito(id) {
  var carrito = pmLeerCarrito().filter(function (p) { return p.id !== id; });
  pmGuardarCarrito(carrito);
}

function pmCambiarCantidad(id, delta) {
  var carrito = pmLeerCarrito();
  var item = carrito.find(function (p) { return p.id === id; });
  if (!item) return;
  item.cantidad += delta;
  if (item.cantidad < 1) {
    carrito = carrito.filter(function (p) { return p.id !== id; });
  }
  pmGuardarCarrito(carrito);
}

function pmVaciarCarrito() {
  pmGuardarCarrito([]);
}

function pmTotalItems() {
  return pmLeerCarrito().reduce(function (acc, p) { return acc + p.cantidad; }, 0);
}

function pmTotalPrecio() {
  return pmLeerCarrito().reduce(function (acc, p) { return acc + p.cantidad * p.precio; }, 0);
}

function pmFormatoPrecio(valor) {
  return '$' + valor.toLocaleString('es-CO');
}

function pmActualizarBadge() {
  var total = pmTotalItems();
  document.querySelectorAll('.carrito-badge').forEach(function (b) {
    b.textContent = total;
    b.style.display = total > 0 ? 'inline-flex' : 'none';
  });
}

function pmMostrarToast(mensaje) {
  var toast = document.getElementById('toastGlobal');
  if (!toast) return;
  toast.textContent = mensaje;
  toast.classList.add('visible');
  clearTimeout(window._pmToastTimer);
  window._pmToastTimer = setTimeout(function () { toast.classList.remove('visible'); }, 2400);
}

document.addEventListener('DOMContentLoaded', pmActualizarBadge);
