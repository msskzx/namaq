import { describe, expect, it } from 'vitest';
import peopleJson from '../data/tarajim/people.json';
import lifeData from '../data/events/life.json';
import type { AppPerson } from '../tarajim';
import type { AppLife } from '../events/life';
import { personLifeItems } from '../events/lifeTimeline';
import { lifeQuestions } from './life';

const PEOPLE = peopleJson as AppPerson[];
const life = (person: AppPerson) => personLifeItems(person, (lifeData as AppLife)[person.slug] ?? [], () => undefined);
let seed = 7;
const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

describe('«أيها كان أولًا في حياته؟»', () => {
  const questions = lifeQuestions(PEOPLE, random);

  it('offers four things of four different years, none disputed, the right one plainly first', () => {
    expect(questions.length).toBeGreaterThan(0);
    for (const q of questions) {
      const slug = q.key.split(':')[1];
      const items = life(PEOPLE.find(p => p.slug === slug)!);
      const picked = q.choices.map(choice => items.find(item => item.name === choice.labelArabic)!);
      expect(picked.every(item => item && item.kind !== 'own' && item.others.length === 0 && item.year !== undefined)).toBe(true);
      expect(new Set(picked.map(item => item.year)).size).toBe(picked.length);
      const right = picked[Number(q.correctAnswer)];
      expect(picked.every(item => item === right || item.year! > right.year!)).toBe(true);
      // The look-up opens his timeline with the answer marked, and the note names where the years are written.
      expect(q.look).toEqual({ view: 'life', slug, mark: right.key });
      for (const item of picked) for (const ref of item.yearRefs) expect(q.note?.text).toContain(ref.cite);
    }
  });

  it('leaves none of a person\'s datable years out of his questions', () => {
    for (const person of PEOPLE) {
      const years = new Set(life(person).filter(item => item.kind !== 'own' && item.year !== undefined && item.others.length === 0).map(item => item.year));
      const asked = questions.filter(q => q.key.split(':')[1] === person.slug);
      if (years.size < 4) { expect(asked).toEqual([]); continue; }
      const items = life(person);
      const covered = new Set(asked.flatMap(q => q.choices.map(choice => items.find(item => item.name === choice.labelArabic)!.year)));
      expect(covered).toEqual(years);
    }
  });
});
