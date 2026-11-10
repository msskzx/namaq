import sizes from './treeSizes.json';
import { readJson, writeJson } from './storage';
import type { Presentation } from './branches';

/** A tree's drawn size both ways: [side width, side height, top-down width, top-down height]. */
export type Sized = [number, number, number, number];
/** The shipped sizes also keep how many ayat the whole tree holds, to tell a tree a filter cut down. */
export type Shipped = [number, number, number, number, number];
export type TreeSizes = Record<string, Sized>;

const bundled = sizes as Record<string, number[]> as Record<string, Shipped>;
const SAVED = 'tree-sizes';
const KEEP = 400;

export const sizeKey = (id: string, around: boolean) => around ? `${id}+` : id;

/** A tree a filter cut down has another shape, so its size is kept under the ayat it still holds. */
const cutKey = (id: string, presentation: Presentation, around: boolean) => sizeKey(`${id}|${presentation.ayat.map(ayah => ayah.key).join(',')}`, around);

let saved: TreeSizes | undefined;
const savedSizes = () => (saved ??= readJson<TreeSizes>(SAVED) ?? {});

/** The tree's sizes: measured by `npm run tree-sizes` for whole trees, or on this phone the first time a filtered one opened. */
export function sizesOf(id: string, presentation: Presentation, around: boolean): Sized | undefined {
  const whole = bundled[sizeKey(id, around)];
  if (whole && whole[4] === presentation.ayat.length) return whole.slice(0, 4) as Sized;
  return savedSizes()[cutKey(id, presentation, around)];
}

export function saveSizes(id: string, presentation: Presentation, around: boolean, sizes: Sized) {
  const all = savedSizes();
  all[cutKey(id, presentation, around)] = sizes;
  const keys = Object.keys(all);
  for (const old of keys.slice(0, Math.max(0, keys.length - KEEP))) delete all[old];
  writeJson(SAVED, all);
}
