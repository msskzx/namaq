import { describe, expect, it } from 'vitest';
import { agentsChanged, comparePages, pageOf, pressesByCard, reviewKey, rowsChanged, selectCards, type CardPress, type CardReviewEntry } from './cardReviewIndex';

const tree = (id: string, rows: string[][], extra: Partial<CardReviewEntry> = {}): CardReviewEntry => ({ id, kind: 'word', title: '', rows, verdict: { keep: true, why: 'old' }, ...extra });
const press = (id: string, action: CardPress['action'], t = 0): CardPress => ({ t, id, action, version: 'original' });

describe('card review', () => {
  it('a tree card that is one compare pair and the compare card of that pair answer to one key (one verdict)', () => {
    const twin = tree('tree:a', [['2:8'], ['3:114']], { twin: '2:8|3:114' });
    const compare: CardReviewEntry = { id: 'cmp-card:2:8|3:114', kind: 'compare', title: '', rows: [['2:8'], ['3:114']], pairs: ['2:8|3:114'], page: '2/3' };
    expect(reviewKey(twin)).toBe(reviewKey(compare));
    expect(reviewKey({ id: 'cmp-card:x', pairs: ['2:1|3:1', '2:2|3:2'] })).toBe('cmp-card:x');
  });

  it("counts as changed by the agents only another verdict, other rows or a split", () => {
    const card = tree('t', [['2:25'], ['4:57']]);
    expect(agentsChanged(card, { keep: true, why: 'same' })).toBe(false);
    expect(agentsChanged(card, { keep: true, why: 'same', cards: [[['2:25'], ['4:57']]] })).toBe(false);
    expect(agentsChanged(card, { keep: false, why: 'drop' })).toBe(true);
    expect(rowsChanged(card, { keep: true, why: '', cards: [[['2:25', '2:26'], ['4:57']]] })).toBe(true);
    expect(rowsChanged(card, { keep: true, why: '', cards: [[['2:25']], [['4:57']]] })).toBe(true);
    expect(agentsChanged({ ...card, verdict: undefined }, { keep: true, why: 'new' })).toBe(true);
  });

  it("reads the owner's last press per card from the log; undo clears it", () => {
    const last = pressesByCard([press('a', 'keep', 1), press('b', 'drop', 2), press('a', 'drop', 3), press('b', 'undo', 4)]);
    expect(last.get('a')?.action).toBe('drop');
    expect(last.has('b')).toBe(false);
  });

  it('lists one kind, one compare surah pair, only changed or only unreviewed cards', () => {
    const cards = [
      tree('w1', [['2:1'], ['3:1']]),
      tree('w2', [['2:2'], ['3:2']]),
      tree('b1', [['2:3'], ['3:3']], { kind: 'book' }),
      { id: 'c1', kind: 'compare', title: '', rows: [], page: '2/3', pairs: ['2:4|3:4'] } as CardReviewEntry,
      { id: 'c2', kind: 'compare', title: '', rows: [], page: '2/5', pairs: ['2:5|5:5', '2:6|5:6'] } as CardReviewEntry,
    ];
    const ids = (list: CardReviewEntry[]) => list.map(entry => entry.id);
    expect(ids(selectCards(cards, {}, new Map(), { kind: 'word' }))).toEqual(['w1', 'w2']);
    expect(ids(selectCards(cards, {}, new Map(), { kind: 'compare', pair: '2/5' }))).toEqual(['c2']);
    expect(ids(selectCards(cards, { w2: { keep: false, why: 'x' } }, new Map(), { kind: 'word', changed: true }))).toEqual(['w2']);
    // The compare card of one pair is pressed under the pair.
    expect(ids(selectCards(cards, {}, pressesByCard([press('2:4|3:4', 'keep')]), { kind: 'compare', todo: true }))).toEqual(['c2']);
  });

  it('keeps the page number inside the list', () => {
    const list = Array.from({ length: 45 }, (_, i) => i);
    expect(pageOf(list, 20, 3)).toEqual({ items: [40, 41, 42, 43, 44], page: 3, pages: 3 });
    expect(pageOf(list, 20, 9).page).toBe(3);
    expect(pageOf([], 20, 1)).toEqual({ items: [], page: 1, pages: 1 });
  });

  it('orders compare surah pairs as the mushaf does, with their card counts', () => {
    const at = (page: string): CardReviewEntry => ({ id: page, kind: 'compare', title: '', rows: [], page });
    expect(comparePages([at('10/12'), at('2/3'), at('2/10'), at('2/3')])).toEqual([{ page: '2/3', count: 2 }, { page: '2/10', count: 1 }, { page: '10/12', count: 1 }]);
  });
});
