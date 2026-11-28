// see docs/plans/guard-proposals.md
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import generated from '../data/quran/compareCards';
import corpus from './quranText/corpus';
import { shownCards, type PairCard, type StoredCards } from './compareCards';

const stored = generated as unknown as StoredCards;
const BASELINE = join(__dirname, 'storyCards.baseline.json');
const words = new Map(corpus.ayat.map(ayah => [ayah.key, ayah.words]));

const ayatOf = (card: PairCard) => new Set([
  ...card.sides.flatMap(side => side.ayat.map(ayah => `${side.surah}:${ayah.number}`)),
  ...(card.many?.options.map(option => `${card.sides[card.many!.side].surah}:${option.ayah.number}`) ?? []),
]);

export function sharedAyat(cards: PairCard[], parts: boolean[]) {
  const on = new Map<string, string[]>();
  for (const card of cards) for (const key of ayatOf(card)) on.set(key, [...(on.get(key) ?? []), card.id]);
  const inParts = new Set(cards.filter((_, at) => parts[at]).flatMap(card => [...ayatOf(card)]));
  return [...on].filter(([key, ids]) => ids.length > 1 && inParts.has(key)).map(([key, ids]) => `${key} on ${ids.join(' and ')}`);
}

describe('story pages', () => {
  const pages = Object.keys(stored.stories ?? {});

  it('no ayah of a story part shows on another card of its page', () => {
    expect(pages.some(page => stored.stories![page].some(item => item.t === 1))).toBe(true);
    const twice = pages.flatMap(page => {
      const [a, b] = page.split(':').map(Number);
      const parts = stored.stories![page].map(item => item.t === 1);
      return sharedAyat(shownCards(stored, key => words.get(key), a, b), parts).map(line => `${page}: ${line}`);
    });
    const known: string[] = JSON.parse(readFileSync(BASELINE, 'utf8'));
    if (process.env.UPDATE_BASELINE) writeFileSync(BASELINE, `${JSON.stringify(known.filter(line => twice.includes(line)), null, 2)}\n`);
    expect(twice.filter(line => !known.includes(line)), 'new').toEqual([]);
    expect(known.filter(line => !twice.includes(line)), 'fixed: run with UPDATE_BASELINE=1').toEqual([]);
  });

  it('sees an ayah on two cards', () => {
    const card = (id: string, left: number[], right: number[]): PairCard => ({ id, sides: [
      { surah: 7, ayah: left[0], ayat: left.map(number => ({ number, words: [] })) },
      { surah: 20, ayah: right[0], ayat: right.map(number => ({ number, words: [] })) },
    ] });
    expect(sharedAyat([card('x', [11, 12], [116]), card('y', [13], [117])], [true, false])).toEqual([]);
    expect(sharedAyat([card('x', [11, 12], [116]), card('y', [12], [117])], [true, false])).toEqual(['7:12 on x and y']);
    expect(sharedAyat([card('x', [11], [116]), card('y', [11], [117])], [false, false])).toEqual([]);
  });
});
