// The tarajim's question kinds (owner, 2026-11-18; sketch tarajim-app/sketch-dark.png, screens 5 and 8), from the people
// whose Siyar entry is converted (shared/data/tarajim/people.json) and nothing else: where two nasabs meet, and whose
// virtue this is. Every value is the book's, and after answering the note says where it is, so the tree or the person's
// page is the way to check it.
import peopleJson from '../data/tarajim/people.json';
import virtueSkip from '../data/tarajim/virtueQuizSkip.json';
import { pageLabel, sayer, type AppPerson } from '../tarajim';
import { bareName, chainOf, lineOf, meetingOf, type LineName } from '../tarajimLine';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion } from './choiceKinds';

export const TARAJIM_NASAB = 'TARAJIM_NASAB';
export const TARAJIM_VIRTUE = 'TARAJIM_VIRTUE';
export const TARAJIM_NASAB_NAME = 'أين يلتقي النسبان؟';
export const TARAJIM_VIRTUE_NAME = 'صاحب المنقبة';

const PEOPLE = peopleJson as AppPerson[];
const plain = (text: string) => text.replace(/[ً-ْٰـ]/g, '');
/** Not asked: virtues another person in the app could rightly own too (shared/data/tarajim/virtueQuizSkip.json). */
const SKIP: Record<string, string> = virtueSkip.skip;
/** A name after «نسب»: genitive, so «أبو جندل» reads «أبي جندل» and «ذو» reads «ذي». */
const genitive = (name: string) => name.replace(/^أبو /u, 'أبي ').replace(/^ذو /u, 'ذي ');
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
  return [own, ...fathers.flatMap(father => [`ابن ${father}`, `بن ${father}`, `بنت ${father}`]),
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
      questions.push({
        key: `${TARAJIM_VIRTUE}:${person.slug}:${k}`,
        family: TARAJIM_VIRTUE,
        promptArabic: `«${virtue.text}»${virtue.by.length ? ` — ${sayer(virtue)}` : ''}\nفيمن قيل هذا؟`,
        choices: shuffle([person, ...others], random).map(p => ({ value: p.slug, labelArabic: nameOf(p) })),
        correctAnswer: person.slug,
        note: { label: 'المصدر', text: `${pageLabel(virtue.refs)}، في ترجمة ${genitive(nameOf(person))}` },
        evidence: { claimKeys: [] },
      });
    });
  }
  return questions;
}

const kind = (id: typeof TARAJIM_NASAB | typeof TARAJIM_VIRTUE, name: string, all: (random: Random) => ChoiceQuestion[]): ChoiceKind => ({
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
export const tarajimVirtue = kind(TARAJIM_VIRTUE, TARAJIM_VIRTUE_NAME, random => virtueQuestions(PEOPLE, random));
