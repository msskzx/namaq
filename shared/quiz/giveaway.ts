// No question gives its answer away (owner, 2026-11-19; AGENTS.md "Quiz questions"): the checks every multiple-choice
// kind passes, run over all of them by giveaway.test.ts so a new kind in CHOICE_KINDS is checked without anyone adding it.
// They catch what can be seen from the question alone; what needs knowledge of the subject (a son named «X بن Y» asked
// about Y) stays with each kind's own builder and test, and with the reviewer reading the kind's questions.
import { normalizeWord } from '../quran/normalize';
import { isRightChoice, type ChoiceQuestion } from './choiceKinds';

/** Words as answers are matched: no marks, one alif, no joined «و ف ب ل ك» before the article, no article, no punctuation. */
const words = (text: string) => text.split(/\s+/).map(word => normalizeWord(word).replace(/[^ء-ي]/g, ''))
  .filter(Boolean).map(word => word.replace(/^(?:[وفبلك]?ال)(?=\S{2})/, ''));

/** Whether `label` stands, word for word, in `shown` («هودًا» holds هود: the accusative's alif is no other word). */
function standsIn(label: string, shown: string[]) {
  const asked = words(label);
  if (!asked.length || asked.join('').length < 2) return false;
  const same = (seen: string, word: string) => seen === word || seen === `${word}ا`;
  for (let i = 0; i + asked.length <= shown.length; i++) if (asked.every((word, k) => same(shown[i + k], word))) return true;
  return false;
}

/**
 * Why a question gives its answer away, or null:
 * - the right choice is written in what the question shows (its prompt, passage, Quran words or boxes) and no wrong one is;
 * - the right choice stands apart by its look: the only one holding a second reading («… وقيل …», «… أو …»).
 */
export function givesAway(question: ChoiceQuestion): string | null {
  if (question.choices.length < 2) return null;
  // A question on the atlas's map («أين كانت؟») shows its choices as pins with no names: the place's name in the battle's
  // name («غزوة تبوك») says nothing of where on the map it is.
  if (question.map) return null;
  // A question of several right choices is checked for each of them against the wrong ones.
  const rights = question.choices.filter(choice => isRightChoice(question, choice.value));
  if (!rights.length) return 'no right choice';
  const wrong = question.choices.filter(choice => !rights.includes(choice));
  if (!wrong.length) return null;
  for (const right of rights) {
    const why = givenAway(question, right, wrong);
    if (why) return why;
  }
  return null;
}

function givenAway(question: ChoiceQuestion, right: ChoiceQuestion['choices'][number], wrong: ChoiceQuestion['choices']) {
  // The words the question asks about (coloured, `marked`) are not the answer's giveaway: a reading or a meaning of them is asked.
  const quran = (question.quran ?? []).filter((_, i) => !question.marked?.includes(i));
  const shown = words([question.promptArabic, question.passage ?? '', ...quran, ...(question.boxes ?? [])].join(' '));
  if (standsIn(right.labelArabic, shown) && !wrong.some(choice => standsIn(choice.labelArabic, shown))) return `«${right.labelArabic}» is in the question`;
  const second = (label: string) => /\s(?:أو|وقيل|وقال|وفي رواية)\s/u.test(` ${label} `);
  if (second(right.labelArabic) && !wrong.some(choice => second(choice.labelArabic))) return `«${right.labelArabic}» alone holds a second reading`;
  return null;
}
