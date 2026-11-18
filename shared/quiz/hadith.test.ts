import { describe, expect, it } from 'vitest';
import fortyData from '../data/hadith/forty.json';
import type { AppForty } from '../hadith';
import { completeQuestions, narratorQuestions } from './hadith';

const FORTY = fortyData as AppForty;
const narrator = narratorQuestions(() => 0.42);
const complete = completeQuestions(() => 0.42);
const right = (question: (typeof narrator)[number]) => question.choices.find(choice => choice.value === question.correctAnswer)!.labelArabic;
const bare = (text: string) => text.replace(/[ً-ْٰ]/g, '');

describe('the Forty as al-Nawawi printed them', () => {
  it('holds all forty-two, and every record starts with its own number on the page it cites', () => {
    expect(FORTY.entries.map(entry => entry.n)).toEqual(Array.from({ length: 42 }, (_, i) => i + 1));
    for (const record of FORTY.entries.flatMap(entry => entry.records)) {
      expect(record.pages).toEqual([...record.pages].sort((a, b) => a - b));
      if (record.isnadEnd) expect(record.isnadEnd).toBeLessThan(record.text.length);
    }
  });
});

describe('the hadith quizzes', () => {
  it('asks four different choices with one right, and names the source under them', () => {
    expect(narrator.length).toBeGreaterThan(10);
    expect(complete.length).toBeGreaterThan(10);
    for (const question of [...narrator, ...complete]) {
      expect(question.choices).toHaveLength(4);
      expect(new Set(question.choices.map(choice => bare(choice.labelArabic))).size).toBe(4);
      expect(question.note?.text).toMatch(/صحيح البخاري .*ص .*الأربعون النووية/);
    }
  });

  it('asks the Companion with the right one from the entry, and never a saying that names him', () => {
    for (const question of narrator) {
      const n = Number(question.key.split(':')[1]);
      const entry = FORTY.entries.find(item => item.records.some(record => record.book === 'bukhari' && record.number === n))!;
      expect(right(question)).toBe(entry.companion);
      expect(bare(question.promptArabic)).not.toContain(bare(entry.companion));
    }
  });

  it('hides the last words of the saying, and every wrong ending is named from another record', () => {
    for (const question of complete) {
      expect(question.promptArabic.endsWith('…»')).toBe(true);
      for (const choice of question.choices.filter(item => item.value !== question.correctAnswer)) expect(question.note!.text).toContain(`«${choice.labelArabic}»`);
    }
  });
});
