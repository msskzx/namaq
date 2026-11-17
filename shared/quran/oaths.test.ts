import { describe, expect, it } from 'vitest';
import corpus from '../data/quran/trees.json';

const pageWords = new Map(corpus.ayat.map(ayah => [ayah.key, ayah.words]));
const data = (key: string) => pageWords.get(key);
import { normalizeWord } from './normalize';
import { ALLAH_OATHS, OTHER_OATHS, buildOaths, isSworn, oathPlace, type OathKind } from './oaths';

const built = (kind: OathKind) => buildOaths(kind, data);

describe('oaths', () => {
  it('keeps each list in mushaf order, with no oath twice', () => {
    for (const list of [ALLAH_OATHS, OTHER_OATHS]) {
      const keys = list.map(o => o.surah * 1000 + o.range[0]);
      expect(keys).toEqual([...new Set(keys)].sort((a, b) => a - b));
    }
  });

  it('counts 41 oaths by Allah and 12 quoted from others', () => {
    expect(ALLAH_OATHS).toHaveLength(41);
    expect(OTHER_OATHS).toHaveLength(12);
    expect(OTHER_OATHS.every(o => o.who)).toBe(true);
  });

  it('reads every ayah of every range from the stored text', () => {
    for (const kind of ['allah', 'others'] as const) for (const o of built(kind)) {
      expect(o.lines.map(l => l.ayah)).toEqual(Array.from({ length: o.range[1] - o.range[0] + 1 }, (_, k) => o.range[0] + k));
      expect(o.lines.every(l => l.words.length > 0)).toBe(true);
      expect(o.name).not.toBe('');
    }
  });

  it('finds every word sworn by in the text of its own range', () => {
    for (const kind of ['allah', 'others'] as const) for (const o of built(kind)) {
      const tokens = o.lines.flatMap(l => l.words.map(w => w.text));
      for (const w of o.by) expect(tokens.some(t => isSworn(t, w)), `${o.id} ${w}`).toBe(true);
    }
  });

  it('colours the word sworn by and leaves the rest of the ayah plain', () => {
    const at = (kind: OathKind, id: string) => built(kind).find(o => o.id === id)!.lines.flatMap(l => l.words);
    const sworn = (kind: OathKind, id: string) => at(kind, id).filter(w => w.sworn).map(w => normalizeWord(w.text));
    expect(sworn('allah', '15:72')).toEqual([normalizeWord('لَعَمۡرُكَ')]);
    expect(sworn('allah', '4:65')).toEqual([normalizeWord('وَرَبِّكَ')]);
    expect(sworn('others', '12:85')).toEqual([normalizeWord('تَٱللَّهِ')]);
    expect(sworn('others', '38:82')).toEqual([normalizeWord('فَبِعِزَّتِكَ')]);
    expect(sworn('others', '26:44')).toEqual([normalizeWord('بِعِزَّةِ')]);
    expect(sworn('allah', '36:2')).toEqual([normalizeWord('وَٱلۡقُرۡءَانِ')]);
  });

  it('drops the hizb mark from the words', () => {
    expect(normalizeWord(built('allah').find(o => o.id === '56:75')!.lines[0].words[0].text)).toBe('فلا');
  });

  it('does not take a word that only ends like the sworn one for it', () => {
    expect(isSworn('كَلَّا', 'الليل')).toBe(false);
    expect(isSworn('تَجَلَّىٰ', 'الليل')).toBe(false);
    expect(isSworn('وَٱلَّيۡلِ', 'الليل')).toBe(true);
    expect(isSworn('مَسۡطُورٖ', 'الطور')).toBe(false);
    expect(isSworn('تَذۡكُرُ', 'الله')).toBe(false);
  });

  it('names a place with its range', () => {
    expect(oathPlace({ name: 'الطور', range: [1, 6] }, String)).toBe('الطور 1–6');
    expect(oathPlace({ name: 'العصر', range: [1, 1] }, String)).toBe('العصر 1');
  });

  it('throws when a range is missing from the pages', () => {
    expect(() => buildOaths('allah', () => undefined)).toThrow(/missing/);
  });
});
