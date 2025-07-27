import { Event as PrismaEvent, EventType, Battle } from "@/generated/prisma";
import { PersonBase } from "./person";
import { ArticleBase } from "./article";
import { CategoryBase } from "./category";

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
}

export type EventWithBattle = EventBase & {
  battle: Battle | null,
}

export type EventAll = PrismaEvent & {
  battle: Battle,
  people: PersonBase[],
  articles: ArticleBase[],
  categories: CategoryBase[],
}