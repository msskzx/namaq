import type { Person as PrismaPerson, PersonRelation as PrismaPersonRelation, Title } from "@/generated/prisma";
import type { BattleParticipation } from "@/types/battle";
import type { EventWithBattle } from "@/types/event";

export interface Ayah {
  surah: number;
  ayah: number;
  text?: string;
}

export type RelationFrom = PrismaPersonRelation & { to: PrismaPerson };
export type RelationTo = PrismaPersonRelation & { from: PrismaPerson };

export type Person = PrismaPerson & {
  relationsFrom: RelationFrom[];
  relationsTo: RelationTo[];
  titles: Title[];
  events: EventWithBattle[];
  ayat?: Ayah[];
  participations?: BattleParticipation[];
};

export type PersonWithTitles = PrismaPerson & {
  titles: Title[];
};

export type PersonBase = {
  id: string;
  slug: string;
  name: string;
  nameTransliterated?: string;
}