import { describe, expect, it } from 'vitest';
import { OWNER_ASK } from '@shared/quran/branchVerdicts';
import { applyCardPresses } from './cardApply';
import type { CardPress, CardReviewEntry } from './cardReviewIndex';

const old = { keep: true, why: 'old why' };
const cards: CardReviewEntry[] = [
  { id: 'cmp', kind: 'compare', rows: [['1:1'], ['2:2']], pairs: ['1:1|2:2'], verdict: old },
  { id: 'book', kind: 'book', rows: [['3:3'], ['4:4']], verdict: old },
  { id: 'twin', kind: 'word', rows: [['5:5'], ['6:6']], twin: '5:5|6:6', verdict: old },
  { id: 'tree', kind: 'ours', rows: [['7:7'], ['8:8']], verdict: old },
  { id: 'split', kind: 'ours', rows: [['9:9'], ['9:10']], verdict: old },
  { id: 'talk', kind: 'word', rows: [['11:1'], ['12:2']], verdict: { keep: false, why: 'thin' } },
];
const proposals = {
  cmp: { keep: false, why: 'agents why' },
  tree: { keep: true, why: 'agents keep' },
  split: { keep: true, why: 'split it', cards: [[['9:9']], [['9:10']]] },
};
const press = (id: string, action: CardPress['action'], version: CardPress['version'] = 'original', shared?: string): CardPress => ({ t: 0, id, action, version, ...(shared ? { shared } : {}) });
const run = () => applyCardPresses(cards, proposals, [
  press('cmp', 'drop', 'original', '1:1|2:2'),
  press('book', 'drop'),
  press('twin', 'drop', 'original', '5:5|6:6'),
  press('tree', 'drop'),
  press('split', 'keep', 'agents'),
  press('talk', 'discuss'),
], { '1:1|2:2': old, '5:5|6:6': old }, {});

describe('applyCardPresses', () => {
  it("writes the owner's choice with the agents' why when he chose as they did, else a plain note, and a twin's into its pair", () => {
    const { pairs, trees } = run();
    expect(pairs['1:1|2:2']).toMatchObject({ keep: false, why: 'agents why', checked: true });
    expect(pairs['5:5|6:6']).toMatchObject({ keep: false, why: 'Owner dropped it', checked: true });
    expect(trees.twin).toBeUndefined();
    expect(trees.tree).toEqual({ keep: false, why: 'Owner dropped it', checked: true });
  });

  it('never drops a book card or reshapes a card the agents split, and discuss only marks the card', () => {
    const { trees, skipped } = run();
    expect(skipped.map(entry => entry.id).sort()).toEqual(['book', 'split']);
    expect(trees.book).toBeUndefined();
    expect(trees.talk).toEqual({ keep: false, why: 'thin', ask: OWNER_ASK });
  });

  it('gives the same files when run again on its own output', () => {
    const first = run();
    const again = applyCardPresses(cards, proposals, [press('cmp', 'drop', 'original', '1:1|2:2'), press('tree', 'drop'), press('talk', 'discuss')], first.pairs, first.trees);
    expect(again.pairs).toEqual(first.pairs);
    expect(again.trees).toEqual(first.trees);
  });
});
