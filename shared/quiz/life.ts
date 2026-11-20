// «في أي سنة كان؟» (owner 2026-11-19: every feature gets a quiz kind, drawn with its own view; "a simpler version is when
// was this"): the year of a thing in someone's «حياته» (shared/events/lifeTimeline.ts) or of a person's death. The battles'
// years are asked by «السيرة والغزوات» (shared/quiz/sira.ts), so they are left to it. Where the sources give two years,
// the right choice holds both, and no wrong year sits near either (owner 2026-11-18: «٤ أو ٥» with references; wrong
// choices clearly wrong). The look-up is the person's own timeline.
import peopleJson from '../data/tarajim/people.json';
import lifeData from '../data/events/life.json';
import { pageSources, type AppPerson, type PersonFact } from '../tarajim';
import type { AppLife, AppLifeEntry } from '../events/life';
import { num } from '../quran/arabicNumber';
import { genitive } from '../tarajimGraph';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion } from './choiceKinds';
import { citeSource, uniqueSources, type QuizSource } from './sources';

export const TARAJIM_LIFE = 'TARAJIM_LIFE';
export const TARAJIM_LIFE_NAME = 'في أي سنة كان؟';
const CHOICES = 4;

const PEOPLE = peopleJson as AppPerson[];
const LIFE = lifeData as AppLife;
const nameOf = (person: AppPerson) => (person.slug === 'prophet-muhammad' && !person.name.includes('ﷺ') ? `${person.name} ﷺ` : person.name);

/** A thing to ask the year of: its name, every year the sources give, where they say it, and whose timeline shows it. */
export type Dated = { key: string; name: string; years: number[]; sources: QuizSource[]; slug: string; mark: string };

/** «السنة ٥ للهجرة», «السنة ٥ أو ٦ للهجرة», «٣ قبل الهجرة». */
export function yearsName(years: number[]): string {
  const sorted = [...new Set(years)].sort((a, b) => a - b);
  if (sorted.every(year => year < 1)) return `${sorted.map(year => num(-year)).join(' أو ')} قبل الهجرة`;
  if (sorted.every(year => year >= 1)) return `السنة ${sorted.map(num).join(' أو ')} للهجرة`;
  return sorted.map(year => yearsName([year])).join(' أو ');
}

/** «كانت وفاة…» but «كان تحويل القبلة»: the verb follows the name's first word. */
const was = (name: string) => (/^\S+ة(\s|$)/u.test(name) ? 'كانت' : 'كان');

/**
 * What can be asked: each event and story of the catalog once (not the battles), when its year is a number and has no
 * other reading in words only, and each converted person's death where his entry gives its year as a number.
 */
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

/** How far a wrong year stays from every year the sources give, so that no wrong choice is a near miss. */
const APART = 3;

/**
 * The question for one thing. Its wrong choices take the right one's shape, so its form gives nothing away: one year
 * where the sources give one, two years the same distance apart where they give two. Every wrong year is one of the
 * other things' years and more than APART years from any year given. A thing given three years or more is not asked.
 */
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
