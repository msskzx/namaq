import { ORDER_AIMS, type Aim } from './surahOrder';

export const EARLY_AIMS: Record<number, Aim> = Object.fromEntries(
  Object.entries(ORDER_AIMS).filter(([surah]) => Number(surah) < 41),
);

export const surahAim = (surah: number): Aim | undefined => ORDER_AIMS[surah];
