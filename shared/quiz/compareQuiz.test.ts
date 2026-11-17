import { describe, expect, it } from 'vitest';
import { compareQuiz } from './compareQuiz';
import { addCompareHint, blankWords, compareCorrections, compareHintsOf, comparePieces, comparePoints, emptyCompareAnswers, type CompareAsk } from './compareAnswers';
import { spoken } from './branchAnswers';
import { questionPoints } from './score';
import { questionAyat } from './choiceKinds';
import { CHOICE_KINDS } from './kinds';
import { CHOICE_TOPICS, RANGED_TOPICS } from './settings';
import { inJuzRange } from '../quran/juz';
import { normalizeWord } from '../quran/normalize';

const seeded = (seed = 1) => () => { seed = (seed * 16807) % 2147483647; return seed / 2147483647; };
const all = { range: null, filters: {} };
const every = compareQuiz.questions(all, 'medium', seeded());
/** The card asked one way: the side picked is random, so seeds are tried until it comes up that way. */
function find(shown: string, asked: string) {
  for (let seed = 1; seed < 50; seed++) {
    const found = compareQuiz.questions(all, 'medium', seeded(seed)).find(question => question.compare!.shown.key === shown && question.compare!.asked.key === asked);
    if (found) return found;
  }
}

describe('compare quiz', () => {
  it('is a quiz kind asked over part of the Quran, in parties too', () => {
    expect(CHOICE_KINDS).toContain(compareQuiz);
    expect(CHOICE_TOPICS).toContain('COMPARE');
    expect(RANGED_TOPICS).toContain('COMPARE');
    expect(compareQuiz.party).toBe(true);
  });

  it('asks each card of one ayah against one ayah once', () => {
    expect(every.length).toBe(compareQuiz.count(all));
    expect(every.length).toBeGreaterThan(2000);
    expect(new Set(every.map(question => question.compare!.card)).size).toBe(every.length);
  });

  it('gives the asked ayah back whole from its given words and blanks, every blank holding a spoken word', () => {
    for (const question of every) {
      const ask = question.compare!;
      expect(ask.blanks.length).toBeGreaterThan(0);
      const words = comparePieces(ask).flatMap(piece => 'given' in piece ? piece.given.map(i => ask.asked.words[i]) : blankWords(ask, piece.blank));
      expect(words).toEqual(ask.asked.words);
      ask.blanks.forEach((_, blank) => expect(spoken(blankWords(ask, blank)).length).toBeGreaterThan(0));
      expect(ask.shown.tones).toHaveLength(ask.shown.words.length);
      expect(ask.asked.tones).toHaveLength(ask.asked.words.length);
    }
  });

  it('asks only the ayah that parts: al-Naml 26 says nothing al-Tawba 129 does not, so al-Tawba 129 is asked', () => {
    const asked = every.filter(question => question.compare!.card === '9:129|27:26');
    expect(asked.map(question => question.compare!.asked.key)).toEqual(['9:129']);
    expect(asked[0].compare!.blanks.map((_, i) => blankWords(asked[0].compare!, i).map(normalizeWord).join(' '))).toEqual(['فان تولوا فقل حسبي', 'عليه توكلت وهو']);
  });

  it('keeps both ayat inside the scope', () => {
    const range = { from: 1, to: 3 };
    const inRange = compareQuiz.questions({ range, filters: {} }, 'medium', seeded());
    expect(inRange.length).toBeGreaterThan(0);
    for (const question of inRange) expect(questionAyat(question).every(key => inJuzRange(key, range))).toBe(true);
  });

  it('asks the chosen difficulty first', () => {
    const easy = compareQuiz.questions(all, 'easy', seeded(), 5);
    const hard = compareQuiz.questions(all, 'hard', seeded(), 5);
    expect(easy).toHaveLength(5);
    expect(easy.map(question => question.key)).not.toEqual(hard.map(question => question.key));
  });
});

describe('compare answers', () => {
  // al-Furqan 55 against al-Anbiya 66: قال أفتعبدون / ويعبدون, then ينفعكم شيئا ولا يضركم / ينفعهم ولا يضرهم …
  const question = find('21:66', '25:55')!;
  const ask = question.compare as CompareAsk;

  it('grades the first two words of each blank, as the tree quiz grades a leaf', () => {
    expect(ask.blanks.map((_, i) => spoken(blankWords(ask, i))[0])).toEqual(['وَيَعۡبُدُونَ', 'يَنفَعُهُمۡ']);
    const rows = compareCorrections(ask, ['ويعبدون', 'ينفعكم شيئا']);
    expect(rows.map(row => row.correct)).toEqual([true, false]);
    expect(rows[1].right).toBe(0);
    expect(compareCorrections(ask, ['', 'ينفعهم ولا']).map(row => row.correct)).toEqual([false, true]);
  });

  it('scores one point per blank, through the shared scoring the party server uses', () => {
    expect(questionPoints(question, ['ويعبدون', 'ينفعهم ولا'])).toEqual({ earned: 2, total: 2 });
    expect(questionPoints(question, ['ويعبدون'])).toEqual({ earned: 1, total: 2 });
    expect(comparePoints(question, [])).toEqual({ earned: 0, total: 2 });
    expect(emptyCompareAnswers(question)).toEqual(['', '']);
  });

  it('hints one more letter of each empty blank', () => {
    const once = addCompareHint(ask, ['', ''], {});
    expect(compareHintsOf(ask, addCompareHint(ask, ['', ''], once))).toEqual(['وي…', 'ين…']);
    expect(addCompareHint(ask, ['ويعبدون', ''], {})).toEqual({ 1: 1 });
  });
});
