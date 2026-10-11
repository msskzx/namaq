import { describe, expect, it } from 'vitest';
import data from '@/app/quran/iltifat/ayat.json';
import { buildCurated, CURATED, MODES, resolve, USED_MODES } from './curatedShifts';
import { ayahWords } from './normalize';
import { ARC_MIN } from './shifts';

const words = (key: string) => ayahWords(data.ayat[key as keyof typeof data.ayat], false);
const view = buildCurated(data);
const slotsOf = (surah: number, ayah: number) =>
  view.find(v => v.surah.number === surah)!.parts.flatMap(p => p.ayat.map((a, k) => ({ ayah: p.from + k, ...a }))).find(a => a.ayah === ayah)!;
const colored = (surah: number, ayah: number) => {
  const { text, slots = {} } = slotsOf(surah, ayah);
  return Object.fromEntries(text.split(' ').flatMap((w, i) => (i in slots ? [[w, slots[i]]] : [])));
};

const slotOfWord = (surah: number, ayah: number, plain: string) => slotsOf(surah, ayah).slots?.[words(`${surah}:${ayah}`).norm.indexOf(plain)];

describe('CURATED', () => {
  it('leaves 43:36-37 out, which is not an address shift', () => {
    expect(CURATED.some(c => c.surah === 43 && c.parts.some(([from]) => from >= 36))).toBe(false);
  });

  it('has two parts at most, in order', () => {
    for (const c of CURATED) {
      expect(c.parts.length).toBeLessThanOrEqual(2);
      expect(c.parts.every(([from, to]) => from <= to)).toBe(true);
    }
  });

  it('has the text of every ayah each shift names', () => {
    for (const c of CURATED) {
      for (let a = c.parts[0][0]; a <= c.parts[c.parts.length - 1][1]; a++) expect(data.ayat).toHaveProperty([`${c.surah}:${a}`]);
    }
  });

  it('resolves every marked phrase exactly once, inside the shift', () => {
    for (const c of CURATED) {
      for (const [ayah, marks] of Object.entries(c.marks)) {
        expect(Number(ayah)).toBeGreaterThanOrEqual(c.parts[0][0]);
        expect(Number(ayah)).toBeLessThanOrEqual(c.parts[c.parts.length - 1][1]);
        for (const m of marks) expect(resolve(words(`${c.surah}:${ayah}`).norm, m).length).toBe(m[0] === '*' ? words(`${c.surah}:${ayah}`).norm.length : m[0].split(' ').length);
      }
    }
  });

  it('throws for a phrase found twice or not at all', () => {
    const norm = words('1:7').norm;
    expect(() => resolve(norm, ['عليهم', 'third'])).toThrow();
    expect(() => resolve(norm, ['اياك', 'second'])).toThrow();
    expect(resolve(norm, ['عليهم', 'third', 'المغضوب عليهم'])).toEqual([6]);
  });

  it('gives each mode its own slot, apart from the amber of repeated phrases', () => {
    const slots = Object.values(MODES).map(m => m.slot);
    expect(new Set(slots).size).toBe(slots.length);
    expect(slots).not.toContain(0);
  });

  it('colors one mode the same in every shift', () => {
    for (const c of CURATED) {
      for (const [ayah, marks] of Object.entries(c.marks)) {
        const { slots = {} } = slotsOf(c.surah, Number(ayah));
        for (const m of marks) for (const i of resolve(words(`${c.surah}:${ayah}`).norm, m)) expect(slots[i]).toBe(MODES[m[1]].slot);
      }
    }
  });

  it('marks أرسل as third person and فسقناه and فأحيينا as first person in 35:9, leaving الرياح plain', () => {
    expect(colored(35, 9)).toMatchObject({
      'أَرۡسَلَ': MODES.third.slot,
      'فَسُقۡنَـٰهُ': MODES.first.slot,
      'فَأَحۡیَیۡنَا': MODES.first.slot,
    });
    expect(colored(35, 9)).not.toHaveProperty(['ٱلرِّیَـٰحَ']);
  });

  it('colors مهتدون and مقتدون in 43:22-23 differently, inside the amber clause', () => {
    expect(slotOfWord(43, 22, 'مهتدون')).toBe(MODES.first.slot);
    expect(slotOfWord(43, 23, 'مقتدون')).toBe(MODES.second.slot);
    expect(Object.values(slotsOf(43, 22).slots ?? {}).length).toBeGreaterThanOrEqual(ARC_MIN);
  });

  it('colors 12:80-83 by speaker: the eldest, his brothers\' words inside his speech, then the father', () => {
    const [eldest, brothers, father] = [MODES.first.slot, MODES.third.slot, MODES.second.slot];
    expect(new Set(Object.values(slotsOf(12, 80).slots ?? {}))).toEqual(new Set([eldest]));
    expect(new Set(Object.values(slotsOf(12, 81).slots ?? {}))).toEqual(new Set([eldest, brothers]));
    expect(new Set(Object.values(slotsOf(12, 82).slots ?? {}))).toEqual(new Set([brothers]));
    expect(new Set(Object.values(slotsOf(12, 83).slots ?? {}))).toEqual(new Set([father]));
  });

  it('colors 10:22 in three runs: addressed to them, said about them, said by them', () => {
    expect(slotOfWord(10, 22, 'يسيركم')).toBe(MODES.third.slot);
    expect(slotOfWord(10, 22, 'كنتم')).toBe(MODES.third.slot);
    expect(slotOfWord(10, 22, 'وفرحوا')).toBe(MODES.first.slot);
    expect(slotOfWord(10, 22, 'وجاءهم')).toBe(MODES.first.slot);
    expect(slotOfWord(10, 22, 'لنكونن')).toBe(MODES.second.slot);
    expect(slotOfWord(10, 22, 'هو')).toBeUndefined();
    expect(new Set(Object.values(slotsOf(10, 22).slots ?? {}))).toEqual(new Set([1, 2, 3]));
  });

  it('keeps Al-Fatiha to him in 2-4 and you in 5-7, and leaves 40:26 to the qira\'at page', () => {
    for (const a of [2, 3, 4, 5, 6, 7]) expect(Object.values(slotsOf(1, a).slots ?? {})).not.toContain(MODES.first.slot);
    expect(slotsOf(1, 7).slots).toEqual({ 2: MODES.second.slot });
    expect(CURATED.some(c => c.surah === 40)).toBe(false);
  });

  it('lists exactly the modes the shifts use', () => {
    const used = new Set(CURATED.flatMap(c => Object.values(c.marks).flat().map(([, mode]) => mode)));
    expect(new Set(USED_MODES)).toEqual(used);
  });

  it('runs Al-Fatiha from 2 to 7', () => {
    expect(CURATED.find(c => c.surah === 1)!.parts).toEqual([[2, 4], [5, 7]]);
  });
});
