import { RecitationType, RevelationType } from "@/generated/prisma";

export interface Surah {
  id: string;
  number: number;
  name: string;
  nameTransliterated: string | null;
  nameTranslated: string | null;
  revelationType: RevelationType | null;
  numberOfAyat: number;
  recitation: RecitationType | null;
  revelationPeriod: string | null;
  revelationOrder: number | null;
  page: number;
  createdAt: Date;
  updatedAt: Date;
  ayat: Ayah[];
}

export interface Ayah {
  id: string;
  surahId: string;
  number: number;
  text: string;
  globalNumber: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
  sajdaRecommended: boolean | null;
  sajdaObligatory: boolean | null;
  recitation: RecitationType | null;
  revelationOrder: number | null;
  revelationPeriod: string | null;
  revelationType: RevelationType | null;
  createdAt: Date;
  updatedAt: Date;
  surah?: {
    id: string;
    number: number;
    name: string;
    nameTransliterated: string | null;
    nameTranslated: string | null;
    revelationType: RevelationType | null;
    numberOfAyat: number;
    recitation: RecitationType | null;
    revelationPeriod: string | null;
    revelationOrder: number | null;
  };
}