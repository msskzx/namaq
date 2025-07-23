import type { Person as PrismaPerson, PersonRelation as PrismaPersonRelation, Title as PrismaTitle } from "@/generated/prisma";
import type { BattleParticipation } from "@/types/battle";

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
  titles: PrismaTitle[];
  ayat?: Ayah[];
  participations?: BattleParticipation[];
}; 

export type PersonWithTitles = PrismaPerson & {
  titles: PrismaTitle[];
};