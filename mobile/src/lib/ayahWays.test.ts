import { beforeEach, describe, expect, it } from 'vitest';
import corpus from '@shared/data/quran/trees.json';
import { setBookmarkStorage } from '@shared/bookmarks';
import { compareBookmarkId } from '@shared/compareBookmarks';
import { compareLinksOfAyah } from '@/app/quran/compare/pairCards';
import { ayahLinksFor, pageAyat } from '@/app/quran/read/ayahLinks';
import page264 from '@shared/data/quran/mushaf/264.json';
import type { MushafPage } from '@shared/quran/readerPage';
import { branchList, EMPTY_LIST, hasTrees } from './branchList';
import { cardsFor, compareTargetsOfAyah, focusIndex, holdsAyah } from './compare';
import { cardWays } from './home';
import { treeList } from './branches';

const memory = new Map<string, string>();
beforeEach(() => {
  memory.clear();
  setBookmarkStorage({ getItem: key => memory.get(key) ?? null, setItem: (key, value) => void memory.set(key, value) });
});

const keys = (corpus.ayat as { key: string }[]).map(ayah => ayah.key);

describe("an ayah's long press: compare and trees", () => {
  it('opens a compare page holding a card of that very ayah, the same pages on the website and the app', () => {
    let withCompare = 0;
    for (const key of keys) {
      const targets = compareTargetsOfAyah(key);
      if (targets.length) withCompare++;
      for (const target of targets) {
        expect(target.lead, key).toBe(Number(key.split(':')[0]));
        expect(cardsFor(target.lead, target.other).some(card => holdsAyah(card, key)), `${key} → ${target.other}`).toBe(true);
      }
      const web = compareLinksOfAyah(key).map(link => { const url = new URL(link.href, 'http://x'); return `${url.searchParams.get('a')}:${url.searchParams.get('b')}`; });
      expect(targets.map(target => `${Math.min(target.lead, target.other)}:${Math.max(target.lead, target.other)}`), key).toEqual(web);
    }
    expect(withCompare).toBeGreaterThan(500);
  });

  it('offers trees only for an ayah some tree of the unfiltered list holds, and that list then shows them', () => {
    let withTrees = 0;
    for (const key of keys.filter((_, i) => i % 7 === 0)) {
      const found = branchList({ ...EMPTY_LIST, ayah: key });
      expect(hasTrees(key), key).toBe(found.length > 0);
      expect(found.every(piece => piece.keys.includes(key))).toBe(true);
      if (found.length) withTrees++;
    }
    expect(withTrees).toBeGreaterThan(100);
  });

  it('gives the website reader the same links for a mushaf page', () => {
    const ayat = pageAyat(page264 as MushafPage, 15);
    expect(ayat).toContain('15:45');
    expect(ayat.every(key => key.startsWith('15:'))).toBe(true);
    const links = ayahLinksFor(ayat);
    for (const key of ayat) {
      expect(!!links[key]?.trees, key).toBe(hasTrees(key));
      expect(links[key]?.compare.length ?? 0, key).toBe(compareTargetsOfAyah(key).length);
    }
    expect(links['15:45'].trees).toBe('/quran/branches?k=15%3A45');
  });
});

describe("a saved card's long press", () => {
  it('a saved ayah offers the mushaf, its trees and compare when it has them', () => {
    const ways = cardWays({ id: 'ayah:15:45', text: '' });
    expect(ways.map(way => way.to)).toEqual(['mushaf', 'trees', 'compare']);
    expect(cardWays({ id: 'ayah:1:1', text: '' })[0]).toEqual({ to: 'mushaf', at: '1:1' });
  });

  it('a saved tree offers the mushaf at its first ayah, tree, matrix and compare', () => {
    const piece = treeList().find(item => item.keys.length === 2 && compareTargetsOfAyah(item.keys[0]).length)!;
    const ways = cardWays({ id: piece.id, text: piece.text });
    expect(ways.slice(0, 3).map(way => way.to)).toEqual(['mushaf', 'tree', 'matrix']);
    expect(ways[0]).toEqual({ to: 'mushaf', at: [...piece.keys].sort((p, q) => p.localeCompare(q, undefined, { numeric: true }))[0] });
  });

  it('a saved compare card offers the mushaf, its tree and matrix, and its own compare page', () => {
    const card = cardsFor(2, 3).find(item => item.group && !item.pairs)!;
    const ways = cardWays({ id: compareBookmarkId(card.id), text: '' });
    expect(ways.map(way => way.to)).toEqual(['mushaf', 'tree', 'matrix', 'compare']);
    expect(ways[1]).toMatchObject({ tree: card.group });
    expect(ways[3]).toMatchObject({ targets: [{ lead: 2, other: 3 }] });
  });
});

describe('the compare page opened on a card', () => {
  it('lands on the card of both ayat, not an earlier card that shares only the first', () => {
    let checked = 0;
    for (const { a, b } of [{ a: 2, b: 7 }, { a: 7, b: 20 }, { a: 2, b: 3 }]) {
      const cards = cardsFor(a, b);
      cards.forEach((card, at) => {
        if (card.many || card.pairs) return;
        const ayat = card.id.split('|');
        const first = cards.findIndex(item => holdsAyah(item, ayat[0]));
        expect(focusIndex(cards, ayat), card.id).toBe(at);
        if (first !== at) checked++;
      });
    }
    expect(focusIndex(cardsFor(2, 7), ['2:49'])).toBe(cardsFor(2, 7).findIndex(card => holdsAyah(card, '2:49')));
    expect(checked).toBeGreaterThan(0);
  });
});
