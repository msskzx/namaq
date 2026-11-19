import { keyStore } from './storage';

/**
 * Where each of the reader's floating bars was left (owner, 2026-11-19: the recite and listen bars float over the page,
 * go wherever they are dragged and stay there), app and website alike: its centre as shares of the screen, and whether
 * it is folded into a circle. A bar never dropped yet has no entry and sits at its starting place, low near the thumb.
 */
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

/** Keeps one bar's place: its centre in screen points over the screen's size, held inside the screen. */
export function keepBarPlace(id: string, centre: { x: number; y: number }, screen: { width: number; height: number }, folded: boolean) {
  const share = (at: number, of: number) => Math.min(1, Math.max(0, of > 0 ? at / of : 0.5));
  store.write(JSON.stringify({ ...readBarPlaces(), [id]: { x: share(centre.x, screen.width), y: share(centre.y, screen.height), folded } }));
}

/** A box's top left that keeps it on the screen, `side` from its sides and between `top` and `bottom` from its ends. */
export function clampBox(centre: { x: number; y: number }, box: { width: number; height: number }, screen: { width: number; height: number }, clear: { top: number; bottom: number; side: number }) {
  'worklet';
  const left = Math.min(Math.max(clear.side, screen.width - clear.side - box.width), Math.max(clear.side, centre.x - box.width / 2));
  const top = Math.min(Math.max(clear.top, screen.height - clear.bottom - box.height), Math.max(clear.top, centre.y - box.height / 2));
  return { left, top };
}
