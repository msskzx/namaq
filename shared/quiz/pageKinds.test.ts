import { describe, expect, it } from 'vitest';
import { ayahEnds, surahOpenings } from './pageKinds';
import { FORGOT, RECITED, recited } from './choiceKinds';

const all = { range: null, filters: {} };
const once = () => 0.5;

describe('the kinds written on the page', () => {
  it('asks every surah opening in the range, its name in the question and its title on the page', () => {
    expect(surahOpenings.count(all)).toBe(114);
    expect(surahOpenings.count({ range: { from: 30, to: 30 }, filters: {} })).toBe(37);
    const [question] = surahOpenings.questions({ range: null, filters: { surahs: '2' } }, 'easy', once);
    expect(question).toMatchObject({ key: 'OPENINGS:2:1', ayahKey: '2:1', promptArabic: 'سمّع أول آية في سورة البَقَرَةْ.', page: { shows: 0, recite: true, title: 'shown' } });
    expect(question.choices.map(choice => choice.value)).toEqual([RECITED, FORGOT]);
    expect(recited(question)).toBe(true);
  });
  it('asks any ayah in the range, named surah first', () => {
    expect(ayahEnds.count(all)).toBe(6236);
    const [question] = ayahEnds.questions({ range: null, filters: { surahs: '112' } }, 'easy', () => 0);
    expect(question.promptArabic).toMatch(/^سمّع آية الإِخْلَاصْ [١-٤]\.$/);
    expect(ayahEnds.party).toBe(true);
  });
});
