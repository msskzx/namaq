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
    const adam = whichSurah.questions({ range: null, filters: { surahs: '2,17,20,7' } }, 'hard', seeded(4)).find(question => question.ayahKey === '2:34')!;
    expect(adam.choices.map(choice => choice.labelArabic)).toEqual(expect.arrayContaining(['البَقَرَةْ', 'الإِسْرَاءْ', 'طه']));
    expect(adam.alike?.['17'].key).toBe('17:61');
  });

  it('asks only the range, and offers only its surahs (owner, 2026-11-19)', () => {
    const picked = ['36', '37', '38', '39'];
    const scope = { range: null, filters: { surahs: picked.join(',') } };
    const questions = whichSurah.questions(scope, 'medium', seeded(5));
    expect(questions.length).toBeGreaterThan(0);
    for (const question of questions) {
      expect(picked).toContain(question.ayahKey!.split(':')[0]);
      for (const choice of question.choices) expect(picked).toContain(choice.value);
    }
    expect(whichSurah.count(scope)).toBe(questions.length);
    // Fewer surahs than choices: nothing to choose between.
    expect(whichSurah.count({ range: null, filters: { surahs: '36' } })).toBe(0);
  });

  it('never asks an ayah that says its own surah\'s name («هودًا» in Hud, «فتحًا» in al-Fath)', () => {
    const asked = new Set(whichSurah.questions(whole, 'medium', seeded(9)).map(question => question.ayahKey));
    for (const key of ['11:50', '48:1', '98:1', '12:4']) expect(asked.has(key)).toBe(false);
    expect(asked.has('11:1')).toBe(true);
  });

  it('offers the look-alikes\' surahs when medium, then neighbours that do not give the answer away', () => {
    const medium = whichSurah.questions(whole, 'medium', seeded(8));
    const places = new Set<number>();
    for (const question of medium) {
      const values = question.choices.map(choice => Number(choice.value));
      const lookAlikes = Object.keys(question.alike ?? {}).map(Number);
      const anchors = [Number(question.correctAnswer), ...lookAlikes];
      if (!lookAlikes.length) {
        // A run of four surahs, the answer anywhere in it.
        expect(Math.max(...values) - Math.min(...values)).toBe(3);
        places.add([...values].sort((x, y) => x - y).indexOf(Number(question.correctAnswer)));
      }
      if (lookAlikes.length) for (const value of values) expect(anchors.includes(value) || anchors.some(anchor => Math.abs(anchor - value) <= 4)).toBe(true);
    }
    expect([...places].sort()).toEqual([0, 1, 2, 3]);
    const adam = medium.find(question => question.ayahKey === '2:34')!;
    expect(Object.keys(adam.alike ?? {})).toHaveLength(3);
    expect(adam.choices.map(choice => choice.labelArabic)).toEqual(expect.arrayContaining(['البَقَرَةْ', 'الإِسْرَاءْ', 'طه']));
  });

  it('offers far surahs when easy', () => {
    const [easy] = shuffle(whichSurah.questions(whole, 'easy', seeded(6)).filter(question => question.correctAnswer === '50'), seeded(7));
    expect(easy.choices.filter(choice => choice.value !== '50').every(choice => Math.abs(Number(choice.value) - 50) > 10)).toBe(true);
  });
});
