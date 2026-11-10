import { describe, expect, it } from 'vitest';
import { referencesOf, savedCard } from './home';
import { treeList } from './branches';
import { aliasesOf } from './branchList';

const saved = (id: string) => ({ id, text: 'نص', href: '/', savedAt: 0 });

describe('the homepage shelf', () => {
  it('lists a card’s ayat by surah in mushaf order', () => {
    expect(referencesOf(['26:109', '10:72', '26:127', '10:72'])).toEqual([{ surah: 10, ayat: [72] }, { surah: 26, ayat: [109, 127] }]);
  });

  it('opens a saved ayah at that ayah in the mushaf', () => {
    expect(savedCard(saved('ayah:2:255'))).toMatchObject({ kind: 'ayah', references: [{ surah: 2, ayat: [255] }], open: { tab: 'read', at: '2:255' } });
  });

  it('opens a saved compare card on its surah pair, a range shown as a range', () => {
    expect(savedCard(saved('compare:7:106-125|26:31-50'))).toMatchObject({
      kind: 'compare',
      references: [{ surah: 7, ayat: [106, 125], range: true }, { surah: 26, ayat: [31, 50], range: true }],
      open: { tab: 'compare', lead: 7, other: 26 },
    });
  });

  it('opens a saved tree among the saved trees, also under an id the website saved it as', () => {
    const piece = treeList()[0];
    const alias = aliasesOf(piece).find(id => id && id !== piece.id)!;
    expect(savedCard(saved(piece.id)).open).toEqual({ tab: 'branches', open: piece.id });
    const card = savedCard(saved(alias));
    expect(card.open).toEqual({ tab: 'branches', open: alias });
    expect(card.references.flatMap(reference => reference.ayat.map(ayah => `${reference.surah}:${ayah}`)).sort()).toEqual([...new Set(piece.keys)].sort());
  });

  it('does not open a saved tree the app no longer has', () => {
    expect(savedCard(saved('no-such-tree')).open).toBeNull();
  });
});
