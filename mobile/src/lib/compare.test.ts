import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { readBookmarks, setBookmarkStorage } from '@shared/bookmarks';
import { ALL_KINDS_LIST, applyDraft, branchList, draftOf, EMPTY_LIST, listShowing } from './branchList';
import { compareLinkFor } from '@/app/quran/compare/pairCards';
import { treeList } from './branches';
import { cardsFor, compareTargetFor, filteredPairs, filterOfList, landingIndex, listedPairs, listOfFilter, pairMatches, savedIdsOf, toggleCardSaved, visitsOf, type PairFilter } from './compare';

const memory = new Map<string, string>();
beforeEach(() => {
  memory.clear();
  setBookmarkStorage({ getItem: key => memory.get(key) ?? null, setItem: (key, value) => void memory.set(key, value) });
});

describe('compare cards on the phone', () => {
  it('shows the cards a reader kept and leaves out pairs that share only vocabulary', () => {
    const ids = cardsFor(2, 3).map(card => card.id);
    expect(ids).toEqual(expect.arrayContaining(['2:66|3:138', '2:127|3:35']));
    expect(ids).not.toContain('2:107|3:29');
  });

  it('gives every listed page at least one card, with the Quran words on both sides', () => {
    for (const pair of listedPairs) {
      const cards = cardsFor(pair.a, pair.b);
      expect(cards.length, `${pair.a}:${pair.b}`).toBeGreaterThan(0);
      for (const card of cards) for (const side of card.sides) for (const ayah of side.ayat) expect(ayah.words.length, `${card.id}`).toBeGreaterThan(0);
    }
  });

  it('merges the Moses and the magicians passage into one card, as on the website', () => {
    expect(cardsFor(7, 26).map(card => card.id)).toContain('7:106-125|26:31-50');
  });
});

describe('moving between surah pairs', () => {
  it('keeps a page in the juz filter only when both surahs are inside it', () => {
    const pairs = filteredPairs({ scope: { unit: 'juz', from: 27, to: 29 } });
    expect(pairs.some(pair => pair.a === 52 && pair.b === 68)).toBe(true);
    expect(pairs.some(pair => pair.a === 2)).toBe(false);
  });

  it('stays on the same page after the list changes, or on that pair seen from its other surah', () => {
    const all = visitsOf(listedPairs);
    const at = landingIndex(all, { lead: 68, other: 52 });
    expect([all[at].lead, all[at].other]).toEqual([68, 52]);
    const narrow = visitsOf(listedPairs.filter(pair => pair.a === 52 && pair.b === 68));
    expect(landingIndex(narrow, { lead: 7, other: 26 })).toBe(0);
  });

  it('finds a pair by surah name, number in either digits, or story', () => {
    const turQalam = { a: 52, b: 68 };
    expect(pairMatches(turQalam, 'الطور')).toBe(true);
    expect(pairMatches(turQalam, 'القلم ٥٢')).toBe(true);
    expect(pairMatches(turQalam, '68')).toBe(true);
    expect(pairMatches(turQalam, 'البقرة')).toBe(false);
    expect(pairMatches({ a: 7, b: 26 }, 'موسى')).toBe(true);
  });
});

describe('saved cards', () => {
  it('lists only the pages holding a saved card when saved only is on', () => {
    const card = cardsFor(52, 68)[0];
    toggleCardSaved(card);
    expect(filteredPairs({ savedOnly: true })).toEqual([expect.objectContaining({ a: 52, b: 68 })]);
    toggleCardSaved(card);
    expect(readBookmarks()).toEqual([]);
  });

  it('reads a pair saved on the website as saving the range card that now holds it', () => {
    const moses = cardsFor(7, 26).find(card => card.id === '7:106-125|26:31-50')!;
    memory.set('bookmarks', JSON.stringify([{ id: 'compare:7:110|26:35', text: '', href: '/quran/compare?a=7&b=26', savedAt: 1 }]));
    expect(savedIdsOf(moses)).toEqual(['compare:7:110|26:35']);
    toggleCardSaved(moses);
    expect(readBookmarks()).toEqual([]);
  });
});

describe('the filter sheet shared with the branches tab', () => {
  it.each<PairFilter>([
    {},
    { savedOnly: true },
    { scope: { unit: 'juz', from: 27, to: 29 } },
    { scope: { unit: 'surah', from: 52, to: 68 }, savedOnly: true },
    { scope: { unit: 'page', from: 500, to: 604 } },
    { scope: { unit: 'surahs', list: [7, 26] } },
    { scope: { unit: 'juzs', list: [9, 19] } },
  ])('opens on the compare filter and gives it back unchanged when applied: %o', filter => {
    expect(filterOfList(applyDraft(draftOf(listOfFilter(filter)))!)).toEqual(filter);
  });

  it('narrows the pages to pairs whose two surahs are among the picked surahs', () => {
    const pairs = filteredPairs(filterOfList(applyDraft({ ...draftOf(listOfFilter({})), unit: 'surahs', picked: [7, 26, 11] })!));
    expect(pairs.map(pair => `${pair.a}:${pair.b}`).sort()).toEqual(['11:26', '7:11', '7:26'].filter(id => listedPairs.some(pair => `${pair.a}:${pair.b}` === id)).sort());
  });
});

describe('the tree icon on a compare card', () => {
  // A tree outside the default list is looked for among every kind of tree, a list built once and kept. That takes seconds
  // on a slow CI runner, so build it here instead of inside the first test that looks.
  beforeAll(() => { branchList(EMPTY_LIST); branchList(ALL_KINDS_LIST); }, 60000);
  it('opens a tree on the branches tab for every card that names one', () => {
    for (const pair of listedPairs) for (const card of cardsFor(pair.a, pair.b)) {
      if (card.group) expect(listShowing(EMPTY_LIST, card.group), card.id).not.toBeNull();
    }
  });

  it('keeps the branches filter when the tree is in it, and drops it when not', () => {
    const card = listedPairs.flatMap(pair => cardsFor(pair.a, pair.b)).find(item => item.group && listShowing(EMPTY_LIST, item.group)?.list === EMPTY_LIST)!;
    const surahs = listShowing(EMPTY_LIST, card.group!)!.piece.keys.map(key => Number(key.split(':')[0]));
    const narrowed = { ...EMPTY_LIST, filters: { surahFrom: String(Math.min(...surahs)), surahTo: String(Math.max(...surahs)) } };
    expect(listShowing(narrowed, card.group!)?.list).toBe(narrowed);
    const elsewhere = { ...EMPTY_LIST, filters: { surahs: '1' } };
    expect(listShowing(elsewhere, card.group!)?.list).not.toBe(elsewhere);
  });
});

describe('the «also in compare» button under a tree', () => {
  it('opens the same surah pair as the website for every tree', () => {
    let linked = 0;
    for (const piece of treeList()) {
      const keys = piece.keys;
      const web = compareLinkFor(keys)?.match(/a=(\d+)&b=(\d+)/);
      const app = compareTargetFor(keys);
      expect(app && [Math.min(app.lead, app.other), Math.max(app.lead, app.other)], piece.id).toEqual(web ? [Number(web[1]), Number(web[2])] : undefined);
      if (app) linked++;
    }
    expect(linked).toBeGreaterThan(50);
  }, 60_000);
});

describe('compare card views', () => {
  it('braids every card so both sides are covered in order', async () => {
    const { braidOf, shownAyat } = await import('./compare');
    for (const pair of listedPairs.slice(0, 60)) for (const card of cardsFor(pair.a, pair.b)) {
      const sides = shownAyat(card);
      const strands = braidOf(sides);
      const words = (i: 0 | 1) => sides[i].ayat.flatMap(ayah => ayah.words);
      expect(strands.flatMap(strand => strand.a.map(word => word.text))).toEqual(words(0));
      expect(strands.flatMap(strand => strand.b.map(word => word.text))).toEqual(words(1));
    }
  });

  it('finds the ayah before and after each side, colouring what the neighbours share', async () => {
    const { aroundOf, shownAyat } = await import('./compare');
    const card = cardsFor(2, 7).find(item => item.sides[0].ayat.some(ayah => ayah.number === 35) && item.sides[1].ayat.some(ayah => ayah.number === 19))!;
    const around = aroundOf(shownAyat(card));
    expect(around.before.map(ayah => ayah?.key)).toEqual(['2:34', '7:18']);
    expect(around.after.map(ayah => ayah?.key)).toEqual(['2:36', '7:20']);
    expect(around.after[0]!.exact.size).toBeGreaterThan(0);
  });
});
