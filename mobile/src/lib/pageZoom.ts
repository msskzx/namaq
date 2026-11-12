/** How far the mushaf page can be zoomed: the same 15 lines and page break, drawn bigger, moved inside the page's frame. */
export const MAX_ZOOM = 3;

/** A pinch that ends near the whole page snaps back to it. */
export function settleZoom(zoom: number) {
  'worklet';
  return zoom < 1.05 ? 1 : Math.min(MAX_ZOOM, zoom);
}

/**
 * One drag coordinate split between the zoomed page and what lies past its edge: the page moves until its edge shows
 * (offset between `min` and 0), and the rest of the drag spills over to the row of pages or the pull-down.
 */
export function splitDrag(drag: number, min: number) {
  'worklet';
  const offset = Math.min(0, Math.max(min, drag));
  return { offset, spill: drag - offset };
}

/** The page a drag lands on: a flick turns the way it went, a slow drag turns once it went far enough. Pages are 0-based here. */
export function landingPage(at: number, moved: number, velocity: number, width: number, count: number) {
  'worklet';
  const flick = Math.abs(velocity) > 500;
  const far = flick || Math.abs(moved) > width * 0.2;
  const forward = flick ? velocity > 0 : moved > 0;
  return far && (forward ? at + 1 < count : at > 0) ? at + (forward ? 1 : -1) : at;
}
