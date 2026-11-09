import { describe, expect, it } from 'vitest';
import { keys } from '@shared/quran/branches';
import { cardOf, treeList } from './branches';

const order = (key: string) => { const [surah, ayah] = key.split(':').map(Number); return surah * 1000 + ayah; };

describe('branches cards on the phone', () => {
  const list = treeList();

  it('lists the trees in mushaf order of their first ayah', () => {
    const firsts = list.map(piece => Math.min(...piece.keys.map(order)));
    expect(firsts).toEqual([...firsts].sort((a, b) => a - b));
  });

  it('draws every ayah of a card in its tree', () => {
    for (const piece of list.slice(0, 60)) {
      const { presentation } = cardOf(piece);
      const drawn = new Set([...keys(presentation.tree), ...presentation.prefixes.flatMap(prefix => prefix.keys)]);
      for (const key of piece.keys) expect(drawn.has(key), `${piece.id} misses ${key}`).toBe(true);
    }
  });
});
