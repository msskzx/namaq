import { describe, expect, it } from 'vitest';
import { tarajimCards } from './tarajim';

describe('tarajimCards', () => {
  it('gives a virtue on even slots and a «صلة» chain on odd ones, the same all day', () => {
    const cards = tarajimCards(20000, [0, 1, 2, 3]);
    expect(cards.map(card => card.kind)).toEqual(['tarajim', 'tie', 'tarajim', 'tie']);
    const tie = cards[1];
    if (tie.kind !== 'tie') throw new Error('tie');
    expect(tie.chain.steps.length).toBeGreaterThan(1);
    expect(tie.chain.steps.every(step => tie.chain.nodes.some(node => node.slug === step.from) && step.clause.length > 0)).toBe(true);
    expect(tie.sentence.endsWith('.')).toBe(true);
    expect(tarajimCards(20000, [0, 1])).toEqual(cards.slice(0, 2));
  });
});
