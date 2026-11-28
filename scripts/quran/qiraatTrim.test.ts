import { describe, expect, it } from 'vitest';
import data from '../../shared/data/quran/qiraat.json';
import { trimShared } from './qiraatTrim';

describe('trimShared: only the words the readers differ on (owner, 2026-11-19)', () => {
  it('drops a context word every reading shares (2:9)', () => {
    expect(trimShared(['وَمَا يَخۡدَعُونَ', 'وَمَا يُخَٰدِعُونَ'])).toEqual({ start: 1, end: 2, texts: ['يَخۡدَعُونَ', 'يُخَٰدِعُونَ'] });
  });

  it('drops the word of the ayah before that the dump quotes with al-Fatiha 4', () => {
    expect(trimShared(['ٱلرَّحِيمِ مَٰلِكِ', 'الرَّحِيمِ مَلِكِ'])).toEqual({ start: 1, end: 2, texts: ['مَٰلِكِ', 'مَلِكِ'] });
  });

  it('lines a shorter reading up with the Hafs word it stands for (2:90)', () => {
    expect(trimShared(['بَغۡيًا أَن يُنَزِّلَ', 'يُنۡزِلَ'])).toEqual({ start: 2, end: 3, texts: ['يُنَزِّلَ', 'يُنۡزِلَ'] });
  });

  it('keeps a real omission whole (9:100 «من تحتها»)', () => {
    expect(trimShared(['تَجۡرِي تَحۡتَهَا', 'تَجۡرِي مِن تَحۡتِهَا'])).toEqual({ problem: 'readings of different lengths' });
  });

  it('does not pad a reading that runs a left-out word into its own («ماهى» for «ما هيه»)', () => {
    expect(trimShared(['مَا هِيَهۡ نَارٌ', 'مَاهِىَ نَارٌ'])).toEqual({ problem: 'readings of different lengths' });
  });

  it('leaves a merging only a mark shows (36:1 «يسٓ» against «يس»)', () => {
    expect(trimShared(['يسٓ وَٱلۡقُرۡءَانِ', 'يس'])).toEqual({ problem: 'the trimmed readings differ only in marks' });
  });

  it('leaves no shared word at either end of a stored difference, except two the build lists for review', () => {
    const plain = (w: string) => w.normalize('NFC').replace(/[ۖ-ۛـ]/g, '').replace(/ۡ/g, 'ْ').replace(/ٱ/g, 'ا');
    const untrimmed: string[] = [];
    for (const [key, list] of Object.entries(data.ayat)) {
      for (const word of list) {
        const words = word.readings.map(r => r.text.split(/\s+/));
        if (words.some(w => w.length !== words[0].length) || words[0].length < 2) continue;
        const shared = (k: number) => words.every(w => plain(w[k]) === plain(words[0][k]));
        if (shared(0) || shared(words[0].length - 1)) untrimmed.push(`${key}:${word.at[0]}`);
      }
    }
    expect(untrimmed).toEqual(['24:43:36', '30:54:17']);
  });
});
