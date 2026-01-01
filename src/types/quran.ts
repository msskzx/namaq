import { Surah as PrismaSurah, Ayah as PrismaAyah } from "@/generated/prisma";

export type Surah = PrismaSurah;

export type Ayah = PrismaAyah & {
  surah: Surah;
};

