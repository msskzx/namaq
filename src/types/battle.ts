export interface Battle {
  id: string;
  name: string;
  nameEn: string | null;
  slug: string;
  hijri_year: number | null;
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
  participations?: { person: { slug: string; name: string; nameAr?: string } }[];
}