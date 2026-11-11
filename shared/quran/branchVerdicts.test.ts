import { describe, expect, it } from 'vitest';
import { branchInventory } from './branchInventory';
import { branchReviewState, branchVerdictFor, droppedBranch } from './branchVerdicts';

describe('branch verdicts', () => {
  it('finds a verdict under any id of the card', () => {
    const verdicts = { old: { keep: false, why: 'x', checked: true } };
    expect(droppedBranch({ id: 'new', legacyIds: ['old'] }, verdicts)).toBe(true);
    expect(droppedBranch({ id: 'other', group: { aliases: ['old'] } }, verdicts)).toBe(true);
    expect(droppedBranch({ id: 'none' }, verdicts)).toBe(false);
    expect(branchVerdictFor({ id: 'new', legacyId: 'old' }, verdicts)?.why).toBe('x');
  });

  it('reads the review state of a verdict', () => {
    expect(branchReviewState(undefined)).toBeNull();
    expect(branchReviewState({ keep: true, why: '' })).toBeNull();
    expect(branchReviewState({ keep: true, why: '', checked: true })).toBe('keep');
    expect(branchReviewState({ keep: false, why: '', checked: true })).toBe('drop');
    expect(branchReviewState({ keep: true, why: '', ask: 'owner: discuss' })).toBe('discuss');
  });

  it('browsing leaves out dropped cards and review keeps them', () => {
    const all = branchInventory({}, null, true);
    const shown = branchInventory({}, null);
    expect(shown.length).toBe(all.filter(piece => !droppedBranch(piece)).length);
  });
});
