import peopleJsonFile from '../data/tarajim/people.json';
import lifeDataFile from '../data/events/life.json';
import { pageSources, type AppPerson, type PersonFact } from '../tarajim';
import type { AppLife, AppLifeEntry } from '../events/life';
import { num } from '../quran/arabicNumber';
import { genitive } from '../tarajimGraph';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion } from './choiceKinds';
import { citeSource, uniqueSources, type QuizSource } from './sources';
import { dataOf } from '../appData';

const peopleJson = dataOf(peopleJsonFile);
const lifeData = dataOf(lifeDataFile);

export const TARAJIM_LIFE = 'TARAJIM_LIFE';
export const TARAJIM_LIFE_NAME = 'في أي سنة كان؟';
const CHOICES = 4;

const PEOPLE = peopleJson as AppPerson[];
const LIFE = lifeData as AppLife;
const nameOf = (person: AppPerson) => (person.slug === 'prophet-muhammad' && !person.name.includes('ﷺ') ? `${person.name} ﷺ` : person.name);

export type Dated = { key: string; name: string; years: number[]; sources: QuizSource[]; slug: string; mark: string };

export function yearsName(years: number[]): string {
  const sorted = [...new Set(years)].sort((a, b) => a - b);
  if (sorted.every(year => year < 1)) return `${sorted.map(year => num(-year)).join(' أو ')} قبل الهجرة`;
  if (sorted.every(year => year >= 1)) return `السنة ${sorted.map(num).join(' أو ')} للهجرة`;
  return sorted.map(year => yearsName([year])).join(' أو ');
}

const was = (name: string) => (/^\S+ة(\s|$)/u.test(name) ? 'كانت' : 'كان');

export function datedThings(people: AppPerson[] = PEOPLE, life: AppLife = LIFE): Dated[] {
  const things = new Map<string, Dated>();
  for (const person of people) {
    for (const entry of (life[person.slug] ?? []) as AppLifeEntry[]) {
      const key = `${entry.kind}:${entry.slug}`;
      if (entry.kind === 'battle' || !entry.year || entry.year.others?.length || things.has(key)) continue;
      const { name } = entry;
      things.set(key, { key, name, years: [entry.year.value], sources: entry.year.refs.map(citeSource), slug: person.slug, mark: key });
    }
    const deaths = person.died.year.filter((fact): fact is PersonFact & { value: number } => typeof fact.value === 'number');
    if (deaths.length) {
      things.set(`death:${person.slug}`, {
        key: `death:${person.slug}`, name: `وفاة ${genitive(nameOf(person))}`, years: deaths.map(fact => fact.value),
        sources: deaths.flatMap(fact => pageSources(fact.refs, { text: fact.text })), slug: person.slug, mark: 'own:death',
      });
    }
  }
  return [...things.values()];
}

const APART = 3;

export function yearQuestion(thing: Dated, pool: number[], random: Random): ChoiceQuestion | null {
  const given = [...new Set(thing.years)].sort((a, b) => a - b);
  if (given.length > 2) return null;
  const right = yearsName(given);
  const far = (year: number) => given.every(each => Math.abs(year - each) > APART);
  const gap = given.length === 2 ? given[1] - given[0] : 0;
  const years = [...new Set(pool)].filter(year => far(year) && (!gap || far(year + gap)));
  const wrong = years.map(year => yearsName(gap ? [year, year + gap] : [year]));
  if (wrong.length < CHOICES - 1) return null;
  const choices = shuffle([right, ...shuffle(wrong, random).slice(0, CHOICES - 1)], random);
  return {
    key: `${TARAJIM_LIFE}:${thing.key}`,
    family: TARAJIM_LIFE,
    promptArabic: `في أي سنة ${was(thing.name)} ${thing.name}؟`,
    choices: choices.map((label, i) => ({ value: String(i), labelArabic: label })),
    correctAnswer: String(choices.indexOf(right)),
    sources: uniqueSources(thing.sources),
    look: { view: 'life', slug: thing.slug, mark: thing.mark },
    evidence: { claimKeys: [] },
  };
}

export function lifeQuestions(people: AppPerson[] = PEOPLE, random: Random = Math.random): ChoiceQuestion[] {
  const things = datedThings(people);
  const pool = things.flatMap(thing => thing.years);
  return things.map(thing => yearQuestion(thing, pool, random)).filter((q): q is ChoiceQuestion => q !== null);
}

export const tarajimLife: ChoiceKind = {
  id: TARAJIM_LIFE,
  name: TARAJIM_LIFE_NAME,
  party: true,
  questions: (_scope, _difficulty, random, limit = Infinity) => shuffle(lifeQuestions(PEOPLE, random), random).slice(0, limit),
  count: () => lifeQuestions(PEOPLE, Math.random).length,
};
