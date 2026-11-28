import sizes from './treeSizes.json';
import { arrayOf, isNumberIn, isRecord, readJson, writeJson } from './storage';
import type { Presentation } from './branches';

export type Sized = [number, number, number, number];
export type Shipped = [number, number, number, number, number];
export type TreeSizes = Record<string, Sized>;

const bundled = sizes as Record<string, number[]> as Record<string, Shipped>;
const SAVED = 'tree-sizes-2';
const KEEP = 400;

export const sizeKey = (id: string, around: boolean) => around ? `${id}+` : id;

const cutKey = (id: string, presentation: Presentation, around: boolean) => sizeKey(`${id}|${presentation.ayat.map(ayah => ayah.key).join(',')}`, around);

let saved: TreeSizes | undefined;
const savedSizes = () => (saved ??= Object.fromEntries(Object.entries(readJson(SAVED, isRecord) ?? {}).filter(([, sized]) => arrayOf(isNumberIn(-Infinity, Infinity))(sized) && sized.length === 4)) as TreeSizes);

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
