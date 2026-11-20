import { expect, it } from 'vitest';
import { branchInventory } from '@shared/quran/branchInventory';
import { ALL_KINDS } from '@shared/quran/branchSearch';
import { cardOf, matrixOf, rowOf } from './branches';

it('finds each ayah\'s own row once a row read on into another is left out (card «الله فما له من»)', () => {
  const piece = branchInventory({ categories: ALL_KINDS }, null).find(item => item.id === 'tree:17l1khf1falshb')!;
  const { presentation } = cardOf(piece);
  const matrix = matrixOf(presentation, false);
  const firsts = matrix.rows.map(row => row.ayah!.ayat[0].key);
  // al-Zumar 37 is drawn once, inside the al-Zumar 36 row.
  expect(firsts).not.toContain('39:37');
  expect(matrix.rows.flatMap(row => row.ayah!.ayat.map(ayah => ayah.key)).filter(key => key === '39:37')).toHaveLength(1);
  for (const ayah of presentation.ayat) {
    const found = rowOf(matrix, ayah.key)!;
    expect(found.row.ayah!.ayat[0].key, ayah.key).toBe(ayah.key);
    expect(matrix.rows[found.r].ayah!.ayat.some(cell => cell.key === ayah.key), ayah.key).toBe(true);
  }
});
