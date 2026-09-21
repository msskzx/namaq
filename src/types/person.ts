import type { Person as PrismaPerson, Title } from "@/generated/prisma";
import type { ClaimWithCitations } from "@/types/provenance";
import type { BattleParticipation } from "@/types/battle";
import type { EventBase } from "@/types/event";
import type { Ayah } from "@/types/quran";
import type { Utterance } from "@/types/utterance";

export type PersonFull = PrismaPerson & {
  titles: Title[];
  events: EventBase[];
  ayat?: Ayah[];
  participations?: BattleParticipation[];
  claims?: ClaimWithCitations[];
  /** What they said, and what was said about them. */
  said?: Utterance[];
  spokenAbout?: Utterance[];
};

export interface PersonBase {
  id: string;
  slug: string;
  name: string;
  fullName?: string;
  kunya?: string;
  nameTransliterated?: string;
}

export interface PersonWithTitles extends PersonBase {
  titles: Title[];
}
