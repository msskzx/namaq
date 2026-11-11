import data from '../data/quran/branchVerdicts.json';

/** The owner's verdict on one branches card. `ask` holds an open question; `text` is the tree's phrase, kept so the file reads on its own. */
export type BranchVerdict = { keep: boolean; why: string; checked?: boolean; ask?: string; text?: string };
export type BranchVerdicts = Record<string, BranchVerdict>;

export const OWNER_ASK = 'owner: discuss';

export const branchVerdicts = (data as { trees: BranchVerdicts }).trees;

type Identified = { id: string; legacyId?: string; legacyIds?: string[]; group?: { id?: string; aliases?: string[] } };

/** Every id a card answers to: its own, its old ids and its group's aliases. */
export const idsOf = (piece: Identified) => [piece.id, piece.legacyId, ...(piece.legacyIds ?? []), piece.group?.id, ...(piece.group?.aliases ?? [])].filter((id): id is string => !!id);

/** The verdict recorded under any of the card's ids. */
export const branchVerdictFor = (piece: Identified, verdicts: BranchVerdicts = branchVerdicts): BranchVerdict | undefined =>
  idsOf(piece).map(id => verdicts[id]).find(Boolean);

/** A card the owner dropped: hidden everywhere except review. A card with no verdict stays. */
export const droppedBranch = (piece: Identified, verdicts: BranchVerdicts = branchVerdicts) => branchVerdictFor(piece, verdicts)?.keep === false;

export type BranchReviewState = 'keep' | 'drop' | 'discuss' | null;

export function branchReviewState(verdict: BranchVerdict | undefined): BranchReviewState {
  if (!verdict) return null;
  if (verdict.ask) return 'discuss';
  if (!verdict.checked) return null;
  return verdict.keep ? 'keep' : 'drop';
}
