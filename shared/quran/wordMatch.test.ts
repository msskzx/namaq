import { describe, expect, it } from 'vitest';
import data from './quranText/corpus';
import { sharedByAll } from './ayahContext';
import type { BranchAyah } from './branches';
import { likeness, markTones } from './wordMatch';

const ayat = new Map((data.ayat as BranchAyah[]).map(ayah => [ayah.key, ayah]));
const matched = (...keys: string[]) => sharedByAll(keys.map(key => ({ ayah: ayat.get(key)!, before: null, after: null })));

describe('one rule for words the ayat share', () => {
  it('tells words written alike from the same letters written differently and from a shared root', () => {
    expect(likeness(['ٱللَّهِ', 'ٱللَّهِ'])).toBe('exact');
    expect(likeness(['ٱلرَّحْمَـٰنِ', 'ٱلرَّحْمَٰنِ'])).toBe('exact');
    expect(likeness(['لَعْنَةُ', 'لَعْنَةَ'])).toBe('written');
    // A hamza's seat and idgham's shadda are writing too.
    expect(likeness(['مِّن', 'مِن'])).toBe('written');
    expect(likeness(['يُؤْمِنُونَ', 'ءَامَنُوا۟'])).toBe('root');
  });

  it('marks «لعنة» in Al-Baqarah 161 and Al Imran 87 as written differently, in the matrix as in the tree', () => {
    const [baqara, imran] = matched('2:161', '3:87');
    const at = (context: typeof baqara) => context.ayah.words.findIndex(word => word.startsWith('لَعۡنَة'));
    expect(baqara.match!.written).toContain(at(baqara));
    expect(imran.match!.written).toContain(at(imran));
    expect(baqara.match!.exact).not.toContain(at(baqara));
    expect(baqara.match!.links![at(baqara)]).toMatchObject({ kind: 'written', exact: false });
  });

  it('colours by kind, with one colour, or not at all', () => {
    const tones = { exact: 'e', written: 'w', root: 'r' };
    expect(markTones('kinds', tones)).toEqual(tones);
    expect(markTones('one', tones)).toEqual({ exact: 'e', written: 'e', root: 'e' });
    expect(markTones('none', tones)).toEqual({});
  });
});
