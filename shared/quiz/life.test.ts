import { describe, expect, it } from 'vitest';
import peopleJson from '../data/tarajim/people.json';
import lifeData from '../data/events/life.json';
import type { AppPerson } from '../tarajim';
import type { AppLife } from '../events/life';
import { personLifeItems } from '../events/lifeTimeline';
import { datedThings, lifeQuestions, yearsName } from './life';

const PEOPLE = peopleJson as AppPerson[];
const LIFE = lifeData as AppLife;
let seed = 7;
const random = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

/** The years a choice names, read back from its words («السنة ٥ أو ٦ للهجرة», «٣ قبل الهجرة»). */
const yearsOf = (label: string) => (label.match(/[٠-٩]+/g) ?? [])
  .map(digits => Number([...digits].map(digit => digit.charCodeAt(0) - 0x660).join('')) * (label.includes('قبل') ? -1 : 1));

describe('«في أي سنة كان؟»', () => {
  const things = datedThings(PEOPLE, LIFE);
  const questions = lifeQuestions(PEOPLE, random);

  it('names a year, every year where the sources differ, and years before the hijra', () => {
    expect(yearsName([5])).toBe('السنة ٥ للهجرة');
    expect(yearsName([6, 5, 5])).toBe('السنة ٥ أو ٦ للهجرة');
    expect(yearsName([-3])).toBe('٣ قبل الهجرة');
    expect(yearsOf(yearsName([12, 14]))).toEqual([12, 14]);
  });

  it('asks each thing once, never a battle (the sira quiz asks those), and never one dated only in words', () => {
    expect(new Set(things.map(thing => thing.key)).size).toBe(things.length);
    expect(things.some(thing => thing.key.startsWith('battle:'))).toBe(false);
    for (const person of PEOPLE) for (const entry of LIFE[person.slug] ?? []) {
      if (entry.year?.others?.length) expect(things.some(thing => thing.key === `${entry.kind}:${entry.slug}`)).toBe(false);
    }
  });

  it('gives both years where the sources give two as one right choice, shaped like the wrong ones, none near it', () => {
    expect(questions.length).toBeGreaterThan(0);
    for (const q of questions) {
      const thing = things.find(each => q.key.endsWith(`:${each.key}`))!;
      expect(q.choices[Number(q.correctAnswer)].labelArabic).toBe(yearsName(thing.years));
      expect(new Set(q.choices.map(choice => choice.labelArabic)).size).toBe(q.choices.length);
      // The form gives nothing away: every choice names as many years as the right one.
      const count = (label: string) => label.split(' أو ').length;
      expect(new Set(q.choices.map(choice => count(choice.labelArabic))).size).toBe(1);
      // No wrong choice is a near miss: each of its years is more than a year from every year given.
      for (const choice of q.choices.filter(choice => choice.value !== q.correctAnswer)) {
        expect(yearsOf(choice.labelArabic).every(year => thing.years.every(given => Math.abs(year - given) > 1))).toBe(true);
      }
      // Every year given is cited: each source of each reading is under the answer.
      expect(q.sources).toEqual(expect.arrayContaining(thing.sources));
    }
  });

  it('looks it up on a timeline that holds it', () => {
    for (const q of questions) {
      const look = q.look as { view: 'life'; slug: string; mark: string };
      const person = PEOPLE.find(each => each.slug === look.slug)!;
      const items = personLifeItems(person, LIFE[person.slug] ?? [], () => undefined);
      expect(items.some(item => item.key === look.mark)).toBe(true);
    }
  });
});
