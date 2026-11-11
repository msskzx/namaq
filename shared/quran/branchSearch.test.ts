import { beforeAll, describe, expect, it } from 'vitest';
import { ALL_KINDS, searchSharedPhrases } from './branchSearch';
import { branchInventory, distinctBranchPieces, outsideMatches, OUTSIDE_SUGGESTIONS } from './branchInventory';

it('does not qualify a broad tree through wording found only in an absorbed alias', () => {
  const broad = { id: 'broad', text: 'أولئك هم', aliases: ['أولئك على هدى من ربهم'], count: 58 };
  const focused = { id: 'focused', text: 'أولئك على هدى من ربهم', count: 2 };
  expect(searchSharedPhrases([broad, focused], 'على هدى').map(item => item.id)).toEqual(['focused']);
});

it('does not silently shorten a query to a matching suffix', () => {
  expect(searchSharedPhrases([{ id: 'short', text: 'على هدى', count: 2 }], 'ليس على هدى')).toEqual([]);
});

it('retains named family English search and Arabic normalization', () => {
  const family = { id: 'family', text: 'الحامدات', textEn: 'The praising chapters', count: 5 };
  expect(searchSharedPhrases([family], 'praising')).toEqual([family]);
  expect(searchSharedPhrases([family], 'الْحَامِدَات')).toEqual([family]);
});

describe('trees outside the current filters', () => {
  // Search outside the filters builds the every-kind tree list once and keeps it. That takes seconds on a slow CI runner and
  // blocks while it runs, so build it here instead of inside whichever test happens to search first.
  beforeAll(() => { branchInventory({ categories: ALL_KINDS }, null); }, 60000);
  it('lists word trees the default list hides, and none already shown', () => {
    const shown = branchInventory({}, null);
    const found = distinctBranchPieces(searchSharedPhrases(shown, 'ألم تر كيف'));
    const outside = outsideMatches('ألم تر كيف', found);
    expect(outside.length).toBeGreaterThan(0);
    expect(outside.length).toBeLessThanOrEqual(OUTSIDE_SUGGESTIONS);
    const shownIds = new Set(found.map(piece => piece.id));
    expect(outside.some(piece => shownIds.has(piece.id))).toBe(false);
    // Each one is in the list its pick opens: no filters but every kind of tree.
    const reset = branchInventory({ categories: ALL_KINDS }, null).map(piece => piece.id);
    for (const piece of outside) expect(reset).toContain(piece.id);
  });

  it('finds trees cut out by a juz range', () => {
    const range = { from: 1, to: 1 };
    const found = distinctBranchPieces(searchSharedPhrases(branchInventory({}, range), 'إن المجرمين في'));
    expect(found).toHaveLength(0);
    expect(outsideMatches('إن المجرمين في', found).some(piece => ['43:74', '54:47'].every(key => piece.keys.includes(key)))).toBe(true);
  });
});
