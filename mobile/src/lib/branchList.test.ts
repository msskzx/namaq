import { describe, expect, it } from 'vitest';
import { inJuzRange } from '@shared/quran/juz';
import { textHolds } from '@shared/quran/branches';
import { applyDraft, branchList, draftOf, EMPTY_LIST, openingIndex } from './branchList';

const surahOf = (key: string) => Number(key.split(':')[0]);
const saved = (id: string, savedAt: number) => ({ id, text: '', href: '', savedAt });

describe('the trees the branches tab swipes through', () => {
  const all = branchList(EMPTY_LIST);

  it('keeps only trees inside a juz range, each with two ayat or more there', () => {
    const range = { from: 29, to: 30 };
    const list = branchList({ ...EMPTY_LIST, range });
    expect(list.length).toBeGreaterThan(0);
    for (const piece of list) {
      expect(piece.keys.every(key => inJuzRange(key, range)), piece.id).toBe(true);
      expect(piece.keys.length).toBeGreaterThanOrEqual(2);
    }
  });

  it('finds trees whose phrase holds the search and opens on the exact phrase', () => {
    const list = branchList({ ...EMPTY_LIST, query: 'الذين' });
    expect(list.length).toBeGreaterThan(0);
    for (const piece of list) expect(textHolds(piece.text, 'الذين', 'loose'), piece.text).toBe(true);
    const exact = all.find(piece => piece.text.split(' ').length >= 3)!;
    const found = branchList({ ...EMPTY_LIST, query: exact.text });
    expect(found[openingIndex(found, exact.text)].text).toBe(exact.text);
  });

  it('narrows to trees with an ayah in the picked surah', () => {
    const list = branchList({ ...EMPTY_LIST, surah: 7 });
    expect(list.length).toBeGreaterThan(0);
    expect(list.every(piece => piece.keys.some(key => surahOf(key) === 7))).toBe(true);
  });

  it('lists only saved trees, newest saved first, including ones saved under an older id', () => {
    const [a, b, c] = [all[5], all[40], all[90]];
    const bookmarks = [saved(c.id, 3), saved(a.legacyId, 2), saved(b.id, 1)];
    expect(branchList({ ...EMPTY_LIST, saved: true }, bookmarks).map(piece => piece.id)).toEqual([c.id, a.id, b.id]);
  });
});

describe('the filter sheet', () => {
  it('turns a surah range into the website filters and keeps the search', () => {
    const draft = { ...draftOf({ ...EMPTY_LIST, query: 'x' }), unit: 'surah' as const, from: '٢', to: '3' };
    expect(applyDraft(draft)).toEqual({ filters: { surahFrom: '2', surahTo: '3' }, range: null, query: 'x', saved: false });
  });

  it('keeps a surah picked from the search as the surah range', () => {
    expect(applyDraft(draftOf({ ...EMPTY_LIST, surah: 7 }))).toEqual({ filters: { surahFrom: '7', surahTo: '7' }, range: null, query: '', saved: false });
  });

  it('refuses a range that runs backwards or past the end', () => {
    const base = draftOf(EMPTY_LIST);
    expect(applyDraft({ ...base, from: '5', to: '2' })).toBeNull();
    expect(applyDraft({ ...base, unit: 'page', from: '1', to: '605' })).toBeNull();
  });

  it('opens on what was applied, so applying again changes nothing', () => {
    const state = { filters: { juz: '3,1', categories: 'words', sort: 'places' }, range: null, query: '', saved: true };
    const once = applyDraft(draftOf(state))!;
    expect(once.filters).toEqual({ juz: '1,3', categories: 'words', sort: 'places' });
    expect(applyDraft(draftOf(once))).toEqual(once);
  });
});
