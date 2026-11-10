import { describe, expect, it } from 'vitest';
import { bookmarkKind } from './bookmarkKind';

describe('bookmarkKind', () => {
  it('tells trees, compare cards and mushaf ayat apart by their id', () => {
    expect(bookmarkKind({ id: 'ayah:2:255' })).toBe('ayah');
    expect(bookmarkKind({ id: 'compare:2:154|16:21' })).toBe('compare');
    expect(bookmarkKind({ id: 'family' })).toBe('tree');
    expect(bookmarkKind({ id: 'old-tree' })).toBe('tree');
  });
});
