import type { BranchPiece } from '@shared/quran/branchInventory';
import { treeList } from './branches';

/** The steps after the opening: tap a node, swipe the matrix, pick the view, reveal an ayah. */
export const TOUR_STEPS = ['tree', 'matrix', 'view', 'recite'] as const;
export type TourStep = 'opening' | (typeof TOUR_STEPS)[number];

/** The tree the tour grows: «إن المتقين في», six ayat in six surahs, small enough for one phone screen. */
export const TOUR_TREE = 'إِنَّ ٱلْمُتَّقِينَ فِى';
/** Where the tour's recitation starts: the first ayah of that tree, in al-Hijr. */
export const TOUR_AYAH = '15:45';
/** The mushaf page that ayah starts on. */
export const TOUR_PAGE = 264;

export const tourPiece = (): BranchPiece | undefined => treeList().find(piece => piece.text === TOUR_TREE);
