import type { Beat } from './growth';
import { PAUSE, READY } from '@shared/video/recorder';

export { VIDEO_TYPES } from '@shared/video/recorder';

/** A box's words and labels, as the video draws them. */
export type SceneText = { size: number; words: { text: string; color: string }[]; header?: string; footer?: string; muted?: boolean; bare?: boolean; keys?: string[] };
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
var AREA = { x: 60, y: 380, width: 960, height: 1300 }, MAX_SCALE = 3, STUB = 14;
function placeTree(scene) {
  var scale = Math.min(MAX_SCALE, AREA.width / scene.width, AREA.height / scene.height);
  return { scale: scale, x: AREA.x + (AREA.width - scene.width * scale) / 2, y: AREA.y + (AREA.height - scene.height * scale) / 2 };
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
type Geometry = { placeTree: (scene: Pick<TreeScene, 'width' | 'height'>) => { scale: number; x: number; y: number }; edgePath: (from: SceneBox, to: SceneBox, down: boolean, back: boolean) => Point[] };
/** The recorder's geometry, run here for the tests. */
export const geometry = (): Geometry => new Function(`${GEOMETRY}; return { placeTree: placeTree, edgePath: edgePath };`)();

export type Look = { paper: string; ink: string; muted: string; rule: string; accent: string; path: string; green: string; deep: string; font: string; logo: string };
export type VideoInput = { scene: TreeScene; beats: Beat[]; look: Look; speed: number; ask: boolean; timer: number; types: string[] };


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
var now = {}, lit = null, ask = null, step = 0, total = INPUT.beats.length ? INPUT.beats[INPUT.beats.length - 1].step + 1 : 0, done = false;
var FADE = 250;

function holds(box) { return !!(lit && box.keys && box.keys.indexOf(lit) >= 0); }
function alpha(id, t) { if (hidden[id]) return 0; var at = shownAt[id]; return at === undefined ? 1 : Math.min(1, (t - at) / FADE); }

function roundRect(x, y, w, h) {
  var big = 14, small = 4;
  ctx.beginPath();
  ctx.moveTo(x + small, y);
  ctx.lineTo(x + w - big, y); ctx.quadraticCurveTo(x + w, y, x + w, y + big);
  ctx.lineTo(x + w, y + h - small); ctx.quadraticCurveTo(x + w, y + h, x + w - small, y + h);
  ctx.lineTo(x + big, y + h); ctx.quadraticCurveTo(x, y + h, x, y + h - big);
  ctx.lineTo(x, y + small); ctx.quadraticCurveTo(x, y, x + small, y);
  ctx.closePath();
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

function drawText(box) {
  var size = box.size, lineHeight = size * 1.9, label = 12;
  var lines = wrap(box.words, Math.max(10, box.w - (box.bare ? 4 : 24)), size);
  var block = lines.length * lineHeight + (box.header ? label + 8 : 0) + (box.footer ? label + 6 : 0);
  var y = box.y + (box.h - block) / 2;
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  if (box.header) {
    ctx.font = label + 'px sans-serif'; ctx.fillStyle = look.muted; ctx.direction = 'rtl';
    ctx.fillText(box.header, box.x + box.w / 2, y + label / 2 + 1);
    y += label + 4;
    ctx.strokeStyle = look.rule; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(box.x + 12, y); ctx.lineTo(box.x + box.w - 12, y); ctx.stroke();
    y += 4;
  }
  ctx.font = size + 'px ' + look.font; ctx.direction = 'ltr'; ctx.textAlign = 'left';
  var space = ctx.measureText(' ').width;
  lines.forEach(function (line) {
    var x = box.x + box.w / 2 + line.width / 2;
    line.words.forEach(function (word) {
      x -= word.width;
      ctx.fillStyle = word.color; ctx.fillText(word.text, x, y + lineHeight / 2);
      x -= space;
    });
    y += lineHeight;
  });
  if (box.footer) {
    ctx.font = label + 'px sans-serif'; ctx.fillStyle = look.muted; ctx.textAlign = 'center'; ctx.direction = 'rtl';
    ctx.fillText(box.footer, box.x + box.w / 2, y + 2 + label / 2);
  }
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

function draw(t) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.fillStyle = look.paper; ctx.fillRect(0, 0, FRAME.width, FRAME.height);
  ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.direction = 'rtl';
  // As the website's frame: the emblem on top, and in ask mode the call to finish the ayat under it.
  if (logo.complete && logo.naturalWidth) ctx.drawImage(logo, FRAME.width / 2 - 70, 70, 140, 140);
  if (INPUT.ask) { ctx.fillStyle = look.accent; ctx.font = '56px ' + look.font; ctx.fillText(ASK_HEADING, FRAME.width / 2, 290, FRAME.width - 120); }
  var bar = (FRAME.width - 120 - (total - 1) * 10) / Math.max(1, total);
  for (var i = 0; i < total; i++) {
    ctx.fillStyle = done || i <= step ? look.green : look.rule;
    ctx.fillRect(FRAME.width - 60 - (i + 1) * bar - i * 10, 1740, bar, 8);
  }
  ctx.setTransform(place.scale, 0, 0, place.scale, place.x, place.y);
  scene.edges.forEach(function (edge) {
    var from = byId[edge.from], to = byId[edge.to];
    var a = alpha('l:' + edge.to, t);
    if (!from || !to || !a) return;
    var points = edgePath(from, to, scene.down, edge.back);
    ctx.globalAlpha = a; ctx.strokeStyle = holds(to) ? look.path : look.rule; ctx.lineWidth = 2; ctx.lineJoin = 'round';
    ctx.beginPath(); ctx.moveTo(points[0][0], points[0][1]);
    for (var p = 1; p < points.length; p++) ctx.lineTo(points[p][0], points[p][1]);
    ctx.stroke();
  });
  scene.boxes.forEach(function (box) {
    var a = alpha(box.id, t);
    if (!a) return;
    ctx.globalAlpha = a;
    var asked = ask && ask.id === box.id;
    if (!box.bare) {
      roundRect(box.x, box.y, box.w, box.h);
      if (!box.muted) { ctx.fillStyle = look.deep; ctx.fill(); }
      // The growing ayah's path is lit as a tap lights it in the app: a blue tint, the box just drawn outlined.
      if (holds(box)) { ctx.fillStyle = look.path; ctx.globalAlpha = a * 0.14; ctx.fill(); ctx.globalAlpha = a; }
      ctx.strokeStyle = asked ? look.accent : now[box.id] ? look.path : box.muted ? look.muted : look.rule;
      ctx.lineWidth = now[box.id] || asked ? 2 : 1;
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
  var beat = 0, beatStart = 0, finishedAt = 0, HOLD = 1500, start = performance.now();
  function enter(index, t) {
    var current = INPUT.beats[index];
    if (!current) return;
    step = current.step; lit = current.key; ask = null;
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
      if (beat < INPUT.beats.length) enter(beat, beatStart); else { done = true; finishedAt = t; now = {}; lit = null; ask = null; }
    }
    if (ask && !done) ask.left = Math.max(0, 1 - (t - beatStart) / length(beat));
    draw(t);
    send({ type: 'progress', at: done ? total : step, total: total });
    if (done && t - finishedAt > HOLD) { recorder.stop(); stream.getTracks().forEach(function (track) { track.stop(); }); return; }
    requestAnimationFrame(tick);
  }
  ${PAUSE}
  ready(logo, look.font, function () { start = performance.now(); recorder.start(); started(); enter(0, 0); requestAnimationFrame(tick); });
}
`;
