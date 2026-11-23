import { OWNER_ASK, type BranchVerdict, type BranchVerdicts } from '@shared/quran/branchVerdicts';
import type { Verdict } from '@shared/quran/compareCards';
import { pressesByCard, pressOf, rowsChanged, type CardPress, type CardProposals, type CardReviewEntry } from './cardReviewIndex';

export type Skipped = { id: string; action: CardPress['action']; why: string };

/**
 * The owner's card review presses written into the verdicts (owner 2026-11-23): each card's last press, the pair's verdict for a
 * compare card or a tree card that shares a pair, the tree's own verdict otherwise. The why is the agents' when the owner chose
 * as they proposed, the old one when he kept the old verdict, a plain note otherwise. Discuss marks the card to discuss and
 * changes nothing else. Pure, so running it again on the same log gives the same files.
 */
export function applyCardPresses(cards: CardReviewEntry[], proposals: CardProposals, presses: CardPress[], pairs: Record<string, Verdict>, trees: BranchVerdicts) {
  const pressed = pressesByCard(presses);
  const nextPairs = { ...pairs };
  const nextTrees = { ...trees };
  const applied: { id: string; kind: CardReviewEntry['kind']; action: CardPress['action'] }[] = [];
  const skipped: Skipped[] = [];
  for (const entry of cards) {
    const press = pressOf(entry, pressed);
    if (!press || press.action === 'undo') continue;
    const proposal = proposals[entry.id];
    if (press.version === 'agents' && rowsChanged(entry, proposal)) {
      skipped.push({ id: entry.id, action: press.action, why: "pressed on the agents' version, which changes the card's ayat" });
      continue;
    }
    if (entry.link) {
      skipped.push({ id: entry.id, action: press.action, why: "a surah-order book's card is never judged" });
      continue;
    }
    if (entry.kind === 'book' && press.action === 'drop') {
      skipped.push({ id: entry.id, action: press.action, why: 'a book card is never dropped' });
      continue;
    }
    const keep = press.action === 'keep';
    const why = (old?: { keep: boolean; why: string }) =>
      proposal && proposal.keep === keep ? proposal.why : old && old.keep === keep ? old.why : keep ? 'Owner kept it' : 'Owner dropped it';
    const pairKeys = entry.pairs ?? (entry.twin ? [entry.twin] : []);
    if (pairKeys.length) {
      for (const key of pairKeys) {
        const old = nextPairs[key];
        nextPairs[key] = press.action === 'discuss'
          ? { ...(old ?? { keep: true, why: entry.verdict?.why ?? 'Not judged yet' }), ask: OWNER_ASK }
          : { keep, why: why(old ?? entry.verdict), checked: true, card: true, ...(old?.alone ? { alone: true } : {}) };
      }
    } else {
      const old = nextTrees[entry.id];
      if (press.action === 'discuss') nextTrees[entry.id] = { ...(old ?? { keep: entry.verdict?.keep ?? true, why: entry.verdict?.why ?? 'Not judged yet' }), ask: OWNER_ASK };
      else {
        const settled: BranchVerdict = { ...old, keep, why: why(old ?? entry.verdict), checked: true };
        delete settled.ask;
        delete settled.same;
        if (!keep && proposal?.same && !proposal.keep) settled.same = proposal.same;
        nextTrees[entry.id] = settled;
      }
    }
    applied.push({ id: entry.id, kind: entry.kind, action: press.action });
  }
  return { pairs: nextPairs, trees: nextTrees, applied, skipped };
}
