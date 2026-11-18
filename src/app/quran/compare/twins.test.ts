import { describe, expect, it } from 'vitest';
import { branchVerdictFor, droppedBranch, matrixOnly, ownAyatOnly, twinVerdicts } from '@shared/quran/branchVerdicts';
import { buildTwinVerdicts } from './twins';

describe('twins: a branches card of two ayat that compare also holds', () => {
  it('twinVerdicts.json is built from the current compare verdicts: run npm run quran:compare-cards after changing them', () => {
    expect(twinVerdicts).toEqual(buildTwinVerdicts());
  });

  it('reads its compare verdict, keeps its branches-only ayat setting, and a "same" hide stands whatever compare says', () => {
    const own = { 'cmp:a': { keep: true, why: 'branches', ayat: 'own' as const }, 'cmp:b': { keep: false, why: 'same phrase as cmp:c', same: 'cmp:c' } };
    const twins = { 'cmp:a': { pair: '1:1|2:2', keep: false, why: 'compare', checked: true }, 'cmp:b': { pair: '1:2|2:3', keep: true, why: 'compare', view: 'matrix' as const } };
    expect(branchVerdictFor({ id: 'cmp:a' }, own, twins)).toEqual({ keep: false, why: 'compare', checked: true, ayat: 'own' });
    expect(branchVerdictFor({ id: 'cmp:b' }, own, twins)).toEqual(own['cmp:b']);
    expect(branchVerdictFor({ id: 'x', legacyId: 'cmp:a' }, {}, twins)?.why).toBe('compare');
  });

  it('the shipped twins decide the shipped cards', () => {
    const [id, twin] = Object.entries(twinVerdicts).find(([, twin]) => twin.view === 'matrix' && twin.keep)!;
    expect(matrixOnly({ id })).toBe(true);
    expect(droppedBranch({ id })).toBe(false);
    expect(twin.pair).toMatch(/^\d+:\d+\|\d+:\d+$/);
    // 94:5 against 94:6: the owner's call on branches (matrix, own ayat) now lives on the compare pair.
    const ease = Object.keys(twinVerdicts).find(key => twinVerdicts[key].pair === '94:5|94:6')!;
    expect(matrixOnly({ id: ease })).toBe(true);
    expect(ownAyatOnly({ id: ease })).toBe(true);
  });
});
