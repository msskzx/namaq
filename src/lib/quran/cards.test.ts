import { describe, expect, it } from 'vitest';
import { sideCards } from './cards';
import runs from '@/app/quran/data/runs.json';
import ayat from '@/app/quran/data/ayat.json';

describe('sideCards', () => {
  const text = { '1:2': 'a b c d', '1:3': 'e f g' };

  it('cuts the first and last ayah to the span and re-bases the marks', () => {
    const cards = sideCards(
      { from: { surah: 1, ayah: 2, word: 2 }, to: { surah: 1, ayah: 3, word: 1 } },
      [1, 3],
      text,
    );
    expect(cards).toEqual([
      { surah: 1, ayah: 2, text: 'c d', marks: [1] },
      { surah: 1, ayah: 3, text: 'e f', marks: [1] },
    ]);
  });

  it('shows whole boundary ayat with the words outside the passage plain', () => {
    const cards = sideCards(
      { from: { surah: 1, ayah: 2, word: 2 }, to: { surah: 1, ayah: 3, word: 1 } },
      [1, 3],
      text,
      { full: true },
    );
    expect(cards).toEqual([
      { surah: 1, ayah: 2, text: 'a b c d', marks: [0, 1, 3] },
      { surah: 1, ayah: 3, text: 'e f g', marks: [2, 1] },
    ]);
  });

  it('appends the following ayat in full and plain, up to the text it has', () => {
    const side = { from: { surah: 1, ayah: 2, word: 0 }, to: { surah: 1, ayah: 2, word: 3 } };
    expect(sideCards(side, [], text, { after: 1 })[1]).toEqual({ surah: 1, ayah: 3, text: 'e f g', marks: [0, 1, 2] });
    expect(sideCards(side, [], text, { after: 5 })).toHaveLength(2);
  });

  it('has text for every ayah of every committed passage', () => {
    for (const p of runs.passages) {
      for (const side of [p.a, p.b]) {
        const cards = sideCards(side, [], ayat as Record<string, string>);
        for (const card of cards) expect(card.text).not.toBe('');
      }
    }
  });
});
