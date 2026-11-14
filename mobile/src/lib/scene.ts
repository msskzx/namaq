import type { Beat } from './growth';
import { OUTRO, PAUSE, READY } from '@shared/video/recorder';

export { VIDEO_TYPES } from '@shared/video/recorder';

/** A box's words and labels, as the video draws them. */
export type SceneText = { size: number; words: { text: string; color: string }[]; header?: string; footer?: string; muted?: boolean; bare?: boolean; keys?: string[];
  /** Each label and run of words where the app laid it out in the box; without them the words are centred in the box. */
  parts?: ScenePart[] };
/** A label (a reference, `rule` when a line runs under it) or the box's words, at its place in the tree, in tree points. */
export type ScenePart = { x: number; y: number; w: number; h: number; size: number; label?: string; align?: 'center' | 'right'; rule?: boolean;
  words?: { text: string; color: string }[]; lineHeight?: number };
export type SceneBox = SceneText & { id: string; x: number; y: number; w: number; h: number };
/** A connector from a box to one in its fan; `back` fans open before the root (words and ayat before the phrase). */
export type SceneEdge = { from: string; to: string; back: boolean };
/** The drawn tree, measured in its own points. */
export type TreeScene = { width: number; height: number; down: boolean; boxes: SceneBox[]; edges: SceneEdge[] };

/** A vertical story frame, as Instagram and WhatsApp status show it. */
export const FRAME = { width: 1080, height: 1920 };
/**
 * Where the tree sits in the frame (scaled to fill its middle, centred), and each connector's corners in tree points:
 * out of the parent's side (or foot, top down), along the spine, into the child, matching BranchTree's stub and elbow.
 * Plain JavaScript, since the recorder runs it inside a web view (the phone's engine cannot hand a function's source over).
 */
const GEOMETRY = String.raw`
// BranchTree's measures: the stub out of a box (14) meets the spine's 2-point line at its middle; the first and last child's
// lines curve into the spine with a radius of 10. Boxes are round at 14 on every corner, as CARD.
var AREA = { x: 60, y: 90, width: 960, height: 1720 }, MAX_SCALE = 3, STUB = 15, CURVE = 10, RADIUS = 14;
// Under the tree, as TreeCard lays them out: the chips (one per ayah, its surah and number), 8 points, then the lit ayah's card.
// K scales the app's points to the frame (a phone's card is about 366 points wide, the frame's 960); UI is Text's size scale.
var K = 2.6, UI = 1.12, CHIPS = { rows: 2, gap: 5 * K, height: 32 * K }, CARD = { x: 60, width: 960, gap: 8 * K }, BELOW = 12 * K;
function placeTree(scene, area) {
  area = area || AREA;
  var scale = Math.min(MAX_SCALE, area.width / scene.width, area.height / scene.height);
  return { scale: scale, x: area.x + (area.width - scene.width * scale) / 2, y: area.y + (area.height - scene.height * scale) / 2 };
}
function edgePath(from, to, down, back) {
  if (down) {
    var x1 = from.x + from.w / 2, x2 = to.x + to.w / 2, y1 = back ? from.y : from.y + from.h;
    var spine = back ? y1 - STUB : y1 + STUB, y2 = back ? to.y + to.h : to.y;
    return [[x1, y1], [x1, spine], [x2, spine], [x2, y2]];
  }
  var a = from.y + from.h / 2, b = to.y + to.h / 2, s = back ? from.x + from.w : from.x;
  var spineX = back ? s + STUB : s - STUB, e = back ? to.x : to.x + to.w;
  return [[s, a], [spineX, a], [spineX, b], [e, b]];
}
`;

type Point = [number, number];
type Area = { x: number; y: number; width: number; height: number };
type Geometry = { placeTree: (scene: Pick<TreeScene, 'width' | 'height'>, area?: Area) => { scale: number; x: number; y: number }; edgePath: (from: SceneBox, to: SceneBox, down: boolean, back: boolean) => Point[] };
/** The recorder's geometry, run here for the tests. */
export const geometry = (): Geometry => new Function(`${GEOMETRY}; return { placeTree: placeTree, edgePath: edgePath };`)();

/** The app's colours; `lit` is a box on the lit path, the path's blue over the paper as BranchTree blends it. */
export type Look = { paper: string; ink: string; muted: string; rule: string; accent: string; path: string; green: string; deep: string; card: string; lit: string; font: string; ui: string; logo: string };
/**
 * An ayah of the tree as the video's chip and card show it, as the matrix's ayah card does in the app: the chip's surah and number,
 * the card's surah name and «الآية …» line, and its words coloured as the matrix colours them, each ayah's number at its end.
 */
export type VideoAyah = { key: string; chip: string; name: string; label: string; words: { text: string; color: string }[] };
export type VideoInput = { scene: TreeScene; beats: Beat[]; look: Look; speed: number; ask: boolean; timer: number; types: string[]; ayat: VideoAyah[] };


/**
 * The page that records the video: it grows the tree on a canvas with the beats the studio plays, records it,
 * and posts the file back as base64 (to the app's WebView, or to the web build's parent page).
 * Plain JavaScript in a string, since it runs inside a web view.
 */
export function recorderPage(input: VideoInput, fontFace = '') {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${fontFace}html,body{margin:0;height:100%;background:${input.look.paper};overflow:hidden}canvas{display:block;height:100%;width:auto;margin:0 auto;max-width:100%;object-fit:contain}</style></head>
<body><canvas width="${FRAME.width}" height="${FRAME.height}"></canvas><script>
var INPUT = ${JSON.stringify(input).replace(/</g, '\\u003c')};
${GEOMETRY}
${READY}
${OUTRO}
${RECORDER}
</script></body></html>`;
}


const RECORDER = String.raw`
var FRAME = { width: 1080, height: 1920 };
function send(message) {
  var text = JSON.stringify(message);
  if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(text);
  else if (window.parent !== window) window.parent.postMessage(text, '*');
}
window.onerror = function (message) { send({ type: 'error', message: String(message) }); };
var scene = INPUT.scene, look = INPUT.look, ASK_HEADING = 'اكمل الايات';
var logo = new Image(); logo.src = look.logo;
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');
var place = placeTree(scene);
var byId = {};
scene.boxes.forEach(function (box) { byId[box.id] = box; });
var hidden = {};
INPUT.beats.forEach(function (beat) { beat.reveal.forEach(function (id) { hidden[id] = true; }); });
var shownAt = {};
var now = {}, lit = null, ask = null, tour = false, step = 0, total = INPUT.beats.length ? INPUT.beats[INPUT.beats.length - 1].step + 1 : 0, done = false;
var FADE = 250;

function holds(box) { return !!(lit && box.keys && box.keys.indexOf(lit) >= 0); }
function alpha(id, t) { if (hidden[id]) return 0; var at = shownAt[id]; return at === undefined ? 1 : Math.min(1, (t - at) / FADE); }

// A box as CARD draws it: round at 14 on every corner, the border inside its edge.
function roundRect(x, y, w, h, r) {
  r = Math.min(r === undefined ? RADIUS : r, w / 2, h / 2);
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}

function wrap(words, width, size) {
  ctx.font = size + 'px ' + look.font;
  var lines = [], line = [], used = 0, space = ctx.measureText(' ').width;
  words.forEach(function (word) {
    var w = ctx.measureText(word.text).width;
    if (line.length && used + space + w > width) { lines.push({ words: line, width: used }); line = []; used = 0; }
    used += (line.length ? space : 0) + w; line.push({ text: word.text, color: word.color, width: w });
  });
  if (line.length) lines.push({ words: line, width: used });
  return lines;
}

// Words centred line by line in their place, as Words sets them (a line every 1.9 of the size).
function drawWords(words, size, lineHeight, rect) {
  // The place is exactly as wide as its longest line: a pixel of slack keeps rounding from breaking that line in two.
  // A line more than the app broke into keeps inside the place, so it never runs onto the box's references.
  var lines = wrap(words, Math.max(10, rect.w) + 2, size), height = Math.min(lineHeight || Infinity, rect.h / Math.max(1, lines.length));
  var y = rect.y + (rect.h - lines.length * height) / 2;
  ctx.font = size + 'px ' + look.font; ctx.direction = 'ltr'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  var space = ctx.measureText(' ').width;
  lines.forEach(function (line) {
    var x = rect.x + rect.w / 2 + line.width / 2;
    line.words.forEach(function (word) {
      x -= word.width;
      ctx.fillStyle = word.color; ctx.fillText(word.text, x, y + height / 2);
      x -= space;
    });
    y += height;
  });
}

// A reference in the app's font and size, centred or from the right; a header's rule runs under it, inside the box's padding.
function drawLabel(part) {
  ctx.font = part.size + 'px ' + look.ui; ctx.fillStyle = look.muted; ctx.direction = 'rtl'; ctx.textBaseline = 'middle';
  var top = part.rule ? part.y + 2 : part.y, height = part.rule ? part.h - 5 : part.h;
  ctx.textAlign = part.align === 'right' ? 'right' : 'center';
  ctx.fillText(part.label, part.align === 'right' ? part.x + part.w : part.x + part.w / 2, top + height / 2);
  if (part.rule) { ctx.strokeStyle = look.rule; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(part.x, part.y + part.h - 0.5); ctx.lineTo(part.x + part.w, part.y + part.h - 0.5); ctx.stroke(); }
}

function drawText(box) {
  // Each label and run of words where the app laid it out.
  if (box.parts) {
    box.parts.forEach(function (part) { if (part.words) drawWords(part.words, part.size, part.lineHeight, part); else drawLabel(part); });
    return;
  }
  // A box drawn by its own content (a quiz's): its words centred, its references above or under them.
  var size = box.size, lineHeight = size * 1.9, label = 13, pad = box.bare ? 2 : 12;
  var lines = wrap(box.words, Math.max(10, box.w - 2 * pad) + 2, size);
  var block = lines.length * lineHeight + (box.header ? label * 1.8 + 5 : 0) + (box.footer ? label * 1.8 + 4 : 0);
  var y = box.y + (box.h - block) / 2;
  if (box.header) { drawLabel({ x: box.x + pad, y: y, w: box.w - 2 * pad, h: label * 1.8 + 5, size: label, label: box.header, align: 'center', rule: true }); y += label * 1.8 + 5; }
  drawWords(box.words, size, lineHeight, { x: box.x + pad, y: y, w: box.w - 2 * pad, h: lines.length * lineHeight });
  y += lines.length * lineHeight;
  if (box.footer) drawLabel({ x: box.x + pad, y: y + 4, w: box.w - 2 * pad, h: label * 1.8, size: label, label: box.footer, align: 'center' });
}

function drawHourglass(box, left, seconds) {
  var cx = box.x + box.w / 2, cy = box.y + box.h / 2;
  ctx.strokeStyle = look.accent; ctx.fillStyle = look.accent; ctx.lineWidth = 1.5;
  var s = 0.9, x = cx - 12 * s, y = cy - 16 * s;
  var top = 4 * Math.sqrt(Math.max(0, Math.min(1, left))), bottom = 4 * Math.sqrt(Math.max(0, Math.min(1, 1 - left)));
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.stroke(new Path2D('M6 2h12M6 22h12M7 2v4c0 3 4 5 5 6s5 3 5 6v4M17 2v4c0 3-4 5-5 6s-5 3-5 6v4'));
  ctx.fill(new Path2D('M' + (12 - top) + ' ' + (10 - top) + 'H' + (12 + top) + 'L12 10Z'));
  ctx.fill(new Path2D('M8 19H16L12 ' + (19 - bottom) + 'Z'));
  ctx.restore();
  ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(String(Math.max(1, Math.ceil(left * seconds))).replace(/\d/g, function (d) { return '٠١٢٣٤٥٦٧٨٩'[d]; }), cx, cy + 16);
}

// The height of a line of the app's font at a size, as a Text without a line height of its own sets it.
function lineBox(font, size) {
  ctx.font = font;
  var m = ctx.measureText('الآية');
  return (m.fontBoundingBoxAscent || 0) + (m.fontBoundingBoxDescent || 0) || size * 1.75;
}

// The chips keep to their two rows: a tree with many ayat gets smaller chips. SurahChips' 14-point name, scaled as Text scales it.
var chipScale = K, chipRows = [], CHIP_TEXT = Math.round(14 * UI);
function layChips(k) {
  ctx.font = (CHIP_TEXT * k) + 'px ' + look.ui;
  var rows = [[]], used = 0, max = CARD.width;
  INPUT.ayat.forEach(function (ayah) {
    var w = ctx.measureText(ayah.chip).width + 24 * k + 2 * k;
    if (rows[rows.length - 1].length && used + CHIPS.gap + w > max) { rows.push([]); used = 0; }
    used += (rows[rows.length - 1].length ? CHIPS.gap : 0) + w;
    rows[rows.length - 1].push({ ayah: ayah, w: w });
  });
  return rows;
}
function fitChips() { for (chipScale = K; ; chipScale -= 0.1) { chipRows = layChips(chipScale); if (chipRows.length <= CHIPS.rows || chipScale <= 1) return; } }
function chipsHeight() { var rows = Math.min(chipRows.length, CHIPS.rows); return rows ? rows * CHIPS.height * chipScale / K + (rows - 1) * CHIPS.gap : 0; }

function pill(x, y, w, h) {
  var r = h / 2;
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.lineTo(x + w - r, y); ctx.arc(x + w - r, y + r, r, -Math.PI / 2, Math.PI / 2);
  ctx.lineTo(x + r, y + h); ctx.arc(x + r, y + r, r, Math.PI / 2, Math.PI * 1.5); ctx.closePath();
}

// As SurahChips: a thin rule border, the lit one outlined in the path's blue on deeper paper. Right to left, the first ayah to grow on the right.
function drawChips() {
  var k = chipScale, h = CHIPS.height * k / K;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'rtl'; ctx.font = (CHIP_TEXT * k) + 'px ' + look.ui;
  chipRows.slice(0, CHIPS.rows).forEach(function (row, r) {
    var width = row.reduce(function (sum, item, i) { return sum + item.w + (i ? CHIPS.gap : 0); }, 0);
    var x = FRAME.width / 2 + width / 2, y = frame.chips + r * (h + CHIPS.gap);
    row.forEach(function (item) {
      x -= item.w;
      var on = lit === item.ayah.key;
      pill(x + k / 2, y + k / 2, item.w - k, h - k);
      if (on) { ctx.fillStyle = look.deep; ctx.fill(); }
      ctx.strokeStyle = on ? look.path : look.rule; ctx.lineWidth = k; ctx.stroke();
      ctx.fillStyle = on ? look.path : look.ink; ctx.fillText(item.ayah.chip, x + item.w / 2, y + h / 2);
      x -= CHIPS.gap;
    });
  });
}

// As the matrix's ayah card (MatrixCard's Cell): 12 by 8 points of padding, the surah's name (16, bold) and «الآية …» (13) centred
// on one baseline, 4 points, then the ayah from the right at 21 on lines of 44, coloured as the matrix colours its words.
// The card is as tall as its ayah, as in the app; a long ayah gets smaller letters so it shows whole.
var NAME = Math.round(16 * UI), LABEL = Math.round(13 * UI), MAX_CARD = 168 * K, cards = {};
function cardOf(ayah) {
  if (cards[ayah.key]) return cards[ayah.key];
  var pad = 13 * K, head = lineBox('bold ' + NAME * K + 'px ' + look.ui, NAME * K), size = 21 * K, lines, height;
  for (;;) {
    lines = wrap(ayah.words, CARD.width - 2 * pad, size);
    height = K + 8 * K + head + 4 * K + lines.length * size * 44 / 21 + 8 * K + K;
    if (height <= MAX_CARD || size <= 14 * K) break;
    size -= 2;
  }
  cards[ayah.key] = { lines: lines, size: size, head: head, height: Math.min(height, MAX_CARD) };
  return cards[ayah.key];
}

function drawCard(key) {
  var ayah = INPUT.ayat.filter(function (item) { return item.key === key; })[0];
  if (!ayah) return;
  var card = cardOf(ayah), x = CARD.x, top = frame.card, width = CARD.width, pad = 13 * K;
  roundRect(x + K / 2, top + K / 2, width - K, card.height - K, 14 * K);
  ctx.fillStyle = look.card; ctx.fill(); ctx.strokeStyle = look.rule; ctx.lineWidth = K; ctx.stroke();
  ctx.font = 'bold ' + (NAME * K) + 'px ' + look.ui;
  var name = ctx.measureText(ayah.name), baseline = top + K + 8 * K + (name.fontBoundingBoxAscent || NAME * K);
  ctx.font = (LABEL * K) + 'px ' + look.ui; var labelWidth = ctx.measureText(ayah.label).width;
  var gap = 10 * K, start = FRAME.width / 2 + (name.width + gap + labelWidth) / 2;
  ctx.textBaseline = 'alphabetic'; ctx.direction = 'rtl'; ctx.textAlign = 'right';
  ctx.font = 'bold ' + (NAME * K) + 'px ' + look.ui; ctx.fillStyle = look.ink; ctx.fillText(ayah.name, start, baseline);
  ctx.font = (LABEL * K) + 'px ' + look.ui; ctx.fillStyle = look.muted; ctx.fillText(ayah.label, start - name.width - gap, baseline);
  var lineHeight = card.size * 44 / 21, y = top + K + 8 * K + card.head + 4 * K;
  ctx.save(); ctx.beginPath(); ctx.rect(x, y, width, top + card.height - K - y); ctx.clip();
  ctx.font = card.size + 'px ' + look.font; ctx.direction = 'ltr'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
  var space = ctx.measureText(' ').width;
  card.lines.forEach(function (line) {
    var at = x + width - pad;
    line.words.forEach(function (word) { at -= word.width; ctx.fillStyle = word.color; ctx.fillText(word.text, at, y + lineHeight / 2); at -= space; });
    y += lineHeight;
  });
  ctx.restore();
}

// The frame as TreeCard stacks it: the tree, the chips 12 points under it, the card 8 under them; the whole stack centred in the
// frame, the tree as large as the room left allows. The card's room is the tallest ayah's, so nothing moves as the ayat take turns.
var frame = { chips: 0, card: 0 };
function layout() {
  var top = INPUT.ask ? 110 : 60, bottom = 1810, below = 0, chips = 0;
  if (INPUT.ayat.length) {
    fitChips(); chips = chipsHeight();
    var tour = INPUT.beats.some(function (beat) { return beat.path; });
    var tallest = tour ? Math.max.apply(null, INPUT.ayat.map(function (ayah) { return cardOf(ayah).height; })) : 0;
    below = BELOW + chips + (tour ? CARD.gap + tallest : 0);
  }
  place = placeTree(scene, { x: AREA.x, y: top, width: AREA.width, height: bottom - top - below });
  var tree = scene.height * place.scale;
  place.y = top + (bottom - top - tree - below) / 2;
  frame.chips = place.y + tree + BELOW; frame.card = frame.chips + chips + CARD.gap;
}

// A fan's first and last child: their lines curve into the spine, as BranchTree's elbows do.
var fans = {};
scene.edges.forEach(function (edge) { var key = edge.from + (edge.back ? '<' : '>'); (fans[key] = fans[key] || []).push(edge); });
function across(id) { var box = byId[id]; return box ? (scene.down ? box.x + box.w / 2 : box.y + box.h / 2) : 0; }
function atEnd(edge) {
  var fan = fans[edge.from + (edge.back ? '<' : '>')].filter(function (item) { return byId[item.to]; });
  if (fan.length < 2) return false;
  var places = fan.map(function (item) { return across(item.to); }), at = across(edge.to);
  return at === Math.min.apply(null, places) || at === Math.max.apply(null, places);
}
function strokeEdge(points, curve) {
  ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]); ctx.lineTo(points[1][0], points[1][1]);
  var reach = Math.min(Math.abs(points[2][0] - points[1][0]) + Math.abs(points[2][1] - points[1][1]), Math.abs(points[3][0] - points[2][0]) + Math.abs(points[3][1] - points[2][1]));
  if (curve && reach > 0) ctx.arcTo(points[2][0], points[2][1], points[3][0], points[3][1], Math.min(CURVE, reach)); else ctx.lineTo(points[2][0], points[2][1]);
  ctx.lineTo(points[3][0], points[3][1]);
  ctx.stroke();
}

// The end frame (shared OUTRO): the emblem, the app's name and its slogan, as the app's opening screen.
function drawOutro(shown) {
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.globalAlpha = 1;
  ctx.fillStyle = look.paper; ctx.fillRect(0, 0, FRAME.width, FRAME.height);
  outro(ctx, logo, { width: FRAME.width, height: FRAME.height, k: FRAME.width / 390, alpha: Math.max(0, Math.min(1, shown)), paper: look.paper, ink: look.ink, muted: look.muted, ui: look.ui });
}

function draw(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = look.paper; ctx.fillRect(0, 0, FRAME.width, FRAME.height);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'rtl';
  // As the website's frame: the emblem on top, and in ask mode the call to finish the ayat under it.
  if (INPUT.ask) { ctx.fillStyle = look.accent; ctx.font = '50px ' + look.font; ctx.fillText(ASK_HEADING, FRAME.width / 2, 60, FRAME.width - 120); }
  var bar = (FRAME.width - 120 - (total - 1) * 10) / Math.max(1, total);
  for (var i = 0; i < total; i++) {
    ctx.fillStyle = done || i <= step ? look.green : look.rule;
    ctx.fillRect(FRAME.width - 60 - (i + 1) * bar - i * 10, 1840, bar, 8);
  }
  drawChips();
  if (tour && lit) drawCard(lit);
  ctx.setTransform(place.scale, 0, 0, place.scale, place.x, place.y);
  // Plain lines first, so the lit path's blue runs whole over any grey it crosses.
  ctx.lineWidth = 2; ctx.lineJoin = 'miter'; ctx.lineCap = 'butt';
  [false, true].forEach(function (litPass) {
    scene.edges.forEach(function (edge) {
      var from = byId[edge.from], to = byId[edge.to];
      var a = alpha('l:' + edge.to, t);
      if (!from || !to || !a || holds(to) !== litPass) return;
      ctx.globalAlpha = a; ctx.strokeStyle = litPass ? look.path : look.rule;
      strokeEdge(edgePath(from, to, scene.down, edge.back), atEnd(edge));
    });
  });
  scene.boxes.forEach(function (box) {
    var a = alpha(box.id, t);
    if (!a) return;
    ctx.globalAlpha = a;
    var asked = ask && ask.id === box.id;
    if (!box.bare) {
      // As Box: the card colour, or the path's blue over the paper while its path is lit; a one-point border inside the edge.
      roundRect(box.x + 0.5, box.y + 0.5, box.w - 1, box.h - 1);
      if (holds(box)) { ctx.fillStyle = look.lit; ctx.fill(); } else if (!box.muted) { ctx.fillStyle = look.card; ctx.fill(); }
      ctx.strokeStyle = asked ? look.accent : now[box.id] || holds(box) ? look.path : box.muted ? look.muted : look.rule;
      ctx.lineWidth = 1;
      if (box.muted) ctx.setLineDash([4, 3]);
      ctx.stroke(); ctx.setLineDash([]);
    }
    if (asked) drawHourglass(box, ask.left, ask.seconds); else drawText(box);
  });
  ctx.globalAlpha = 1;
}

var types = INPUT.types.filter(function (type) { return window.MediaRecorder && MediaRecorder.isTypeSupported(type); });
if (!types.length || !canvas.captureStream) { send({ type: 'error', message: 'unsupported' }); }
else {
  var stream = canvas.captureStream(30);
  var recorder = new MediaRecorder(stream, { mimeType: types[0], videoBitsPerSecond: 6000000 });
  var chunks = [];
  recorder.ondataavailable = function (event) { if (event.data.size) chunks.push(event.data); };
  recorder.onstop = function () {
    var blob = new Blob(chunks, { type: types[0].split(';')[0] });
    var reader = new FileReader();
    reader.onload = function () { send({ type: 'video', mime: blob.type, data: String(reader.result).split(',')[1] }); };
    reader.readAsDataURL(blob);
  };
  // After the last beat the grown tree holds a moment, then the emblem alone closes the video (owner: an outro, no intro).
  var beat = 0, beatStart = 0, finishedAt = 0, HOLD = 1500, OUTRO = 2200, start = performance.now();
  function enter(index, t) {
    var current = INPUT.beats[index];
    if (!current) return;
    step = current.step; lit = current.key; ask = null; tour = !!current.path;
    if (current.ask) { ask = { id: current.ask, left: 1, seconds: INPUT.timer || 3 }; now = {}; return; }
    current.reveal.forEach(function (id) { delete hidden[id]; shownAt[id] = t; });
    if (current.now.length) { now = {}; current.now.forEach(function (id) { now[id] = true; }); }
  }
  function length(index) {
    var current = INPUT.beats[index];
    return current.ask ? (INPUT.timer || 3) * 1000 : current.ms / INPUT.speed;
  }
  function tick() {
    if (pausedAt) { requestAnimationFrame(tick); return; }
    var t = performance.now() - start;
    while (!done && beat < INPUT.beats.length && t - beatStart >= length(beat)) {
      var ended = INPUT.beats[beat];
      if (!ended.reveal.length && !ended.now.length && !ended.ask) now = {};
      beatStart += length(beat); beat++;
      if (beat < INPUT.beats.length) enter(beat, beatStart); else { done = true; finishedAt = t; now = {}; lit = null; ask = null; tour = false; }
    }
    if (ask && !done) ask.left = Math.max(0, 1 - (t - beatStart) / length(beat));
    if (done && t - finishedAt > HOLD) drawOutro((t - finishedAt - HOLD) / 600); else draw(t);
    send({ type: 'progress', at: done ? total : step, total: total });
    if (done && t - finishedAt > HOLD + OUTRO) { recorder.stop(); stream.getTracks().forEach(function (track) { track.stop(); }); return; }
    requestAnimationFrame(tick);
  }
  ${PAUSE}
  var uiFont = document.fonts && document.fonts.load
    ? Promise.all([document.fonts.load('40px ' + look.ui), document.fonts.load('bold 40px ' + look.ui), document.fonts.load('40px ' + look.font)]).catch(function () {})
    : Promise.resolve();
  // The chips, the card and the tree's place are measured once the app's fonts have loaded.
  uiFont.then(function () { layout(); ready(logo, look.font, function () { start = performance.now(); recorder.start(); started(); enter(0, 0); requestAnimationFrame(tick); }); });
}
`;
