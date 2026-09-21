import { PersonBase } from "./person";
import type { Utterance } from "./utterance";

export interface BattleBase {
  id: string;
  name: string;
  nameTransliterated: string | null;
  slug: string;
  hijriYear: number | null;
  hijriPeriod: string | null;
  location: string | null;
  locationEn: string | null;
}

/** Keys of Battle the counts panel reads; see README, "What is implemented". */
export const BATTLE_COUNTS = [
  'muslimForceCount',
  'nonMuslimForceCount',
  'muslimDeathCount',
  'nonMuslimDeathCount',
] as const;
export type BattleCount = (typeof BATTLE_COUNTS)[number];

export interface Battle extends BattleBase, Partial<Record<BattleCount, number | null>> {
  description: string | null;
  /** GHAZWAH, SARIYYAH or BATTLE; the vocabulary lives in src/lib/catalog/types.ts. */
  engagement?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  participations?: { person: PersonBase }[];
  utterances?: Utterance[];
}

export interface BattleParticipation {
  battle: BattleBase;
  /** PARTICIPATED_IN or ABSENT_FROM: see docs/battle-participation-model.md. */
  relation: string;
  status: string[];
  /** What the person did there, in the source's own wording. */
  summary: string | null;
}
