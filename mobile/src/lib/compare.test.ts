import { beforeEach, describe, expect, it } from 'vitest';
import { readBookmarks, setBookmarkStorage } from '@shared/bookmarks';
import { applyDraft, draftOf } from './branchList';
import { cardsFor, filteredPairs, filterOfList, landingIndex, listedPairs, listOfFilter, pairMatches, savedIdsOf, toggleCardSaved, visitsOf, type PairFilter } from './compare';

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
