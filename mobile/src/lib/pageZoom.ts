/**
 * Reader text size. 1 is the printed page: 15 lines fitted to the screen. Bigger is a bigger font, not a bigger picture:
 * the page's words wrap onto more lines at the screen's width and the page grows taller, read by scrolling down
 * (owner, 2026-11-13: a pinch had scaled the page as a picture, blurry and cut off at the sides).
 */
export const MAX_ZOOM = 2.2;

/** A pinch that ends near the printed page snaps back to it. */
export function settleZoom(zoom: number) {
  'worklet';
  return zoom < 1.1 ? 1 : Math.min(MAX_ZOOM, Math.round(zoom * 20) / 20);
}

/** The font size of a page set as flowing text, from the page body's width: about the printed page's size at 1, the same on every page. */
export const flowSize = (bodyWidth: number, zoom: number) => bodyWidth * 0.063 * zoom;

/** The height of one flowing line, for the font size: the Hafs font's marks sit far above and below its letters. */
export const FLOW_LINE = 1.7;

/**
 * Breaks a run of words into lines no wider than `width`. `widths` are the words' widths at the drawn size and `gap` the
 * least space between two words. A word wider than the line gets a line of its own. Returns the index of each line's first word.
 */
export function breakLines(widths: number[], width: number, gap: number) {
  const starts: number[] = [];
  let used = Infinity;
  widths.forEach((w, at) => {
    if (used + gap + w > width) {
      starts.push(at);
      used = w;
    } else used += gap + w;
  });
  return starts;
}

/** The page a drag lands on: a flick turns the way it went, a slow drag turns once it went far enough. Pages are 0-based here. */
export function landingPage(at: number, moved: number, velocity: number, width: number, count: number) {
  'worklet';
  const flick = Math.abs(velocity) > 500;
  const far = flick || Math.abs(moved) > width * 0.2;
  const forward = flick ? velocity > 0 : moved > 0;
  return far && (forward ? at + 1 < count : at > 0) ? at + (forward ? 1 : -1) : at;
}
