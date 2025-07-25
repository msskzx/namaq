import { Event as PrismaEvent, EventType, Battle } from "@/generated/prisma";

  export type EventInput = {
    type: string;
    hijriYear?: string | null;
    gregorianYear?: string | null;
    hijriDate?: string | null;
    description: string;
    descriptionTransliterated?: string | null;
    location?: string | null;
    locationTransliterated?: string | null;
    metadata?: JSON;
    battleSlug?: string;
    personSlugs?: string[];
  };
  
  export type Event = PrismaEvent & {
    type: EventType;
    battle?: Battle;
    personSlugs?: string[];
  };
  