import type { CatalogEvent } from '@/lib/catalog/types';

const saqifahBaniSaidah = {
  kind: 'EVENT',
  slug: 'saqifah-bani-saidah',
  name: 'سقيفة بني ساعدة',
  nameTransliterated: 'Saqifah Bani Saidah',
  type: 'OTHER',
  fields: {
    // The passage places it at the Prophet's death, which
    // prisma/eventSeedData.ts records as 11 AH; the entry states no year itself.
    hijriYear: { value: 11, claims: ['abu-ubaydah/saqifah-nomination'] },
    description: {
      value: 'وَقَالَ أَبُو بَكْرٍ الصِّدِّيْقُ وَقْتَ وَفَاةِ رَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بِسَقِيْفَةِ بَنِي سَاعِدَةَ: قَدْ رَضِيْتُ لَكُم أَحَدَ هَذَيْنِ الرَّجُلَيْنِ: عُمَرَ، وَأَبَا عُبَيْدَةَ.',
      claims: ['abu-ubaydah/saqifah-nomination'],
    },
  },
  people: [{ person: 'abu-ubaydah-ibn-al-jarrah', claims: ['abu-ubaydah/saqifah-nomination'] }],
} satisfies CatalogEvent;

export default saqifahBaniSaidah;
