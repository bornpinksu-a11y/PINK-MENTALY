/* ============================================================
   PINK MENTALY — Carrito, favoritos y avisos (demo front-end)
   Datos guardados en el navegador (localStorage).
   ============================================================ */
var PM_CARRITO_KEY = 'pinkMentalyCarrito';
var PM_FAVS_KEY = 'pmFavoritos';

function pmLeer(key, def) { try { var d = localStorage.getItem(key); return d ? JSON.parse(d) : def; } catch (e) { return def; } }
function pmEscribir(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

function pmLeerCarrito() { return pmLeer(PM_CARRITO_KEY, []); }
function pmGuardarCarrito(c) { pmEscribir(PM_CARRITO_KEY, c); pmActualizarBadge(); }
function pmAgregarAlCarrito(prod) {
  var c = pmLeerCarrito();
  var ex = c.filter(function (p) { return p.id === prod.id; })[0];
  if (ex) ex.cantidad += 1; else { prod.cantidad = 1; c.push(prod); }
  pmGuardarCarrito(c);
  pmToast('«' + prod.nombre + '» se agregó al carrito 🛍️');
}
function pmQuitarDelCarrito(id) { pmGuardarCarrito(pmLeerCarrito().filter(function (p) { return p.id !== id; })); }
function pmCambiarCantidad(id, delta) {
  var c = pmLeerCarrito(), it = c.filter(function (p) { return p.id === id; })[0];
  if (!it) return; it.cantidad += delta;
  if (it.cantidad < 1) c = c.filter(function (p) { return p.id !== id; });
  pmGuardarCarrito(c);
}
function pmVaciarCarrito() { pmGuardarCarrito([]); }
function pmTotalItems() { return pmLeerCarrito().reduce(function (a, p) { return a + p.cantidad; }, 0); }
function pmTotalPrecio() { return pmLeerCarrito().reduce(function (a, p) { return a + p.cantidad * p.precio; }, 0); }
function pmPrecio(v) { return '$' + Math.round(v).toLocaleString('es-CO'); }

function pmActualizarBadge() {
  var t = pmTotalItems();
  document.querySelectorAll('.carrito-badge').forEach(function (b) { b.textContent = t; b.style.display = t > 0 ? 'inline-flex' : 'none'; });
}

/* favoritos */
function pmFavs() { return pmLeer(PM_FAVS_KEY, []); }
function pmEsFav(id) { return pmFavs().indexOf(id) !== -1; }
function pmToggleFav(id) {
  var f = pmFavs(), i = f.indexOf(id);
  if (i === -1) { f.push(id); pmToast('Guardado en favoritos 💗'); } else { f.splice(i, 1); pmToast('Quitado de favoritos'); }
  pmEscribir(PM_FAVS_KEY, f);
  return i === -1;
}

/* avisos */
function pmToast(msg) {
  var t = document.getElementById('toastGlobal');
  if (!t) { t = document.createElement('div'); t.id = 'toastGlobal'; t.className = 'toast'; document.body.appendChild(t); }
  t.textContent = msg; t.classList.add('visible');
  clearTimeout(window._pmT); window._pmT = setTimeout(function () { t.classList.remove('visible'); }, 2500);
}
document.addEventListener('DOMContentLoaded', pmActualizarBadge);
