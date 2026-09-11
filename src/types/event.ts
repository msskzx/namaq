import { Event as PrismaEvent, EventType } from "@/generated/prisma";
import { PersonBase } from "./person";

export type EventBase = {
  id: string,
  name: string,
  nameTransliterated?: string,
  slug: string,
  type: EventType,
  hijriYear: number,
  hijriPeriod: string,
  gregorianYear: number,
  gregorianPeriod: string,
  location?: string,
  locationTransliterated?: string,
  description?: string,
  descriptionTransliterated?: string,
}

export type EventAll = PrismaEvent & {
  people: PersonBase[],
}