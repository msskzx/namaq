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

export const HADITH_BOOK = 'HADITH_BOOK';
export const HADITH_BOOK_NAME = 'من أخرجه؟';

/** «الترمذي والنسائي», «مسلم وأحمد والدارمي»: the books al-Nawawi names after a hadith, in his order. */
export const namedBooks = (named: readonly string[]) => (named.length > 1 ? `${named.slice(0, -1).join('، ')} و${named[named.length - 1]}` : named[0]);

/** al-Nawawi's quotation without the words after it that name its books; none when a second quotation follows (nos. 19 and 27). */
function quotationOf(entry: FortyEntry) {
  const end = entry.text.indexOf('»');
  if (end < 0 || entry.text.indexOf('«', end) >= 0) return null;
  return entry.text.slice(0, end + 1);
}

const BOOK_OF: Record<string, string> = {
  البخاري: 'bukhari', مسلم: 'muslim', الترمذي: 'tirmidhi', النسائي: 'nasai', 'أبو داود': 'abudawud', 'ابن ماجه': 'ibnmajah', أحمد: 'ahmad',
  الدارمي: 'darimi', الدارقطني: 'daraqutni', البيهقي: 'bayhaqi', مالك: 'muwatta',
};
/** Every book al-Nawawi names holds the hadith whole from his Companion in our records: not no. 33 (part in the Sahihayn), no. 32 (Ibn Majah has it from others) or no. 41 (al-Hujja not at hand). */
const citedWhole = (entry: FortyEntry) => !entry.partial && !/وغيره/.test(entry.text.slice(entry.text.lastIndexOf('»')))
  && entry.named.every(name => entry.records.some(record => record.book === BOOK_OF[name] && !record.partial && !record.from));

/**
 * The hadith outside the Sahihayn a quiz may carry (owner, 2026-11-18: quizzes start with the Sahihayn or what a named scholar
 * graded sahih, undisputed): al-Tirmidhi's «حسن صحيح» on nos. 11, 18, 28 and 29, printed in his Sunan beside each. Not no. 42,
 * which his printed Sunan grades «حسن غريب», nor 12, 31 and 39, which Ibn Rajab weakens.
 */
const GRADED_SAHIH = new Set([11, 18, 28, 29]);
const sahih = (entry: FortyEntry) => GRADED_SAHIH.has(entry.n) || (entry.records.length > 0 && entry.records.every(record => record.book === 'bukhari' || record.book === 'muslim'));

/**
 * «من أخرجه؟» (owner, 2026-11-18: every feature a quiz kind): al-Nawawi's quotation, and the books he names for it. The
 * question asks his citation, a fact of his book, not where else a report is found; the wrong choices are other entries' citations.
 */
export function bookQuestions(random: Random): ChoiceQuestion[] {
  const all = FORTY.entries.filter(entry => sahih(entry) && citedWhole(entry)).flatMap(entry => { const quotation = quotationOf(entry); return quotation ? [{ entry, quotation, books: namedBooks(entry.named) }] : []; });
  // «مسلم» against «البخاري ومسلم» is half right, so a choice sharing any book with the right one is never offered.
  const apart = (a: readonly string[], b: readonly string[]) => !a.some(book => b.includes(book));
  return shuffle(all.flatMap(({ entry, quotation, books }) => {
    const wrong = all.filter(other => apart(other.entry.named, entry.named)).map(other => other.books);
    const question = choose(`${entry.n}`, HADITH_BOOK, `${quotation}\nإلى أي كتب عزاه النووي؟`, books, wrong,
      `الأربعون النووية، ${entry.heading}، ص ${num(entry.pages[entry.pages.length - 1])}`, random);
    return question ? [question] : [];
  }), random);
}

export const hadithBookQuiz: ChoiceKind = {
  id: HADITH_BOOK,
  name: HADITH_BOOK_NAME,
  party: true,
  questions: (_scope, _difficulty, random, limit = Infinity) => bookQuestions(random).slice(0, limit),
  count: () => bookQuestions(Math.random).length,
};
