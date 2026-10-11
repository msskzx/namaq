import { describe, expect, it } from 'vitest';
import data from '@/app/quran/oaths/ayat.json';
import { normalizeWord } from './normalize';
import { buildOaths, OATHS } from './oaths';

const { oaths, lines } = buildOaths(data);
const skeleton = (w: string) => normalizeWord(w).replace(/^ال/, '').replace(/[اي]/g, '');

describe('oaths', () => {
  it('keeps the oaths in mushaf order inside juz 26 to 30', () => {
    const keys = OATHS.map(o => o.surah * 1000 + o.range[0]);
    expect(keys).toEqual([...keys].sort((a, b) => a - b));
    expect(OATHS.every(o => o.surah >= 46 && o.surah <= 114)).toBe(true);
  });

  it('reads every ayah of every range from the stored text', () => {
    for (const o of oaths) {
      expect(o.lines.map(l => l.ayah)).toEqual(Array.from({ length: o.range[1] - o.range[0] + 1 }, (_, k) => o.range[0] + k));
      expect(o.lines.every(l => l.text.length > 0)).toBe(true);
    }
  });

  it('finds every word sworn by in the text of its own range', () => {
    for (const o of oaths) {
      const text = o.lines.map(l => l.text.split(' ').map(skeleton).join(' ')).join(' ');
      for (const w of o.by) expect(text, `${o.surah}:${o.range} ${w}`).toContain(skeleton(w));
    }
  });

  it('draws a line only for a word two oaths share, with a dot on each carrier', () => {
    expect(lines.length).toBeGreaterThan(0);
    for (const l of lines) {
      expect(l.has.size).toBeGreaterThan(1);
      expect([...l.has]).toEqual(oaths.filter(o => o.by.includes(l.id)).map(o => o.n));
      expect(l.first).toBe(Math.min(...l.has));
      expect(l.last).toBe(Math.max(...l.has));
    }
  });

  it('joins the night oaths of 81 and 92 but not 79 and 81 by their unnamed ones', () => {
    const night = lines.find(l => l.id === 'الليل')!;
    const at = (s: number) => oaths.find(o => o.surah === s)!.n;
    expect(night.has.has(at(81)) && night.has.has(at(92))).toBe(true);
    expect(lines.some(l => l.has.has(at(79)))).toBe(false);
  });

  it('throws when a range is missing from the data', () => {
    expect(() => buildOaths({ names: {}, ayat: {} })).toThrow(/missing/);
  });
});
