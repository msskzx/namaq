import { describe, expect, it } from 'vitest';
import { defaultBranchView } from './branchView';

describe('defaultBranchView', () => {
  it('opens the matrix unless the reader picked the tree', () => {
    expect(defaultBranchView(undefined)).toBe('cards');
    expect(defaultBranchView('invalid')).toBe('cards');
    expect(defaultBranchView('cards')).toBe('cards');
    expect(defaultBranchView('tree')).toBe('tree');
  });
});
