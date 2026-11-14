import { describe, expect, it } from 'vitest';
import { compareBookmarkId } from '@shared/compareBookmarks';
import { treeInventory } from '@/app/quran/read/ayahPreview';
import { pairOfDay } from '@/app/quran/compare/pairCards';
import { savedContent } from './homeFeed';

describe('a saved card in the home feed', () => {
  it('is the tree card of a saved tree', () => {
    const piece = treeInventory()[0];
    expect(savedContent(piece.id)?.tree?.id).toBe(piece.id);
  });

  it('is the pair card of a saved compare card', () => {
    const pair = pairOfDay(20_000)!;
    expect(savedContent(compareBookmarkId(pair.id))?.pair?.id).toBe(pair.id);
  });

  it('is nothing for an ayah, or a card the data no longer holds', () => {
    expect(savedContent('ayah:2:255')).toBeNull();
    expect(savedContent('no-such-tree')).toBeNull();
    expect(savedContent(compareBookmarkId('2:1|3:1'))).toBeNull();
  });
});
