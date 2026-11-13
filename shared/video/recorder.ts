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

/** Starts once the Quran font and the emblem have loaded, so the first frame already has both. */
export const READY = String.raw`
function ready(logo, font, go) {
  var left = 2, once = function () { if (--left === 0) go(); };
  if (logo.complete) once(); else { logo.onload = once; logo.onerror = once; }
  if (document.fonts && document.fonts.load) document.fonts.load('40px ' + font).then(once, once); else once();
}
`;
