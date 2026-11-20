import type { AdhkarOccasion } from '@shared/adhkar';

/** A search hit's link to one adhkar card: the utilities open on the adhkar, at its tab and card (Utilities reads it). */
export const adhkarHref = (occasion: AdhkarOccasion, id: string) => `/utilities?adhkar=${occasion}&id=${encodeURIComponent(id)}`;
