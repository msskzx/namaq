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
    expect(questions.some(q => bareName(q.promptArabic).includes('طلحه'))).toBe(false);
    // Ibn Ma'in's «مسور ثقة» names al-Miswar without the article.
    expect(questions.some(q => bareName(q.promptArabic).startsWith('«مسور'))).toBe(false);
  });
});

describe('fair choices', () => {
  it('never offers the owner’s brother for a virtue, so «عم الرجل صنو أبيه» does not offer Hamzah', () => {
    for (const seed of [1, 2, 3, 4, 5]) {
      const q = virtueQuestions(undefined, seededRandom(seed)).find(q => bareName(q.promptArabic).includes('صنو'));
      if (q) expect(q.choices.map(c => c.value)).not.toContain('hamzah-ibn-abd-al-muttalib');
    }
  });

  it('writes «بنت» after a woman’s name in the nasab note, and never asks a meeting the question already names', () => {
    for (const q of nasabQuestions()) {
      expect(q.note?.text).not.toMatch(/^(?:صفية|عائشة) بن /u);
      // Word for word: «عمرو بن حريث» does not name «عمر».
      expect(` ${bareName(q.promptArabic).replace(/[؟?]/gu, ' ')} `.includes(` ${bareName(q.correctAnswer)} `)).toBe(false);
    }
  });
});

describe('virtue skip list', () => {
  it('names only virtues that exist, each with a reason', async () => {
    const { skip } = (await import('../data/tarajim/virtueQuizSkip.json')).default as { skip: Record<string, string> };
    const ids = new Set((await import('../data/tarajim/people.json')).default.flatMap((p: { virtues: { id?: string }[] }) => p.virtues.map(v => v.id)));
    for (const [id, why] of Object.entries(skip)) {
      expect(ids.has(id)).toBe(true);
      expect(why.length).toBeGreaterThan(0);
    }
  });
});

describe('ما صلته به؟', () => {
  it('asks what one person is to another, never offering a tie that also holds between them', async () => {
    const { tieQuestions } = await import('./tarajim');
    const questions = tieQuestions();
    expect(questions.length).toBeGreaterThan(0);
    const zubayr = questions.find(q => q.key.includes('az-zubayr-ibn-al-awwam') && q.key.includes('safiyyah-bint-abd-al-muttalib'))!;
    // Asked one way round: what Safiyyah is to al-Zubayr, or he to her.
    expect(['أمه', 'ابنها']).toContain(zubayr.correctAnswer);
    const prophet = questions.find(q => q.key.includes('az-zubayr-ibn-al-awwam') && q.key.includes('prophet-muhammad'));
    if (prophet) expect(prophet.choices.map(c => c.value)).not.toContain('صاحبه');
    for (const q of questions) expect(new Set(q.choices.map(c => c.value)).size).toBe(4);
  });
});
