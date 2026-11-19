import { describe, expect, it } from 'vitest';
import gharib from '../data/quran/gharib';
import { meaningQuiz } from './meaning';

const seeded = (seed: number) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
const whole = { range: null, filters: {} };

describe('«ما معنى؟»', () => {
  it('asks every question of the bank over the whole Quran', () => {
    expect(meaningQuiz.count(whole)).toBe(gharib.questions.length);
  });

  it("offers his meaning of the word and three of his others, each wrong one naming its word, the asked word marked", () => {
    for (const question of meaningQuiz.questions(whole, 'medium', seeded(1), 60)) {
      expect(question.choices).toHaveLength(4);
      expect(question.choices.map(choice => choice.value)).toContain(question.correctAnswer);
      const wrong = question.choices.filter(choice => choice.value !== question.correctAnswer);
      expect(Object.keys(question.explains ?? {}).sort()).toEqual(wrong.map(choice => choice.value).sort());
      for (const choice of wrong) {
        expect(question.explains![choice.value].quote).toBeTruthy();
        expect(question.explains![choice.value].where).toMatch(/ [٠-٩]+$/);
      }
      expect(question.marked!.length).toBeGreaterThan(0);
      expect(question.marked!.every(at => question.quran![at])).toBe(true);
      expect(question.note?.text).toMatch(/^كل الخيارات من غريب القرآن لابن قتيبة، ص /);
    }
  });

  it("asks «مَآءٗ ثَجَّاجٗا», his whole quote, with his «أي سَيَّالا.»", () => {
    const naba = meaningQuiz.questions({ range: null, filters: { surahs: '78' } }, 'medium', seeded(2));
    const question = naba.find(item => item.ayahKey === '78:14');
    expect(question?.marked!.map(at => question.quran![at]).join(' ').normalize('NFC')).toBe('مَآءٗ ثَجَّاجٗا'.normalize('NFC'));
    expect(question?.choices.find(choice => choice.value === question.correctAnswer)?.labelArabic.normalize('NFC')).toBe('أي سَيَّالا.'.normalize('NFC'));
  });

  it('keeps to the scope', () => {
    const juz30 = meaningQuiz.questions({ range: { from: 30, to: 30 }, filters: {} }, 'medium', seeded(3));
    expect(juz30.length).toBeGreaterThan(20);
    for (const question of juz30) expect(Number(question.ayahKey!.split(':')[0])).toBeGreaterThanOrEqual(78);
  });

  it('looks the word up in the meaning books, at the first word asked', () => {
    for (const question of meaningQuiz.questions(whole, 'medium', seeded(2), 40)) {
      expect(question.look).toEqual({ view: 'word', key: question.ayahKey, word: question.marked![0] });
    }
  });

});
