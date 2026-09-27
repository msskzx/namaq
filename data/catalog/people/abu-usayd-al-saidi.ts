import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData13.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Sons al-Mundhir, Hamzah, and al-Zubayr, narrators from him, are
 * not yet in this pipeline.
 */
const abuUsaydAlSaidi = {
  kind: 'PERSON',
  slug: 'abu-usayd-al-saidi',
  name: 'أبو أسيد الساعدي',
  nameTransliterated: 'Abu Usayd al-Saidi',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'مالك بن ربيعة بن البدن الأنصاري الساعدي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuUsaydAlSaidi;
