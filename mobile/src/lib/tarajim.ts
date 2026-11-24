import { inAppOrder, type AppPerson, type PersonFact } from '@shared/tarajim';
import { byVolume, heldGroups as heldIn, kunyaLine, personLine, unvowelled } from '@shared/tarajimGroups';
import { matchesQuery, namesHay } from '@shared/tarajimLine';
import { chainBetween, peopleGraph } from '@shared/tarajimGraph';
import peopleJsonFile from '@shared/data/tarajim/people.json';
import tiePairsJson from '@shared/tarajimTiePairs.json';
import { dataOf } from '@shared/appData';

const peopleJson = dataOf(peopleJsonFile);

export const PROPHET = 'prophet-muhammad';

/**
 * The people the app shows (owner, 2026-11-18): only those whose entry is converted under data/works, read from
 * shared/data/tarajim/people.json (npm run model:app-people). The Prophet ﷺ first, then the book's order.
 */
export const PEOPLE: AppPerson[] = inAppOrder(peopleJson as AppPerson[]);


const bySlug = new Map(PEOPLE.map(person => [person.slug, person]));
export const findPerson = (slug: string) => bySlug.get(slug);

/** Every tie the converted entries state (shared/tarajimGraph.ts), for the ties and «بينه وبين…» screens and the «صلة» card. */
export const GRAPH = peopleGraph(PEOPLE);

/**
 * The «صلة» feed card's pairs as their feed ids «a,b», found at build time (npm run model:app-people writes
 * shared/tarajimTiePairs.json; shared/tarajimGraph.test.ts keeps it equal to linkedPairs).
 */
export const TIE_PAIRS: readonly string[] = tiePairsJson;
const tieSet = new Set(TIE_PAIRS);

/** A «صلة» card's two people and the nearest chain between them, when the id is one of the card's pairs. */
export function tiePair(id: string) {
  if (!tieSet.has(id)) return undefined;
  const [a, b] = id.split(',');
  const steps = chainBetween(GRAPH, a, b);
  return steps ? { a, b, steps } : undefined;
}

/** The name to show: the Prophet with ﷺ (design rule), everyone else as the catalog names them. */
export function personName(person: { slug: string; name: string }) {
  return person.slug === PROPHET && !person.name.includes('ﷺ') ? `${person.name} ﷺ` : person.name;
}

/** Each title the people hold, once, in the order they first come, for the list's filter chips. */
export function titleFilters(people: AppPerson[] = PEOPLE) {
  const seen = new Map<string, string>();
  // Only titles several people hold: «الفاروق» as a filter would list one man.
  for (const person of people) for (const title of person.titles) if (title.shared && !seen.has(title.title)) seen.set(title.title, title.name);
  return [...seen].map(([key, name]) => ({ key, name }));
}

/** People whose name, full name, kunya or laqab holds the words typed, ignoring vowels and hamza forms. */
export function searchPeople(query: string, title?: string, people: AppPerson[] = PEOPLE) {
  return people.filter(person => {
    if (title && !person.titles.some(t => t.title === title)) return false;
    return !query.trim() || matchesQuery(namesHay(person), query);
  });
}

/** Every page a list of values rests on, for a section's reference. */
export const refsOf = (facts: PersonFact[]) => facts.flatMap(fact => fact.refs);

/** The hub's groups that the converted people hold (shared/tarajimGroups.ts). */
export const heldGroups = () => heldIn(PEOPLE);

export { byVolume, kunyaLine, personLine, unvowelled };
