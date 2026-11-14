import type { CardAyah, MarkKind, PairCard } from '../quran/compareCards';
import { num } from '../quran/arabicNumber';
import { mushafText } from '../quran/mushafText';
import { ayahStarts, stepTime, type ReadStep } from '../quran/readPlan';
import { COMPARE_CARD, markColour, sideView, UI_SCALE, type CardPiece, type SideName } from '../quran/compareCardLook';
import { stepEnds, videoParts, videoTimeline, type Segment } from './pageVideo';
import { OUTRO, PAUSE, READY, VIDEO_TYPES } from './recorder';

/** One word as the video draws it: its text, which ayah and word it is (-1 for the ayah number), its mark. */
export type VideoWord = { text: string; ayah: number; word: number; kind?: MarkKind; link?: string; seal?: boolean };
/** A card piece as the video draws it (CardPiece in shared/quran/compareCardLook.ts, with words for the ayat and text for the notes). */
export type VideoPiece =
  | { kind: 'ayat'; words: VideoWord[]; plain?: boolean; picked?: boolean }
  | { kind: 'part' | 'gap' | 'range'; label?: string }
  | { kind: 'dash' }
  | { kind: 'silent'; note: string };
export type VideoSide = { label: string; back?: boolean; many?: boolean; pieces: VideoPiece[] };
/** A card as the recorder reads it: both sides for each partner of a one-to-many card, its steps, where each ayah read starts and where each step ends. */
export type VideoCard = { options: [VideoSide, VideoSide][]; same: boolean; steps: ReadStep[]; starts: number[]; ends: number[] };
/** The screen's colours and fonts. `marks` holds the colour of each kind of mark, from markColour as the app's card colours them. */
export type CompareLook = {
  paper: string; card: string; deep: string; ink: string; muted: string; rule: string; accent: string; green: string; highlight: string; onHighlight: string;
  marks: Record<MarkKind, string>; font: string; ui: string; logo: string;
};
/**
 * What the compare recorder needs: the pair's name on top (with the story's name, the part and which card of how many under it),
 * the cards read along in turn, and the end frame with the emblem (and where the next part goes on).
 */
export type CompareVideoInput = {
  title: string;
  subtitle?: string;
  part?: string;
  next?: string;
  counters?: string[];
  cards: VideoCard[];
  timeline: Segment[];
  look: CompareLook;
  /** The app's measures (COMPARE_CARD) and its interface scale, which the recorder draws the card with. */
  measures: typeof COMPARE_CARD;
  uiScale: number;
  types: string[];
};

/** The look's mark colours, from the same rule the app's card uses. */
export const markColours = (colours: { accent: string; root: string; muted: string }): Record<MarkKind, string> =>
  ({ exact: markColour('exact', colours)!, root: markColour('root', colours)!, related: markColour('related', colours)! });

/** How the video names things: a side («الطور ١٧–٢٠»), and a story part a surah does not tell. */
export type VideoNames = { side: (name: SideName) => string; silent: (surah: number) => string };

const videoWords = (ayat: CardAyah[], plain?: boolean): VideoWord[] => ayat.flatMap(ayah => [
  ...ayah.words.map((word, index) => {
    const mark = plain ? undefined : ayah.marks?.[index];
    return { text: mushafText(word), ayah: ayah.number, word: index, ...(mark ? { kind: mark.kind, ...(mark.link ? { link: mark.link } : {}) } : {}) };
  }),
  { text: num(ayah.number), ayah: ayah.number, word: -1, seal: true },
]);

const videoPiece = (piece: CardPiece, names: VideoNames): VideoPiece | null => {
  switch (piece.kind) {
    case 'ayat': return { kind: 'ayat', words: videoWords(piece.ayat, piece.plain), ...(piece.plain ? { plain: true } : {}), ...(piece.picked ? { picked: true } : {}) };
    case 'part': return { kind: 'part', ...(piece.label ? { label: piece.label } : {}) };
    case 'gap': case 'range': return { kind: piece.kind, label: piece.label };
    case 'dash': return { kind: 'dash' };
    case 'silent': return { kind: 'silent', note: names.silent(piece.surah) };
    // The ayat around a side follow a setting the video doesn't carry: the card alone, as the studio reads it.
    case 'around': return null;
  }
};

/** A side as the card shows it in the studio (every story part open), with the partner `option` picked. */
function videoSide(card: PairCard, i: 0 | 1, option: number, names: VideoNames): VideoSide {
  const view = sideView(card, i, option);
  return {
    label: names.side(view.name),
    ...(view.back ? { back: true } : {}),
    ...(card.many?.side === i && !view.refrain ? { many: true } : {}),
    pieces: view.pieces.map(piece => videoPiece(piece, names)).filter((piece): piece is VideoPiece => !!piece),
  };
}

/** A card's read-along as the recorder plays it, at the studio's speed. */
export function videoCard(card: PairCard, plan: ReadStep[], speed: number, names: VideoNames): VideoCard {
  const count = card.many ? card.many.options.length : 1;
  return {
    options: Array.from({ length: count }, (_, option) => [videoSide(card, 0, option, names), videoSide(card, 1, option, names)] as [VideoSide, VideoSide]),
    same: card.sides[0].surah === card.sides[1].surah,
    steps: plan,
    starts: ayahStarts(plan),
    ends: stepEnds(plan.map(step => stepTime(step, speed))),
  };
}

/** The recorder's input: one card alone (the card studio), or with `counters` the cards of a page. */
export function compareVideoInput({ cards, look, ...text }: Omit<CompareVideoInput, 'timeline' | 'types' | 'measures' | 'uiScale'>): CompareVideoInput {
  return { ...text, cards, look, timeline: videoTimeline(cards.map(card => card.ends)), measures: COMPARE_CARD, uiScale: UI_SCALE, types: VIDEO_TYPES };
}

/** The frames' words: which part of how many, where the next part goes on, which card of how many. */
export type FrameWords = { part: (at: number, of: number) => string; next: (at: number) => string; of: (at: number, of: number) => string };
export const ARABIC: FrameWords = { part: (at, of) => `الجزء ${num(at)} من ${num(of)}`, next: at => `يتبع في الجزء ${num(at)}`, of: (at, of) => `${num(at)} من ${num(of)}` };
export const ENGLISH: FrameWords = { part: (at, of) => `Part ${at} of ${of}`, next: at => `Continues in part ${at}`, of: (at, of) => `${at} of ${of}` };

/**
 * The picked cards of a page as videos of about 3 minutes or less, in order: the pair's name stays on top
 * (with «الجزء ١ من ٣» when there are several), and each part ends on the emblem (and where the next part goes on).
 */
export function pageVideoInputs({ title, subtitle, cards, look, words = ARABIC }: { title: string; subtitle?: string; cards: VideoCard[]; look: CompareLook; words?: FrameWords }): CompareVideoInput[] {
  const parts = videoParts(cards.map(card => card.ends));
  const several = parts.length > 1;
  return parts.map((part, i) => compareVideoInput({
    title, look,
    ...(subtitle ? { subtitle } : {}),
    ...(several ? { part: words.part(i + 1, parts.length) } : {}),
    ...(i < parts.length - 1 ? { next: words.next(i + 2) } : {}),
    counters: part.map(index => words.of(index + 1, cards.length)),
    cards: part.map(index => cards[index]),
  }));
}

/** The page that records the video: the card drawn as the app's compare tab shows it, the read word underlined and its partner lit. */
export function compareRecorderPage(input: CompareVideoInput, fontFace = '') {
  return `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<style>${fontFace}html,body{margin:0;height:100%;background:${input.look.paper};overflow:hidden}canvas{display:block;height:100%;width:auto;margin:0 auto;max-width:100%;object-fit:contain}</style></head>
<body><canvas width="1080" height="1920"></canvas><script>
var INPUT = ${JSON.stringify(input).replace(/</g, '\\u003c')};
${READY}
${OUTRO}
${RECORDER}
</script></body></html>`;
}

// Plain JavaScript in a string, since it runs inside a web view (the phone) or a frame (the website).
// Every size is the app's (INPUT.measures, in points) times K: the story frame is the phone's width scaled up to 1080 pixels.
const RECORDER = String.raw`
var WIDTH = 1080, HEIGHT = 1920, FADE = 400, M = INPUT.measures, K = WIDTH / M.phone;
var TOP = 140, BOTTOM = 210;
function send(message) {
  var text = JSON.stringify(message);
  if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(text);
  else if (window.parent !== window) window.parent.postMessage(text, '*');
}
window.onerror = function (message) { send({ type: 'error', message: String(message) }); };
var look = INPUT.look, logo = new Image(), canvas = document.querySelector('canvas'), ctx = canvas.getContext('2d');
logo.src = look.logo;
var many = !!INPUT.counters;
// Interface text in Amiri at the app's size: its sizes grow by the app's UI scale, as the app's Text does.
function ui(size) { return Math.round(size * INPUT.uiScale) * K; }
var PAGE = M.page * K, CARD_W = WIDTH - 2 * PAGE, PAD = (M.padding + M.border) * K, INNER = CARD_W - 2 * PAD;
var LABEL = ui(M.labelSize), NOTE = ui(M.noteSize), HEAD = 30 * K;

function box(x, y, w, h, r) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }
function uiText(value, x, y, size, color, align) {
  ctx.direction = 'rtl'; ctx.textAlign = align || 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = color; ctx.font = size + 'px ' + look.ui;
  ctx.fillText(value, x, y);
  ctx.textBaseline = 'alphabetic';
}

// Running text: words wrap right to left and each line is centred, as the app's centred Text; an ayah's number keeps to the word before it.
function wrap(words, size, width) {
  ctx.font = size + 'px ' + look.font;
  var space = ctx.measureText(' ').width, glue = ctx.measureText(' ').width, items = [];
  words.forEach(function (token) {
    var w = ctx.measureText(token.text).width;
    if (token.seal && items.length) { var last = items[items.length - 1]; last.parts.push({ token: token, w: w, gap: glue }); last.w += glue + w; }
    else items.push({ parts: [{ token: token, w: w, gap: 0 }], w: w });
  });
  var lines = [[]], used = 0;
  items.forEach(function (item) {
    if (used > 0 && used + space + item.w > width) { lines.push([]); used = 0; }
    lines[lines.length - 1].push(item);
    used += (used > 0 ? space : 0) + item.w;
  });
  var placed = [];
  lines.forEach(function (line, row) {
    var total = line.reduce(function (sum, item) { return sum + item.w; }, 0) + space * (line.length - 1);
    var x = (width + total) / 2;
    line.forEach(function (item) {
      item.parts.forEach(function (part) { x -= part.gap; placed.push({ token: part.token, w: part.w, x: x, row: row }); x -= part.w; });
      x -= space;
    });
  });
  return { words: placed, lines: lines.length };
}

// The card's parts top to bottom, each with its height at ayah size 'size', as the app stacks them.
function measureCard(card, option, size) {
  var data = INPUT.cards[card], sides = data.options[option] || data.options[0], line = size * M.ayahLine / M.ayahSize, rows = [];
  sides.forEach(function (side, s) {
    if (s === 1) rows.push({ kind: 'rule', h: 1 * K, dashed: data.same });
    var gap = (side.many ? M.optionsGap : M.sideGap) * K, first = true;
    function add(row) { if (!first) row.top = gap; first = false; rows.push(row); }
    add({ kind: 'head', h: HEAD, text: side.label });
    if (side.back) add({ kind: 'back', h: NOTE * 1.7 });
    side.pieces.forEach(function (piece) {
      if (piece.kind === 'ayat') {
        var inset = side.many ? (M.pickBar + M.pickPad) * K : 0, laid = wrap(piece.words, size, INNER - inset);
        add({ kind: 'ayat', side: s, piece: piece, laid: laid, inset: inset, line: line, h: laid.lines * line });
      }
      else if (piece.kind === 'part') add({ kind: 'dotted', label: piece.label, h: 26 * K });
      else if (piece.kind === 'gap') add({ kind: 'dotted', label: piece.label, h: NOTE * 1.6 + 4 * K });
      else if (piece.kind === 'range') add({ kind: 'range', label: piece.label, h: NOTE * 1.6 });
      else if (piece.kind === 'dash') add({ kind: 'rule', h: 1 * K, dashed: true });
      else if (piece.kind === 'silent') add({ kind: 'silent', note: piece.note, h: (40 + 4 + 22 + 4 + 40 + 8) * K });
    });
  });
  // Where each row starts, and where each word's line runs, to scroll the word being read into view.
  var height = PAD, spots = {};
  rows.forEach(function (row, i) {
    height += i > 0 ? (row.top !== undefined ? row.top : M.gap * K) : 0;
    row.y = height;
    if (row.kind === 'ayat') row.laid.words.forEach(function (word) { spots[row.side + ':' + word.token.ayah + ':' + word.token.word] = row.y + (word.row + 0.5) * row.line; });
    height += row.h;
  });
  return { rows: rows, height: height + PAD, size: size, spots: spots };
}

var layouts = {}, ROOM = 0;
function header() { return TOP + ui(M.title.size) + 2 * M.title.padY * K + (subline() || many ? 64 : 0) + 30; }
// The ayat start at the app's size and get smaller, as a smaller text setting would, down to four fifths of it;
// a card still taller than the frame scrolls with the reading, as it does on the phone.
function room(card) { return HEIGHT - header() - BOTTOM - (INPUT.cards[card].starts.length > 1 ? 40 * K : 0); }
function layout(card, option) {
  var key = card + ':' + option;
  if (layouts[key]) return layouts[key];
  for (var size = M.ayahSize * K; ; size -= 2) {
    var laid = measureCard(card, option, size);
    if (size <= M.ayahSize * K * 0.8 || laid.height <= room(card)) return (layouts[key] = laid);
  }
}
// How far a tall card has scrolled to keep the word read about a third of the way down the frame.
// The partner shown: the one being read, the last one read once the card is done, else the first.
function optionOf(card, step, done) {
  var steps = INPUT.cards[card].steps, last = steps[steps.length - 1];
  var at = step || (done ? last : undefined);
  return at && at.option !== undefined ? at.option : 0;
}
function scrollFor(card, step) {
  var frame = layout(card, step && step.option !== undefined ? step.option : 0), space = room(card), over = frame.height - space;
  if (over <= 0 || !step) return 0;
  var y = frame.spots[step.side + ':' + step.ayah + ':' + step.word];
  return y === undefined ? 0 : Math.max(0, Math.min(over, y - space / 3));
}

function rope(x, y, color) {
  ctx.save(); ctx.translate(x - 6 * K, y); ctx.scale(K, K); ctx.strokeStyle = color; ctx.lineWidth = 1.25;
  ctx.stroke(new Path2D('M6 0 C 0 6, 0 14, 6 20 C 12 26, 12 34, 6 40')); ctx.restore();
}
function rule(x1, x2, y, color, dash) {
  ctx.save(); ctx.strokeStyle = color; ctx.lineWidth = 1 * K; ctx.setLineDash(dash || []);
  ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke(); ctx.restore();
}

// The card box as the app draws it, shifted by dx while it slides; step is the word being read (none before or after the reading).
function drawCard(card, step, at, done, dx, scroll) {
  var frame = layout(card, optionOf(card, step, done)), data = INPUT.cards[card];
  var bars = data.starts.length > 1, space = room(card);
  ctx.save(); ctx.translate(dx, 0);
  var left = PAGE, top = header() + Math.max(0, (space - frame.height) / 2) - (scroll || 0);
  // A card taller than the frame shows through a window between the name on top and the bars below.
  if (frame.height > space) { ctx.save(); ctx.beginPath(); ctx.rect(0, header(), WIDTH, space); ctx.clip(); }
  ctx.fillStyle = look.card; box(left, top, CARD_W, frame.height, M.radius * K); ctx.fill();
  ctx.strokeStyle = look.rule; ctx.lineWidth = M.border * K; box(left + 0.5 * K, top + 0.5 * K, CARD_W - K, frame.height - K, M.radius * K); ctx.stroke();
  var x0 = left + PAD, right = x0 + INNER, y = top + PAD, size = frame.size;
  frame.rows.forEach(function (row, i) {
    if (i > 0) y += row.top !== undefined ? row.top : M.gap * K;
    if (row.kind === 'head') uiText(row.text, right, y + row.h / 2, LABEL, look.muted, 'right');
    else if (row.kind === 'back') uiText('قبلُ في السورة', right, y + row.h / 2, NOTE, look.muted, 'right');
    else if (row.kind === 'range') uiText(row.label, x0 + INNER / 2, y + row.h / 2, NOTE, look.muted);
    else if (row.kind === 'rule') rule(x0, right, y + row.h / 2, look.rule, row.dashed ? [3 * K, 3 * K] : null);
    else if (row.kind === 'dotted') {
      var mid = y + row.h / 2;
      if (row.label) {
        ctx.font = NOTE + 'px ' + look.ui; var w = ctx.measureText(row.label).width, c = x0 + INNER / 2;
        rule(x0, c - w / 2 - 8 * K, mid, look.rule, [1 * K, 2 * K]); rule(c + w / 2 + 8 * K, right, mid, look.rule, [1 * K, 2 * K]);
        uiText(row.label, c, mid, NOTE, look.muted);
      } else rule(x0, right, mid, look.rule, [1 * K, 2 * K]);
    }
    else if (row.kind === 'silent') {
      var c2 = x0 + INNER / 2;
      rope(c2, y + 4 * K, look.rule); uiText(row.note, c2, y + (4 + 40 + 4 + 11) * K, ui(14), look.muted); rope(c2, y + (4 + 40 + 4 + 22 + 4) * K, look.rule);
    }
    else if (row.kind === 'ayat') drawAyat(row, x0, y, step, size);
    y += row.h;
  });
  if (frame.height > space) ctx.restore();
  if (bars) {
    var gap = M.bar.gap * K, n = data.starts.length, w2 = (CARD_W - gap * (n - 1)) / n, by = header() + Math.min(space, frame.height + Math.max(0, (space - frame.height) / 2)) + 4 * K + 9 * K;
    data.starts.forEach(function (start, i) {
      ctx.fillStyle = done || start <= at ? look.green : look.rule;
      box(left + CARD_W - (i + 1) * w2 - i * gap, by, w2, M.bar.height * K, M.bar.radius * K); ctx.fill();
    });
  }
  ctx.restore();
}

// One stretch of ayat: same word in the accent, same root in purple, the lit word and its partner on the highlight, the word read underlined on the page's deeper shade.
function drawAyat(row, x0, y, step, size) {
  var piece = row.piece, base = piece.plain ? look.muted : look.ink;
  if (row.inset) { ctx.fillStyle = piece.picked ? look.accent : 'transparent'; if (piece.picked) ctx.fillRect(x0 + INNER - M.pickBar * K, y, M.pickBar * K, row.h); }
  ctx.direction = 'rtl'; ctx.textAlign = 'right'; ctx.font = size + 'px ' + look.font;
  row.laid.words.forEach(function (word) {
    var t = word.token, x = x0 + word.x, baseline = y + word.row * row.line + row.line / 2 + size * 0.32;
    var reading = !piece.plain && step && step.side === row.side && step.ayah === t.ayah && step.word === t.word;
    var lit = !piece.plain && step && step.link && t.link === step.link;
    if (lit || reading) { ctx.fillStyle = lit ? look.highlight : look.deep; ctx.fillRect(x - word.w, baseline - size * 1.05, word.w, size * 1.55); }
    ctx.fillStyle = t.seal ? look.accent : lit ? look.onHighlight : t.kind ? look.marks[t.kind] : base;
    ctx.fillText(t.text, x, baseline);
    if (reading) { ctx.fillStyle = look.accent; ctx.fillRect(x - word.w, baseline + size * 0.3, word.w, Math.max(2, size / 22)); }
  });
}

function subline() {
  return [INPUT.subtitle, INPUT.part].filter(Boolean).join(' · ');
}
// The pair's name in its rounded frame, as at the top of the compare tab; under it the story, the part and which card of how many.
function heading(card) {
  var size = ui(M.title.size), padX = M.title.padX * K, padY = M.title.padY * K;
  ctx.font = size + 'px ' + look.ui;
  var w = Math.min(WIDTH - 2 * PAGE, ctx.measureText(INPUT.title).width + 2 * padX), h = size + 2 * padY;
  ctx.strokeStyle = look.rule; ctx.lineWidth = 1 * K; box(WIDTH / 2 - w / 2, TOP, w, h, M.title.radius * K); ctx.stroke();
  uiText(INPUT.title, WIDTH / 2, TOP + h / 2, size, look.ink);
  var under = [subline(), many && INPUT.counters ? INPUT.counters[card] : ''].filter(Boolean).join(' · ');
  if (under) uiText(under, WIDTH / 2, TOP + h + 40, ui(13), look.muted);
}

// The end frame (shared OUTRO): the emblem, the app's name and slogan, and where the next part goes on.
function endFrame(alpha) {
  outro(ctx, logo, { width: WIDTH, height: HEIGHT, k: K, alpha: alpha, paper: look.paper, ink: look.ink, muted: look.muted, ui: look.ui }, INPUT.next, look.accent);
}

var SCROLL = 450;
// Once read, a tall card glides to its end, so the other surah's side shows too before the next card.
function finalScroll(card) {
  var frame = layout(card, optionOf(card, undefined, true));
  return Math.max(0, frame.height - room(card));
}
function stepIndex(ends, local) { var i = 0; while (i < ends.length && ends[i] <= local) i++; return i; }
function ease(p) { return p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; }

function draw(t) {
  var segments = INPUT.timeline, segment = segments[segments.length - 1];
  for (var s = 0; s < segments.length; s++) if (t < segments[s].end) { segment = segments[s]; break; }
  var local = Math.max(0, t - segment.start), length = segment.end - segment.start;
  ctx.globalAlpha = 1; ctx.fillStyle = look.paper; ctx.fillRect(0, 0, WIDTH, HEIGHT);
  if (segment.kind === 'end') {
    // The last card fades out as the emblem fades in.
    var p = Math.min(1, local / FADE), lastCard = INPUT.cards.length - 1;
    ctx.globalAlpha = 1 - p; heading(lastCard); drawCard(lastCard, undefined, INPUT.cards[lastCard].steps.length, true, 0, finalScroll(lastCard));
    endFrame(p);
    return { card: lastCard, at: 1, total: 1 };
  }
  if (segment.kind === 'slide') {
    var q = ease(Math.min(1, local / length)), from = INPUT.cards[segment.from];
    heading(q < 0.5 ? segment.from : segment.to);
    // Forward in Arabic: the card read moves off to the right and the next comes in from the left, as swiping in the app.
    drawCard(segment.from, undefined, from.steps.length, true, q * WIDTH, finalScroll(segment.from));
    drawCard(segment.to, undefined, 0, false, (q - 1) * WIDTH, 0);
    return { card: segment.to, at: 0, total: 1 };
  }
  var card = INPUT.cards[segment.card], at = stepIndex(segment.ends, local), done = at >= card.steps.length;
  heading(segment.card);
  // The scroll glides from the last word's place to this one's.
  var to = done ? finalScroll(segment.card) : scrollFor(segment.card, card.steps[at]);
  var from = at > 0 ? scrollFor(segment.card, card.steps[at - 1]) : 0, since = at > 0 ? local - segment.ends[at - 1] : local;
  drawCard(segment.card, done ? undefined : card.steps[at], at, done, 0, from + (to - from) * ease(Math.min(1, since / SCROLL)));
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
  ready(logo, [look.font, look.ui], function () { recorder.start(); start = performance.now(); started(); requestAnimationFrame(tick); });
}
`;
