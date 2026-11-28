import namesSkip from './data/tarajim/namesQuizSkip.json';
import { bareName } from './tarajimLine';
import { kunyaName, type AppPerson, type PersonFact } from './tarajim';

export type NameFact = { person: AppPerson; name: string; fact: PersonFact };

const PROPHET = 'prophet-muhammad';
const SKIP: Record<string, string> = namesSkip.skip;
const inName = (person: AppPerson, name: string) => ` ${bareName(person.name)} `.includes(` ${bareName(name)} `);
const settled = (fact: PersonFact) => !fact.anonymous && !fact.disputed && !(fact.id && SKIP[fact.id]);

export function kunyaFacts(people: readonly AppPerson[]): NameFact[] {
  return people.flatMap(person => {
    if (person.slug === PROPHET || person.kunya.length !== 1 || !settled(person.kunya[0])) return [];
    const name = kunyaName(person.kunya[0].text);
    const shown = new Set(bareName(person.name).split(' '));
    const after = bareName(name).split(' ').slice(1);
    const unclear = shown.size === 1 && people.some(other => other !== person && bareName(other.name).split(' ')[0] === bareName(person.name));
    return inName(person, name) || /^(?:أبو|أم|ابن) /u.test(person.name) || after.some(word => shown.has(word)) || unclear ? [] : [{ person, name, fact: person.kunya[0] }];
  });
}

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
