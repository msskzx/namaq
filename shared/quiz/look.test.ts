import { describe, expect, it } from 'vitest';
import { CHOICE_KINDS } from './kinds';
import { surahOpenings } from './pageKinds';
import { seededRandom } from './feedQuiz';
import { askedDhikr, dhikrEnding, dhikrHint } from './adhkar';
import { plainText } from '../sahih';
import corpus from '../quran/quranText/corpus';
import type { BranchAyah } from '../quran/branches';
import type { ChoiceQuestion } from './choiceKinds';

const ALL = { range: null, filters: {} };
const SAMPLE = 40;
const asked = CHOICE_KINDS.map(kind => ({ kind, questions: kind.questions(ALL, 'medium', seededRandom(7), SAMPLE) }));
const ayahWords = new Map((corpus.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah.words]));
const looks = <V extends ChoiceQuestion['look']['view']>(view: V) =>
  asked.flatMap(({ questions }) => questions).flatMap(question => (question.look.view === view ? [{ question, look: question.look as Extract<ChoiceQuestion['look'], { view: V }> }] : []));

describe('every question offers «تلميح» before it is answered (owner, 2026-11-28)', () => {
  it('every registered kind is walked, so a new kind cannot slip past these rules', () => {
    for (const { kind, questions } of asked) expect(questions.length, kind.id).toBeGreaterThan(0);
  });

  it('only a question whose own view draws its hint (compare blanks, the juz tray) leaves the look-up to it', () => {
    for (const { question } of looks('own')) expect(!!question.compare || !!question.tray, question.key).toBe(true);
  });

  it('the word given to a reciter is one word and never all that is left to recite', () => {
    const prompts = looks('prompt');
    expect(prompts.length).toBeGreaterThan(0);
    for (const { question, look } of prompts) {
      expect(look.word.trim().split(/\s+/), question.key).toHaveLength(1);
      const left = look.first ? ayahWords.get(look.key)! : question.reveal!;
      expect(left.length, question.key).toBeGreaterThan(1);
      expect(look.word, question.key).toBe(left[0]);
    }
  });

  it('a one-word opening ayah is hinted by the ayah after it, since its first word is the whole answer', () => {
    const one = surahOpenings.questions(ALL, 'medium', seededRandom(7)).filter(question => ayahWords.get(question.ayahKey!)!.length === 1);
    expect(one.length).toBeGreaterThan(0);
    for (const question of one) expect(question.look.view, question.key).toBe('around');
  });

  it('the ayat around an ayah are its own neighbours in its surah, never the ayah itself', () => {
    const around = looks('around');
    expect(around.length).toBeGreaterThan(0);
    for (const { question, look } of around) {
      expect(look.before || look.after, question.key).toBeTruthy();
      const [surah, n] = question.ayahKey!.split(':').map(Number);
      if (look.before) expect(look.before, question.key).toEqual(ayahWords.get(`${surah}:${n - 1}`));
      if (look.after) expect(look.after, question.key).toEqual(ayahWords.get(`${surah}:${n + 1}`));
    }
  });

  it('a dhikr\'s hint never quotes the ending it asks for', () => {
    const hinted = looks('dhikr');
    expect(hinted.length).toBeGreaterThan(0);
    for (const { question } of hinted) {
      const item = askedDhikr(question.key)!;
      const end = dhikrEnding(item.content.kind === 'text' ? item.content.text : '')!.end;
      for (const quote of dhikrHint(item)) expect(plainText(quote), question.key).not.toContain(plainText(end));
    }
  });
});
