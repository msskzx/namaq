import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData12.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. "Dhu al-Shahadatayn" (whose testimony the Prophet counted as
 * two witnesses). Son Umarah, a narrator from him, is not yet in this
 * pipeline.
 */
const khuzaymahIbnThabit = {
  kind: 'PERSON',
  slug: 'khuzaymah-ibn-thabit',
  name: 'خزيمة بن ثابت',
  nameTransliterated: 'Khuzaymah ibn Thabit',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'خزيمة بن ثابت بن الفاكه بن ثعلبة بن ساعدة الأنصاري الخطمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default khuzaymahIbnThabit;
