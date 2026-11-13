import type { CardSide, PairCard } from '../quran/compareCards';
import { num } from '../quran/arabicNumber';
import { mushafText } from '../quran/mushafText';
import { ayahStarts, stepTime, type ReadStep } from '../quran/readPlan';
import { stepEnds, videoParts, videoTimeline, type Segment } from './pageVideo';
import { PAUSE, READY, VIDEO_TYPES } from './recorder';

/** One word as the video draws it: its text, which ayah and word it is (-1 for the ayah number), its mark. */
export type VideoWord = { text: string; ayah: number; word: number; kind?: string; link?: string; seal?: boolean };
export type VideoSide = { label: string; words: VideoWord[] };
/** A card as the recorder reads it: both sides for each partner of a one-to-many card, its steps, where each ayah read starts and where each step ends. */
export type VideoCard = { options: [VideoSide, VideoSide][]; steps: ReadStep[]; starts: number[]; ends: number[] };
export type CompareLook = { paper: string; ink: string; muted: string; rule: string; accent: string; root: string; highlight: string; onHighlight: string; font: string; logo: string };
/**
 * What the compare recorder needs. One card with no frames is the studio's video of that card;
 * several cards get a title frame (`title`, `subtitle`, `part`), a counter on each card, and an end frame with `link` and `next`.
 */
export type CompareVideoInput = {
  title: string;
  subtitle?: string;
  part?: string;
  next?: string;
  link: string;
  counters?: string[];
  cards: VideoCard[];
  timeline: Segment[];
  look: CompareLook;
  types: string[];
};

/** The two sides a card shows while a step is read: a one-to-many card swaps in the partner being read. */
export function sidesAt(card: PairCard, option: number): [CardSide, CardSide] {
  const many = card.many;
  if (!many) return card.sides;
  const chosen = many.options[option] ?? many.options[0];
  return card.sides.map((side, i) => (i === many.side ? { ...side, ayah: chosen.ayah.number, ayat: [chosen.ayah] } : { ...side, ayat: [chosen.shared] })) as [CardSide, CardSide];
}

const videoSide = (side: CardSide, label: (side: CardSide) => string): VideoSide => ({
  label: label(side),
  words: side.ayat.flatMap(ayah => [
    ...ayah.words.map((word, index) => {
      const mark = ayah.marks?.[index];
      return { text: mushafText(word), ayah: ayah.number, word: index, ...(mark ? { kind: mark.kind, ...(mark.link ? { link: mark.link } : {}) } : {}) };
    }),
    { text: num(ayah.number), ayah: ayah.number, word: -1, seal: true },
  ]),
});

/** A card's read-along as the recorder plays it, at the studio's speed. */
export function videoCard(card: PairCard, plan: ReadStep[], speed: number, label: (side: CardSide) => string): VideoCard {
  const count = card.many ? card.many.options.length : 1;
  return {
    options: Array.from({ length: count }, (_, option) => sidesAt(card, option).map(side => videoSide(side, label)) as [VideoSide, VideoSide]),
    steps: plan,
    starts: ayahStarts(plan),
    ends: stepEnds(plan.map(step => stepTime(step, speed))),
  };
}

/** The recorder's input: one card alone (the card studio), or with `counters` the cards of a page with the title and end frames. */
export function compareVideoInput({ cards, look, ...text }: Omit<CompareVideoInput, 'timeline' | 'types'>): CompareVideoInput {
  const frames = !!text.counters;
  return { ...text, cards, look, timeline: videoTimeline(cards.map(card => card.ends), frames), types: VIDEO_TYPES };
}

/** The frames' words: which part of how many, where the next part goes on, which card of how many. */
export type FrameWords = { part: (at: number, of: number) => string; next: (at: number) => string; of: (at: number, of: number) => string };
export const ARABIC: FrameWords = { part: (at, of) => `الجزء ${num(at)} من ${num(of)}`, next: at => `يتبع في الجزء ${num(at)}`, of: (at, of) => `${num(at)} من ${num(of)}` };
export const ENGLISH: FrameWords = { part: (at, of) => `Part ${at} of ${of}`, next: at => `Continues in part ${at}`, of: (at, of) => `${at} of ${of}` };

/**
 * The picked cards of a page as videos of about 3 minutes or less, in order: each part opens on the pair's name
 * (and «الجزء ١ من ٣» when there are several) and ends on the page's link (and where the next part goes on).
 */
export function pageVideoInputs({ title, subtitle, link, cards, look, words = ARABIC }: { title: string; subtitle?: string; link: string; cards: VideoCard[]; look: CompareLook; words?: FrameWords }): CompareVideoInput[] {
  const parts = videoParts(cards.map(card => card.ends));
  const several = parts.length > 1;
  return parts.map((part, i) => compareVideoInput({
    title, link, look,
    ...(subtitle ? { subtitle } : {}),
    ...(several ? { part: words.part(i + 1, parts.length) } : {}),
    ...(i < parts.length - 1 ? { next: words.next(i + 2) } : {}),
    counters: part.map(index => words.of(index + 1, cards.length)),
    cards: part.map(index => cards[index]),
  }));
}

/** The page that records the video: the ayat stacked in a story frame, the read word underlined and its partner lit. */
export function compareRecorderPage(input: CompareVideoInput, fontFace = '') {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${fontFace}html,body{margin:0;height:100%;background:${input.look.paper};overflow:hidden}canvas{display:block;height:100%;width:auto;margin:0 auto;max-width:100%;object-fit:contain}</style></head>
<body><canvas width="1080" height="1920"></canvas><script>
var INPUT = ${JSON.stringify(input).replace(/</g, '\\u003c')};
${READY}
${RECORDER}
</script></body></html>`;
}

// Plain JavaScript in a string, since it runs inside a web view (the phone) or a frame (the website).
const RECORDER = String.raw`
var WIDTH = 1080, HEIGHT = 1920, MARGIN = 80, BOTTOM = 190, FADE = 400, UI = 'sans-serif';
var many = !!INPUT.counters, TOP = many ? 370 : 330;
function send(message) {
  var text = JSON.stringify(message);
  if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(text);
  else if (window.parent !== window) window.parent.postMessage(text, '*');
}
window.onerror = function (message) { send({ type: 'error', message: String(message) }); };
var look = INPUT.look, logo = new Image(), canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
logo.src = look.logo;

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
function layout(card, option) {
  var key = card + ':' + option;
  if (layouts[key]) return layouts[key];
  var options = INPUT.cards[card].options, sides = options[option] || options[0], room = HEIGHT - TOP - BOTTOM;
  for (var size = 72; ; size -= 4) {
    var blocks = sides.map(function (side) { var p = place(side, size); return { label: side.label, words: p.words, height: 70 + p.lines * size * 1.9 }; });
    if (size <= 28 || blocks[0].height + blocks[1].height + 80 <= room) return (layouts[key] = { size: size, blocks: blocks });
  }
}

function box(x, y, w, h, r) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
function paper() { ctx.globalAlpha = 1; ctx.fillStyle = look.paper; ctx.fillRect(0, 0, WIDTH, HEIGHT); }
function emblem(size, y) { if (logo.complete && logo.naturalWidth) ctx.drawImage(logo, WIDTH / 2 - size / 2, y, size, size); }
function text(value, y, size, color, rtl) {
  ctx.direction = rtl === false ? 'ltr' : 'rtl'; ctx.textAlign = 'center'; ctx.fillStyle = color; ctx.font = size + 'px ' + UI;
  ctx.fillText(value, WIDTH / 2, y, WIDTH - 2 * MARGIN);
}

// A card's ayat, shifted by dx while it slides; step is the word being read (none before or after the reading).
function drawCard(card, step, at, done, dx) {
  var frame = layout(card, step && step.option !== undefined ? step.option : 0), data = INPUT.cards[card];
  ctx.save(); ctx.translate(dx, 0); ctx.direction = 'rtl';
  var room = HEIGHT - TOP - BOTTOM, y = TOP + (room - frame.blocks[0].height - frame.blocks[1].height - 80) / 2;
  frame.blocks.forEach(function (block, side) {
    if (side === 1) { ctx.fillStyle = look.rule; ctx.fillRect(MARGIN * 2, y + 30, WIDTH - MARGIN * 4, 2); y += 80; }
    ctx.textAlign = 'center'; ctx.fillStyle = look.muted; ctx.font = '36px ' + UI;
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
  var bars = data.starts.length;
  if (bars > 1) {
    var gap = 10, w = (WIDTH - 2 * MARGIN - gap * (bars - 1)) / bars;
    data.starts.forEach(function (start, i) {
      ctx.fillStyle = done || start <= at ? look.accent : look.rule;
      box(WIDTH - MARGIN - (i + 1) * w - i * gap, HEIGHT - 150, w, 8, 4); ctx.fill();
    });
  }
  ctx.restore();
}

// The emblem and the surahs' names stay on top while the cards pass under them; the counter says which card of how many.
function header(card) {
  emblem(120, 90);
  text(INPUT.title, 270, 44, look.ink);
  if (many && INPUT.counters) text(INPUT.counters[card], 330, 30, look.muted);
}
function footer() { text('namaq.vercel.app', HEIGHT - 70, 32, look.muted, false); }

function titleFrame(alpha) {
  ctx.globalAlpha = alpha;
  emblem(260, 520);
  text(INPUT.title, 930, 64, look.ink);
  if (INPUT.subtitle) text(INPUT.subtitle, 1020, 44, look.accent);
  if (INPUT.part) text(INPUT.part, INPUT.subtitle ? 1100 : 1020, 36, look.muted);
  ctx.globalAlpha = 1;
}
function endFrame(alpha) {
  ctx.globalAlpha = alpha;
  emblem(260, 560);
  text('namaq.vercel.app', 970, 52, look.ink, false);
  text(INPUT.link, 1040, 30, look.muted, false);
  if (INPUT.next) text(INPUT.next, 1160, 40, look.accent);
  ctx.globalAlpha = 1;
}

function stepIndex(ends, local) { var i = 0; while (i < ends.length && ends[i] <= local) i++; return i; }
function ease(p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }

function draw(t) {
  var segments = INPUT.timeline, segment = segments[segments.length - 1];
  for (var s = 0; s < segments.length; s++) if (t < segments[s].end) { segment = segments[s]; break; }
  var local = Math.max(0, t - segment.start), length = segment.end - segment.start;
  paper();
  if (segment.kind === 'title') { titleFrame(Math.min(1, (length - local) / FADE)); return { card: 0, at: 0, total: 1 }; }
  if (segment.kind === 'end') { endFrame(Math.min(1, local / FADE)); return { card: INPUT.cards.length - 1, at: 1, total: 1 }; }
  if (segment.kind === 'slide') {
    var p = ease(Math.min(1, local / length)), from = INPUT.cards[segment.from];
    header(p < 0.5 ? segment.from : segment.to);
    // Forward in Arabic: the card read moves off to the right and the next comes in from the left, as swiping in the app.
    drawCard(segment.from, undefined, from.steps.length, true, p * WIDTH);
    drawCard(segment.to, undefined, 0, false, (p - 1) * WIDTH);
    footer();
    return { card: segment.to, at: 0, total: 1 };
  }
  var card = INPUT.cards[segment.card], at = stepIndex(segment.ends, local), done = at >= card.steps.length;
  header(segment.card);
  drawCard(segment.card, done ? undefined : card.steps[at], at, done, 0);
  footer();
  return { card: segment.card, at: at, total: card.steps.length };
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
  var total = INPUT.timeline[INPUT.timeline.length - 1].end, start = 0, lastCard = -1;
  function tick() {
    if (pausedAt) { requestAnimationFrame(tick); return; }
    var t = performance.now() - start, shown = draw(Math.min(t, total));
    if (shown.card !== lastCard) { lastCard = shown.card; send({ type: 'progress', card: shown.card, total: INPUT.cards.length }); }
    if (t >= total) { recorder.stop(); stream.getTracks().forEach(function (track) { track.stop(); }); return; }
    requestAnimationFrame(tick);
  }
  ${PAUSE}
  ready(logo, look.font, function () { recorder.start(); start = performance.now(); started(); requestAnimationFrame(tick); });
}
`;
