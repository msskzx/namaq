import type { CardSide, PairCard } from '@shared/quran/compareCards';
import { num } from '@shared/quran/arabicNumber';
import { mushafText } from '@shared/quran/mushafText';
import { ayahStarts, stepTime, type ReadStep } from '@shared/quran/readPlan';
import { pairTitle, sideLabel } from './compare';
import { VIDEO_TYPES } from './scene';
import { QURAN_FONT, type Palette } from './theme';

/** One word as the video draws it: its text, which ayah and word it is (-1 for the ayah number), its mark. */
export type VideoWord = { text: string; ayah: number; word: number; kind?: string; link?: string; seal?: boolean };
export type VideoSide = { label: string; words: VideoWord[] };
/** What the compare recorder needs: both sides for each partner of a one-to-many card, the steps with their times, the colours. */
export type CompareVideoInput = {
  title: string;
  options: [VideoSide, VideoSide][];
  steps: (ReadStep & { ms: number })[];
  starts: number[];
  look: { paper: string; ink: string; muted: string; rule: string; accent: string; root: string; highlight: string; onHighlight: string; font: string };
  types: string[];
};

/** The two sides a card shows while a step is read: a one-to-many card swaps in the partner being read (as on the website). */
export function sidesAt(card: PairCard, option: number): [CardSide, CardSide] {
  const many = card.many;
  if (!many) return card.sides;
  const chosen = many.options[option] ?? many.options[0];
  return card.sides.map((side, i) => (i === many.side ? { ...side, ayah: chosen.ayah.number, ayat: [chosen.ayah] } : { ...side, ayat: [chosen.shared] })) as [CardSide, CardSide];
}

const videoSide = (side: CardSide): VideoSide => ({
  label: sideLabel(side),
  words: side.ayat.flatMap(ayah => [
    ...ayah.words.map((word, index) => {
      const mark = ayah.marks?.[index];
      return { text: mushafText(word), ayah: ayah.number, word: index, ...(mark ? { kind: mark.kind, ...(mark.link ? { link: mark.link } : {}) } : {}) };
    }),
    { text: `﴿${num(ayah.number)}﴾`, ayah: ayah.number, word: -1, seal: true },
  ]),
});

/** The card's read-along as the recorder plays it, at the studio's speed. */
export function compareVideoInput(card: PairCard, plan: ReadStep[], speed: number, palette: Palette): CompareVideoInput {
  const count = card.many ? card.many.options.length : 1;
  return {
    title: pairTitle(card.sides[0].surah, card.sides[1].surah),
    options: Array.from({ length: count }, (_, option) => sidesAt(card, option).map(videoSide) as [VideoSide, VideoSide]),
    steps: plan.map(step => ({ ...step, ms: stepTime(step, speed) })),
    starts: ayahStarts(plan),
    look: { paper: palette.paper, ink: palette.ink, muted: palette.muted, rule: palette.rule, accent: palette.accent, root: palette.root, highlight: palette.highlight, onHighlight: palette.onHighlight, font: `"${QURAN_FONT}"` },
    types: VIDEO_TYPES,
  };
}

/** The page that records the card: both ayat stacked in a story frame, the read word underlined and its partner lit, as the website's video. */
export function compareRecorderPage(input: CompareVideoInput, fontFace = '') {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${fontFace}html,body{margin:0;height:100%;background:${input.look.paper};overflow:hidden}canvas{display:block;height:100%;width:auto;margin:0 auto;max-width:100%;object-fit:contain}</style></head>
<body><canvas width="1080" height="1920"></canvas><script>
var INPUT = ${JSON.stringify(input).replace(/</g, '\\u003c')};
${RECORDER}
</script></body></html>`;
}

// Plain JavaScript in a string, since it runs inside a web view.
const RECORDER = String.raw`
var WIDTH = 1080, HEIGHT = 1920, MARGIN = 80, TOP = 330, BOTTOM = 190, HOLD = 1500;
function send(message) {
  var text = JSON.stringify(message);
  if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(text);
  else if (window.parent !== window) window.parent.postMessage(text, '*');
}
window.onerror = function (message) { send({ type: 'error', message: String(message) }); };
var look = INPUT.look, canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');

function place(side, size) {
  ctx.font = size + 'px ' + look.font;
  var space = ctx.measureText(' ').width, width = WIDTH - 2 * MARGIN, lines = [[]], used = 0;
  side.words.forEach(function (token) {
    var w = ctx.measureText(token.text).width;
    if (used > 0 && used + space + w > width) { lines.push([]); used = 0; }
    lines[lines.length - 1].push({ token: token, w: w });
    used += (used > 0 ? space : 0) + w;
  });
  var placed = [], lineHeight = size * 1.9;
  lines.forEach(function (line, row) {
    var total = line.reduce(function (sum, item) { return sum + item.w; }, 0) + space * (line.length - 1);
    var x = WIDTH - MARGIN - (width - total) / 2;
    line.forEach(function (item) {
      placed.push({ token: item.token, w: item.w, x: x, y: row * lineHeight + size * 1.3 });
      x -= item.w + space;
    });
  });
  return { words: placed, lines: lines.length };
}

var layouts = {};
function layout(option) {
  if (layouts[option]) return layouts[option];
  var sides = INPUT.options[option] || INPUT.options[0], room = HEIGHT - TOP - BOTTOM;
  for (var size = 72; ; size -= 4) {
    var blocks = sides.map(function (side) { var p = place(side, size); return { label: side.label, words: p.words, height: 70 + p.lines * size * 1.9 }; });
    if (size <= 28 || blocks[0].height + blocks[1].height + 80 <= room) return (layouts[option] = { size: size, blocks: blocks });
  }
}

function box(x, y, w, h, r) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }

function draw(step, at, done) {
  var frame = layout(step && step.option !== undefined ? step.option : 0);
  ctx.direction = 'rtl'; ctx.fillStyle = look.paper; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.textAlign = 'center'; ctx.fillStyle = look.ink; ctx.font = '48px sans-serif';
  ctx.fillText(INPUT.title, WIDTH / 2, 230, WIDTH - 2 * MARGIN);
  var room = HEIGHT - TOP - BOTTOM, y = TOP + (room - frame.blocks[0].height - frame.blocks[1].height - 80) / 2;
  frame.blocks.forEach(function (block, side) {
    if (side === 1) { ctx.fillStyle = look.rule; ctx.fillRect(MARGIN * 2, y + 30, WIDTH - MARGIN * 4, 2); y += 80; }
    ctx.textAlign = 'center'; ctx.fillStyle = look.muted; ctx.font = '36px sans-serif';
    ctx.fillText(block.label, WIDTH / 2, y + 40);
    var top = y + 70;
    ctx.textAlign = 'right'; ctx.font = frame.size + 'px ' + look.font;
    block.words.forEach(function (word) {
      var t = word.token, baseline = top + word.y;
      var reading = step && step.side === side && step.ayah === t.ayah && step.word === t.word;
      var lit = step && step.link && t.link === step.link;
      if (lit) { ctx.fillStyle = look.highlight; box(word.x - word.w - 8, baseline - frame.size * 1.15, word.w + 16, frame.size * 1.6, 10); ctx.fill(); }
      ctx.fillStyle = t.seal ? look.muted : lit ? look.onHighlight : t.kind ? (t.kind === 'exact' ? look.accent : look.root) : look.ink;
      if (t.kind === 'related' && !lit) ctx.globalAlpha = 0.6;
      ctx.fillText(t.text, word.x, baseline);
      ctx.globalAlpha = 1;
      if (reading) { ctx.fillStyle = look.accent; ctx.fillRect(word.x - word.w, baseline + frame.size * 0.42, word.w, 5); }
    });
    y += block.height;
  });
  var bars = INPUT.starts.length;
  if (bars > 1) {
    var gap = 10, w = (WIDTH - 2 * MARGIN - gap * (bars - 1)) / bars;
    INPUT.starts.forEach(function (start, i) {
      ctx.fillStyle = done || start <= at ? look.accent : look.rule;
      box(WIDTH - MARGIN - (i + 1) * w - i * gap, HEIGHT - 150, w, 8, 4); ctx.fill();
    });
  }
  ctx.textAlign = 'center'; ctx.fillStyle = look.muted; ctx.font = '32px sans-serif'; ctx.direction = 'ltr';
  ctx.fillText('namaq.vercel.app', WIDTH / 2, HEIGHT - 70);
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
  var ends = [], sum = 0;
  INPUT.steps.forEach(function (step) { sum += step.ms; ends.push(sum); });
  var start = 0;
  function tick() {
    var t = performance.now() - start, at = 0;
    while (at < ends.length && ends[at] <= t) at++;
    var done = at >= ends.length;
    draw(done ? undefined : INPUT.steps[at], at, done);
    send({ type: 'progress', at: at, total: ends.length });
    if (done && t - sum > HOLD) { recorder.stop(); stream.getTracks().forEach(function (track) { track.stop(); }); return; }
    requestAnimationFrame(tick);
  }
  var go = function () { recorder.start(); start = performance.now(); requestAnimationFrame(tick); };
  if (document.fonts && document.fonts.load) document.fonts.load('40px ' + look.font).then(go, go); else go();
}
`;
