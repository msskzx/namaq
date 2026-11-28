import { keyStore } from './storage';

export type BarPlace = { x: number; y: number; folded: boolean };
export type BarPlaces = Record<string, BarPlace>;

const isShare = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;
const isBarPlace = (value: unknown): value is BarPlace => !!value && typeof value === 'object'
  && isShare((value as BarPlace).x) && isShare((value as BarPlace).y) && typeof (value as BarPlace).folded === 'boolean';

const NONE: BarPlaces = {};
export function parseBarPlaces(raw: string | null): BarPlaces {
  try {
    const value: unknown = raw ? JSON.parse(raw) : null;
    if (!value || typeof value !== 'object' || Array.isArray(value)) return NONE;
    return Object.fromEntries(Object.entries(value).filter(([, place]) => isBarPlace(place))) as BarPlaces;
  } catch { return NONE; }
}

const store = keyStore('floating-bars', parseBarPlaces);
export const readBarPlaces = store.read;
export const subscribeBarPlaces = store.subscribe;
export const serverBarPlaces = () => NONE;

export function keepBarPlace(id: string, centre: { x: number; y: number }, screen: { width: number; height: number }, folded: boolean) {
  const share = (at: number, of: number) => Math.min(1, Math.max(0, of > 0 ? at / of : 0.5));
  store.write(JSON.stringify({ ...readBarPlaces(), [id]: { x: share(centre.x, screen.width), y: share(centre.y, screen.height), folded } }));
}

export function clampBox(centre: { x: number; y: number }, box: { width: number; height: number }, screen: { width: number; height: number }, clear: { top: number; bottom: number; side: number }) {
  'worklet';
  const left = Math.min(Math.max(clear.side, screen.width - clear.side - box.width), Math.max(clear.side, centre.x - box.width / 2));
  const top = Math.min(Math.max(clear.top, screen.height - clear.bottom - box.height), Math.max(clear.top, centre.y - box.height / 2));
  return { left, top };
}
