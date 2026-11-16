import { ORDER_AIMS, type Aim } from './surahOrder';

/** The early-surah subset of the shared order quotations, also used by the reader topics. */
export const EARLY_AIMS: Record<number, Aim> = Object.fromEntries(
  Object.entries(ORDER_AIMS).filter(([surah]) => Number(surah) < 41),
);

export const surahAim = (surah: number): Aim | undefined => ORDER_AIMS[surah];
