import { describe, expect, it } from 'vitest';
import { whichSurah } from './whichSurah';
import { shuffle } from './random';

const seeded = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const whole = { range: null, filters: {} };

describe('which surah', () => {
  it('leaves out ayat too short or found word for word in another surah', () => {
    const keys = new Set(whichSurah.questions(whole, 'medium', seeded(1)).map(question => question.ayahKey));
    expect(keys.has('2:1')).toBe(false);
    expect(keys.has('20:1')).toBe(false);
    expect(keys.has('2:34')).toBe(true);
    expect(keys.has('55:13')).toBe(true);
    expect(whichSurah.count(whole)).toBe(keys.size);
  });

  it('offers four surahs, the right one among them', () => {
    for (const question of whichSurah.questions(whole, 'easy', seeded(2), 50)) {
      expect(question.choices).toHaveLength(4);
      expect(new Set(question.choices.map(choice => choice.value)).size).toBe(4);
      expect(question.choices.map(choice => choice.value)).toContain(question.correctAnswer);
      expect(question.correctAnswer).toBe(question.ayahKey!.split(':')[0]);
    }
  });

  it('asks close look-alikes when hard and offers the look-alike surah', () => {
    const hard = whichSurah.questions(whole, 'hard', seeded(3), 30);
    for (const question of hard) expect(Object.keys(question.alike ?? {}).length).toBeGreaterThan(0);
    const adam = whichSurah.questions({ range: { from: 1, to: 1 }, filters: {} }, 'hard', seeded(4)).find(question => question.ayahKey === '2:34')!;
    expect(adam.choices.map(choice => choice.labelArabic)).toEqual(expect.arrayContaining(['البقرة', 'الإسراء', 'طه']));
    expect(adam.alike?.['17'].key).toBe('17:61');
  });

  it('asks only the range', () => {
    const questions = whichSurah.questions({ range: null, filters: { surahs: '36' } }, 'medium', seeded(5));
    expect(questions.length).toBeGreaterThan(50);
    expect(questions.every(question => question.ayahKey!.startsWith('36:'))).toBe(true);
    expect(whichSurah.count({ range: null, filters: { surahs: '36' } })).toBe(questions.length);
  });

  it('offers far surahs when easy and neighbours when medium', () => {
    const [easy] = shuffle(whichSurah.questions({ range: null, filters: { surahs: '50' } }, 'easy', seeded(6)), seeded(7));
    expect(easy.choices.filter(choice => choice.value !== '50').every(choice => Math.abs(Number(choice.value) - 50) > 10)).toBe(true);
  });
});
