/* ============================================================
   PINK MENTALY — Motor de avatar (SVG paramétrico, estilo anime)
   Un solo renderizador para: Mi Avatar, la tienda y el diseñador.
   ============================================================ */

var PM_AVATAR_KEY = 'pmAvatar';
var PM_OUT = '#6b2a55'; // color de contorno

/* ---------- utilidades de color ---------- */
function pmHex(h) {
  h = h.replace('#', '');
  if (h.length === 3) h = h.split('').map(function (c) { return c + c; }).join('');
  return [parseInt(h.substr(0, 2), 16), parseInt(h.substr(2, 2), 16), parseInt(h.substr(4, 2), 16)];
}
function pmShade(hex, amt) { // amt -1..1 (oscurece / aclara)
  var c = pmHex(hex);
  var t = amt < 0 ? 0 : 255;
  var p = Math.abs(amt);
  var r = c.map(function (v) { return Math.round((t - v) * p + v); });
  return '#' + r.map(function (v) { return ('0' + v.toString(16)).slice(-2); }).join('');
}

/* ---------- estado por defecto ---------- */
function pmAvatarDefaults() {
  return {
    skin: '#f7d3b5', hair: '#8b3d6b', hairStyle: 'largo', eyes: '#8a5cf0',
    top: { style: 'tirantes', color: '#ffffff', color2: '#ff7ab8', pattern: 'ninguno' },
    bottom: { style: 'short', color: '#b9a6ff', color2: '#ffffff', pattern: 'ninguno' },
    dress: null,
    shoes: { style: 'tenis', color: '#ffffff' },
    earrings: null, bag: null, glasses: null, bow: null, band: null,
    height: 'media', build: 'media'
  };
}
function pmAvatarLoad() {
  var base = pmAvatarDefaults();
  try {
    var raw = localStorage.getItem(PM_AVATAR_KEY);
    if (raw) { var s = JSON.parse(raw); for (var k in s) base[k] = s[k]; }
  } catch (e) {}
  return base;
}
function pmAvatarSave(state) {
  try { localStorage.setItem(PM_AVATAR_KEY, JSON.stringify(state)); } catch (e) {}
}
function pmClone(o) { return JSON.parse(JSON.stringify(o)); }

/* ---------- geometría del cuerpo ---------- */
var PM_PTS = [[198, 33], [214, 38], [240, 38], [262, 33], [292, 27], [316, 33], [340, 40], [352, 42]];
function pmHW(y) {
  var P = PM_PTS;
  if (y <= P[0][0]) return P[0][1];
  for (var i = 1; i < P.length; i++) {
    if (y <= P[i][0]) {
      var t = (y - P[i - 1][0]) / (P[i][0] - P[i - 1][0]);
      return P[i - 1][1] + (P[i][1] - P[i - 1][1]) * t;
    }
  }
  return P[P.length - 1][1];
}
// silueta del torso entre y0 e y1 (con dobladillo curvo opcional y expansión lateral)
function pmBody(y0, y1, o) {
  o = o || {};
  var ex = o.expand || 0, wave = o.wave === undefined ? 5 : o.wave, d = '';
  var step = 4, y;
  for (y = y0; y <= y1; y += step) { d += (y === y0 ? 'M' : 'L') + (150 - pmHW(y) - ex).toFixed(1) + ' ' + y + ' '; }
  var hw = pmHW(y1) + ex;
  d += 'L' + (150 - hw).toFixed(1) + ' ' + y1 + ' ';
  d += 'Q150 ' + (y1 + wave * 2) + ' ' + (150 + hw).toFixed(1) + ' ' + y1 + ' ';
  for (y = y1; y >= y0; y -= step) { d += 'L' + (150 + pmHW(y) + ex).toFixed(1) + ' ' + y + ' '; }
  return d + 'Z';
}
// falda acampanada
function pmSkirt(waistY, hemY, hemHalf, wave) {
  wave = wave === undefined ? 7 : wave;
  var wl = 150 - 28, wr = 150 + 28, h = hemY - waistY;
  return 'M' + wl + ' ' + waistY + ' L' + wr + ' ' + waistY +
    ' C' + (wr + 10) + ' ' + (waistY + h * 0.35) + ' ' + (150 + hemHalf - 4) + ' ' + (hemY - h * 0.25) + ' ' + (150 + hemHalf) + ' ' + hemY +
    ' Q' + (150 + hemHalf / 2) + ' ' + (hemY + wave) + ' 150 ' + hemY +
    ' Q' + (150 - hemHalf / 2) + ' ' + (hemY + wave) + ' ' + (150 - hemHalf) + ' ' + hemY +
    ' C' + (150 - hemHalf + 4) + ' ' + (hemY - h * 0.25) + ' ' + (wl - 10) + ' ' + (waistY + h * 0.35) + ' ' + wl + ' ' + waistY + 'Z';
}

/* ---------- patrones ---------- */
function pmPatternDef(id, type, color, img) {
  var c = color;
  if (type === 'imagen' && img) {
    return '<pattern id="' + id + '" width="90" height="90" patternUnits="userSpaceOnUse"><image href="' + img + '" width="90" height="90" preserveAspectRatio="xMidYMid slice"/></pattern>';
  }
  if (type === 'rayas') return '<pattern id="' + id + '" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(20)"><rect width="5" height="12" fill="' + c + '" opacity="0.85"/></pattern>';
  if (type === 'lunares') return '<pattern id="' + id + '" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="2.6" fill="' + c + '"/><circle cx="12" cy="12" r="2.6" fill="' + c + '"/></pattern>';
  if (type === 'corazones') return '<pattern id="' + id + '" width="20" height="18" patternUnits="userSpaceOnUse"><path d="M10 14 C2 8 3 2 7 2 C9 2 10 4 10 5 C10 4 11 2 13 2 C17 2 18 8 10 14Z" fill="' + c + '"/></pattern>';
  if (type === 'estrellas') return '<pattern id="' + id + '" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M10 2 L12 8 L18 8 L13 12 L15 18 L10 14 L5 18 L7 12 L2 8 L8 8Z" fill="' + c + '"/></pattern>';
  if (type === 'cuadros') return '<pattern id="' + id + '" width="16" height="16" patternUnits="userSpaceOnUse"><rect width="8" height="8" fill="' + c + '" opacity="0.85"/><rect x="8" y="8" width="8" height="8" fill="' + c + '" opacity="0.85"/></pattern>';
  if (type === 'flores') return '<pattern id="' + id + '" width="22" height="22" patternUnits="userSpaceOnUse"><g fill="' + c + '"><circle cx="11" cy="6" r="3"/><circle cx="16" cy="11" r="3"/><circle cx="11" cy="16" r="3"/><circle cx="6" cy="11" r="3"/></g><circle cx="11" cy="11" r="2.4" fill="#ffd166"/></pattern>';
  return '';
}

/* ---------- render principal ---------- */
function pmRenderAvatar(st, opts) {
  opts = opts || {};
  var uid = opts.id || 'av';
  var defs = '', n = 0;
  var skin = st.skin, skinD = pmShade(st.skin, -0.14), skinDD = pmShade(st.skin, -0.3);
  var hair = st.hair, hairD = pmShade(st.hair, -0.42), hairL = pmShade(st.hair, 0.35);
  var O = PM_OUT;

  defs += '<linearGradient id="' + uid + 'sh" x1="0" x2="1" y1="0" y2="0"><stop offset="0" stop-color="#5a1b45" stop-opacity="0"/><stop offset="1" stop-color="#5a1b45" stop-opacity="0.22"/></linearGradient>';
  defs += '<radialGradient id="' + uid + 'ir" cx="0.5" cy="0.35" r="0.75"><stop offset="0" stop-color="' + pmShade(st.eyes, 0.55) + '"/><stop offset="0.55" stop-color="' + st.eyes + '"/><stop offset="1" stop-color="' + pmShade(st.eyes, -0.45) + '"/></radialGradient>';
  defs += '<radialGradient id="' + uid + 'bg" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stop-color="#ffffff" stop-opacity="0.9"/><stop offset="1" stop-color="#ffffff" stop-opacity="0"/></radialGradient>';

  // pinta una forma con color base + patrón + sombreado + contorno
  function paint(d, item, extra) {
    extra = extra || '';
    var s = '<path d="' + d + '" fill="' + item.color + '" stroke="' + O + '" stroke-width="2" stroke-linejoin="round" ' + extra + '/>';
    if (item.pattern && item.pattern !== 'ninguno') {
      var pid = uid + 'p' + (n++);
      defs += pmPatternDef(pid, item.pattern, item.color2 || '#ff7ab8', item.img);
      s += '<path d="' + d + '" fill="url(#' + pid + ')" stroke="none" ' + extra + '/>';
    }
    s += '<path d="' + d + '" fill="url(#' + uid + 'sh)" stroke="none" ' + extra + '/>';
    return s;
  }
  function line(d, color, w, extra) {
    return '<path d="' + d + '" fill="none" stroke="' + color + '" stroke-width="' + w + '" stroke-linecap="round" stroke-linejoin="round" ' + (extra || '') + '/>';
  }

  /* ----- extremidades ----- */
  var ARM_L = 'M116 212 C106 236 100 262 97 290 C95 308 93 322 91 336';
  var ARM_R = 'M184 212 C194 236 200 262 203 290 C205 308 207 322 209 336';
  var THIGH_L = 'M138 336 C137 362 136 380 135 398', THIGH_R = 'M162 336 C163 362 164 380 165 398';
  var CALF_L = 'M135 396 C134 410 133 424 132 438', CALF_R = 'M165 396 C166 410 167 424 168 438';

  var limbsOut = '', limbsFill = '';
  [ARM_L, ARM_R].forEach(function (a) {
    limbsOut += line(a, O, 19.5); limbsFill += line(a, skin, 15.5);
  });
  [THIGH_L, THIGH_R].forEach(function (a) { limbsOut += line(a, O, 28.5); limbsFill += line(a, skin, 24.5); });
  [CALF_L, CALF_R].forEach(function (a) { limbsOut += line(a, O, 21.5); limbsFill += line(a, skin, 17.5); });
  var hands = '<circle cx="90" cy="343" r="9.5" fill="' + skin + '" stroke="' + O + '" stroke-width="2"/><circle cx="210" cy="343" r="9.5" fill="' + skin + '" stroke="' + O + '" stroke-width="2"/>';

  var torsoD = pmBody(198, 338, { wave: 3 });
  var neck = '<rect x="140" y="168" width="20" height="38" rx="6" fill="' + skin + '" stroke="' + O + '" stroke-width="2"/>' +
    '<path d="M140 178 Q150 196 160 178 L160 190 Q150 202 140 190Z" fill="' + skinD + '" opacity="0.55"/>';
  var torsoBase = '<path d="' + torsoD + '" fill="' + skin + '" stroke="' + O + '" stroke-width="2" stroke-linejoin="round"/>';

  /* ----- zapatos ----- */
  function shoes() {
    var sh = st.shoes; if (!sh) return '';
    var c = sh.color, cd = pmShade(c, -0.25), s = '';
    [[132, -1], [168, 1]].forEach(function (f) {
      var x = f[0], dir = f[1];
      if (sh.style === 'tenis') {
        s += '<path d="M' + (x - 15) + ' 434 C' + (x - 15) + ' 424 ' + (x + 10) + ' 424 ' + (x + 13) + ' 434 C' + (x + 22 * dir + 6) + ' 438 ' + (x + 24 * dir) + ' 446 ' + (x + 14) + ' 448 L' + (x - 15) + ' 448Z" fill="' + c + '" stroke="' + O + '" stroke-width="2" stroke-linejoin="round"/>';
        s += '<path d="M' + (x - 16) + ' 446 L' + (x + 24 * dir + (dir > 0 ? 0 : 0)) + ' 446" stroke="' + O + '" stroke-width="0"/>';
        s += '<rect x="' + (x - 17) + '" y="444" width="36" height="6" rx="3" fill="#fff" stroke="' + O + '" stroke-width="2"/>';
        s += line('M' + (x - 6) + ' 432 L' + (x + 4) + ' 436', cd, 2);
      } else if (sh.style === 'tacones') {
        s += '<path d="M' + (x - 8) + ' 448 L' + (x - 8) + ' 458" stroke="' + O + '" stroke-width="5.4" stroke-linecap="round"/><path d="M' + (x - 8) + ' 449 L' + (x - 8) + ' 457" stroke="' + cd + '" stroke-width="2.4" stroke-linecap="round"/>';
        s += '<path d="M' + (x - 15) + ' 438 C' + (x - 15) + ' 428 ' + (x + 11) + ' 428 ' + (x + 14) + ' 438 C' + (x + 20 * dir + 8) + ' 441 ' + (x + 22 * dir) + ' 449 ' + (x + 8) + ' 450 L' + (x - 15) + ' 450Z" fill="' + c + '" stroke="' + O + '" stroke-width="2" stroke-linejoin="round"/>';
        s += '<path d="M' + (x - 10) + ' 436 C' + (x - 4) + ' 441 ' + (x + 4) + ' 441 ' + (x + 10) + ' 436" fill="none" stroke="' + cd + '" stroke-width="2"/>';
      } else if (sh.style === 'botas') {
        s += '<path d="M' + (x - 14) + ' 404 L' + (x + 14) + ' 404 L' + (x + 13) + ' 436 C' + (x + 24 * dir + 8) + ' 438 ' + (x + 26 * dir) + ' 448 ' + (x + 14) + ' 450 L' + (x - 15) + ' 450 L' + (x - 14) + ' 404Z" fill="' + c + '" stroke="' + O + '" stroke-width="2" stroke-linejoin="round"/>';
        s += '<path d="M' + (x - 14) + ' 410 L' + (x + 14) + ' 410" stroke="' + cd + '" stroke-width="2"/><rect x="' + (x - 16) + '" y="446" width="34" height="6" rx="3" fill="' + cd + '" stroke="' + O + '" stroke-width="2"/>';
      } else if (sh.style === 'plataformas') {
        s += '<path d="M' + (x - 15) + ' 430 C' + (x - 15) + ' 422 ' + (x + 10) + ' 422 ' + (x + 13) + ' 430 C' + (x + 22 * dir + 6) + ' 434 ' + (x + 24 * dir) + ' 440 ' + (x + 14) + ' 442 L' + (x - 15) + ' 442Z" fill="' + c + '" stroke="' + O + '" stroke-width="2" stroke-linejoin="round"/>';
        s += '<rect x="' + (x - 17) + '" y="440" width="36" height="12" rx="4" fill="' + cd + '" stroke="' + O + '" stroke-width="2"/>';
      } else { // sandalias
        s += '<path d="M' + (x - 14) + ' 442 C' + (x - 14) + ' 436 ' + (x + 8) + ' 436 ' + (x + 12) + ' 442 C' + (x + 20 * dir + 6) + ' 444 ' + (x + 22 * dir) + ' 450 ' + (x + 12) + ' 450 L' + (x - 14) + ' 450Z" fill="' + skin + '" stroke="' + O + '" stroke-width="2" stroke-linejoin="round"/>';
        s += line('M' + (x - 12) + ' 440 L' + (x + 12) + ' 440', c, 3.4) + line('M' + (x - 8) + ' 430 L' + (x + 2) + ' 442', c, 3);
        s += '<rect x="' + (x - 16) + '" y="448" width="34" height="4" rx="2" fill="' + c + '" stroke="' + O + '" stroke-width="1.6"/>';
      }
    });
    return s;
  }

  /* ----- parte de abajo ----- */
  function bottom() {
    var b = st.bottom; if (!b) return '';
    var s = '', st_ = b.style;
    var legs = function (yEnd, w1, w2) { // pantalón por piernas
      var out = '';
      [[138, 135, 132, -1], [162, 165, 168, 1]].forEach(function (L) {
        var d = 'M' + (L[0] - w1) + ' 330 L' + (L[0] + w1) + ' 330 L' + (L[1] + w2) + ' ' + yEnd + ' L' + (L[1] - w2) + ' ' + yEnd + 'Z';
        out += paint(d, b);
      });
      return out;
    };
    if (st_ === 'short') {
      s += paint(pmBody(300, 366, { expand: 1, wave: 2 }), b);
      s += '<path d="M150 330 L150 366" stroke="' + O + '" stroke-width="1.8"/>';
      s += paint(pmBody(298, 308, { expand: 1.5, wave: 0 }), { color: pmShade(b.color, -0.12), pattern: 'ninguno' });
    } else if (st_ === 'mini') {
      s += paint(pmSkirt(296, 352, 46, 5), b);
    } else if (st_ === 'midi') {
      s += paint(pmSkirt(296, 394, 58, 8), b);
    } else if (st_ === 'larga') {
      s += paint(pmSkirt(296, 436, 70, 9), b);
      s += line('M138 316 L130 432 M150 316 L150 436 M162 316 L170 432', O, 1.2, 'opacity="0.35"');
    } else if (st_ === 'pantalon') {
      s += paint(pmBody(298, 340, { expand: 1, wave: 1 }), b);
      s += legs(436, 15, 12);
      s += paint(pmBody(298, 308, { expand: 1.5, wave: 0 }), { color: pmShade(b.color, -0.12), pattern: 'ninguno' });
    } else if (st_ === 'ancho') {
      s += paint(pmBody(298, 340, { expand: 1, wave: 1 }), b);
      s += legs(440, 17, 22);
      s += paint(pmBody(298, 308, { expand: 1.5, wave: 0 }), { color: pmShade(b.color, -0.12), pattern: 'ninguno' });
    }
    return s;
  }

  /* ----- parte de arriba ----- */
  function sleeve(path, len, w, item) { // manga como tramo del brazo
    return '<g>' + line(path, O, w + 4, 'pathLength="100" stroke-dasharray="' + len + ' 100" stroke-linecap="butt"') +
      line(path, item.color, w, 'pathLength="100" stroke-dasharray="' + len + ' 100" stroke-linecap="butt"') +
      ((item.pattern && item.pattern !== 'ninguno') ? (function () { var pid = uid + 'p' + (n++); defs += pmPatternDef(pid, item.pattern, item.color2 || '#ff7ab8', item.img); return line(path, 'url(#' + pid + ')', w, 'pathLength="100" stroke-dasharray="' + len + ' 100" stroke-linecap="butt"'); })() : '') + '</g>';
  }
  function topSection(t, isDress) {
    var s = '', style = t.style, hem = 322;
    var neckRound = '<path d="M133 197 C136 222 164 222 167 197Z" fill="' + skin + '" stroke="' + O + '" stroke-width="2" stroke-linejoin="round"/>';
    var neckV = '<path d="M133 197 L150 228 L167 197Z" fill="' + skin + '" stroke="' + O + '" stroke-width="2" stroke-linejoin="round"/>';
    if (style === 'tirantes') {
      s += paint(pmBody(222, hem, { wave: 4 }), t);
      s += line('M130 224 L134 198', t.color, 5) + line('M170 224 L166 198', t.color, 5);
      s += '<path d="M126 222 Q150 236 174 222" fill="none" stroke="' + O + '" stroke-width="1.6" opacity="0.5"/>';
    } else if (style === 'crop') {
      s += paint(pmBody(222, 266, { wave: 4 }), t);
      s += line('M130 224 L134 198', t.color, 5) + line('M170 224 L166 198', t.color, 5);
    } else if (style === 'camiseta') {
      s += sleeve(ARM_L, 24, 17.5, t) + sleeve(ARM_R, 24, 17.5, t);
      s += paint(pmBody(200, hem, { wave: 4 }), t) + neckRound;
    } else if (style === 'manga') {
      s += sleeve(ARM_L, 92, 17.5, t) + sleeve(ARM_R, 92, 17.5, t);
      s += paint(pmBody(200, hem, { wave: 4 }), t) + neckV;
    } else if (style === 'chaqueta') {
      s += sleeve(ARM_L, 94, 18.5, t) + sleeve(ARM_R, 94, 18.5, t);
      s += paint(pmBody(200, 330, { wave: 3, expand: 2 }), t);
      s += '<path d="M133 197 L150 262 L167 197Z" fill="' + (t.color2 || '#fff') + '" stroke="' + O + '" stroke-width="2" stroke-linejoin="round"/>';
      s += line('M150 262 L150 330', O, 2) + '<circle cx="150" cy="282" r="2.6" fill="' + O + '"/><circle cx="150" cy="304" r="2.6" fill="' + O + '"/>';
      s += line('M128 200 L140 214 L134 224', O, 1.8, 'opacity="0.6"') + line('M172 200 L160 214 L166 224', O, 1.8, 'opacity="0.6"');
    } else if (style === 'kimono') {
      s += sleeve(ARM_L, 70, 24, t) + sleeve(ARM_R, 70, 24, t);
      s += paint(pmBody(200, 340, { wave: 5, expand: 3 }), t);
      s += '<path d="M133 197 L172 282" stroke="' + O + '" stroke-width="2" fill="none"/><path d="M167 197 L128 282" stroke="' + O + '" stroke-width="2" fill="none"/>';
      s += '<path d="M118 282 L182 282 L182 300 L118 300Z" fill="' + (t.color2 || '#ff7ab8') + '" stroke="' + O + '" stroke-width="2"/>';
    }
    return s;
  }

  /* ----- vestido ----- */
  function dress() {
    var d = st.dress; if (!d) return '';
    var s = '', stl = d.style;
    var hems = { corto: [352, 56], midi: [396, 64], largo: [438, 74], tirantes: [372, 62] };
    var h = hems[stl] || hems.corto;
    if (stl === 'corto' || stl === 'midi' || stl === 'largo') {
      s += sleeve(ARM_L, 20, 17.5, d) + sleeve(ARM_R, 20, 17.5, d);
    }
    s += paint(pmSkirt(290, h[0], h[1], 8), d);
    if (stl === 'tirantes') {
      s += paint(pmBody(224, 296, { wave: 2 }), d);
      s += line('M130 226 L134 198', d.color, 5) + line('M170 226 L166 198', d.color, 5);
    } else {
      s += paint(pmBody(200, 296, { wave: 2 }), d);
      s += '<path d="M133 197 C136 222 164 222 167 197Z" fill="' + skin + '" stroke="' + O + '" stroke-width="2" stroke-linejoin="round"/>';
    }
    // cinta de cintura
    s += '<path d="M123 288 L177 288 L177 298 L123 298Z" fill="' + (d.color2 || '#ff7ab8') + '" stroke="' + O + '" stroke-width="2"/>';
    return s;
  }

  /* ----- cabello ----- */
  function hairBack() {
    var hs = st.hairStyle, s = '';
    var fillH = 'fill="' + hair + '" stroke="' + hairD + '" stroke-width="2.2" stroke-linejoin="round"';
    if (hs === 'largo') {
      s += '<path d="M90 110 C76 170 80 262 94 340 C108 352 128 346 138 330 L162 330 C172 346 192 352 206 340 C220 262 224 170 210 110Z" ' + fillH + '/>';
    } else if (hs === 'corto') {
      s += '<path d="M92 112 C84 150 88 184 104 198 C118 192 124 172 126 150 L174 150 C176 172 182 192 196 198 C212 184 216 150 208 112Z" ' + fillH + '/>';
    } else if (hs === 'coletas') {
      s += '<path d="M96 96 C60 100 44 150 56 206 C60 244 50 282 66 308 C84 286 90 244 92 214 C96 172 102 136 102 104Z" ' + fillH + '/>';
      s += '<path d="M204 96 C240 100 256 150 244 206 C240 244 250 282 234 308 C216 286 210 244 208 214 C204 172 198 136 198 104Z" ' + fillH + '/>';
    } else if (hs === 'mono') {
      s += '<path d="M92 112 C86 140 90 168 104 180 C118 176 124 160 126 146 L174 146 C176 160 182 176 196 180 C210 168 214 140 208 112Z" ' + fillH + '/>';
    } else if (hs === 'ondas') {
      s += '<path d="M90 110 C70 150 86 190 74 236 C68 262 84 288 98 300 C108 282 120 270 126 250 L174 250 C180 270 192 282 202 300 C216 288 232 262 226 236 C214 190 230 150 210 110Z" ' + fillH + '/>';
    }
    return s;
  }
  function hairFront() {
    var hs = st.hairStyle, s = '';
    var fillH = 'fill="' + hair + '" stroke="' + hairD + '" stroke-width="2.2" stroke-linejoin="round"';
    // copa + flequillo
    s += '<path d="M88 126 C76 76 102 40 150 40 C198 40 224 76 212 126 C208 112 204 104 198 98 C194 112 186 124 177 129 C174 114 168 104 160 98 C156 112 150 126 142 132 C138 116 128 108 120 100 C116 114 108 124 100 130 C96 128 92 128 88 126Z" ' + fillH + '/>';
    // mechones laterales
    if (hs !== 'coletas') {
      s += '<path d="M88 126 C82 150 86 172 96 188 C102 170 102 148 100 130Z" ' + fillH + '/>';
      s += '<path d="M212 126 C218 150 214 172 204 188 C198 170 198 148 200 130Z" ' + fillH + '/>';
    }
    if (hs === 'mono') {
      s += '<circle cx="150" cy="30" r="25" ' + fillH + '/>' + '<path d="M132 34 C142 24 158 24 168 34" fill="none" stroke="' + hairL + '" stroke-width="3.5" stroke-linecap="round" opacity="0.7"/>';
      s += '<rect x="136" y="46" width="28" height="8" rx="4" fill="#ff7ab8" stroke="' + O + '" stroke-width="1.8"/>';
    }
    if (hs === 'coletas') {
      s += '<circle cx="98" cy="100" r="9" fill="#ff7ab8" stroke="' + O + '" stroke-width="2"/><circle cx="202" cy="100" r="9" fill="#ff7ab8" stroke="' + O + '" stroke-width="2"/>';
    }
    // brillo "anillo de ángel"
    s += '<path d="M112 66 C130 54 170 54 188 66" fill="none" stroke="' + hairL + '" stroke-width="6" stroke-linecap="round" opacity="0.65"/>';
    s += '<path d="M118 76 C128 70 140 68 148 70" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity="0.5"/>';
    return s;
  }

  /* ----- rostro ----- */
  function eye(cx, mirror) {
    var t = 'translate(' + cx + ' 128)' + (mirror ? ' scale(-1 1)' : '');
    var cid = uid + 'ce' + (mirror ? 'l' : 'r');
    var shape = 'M-18 -2 C-16 -20 16 -22 19 -2 C20 14 10 25 0 25 C-10 25 -19 14 -18 -2Z';
    defs += '<clipPath id="' + cid + '"><path d="' + shape + '"/></clipPath>';
    return '<g transform="' + t + '">' +
      '<path d="' + shape + '" fill="#fff"/>' +
      '<g clip-path="url(#' + cid + ')"><ellipse cx="0" cy="6" rx="14" ry="19" fill="url(#' + uid + 'ir)"/><ellipse cx="0" cy="7" rx="7" ry="10.5" fill="#2a1030"/>' +
      '<path d="M-20 -4 C-12 -12 12 -12 20 -4 L20 -24 L-20 -24Z" fill="#000" opacity="0.18"/></g>' +
      '<ellipse cx="-5" cy="-2" rx="5.4" ry="6.8" fill="#fff"/><circle cx="6" cy="14" r="2.8" fill="#fff" opacity="0.92"/><circle cx="-8" cy="12" r="1.4" fill="#fff" opacity="0.8"/>' +
      '<path d="M-19 -3 C-16 -21 16 -23 20 -3" fill="none" stroke="#3b1535" stroke-width="3.8" stroke-linecap="round"/>' +
      '<path d="M19 -4 L26 -11" stroke="#3b1535" stroke-width="3.2" stroke-linecap="round"/>' +
      '<path d="M-12 -14 C-6 -18 4 -19 10 -16" fill="none" stroke="' + skinDD + '" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>' +
      '</g>';
  }
  function face() {
    var s = '';
    // orejas
    s += '<ellipse cx="94" cy="126" rx="7" ry="11" fill="' + skin + '" stroke="' + O + '" stroke-width="2"/><ellipse cx="206" cy="126" rx="7" ry="11" fill="' + skin + '" stroke="' + O + '" stroke-width="2"/>';
    // cara
    s += '<path d="M95 112 C95 76 118 60 150 60 C182 60 205 76 205 112 C205 142 190 168 170 180 C162 186 138 186 130 180 C110 168 95 142 95 112Z" fill="' + skin + '" stroke="' + O + '" stroke-width="2.2" stroke-linejoin="round"/>';
    // sombra del flequillo en la frente
    s += '<path d="M100 100 C120 94 180 94 200 100 L200 112 C180 104 120 104 100 112Z" fill="' + skinD + '" opacity="0.4"/>';
    // mejillas
    s += '<ellipse cx="111" cy="152" rx="11" ry="6.5" fill="#ff7a9e" opacity="0.5"/><ellipse cx="189" cy="152" rx="11" ry="6.5" fill="#ff7a9e" opacity="0.5"/>';
    s += '<path d="M104 148 l3 5 M110 147 l3 5 M116 147 l3 5" stroke="#ff4f86" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>';
    // ojos
    s += eye(124, true) + eye(176, false);
    // cejas
    s += line('M104 104 Q118 96 138 101', hairD, 3.2) + line('M162 101 Q182 96 196 104', hairD, 3.2);
    // nariz
    s += line('M147 154 Q150 158 153 154', skinDD, 2, 'opacity="0.8"');
    // boca (sonrisa abierta)
    s += '<path d="M139 163 Q150 178 161 163 Q150 167 139 163Z" fill="#d6455f" stroke="#7a1f3a" stroke-width="1.8" stroke-linejoin="round"/>';
    s += '<path d="M143 166 Q150 170 157 166" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity="0.9"/>';
    return s;
  }

  /* ----- accesorios ----- */
  function accessories() {
    var s = '';
    if (st.glasses) {
      var g = st.glasses.color || '#6b2a55';
      if (st.glasses.style === 'gato') {
        s += '<path d="M101 118 C104 112 140 112 146 118 C146 140 140 150 124 150 C108 150 100 140 101 118Z" fill="' + g + '" fill-opacity="0.12" stroke="' + g + '" stroke-width="3.2" stroke-linejoin="round"/>';
        s += '<path d="M199 118 C196 112 160 112 154 118 C154 140 160 150 176 150 C192 150 200 140 199 118Z" fill="' + g + '" fill-opacity="0.12" stroke="' + g + '" stroke-width="3.2" stroke-linejoin="round"/>';
      } else {
        s += '<circle cx="124" cy="132" r="23" fill="' + g + '" fill-opacity="0.1" stroke="' + g + '" stroke-width="3.2"/><circle cx="176" cy="132" r="23" fill="' + g + '" fill-opacity="0.1" stroke="' + g + '" stroke-width="3.2"/>';
      }
      s += line('M147 128 Q150 124 153 128', g, 3.2) + line('M101 124 L92 118', g, 3) + line('M199 124 L208 118', g, 3);
    }
    if (st.earrings) {
      var e = st.earrings.color || '#ffd166', es = st.earrings.style || 'aro';
      [[95, 140], [205, 140]].forEach(function (p) {
        if (es === 'aro') s += '<circle cx="' + p[0] + '" cy="' + (p[1] + 8) + '" r="8" fill="none" stroke="' + e + '" stroke-width="3.4"/><circle cx="' + p[0] + '" cy="' + (p[1] + 8) + '" r="8" fill="none" stroke="' + O + '" stroke-width="0.8"/>';
        else if (es === 'gota') s += '<circle cx="' + p[0] + '" cy="' + (p[1]) + '" r="2.6" fill="' + e + '"/><path d="M' + p[0] + ' ' + (p[1] + 4) + ' C' + (p[0] - 8) + ' ' + (p[1] + 16) + ' ' + (p[0] - 3) + ' ' + (p[1] + 26) + ' ' + p[0] + ' ' + (p[1] + 26) + ' C' + (p[0] + 3) + ' ' + (p[1] + 26) + ' ' + (p[0] + 8) + ' ' + (p[1] + 16) + ' ' + p[0] + ' ' + (p[1] + 4) + 'Z" fill="' + e + '" stroke="' + O + '" stroke-width="1.6"/>';
        else s += '<circle cx="' + p[0] + '" cy="' + (p[1] + 2) + '" r="5.4" fill="' + e + '" stroke="' + O + '" stroke-width="1.6"/><circle cx="' + (p[0] - 1.6) + '" cy="' + (p[1]) + '" r="1.6" fill="#fff" opacity="0.85"/>';
      });
    }
    if (st.bow) {
      var b = st.bow.color || '#ff7ab8';
      s += '<g transform="translate(196 62) rotate(18)"><path d="M0 0 C-22 -20 -26 14 0 0Z" fill="' + b + '" stroke="' + O + '" stroke-width="2" stroke-linejoin="round"/><path d="M0 0 C22 -20 26 14 0 0Z" fill="' + b + '" stroke="' + O + '" stroke-width="2" stroke-linejoin="round"/><circle r="5.5" fill="' + pmShade(b, -0.15) + '" stroke="' + O + '" stroke-width="2"/></g>';
    }
    if (st.band) {
      var h = st.band.color || '#b79bff';
      s += '<path d="M92 112 C86 62 118 40 150 40 C182 40 214 62 208 112" fill="none" stroke="' + O + '" stroke-width="9" stroke-linecap="round"/><path d="M92 112 C86 62 118 40 150 40 C182 40 214 62 208 112" fill="none" stroke="' + h + '" stroke-width="5.6" stroke-linecap="round"/>';
      s += '<circle cx="150" cy="40" r="6" fill="#fff" stroke="' + O + '" stroke-width="2"/>';
    }
    return s;
  }
  function bagFront() {
    if (!st.bag) return '';
    var c = st.bag.color || '#ff7ab8', s = '';
    s += line('M184 204 C170 250 150 300 120 346', O, 7.5) + line('M184 204 C170 250 150 300 120 346', pmShade(c, -0.1), 4.2);
    s += '<rect x="96" y="336" width="48" height="38" rx="9" fill="' + c + '" stroke="' + O + '" stroke-width="2.2"/>' +
      '<path d="M96 350 L144 350" stroke="' + O + '" stroke-width="1.8"/><circle cx="120" cy="352" r="3.4" fill="#ffd166" stroke="' + O + '" stroke-width="1.4"/>' +
      '<rect x="96" y="336" width="48" height="38" rx="9" fill="url(#' + uid + 'sh)"/>';
    return s;
  }

  /* ----- escala de cuerpo (estatura / contextura) ----- */
  var sy = { baja: 0.92, media: 1, alta: 1.07 }[st.height] || 1;
  var sx = { delgada: 0.9, media: 1, robusta: 1.12 }[st.build] || 1;
  var feetY = 452;
  var headShift = (feetY - (feetY - 198) * sy) - 198;
  var bodyT = 'translate(150 ' + feetY + ') scale(' + sx + ' ' + sy + ') translate(-150 -' + feetY + ')';

  var bodyLayers = '';
  bodyLayers += limbsOut + limbsFill + hands;
  bodyLayers += torsoBase;
  bodyLayers += shoes();
  if (st.dress) {
    bodyLayers += dress();
  } else {
    bodyLayers += bottom();
    if (st.top) bodyLayers += topSection(st.top);
  }
  bodyLayers += bagFront();

  var headLayers = neck + face() + hairFront() + accessories();
  var headT = 'translate(150 198) scale(' + (1 + (sy - 1) * 0.5) + ') translate(-150 -198) translate(0 ' + headShift + ')';

  var focus = opts.focus || 'full';
  var vb = { full: '20 4 260 470', head: '70 10 160 200', feet: '70 330 160 135', torso: '60 170 180 200', legs: '70 280 160 180' }[focus] || '20 4 260 470';

  var svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="' + vb + '" class="' + (opts.cls || '') + '" role="img" aria-label="Tu avatar de Pink Mentaly">' +
    '<defs>' + '@@DEFS@@' + '</defs>' +
    (opts.noShadow ? '' : '<ellipse cx="150" cy="454" rx="70" ry="8" fill="#6b2a55" opacity="0.18"/>') +
    '<g class="av-hairback" transform="' + headT + '">' + hairBack() + '</g>' +
    '<g class="av-body" transform="' + bodyT + '">' + bodyLayers + '</g>' +
    '<g class="av-head" transform="' + headT + '">' + headLayers + '</g>' +
    '</svg>';
  return svg.replace('@@DEFS@@', defs);
}
