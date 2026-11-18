import data from '../data/quran/branchVerdicts.json';
import twinData from '../data/quran/twinVerdicts.json';

/**
 * The owner's verdict on one branches card. `ask` holds an open question. The tree's words are not kept here: the id names the tree, the pages hold its words.
 * `view: 'matrix'` keeps the card as its matrix only: the tree is dropped (no tree view, no tree quiz).
 * `ayat: 'own'`: each of its rows reads its own ayah only, not grown on into the next (the owner's call for one card, not the rule).
 * `ayat: 'two'`: each matrix row reads two ayat, its own and the next, so the rows match in depth (the tree is drawn as it is).
 * `same`: hidden on branches only because the card it names already shows these ayat; a twin's compare verdict does not undo it.
 */
export type BranchVerdict = { keep: boolean; why: string; checked?: boolean; ask?: string; view?: 'matrix'; ayat?: 'own' | 'two'; same?: string };
export type BranchVerdicts = Record<string, BranchVerdict>;

/**
 * A twin: a branches card of exactly two ayat that is also a compare card of the same two ayat. It has one verdict, the compare pair's
 * (`pair`, "a|b" as comparePairs.json keys it), copied here by `npm run quran:compare-cards` so the app need not ship the compare verdicts.
 */
export type TwinVerdict = { pair: string; keep: boolean; why: string; checked?: boolean; ask?: string; view?: 'matrix' };
export type TwinVerdicts = Record<string, TwinVerdict>;

export const OWNER_ASK = 'owner: discuss';

export const branchVerdicts = (data as { trees: BranchVerdicts }).trees;
export const twinVerdicts = (twinData as { twins: TwinVerdicts }).twins;

type Identified = { id: string; legacyId?: string; legacyIds?: string[]; group?: { id?: string; aliases?: string[] } };

/** Every id a card answers to: its own, its old ids and its group's aliases. */
export const idsOf = (piece: Identified) => [piece.id, piece.legacyId, ...(piece.legacyIds ?? []), piece.group?.id, ...(piece.group?.aliases ?? [])].filter((id): id is string => !!id);

/** The compare twin of a card, if it has one. */
export const twinOf = (piece: Identified, twins: TwinVerdicts = twinVerdicts): TwinVerdict | undefined => idsOf(piece).map(id => twins[id]).find(Boolean);

/**
 * The verdict recorded under any of the card's ids. A twin reads its compare pair's verdict (keep, why, checked, ask, view); only
 * the branches-only parts stay its own: `ayat`, and `same`, which hides it here whatever compare says.
 */
export function branchVerdictFor(piece: Identified, verdicts: BranchVerdicts = branchVerdicts, twins: TwinVerdicts = verdicts === branchVerdicts ? twinVerdicts : {}): BranchVerdict | undefined {
  const own = idsOf(piece).map(id => verdicts[id]).find(Boolean);
  const twin = own?.same ? undefined : twinOf(piece, twins);
  if (!twin) return own;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- the pair is left out on purpose
  const { pair: _pair, ...shared } = twin;
  return { ...shared, ...(own?.ayat ? { ayat: own.ayat } : {}) };
}

/** A card the owner dropped: hidden everywhere except review. A card with no verdict stays. */
export const droppedBranch = (piece: Identified, verdicts: BranchVerdicts = branchVerdicts) => branchVerdictFor(piece, verdicts)?.keep === false;

/** A card the owner keeps as its matrix only: the tree view and the tree quiz leave it out. */
export const matrixOnly = (piece: Identified, verdicts: BranchVerdicts = branchVerdicts) => {
  const verdict = branchVerdictFor(piece, verdicts);
  return verdict?.keep === true && verdict.view === 'matrix';
};

/** A card whose rows the owner keeps to their own ayat: the ayah after each is not read on. */
export const ownAyatOnly = (piece: Identified, verdicts: BranchVerdicts = branchVerdicts) => branchVerdictFor(piece, verdicts)?.ayat === 'own';

/** A card whose rows the owner keeps two ayat deep, each ayah read on into the one after it, so the rows match in depth. */
export const twoAyat = (piece: Identified, verdicts: BranchVerdicts = branchVerdicts) => branchVerdictFor(piece, verdicts)?.ayat === 'two';

export type BranchReviewState = 'keep' | 'drop' | 'discuss' | null;

export function branchReviewState(verdict: BranchVerdict | undefined): BranchReviewState {
  if (!verdict) return null;
  if (verdict.ask) return 'discuss';
  if (!verdict.checked) return null;
  return verdict.keep ? 'keep' : 'drop';
}
