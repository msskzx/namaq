import { APP_NAME, OPENING, SLOGAN } from '../brand';
import { UI_SCALE } from '../quran/compareCardLook';

// Pieces every recorder page shares, the website's and the app's: plain JavaScript in strings, since they run inside the page.

/** The types tried in order: MP4 shares everywhere; WebM is the fallback some Android phones record. */
export const VIDEO_TYPES = ['video/mp4;codecs=avc1', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'];

/**
 * Pausing while it records, for both recorders: the app sends {type: 'pause'} or {type: 'resume'} into the page,
 * the clock (start) skips the paused time and the recorder leaves it out, as on the website.
 */
export const PAUSE = String.raw`
var pausedAt = 0, hiddenPause = false;
function hold() { if (pausedAt) return; pausedAt = performance.now(); if (recorder.state === 'recording') recorder.pause(); }
function go() { if (!pausedAt) return; start += performance.now() - pausedAt; pausedAt = 0; if (recorder.state === 'paused') recorder.resume(); }
function control(event) {
  var data; try { data = JSON.parse(event.data); } catch (e) { return; }
  if (data.type === 'pause') hold();
  if (data.type === 'resume') go();
}
// Paused before the font and emblem had loaded: the recording starts paused, and the wait so far doesn't count.
function started() { if (pausedAt) { pausedAt = performance.now(); recorder.pause(); } }
window.addEventListener('message', control); document.addEventListener('message', control);
// A hidden tab stops drawing but not the clock, so the recording pauses while the page is out of sight.
document.addEventListener('visibilitychange', function () {
  if (document.hidden && !pausedAt) { hiddenPause = true; hold(); }
  else if (!document.hidden && hiddenPause) { hiddenPause = false; go(); }
});
`;

/** Starts once the fonts (one name or several: the Quran font, the interface font) and the emblem have loaded, so the first frame already has them. */
export const READY = String.raw`
function ready(logo, fonts, go) {
  fonts = [].concat(fonts);
  var left = 1 + fonts.length, once = function () { if (--left === 0) go(); };
  if (logo.complete) once(); else { logo.onload = once; logo.onerror = once; }
  fonts.forEach(function (font) { if (document.fonts && document.fonts.load) Promise.all([document.fonts.load('40px ' + font), document.fonts.load('bold 40px ' + font)]).then(once, once); else once(); });
}
`;

/**
 * Every video's end frame, as the app's opening screen: the emblem, the app's name in bold and the slogan under it, centred
 * in a frame of width × height at k pixels a point. The only place a video shows the emblem (owner, 2026-11-14).
 * `o` = { width, height, k, alpha, paper, ink, muted, ui }; `under` is an optional line under the slogan (where the next part goes on).
 */
export const OUTRO = String.raw`
var BRAND = ${JSON.stringify({ name: APP_NAME, slogan: SLOGAN, sizes: OPENING, scale: UI_SCALE })};
function outro(ctx, logo, o, under, underColor) {
  var s = BRAND.sizes, k = o.k, ui = function (size) { return Math.round(size * BRAND.scale) * k; };
  var logoSize = s.logo * k, name = ui(s.name), slogan = ui(s.slogan);
  var total = logoSize + s.gap * k + name * 1.4 + s.nameGap * k + slogan * 1.4 + (under ? 40 * k : 0);
  var y = (o.height - total) / 2;
  ctx.save();
  ctx.globalAlpha = o.alpha; ctx.fillStyle = o.paper; ctx.fillRect(0, 0, o.width, o.height);
  if (logo && logo.complete && logo.naturalWidth) ctx.drawImage(logo, o.width / 2 - logoSize / 2, y, logoSize, logoSize);
  y += logoSize + s.gap * k;
  ctx.direction = 'rtl'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillStyle = o.ink; ctx.font = 'bold ' + name + 'px ' + o.ui; ctx.fillText(BRAND.name, o.width / 2, y + name * 0.7);
  y += name * 1.4 + s.nameGap * k;
  ctx.fillStyle = o.muted; ctx.font = slogan + 'px ' + o.ui; ctx.fillText(BRAND.slogan, o.width / 2, y + slogan * 0.7);
  y += slogan * 1.4;
  if (under) { ctx.fillStyle = underColor || o.muted; ctx.fillText(under, o.width / 2, y + 40 * k - slogan * 0.3); }
  ctx.restore();
}
`;

/** The same end frame for a canvas drawn on the page itself (the website's tree video). */
export const outroDrawer = (): ((ctx: CanvasRenderingContext2D, logo: HTMLImageElement | null, o: { width: number; height: number; k: number; alpha: number; paper: string; ink: string; muted: string; ui: string }) => void) =>
  new Function(`${OUTRO}; return outro;`)();
