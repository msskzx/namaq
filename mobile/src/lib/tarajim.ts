import type { AppPerson, PersonFact } from '@shared/tarajim';
import { bareName } from '@shared/tarajimLine';
import peopleJson from '@shared/data/tarajim/people.json';

export const PROPHET = 'prophet-muhammad';

/**
 * The people the app shows (owner, 2026-11-18): only those whose entry is converted under data/works, read from
 * shared/data/tarajim/people.json (npm run model:app-people). The Prophet ﷺ first, then the book's order.
 */
export const PEOPLE: AppPerson[] = (peopleJson as AppPerson[]).slice().sort((a, b) =>
  Number(b.slug === PROPHET) - Number(a.slug === PROPHET) || a.entry.volume - b.entry.volume || Number(a.entry.from) - Number(b.entry.from));


const bySlug = new Map(PEOPLE.map(person => [person.slug, person]));
export const findPerson = (slug: string) => bySlug.get(slug);

/** The name to show: the Prophet with ﷺ (design rule), everyone else as the catalog names them. */
export function personName(person: { slug: string; name: string }) {
  return person.slug === PROPHET && !person.name.includes('ﷺ') ? `${person.name} ﷺ` : person.name;
}

/** Text without its vowels, for short lines under a name (the book's vowels stay in quotes). */
export const unvowelled = (text: string) => text.replace(/[\u064B-\u0652\u0670\u0640]/g, '');

/** The line under a name: the kunya, then the laqab when it is a name alone (not a sentence that gives it). */
export function personLine(person: AppPerson) {
  return [person.kunya[0]?.text, person.titles[0]?.name].filter(Boolean).map(text => unvowelled(text!)).join(' · ');
}

/** Each title the people hold, once, in the order they first come, for the list's filter chips. */
export function titleFilters(people: AppPerson[] = PEOPLE) {
  const seen = new Map<string, string>();
  for (const person of people) for (const title of person.titles) if (!seen.has(title.title)) seen.set(title.title, title.name);
  return [...seen].map(([key, name]) => ({ key, name }));
}

/** People whose name, full name, kunya or laqab holds the words typed, ignoring vowels and hamza forms. */
export function searchPeople(query: string, title?: string, people: AppPerson[] = PEOPLE) {
  const words = bareName(query).split(/\s+/u).filter(Boolean);
  return people.filter(person => {
    if (title && !person.titles.some(t => t.title === title)) return false;
    if (words.length === 0) return true;
    const hay = bareName([person.name, person.fullName?.text, ...person.kunya.map(k => k.text), ...person.laqab.map(l => l.text)].filter(Boolean).join(' '));
    return words.every(word => hay.includes(word));
  });
}

/** Every page a list of values rests on, for a section's reference. */
export const refsOf = (facts: PersonFact[]) => facts.flatMap(fact => fact.refs);
