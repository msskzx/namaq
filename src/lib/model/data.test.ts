import { describe, expect, it } from 'vitest';
import { checkModel } from './check';
import { loadModel } from './load';

describe('the authored model under data/works', () => {
  it('passes model:check', () => {
    const folders = loadModel('.');
    expect(folders.length).toBeGreaterThan(0);
    expect(checkModel(folders, '.')).toEqual([]);
  });
});
