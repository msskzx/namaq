// The hadith quiz kinds (owner, 2026-11-18: every feature gets a quiz kind; sketch /mnt/project-files/hadith-forty):
// questions from al-Nawawi's Forty as al-Bukhari prints them (shared/data/hadith/forty.json), the most authentic first.
// Every choice is a real name or a real phrase of another hadith, and the reference is under the choices.
import fortyData from '../data/hadith/forty.json';
import { COLLECTOR, authentic, compilerOf, recordName, type AppForty, type FortyEntry, type FortyRecord, type HadithUnitView } from '../hadith';
import { SOURCES } from '../sources';
import { num } from '../quran/arabicNumber';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion } from './choiceKinds';
import { uniqueSources, type QuizSource } from './sources';

export const HADITH_NARRATOR = 'HADITH_NARRATOR';
export const HADITH_NARRATOR_NAME = 'من راوي الحديث؟';
export const HADITH_COMPLETE = 'HADITH_COMPLETE';
export const HADITH_COMPLETE_NAME = 'أكمل الحديث';
const CHOICES = 4;

const FORTY = fortyData as AppForty;
const bare = (text: string) => text.replace(/[ً-ْٰ]/g, '').replace(/[أإآ]/g, 'ا').replace(/\s+/g, ' ').trim();

/** Al-Bukhari's whole records of the Forty: each entry al-Nawawi takes whole from the Sahihayn, each record holding his wording. */
// Not Ibn Rajab's eight yet: their other Companions in al-Bukhari (`alsoFrom`) are not listed, so a wrong choice could be right.
const bukhari = (): { entry: FortyEntry; record: FortyRecord }[] =>
  FORTY.entries.filter(entry => !entry.partial && !entry.source).flatMap(entry =>
    entry.records.filter(record => record.book === 'bukhari' && !record.partial && record.isnadEnd).map(record => ({ entry, record })));

/** The saying as printed, from its opening quote mark to its closing one. */
const sayingOf = (record: FortyRecord) => {
  const text = record.text.slice(record.isnadEnd);
  const end = text.lastIndexOf('»');
  return end > 0 ? text.slice(0, end + 1) : text;
};

const shamela = (book: keyof AppForty['books'], id: number) => `https://shamela.ws/book/${FORTY.books[book].shamela}/${id}`;
/** The entry in the book that gathers it: al-Nawawi's Forty, or Ibn Rajab's additions in Jami' al-'Ulum. */
export const compiledSource = (entry: FortyEntry): QuizSource => {
  const { book, name } = compilerOf(entry);
  return { book: FORTY.books[book].title, author: name, at: `${entry.heading}، ص ${num(entry.pages[entry.pages.length - 1])}`, url: shamela(book, entry.shamela) };
};
/** One record of the saying in its book («رقم ١، ج ١، ص ٦»). */
export const recordSource = (record: FortyRecord): QuizSource => ({ book: FORTY.books[record.book].title, at: `رقم ${num(record.number)}${record.route ? ` (${record.route})` : ''}، ج ${num(record.volume)}، ص ${num(record.pages[0])}`, url: shamela(record.book, record.shamela) });
/** The record the saying is quoted from, then the entry that holds it. */
const sources = (entry: FortyEntry, record: FortyRecord): QuizSource[] => [recordSource(record), compiledSource(entry)];

/**
 * `cited.whose`: once answered, what each choice is, by its words (owner, 2026-11-22: every choice says whose it is), such as
 * the hadith a wrong ending closes, with the pages that say so among the sources.
 */
function choose(key: string, family: string, promptArabic: string, right: string, wrong: string[], cited: { sources: QuizSource[]; whose?: (label: string) => { line: string; sources: QuizSource[] } | undefined }, entry: FortyEntry, random: Random): ChoiceQuestion | null {
  const others = [...new Map(wrong.filter(label => bare(label) !== bare(right)).map(label => [bare(label), label])).values()];
  if (others.length < CHOICES - 1) return null;
  const choices = shuffle([right, ...shuffle(others, random).slice(0, CHOICES - 1)], random);
  const whose = choices.flatMap((label, i) => { const each = cited.whose?.(label); return each ? [[i, each] as const] : []; });
  return {
    key: `${family}:${key}`,
    family,
    promptArabic,
    choices: choices.map((label, i) => ({ value: String(i), labelArabic: label })),
    correctAnswer: String(choices.indexOf(right)),
    sources: uniqueSources([...cited.sources, ...whose.flatMap(([, each]) => each.sources)]),
    ...(whose.length && { whereOf: Object.fromEntries(whose.map(([i, each]) => [String(i), each.line])) }),
    // Looked up in the Forty, searched by its words; after the answer, this hadith's page.
    look: { view: 'hadith', mark: entry.n },
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
  // Each Companion offered, with the hadith of the Forty al-Bukhari has from him: «راوي الحديث ١٦ من الأربعين».
  const narrates = (companion: string) => {
    const his = all.filter(other => bare(other.entry.companion) === bare(companion));
    const numbers = [...new Set(his.map(other => other.entry.n))].sort((a, b) => a - b);
    return numbers.length ? { line: `راوي ${numbers.length > 1 ? 'الأحاديث' : 'الحديث'} ${numbers.map(n => num(n)).join('، ')} من الأربعين`, sources: his.map(other => recordSource(other.record)) } : undefined;
  };
  return shuffle(all.flatMap(({ entry, record }) => {
    const saying = sayingOf(record);
    if (namesOf(entry.companion).some(name => bare(saying).includes(name))) return [];
    const also = new Set([entry.companion, ...(entry.alsoFrom ?? [])].map(bare));
    const wrong = all.map(other => other.entry.companion).filter(name => !also.has(bare(name)));
    const question = choose(`${record.number}`, HADITH_NARRATOR, `${saying}\nعن أي صحابي روى البخاري هذا الحديث؟`, entry.companion, wrong, { sources: sources(entry, record), whose: narrates }, entry, random);
    return question ? [{ ...question, witness: narratorWitness(entry) }] : [];
  }), random);
}

/**
 * «الشاهد» of «من راوي الحديث؟»: the entry's opening in its compiler's words, up to the Companion's «رضي الله عنه» («عن أبي
 * عبد الرحمن عبد الله بن مسعود رضي الله عنه»), his name in it. It stops there, before the saying: al-Nawawi often runs his
 * lead straight into the Prophet's ﷺ words with no colon between.
 */
export function narratorWitness(entry: FortyEntry): ChoiceQuestion['witness'] {
  const lead = entry.text.replace(/^«/, '').match(/^.*?رضي الله (?:تعالى )?(?:عنهما|عنها|عنه)/)?.[0];
  if (!lead) return undefined;
  const { name, book } = compilerOf(entry);
  return { by: `قال ${name} في ${FORTY.books[book].title}:`, text: lead, lit: entry.companion };
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
    // Under each wrong ending, the hadith it closes (it was one note under the choices before, owner 2026-11-22).
    const whose = (label: string) => { const other = wrong.find(each => each.end === label); return other && { line: `آخر ${recordName(other.record, num)}`, sources: [recordSource(other.record)] }; };
    const question = choose(`${record.number}`, HADITH_COMPLETE, `${start} …»`, end, wrong.map(other => other.end), { sources: sources(entry, record), whose }, entry, random);
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

/** Every book al-Nawawi names holds the hadith whole from his Companion in our records: not no. 33 (part in the Sahihayn), no. 32 (Ibn Majah has it from others) or no. 41 (al-Hujja not at hand). */
const citedWhole = (entry: FortyEntry) => !entry.partial && !/وغيره/.test(entry.text.slice(entry.text.lastIndexOf('»')))
  && entry.named.every(name => entry.records.some(record => COLLECTOR[record.book] === name && !record.partial && !record.from));


/**
 * «من أخرجه؟» (owner, 2026-11-18: every feature a quiz kind): al-Nawawi's quotation, and the books he names for it. The
 * question asks his citation, a fact of his book (so not Ibn Rajab's eight), not where else a report is found; the wrong choices are other entries' citations.
 */
export function bookQuestions(random: Random): ChoiceQuestion[] {
  const all = FORTY.entries.filter(entry => !entry.source && authentic(entry) && citedWhole(entry)).flatMap(entry => { const quotation = quotationOf(entry); return quotation ? [{ entry, quotation, books: namedBooks(entry.named) }] : []; });
  // «مسلم» against «البخاري ومسلم» is half right, so a choice sharing any book with the right one is never offered.
  const apart = (a: readonly string[], b: readonly string[]) => !a.some(book => b.includes(book));
  return shuffle(all.flatMap(({ entry, quotation, books }) => {
    const wrong = all.filter(other => apart(other.entry.named, entry.named)).map(other => other.books);
    const question = choose(`${entry.n}`, HADITH_BOOK, `${quotation}\nإلى أي كتب عزاه النووي؟`, books, wrong,
      { sources: [compiledSource(entry)] }, entry, random);
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

export const HADITH_CHAIN = 'HADITH_CHAIN';
export const HADITH_CHAIN_NAME = 'من حدّث به؟';

/** A narrator's name as a key: no harakat, one alif, so «يَحْيَى بْنِ سَعِيدٍ» and «يحيى بن سعيد» are one name. */
const nameKey = (name: string) => bare(name).replace(/[أإآٱ]/g, 'ا');
const plain = (text: string) => text.replace(/[ً-ْٰ]/g, '');
/** A name as the question shows it: no harakat, and «أبي/أبا فلان» as «أبو فلان», so no case ending tells its place. */
const shownName = (name: string) => plain(name).replace(/^(?:أبي|أبا) /, 'أبو ');
/** «أبي» alone is «my father», a name only inside its own chain. */
const ownFather = (name: string) => /^(?:أبي|أبيه)$/.test(shownName(name));

/** The words that tell a man apart: not «بن», «ابن», «أبو/أبي», «هو». */
const telling = (name: string) => nameKey(name).split(' ').filter(word => !/^(?:بن|ابن|ابو|ابي|ابا|هو)$/.test(word));
/** Two names that may be one man: every telling word of one is in the other («الأعمش» and «سليمان الأعمش», «سفيان» and «سفيان بن عيينة»). */
const maySame = (a: string, b: string) => {
  const [x, y] = [telling(a), telling(b)];
  const [short, long] = x.length <= y.length ? [x, y] : [y, x];
  return short.length > 0 && short.every(word => long.includes(word));
};

/** The chain of a drawn Bukhari record from al-Bukhari's teacher to the Companion, each with the word he narrated it by. */
const chainOf = (record: FortyRecord) => {
  const nodes = (record.isnad?.nodes ?? []).filter(node => node.id !== 'c').sort((a, b) => Number(a.id.slice(1)) - Number(b.id.slice(1)));
  return nodes.map(node => ({ name: node.label, by: record.isnad!.edges.find(edge => edge.from === node.id)?.label ?? '' }));
};

/**
 * «من حدّث به؟» (owner, 2026-11-19; plan /mnt/project-files/hadith-sciences, feature 1): al-Bukhari's chain for one of the
 * Forty as he prints it, one narrator between his teacher and the Companion left out, and who stands there. A fact of the
 * record: the wrong choices are narrators of the other chains, never one who may be the same man, nor one named anywhere in
 * this hadith's records (another route could have him). Names without harakat, so no case ending tells the place.
 */
export function chainQuestions(random: Random): ChoiceQuestion[] {
  const chains = bukhari().flatMap(({ entry, record }) => (record.isnad ? [{ entry, record, chain: chainOf(record) }] : []));
  return shuffle(chains.flatMap(({ entry, record, chain }) => {
    const told = bare(entry.records.map(each => each.text).join(' ')).replace(/[أإآٱ]/g, 'ا');
    return chain.slice(1, -1).flatMap((link, k) => {
      const at = k + 1;
      // «حدثنا أبي» names no one outside its own chain, so that place is not asked.
      if (ownFather(link.name)) return [];
      const near = (spread: number) => chains.filter(other => other.record !== record)
        .flatMap(other => other.chain.slice(Math.max(1, at - spread), Math.min(other.chain.length - 1, at + spread + 1)).map(each => each.name))
        .filter(name => !ownFather(name) && !chain.some(own => maySame(own.name, name)) && !told.includes(nameKey(name)));
      const pool = near(1).length >= CHOICES - 1 ? near(1) : near(chain.length);
      const wrong = pool.filter((name, i) => pool.findIndex(other => maySame(other, name)) === i).map(shownName);
      // The chain keeps its own case («عن أبي صالح»); only the choices are put in one form.
      const shown = chain.map((each, i) => `${plain(each.by)} ${i === at ? '…' : plain(each.name)}`).join('، ');
      const question = choose(`${record.number}:${at}`, HADITH_CHAIN, `${recordName(record, num)}:\n${shown}\nمن حدّث به في موضع «…»؟`, shownName(link.name), wrong,
        { sources: sources(entry, record) }, entry, random);
      return question ? [question] : [];
    });
  }), random);
}

export const hadithChainQuiz: ChoiceKind = {
  id: HADITH_CHAIN,
  name: HADITH_CHAIN_NAME,
  party: true,
  questions: (_scope, _difficulty, random, limit = Infinity) => chainQuestions(random).slice(0, limit),
  count: () => chainQuestions(Math.random).length,
};

/** A hadith page's book (shared/hadith.ts HadithUnitView): its kitab and bab, with the edition and link where shared/sources.ts lists the book. */
export function unitSource(unit: Pick<HadithUnitView, 'book' | 'compiler' | 'kitab' | 'bab'>): QuizSource {
  const listed = SOURCES.find(source => source.title.ar === unit.book);
  const at = [unit.kitab, unit.bab].filter(Boolean).join('، ');
  return {
    book: unit.book, ...(unit.compiler && { author: unit.compiler }), ...(at && { at }),
    ...(listed && { url: listed.link.url, ...(listed.edition && { edition: listed.edition }) }),
  };
}
