import { describe, expect, it } from 'vitest';
import corpus from '../data/quran/trees.json';
import type { BranchAyah } from './branches';
import { ITQAN_QUOTES, OPENING_CARDS, OPENING_KINDS, conditionLines, kindOf, openingCards, openingKeys, openingLike, type OpeningRow } from './openingKinds';

const byKey = new Map((corpus as unknown as { ayat: BranchAyah[] }).ayat.map(ayah => [ayah.key, ayah]));
const words = (key: string) => byKey.get(key)?.words ?? [];
const cards = openingCards(key => byKey.get(key));
const row = (card: string, surah: number) => cards.find(c => c.id === card)!.rows.find(r => r.surah === surah)!;
/** The row's coloured words: `all` those every surah of the card shares, `some` those only some share. */
const marked = (r: OpeningRow, some: boolean) => r.words.flatMap(w => ('text' in w && w.mark && w.mark.some === some ? [w.text] : []));

describe('opening kinds', () => {
  it('puts every surah under exactly one of the ten kinds, with al-Itqan\'s counts', () => {
    const all = OPENING_KINDS.flatMap(kind => kind.surahs);
    expect(all.sort((a, b) => a - b)).toEqual(Array.from({ length: 114 }, (_, i) => i + 1));
    expect(OPENING_KINDS.map(kind => kind.surahs.length)).toEqual([14, 29, 10, 23, 15, 7, 6, 6, 3, 1]);
  });

  it('quotes al-Itqan once for each kind, in his order, with a page', () => {
    expect(ITQAN_QUOTES.map(quote => quote.kind)).toEqual(OPENING_KINDS.map(kind => kind.id));
    for (const quote of ITQAN_QUOTES) expect(quote.cite).toMatch(/^السيوطي، الإتقان ٣\/٣٦[١-٣]$/);
  });

  it('shows every surah on exactly one card, among surahs of its own kind only', () => {
    const shown = OPENING_CARDS.flatMap(card => card.surahs);
    expect(shown.sort((a, b) => a - b)).toEqual(Array.from({ length: 114 }, (_, i) => i + 1));
    for (const card of OPENING_CARDS) for (const surah of card.surahs) expect(kindOf(surah)).toBe(card.kind);
  });

  it('opens with the first ayah, the next one too after a short one, and the Fatiha after the basmala', () => {
    expect(openingKeys(1, words)).toEqual(['1:2']);
    expect(openingKeys(2, words)).toEqual(['2:1', '2:2']);
    expect(openingKeys(10, words)).toEqual(['10:1']);
    expect(openingKeys(37, words)).toEqual(['37:1', '37:2']);
  });

  it('colours the words the surahs of a card share, as the matrix does: all of them fully, only some faded', () => {
    expect(marked(row('ha-mim', 40), false)).toEqual(['حمٓ']);
    expect(marked(row('ha-mim', 40), true).join(' ')).toMatch(/تَنزِيلُ/);
    expect(marked(row('hamd', 6), false).join(' ')).toMatch(/ٱلْحَمْدُ/);
  });

  it('colours nothing on the cards of surahs that stand alone', () => {
    for (const card of cards.filter(c => c.alone)) for (const r of card.rows) expect([...marked(r, false), ...marked(r, true)]).toEqual([]);
  });

  it('cuts a long opening and ends every full one with its ayah number', () => {
    const long = row('alladhina-amanu', 60);
    expect(long.cut).toBe(true);
    expect(long.words.filter(w => 'text' in w)).toHaveLength(12);
    const short = row('alif-lam-mim', 2);
    expect(short.cut).toBe(false);
    expect(short.words.filter(w => 'end' in w).map(w => ('end' in w ? w.end : 0))).toEqual([1, 2]);
  });

  it('finds the surahs whose opening is like a surah\'s, and none for one that stands alone', () => {
    expect(openingLike(82)).toEqual({ card: 'idha-sama', kind: 'condition', surahs: [81, 84] });
    expect(openingLike(7)).toBeNull();
  });

  it('keeps the condition and answer spans of al-Takwir, al-Infitar and al-Inshiqaq', () => {
    expect(conditionLines(81).map(l => l.role)).toEqual([...Array(13).fill('condition'), 'answer']);
    expect(conditionLines(82).filter(l => l.ours).map(l => l.key)).toEqual(['82:5']);
    expect(conditionLines(84).at(-1)!.role).toBe('disputed');
    expect(conditionLines(1)).toEqual([]);
  });
});
