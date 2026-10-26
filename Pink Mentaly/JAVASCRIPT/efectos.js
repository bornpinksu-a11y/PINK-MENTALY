/* ============================================================
   PINK MENTALY — Efectos de movimiento
   ============================================================ */
(function () {
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    /* fondo vivo */
    if (!document.querySelector('.fondo-vivo')) {
      var f = document.createElement('div'); f.className = 'fondo-vivo';
      f.innerHTML = '<div class="mancha m1"></div><div class="mancha m2"></div><div class="mancha m3"></div>';
      document.body.insertBefore(f, document.body.firstChild);
    }
    var glow = document.createElement('div'); glow.className = 'brillo-cursor'; document.body.appendChild(glow);

    /* brillo que sigue al cursor */
    if (!reduce) {
      var gx = 0, gy = 0, tx = 0, ty = 0;
      document.addEventListener('mousemove', function (e) { tx = e.clientX; ty = e.clientY; glow.style.opacity = 1; });
      (function loop() { gx += (tx - gx) * 0.12; gy += (ty - gy) * 0.12; glow.style.left = gx + 'px'; glow.style.top = gy + 'px'; requestAnimationFrame(loop); })();
    }

    /* destellos que suben */
    if (!reduce) {
      var simbolos = ['✦', '♥', '✧', '✿', '✨', '♡'];
      setInterval(function () {
        if (document.hidden) return;
        var d = document.createElement('div'); d.className = 'destello';
        d.textContent = simbolos[Math.floor(Math.random() * simbolos.length)];
        d.style.left = (Math.random() * 100) + 'vw'; d.style.bottom = '-20px';
        d.style.fontSize = (10 + Math.random() * 16) + 'px';
        d.style.color = ['#ff5fa8', '#c58bff', '#7fe3cf', '#ffb89c'][Math.floor(Math.random() * 4)];
        d.style.animationDuration = (8 + Math.random() * 8) + 's';
        document.body.appendChild(d); setTimeout(function () { d.remove(); }, 17000);
      }, 1100);
    }

    /* entrada por scroll */
    var rev = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }); }, { threshold: 0.12 });
      rev.forEach(function (r) { io.observe(r); });
      window.pmObservar = function (el) { io.observe(el); };
    } else { rev.forEach(function (r) { r.classList.add('visible'); }); window.pmObservar = function (el) { el.classList.add('visible'); }; }

    /* ondas en botones */
    document.addEventListener('click', function (e) {
      var b = e.target.closest('.boton, .boton-grad, .sidebar-destacado'); if (!b) return;
      var r = b.getBoundingClientRect(), s = Math.max(r.width, r.height);
      var o = document.createElement('span'); o.className = 'ripple';
      o.style.width = o.style.height = s + 'px'; o.style.left = (e.clientX - r.left - s / 2) + 'px'; o.style.top = (e.clientY - r.top - s / 2) + 'px';
      b.appendChild(o); setTimeout(function () { o.remove(); }, 650);
    });

    /* inclinación 3D */
    if (!reduce) {
      document.addEventListener('mousemove', function (e) {
        var t = e.target.closest && e.target.closest('.tilt'); if (!t) return;
        var r = t.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        t.style.transform = 'perspective(800px) rotateY(' + (x * 8) + 'deg) rotateX(' + (-y * 8) + 'deg) translateY(-4px)';
      });
      document.addEventListener('mouseout', function (e) { var t = e.target.closest && e.target.closest('.tilt'); if (t && !t.contains(e.relatedTarget)) t.style.transform = ''; });
    }

    /* menú móvil */
    var sb = document.querySelector('.sidebar');
    if (sb) {
      var tg = document.createElement('button'); tg.className = 'menu-toggle'; tg.setAttribute('aria-label', 'Abrir menú'); tg.textContent = '☰';
      document.body.appendChild(tg);
      tg.addEventListener('click', function () { var o = sb.classList.toggle('abierto'); document.body.classList.toggle('menu-abierto', o); tg.textContent = o ? '✕' : '☰'; });
      sb.addEventListener('click', function (e) { if (e.target.closest('a')) { sb.classList.remove('abierto'); document.body.classList.remove('menu-abierto'); } });
    }

    /* año del footer */
    document.querySelectorAll('.anio-actual').forEach(function (a) { a.textContent = new Date().getFullYear(); });
  });
})();
