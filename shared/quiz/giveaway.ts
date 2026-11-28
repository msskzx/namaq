import { normalizeWord } from '../quran/normalize';
import { isRightChoice, type ChoiceQuestion } from './choiceKinds';

const words = (text: string) => text.split(/\s+/).map(word => normalizeWord(word).replace(/[^ء-ي]/g, ''))
  .filter(Boolean).map(word => word.replace(/^(?:[وفبلك]?ال)(?=\S{2})/, ''));

function standsIn(label: string, shown: string[]) {
  const asked = words(label);
  if (!asked.length || asked.join('').length < 2) return false;
  const same = (seen: string, word: string) => seen === word || seen === `${word}ا`;
  for (let i = 0; i + asked.length <= shown.length; i++) if (asked.every((word, k) => same(shown[i + k], word))) return true;
  return false;
}

export function givesAway(question: ChoiceQuestion): string | null {
  if (question.choices.length < 2) return null;
  const rights = question.choices.filter(choice => isRightChoice(question, choice.value));
  if (!rights.length) return 'no right choice';
  if (question.map) return null;
  const wrong = question.choices.filter(choice => !rights.includes(choice));
  if (!wrong.length) return null;
  for (const right of rights) {
    const why = givenAway(question, right, wrong);
    if (why) return why;
  }
  return null;
}

function givenAway(question: ChoiceQuestion, right: ChoiceQuestion['choices'][number], wrong: ChoiceQuestion['choices']) {
  const quran = (question.quran ?? []).filter((_, i) => !question.marked?.includes(i));
  const shown = words([question.promptArabic, question.passage ?? '', ...quran, ...(question.boxes ?? [])].join(' '));
  if (standsIn(right.labelArabic, shown) && !wrong.some(choice => standsIn(choice.labelArabic, shown))) return `«${right.labelArabic}» is in the question`;
  const second = (label: string) => /\s(?:أو|وقيل|وقال|وفي رواية)\s/u.test(` ${label} `);
  if (second(right.labelArabic) && !wrong.some(choice => second(choice.labelArabic))) return `«${right.labelArabic}» alone holds a second reading`;
  return null;
}
