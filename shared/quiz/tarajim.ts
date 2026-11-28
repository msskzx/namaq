import peopleJsonFile from '../data/tarajim/people.json';
import virtueSkip from '../data/tarajim/virtueQuizSkip.json';
import { pageSources, saidBy, type AppPerson } from '../tarajim';
import { uniqueSources } from './sources';
import { kunyaFacts, laqabFacts, type NameFact } from '../tarajimNames';
import { bareName, chainOf, lineOf, meetingOf, type LineName } from '../tarajimLine';
import { genitive, peopleGraph, TIE_KINDS, tieWord, type TieKind } from '../tarajimGraph';
import { shuffle, type Random } from './random';
import { PICKS, type ChoiceKind, type ChoiceQuestion } from './choiceKinds';
import { dataOf } from '../appData';

const peopleJson = dataOf(peopleJsonFile);

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
const SKIP: Record<string, string> = virtueSkip.skip;
const nameOf = (person: AppPerson) => (person.slug === 'prophet-muhammad' && !person.name.includes('ﷺ') ? `${person.name} ﷺ` : person.name);

const lineCache = new WeakMap<AppPerson[], Map<string, LineName[]>>();
function linesOf(people: AppPerson[]) {
  let lines = lineCache.get(people);
  if (!lines) lineCache.set(people, (lines = new Map(people.map(person => [person.slug, lineOf(person, people)]))));
  return lines;
}

const words = (text: string) => text.split(/\s+/).length;
const hasName = (text: string, name: string) => ` ${bareName(text)} `.includes(` ${bareName(name)} `);

export function nasabQuestions(people: AppPerson[] = PEOPLE): ChoiceQuestion[] {
  let made = nasabMade.get(people);
  if (!made) nasabMade.set(people, made = nasabPairs(people));
  return [...made];
}
const nasabMade = new WeakMap<readonly AppPerson[], ChoiceQuestion[]>();

function nasabPairs(people: AppPerson[]): ChoiceQuestion[] {
  const lines = linesOf(people);
  const questions: ChoiceQuestion[] = [];
  for (let i = 0; i < people.length; i += 1) for (let j = i + 1; j < people.length; j += 1) {
    const [a, b] = [people[i], people[j]];
    const [la, lb] = [lines.get(a.slug)!, lines.get(b.slug)!];
    const at = meetingOf(la, lb);
    if (!at) continue;
    const answer = plain(la[at.a].name);
    if (words(answer) > 2 || hasName(nameOf(a), answer) || hasName(nameOf(b), answer)) continue;
    const shared = new Set([...la.slice(at.a), ...lb.slice(at.b)].map(n => n.bare));
    const sideA = la.slice(1, at.a).map(n => plain(n.name));
    const sideB = lb.slice(1, at.b).map(n => plain(n.name));
    const turns = Array.from({ length: Math.max(sideA.length, sideB.length) }, (_, k) => [sideB[sideB.length - 1 - k], sideA[sideA.length - 1 - k]]).flat();
    const below = turns.filter((name): name is string => !!name && words(name) <= 2 && !shared.has(bareName(name)))
      .filter((name, k, all) => all.findIndex(other => bareName(other) === bareName(name)) === k);
    if (below.length < 3) continue;
    questions.push({
      key: `${TARAJIM_NASAB}:${a.slug}:${b.slug}`,
      family: TARAJIM_NASAB,
      promptArabic: `أين يلتقي نسب ${genitive(nameOf(a))} ونسب ${genitive(nameOf(b))}؟`,
      choices: [answer, ...below.slice(0, 3)].map(name => ({ value: name, labelArabic: name })),
      correctAnswer: answer,
      note: { label: 'النسبان', text: `${chainOf(a, la, at.a)}\n${chainOf(b, lb, at.b)}` },
      sources: uniqueSources([a, b].flatMap(p => (p.fullName ? pageSources(p.fullName.refs, { text: p.fullName.text }) : []))),
      look: { view: 'nasab', slugs: [a.slug, b.slug], mark: true },
      evidence: { claimKeys: [] },
    });
  }
  return questions;
}

function mentions(quote: string, name: string) {
  let named = namedBy.get(name);
  if (!named) {
    const escaped = bareName(name).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    namedBy.set(name, named = new RegExp(`(?:^|[\\s«(])[وفبلك]?${escaped}ا?(?=$|[\\s،.:؛»)!؟])`, 'u'));
  }
  return named.test(bareName(quote));
}
const namedBy = new Map<string, RegExp>();

function namesOf(person: AppPerson, line: LineName[]) {
  const first = plain(person.name).split(/\s+/);
  const own = first[0] === 'عبد' ? first.slice(0, 2).join(' ') : first[0];
  const fatherWords = line[1] ? plain(line[1].name).split(/\s+/) : [];
  const fathers = [fatherWords.join(' '), ...fatherWords.slice(1).map((_, k) => fatherWords.slice(k, k + 2).join(' '))].filter(Boolean);
  const forms = (text: string) => {
    const bare = bareName(text);
    const kunya = bare.match(/^(?:ابو|ابا|ابي|ام) (.+)$/u);
    return kunya ? ['ابو', 'ابا', 'ابي', 'ام'].map(k => `${k} ${kunya[1]}`) : [bare];
  };
  const bareOwn = /^ال\S{3,}$/u.test(own) ? [own.slice(2)] : [];
  return [own, ...bareOwn, ...fathers.flatMap(father => [`ابن ${father}`, `بن ${father}`, `بنت ${father}`]),
    ...[...person.kunya, ...person.laqab].flatMap(k => forms(k.text))].map(bareName);
}

export function virtueQuestions(people: AppPerson[] = PEOPLE, random: Random = Math.random): ChoiceQuestion[] {
  const questions: ChoiceQuestion[] = [];
  const lines = linesOf(people);
  const fatherKey = (p: AppPerson) => p.parents.find(parent => parent.sex === 'MALE')?.slug ?? lines.get(p.slug)!.slice(1, 3).map(n => n.bare).join('/');
  for (const person of people) {
    const names = namesOf(person, lines.get(person.slug)!);
    person.virtues.forEach((virtue, k) => {
      if (virtue.sahih) return;
      const quote = virtue.text;
      if (names.some(name => mentions(quote, name) || virtue.by.some(by => mentions(by, name)))) return;
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
        promptArabic: `${virtue.by.length ? `${saidBy(virtue)} ` : ''}«${virtue.text}»\nفيمن قيل هذا؟`,
        choices,
        correctAnswer: person.slug,
        sources: pageSources(virtue.refs, { text: virtue.text, by: saidBy(virtue) }),
        look: { view: 'virtues', slugs: choices.map(choice => choice.value), mark: { slug: person.slug, index: k } },
        evidence: { claimKeys: [] },
      });
    });
  }
  return questions;
}

const nameWords = (name: string) => bareName(name.replace(/ﷺ/g, '')).split(' ').filter(Boolean).map(word => (/^اب[يا]$/u.test(word) ? 'ابو' : word));
const COMPOUND_WORD = /^(?:عبد|ابو|ام|ذو|ذي)$/u;
const headName = (words: string[]) => (COMPOUND_WORD.test(words[0] ?? '') ? words.slice(0, 2) : words.slice(0, 1)).join(' ');
function shownName(name: string) {
  const words = nameWords(name);
  const at = words.findIndex(word => word === 'بن' || word === 'بنت');
  return { own: headName(words), father: at > 0 ? headName(words.slice(at + 1)) : '', kunya: /^(?:ابو|ام) /u.test(headName(words)) ? headName(words).split(' ')[1] : '' };
}

export function tieTold(a: string, b: string): TieKind | undefined {
  const [x, y] = [shownName(a), shownName(b)];
  if (x.father && x.father === y.own) return 'child';
  if (y.father && y.father === x.own) return 'parent';
  if (x.kunya && x.kunya === y.own) return 'parent';
  if (y.kunya && y.kunya === x.own) return 'child';
  if (x.father && x.father === y.father) return 'sibling';
  if (x.kunya && x.kunya === y.kunya && x.own !== y.own) return 'spouse';
  if (x.kunya && y.father === `ابو ${x.kunya}`) return 'parent';
  if (y.kunya && x.father === `ابو ${y.kunya}`) return 'child';
  return undefined;
}

export function tieQuestions(people: AppPerson[] = PEOPLE): ChoiceQuestion[] {
  const graph = peopleGraph(people);
  const bySlug = new Map(people.map(p => [p.slug, p]));
  const questions: ChoiceQuestion[] = [];
  const family: TieKind[] = ['parent', 'spouse', 'child', 'sibling'];
  for (const first of people) {
    for (const to of [...new Set((graph.ties.get(first.slug) ?? []).map(t => t.to))]) {
      const other = bySlug.get(to);
      if (!other || other.slug < first.slug) continue;
      const nearest = (from: AppPerson, of: string) => TIE_KINDS.find(kind => (graph.ties.get(from.slug) ?? []).some(t => t.to === of && t.kind === kind));
      const [a, b] = nearest(first, other.slug) === 'accompanied' ? [first, other] : [other, first];
      const ties = (graph.ties.get(b.slug) ?? []).filter(t => t.to === a.slug);
      if (ties.length === 0 || ties.some(t => t.link.disputed || t.link.anonymous)) continue;
      const kinds = new Set(ties.map(t => t.kind));
      const answer = TIE_KINDS.find(kind => kinds.has(kind))!;
      if (answer === 'accompanied') continue;
      if (tieTold(nameOf(a), nameOf(b)) === answer) continue;
      if (answer === 'companion' && (a.slug === 'prophet-muhammad' || b.slug === 'prophet-muhammad')) continue;
      const word = (kind: TieKind) => tieWord(kind, a.sex, b.sex);
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
        sources: pageSources(link.refs, { text: link.text, by: saidBy(link) }),
        look: { view: 'ties', slug: b.slug, mark: a.slug },
        evidence: { claimKeys: [] },
      });
    }
  }
  return questions;
}

function bearers(facts: readonly NameFact[]) {
  const by = new Map<string, NameFact[]>();
  for (const fact of facts) by.set(bareName(fact.name), [...(by.get(bareName(fact.name)) ?? []), fact]);
  return (name: string) => {
    const all = (by.get(bareName(name)) ?? []).filter((fact, i, list) => list.findIndex(other => other.person.slug === fact.person.slug) === i);
    return { names: all.map(fact => nameOf(fact.person)).join('، '), sources: all.flatMap(({ fact }) => pageSources(fact.refs, { text: fact.text, by: saidBy(fact) })) };
  };
}

export function nameQuestions(family: typeof TARAJIM_KUNYA | typeof TARAJIM_LAQAB, people: AppPerson[] = PEOPLE, random: Random = Math.random): ChoiceQuestion[] {
  const facts: NameFact[] = family === TARAJIM_KUNYA ? kunyaFacts(people) : laqabFacts(people);
  const bearer = bearers(facts);
  const ownNames = new Map<string, Set<string>>();
  for (const { person, name } of facts) ownNames.set(person.slug, (ownNames.get(person.slug) ?? new Set()).add(bareName(name)));
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
    const wrong = others.map(other => ({ name: other.name, ...bearer(other.name) }));
    return [{
      key: `${family}:${person.slug}:${k}`,
      family,
      promptArabic,
      choices: shuffle([name, ...others.map(other => other.name)], random).map(each => ({ value: each, labelArabic: each })),
      correctAnswer: name,
      whereOf: Object.fromEntries([[name, nameOf(person)], ...wrong.map(each => [each.name, each.names])]),
      sources: uniqueSources([...pageSources(fact.refs, { text: fact.text, by: saidBy(fact) }), ...wrong.flatMap(each => each.sources)]),
      evidence: { claimKeys: [] },
    }];
  });
}

export function prophetNames(people: AppPerson[] = PEOPLE) {
  const prophet = people.find(p => p.slug === 'prophet-muhammad');
  return (prophet?.titles ?? []).filter(title => !title.shared && !/^(?:نبي|رسول)$/u.test(title.name)
    && ` ${bareName(title.text).split(' ').map(word => word.replace(/^[وف](?=\S{2})/u, '')).join(' ')} `.includes(` ${bareName(title.name)} `));
}

const RIGHT_COUNTS = [1, 2, 2, 3, 3, 1, 2, 3, 4];

export function prophetNameQuestions(people: AppPerson[] = PEOPLE, random: Random = Math.random, count = 30): ChoiceQuestion[] {
  const names = prophetNames(people);
  const his = nameOf(people.find(p => p.slug === 'prophet-muhammad')!);
  const nameWordsOf = new Set(names.flatMap(title => nameWords(title.name)).filter(word => word !== 'نبي'));
  const laqabs = laqabFacts(people);
  const bearer = bearers(laqabs);
  const others = laqabs.filter(fact => fact.person.sex === 'MALE' && !nameWords(fact.name).some(word => nameWordsOf.has(word)))
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
      whereOf: Object.fromEntries([...right.map(title => [title.name, his]), ...wrong.map(name => [name, bearer(name).names])]),
      sources: uniqueSources([...right.flatMap(title => pageSources(title.refs, { text: title.text })), ...wrong.flatMap(name => bearer(name).sources)]),
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
