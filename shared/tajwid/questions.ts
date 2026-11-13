// Tuhfat al-Atfal multiple-choice questions (owner, 2026-11-13): kinds mixed into the shared quiz, not a quiz of their own.
// Every answer comes from the poem itself: its verses, and the letters it names for each rule.
import { num } from '../quran/arabicNumber';
import { shuffle, type Random } from '../quiz/random';
import { numberVerses, type NumberedVerse, type Poem } from './poem';
import poemData from './tuhfat-al-atfal.json';

/** The shared quiz's choice question (shared/quiz/choiceKinds.ts, built by the "which surah" thread). */
export type TuhfaQuestion = {
  key: string;
  family: string;
  promptArabic: string;
  choices: { value: string; labelArabic: string }[];
  correctAnswer: string;
  note?: { label: string; text: string };
};

export const verses: NumberedVerse[] = numberVerses(poemData as Poem).flatMap(chapter => chapter.verses);
const verse = (number: number) => verses[number - 1];
const whole = (number: number) => `${verse(number).first} ۞ ${verse(number).second}`;
const noteOf = (number: number) => ({ label: `البيت ${num(number)}`, text: whole(number) });

/** The letters the poem names for each rule, and the verse that names them (checked against the text in questions.test.ts). */
export const NOON_RULES = [
  { rule: 'الْإِظْهَارُ', letters: 'ءهعحغخ', verse: 8 },
  { rule: 'إِدْغَامٌ بِغُنَّةٍ', letters: 'ينمو', verse: 10 },
  { rule: 'إِدْغَامٌ بِغَيْرِ غُنَّةٍ', letters: 'لر', verse: 12 },
  { rule: 'الْإِقْلَابُ', letters: 'ب', verse: 13 },
  { rule: 'الْإِخْفَاءُ', letters: 'صذثكجشقسدطزفتضظ', verse: 16 },
] as const;
export const MEEM_RULES = [
  { rule: 'الْإِخْفَاءُ الشَّفْوِيُّ', letters: 'ب', verse: 20 },
  { rule: 'إِدْغَامٌ صَغِيرٌ', letters: 'م', verse: 21 },
  { rule: 'الْإِظْهَارُ الشَّفْوِيُّ', letters: 'ءتثجحخدذرزسشصضطظعغفقكلنهوي', verse: 22 },
] as const;
export const LAM_RULES = [
  { rule: 'إِظْهَارٌ، وَاللَّامُ قَمْرِيَّةٌ', letters: 'ءبغحجكوخفعقيمه', verse: 25 },
  { rule: 'إِدْغَامٌ، وَاللَّامُ شَمْسِيَّةٌ', letters: 'طثصرتضذندسظزشل', verse: 27 },
] as const;

type Rules = readonly { rule: string; letters: string; verse: number }[];

/** Up to three wrong verse halves, nearest verses first so they sound like the right one, then shuffled with it. */
function halfChoices(right: string, near: number, half: 'first' | 'second', random: Random) {
  const others = verses
    .filter(item => item[half] !== right)
    .sort((a, b) => Math.abs(a.number - near) - Math.abs(b.number - near))
    .slice(0, 8);
  const wrong = shuffle(others, random).slice(0, 3).map(item => item[half]);
  return shuffle([right, ...wrong], random).map(text => ({ value: text, labelArabic: text }));
}

/** Complete the verse: its first half is shown, its second half picked. */
export function completeQuestions(random: Random): TuhfaQuestion[] {
  return verses.map(({ number, first, second }) => ({
    key: `tuhfa:complete:${number}`,
    family: 'TUHFA_COMPLETE',
    promptArabic: `أَكْمِلِ الْبَيْتَ:\n${first}`,
    choices: halfChoices(second, number, 'second', random),
    correctAnswer: second,
    note: noteOf(number),
  }));
}

/** The next verse: a verse is shown, the first half of the one after it picked. */
export function nextQuestions(random: Random): TuhfaQuestion[] {
  return verses.slice(0, -1).map(({ number }) => ({
    key: `tuhfa:next:${number}`,
    family: 'TUHFA_NEXT',
    promptArabic: `مَا الْبَيْتُ الَّذِي بَعْدَهُ؟\n${whole(number)}`,
    choices: halfChoices(verse(number + 1).first, number + 1, 'first', random),
    correctAnswer: verse(number + 1).first,
    note: noteOf(number + 1),
  }));
}

function letterQuestions(name: string, rules: Rules, prompt: (letter: string) => string, random: Random): TuhfaQuestion[] {
  return rules.flatMap(({ rule, letters, verse: number }) => [...letters].map(letter => {
    // Four rules at most: the right one and three others (noon has five).
    const others = shuffle(rules.filter(item => item.rule !== rule), random).slice(0, 3).map(item => item.rule);
    return {
      key: `tuhfa:${name}:${letter}`,
      family: 'TUHFA_RULE',
      promptArabic: prompt(letter),
      choices: shuffle([rule, ...others], random).map(text => ({ value: text, labelArabic: text })),
      correctAnswer: rule,
      note: noteOf(number),
    };
  }));
}

const shown = (letter: string) => (letter === 'ء' ? 'الْهَمْزَةُ' : `«${letter}»`);

/** The rule for a letter: after noon sakinah or tanween, after meem sakinah, and after the lam of al. */
export function ruleQuestions(random: Random): TuhfaQuestion[] {
  return [
    ...letterQuestions('noon', NOON_RULES, letter => `نُونٌ سَاكِنَةٌ أَوْ تَنْوِينٌ فِي آخِرِ كَلِمَةٍ، وَأَوَّلُ الَّتِي بَعْدَهَا ${shown(letter)}: مَا حُكْمُهَا؟`, random),
    ...letterQuestions('meem', MEEM_RULES, letter => `مِيمٌ سَاكِنَةٌ بَعْدَهَا ${shown(letter)}: مَا حُكْمُهَا؟`, random),
    ...letterQuestions('lam', LAM_RULES, letter => `لَامُ «أَلْ» قَبْلَ ${shown(letter)}: مَا حُكْمُهَا؟`, random),
  ];
}
