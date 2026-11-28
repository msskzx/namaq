import dataFile from '../data/quran/branchVerdicts.json';
import twinData from '../data/quran/twinVerdicts.json';
import { dataOf } from '../appData';

const data = dataOf(dataFile);

export type BranchVerdict = { keep: boolean; why: string; checked?: boolean; ask?: string; view?: 'matrix'; ayat?: 'own' | 'two'; same?: string; without?: string[] };
export type BranchVerdicts = Record<string, BranchVerdict>;

export type TwinVerdict = { pair: string; keep: boolean; why: string; checked?: boolean; ask?: string; view?: 'matrix' };
export type TwinVerdicts = Record<string, TwinVerdict>;

export const OWNER_ASK = 'owner: discuss';

export const branchVerdicts = (data as { trees: BranchVerdicts }).trees;
export const withoutLeftOut = <T extends { key: string }>(id: string, occurrences: T[]): T[] => {
  const without = branchVerdicts[id]?.without;
  return without ? occurrences.filter(occurrence => !without.includes(occurrence.key)) : occurrences;
};
export const twinVerdicts = (twinData as { twins: TwinVerdicts }).twins;

type Identified = { id: string; legacyId?: string; legacyIds?: string[]; group?: { id?: string; aliases?: string[] }; phrase?: { occurrences: { start: number; end: number }[] } };

export const idsOf = (piece: Identified) => [piece.id, piece.legacyId, ...(piece.legacyIds ?? []), piece.group?.id, ...(piece.group?.aliases ?? [])].filter((id): id is string => !!id);

export const twinOf = (piece: Identified, twins: TwinVerdicts = twinVerdicts): TwinVerdict | undefined => idsOf(piece).map(id => twins[id]).find(Boolean);

export function branchVerdictFor(piece: Identified, verdicts: BranchVerdicts = branchVerdicts, twins: TwinVerdicts = verdicts === branchVerdicts ? twinVerdicts : {}): BranchVerdict | undefined {
  const own = idsOf(piece).map(id => verdicts[id]).find(Boolean);
  const twin = own?.same ? undefined : twinOf(piece, twins);
  if (!twin) return own;
  const { keep, why, checked, ask, view } = twin;
  return { keep, why, ...(checked ? { checked } : {}), ...(ask ? { ask } : {}), ...(view ? { view } : {}), ...(own?.ayat ? { ayat: own.ayat } : {}) };
}

export const droppedBranch = (piece: Identified, verdicts: BranchVerdicts = branchVerdicts) => branchVerdictFor(piece, verdicts)?.keep === false;

export const matrixOnly = (piece: Identified, verdicts: BranchVerdicts = branchVerdicts) => {
  if (piece.phrase?.occurrences.length && piece.phrase.occurrences.every(occurrence => occurrence.end <= occurrence.start)) return true;
  const verdict = branchVerdictFor(piece, verdicts);
  return verdict?.keep === true && verdict.view === 'matrix';
};

export const ownAyatOnly = (piece: Identified, verdicts: BranchVerdicts = branchVerdicts) => branchVerdictFor(piece, verdicts)?.ayat === 'own';

export const twoAyat = (piece: Identified, verdicts: BranchVerdicts = branchVerdicts) => branchVerdictFor(piece, verdicts)?.ayat === 'two';

export type BranchReviewState = 'keep' | 'drop' | 'discuss' | null;

export function branchReviewState(verdict: BranchVerdict | undefined): BranchReviewState {
  if (!verdict) return null;
  if (verdict.ask) return 'discuss';
  if (!verdict.checked) return null;
  return verdict.keep ? 'keep' : 'drop';
}
