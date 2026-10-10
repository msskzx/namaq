import { describe, expect, it } from 'vitest';
import compare from './compare.fixture.json';
import own from './shifts.fixture.json';
import { ayahWords } from './normalize';
import { ARC_MIN, findOpeners, findShifts, REFRAIN_MANY } from './shifts';

const fx = { ...compare, ...own } as Record<string, string[]>;
const surah = (n: number) => fx[n].map((t, i) => ayahWords(t, i === 0 && n !== 1 && n !== 9));
const words = (...ayat: string[]) => ayat.map(t => ayahWords(t, false));

describe('findShifts', () => {
  it('catches the clause 43:22 and 43:23 share, at the arc minimum', () => {
    const { arcs } = findShifts(surah(43));
    const arc = arcs.find(a => a.a.ayah === 22 && a.b.ayah === 23)!;
    expect(arc.len).toBeGreaterThanOrEqual(8);
    expect(arc.len).toBeGreaterThanOrEqual(ARC_MIN);
  });

  it('collapses the refrains of Ash-Shu\'ara into lanes, not arcs', () => {
    const { arcs, refrains } = findShifts(surah(26));
    const lane = refrains.find(r => r.len >= 6 && r.at.length === 8)!;
    expect(lane).toBeDefined();
    expect(arcs.some(a => a.a.ayah === lane.at[0].ayah && a.a.word === lane.at[0].word)).toBe(false);
  });

  it('keeps Ar-Rahman from flooding arcs: one lane of 31 ticks', () => {
    const { arcs, refrains } = findShifts(surah(55));
    expect(arcs.length).toBeLessThan(5);
    expect(refrains[0].at).toHaveLength(31);
  });

  it('accepts a three-word refrain seen many times (77)', () => {
    const { refrains } = findShifts(surah(77));
    expect(refrains[0].len).toBe(3);
    expect(refrains[0].at.length).toBeGreaterThanOrEqual(REFRAIN_MANY);
  });

  it('drops a three-word run seen only a few times', () => {
    const r = findShifts(words('هذا نص قصير جدا', 'ثم هذا نص قصير', 'وهذا نص قصير'));
    expect(r.refrains).toEqual([]);
  });

  it('does not pair a run with itself across overlap or inside one ayah', () => {
    expect(findShifts(words('الف باء جيم دال الف باء جيم دال')).arcs).toEqual([]);
  });
});

describe('findOpeners', () => {
  it('reads the verb form, with a leading و or ف', () => {
    const forms = findOpeners(words('قال الف', 'وقالوا باء', 'فقالت جيم', 'وقل دال', 'قالا هاء')).map(o => o.form);
    expect(forms).toEqual(['male', 'group', 'woman', 'command', 'group']);
  });

  it('counts the openers of Yusuf, and finds the dense run in Musa and al-Khidr', () => {
    const yusuf = findOpeners(surah(12));
    expect(yusuf).toHaveLength(73);
    const khidr = findOpeners(surah(18)).filter(o => o.ayah >= 66 && o.ayah <= 78).map(o => o.form);
    expect(khidr.length).toBeGreaterThanOrEqual(6);
  });
});
