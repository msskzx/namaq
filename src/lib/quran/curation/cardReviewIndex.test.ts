import { describe, expect, it } from 'vitest';
import { agentsChanged, comparePages, pageOf, pressesByCard, pressOf, rowsChanged, selectCards, type CardPress, type CardReviewEntry } from './cardReviewIndex';

const tree = (id: string, rows: string[][], extra: Partial<CardReviewEntry> = {}): CardReviewEntry => ({ id, kind: 'word', rows, verdict: { keep: true, why: 'old' }, ...extra });
const press = (id: string, action: CardPress['action'], t = 0): CardPress => ({ t, id, action, version: 'original' });

describe('card review', () => {
  it('a press on a tree card that is one compare pair is the press of the compare card of that pair too (one verdict)', () => {
    const twin = tree('tree:a', [['2:8'], ['3:114']], { twin: '2:8|3:114' });
    const compare: CardReviewEntry = { id: 'cmp-card:2:8|3:114', kind: 'compare', rows: [['2:8'], ['3:114']], pairs: ['2:8|3:114'], page: '2/3' };
    const other = tree('tree:b', [['2:9'], ['3:115']]);
    const pressed = pressesByCard([{ t: 1, id: 'tree:a', shared: '2:8|3:114', action: 'keep', version: 'original' }]);
    expect(pressOf(compare, pressed)?.action).toBe('keep');
    expect(pressOf(other, pressed)).toBeUndefined();
    // A later press on the compare card is the last word for both; undoing it clears both.
    const later = pressesByCard([{ t: 1, id: 'tree:a', shared: '2:8|3:114', action: 'keep', version: 'original' }, { t: 2, id: compare.id, shared: '2:8|3:114', action: 'drop', version: 'original' }]);
    expect(pressOf(twin, later)?.action).toBe('drop');
    const undone = pressesByCard([{ t: 1, id: 'tree:a', shared: '2:8|3:114', action: 'keep', version: 'original' }, { t: 2, id: compare.id, shared: '2:8|3:114', action: 'undo', version: 'original' }]);
    expect(pressOf(compare, undone)).toBeUndefined();
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
      { id: 'c1', kind: 'compare', rows: [], page: '2/3', pairs: ['2:4|3:4'] } as CardReviewEntry,
      { id: 'c2', kind: 'compare', rows: [], page: '2/5', pairs: ['2:5|5:5', '2:6|5:6'] } as CardReviewEntry,
    ];
    const ids = (list: CardReviewEntry[]) => list.map(entry => entry.id);
    expect(ids(selectCards(cards, {}, new Map(), { kind: 'word' }))).toEqual(['w1', 'w2']);
    expect(ids(selectCards(cards, {}, new Map(), { kind: 'compare', pair: '2/5' }))).toEqual(['c2']);
    expect(ids(selectCards(cards, { w2: { keep: false, why: 'x' } }, new Map(), { kind: 'word', changed: true }))).toEqual(['w2']);
    // The compare card of one pair counts as reviewed when its tree twin was pressed.
    expect(ids(selectCards(cards, {}, pressesByCard([{ ...press('tree:x', 'keep'), shared: '2:4|3:4' }]), { kind: 'compare', todo: true }))).toEqual(['c2']);
  });

  it('keeps the page number inside the list', () => {
    const list = Array.from({ length: 45 }, (_, i) => i);
    expect(pageOf(list, 20, 3)).toEqual({ items: [40, 41, 42, 43, 44], page: 3, pages: 3 });
    expect(pageOf(list, 20, 9).page).toBe(3);
    expect(pageOf([], 20, 1)).toEqual({ items: [], page: 1, pages: 1 });
  });

  it('orders compare surah pairs as the mushaf does, with their card counts', () => {
    const at = (page: string): CardReviewEntry => ({ id: page, kind: 'compare', rows: [], page });
    expect(comparePages([at('10/12'), at('2/3'), at('2/10'), at('2/3')])).toEqual([{ page: '2/3', count: 2 }, { page: '2/10', count: 1 }, { page: '10/12', count: 1 }]);
  });
});
