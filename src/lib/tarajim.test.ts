import { describe, expect, it } from 'vitest';
import { matchesQuery } from '@shared/tarajimLine';
import { betweenView, PEOPLE, pickedSlugs, pickPeople, tarajimCards } from './tarajim';

describe('tarajimCards', () => {
  it('takes a virtue, a «صلة» chain and a «حياته» timeline in turn, the same all day', () => {
    const cards = tarajimCards(20000, [0, 1, 2, 3]);
    expect(cards.map(card => card.kind)).toEqual(['tarajim', 'tie', 'life', 'tarajim']);
    const life = cards[2];
    if (life.kind !== 'life') throw new Error('life');
    expect(new Set(life.items.map(item => item.year)).size).toBeGreaterThan(1);
    const tie = cards[1];
    if (tie.kind !== 'tie') throw new Error('tie');
    expect(tie.chain.steps.length).toBeGreaterThan(1);
    expect(tie.chain.steps.every(step => tie.chain.nodes.some(node => node.slug === step.from) && step.clause.length > 0)).toBe(true);
    expect(tie.sentence.endsWith('.')).toBe(true);
    expect(tarajimCards(20000, [0, 1])).toEqual(cards.slice(0, 2));
  });
});

describe('betweenView', () => {
  it('joins every picked person to the first through the ties it draws and cites', () => {
    const view = betweenView(['az-zubayr-ibn-al-awwam', 'hamzah-ibn-abd-al-muttalib', 'al-abbas-ibn-abd-al-muttalib']);
    const reached = new Set([view.chain.first]);
    for (let grew = true; grew;) {
      grew = false;
      for (const step of view.chain.steps) {
        for (const [a, b] of [[step.from, step.to], [step.to, step.from]]) if (reached.has(a) && !reached.has(b)) { reached.add(b); grew = true; }
      }
    }
    const joined = view.people.filter(p => !view.apart.some(a => a.slug === p.slug));
    expect(joined.length).toBeGreaterThan(1);
    expect(joined.every(p => reached.has(p.slug))).toBe(true);
    expect(view.sentence.endsWith('.')).toBe(true);
    expect(view.credit?.quotes?.length).toBeGreaterThan(0);
  });

  it('keeps out a slug in the address that names no converted person, rather than failing', () => {
    expect(betweenView(pickedSlugs('az-zubayr-ibn-al-awwam,nobody')).people.map(p => p.slug)).toEqual(['az-zubayr-ibn-al-awwam']);
  });
});

describe('pickPeople', () => {
  // The website's pickers matched the name alone, and a final «ى» inside a phrase («أبو يحيى») never matched.
  it('lets a picker find someone by a kunya typed without vowels or hamza', () => {
    const withKunya = PEOPLE.filter(person => person.kunya.length > 0);
    expect(withKunya.length).toBeGreaterThan(0);
    const offered = pickPeople();
    for (const person of withKunya) {
      const typed = person.kunya[0].text.replace(/[ً-ْٰ]/g, '').replace(/[أإ]/g, 'ا');
      expect(offered.some(p => p.slug === person.slug && matchesQuery(p.hay, typed)), typed).toBe(true);
    }
  });
});
