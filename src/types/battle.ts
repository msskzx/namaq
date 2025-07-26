import { PersonBase } from "./person";

export interface Battle {
  id: string;
  name: string;
  nameTransliterated: string | null;
  slug: string;
  hijriYear: number | null;
  location: string | null;
  locationEn: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

export interface BattleParticipation {
  battle: Battle;
  status: string[];
}

export interface BattleWithParticipants extends Battle {
  participations?: { person: PersonBase }[];
}