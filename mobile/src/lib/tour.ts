import type { BranchPiece } from '@shared/quran/branchInventory';
import { tourPieceIn } from '@shared/quran/tour';
import { treeList } from './branches';

export { TOUR_AYAH, TOUR_TREE } from '@shared/quran/tour';

/** The steps after the opening: the matrix, the same ayat as a tree, pick the view, a prophet's story, recite. */
export const TOUR_STEPS = ['matrix', 'tree', 'view', 'timeline', 'recite'] as const;

/** The tour recites the last mushaf page: al-Ikhlas, al-Falaq and an-Nas, short surahs everyone knows. */
export const RECITE_PAGE = 604;
export const RECITE_AYAH = '112:1';
export type TourStep = 'opening' | (typeof TOUR_STEPS)[number];

export const tourPiece = (): BranchPiece | undefined => tourPieceIn(treeList());
