import { inAppOrder, type AppPerson, type PersonFact } from '@shared/tarajim';
import { byVolume, heldGroups as heldIn, kunyaLine, personLine, unvowelled } from '@shared/tarajimGroups';
import { matchesQuery, namesHay } from '@shared/tarajimLine';
import { chainBetween, peopleGraph } from '@shared/tarajimGraph';
import peopleJsonFile from '@shared/data/tarajim/people.json';
import tiePairsJson from '@shared/tarajimTiePairs.json';
import { dataOf } from '@shared/appData';

const peopleJson = dataOf(peopleJsonFile);

export const PROPHET = 'prophet-muhammad';

export const PEOPLE: AppPerson[] = inAppOrder(peopleJson as AppPerson[]);


const bySlug = new Map(PEOPLE.map(person => [person.slug, person]));
export const findPerson = (slug: string) => bySlug.get(slug);

export const GRAPH = peopleGraph(PEOPLE);

export const TIE_PAIRS: readonly string[] = tiePairsJson;
const tieSet = new Set(TIE_PAIRS);

export function tiePair(id: string) {
  if (!tieSet.has(id)) return undefined;
  const [a, b] = id.split(',');
  const steps = chainBetween(GRAPH, a, b);
  return steps ? { a, b, steps } : undefined;
}

export function personName(person: { slug: string; name: string }) {
  return person.slug === PROPHET && !person.name.includes('ﷺ') ? `${person.name} ﷺ` : person.name;
}

export function titleFilters(people: AppPerson[] = PEOPLE) {
  const seen = new Map<string, string>();
  for (const person of people) for (const title of person.titles) if (title.shared && !seen.has(title.title)) seen.set(title.title, title.name);
  return [...seen].map(([key, name]) => ({ key, name }));
}

export function searchPeople(query: string, title?: string, people: AppPerson[] = PEOPLE) {
  return people.filter(person => {
    if (title && !person.titles.some(t => t.title === title)) return false;
    return !query.trim() || matchesQuery(namesHay(person), query);
  });
}

export const refsOf = (facts: PersonFact[]) => facts.flatMap(fact => fact.refs);

export const heldGroups = () => heldIn(PEOPLE);

export { byVolume, kunyaLine, personLine, unvowelled };
