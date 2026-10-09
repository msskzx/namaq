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

  it('has text for every ayah of every committed passage', () => {
    for (const p of runs.passages) {
      for (const side of [p.a, p.b]) {
        const cards = sideCards(side, [], ayat as Record<string, string>);
        for (const card of cards) expect(card.text).not.toBe('');
      }
    }
  });
});
