import { describe, expect, it } from 'vitest';
import { CHOICE_KINDS } from './kinds';
import { seededRandom } from './feedQuiz';
import { askedDhikr, dhikrEnding, dhikrHint } from './adhkar';
import { plainText } from '../sahih';
import { normalizeWord } from '../quran/normalize';
import corpus from '../quran/quranText/corpus';
import type { BranchAyah } from '../quran/branches';
import type { ChoiceQuestion } from './choiceKinds';

const ALL = { range: null, filters: {} };
const SAMPLE = 40;
const asked = CHOICE_KINDS.map(kind => ({ kind, questions: kind.questions(ALL, 'medium', seededRandom(7), SAMPLE) }));
const first = new Map((corpus.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah.words[0]]));
const words = new Map((corpus.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah.words.map(normalizeWord).join(' ')]));
const looks = <V extends ChoiceQuestion['look']['view']>(view: V) =>
  asked.flatMap(({ questions }) => questions).flatMap(question => (question.look.view === view ? [{ question, look: question.look as Extract<ChoiceQuestion['look'], { view: V }> }] : []));

describe('every question offers «تلميح» before it is answered (owner, 2026-11-28)', () => {
  it('every kind asks something, and each question carries a look-up', () => {
    for (const { kind, questions } of asked) {
      expect(questions.length, kind.id).toBeGreaterThan(0);
      for (const question of questions) expect(question.look, question.key).toBeDefined();
    }
  });

  it('only a question whose own view draws its hint (compare blanks, the surah-order tray) leaves the look-up to it', () => {
    for (const { question } of looks('own')) expect(!!question.compare || !!question.order, question.key).toBe(true);
  });

  it('the word given to a reciter is the next word only, never the rest of the ayah', () => {
    const prompts = looks('prompt');
    expect(prompts.length).toBeGreaterThan(0);
    for (const { question, look } of prompts) {
      expect(look.word.trim().split(/\s+/), question.key).toHaveLength(1);
      expect(look.word, question.key).toBe(look.first ? first.get(look.key) : question.reveal![0]);
    }
  });

  it('the ayat around a «في أي سورة؟» ayah never repeat it, so the hint adds what the card does not show', () => {
    const around = looks('around');
    expect(around.length).toBeGreaterThan(0);
    for (const { question, look } of around) {
      expect(look.before || look.after, question.key).toBeTruthy();
      for (const side of [look.before, look.after]) if (side) expect(side.map(normalizeWord).join(' '), question.key).not.toBe(words.get(question.ayahKey!));
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
