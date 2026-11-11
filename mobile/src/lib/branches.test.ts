import { describe, expect, it } from 'vitest';
import { keys } from '@shared/quran/branches';
import { cardOf, evidenceOf, searchLit, treeList } from './branches';

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

describe('what a tree shows beside it', () => {
  it('names the books behind some trees, and only for the ayat shown', () => {
    const cited = treeList().map(piece => ({ piece, group: evidenceOf(piece) })).filter(item => item.group?.citations.length);
    expect(cited.length).toBeGreaterThan(5);
    for (const { piece, group } of cited) for (const citation of group!.citations) {
      for (const selection of citation.selections ?? []) expect(piece.keys, citation.id).toContain(selection.key);
    }
  });

  it('lights only the ayat that hold the searched words', () => {
    const piece = treeList().find(item => ['2:4', '4:60', '4:162'].every(key => item.keys.includes(key)))!;
    const { presentation } = cardOf(piece);
    expect(searchLit(presentation, 'هم يوقنون')).toEqual(['2:4']);
    expect(searchLit(presentation, 'بما انزل اليك')).toEqual([]);
  });
});
