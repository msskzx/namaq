import { describe, expect, it } from 'vitest';
import { ADHKAR } from '../adhkar';
import { askedDhikr, completeDhikrQuestions, dhikrEnding } from './adhkar';
import { seededRandom } from './feedQuiz';

const bare = (text: string) => text.replace(/[ً-ْٰ]/g, '').replace(/[أإآٱ]/g, 'ا').replace(/[.،,]/g, ' ').replace(/\s+/g, ' ').trim();
const questions = completeDhikrQuestions(seededRandom(7));

describe('«أكمل الذكر»', () => {
  it('asks the words al-Nawawi prints: the shown start and the right ending make the whole dhikr', () => {
    for (const question of questions) {
      const item = askedDhikr(question.key)!;
      expect(item.content.kind).toBe('text');
      const right = question.choices.find(choice => choice.value === question.correctAnswer)!.labelArabic;
      const start = question.promptArabic.replace(/ …$/, '');
      expect(bare(`${start} ${right}`)).toBe(bare(item.content.kind === 'text' ? item.content.text : ''));
    }
  });

  it('never offers a wrong ending that is said anywhere in the asked dhikr, and each wrong one says whose it is', () => {
    for (const question of questions) {
      const item = askedDhikr(question.key)!;
      const text = item.content.kind === 'text' ? bare(item.content.text) : '';
      const wrong = question.choices.filter(choice => choice.value !== question.correctAnswer);
      for (const choice of wrong) {
        expect(text.includes(bare(choice.labelArabic))).toBe(false);
        expect(question.whereOf?.[choice.value]).toBeTruthy();
      }
      expect(new Set(question.choices.map(choice => bare(choice.labelArabic))).size).toBe(question.choices.length);
    }
  });

  it('cites al-Adhkar at the asked dhikr and the scholar who grades it', () => {
    for (const question of questions) {
      const item = askedDhikr(question.key)!;
      expect(question.sources.some(source => source.url === item.citation.url && source.book === 'الأذكار')).toBe(true);
      for (const grade of item.grades) expect(question.sources.some(source => source.quote === grade.quote && source.by === grade.scholar)).toBe(true);
    }
  });

  it('asks every text dhikr long enough to hide an ending, and no Quran passage', () => {
    const asked = new Set(questions.map(question => askedDhikr(question.key)!.id));
    for (const item of ADHKAR) {
      const askable = item.content.kind === 'text' && dhikrEnding(item.content.text) !== null;
      expect(asked.has(item.id), item.id).toBe(askable);
    }
  });
});
