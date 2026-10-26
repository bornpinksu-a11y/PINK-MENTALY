/* ============================================================
   PINK MENTALY — Cuentas de usuario (DEMO en el navegador)
   Sin servidor: las cuentas viven en este navegador. Las contraseñas
   se guardan como hash SHA-256 (no en texto plano), pero para un
   sitio real necesitas un backend con autenticación segura.
   ============================================================ */
var PM_USERS_KEY = 'pmUsuarios', PM_SESION_KEY = 'pmSesion', PM_PEDIDOS_KEY = 'pmPedidos', PM_CLOSET_KEY = 'pmCloset';

function pmSha(texto) {
  if (window.crypto && crypto.subtle) {
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode('pinkmentaly::' + texto)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }
  return Promise.resolve(btoa(unescape(encodeURIComponent('pm::' + texto))));
}
function pmSesion() { return pmLeer(PM_SESION_KEY, null); }
function pmEmailValido(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(e); }

function pmRegistrar(nombre, email, pw) {
  email = email.trim().toLowerCase();
  var users = pmLeer(PM_USERS_KEY, {});
  if (users[email]) return Promise.resolve({ ok: false, error: 'Ya existe una cuenta con ese correo. ¡Inicia sesión!' });
  return pmSha(pw).then(function (h) {
    users[email] = { nombre: nombre.trim(), hash: h, creado: Date.now() };
    pmEscribir(PM_USERS_KEY, users);
    pmEscribir(PM_SESION_KEY, { email: email, nombre: nombre.trim() });
    return { ok: true };
  });
}
function pmIngresar(email, pw) {
  email = email.trim().toLowerCase();
  var users = pmLeer(PM_USERS_KEY, {}), u = users[email];
  if (!u) return Promise.resolve({ ok: false, error: 'No encontramos una cuenta con ese correo.' });
  return pmSha(pw).then(function (h) {
    if (h !== u.hash) return { ok: false, error: 'La contraseña no es correcta.' };
    pmEscribir(PM_SESION_KEY, { email: email, nombre: u.nombre });
    return { ok: true };
  });
}
function pmSalir() { try { localStorage.removeItem(PM_SESION_KEY); } catch (e) {} }
function pmActualizarNombre(nombre) {
  var s = pmSesion(); if (!s) return; var users = pmLeer(PM_USERS_KEY, {});
  if (users[s.email]) { users[s.email].nombre = nombre; pmEscribir(PM_USERS_KEY, users); }
  s.nombre = nombre; pmEscribir(PM_SESION_KEY, s);
}

/* pedidos y clóset */
function pmPedidos() { var s = pmSesion(); return s ? pmLeer(PM_PEDIDOS_KEY, []).filter(function (p) { return p.email === s.email; }) : []; }
function pmGuardarPedido(items, total, extra) {
  var all = pmLeer(PM_PEDIDOS_KEY, []), s = pmSesion();
  var ped = { id: 'PM-' + Date.now().toString(36).toUpperCase(), email: s ? s.email : 'invitada', fecha: new Date().toISOString(), items: items, total: total, extra: extra || {} };
  all.unshift(ped); pmEscribir(PM_PEDIDOS_KEY, all); return ped;
}
function pmCloset() { return pmLeer(PM_CLOSET_KEY, []); }
function pmGuardarEnCloset(diseno) { var c = pmCloset(); c.unshift(diseno); pmEscribir(PM_CLOSET_KEY, c); }
function pmQuitarDeCloset(id) { pmEscribir(PM_CLOSET_KEY, pmCloset().filter(function (d) { return d.id !== id; })); }

/* chip de cuenta en el menú lateral */
function pmRenderChip() {
  var cont = document.getElementById('cuentaChip'); if (!cont) return;
  var s = pmSesion();
  if (s) {
    cont.innerHTML = '<a class="cuenta-chip" href="cuenta.html"><span class="inicial">' + s.nombre.charAt(0).toUpperCase() + '</span><span><small>Hola de nuevo</small><strong>' + s.nombre.split(' ')[0] + '</strong></span></a>';
  } else {
    cont.innerHTML = '<a class="cuenta-chip" href="login.html"><span class="inicial">♡</span><span><small>¿Primera vez?</small><strong>Inicia sesión</strong></span></a>';
  }
}
document.addEventListener('DOMContentLoaded', pmRenderChip);
