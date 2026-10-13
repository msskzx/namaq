import { describe, expect, it } from 'vitest';
import compare from './compare.fixture.json';
import own from './shifts.fixture.json';
import { ayahWords } from './normalize';
import { findPhrases, findShifts, type Phrase, REFRAIN_MANY } from './shifts';

const fx = { ...compare, ...own } as Record<string, string[]>;
const surah = (n: number) => fx[n].map((t, i) => ayahWords(t, i === 0 && n !== 1 && n !== 9));
const words = (...ayat: string[]) => ayat.map(t => ayahWords(t, false));

const firstPlace = (p: Phrase) => p.at[0];

function isOrdered(list: Phrase[]) {
  for (let i = 1; i < list.length; i++) {
    const prev = list[i - 1];
    const next = list[i];
    if (prev.at.length !== next.at.length) {
      if (prev.at.length < next.at.length) return false;
      continue;
    }
    if (prev.len !== next.len) {
      if (prev.len < next.len) return false;
      continue;
    }
    const p = firstPlace(prev);
    const n = firstPlace(next);
    if (p.ayah !== n.ayah) {
      if (p.ayah > n.ayah) return false;
      continue;
    }
    if (p.word > n.word) return false;
  }
  return true;
}

describe('findPhrases', () => {
  it('lists 43:22 and 43:23 as a two-place phrase of at least eight words', () => {
    const phrase = findPhrases(surah(43)).find(p => p.at.map(o => o.ayah).join(',') === '22,23');
    expect(phrase).toBeDefined();
    expect(phrase!.len).toBeGreaterThanOrEqual(8);
    expect(phrase!.at).toHaveLength(2);
  });

  it('gives Ar-Rahman a first phrase with 31 places', () => {
    const phrases = findPhrases(surah(55));
    expect(phrases[0].at).toHaveLength(31);
  });

  it('finds a phrase of at least six words with 8 places in Ash-Shu\'ara', () => {
    const phrase = findPhrases(surah(26)).find(p => p.len >= 6 && p.at.length === 8);
    expect(phrase).toBeDefined();
  });

  it('puts a three-word phrase of at least five places first in Al-Mursalat', () => {
    const phrases = findPhrases(surah(77));
    expect(phrases[0].len).toBe(3);
    expect(phrases[0].at.length).toBeGreaterThanOrEqual(REFRAIN_MANY);
  });

  it('drops a three-word run seen four times and keeps it at five', () => {
    const lines = (n: number) => words(...Array.from({ length: n }, (_, k) => `س${'ابجده'[k]} الف باء جيم`));
    expect(findPhrases(lines(4))).toEqual([]);
    const five = findPhrases(lines(5));
    expect(five).toHaveLength(1);
    expect(five[0].len).toBe(3);
    expect(five[0].at).toHaveLength(5);
  });

  it('does not list a run repeated inside one ayah', () => {
    expect(findPhrases(words('الف باء جيم دال الف باء جيم دال'))).toEqual([]);
  });

  it('lists a run once when a longer run covers it in three ayat', () => {
    const phrases = findPhrases(words(
      'الف باء جيم دال هاء واو',
      'الف باء جيم دال هاء واو',
      'الف باء جيم دال هاء واو',
    ));
    expect(phrases).toHaveLength(1);
    expect(phrases[0].len).toBe(6);
    expect(phrases[0].at).toHaveLength(3);
  });

  it('gives each phrase a text of exactly len words', () => {
    for (const p of findPhrases(surah(55))) {
      expect(p.text.split(' ')).toHaveLength(p.len);
    }
  });

  it('sorts each phrase\'s places by ayah, then word', () => {
    for (const p of findPhrases(surah(26))) {
      const sorted = [...p.at].sort((x, y) => x.ayah - y.ayah || x.word - y.word);
      expect(p.at).toEqual(sorted);
    }
  });

  it('orders the list by places, then length, then first place', () => {
    expect(isOrdered(findPhrases(surah(55)))).toBe(true);
    expect(isOrdered(findPhrases(surah(26)))).toBe(true);
    expect(isOrdered(findPhrases(surah(43)))).toBe(true);
  });

  it.each([12, 26, 43, 55, 77])('lists exactly the arcs and refrains findShifts reports for surah %i', n => {
    const { arcs, refrains } = findShifts(surah(n));
    const key = (len: number, at: { ayah: number; word: number }[]) => `${len}|${at.map(o => `${o.ayah}.${o.word}`).join(',')}`;
    const expected = [...arcs.map(a => key(a.len, [a.a, a.b])), ...refrains.map(r => key(r.len, r.at))].sort();
    expect(findPhrases(surah(n)).map(p => key(p.len, p.at)).sort()).toEqual(expected);
  });

  it('returns an empty list for no ayat', () => {
    expect(findPhrases([])).toEqual([]);
  });
});
