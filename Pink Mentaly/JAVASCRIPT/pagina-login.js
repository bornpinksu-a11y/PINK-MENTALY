/* Inicio de sesión y registro (demo) */
document.addEventListener('DOMContentLoaded', function () {
  var $ = function (id) { return document.getElementById(id); };
  var next = new URLSearchParams(location.search).get('next') || 'cuenta.html';
  if (!/^[a-z0-9\-]+\.html$/i.test(next)) next = 'cuenta.html';
  if (pmSesion()) { location.replace(next); return; }

  function tab(nombre) {
    document.querySelectorAll('.auth-form .pestana').forEach(function (b) { b.classList.toggle('activo', b.dataset.tab === nombre); });
    document.querySelectorAll('.panel-auth').forEach(function (p) { p.classList.toggle('activo', p.dataset.panel === nombre); });
  }
  document.querySelectorAll('.auth-form .pestana').forEach(function (b) { b.addEventListener('click', function () { tab(b.dataset.tab); }); });
  if (location.hash === '#registro') tab('registro');
  document.querySelectorAll('[data-ir]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); tab(a.dataset.ir); }); });

  document.querySelectorAll('.ver-pw').forEach(function (b) { b.addEventListener('click', function () { var i = b.parentElement.querySelector('input'); i.type = i.type === 'password' ? 'text' : 'password'; b.textContent = i.type === 'password' ? '👁️' : '🙈'; }); });

  function msg(id, tipo, txt) { var m = $(id); m.className = 'msg ' + tipo; m.textContent = txt; }
  function err(id, txt) { $(id).textContent = txt; }

  $('formLogin').addEventListener('submit', function (e) {
    e.preventDefault(); err('eLEmail', ''); err('eLPw', ''); $('msgLogin').className = 'msg';
    var em = $('lEmail').value, pw = $('lPw').value, bad = false;
    if (!pmEmailValido(em)) { err('eLEmail', 'Escribe un correo válido'); bad = true; }
    if (pw.length < 1) { err('eLPw', 'Escribe tu contraseña'); bad = true; }
    if (bad) return;
    pmIngresar(em, pw).then(function (r) {
      if (!r.ok) { msg('msgLogin', 'err', r.error); return; }
      msg('msgLogin', 'ok', '¡Bienvenida de vuelta! Entrando…'); setTimeout(function () { location.href = next; }, 700);
    });
  });

  function fuerza(pw) { var s = 0; if (pw.length >= 8) s++; if (/[A-Z]/.test(pw)) s++; if (/[0-9]/.test(pw)) s++; if (/[^A-Za-z0-9]/.test(pw)) s++; return s; }
  $('rPw').addEventListener('input', function () {
    var f = fuerza(this.value), barra = $('barraFuerza'); barra.style.width = (f * 25) + '%';
    barra.style.background = ['#ff9ccb', '#ff9ccb', '#ffd166', '#7fe3cf', '#2fbf9b'][f]; $('txtFuerza').textContent = this.value ? ['Muy débil', 'Débil', 'Aceptable', 'Buena', 'Excelente'][f] : '';
  });
  $('formRegistro').addEventListener('submit', function (e) {
    e.preventDefault(); ['eRNombre', 'eREmail', 'eRPw', 'eRPw2'].forEach(function (i) { err(i, ''); }); $('msgRegistro').className = 'msg';
    var n = $('rNombre').value.trim(), em = $('rEmail').value, pw = $('rPw').value, pw2 = $('rPw2').value, bad = false;
    if (n.length < 2) { err('eRNombre', 'Cuéntanos tu nombre'); bad = true; }
    if (!pmEmailValido(em)) { err('eREmail', 'Escribe un correo válido'); bad = true; }
    if (pw.length < 8) { err('eRPw', 'Mínimo 8 caracteres'); bad = true; }
    if (pw !== pw2) { err('eRPw2', 'Las contraseñas no coinciden'); bad = true; }
    if (!$('rTerminos').checked) { msg('msgRegistro', 'err', 'Acepta los términos para continuar.'); bad = true; }
    if (bad) return;
    pmRegistrar(n, em, pw).then(function (r) {
      if (!r.ok) { msg('msgRegistro', 'err', r.error); return; }
      msg('msgRegistro', 'ok', '¡Cuenta creada! Te estamos llevando a tu espacio…'); setTimeout(function () { location.href = next === 'cuenta.html' ? 'avatar.html' : next; }, 900);
    });
  });
});
