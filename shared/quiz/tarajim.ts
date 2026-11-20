// The tarajim's question kinds (owner, 2026-11-18; sketch tarajim-app/sketch-dark.png, screens 5 and 8), from the people
// whose Siyar entry is converted (shared/data/tarajim/people.json) and nothing else: where two nasabs meet, and whose
// virtue this is. Every value is the book's, and after answering the note says where it is, so the tree or the person's
// page is the way to check it.
import peopleJson from '../data/tarajim/people.json';
import virtueSkip from '../data/tarajim/virtueQuizSkip.json';
import { pageLabel, sayer, sayerLine, type AppPerson } from '../tarajim';
import { kunyaFacts, laqabFacts, type NameFact } from '../tarajimNames';
import { bareName, chainOf, lineOf, meetingOf, type LineName } from '../tarajimLine';
import { genitive, peopleGraph, TIE_KINDS, tieWord, type TieKind } from '../tarajimGraph';
import { shuffle, type Random } from './random';
import { PICKS, type ChoiceKind, type ChoiceQuestion } from './choiceKinds';

export const TARAJIM_NASAB = 'TARAJIM_NASAB';
export const TARAJIM_VIRTUE = 'TARAJIM_VIRTUE';
export const TARAJIM_TIE = 'TARAJIM_TIE';
export const TARAJIM_NASAB_NAME = 'أين يلتقي النسبان؟';
export const TARAJIM_VIRTUE_NAME = 'صاحب المنقبة';
export const TARAJIM_TIE_NAME = 'ما صلته به؟';
export const TARAJIM_KUNYA = 'TARAJIM_KUNYA';
export const TARAJIM_LAQAB = 'TARAJIM_LAQAB';
export const TARAJIM_KUNYA_NAME = 'ما كنيته؟';
export const TARAJIM_LAQAB_NAME = 'بمَ لُقّب؟';
export const PROPHET_NAMES = 'PROPHET_NAMES';
export const PROPHET_NAMES_NAME = 'أسماء النبي ﷺ';

const PEOPLE = peopleJson as AppPerson[];
const plain = (text: string) => text.replace(/[ً-ْٰـ]/g, '');
/** Not asked: virtues another person in the app could rightly own too (shared/data/tarajim/virtueQuizSkip.json). */
const SKIP: Record<string, string> = virtueSkip.skip;
const nameOf = (person: AppPerson) => (person.slug === 'prophet-muhammad' && !person.name.includes('ﷺ') ? `${person.name} ﷺ` : person.name);

/** Every person's line, once per list of people. */
const lineCache = new WeakMap<AppPerson[], Map<string, LineName[]>>();
function linesOf(people: AppPerson[]) {
  let lines = lineCache.get(people);
  if (!lines) lineCache.set(people, (lines = new Map(people.map(person => [person.slug, lineOf(person, people)]))));
  return lines;
}

const words = (text: string) => text.split(/\s+/).length;
/** Whether `name` stands as whole words in `text`, both bare. */
const hasName = (text: string, name: string) => ` ${bareName(text)} `.includes(` ${bareName(name)} `);

/**
 * Where two people's nasabs meet: the nearest father both lines name. The wrong choices are fathers below the meeting
 * on either line, so each is clearly one side's alone (never a father above it, who is shared too); a pair with fewer
 * than three such fathers is not asked, nor one whose names in the question already say where they meet.
 */
export function nasabQuestions(people: AppPerson[] = PEOPLE): ChoiceQuestion[] {
  const lines = linesOf(people);
  const questions: ChoiceQuestion[] = [];
  for (let i = 0; i < people.length; i += 1) for (let j = i + 1; j < people.length; j += 1) {
    const [a, b] = [people[i], people[j]];
    const [la, lb] = [lines.get(a.slug)!, lines.get(b.slug)!];
    const at = meetingOf(la, lb);
    if (!at) continue;
    const answer = plain(la[at.a].name);
    // A name of one or two words, for the answer as for the others (not «الصديق أبي بكر عبد الله», a kunya and a name).
    if (words(answer) > 2 || hasName(nameOf(a), answer) || hasName(nameOf(b), answer)) continue;
    const shared = new Set([...la.slice(at.a), ...lb.slice(at.b)].map(n => n.bare));
    // One father from each side in turn.
    const sideA = la.slice(1, at.a).map(n => plain(n.name));
    const sideB = lb.slice(1, at.b).map(n => plain(n.name));
    const turns = Array.from({ length: Math.max(sideA.length, sideB.length) }, (_, k) => [sideB[sideB.length - 1 - k], sideA[sideA.length - 1 - k]]).flat();
    const below = turns.filter((name): name is string => !!name && words(name) <= 2 && !shared.has(bareName(name)))
      .filter((name, k, all) => all.findIndex(other => bareName(other) === bareName(name)) === k);
    if (below.length < 3) continue;
    const pages = [a, b].filter(p => p.fullName).map(p => `${nameOf(p)}: ${pageLabel(p.fullName!.refs)}`).join('؛ ');
    questions.push({
      key: `${TARAJIM_NASAB}:${a.slug}:${b.slug}`,
      family: TARAJIM_NASAB,
      promptArabic: `أين يلتقي نسب ${genitive(nameOf(a))} ونسب ${genitive(nameOf(b))}؟`,
      choices: [answer, ...below.slice(0, 3)].map(name => ({ value: name, labelArabic: name })),
      correctAnswer: answer,
      note: { label: 'النسبان', text: `${chainOf(a, la, at.a)}\n${chainOf(b, lb, at.b)}\n${pages ? `${pages}\n` : ''}وشجرة النسب في التراجم` },
      look: { view: 'nasab', slugs: [a.slug, b.slug], mark: true },
      evidence: { claimKeys: [] },
    });
  }
  return questions;
}

/**
 * Whether a quote names `name`: as whole words, with a joined «و ف ب ل ك» before it and the accusative «ا» after
 * («جعفراً»), so «علي» is not found in «عليه» nor «عمر» in «عمرو».
 */
function mentions(quote: string, name: string) {
  const escaped = bareName(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?:^|[\\s«(])[وفبلك]?${escaped}ا?(?=$|[\\s،.:؛»)!؟])`, 'u').test(bareName(quote));
}

/** The words that name a person in a quote: the first name, «ابن» or «بنت» and the father, each kunya and laqab in any case. */
function namesOf(person: AppPerson, line: LineName[]) {
  const first = plain(person.name).split(/\s+/);
  const own = first[0] === 'عبد' ? first.slice(0, 2).join(' ') : first[0];
  const fatherWords = line[1] ? plain(line[1].name).split(/\s+/) : [];
  // The father as printed, and each two words of it («الصديق أبي بكر عبد الله» → «أبي بكر», «عبد الله»).
  const fathers = [fatherWords.join(' '), ...fatherWords.slice(1).map((_, k) => fatherWords.slice(k, k + 2).join(' '))].filter(Boolean);
  const forms = (text: string) => {
    const bare = bareName(text);
    const kunya = bare.match(/^(?:ابو|ابا|ابي|ام) (.+)$/u);
    return kunya ? ['ابو', 'ابا', 'ابي', 'ام'].map(k => `${k} ${kunya[1]}`) : [bare];
  };
  // The name with or without its article: Ibn Ma'in's «مسور ثقة» names al-Miswar.
  const bareOwn = /^ال\S{3,}$/u.test(own) ? [own.slice(2)] : [];
  return [own, ...bareOwn, ...fathers.flatMap(father => [`ابن ${father}`, `بن ${father}`, `بنت ${father}`]),
    ...[...person.kunya, ...person.laqab].flatMap(k => forms(k.text))].map(bareName);
}

/**
 * A virtue as the entry prints it, with who says it, and four people to pick from. A virtue that names its owner
 * (name, kunya, laqab or «ابن» his father) gives the answer away, so it is not asked. The wrong choices are other people
 * in the app of the same sex, never the Prophet ﷺ, not the owner's brothers or sisters (what is said of a man's uncle is said of his other
 * uncles too), and no one the quote names or who says it; a virtue with fewer than three such people waits for more
 * entries to be converted.
 */
export function virtueQuestions(people: AppPerson[] = PEOPLE, random: Random = Math.random): ChoiceQuestion[] {
  const questions: ChoiceQuestion[] = [];
  const lines = linesOf(people);
  const fatherKey = (p: AppPerson) => p.parents.find(parent => parent.sex === 'MALE')?.slug ?? lines.get(p.slug)!.slice(1, 3).map(n => n.bare).join('/');
  for (const person of people) {
    const names = namesOf(person, lines.get(person.slug)!);
    person.virtues.forEach((virtue, k) => {
      const quote = virtue.text;
      // A quote that names its owner gives the answer; one that only points («هذا ممن…») needs its scene to say whom.
      // A sayer that names the owner («امرأة ابن رواحة») gives it away too; and some virtues fit others as well (SKIP).
      if (names.some(name => mentions(quote, name) || virtue.by.some(by => mentions(by, name)))) return;
      // A virtue the book also contests, or gives with no sayer («قيل»), is not one answer: not asked.
      if (/^(?:هذا|هذه)\s/u.test(bareName(quote)) || (virtue.id && SKIP[virtue.id]) || virtue.disputed || virtue.anonymous) return;
      const others = shuffle(people.filter(p => p.slug !== person.slug && p.slug !== 'prophet-muhammad' && p.sex === person.sex
        && fatherKey(p) !== fatherKey(person)
        && !mentions(quote, plain(p.name).split(/\s+/)[0])
        && !virtue.by.some(by => bareName(by).startsWith(bareName(plain(p.name).split(/\s+/)[0])))), random).slice(0, 3);
      if (others.length < 3) return;
      const choices = shuffle([person, ...others], random).map(p => ({ value: p.slug, labelArabic: nameOf(p) }));
      questions.push({
        key: `${TARAJIM_VIRTUE}:${person.slug}:${k}`,
        family: TARAJIM_VIRTUE,
        promptArabic: `«${virtue.text}»${virtue.by.length ? ` — ${sayer(virtue)}` : ''}\nفيمن قيل هذا؟`,
        choices,
        correctAnswer: person.slug,
        note: { label: 'المصدر', text: `${pageLabel(virtue.refs)}، في ترجمة ${genitive(nameOf(person))}` },
        look: { view: 'virtues', slugs: choices.map(choice => choice.value), mark: { slug: person.slug, index: k } },
        evidence: { claimKeys: [] },
      });
    });
  }
  return questions;
}

/** A name's words as names are matched, «أبي» and «أبا» read «أبو». */
const nameWords = (name: string) => bareName(name.replace(/ﷺ/g, '')).split(' ').filter(Boolean).map(word => (/^اب[يا]$/u.test(word) ? 'ابو' : word));
const COMPOUND_WORD = /^(?:عبد|ابو|ام|ذو|ذي)$/u;
/** The name at the start of `words` («عبد الله», «أبو سفيان», «عمر»). */
const headName = (words: string[]) => (COMPOUND_WORD.test(words[0] ?? '') ? words.slice(0, 2) : words.slice(0, 1)).join(' ');
/** A person's own name as shown, and the father the shown name gives («زينب بنت محمد» → محمد). */
function shownName(name: string) {
  const words = nameWords(name);
  const at = words.findIndex(word => word === 'بن' || word === 'بنت');
  return { own: headName(words), father: at > 0 ? headName(words.slice(at + 1)) : '', kunya: /^(?:ابو|ام) /u.test(headName(words)) ? headName(words).split(' ')[1] : '' };
}

/**
 * The tie the two names alone tell (owner, 2026-11-19: «ما صلة عمر بن أبي سلمة بأبي سلمة؟» is answered by the name): «X بن
 * B» is B's son, «أم سلمة» is Salamah's mother, two people «بن» one father are brothers. None when the names tell nothing.
 */
export function tieTold(a: string, b: string): TieKind | undefined {
  const [x, y] = [shownName(a), shownName(b)];
  if (x.father && x.father === y.own) return 'child';
  if (y.father && y.father === x.own) return 'parent';
  if (x.kunya && x.kunya === y.own) return 'parent';
  if (y.kunya && y.kunya === x.own) return 'child';
  if (x.father && x.father === y.father) return 'sibling';
  // «أم سلمة» and «أبو سلمة» are wife and husband; «أم سلمة» and «عمر بن أبي سلمة» mother and son.
  if (x.kunya && x.kunya === y.kunya && x.own !== y.own) return 'spouse';
  if (x.kunya && y.father === `ابو ${x.kunya}`) return 'parent';
  if (y.kunya && x.father === `ابو ${y.kunya}`) return 'child';
  return undefined;
}

/**
 * «ما صلته به؟» (owner, 2026-11-18; graph sketch, screen 4): what one converted person is to another the entries tie him
 * to directly, asked in plain words (owner, 2026-11-19): «ما صلة الزبير بن العوام بصفية بنت عبد المطلب؟» → «ابنها». The
 * choices are the other kinds of tie, never one that also holds between the two (al-Zubayr is the Prophet's ﷺ kin and his
 * companion: «صاحبه» is not offered). Not asked when the answer is in the question: the names tell the tie (tieTold), or
 * a Companion is asked of the Prophet ﷺ, where «أبوه»، «ابنه»، «أخوه» beside «صاحبه» leave one choice anyone could pick.
 */
export function tieQuestions(people: AppPerson[] = PEOPLE): ChoiceQuestion[] {
  const graph = peopleGraph(people);
  const bySlug = new Map(people.map(p => [p.slug, p]));
  const questions: ChoiceQuestion[] = [];
  const family: TieKind[] = ['parent', 'spouse', 'child', 'sibling'];
  for (const first of people) {
    for (const to of [...new Set((graph.ties.get(first.slug) ?? []).map(t => t.to))]) {
      const other = bySlug.get(to);
      if (!other || other.slug < first.slug) continue;
      // Asked so that «a» is the companion, never «the one he was a companion of», which has no plain word.
      const nearest = (from: AppPerson, of: string) => TIE_KINDS.find(kind => (graph.ties.get(from.slug) ?? []).some(t => t.to === of && t.kind === kind));
      const [a, b] = nearest(first, other.slug) === 'accompanied' ? [first, other] : [other, first];
      const ties = (graph.ties.get(b.slug) ?? []).filter(t => t.to === a.slug);
      // Only ties stated as settled: one «على خلاف» or from an unnamed «قيل» is shown attributed on the pages, never asked.
      if (ties.length === 0 || ties.some(t => t.link.disputed || t.link.anonymous)) continue;
      const kinds = new Set(ties.map(t => t.kind));
      const answer = TIE_KINDS.find(kind => kinds.has(kind))!;
      if (answer === 'accompanied') continue;
      if (tieTold(nameOf(a), nameOf(b)) === answer) continue;
      if (answer === 'companion' && (a.slug === 'prophet-muhammad' || b.slug === 'prophet-muhammad')) continue;
      const word = (kind: TieKind) => tieWord(kind, a.sex, b.sex);
      // Wrong choices are family kinds not stated between the two; «قريبه» is never offered beside a family answer, since
      // a father or a brother is a relative too.
      const pool = (answer === 'cousin' || answer === 'companion' ? family : family.filter(k => k !== answer));
      const wrong = pool.filter(kind => !kinds.has(kind)).map(word).filter((w, i, all) => all.indexOf(w) === i && w !== word(answer));
      if (answer !== 'cousin' && answer !== 'companion' && !kinds.has('companion') && wrong.length < 3) wrong.push(word('companion'));
      if (wrong.length < 3) continue;
      const link = ties.find(t => t.kind === answer)!.link;
      questions.push({
        key: `${TARAJIM_TIE}:${a.slug}:${b.slug}`,
        family: TARAJIM_TIE,
        promptArabic: `ما صلة ${genitive(nameOf(a))} ب${genitive(nameOf(b))}؟`,
        choices: [word(answer), ...wrong.slice(0, 3)].map(w => ({ value: w, labelArabic: w })),
        correctAnswer: word(answer),
        note: { label: 'المصدر', text: `${link.text ? `${link.text}\n` : ''}${sayer(link)} · ${pageLabel(link.refs)}` },
        look: { view: 'ties', slug: b.slug, mark: a.slug },
        evidence: { claimKeys: [] },
      });
    }
  }
  return questions;
}

/**
 * «ما كنيته؟» and «بمَ لُقّب؟» (owner, 2026-11-19; sketch titles-quiz/sketch-dark.png, screens 1 and 2): one person's
 * kunya or laqab, and three other people's of the same sex (owner: a question about a woman offers women's), each as one
 * says it. Never a name the person also bears, nor two that read the same; a kunya after a name in the question
 * («أبو سلمة» for عمر بن أبي سلمة) is not offered, since it only misleads. The Prophet's ﷺ names are never a choice
 * (kunyaFacts, laqabFacts leave him out). The note gives the book's words and page; there is no «ابحث عن الجواب», since
 * the person's page would show the answer itself.
 */
export function nameQuestions(family: typeof TARAJIM_KUNYA | typeof TARAJIM_LAQAB, people: AppPerson[] = PEOPLE, random: Random = Math.random): ChoiceQuestion[] {
  const facts: NameFact[] = family === TARAJIM_KUNYA ? kunyaFacts(people) : laqabFacts(people);
  const ownNames = new Map<string, Set<string>>();
  for (const { person, name } of facts) ownNames.set(person.slug, (ownNames.get(person.slug) ?? new Set()).add(bareName(name)));
  // Another man's kunya can be the Prophet's ﷺ own («أبو القاسم», Muhammad ibn Abi Hudhayfah): never a wrong choice.
  const prophet = people.find(p => p.slug === 'prophet-muhammad');
  const his = new Set(prophet ? [...prophet.titles, ...prophet.laqab, ...prophet.kunya].map(f => bareName('name' in f ? (f.name as string) : f.text)) : []);
  return facts.flatMap(({ person, name, fact }, k) => {
    const words = new Set(nameWords(person.name));
    const own = ownNames.get(person.slug)!;
    const others = shuffle(facts.filter(other => other.person.sex === person.sex && other.person.slug !== person.slug
      && !own.has(bareName(other.name)) && !his.has(bareName(other.name)) && !(family === TARAJIM_KUNYA && nameWords(other.name).slice(1).some(word => words.has(word)))), random)
      .filter((other, i, all) => all.findIndex(each => bareName(each.name) === bareName(other.name)) === i)
      .slice(0, 3);
    if (others.length < 3) return [];
    const female = person.sex === 'FEMALE';
    const promptArabic = family === TARAJIM_KUNYA ? `ما كنية ${genitive(nameOf(person))}؟` : `بمَ ${female ? 'لُقّبت' : 'لُقّب'} ${nameOf(person)}؟`;
    return [{
      key: `${family}:${person.slug}:${k}`,
      family,
      promptArabic,
      choices: shuffle([name, ...others.map(other => other.name)], random).map(each => ({ value: each, labelArabic: each })),
      correctAnswer: name,
      note: { label: 'المصدر', text: `«${fact.text}»\n${fact.by.length ? `${sayerLine(fact)} · ` : ''}${pageLabel(fact.refs)}، في ترجمة ${genitive(nameOf(person))}` },
      evidence: { claimKeys: [] },
    }];
  });
}

/**
 * The Prophet's ﷺ names as the hadith al-Dhahabi quotes gives them («وأنا أحمد، وأنا الحاشر…»): his titles whose name stands
 * in the quoted words. Not «نبي» or «رسول», which every prophet is.
 */
export function prophetNames(people: AppPerson[] = PEOPLE) {
  const prophet = people.find(p => p.slug === 'prophet-muhammad');
  return (prophet?.titles ?? []).filter(title => !title.shared && !/^(?:نبي|رسول)$/u.test(title.name)
    // «ونبي التوبة», «وخاتم النبيين»: the joined «و» is the hadith's, not the name's.
    && ` ${bareName(title.text).split(' ').map(word => word.replace(/^[وف](?=\S{2})/u, '')).join(' ')} `.includes(` ${bareName(title.name)} `));
}

/** How many of the four choices are right (owner, 2026-11-19): mostly two or three, some one, now and then all four. */
const RIGHT_COUNTS = [1, 2, 2, 3, 3, 1, 2, 3, 4];

/**
 * «أيّ هذه من أسماء النبي ﷺ؟» (owner, 2026-11-19; sketch titles-quiz/multi-select-dark.png): four choices, one to four of
 * them his names, the others Companions' laqabs (laqabFacts) that share no word with his names, so none is half right.
 * Scored per choice (score.ts pickedPoints). The note quotes each of his names offered with its page.
 */
export function prophetNameQuestions(people: AppPerson[] = PEOPLE, random: Random = Math.random, count = 30): ChoiceQuestion[] {
  const names = prophetNames(people);
  const nameWordsOf = new Set(names.flatMap(title => nameWords(title.name)).filter(word => word !== 'نبي'));
  const others = laqabFacts(people).filter(fact => fact.person.sex === 'MALE' && !nameWords(fact.name).some(word => nameWordsOf.has(word)))
    .map(fact => fact.name).filter((name, i, all) => all.indexOf(name) === i);
  if (names.length < 4 || others.length < 3) return [];
  const questions = new Map<string, ChoiceQuestion>();
  for (let tries = 0; questions.size < count && tries < count * 10; tries += 1) {
    const right = shuffle(names, random).slice(0, RIGHT_COUNTS[Math.floor(random() * RIGHT_COUNTS.length)]);
    const wrong = shuffle(others, random).slice(0, 4 - right.length);
    const choices = shuffle([...right.map(title => title.name), ...wrong], random);
    const correctAnswers = choices.filter(name => right.some(title => title.name === name));
    const key = `${PROPHET_NAMES}:${[...choices].sort().join('|')}`;
    if (questions.has(key)) continue;
    questions.set(key, {
      key,
      family: PROPHET_NAMES,
      promptArabic: 'أيّ هذه من أسماء النبي ﷺ؟ اختر كل ما يصح.',
      choices: choices.map(name => ({ value: name, labelArabic: name })),
      correctAnswer: correctAnswers.join(PICKS),
      correctAnswers,
      note: { label: 'المصدر', text: right.map(title => `«${title.text}» · ${pageLabel(title.refs)}`).join('\n') },
      evidence: { claimKeys: [] },
    });
  }
  return [...questions.values()];
}

const kind = (id: typeof TARAJIM_NASAB | typeof TARAJIM_VIRTUE | typeof TARAJIM_TIE | typeof TARAJIM_KUNYA | typeof TARAJIM_LAQAB | typeof PROPHET_NAMES, name: string, all: (random: Random) => ChoiceQuestion[]): ChoiceKind => ({
  id,
  name,
  party: true,
  questions: (_scope, _difficulty, random, limit = Infinity) => shuffle(all(random), random).slice(0, limit),
  count: () => all(Math.random).length,
});

/** Built once, the first time a question is asked: the people do not change while the app runs. */
const once = <T>(make: () => T) => {
  let value: T | undefined;
  return () => (value ??= make());
};
const nasabAll = once(() => nasabQuestions());

export const tarajimNasab = kind(TARAJIM_NASAB, TARAJIM_NASAB_NAME, random => nasabAll().map(q => ({ ...q, choices: shuffle(q.choices, random) })));
const tieAll = once(() => tieQuestions());
export const tarajimTie = kind(TARAJIM_TIE, TARAJIM_TIE_NAME, random => tieAll().map(q => ({ ...q, choices: shuffle(q.choices, random) })));
export const tarajimVirtue = kind(TARAJIM_VIRTUE, TARAJIM_VIRTUE_NAME, random => virtueQuestions(PEOPLE, random));
export const tarajimKunya = kind(TARAJIM_KUNYA, TARAJIM_KUNYA_NAME, random => nameQuestions(TARAJIM_KUNYA, PEOPLE, random));
export const tarajimLaqab = kind(TARAJIM_LAQAB, TARAJIM_LAQAB_NAME, random => nameQuestions(TARAJIM_LAQAB, PEOPLE, random));
export const prophetNamesQuiz = kind(PROPHET_NAMES, PROPHET_NAMES_NAME, random => prophetNameQuestions(PEOPLE, random));

/**
 * A kunya is the hardest thing to ask of a person (owner, 2026-11-18: include kunyas, but not first), so in a mixed quiz the
 * first Tarajim question is never a kunya one while another Tarajim question is there to go before it: the first of those
 * changes places with it. A quiz of kunyas alone stays as it is.
 */
export function kunyaNotFirst<T extends { family: string }>(questions: T[]): T[] {
  const tarajim = (question: T) => question.family.startsWith('TARAJIM_');
  const first = questions.findIndex(tarajim);
  if (first === -1 || questions[first].family !== TARAJIM_KUNYA) return questions;
  const other = questions.findIndex(question => tarajim(question) && question.family !== TARAJIM_KUNYA);
  if (other === -1) return questions;
  const out = [...questions];
  [out[first], out[other]] = [out[other], out[first]];
  return out;
}
