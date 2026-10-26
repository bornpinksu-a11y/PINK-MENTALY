/* ============================================================
   PINK MENTALY — Catálogo de productos (edita aquí tus prendas)
   Formato: [nombre, precio, estilo, color, color2, patrón]
   ============================================================ */

var PM_CATEGORIAS = {
  camisas:    { titulo: 'Camisas',    slot: 'top',    focus: 'torso', desc: 'Tops, blusas, chaquetas y kimonos para tu avatar.' },
  faldas:     { titulo: 'Faldas',     slot: 'bottom', focus: 'legs',  desc: 'Minis, midis y largas con mucho movimiento.' },
  pantalones: { titulo: 'Pantalones', slot: 'bottom', focus: 'legs',  desc: 'Shorts, jeans y palazzos para todos los días.' },
  vestidos:   { titulo: 'Vestidos',   slot: 'dress',  focus: 'full',  desc: 'Un solo look, mil ocasiones.' },
  zapatos:    { titulo: 'Zapatos',    slot: 'shoes',  focus: 'feet',  desc: 'Tenis, tacones, botas y más.' },
  aretes:     { titulo: 'Aretes',     slot: 'earrings', focus: 'head', desc: 'Pequeños detalles que brillan.' },
  accesorios: { titulo: 'Accesorios', slot: 'mix',    focus: 'full',  desc: 'Bolsos, gafas, lazos y diademas.' }
};

var PM_ESTILOS = {
  tirantes: 'Tirantes', crop: 'Crop top', camiseta: 'Camiseta', manga: 'Manga larga', chaqueta: 'Chaqueta', kimono: 'Kimono',
  mini: 'Mini', midi: 'Midi', larga: 'Larga', short: 'Shorts', pantalon: 'Pantalón', ancho: 'Palazzo',
  corto: 'Corto', largo: 'Largo', tenis: 'Tenis', tacones: 'Tacones', botas: 'Botas', plataformas: 'Plataformas', sandalias: 'Sandalias',
  aro: 'Aros', gota: 'Gotas', perla: 'Perlas',
  bag: 'Bolsos', glasses: 'Gafas', bow: 'Lazos', band: 'Diademas'
};

(function () {
  var P = '#ff7ab8', L = '#c9a6ff', M = '#7fe3cf', D = '#ffb89c', W = '#ffffff', K = '#3a2a48', G = '#ffd166', S = '#8ecbff';
  var raw = {
    camisas: [
      ['Top Tirantes Blanco', 59000, 'tirantes', W, P, 'ninguno'], ['Top Tirantes Rosa Chicle', 59000, 'tirantes', '#ff9ccb', W, 'ninguno'],
      ['Crop Top Lila Estrellas', 65000, 'crop', L, W, 'estrellas'], ['Crop Top Menta', 62000, 'crop', M, W, 'ninguno'],
      ['Camiseta Corazones', 72000, 'camiseta', W, '#ff5fa8', 'corazones'], ['Camiseta Rayas Cielo', 69000, 'camiseta', W, S, 'rayas'],
      ['Camiseta Negra Básica', 64000, 'camiseta', K, W, 'ninguno'], ['Blusa Flores Rosa', 89000, 'manga', '#fff1f7', P, 'flores'],
      ['Blusa Durazno Manga Larga', 84000, 'manga', D, W, 'ninguno'], ['Chaqueta Menta', 129000, 'chaqueta', M, W, 'ninguno'],
      ['Chaqueta Cuadros Rosa', 139000, 'chaqueta', '#ffb3d6', '#ff5fa8', 'cuadros'], ['Kimono Digital Rosa', 119000, 'kimono', P, W, 'estrellas'],
      ['Kimono Lila Lunares', 115000, 'kimono', L, W, 'lunares']
    ],
    faldas: [
      ['Mini Falda Lila', 69000, 'mini', L, W, 'ninguno'], ['Mini Falda Rosa Lunares', 72000, 'mini', P, W, 'lunares'],
      ['Mini Falda Cuadros', 75000, 'mini', '#ffd9ea', '#ff5fa8', 'cuadros'], ['Mini Falda Negra', 65000, 'mini', K, W, 'ninguno'],
      ['Falda Midi Menta', 89000, 'midi', M, W, 'ninguno'], ['Midi Floral', 95000, 'midi', '#fff1f7', P, 'flores'],
      ['Midi Rayas Durazno', 92000, 'midi', D, W, 'rayas'], ['Falda Larga Blanca', 109000, 'larga', W, L, 'ninguno'],
      ['Falda Larga Estrellas', 115000, 'larga', L, W, 'estrellas'], ['Falda Larga Rosa', 105000, 'larga', P, W, 'ninguno']
    ],
    pantalones: [
      ['Short Denim Lila', 59000, 'short', L, W, 'ninguno'], ['Short Rosa Pastel', 55000, 'short', '#ff9ccb', W, 'ninguno'],
      ['Short Cuadros', 62000, 'short', W, P, 'cuadros'], ['Jean Cielo', 99000, 'pantalon', S, W, 'ninguno'],
      ['Pantalón Negro', 95000, 'pantalon', K, W, 'ninguno'], ['Pantalón Cuadros Lila', 105000, 'pantalon', '#e8dcff', L, 'cuadros'],
      ['Palazzo Menta', 109000, 'ancho', M, W, 'ninguno'], ['Palazzo Blanco', 105000, 'ancho', W, L, 'ninguno'],
      ['Palazzo Rayas Rosa', 112000, 'ancho', W, P, 'rayas']
    ],
    vestidos: [
      ['Vestido Corto Corazones', 129000, 'corto', '#ffd9ea', '#ff5fa8', 'corazones'], ['Vestido Corto Menta', 119000, 'corto', M, W, 'ninguno'],
      ['Vestido Midi Floral Lila', 149000, 'midi', '#e8dcff', P, 'flores'], ['Vestido Midi Lunares', 145000, 'midi', P, W, 'lunares'],
      ['Vestido Largo Rosa', 169000, 'largo', '#ff9ccb', W, 'ninguno'], ['Vestido Largo Estrellas', 179000, 'largo', L, W, 'estrellas'],
      ['Vestido Tirantes Durazno', 135000, 'tirantes', D, W, 'ninguno'], ['Vestido Tirantes Blanco', 139000, 'tirantes', W, P, 'ninguno'],
      ['Vestido Tirantes Rayas', 142000, 'tirantes', W, S, 'rayas']
    ],
    zapatos: [
      ['Tenis Blancos', 119000, 'tenis', W], ['Tenis Rosa', 125000, 'tenis', P], ['Tenis Menta', 125000, 'tenis', M],
      ['Tacones Rosa', 139000, 'tacones', '#ff4f86'], ['Tacones Negros', 135000, 'tacones', K], ['Botas Lila', 159000, 'botas', L],
      ['Botas Negras', 165000, 'botas', K], ['Plataformas Rosa', 149000, 'plataformas', P], ['Plataformas Blancas', 149000, 'plataformas', W],
      ['Sandalias Doradas', 99000, 'sandalias', G], ['Sandalias Menta', 95000, 'sandalias', M]
    ],
    aretes: [
      ['Aros Dorados', 35000, 'aro', G], ['Aros Rosa', 32000, 'aro', P], ['Aros Menta', 32000, 'aro', M],
      ['Gotas Lila', 39000, 'gota', L], ['Gotas Rosa', 39000, 'gota', P], ['Perlas Blancas', 42000, 'perla', W],
      ['Perlas Rosa', 42000, 'perla', '#ffb3d6'], ['Perlas Menta', 42000, 'perla', M]
    ],
    accesorios: [
      ['Bolso Rosa', 89000, 'bag', P], ['Bolso Lila', 89000, 'bag', L], ['Bolso Dorado', 95000, 'bag', G], ['Bolso Menta', 89000, 'bag', M],
      ['Gafas Redondas Rosa', 69000, 'glasses', '#ff5fa8', 'redondas'], ['Gafas Gato Negras', 72000, 'glasses', K, 'gato'], ['Gafas Gato Lila', 72000, 'glasses', '#9a6dff', 'gato'],
      ['Lazo Rosa', 29000, 'bow', P], ['Lazo Lila', 29000, 'bow', L], ['Diadema Lila', 45000, 'band', L], ['Diadema Menta', 45000, 'band', M], ['Diadema Rosa', 45000, 'band', P]
    ]
  };

  var slotDe = { bag: 'bag', glasses: 'glasses', bow: 'bow', band: 'band' };
  window.PM_CATALOGO = [];
  Object.keys(raw).forEach(function (cat) {
    raw[cat].forEach(function (r, i) {
      var slot = PM_CATEGORIAS[cat].slot, item, estilo = r[2];
      if (cat === 'accesorios') {
        slot = slotDe[estilo];
        item = (estilo === 'glasses') ? { style: r[4], color: r[3] } : { color: r[3] };
      } else if (slot === 'shoes' || slot === 'earrings') {
        item = { style: estilo, color: r[3] };
      } else {
        item = { style: estilo, color: r[3], color2: r[4], pattern: r[5] };
      }
      PM_CATALOGO.push({ id: cat + '-' + (i + 1), cat: cat, nombre: r[0], precio: r[1], estilo: estilo, slot: slot, item: item });
    });
  });
})();

function pmProducto(id) { return PM_CATALOGO.filter(function (p) { return p.id === id; })[0]; }

// aplica una prenda a un estado de avatar (devuelve copia)
function pmAplicarItem(state, slot, item) {
  var s = JSON.parse(JSON.stringify(state));
  var it = item ? JSON.parse(JSON.stringify(item)) : null;
  if (slot === 'top' || slot === 'bottom') { s[slot] = it; if (it) s.dress = null; }
  else if (slot === 'dress') { s.dress = it; }
  else { s[slot] = it; }
  return s;
}
function pmFocusDeSlot(slot) {
  return { top: 'torso', bottom: 'legs', dress: 'full', shoes: 'feet', earrings: 'head', glasses: 'head', bow: 'head', band: 'head', bag: 'torso' }[slot] || 'full';
}
