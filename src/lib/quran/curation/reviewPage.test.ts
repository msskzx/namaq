import { describe, expect, it } from 'vitest';
import { reviewedAs, reviewedVerdicts } from './reviewPage';

const drafted = {
  'a|b': { keep: true, why: 'Same idea.', ask: 'Keep?' },
  'c|d': { keep: false, why: 'Only a formula.' },
  'e|f': { keep: true, why: 'Kept.', alone: true },
};
const keys = Object.keys(drafted);

describe('reviewing a whole page', () => {
  it('agrees by checking every pair as drafted and clearing questions', () => {
    expect(reviewedVerdicts(drafted, keys, 'agree')).toEqual({
      'a|b': { keep: true, why: 'Same idea.', checked: true },
      'c|d': { keep: false, why: 'Only a formula.', checked: true },
      'e|f': { keep: true, why: 'Kept.', alone: true, checked: true },
    });
  });

  it('drops every pair, marking only the ones that were kept', () => {
    expect(reviewedVerdicts(drafted, keys, 'drop')).toEqual({
      'a|b': { keep: false, why: 'Same idea. (owner removed)', checked: true },
      'c|d': { keep: false, why: 'Only a formula.', checked: true },
      'e|f': { keep: false, why: 'Kept. (owner removed)', checked: true, alone: true },
    });
  });

  it('does not repeat the removal note', () => {
    expect(reviewedVerdicts({ x: { keep: true, why: 'Done (owner removed)' } }, ['x'], 'drop').x.why).toBe('Done (owner removed)');
  });

  it('gives a pair with no draft a verdict', () => {
    expect(reviewedVerdicts({}, ['x'], 'agree').x).toMatchObject({ keep: true, checked: true });
    expect(reviewedVerdicts({}, ['x'], 'drop').x).toMatchObject({ keep: false, checked: true });
  });

  it('reads how a page was reviewed', () => {
    expect(reviewedAs([{ keep: true, why: '', checked: true }, { keep: false, why: '', checked: true }])).toBe('agree');
    expect(reviewedAs([{ keep: false, why: '', checked: true }])).toBe('drop');
    expect(reviewedAs([{ keep: true, why: '' }])).toBeNull();
    expect(reviewedAs([undefined])).toBeNull();
    expect(reviewedAs([])).toBeNull();
  });
});
