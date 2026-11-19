// A person's kunya and laqab as the book gives them (owner, 2026-11-19; sketch titles-quiz/sketch-dark.png): the lists the
// «ما كنيته؟» and «بمَ لُقّب؟» questions and the «الكنى» and «الألقاب» feed cards are built from, each its own interest so a
// reader who does not want kunyas turns them off alone (owner, 2026-11-19).
import namesSkip from './data/tarajim/namesQuizSkip.json';
import { bareName } from './tarajimLine';
import { kunyaName, type AppPerson, type PersonFact } from './tarajim';

/** One kunya or laqab: the person, the name as one says it (nominative, no vowels), and the book's fact. */
export type NameFact = { person: AppPerson; name: string; fact: PersonFact };

const PROPHET = 'prophet-muhammad';
const SKIP: Record<string, string> = namesSkip.skip;
/** A name the shown name already holds: «سفينة» for سفينة, «الصديق» for أبو بكر الصديق, «أبو ذر» for أبو ذر الغفاري. */
const inName = (person: AppPerson, name: string) => ` ${bareName(person.name)} `.includes(` ${bareName(name)} `);
/** Settled: not «قيل» with no sayer, not contested, not on the skip list with its source. */
const settled = (fact: PersonFact) => !fact.anonymous && !fact.disputed && !(fact.id && SKIP[fact.id]);

/**
 * Each person's one kunya. Not the Prophet's ﷺ (his names are asked on their own); not someone with two or more (one choice
 * holding «أبو عمارة وأبو يعلى» stands out); not someone known by it («أبو ذر», «أم سلمة»), nor one after a name his own
 * name already shows («أبو محصن» for عكاشة بن محصن, «أبو أمية» for عمرو بن أمية).
 */
export function kunyaFacts(people: readonly AppPerson[]): NameFact[] {
  return people.flatMap(person => {
    if (person.slug === PROPHET || person.kunya.length !== 1 || !settled(person.kunya[0])) return [];
    const name = kunyaName(person.kunya[0].text);
    const shown = new Set(bareName(person.name).split(' '));
    const after = bareName(name).split(' ').slice(1);
    // A name of one word another person's name starts with too («جندب», «جندب الأزدي») does not say whom it asks.
    const unclear = shown.size === 1 && people.some(other => other !== person && bareName(other.name).split(' ')[0] === bareName(person.name));
    return inName(person, name) || /^(?:أبو|أم|ابن) /u.test(person.name) || after.some(word => shown.has(word)) || unclear ? [] : [{ person, name, fact: person.kunya[0] }];
  });
}

/**
 * Each person's laqabs and the titles that are his or hers alone («الفاروق», not «العشرة المبشرون بالجنة»), as the book
 * words them. Not the Prophet's ﷺ, not a sentence the entry says it in («أنها لم يتزوج…»), not one the shown name holds.
 */
export function laqabFacts(people: readonly AppPerson[]): NameFact[] {
  return people.flatMap(person => {
    if (person.slug === PROPHET) return [];
    const facts = [...person.laqab, ...person.titles.filter(title => !title.shared)];
    const seen = new Set<string>();
    return facts.flatMap(fact => {
      const name = kunyaName(fact.text);
      if (!settled(fact) || /^أن/u.test(name) || name.split(' ').length > 4 || inName(person, name) || seen.has(bareName(name))) return [];
      seen.add(bareName(name));
      return [{ person, name, fact }];
    });
  });
}
