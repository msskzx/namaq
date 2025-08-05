import { prisma } from '@/lib/prisma';
import { RevelationType, RecitationType } from '@/generated/prisma'

interface AyahResponse {
  code: number;
  status: string;
  data: {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    revelationType: string;
    numberOfAyahs: number;
    ayahs: {
      number: number,
      text: string,
      numberInSurah: number,
      juz: number,
      manzil: number,
      page: number,
      ruku: number,
      hizbQuarter: number,
      sajda: boolean | { id: number; recommended: boolean; obligatory: boolean; }
    }[];
  };
}

async function seedSurahs() {
  await prisma.ayah.deleteMany();
  for (let i = 1; i <= 114; i++) {
    const response = await fetch(`https://api.alquran.cloud/v1/surah/${i}/ar.hafs`);
    const data: AyahResponse = await response.json();
    if (data.code === 200) {
      const surah = data.data;
      const surahRecord = await prisma.surah.findFirst({ where: { number: surah.number } });
      const ayat = surah.ayahs;

      await prisma.$transaction(
        ayat.map((ayah) => {
          const sajda = ayah.sajda;
          const isSajda = typeof sajda === 'boolean' ? sajda : true;
          const sajdaRecommended = typeof sajda === 'object' ? sajda.recommended : null;
          const sajdaObligatory = typeof sajda === 'object' ? sajda.obligatory : null;

          return prisma.ayah.create({
            data: {
              surahId: surahRecord?.id!,
              globalNumber: ayah.number,
              text: ayah.text,
              number: ayah.numberInSurah,
              juz: ayah.juz,
              manzil: ayah.manzil,
              page: ayah.page,
              ruku: ayah.ruku,
              hizbQuarter: ayah.hizbQuarter,
              sajda: isSajda,
              sajdaRecommended: sajdaRecommended,
              sajdaObligatory: sajdaObligatory,
              recitation: RecitationType.HAFS,
              revelationType: surah.revelationType as RevelationType,
            }
          });
        })
      );
      console.log(`Created ${ayat.length} ayahs for Surah ${data.data.number}`);
    } else {
      console.error(`Failed to fetch Surah ${i}: ${data.status}`);
    }
  }
}

seedSurahs();