import { describe, expect, it } from 'vitest';
import { videoAyat } from './treeVideo';
import { growthBeats } from './growth';
import { cardOf, matrixOf, surahNames, treeList } from './branches';
import { num } from '@shared/quran/arabicNumber';
import type { Palette } from './theme';
import { EMPTY_LIST } from './branchList';

describe('the ayat a tree video shows under the tree', () => {
  const piece = treeList().find(item => item.keys.length >= 3)!;
  const beats = growthBeats(cardOf(piece, EMPTY_LIST).presentation.tree, { paths: true });

  const palette = { ink: '#000000', accent: '#aa0000', root: '#0000aa', card: '#ffffff' } as Palette;
  const presentation = cardOf(piece, EMPTY_LIST).presentation;

  it('lists each ayah once, in the order it grows, its chip naming the surah and the ayah', () => {
    const ayat = videoAyat(beats, presentation, palette);
    expect(ayat.map(ayah => ayah.key)).toEqual([...new Set(beats.map(beat => beat.key))]);
    for (const ayah of ayat) {
      const [surah, number] = ayah.key.split(':').map(Number);
      expect(ayah.chip).toBe(`${surahNames[surah]} ${num(number)}`);
      expect(ayah.name).toBe(surahNames[surah]);
      expect(ayah.label).toMatch(/^الآي(ة|ات) /);
    }
  });

  it('colours the words as the matrix card does, with one accent number after each ayah', () => {
    const ayat = videoAyat(beats, presentation, palette);
    const row = matrixOf(presentation, false).rows[0].ayah!.ayat;
    const words = ayat.find(ayah => ayah.key === presentation.ayat[0].key)!.words;
    expect(words).toHaveLength(row.reduce((sum, ayah) => sum + ayah.words.length + 1, 0));
    expect(words.filter(word => /^[٠-٩]+$/.test(word.text)).every(word => word.color === palette.accent)).toBe(true);
    expect(words.some(word => word.color === palette.accent || word.color === palette.root)).toBe(true);
  });
});
