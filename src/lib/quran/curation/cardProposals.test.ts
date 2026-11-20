import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import corpus from '@shared/quran/quranText/corpus';
import { reviewPool } from '@shared/quran/branchInventory';
import { reviewKey, type CardProposals, type CardReviewIndex } from './cardReviewIndex';

const index = JSON.parse(readFileSync('src/lib/quran/curation/cardReview.json', 'utf8')) as CardReviewIndex;
const proposals = (JSON.parse(readFileSync('src/lib/quran/curation/cardProposals.json', 'utf8')) as { cards: CardProposals }).cards;
const byKey = new Map(index.cards.map(entry => [reviewKey(entry), entry]));
const position = new Map(corpus.ayat.map((ayah, i) => [ayah.key, i]));

describe("the review page's cards and the agents' proposals", () => {
  it('lists every tree card of the review pool (rebuild with npm run quran:card-review when the cards change)', () => {
    const listed = new Set(index.cards.filter(entry => entry.kind !== 'compare').map(entry => entry.id));
    expect(reviewPool().map(piece => piece.id).filter(id => !listed.has(id))).toEqual([]);
  });

  it('proposes only for cards that exist, with real ayat, each row a run of consecutive ayat', () => {
    for (const [key, proposal] of Object.entries(proposals)) {
      expect(byKey.has(key), key).toBe(true);
      for (const row of (proposal.cards ?? []).flat()) {
        const at = row.map(ayah => position.get(ayah));
        expect(at.every((i, n) => i !== undefined && (n === 0 || i === at[n - 1]! + 1)), `${key}: ${row}`).toBe(true);
      }
    }
  });

  it("never reshapes a book's card: it shows exactly the ayat the book names", () => {
    expect(Object.entries(proposals).filter(([key, proposal]) => byKey.get(key)!.kind === 'book' && proposal.cards).map(([key]) => key)).toEqual([]);
  });

  it('never mixes Arabic and English on one line of a reason (owner 2026-11-20)', () => {
    const mixed = Object.entries(proposals).flatMap(([key, proposal]) => [proposal.why, proposal.changes, proposal.relation, proposal.check?.why]
      .flatMap(text => (text ?? '').split('\n')).filter(line => /[؀-ۿ]/.test(line) && /[A-Za-z]/.test(line)).map(line => `${key}: ${line}`));
    expect(mixed).toEqual([]);
  });
});
