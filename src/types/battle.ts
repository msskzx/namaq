export interface Battle {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
  hijri_year: number | null;
  location: string | null;
  locationEn: string | null;
}

export interface BattleParticipation {
  battle: Battle;
  status: string[];
}
