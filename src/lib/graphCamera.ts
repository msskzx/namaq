/**
 * Pure geometry for the graph workspace's camera behavior (see
 * docs/graph-layout.md, Q2/Q6, Phase three): deciding whether a
 * selected subject is comfortably visible given the floating panel/sheet
 * that overlays the canvas (src/components/graph/GraphCanvas.tsx), and how
 * far to pan -- without changing zoom -- to reveal it when it isn't.
 *
 * No I/O and no react-force-graph-2d dependency: GraphCanvas supplies
 * screen-space rectangles (from getBoundingClientRect) and the node's
 * current screen position (from the ForceGraph2D instance's own
 * graph2ScreenCoords), so this stays testable without a canvas.
 */

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

// The floating panel/bottom-sheet always spans one full edge of the
// viewport (a full-height sidebar on desktop, a full-width sheet on
// phone) -- detecting which edge from its own measured rect, rather than
// from language/breakpoint, means this keeps working under RTL and any
// future breakpoint change without special-casing either. A panel that
// doesn't span a full edge (e.g. the collapsed state's small floating
// corner icons) doesn't meaningfully obscure the canvas, so it's ignored.
export function usableRect(viewport: Rect, panel: Rect | null): Rect {
  if (!panel) return viewport;
  const spansFullHeight = panel.height >= viewport.height - 1;
  const spansFullWidth = panel.width >= viewport.width - 1;
  const touchesLeft = Math.abs(panel.x - viewport.x) < 1;
  const touchesRight = Math.abs(panel.x + panel.width - (viewport.x + viewport.width)) < 1;
  const touchesTop = Math.abs(panel.y - viewport.y) < 1;
  const touchesBottom = Math.abs(panel.y + panel.height - (viewport.y + viewport.height)) < 1;

  if (spansFullHeight && touchesLeft) {
    return { x: viewport.x + panel.width, y: viewport.y, width: viewport.width - panel.width, height: viewport.height };
  }
  if (spansFullHeight && touchesRight) {
    return { x: viewport.x, y: viewport.y, width: viewport.width - panel.width, height: viewport.height };
  }
  if (spansFullWidth && touchesBottom) {
    return { x: viewport.x, y: viewport.y, width: viewport.width, height: viewport.height - panel.height };
  }
  if (spansFullWidth && touchesTop) {
    return { x: viewport.x, y: viewport.y + panel.height, width: viewport.width, height: viewport.height - panel.height };
  }
  return viewport;
}

// "Comfortably" visible, not merely on-screen: shrinks the usable area by
// a margin on every side so a node right at its edge (e.g. half-hidden
// behind the panel's own drop shadow, or flush against the browser edge)
// still counts as needing a reveal.
export function isComfortablyVisible(point: Point, area: Rect, margin = 48): boolean {
  if (area.width <= margin * 2 || area.height <= margin * 2) {
    // The usable area is too small to define a margin inside it (e.g. a
    // phone with the sheet expanded to nearly the full screen) -- fall
    // back to the un-shrunk area rather than reporting everything as
    // obscured.
    return point.x >= area.x && point.x <= area.x + area.width && point.y >= area.y && point.y <= area.y + area.height;
  }
  return (
    point.x >= area.x + margin &&
    point.x <= area.x + area.width - margin &&
    point.y >= area.y + margin &&
    point.y <= area.y + area.height - margin
  );
}

// The world-space camera target that puts `nodeWorld` at the center of
// `area` instead of the center of `viewport` -- react-force-graph-2d's
// own `centerAt(x, y)` always centers on the full viewport, with no way to
// tell it to center on a sub-region directly, so this computes what world
// coordinate to hand it instead. Keeps zoom untouched, per Q2 ("retaining
// zoom") -- only the two centers' pixel offset matters, not scale.
export function centerTargetForReveal(nodeWorld: Point, area: Rect, viewport: Rect, zoom: number): Point {
  const areaCenter = { x: area.x + area.width / 2, y: area.y + area.height / 2 };
  const viewportCenter = { x: viewport.x + viewport.width / 2, y: viewport.y + viewport.height / 2 };
  const offsetPixels = { x: areaCenter.x - viewportCenter.x, y: areaCenter.y - viewportCenter.y };
  return { x: nodeWorld.x - offsetPixels.x / zoom, y: nodeWorld.y - offsetPixels.y / zoom };
}
