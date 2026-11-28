import type { BranchPiece } from '@shared/quran/branchInventory';
import { tourPieceIn } from '@shared/quran/tour';
import { treeList } from './branches';

export { TOUR_AYAH, TOUR_TREE } from '@shared/quran/tour';

export const TOUR_STEPS = ['matrix', 'tree', 'timeline', 'recite'] as const;

export const RECITE_PAGE = 604;
export const RECITE_AYAH = '112:1';
export type TourStep = 'opening' | (typeof TOUR_STEPS)[number];

export const tourPiece = (): BranchPiece | undefined => tourPieceIn(treeList());
