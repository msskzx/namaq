import { FLOW_LINE, flowFontSize } from '@shared/quran/quranText/flow';

export const MAX_ZOOM = 2.2;

export function settleZoom(zoom: number) {
  'worklet';
  return zoom < 1.1 ? 1 : Math.min(MAX_ZOOM, Math.round(zoom * 20) / 20);
}

export const flowSize = (bodyWidth: number, zoom: number) => flowFontSize(bodyWidth, zoom);

export { FLOW_LINE };

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

export function landingPage(at: number, moved: number, velocity: number, width: number, count: number) {
  'worklet';
  const flick = Math.abs(velocity) > 500;
  const far = flick || Math.abs(moved) > width * 0.2;
  const forward = flick ? velocity > 0 : moved > 0;
  return far && (forward ? at + 1 < count : at > 0) ? at + (forward ? 1 : -1) : at;
}
