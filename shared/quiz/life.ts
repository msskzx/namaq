// «أيها كان أولًا في حياته؟» (owner 2026-11-19: every feature gets a quiz kind, drawn with its own view): four things in a
// person's «حياته» (shared/events/lifeTimeline.ts), and which came first. Only things the sources date to one year, with no
// other reading of it, and four different years, so the right choice is plainly first and the others plainly later. The
// look-up is the person's own timeline.
import peopleJson from '../data/tarajim/people.json';
import lifeData from '../data/events/life.json';
import battlesData from '../data/battles/battles.json';
import type { AppPerson } from '../tarajim';
import type { AppLife } from '../events/life';
import type { AppBattle } from '../battles/battle';
import { personLifeItems, type LifeItem } from '../events/lifeTimeline';
import { genitive } from '../tarajimGraph';
import { shuffle, type Random } from './random';
import type { ChoiceKind, ChoiceQuestion } from './choiceKinds';

export const TARAJIM_LIFE = 'TARAJIM_LIFE';
export const TARAJIM_LIFE_NAME = 'أيها كان أولًا في حياته؟';
const CHOICES = 4;

const PEOPLE = peopleJson as AppPerson[];
const LIFE = lifeData as AppLife;
const KINDS = new Map((battlesData as AppBattle[]).map(battle => [battle.slug, battle.kind?.value]));
const nameOf = (person: AppPerson) => (person.slug === 'prophet-muhammad' && !person.name.includes('ﷺ') ? `${person.name} ﷺ` : person.name);

/** What can stand in such a question: a thing of his life, not his own death, dated once with no other reading. */
const askable = (item: LifeItem) => item.kind !== 'own' && item.year !== undefined && item.others.length === 0;

/** The question for one person and four of his things, the earliest right. */
export function lifeQuestion(person: AppPerson, picked: LifeItem[], random: Random): ChoiceQuestion | null {
  if (picked.length !== CHOICES || new Set(picked.map(item => item.year)).size !== CHOICES) return null;
  const first = picked.reduce((a, b) => (b.year! < a.year! ? b : a));
  const choices = shuffle(picked, random);
  return {
    key: `${TARAJIM_LIFE}:${person.slug}:${picked.map(item => item.key).sort().join('+')}`,
    family: TARAJIM_LIFE,
    promptArabic: `أي هذه كان أولًا في حياة ${genitive(nameOf(person))}؟`,
    choices: choices.map((item, i) => ({ value: String(i), labelArabic: item.name })),
    correctAnswer: String(choices.indexOf(first)),
    // Where each year is written, as the other tarajim questions give it: the look-up's rows don't open in a quiz.
    note: { label: 'المصدر', text: [...new Set(picked.flatMap(item => item.yearRefs.map(ref => ref.cite)))].join('؛ ') },
    look: { view: 'life', slug: person.slug, mark: first.key },
    evidence: { claimKeys: [] },
  };
}

/**
 * Each person's questions: his askable things, one per year (the first the book gives that year), taken four at a time
 * in random groups, every thing in some group once there are four years.
 */
export function lifeQuestions(people: AppPerson[] = PEOPLE, random: Random = Math.random): ChoiceQuestion[] {
  return people.flatMap(person => {
    const items = personLifeItems(person, LIFE[person.slug] ?? [], slug => KINDS.get(slug)).filter(askable);
    const byYear = items.filter((item, i) => items.findIndex(other => other.year === item.year) === i);
    if (byYear.length < CHOICES) return [];
    const order = shuffle(byYear, random);
    const groups: LifeItem[][] = [];
    for (let at = 0; at < order.length; at += CHOICES) {
      const group = order.slice(at, at + CHOICES);
      // The last group is filled from the others, so no thing is left out and every group has four years.
      while (group.length < CHOICES) group.push(order.find(item => !group.includes(item))!);
      groups.push(group);
    }
    return groups.map(group => lifeQuestion(person, group, random)).filter((q): q is ChoiceQuestion => q !== null);
  });
}

export const tarajimLife: ChoiceKind = {
  id: TARAJIM_LIFE,
  name: TARAJIM_LIFE_NAME,
  party: true,
  questions: (_scope, _difficulty, random, limit = Infinity) => shuffle(lifeQuestions(PEOPLE, random), random).slice(0, limit),
  count: () => lifeQuestions(PEOPLE, Math.random).length,
};
