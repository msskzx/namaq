export type Camera = { s: number; x: number; y: number };
export type Size = { width: number; height: number };

export const MAX_SCALE = 3;
const MAX_FIT = 1.4;

export function fitCamera(content: Size, view: Size): Camera {
  'worklet';
  const s = Math.min(MAX_FIT, view.width / content.width, view.height / content.height);
  return { s, x: (view.width - content.width * s) / 2, y: (view.height - content.height * s) / 2 };
}

export function zoomAt(camera: Camera, factor: number, fx: number, fy: number, min: number): Camera {
  'worklet';
  const s = Math.min(MAX_SCALE, Math.max(min * 0.6, camera.s * factor));
  const k = s / camera.s;
  return { s, x: fx - (fx - camera.x) * k, y: fy - (fy - camera.y) * k };
}

export function clampCamera(camera: Camera, content: Size, view: Size): Camera {
  'worklet';
  const axis = (offset: number, length: number, room: number) => {
    const drawn = length * camera.s;
    if (drawn <= room) return (room - drawn) / 2;
    return Math.min(0, Math.max(room - drawn, offset));
  };
  return { s: camera.s, x: axis(camera.x, content.width, view.width), y: axis(camera.y, content.height, view.height) };
}

export function settleCamera(camera: Camera, content: Size, view: Size): Camera {
  'worklet';
  const fit = fitCamera(content, view);
  return camera.s <= fit.s * 1.02 ? fit : clampCamera(camera, content, view);
}

export const isZoomed = (camera: Camera, content: Size, view: Size) => {
  'worklet';
  return camera.s > fitCamera(content, view).s * 1.02;
};

export const DOWN_GAIN = 1.15;
export function pickDirection(side: Size, down: Size, view: Size): 'side' | 'down' {
  const fit = (size: Size) => Math.min(MAX_FIT, view.width / size.width, view.height / size.height);
  return fit(down) > fit(side) * DOWN_GAIN ? 'down' : 'side';
}

