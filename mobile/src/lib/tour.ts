import type { BranchPiece } from '@shared/quran/branchInventory';
import { tourPieceIn } from '@shared/quran/tour';
import { treeList } from './branches';

export { TOUR_AYAH, TOUR_PAGE, TOUR_TREE } from '@shared/quran/tour';

/** The steps after the opening: tap a node, swipe the matrix, pick the view, reveal an ayah. */
export const TOUR_STEPS = ['tree', 'matrix', 'view', 'recite'] as const;
export type TourStep = 'opening' | (typeof TOUR_STEPS)[number];

export const tourPiece = (): BranchPiece | undefined => tourPieceIn(treeList());
