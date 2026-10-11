import { describe, expect, it } from 'vitest';
import data from '@/app/quran/oaths/ayat.json';
import { normalizeWord } from './normalize';
import { buildOaths, OATHS } from './oaths';

const { oaths, lines } = buildOaths(data);
const skeleton = (w: string) => normalizeWord(w).replace(/^ال/, '').replace(/[اي]/g, '').replace(/^لل/, 'ل');
const sworn = (token: string, w: string) => [normalizeWord(token)].flatMap(n => [n, n.slice(1), n.slice(2)]).some(t => skeleton(t) === skeleton(w));

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
      const tokens = o.lines.flatMap(l => l.text.split(' '));
      for (const w of o.by) expect(tokens.some(t => sworn(t, w)), `${o.surah}:${o.range} ${w}`).toBe(true);
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

  it('joins one word across the article and the prefixes it is written with', () => {
    const at = (s: number, from = 0) => oaths.find(o => o.surah === s && o.range[0] >= from)!.n;
    const has = (id: string) => lines.find(l => l.id === id)!.has;
    expect([at(75), at(91)].every(n => has('النفس').has(n))).toBe(true);
    expect([at(52), at(95)].every(n => has('الطور').has(n))).toBe(true);
    expect([at(75), at(85)].every(n => has('اليوم').has(n))).toBe(true);
    expect([at(68), at(69)].every(n => has('ما').has(n))).toBe(true);
  });

  it('throws when a range is missing from the data', () => {
    expect(() => buildOaths({ names: {}, ayat: {} })).toThrow(/missing/);
  });
});
