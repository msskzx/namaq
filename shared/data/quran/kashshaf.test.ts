import { describe, expect, it } from 'vitest';
import kashshaf from './kashshaf';
import surahs from './surahs.json';
import { kashshafAt, kashshafRuns } from '../../quran/kashshaf';

describe('al-Kashshaf as built', () => {
  it('has a passage for every ayah', () => {
    const missing = surahs.flatMap(row => Array.from({ length: row.numberOfAyat }, (_, i) => `${row.number}:${i + 1}`)).filter(key => !kashshafAt(kashshaf, key));
    expect(missing).toEqual([]);
  });

  it('lights the likeness and the borrowing in «واشتعل الرأس شيبا» (Maryam 4), in one sentence', () => {
    const lit = kashshafRuns(kashshafAt(kashshaf, '19:4')!).filter(run => run.opens);
    expect(lit.map(run => run.devices)).toEqual([['الاستعارة', 'التشبيه']]);
  });

  it('places ayah words only where he quotes them, which is some hundreds of the lit sentences', () => {
    const placed = kashshaf.entries.flatMap(entry => entry[7]).filter(lit => lit[3]);
    expect(placed.length).toBeGreaterThan(300);
    for (const [, , , , from, to] of placed) expect(0 <= from && from <= to).toBe(true);
  });

  it('keeps lit sentences inside their text, and never cuts it with «…»', () => {
    for (const [, , , , , , text, lit] of kashshaf.entries) {
      for (const [start, end] of lit) expect(end <= text.length && start < end).toBe(true);
    }
    expect(kashshaf.entries.some(entry => entry[6].includes('<'))).toBe(false);
  });
});
