import { PersonBase } from "./person";

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

export interface Battle extends BattleBase {
  description: string | null;
  latitude?: number | null;
  longitude?: number | null;
  participations?: { person: PersonBase }[];
}

export interface BattleParticipation {
  battle: BattleBase;
  status: string[];
  courage: string;
}
