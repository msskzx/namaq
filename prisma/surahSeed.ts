import { prisma } from '@/lib/prisma';
import { RevelationType, RecitationType } from '@/generated/prisma'

interface SurahResponse {
    code: number;
    status: string;
    data: {
        number: number;
        name: string;
        englishName: string;
        englishNameTranslation: string;
        revelationType: string;
        numberOfAyahs: number;
    }[];
}

async function seedSurahs() {
  // delete all surahs
  await prisma.surah.deleteMany();
    
  const response = await fetch('https://api.alquran.cloud/v1/surah');
        const data: SurahResponse = await response.json();

        if (data.code === 200) {
            const surahs = data.data;
            await prisma.$transaction(
                surahs.map((surah) => 
                    prisma.surah.create({
                        data: {
                            name: surah.name,
                            nameTransliterated: surah.englishName,
                            nameTranslated: surah.englishNameTranslation,
                            number: surah.number,
                            numberOfAyat: surah.numberOfAyahs,
                            revelationType: surah.revelationType as RevelationType,
                            recitation: RecitationType.HAFS
                        }
                    })
                )
            );
        }
}

seedSurahs(); 