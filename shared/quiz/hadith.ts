// The hadith quiz kinds (owner, 2026-11-18: every feature gets a quiz kind; sketch /mnt/project-files/hadith-forty):
// questions from al-Nawawi's Forty as al-Bukhari prints them (shared/data/hadith/forty.json), the most authentic first.
// Every choice is a real name or a real phrase of another hadith, and the reference is under the choices.
import fortyData from '../data/hadith/forty.json';
import { recordName, type AppForty, type FortyEntry, type FortyRecord } from '../hadith';
import { num } from '../quran/arabicNumber';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion } from './choiceKinds';

export const HADITH_NARRATOR = 'HADITH_NARRATOR';
export const HADITH_NARRATOR_NAME = 'من راوي الحديث؟';
export const HADITH_COMPLETE = 'HADITH_COMPLETE';
export const HADITH_COMPLETE_NAME = 'أكمل الحديث';
const CHOICES = 4;

const FORTY = fortyData as AppForty;
const bare = (text: string) => text.replace(/[ً-ْٰ]/g, '').replace(/[أإآ]/g, 'ا').replace(/\s+/g, ' ').trim();

/** Al-Bukhari's whole records of the Forty: each entry al-Nawawi takes whole from the Sahihayn, each record holding his wording. */
const bukhari = (): { entry: FortyEntry; record: FortyRecord }[] =>
  FORTY.entries.filter(entry => !entry.partial).flatMap(entry =>
    entry.records.filter(record => record.book === 'bukhari' && !record.partial && record.isnadEnd).map(record => ({ entry, record })));

/** The saying as printed, from its opening quote mark to its closing one. */
const sayingOf = (record: FortyRecord) => {
  const text = record.text.slice(record.isnadEnd);
  const end = text.lastIndexOf('»');
  return end > 0 ? text.slice(0, end + 1) : text;
};

const source = (entry: FortyEntry, record: FortyRecord) =>
  `${recordName(record, num)}، ج ${num(record.volume)}، ص ${num(record.pages[0])}؛ الأربعون النووية، ${entry.heading}`;

function choose(key: string, family: string, promptArabic: string, right: string, wrong: string[], note: string, random: Random): ChoiceQuestion | null {
  const others = [...new Map(wrong.filter(label => bare(label) !== bare(right)).map(label => [bare(label), label])).values()];
  if (others.length < CHOICES - 1) return null;
  const choices = shuffle([right, ...shuffle(others, random).slice(0, CHOICES - 1)], random);
  return {
    key: `${family}:${key}`,
    family,
    promptArabic,
    choices: choices.map((label, i) => ({ value: String(i), labelArabic: label })),
    correctAnswer: String(choices.indexOf(right)),
    note: { label: 'المصدر', text: note },
    evidence: { claimKeys: [] },
  };
}

/** The ways a Companion's name can show in a saying («ابن عمر» for «عبد الله بن عمر»), so a question never gives itself away. */
const namesOf = (companion: string) => [companion, companion.replace(/^عبد الله بن /, 'ابن '), companion.replace(/^(أبو|أبي) /, '')].map(bare);

/**
 * «من راوي الحديث؟»: the saying as al-Bukhari prints it, and which Companion it comes from; the wrong choices are the
 * Companions of the other hadith, never one al-Bukhari also has it from. A saying that names its Companion is not asked.
 */
export function narratorQuestions(random: Random): ChoiceQuestion[] {
  const all = bukhari();
  return shuffle(all.flatMap(({ entry, record }) => {
    const saying = sayingOf(record);
    if (namesOf(entry.companion).some(name => bare(saying).includes(name))) return [];
    const also = new Set([entry.companion, ...(entry.alsoFrom ?? [])].map(bare));
    const wrong = all.map(other => other.entry.companion).filter(name => !also.has(bare(name)));
    const question = choose(`${record.number}`, HADITH_NARRATOR, `${saying}\nعن أي صحابي روى البخاري هذا الحديث؟`, entry.companion, wrong, source(entry, record), random);
    return question ? [question] : [];
  }), random);
}

/** A saying's last two words, and the saying before them; none when the words are already said before. */
function ending(record: FortyRecord) {
  const saying = sayingOf(record);
  const words = saying.replace(/[«»]/g, '').replace(/[.،:]+$/, '').trim().split(/\s+/);
  if (words.length < 6) return null;
  const start = saying.replace(/»$/, '').trim().split(/\s+/).slice(0, -2).join(' ');
  const end = words.slice(-2).join(' ');
  // A saying whose last words come earlier in it would give the answer away («قال: لا تغضب، فردد مرارًا قال: لا تغضب»).
  return bare(start).includes(bare(end)) ? null : { start, end };
}

/** «أكمل الحديث»: a saying's last words hidden; the wrong choices are the last words of the other sayings. */
export function completeQuestions(random: Random): ChoiceQuestion[] {
  const all = bukhari().flatMap(item => { const end = ending(item.record); return end ? [{ ...item, ...end }] : []; });
  return shuffle(all.flatMap(({ entry, record, start, end }) => {
    const seen = new Set([bare(end)]);
    const wrong = shuffle(all.filter(other => other.record !== record), random)
      .filter(other => !seen.has(bare(other.end)) && seen.add(bare(other.end))).slice(0, CHOICES - 1);
    const from = wrong.map(other => `«${other.end}» من ${recordName(other.record, num)}`).join('، ');
    const question = choose(`${record.number}`, HADITH_COMPLETE, `${start} …»`, end, wrong.map(other => other.end), `${source(entry, record)}. والخيارات الأخرى أواخر أحاديث أخرى: ${from}`, random);
    return question ? [question] : [];
  }), random);
}

export const hadithNarratorQuiz: ChoiceKind = {
  id: HADITH_NARRATOR,
  name: HADITH_NARRATOR_NAME,
  party: true,
  questions: (_scope, _difficulty, random, limit = Infinity) => narratorQuestions(random).slice(0, limit),
  count: () => narratorQuestions(Math.random).length,
};

export const hadithCompleteQuiz: ChoiceKind = {
  id: HADITH_COMPLETE,
  name: HADITH_COMPLETE_NAME,
  party: true,
  questions: (_scope, _difficulty, random, limit = Infinity) => completeQuestions(random).slice(0, limit),
  count: () => completeQuestions(Math.random).length,
};
