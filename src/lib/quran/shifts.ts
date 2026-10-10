// docs/plans/quran-within-surah.md
import type { AyahWords } from './normalize';

export type Occ = { ayah: number; word: number };
export type Arc = { a: Occ; b: Occ; len: number };
export type Refrain = { text: string; len: number; at: Occ[] };
export type Opener = { ayah: number; word: number; form: Form };
export type Form = 'male' | 'group' | 'woman' | 'command';

export const ARC_MIN = 4;
export const REFRAIN_MIN = 3;
export const REFRAIN_MANY = 5;
const GRAM = 3;

const FORMS: Record<string, Form> = { قال: 'male', قالوا: 'group', قالا: 'group', قالت: 'woman', قل: 'command' };

export function findShifts(ayat: AyahWords[]): { arcs: Arc[]; refrains: Refrain[] } {
  const w: string[] = [];
  const pos: Occ[] = [];
  ayat.forEach((a, k) => {
    w.push('#');
    pos.push({ ayah: k + 1, word: -1 });
    a.norm.forEach((x, word) => {
      w.push(x);
      pos.push({ ayah: k + 1, word });
    });
  });

  const grams = new Map<string, number[]>();
  for (let i = 0; i + GRAM <= w.length; i++) {
    if (w.slice(i, i + GRAM).includes('#')) continue;
    const key = w.slice(i, i + GRAM).join(' ');
    grams.set(key, [...(grams.get(key) ?? []), i]);
  }

  const groups = new Map<string, { len: number; starts: Set<number> }>();
  for (const at of grams.values()) {
    for (let x = 0; x < at.length; x++) {
      for (let y = x + 1; y < at.length; y++) {
        const [i, j] = [at[x], at[y]];
        if (w[i - 1] === w[j - 1] && w[i - 1] !== '#') continue;
        let len = GRAM;
        while (j + len < w.length && i + len < j && w[i + len] === w[j + len] && w[i + len] !== '#') len++;
        const key = w.slice(i, i + len).join(' ');
        const group = groups.get(key) ?? { len, starts: new Set<number>() };
        group.starts.add(i).add(j);
        groups.set(key, group);
      }
    }
  }

  const arcs: Arc[] = [];
  const refrains: Refrain[] = [];
  for (const [text, { len, starts }] of groups) {
    const at = [...starts].sort((p, q) => p - q).map(s => pos[s]);
    if (starts.size === 2 && len >= ARC_MIN && at[0].ayah !== at[1].ayah) arcs.push({ a: at[0], b: at[1], len });
    else if (starts.size >= REFRAIN_MIN && (len > GRAM || starts.size >= REFRAIN_MANY)) refrains.push({ text, len, at });
  }
  const inLane = (at: Occ, len: number) => refrains.some(r => r.at.some(o => o.ayah === at.ayah && o.word < at.word + len && at.word < o.word + r.len));
  const lone = arcs.filter(a => !(inLane(a.a, a.len) && inLane(a.b, a.len)));
  const byPlace = (p: Occ, q: Occ) => p.ayah - q.ayah || p.word - q.word;
  return { arcs: lone.sort((p, q) => byPlace(p.a, q.a)), refrains: refrains.sort((p, q) => q.at.length - p.at.length || byPlace(p.at[0], q.at[0])) };
}

export function findOpeners(ayat: AyahWords[]): Opener[] {
  return ayat.flatMap((a, k) =>
    a.norm.flatMap((x, word) => {
      const form = FORMS[x] ?? FORMS[x.replace(/^[وف]/, '')];
      return form ? [{ ayah: k + 1, word, form }] : [];
    }),
  );
}
