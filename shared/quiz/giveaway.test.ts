// The guard on owner's rule (2026-11-19, AGENTS.md "Quiz questions"): no quiz question gives its answer away, and a quiz
// on part of the Quran offers no wrong choice from outside it. Every kind in CHOICE_KINDS is run whole, so a new kind is
// checked the day it is registered.
import { describe, expect, it } from 'vitest';
import { CHOICE_KINDS } from './kinds';
import { givesAway } from './giveaway';
import { seededRandom } from './feedQuiz';
import { inJuzRange } from '../quran/juz';
import { tieQuestions, tieTold } from './tarajim';
import { quizFilters } from './scopeParams';
import { quizTrees } from './treeScope';
import gharib from '../data/quran/gharib';

/**
 * Questions the check flags that were read and do not give their answer away, each with why. Add one only after reading
 * the question as a reader would; a second agent and the owner see the list in the PR.
 */
const READ: Record<string, string> = {
  'QIRAAT:7:43:1': 'the ayah has another «ما» before «لنهتدي»; Ibn Amir\'s «ما كنا» (no و) is not told by it',
  'QIRAAT:5:110:2': '«طيرا» later in the ayah is another word; how «الطير» is read is not told by it',
  'HADITH_BOOK:35': '«المسلم» in the hadith is the believer, not the book of Muslim',
  'HADITH_BOOK:36': '«المسلم» in the hadith is the believer, not the book of Muslim',
};

const ALL = { range: null, filters: {} };

describe('no question gives its answer away', () => {
  for (const kind of CHOICE_KINDS) {
    it(kind.name, () => {
      const flagged = kind.questions(ALL, 'medium', seededRandom(5)).flatMap(question => {
        const why = givesAway(question);
        return why && !READ[question.key] ? [`${question.key}: ${why}`] : [];
      });
      expect(flagged).toEqual([]);
    });
  }

  it('keeps no read exemption that the check no longer flags', () => {
    const all = CHOICE_KINDS.flatMap(kind => kind.questions(ALL, 'medium', seededRandom(5)));
    for (const key of Object.keys(READ)) expect(all.some(question => question.key === key && givesAway(question)), key).toBe(true);
  });

  it('«ما صلته به؟» never asks two people whose names already say the tie', () => {
    expect(tieTold('عمر بن أبي سلمة', 'أبو سلمة بن عبد الأسد')).toBe('child');
    expect(tieTold('عمر بن الخطاب', 'حفصة بنت عمر')).toBe('parent');
    expect(tieTold('زيد بن الخطاب', 'عمر بن الخطاب')).toBe('sibling');
    expect(tieTold('أم سلمة', 'أبو سلمة بن عبد الأسد')).toBe('spouse');
    expect(tieTold('أم سلمة', 'عمر بن أبي سلمة')).toBe('parent');
    expect(tieTold('زينب بنت محمد', 'محمد ﷺ')).toBe('child');
    expect(tieTold('صفية بنت عبد المطلب', 'الزبير بن العوام')).toBeUndefined();
    const ties = tieQuestions();
    // Asked plainly (owner, 2026-11-19): «ما صلة A بB؟».
    for (const question of ties) expect(question.promptArabic, question.promptArabic).toMatch(/^ما صلة .+ ب.+؟$/u);
    // Umar ibn Abi Salamah is Abu Salamah's son, as his name says: not asked; nor a Companion asked of the Prophet ﷺ.
    expect(ties.some(question => question.key.includes('umar-ibn-abi-salamah') && /:abu-salamah/.test(question.key))).toBe(false);
    expect(ties.some(question => question.key.includes('prophet-muhammad') && question.correctAnswer === 'صاحبه')).toBe(false);
  });

  it('mutashabih quizzes ask only the books\' pairs, whatever kinds a stored setting carries', () => {
    expect(quizFilters({ categories: 'mutashabeh,pondering,words' }).categories).toBe('mutashabeh');
    expect(quizTrees(null, { filters: { categories: 'pondering' } }).length).toBe(quizTrees().length);
  });
});

describe('wrong choices come from inside the chosen part of the Quran', () => {
  const juz30 = { range: { from: 30, to: 30 }, filters: {} };
  const inside = (key: string) => inJuzRange(key, juz30.range);
  it('«في أي سورة؟» offers only surahs of juz 30 on a juz 30 quiz', () => {
    const kind = CHOICE_KINDS.find(k => k.id === 'SURAH')!;
    for (const question of kind.questions(juz30, 'medium', seededRandom(2))) for (const choice of question.choices) expect(inside(`${choice.value}:1`) || inside(`${choice.value}:2`)).toBe(true);
  });
  it('«لأي آية هذا التفسير؟» and «ما معنى؟» offer only ayat inside it', () => {
    for (const id of ['TAFSIR', 'MEANING']) {
      const kind = CHOICE_KINDS.find(k => k.id === id)!;
      for (const question of kind.questions(juz30, 'medium', seededRandom(2))) {
        expect(inside(question.ayahKey!)).toBe(true);
        if (id === 'TAFSIR') question.choices.forEach(choice => expect(inside(choice.value)).toBe(true));
        else question.choices.forEach(choice => { const entry = gharib.entries[Number(choice.value)]; expect(inside(`${entry[0]}:${entry[4][0][0]}`)).toBe(true); });
      }
    }
  });
  it('«قارن الموضعين» asks only pairs inside it', () => {
    const kind = CHOICE_KINDS.find(k => k.id === 'COMPARE')!;
    for (const question of kind.questions(juz30, 'medium', seededRandom(2))) expect([question.compare!.shown.key, question.compare!.asked.key].every(inside)).toBe(true);
  });
});
