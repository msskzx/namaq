import { describe, expect, it } from 'vitest';
import { videoAyat } from './treeVideo';
import { growthBeats } from './growth';
import { cardOf, treeList } from './branches';
import { EMPTY_LIST } from './branchList';

describe('the ayat a tree video shows under the tree', () => {
  const piece = treeList().find(item => item.keys.length >= 3)!;
  const beats = growthBeats(cardOf(piece, EMPTY_LIST).presentation.tree, { paths: true });

  it('lists each ayah once, in the order it grows, with its surah:ayah and one number mark', () => {
    const ayat = videoAyat(beats);
    expect(ayat.map(ayah => ayah.key)).toEqual([...new Set(beats.map(beat => beat.key))]);
    for (const ayah of ayat) {
      const [surah, number] = ayah.key.split(':');
      expect(ayah.bubble).toBe(`${surah}:${number}`.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]));
      expect(ayah.text).not.toMatch(/[﴿﴾]/);
      expect(ayah.text.endsWith(number.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[Number(d)]))).toBe(true);
      expect(ayah.place.length).toBeGreaterThan(0);
    }
  });
});
