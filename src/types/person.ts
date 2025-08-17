import type { Person as PrismaPerson, Title } from "@/generated/prisma";
import type { BattleParticipation } from "@/types/battle";
import type { EventWithBattle } from "@/types/event";
import type { Ayah } from "@/types/quran";

export type PersonFull = PrismaPerson & {
  titles: Title[];
  events: EventWithBattle[];
  ayat?: Ayah[];
  participations?: BattleParticipation[];
};

export interface PersonBase {
  id: string;
  slug: string;
  name: string;
  fullName?: string;
  nameTransliterated?: string;
}

export interface PersonWithTitles extends PersonBase {
  titles: Title[];
}