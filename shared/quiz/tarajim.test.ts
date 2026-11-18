import { describe, expect, it } from 'vitest';
import { bareName } from '../tarajimLine';
import { nasabQuestions, virtueQuestions } from './tarajim';
import { seededRandom } from './feedQuiz';

describe('أين يلتقي النسبان؟', () => {
  const questions = nasabQuestions();
  it('asks only pairs that meet, with the nearest shared father as the answer and fathers of one side alone as wrong choices', () => {
    expect(questions.length).toBeGreaterThan(0);
    const zubayrProphet = questions.find(q => q.key.includes('az-zubayr-ibn-al-awwam') && q.key.includes('prophet-muhammad'))!;
    expect(bareName(zubayrProphet.correctAnswer)).toBe('قصي');
    for (const q of questions) {
      expect(q.choices).toHaveLength(4);
      expect(new Set(q.choices.map(c => bareName(c.value))).size).toBe(4);
      // No wrong choice is a father the two share (anyone above the meeting point would also be "where they meet").
      expect(q.note?.text.split('\n')[0].endsWith(q.correctAnswer)).toBe(true);
    }
  });
});

describe('صاحب المنقبة', () => {
  it('never asks a virtue whose quote names its owner, and offers four different people', () => {
    const questions = virtueQuestions(undefined, seededRandom(1));
    expect(questions.length).toBeGreaterThan(0);
    for (const q of questions) {
      expect(new Set(q.choices.map(c => c.value)).size).toBe(4);
      expect(q.choices.map(c => c.value)).toContain(q.correctAnswer);
    }
    expect(questions.some(q => q.promptArabic.includes('طلحة'))).toBe(false);
  });
});
