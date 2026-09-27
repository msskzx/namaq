import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData14.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Sons Sad, Muhammad, Abd al-Malik, and Rabi, narrators from him,
 * are not yet in this pipeline.
 */
const kaabIbnUjrah = {
  kind: 'PERSON',
  slug: 'kaab-ibn-ujrah',
  name: 'كعب بن عجرة',
  nameTransliterated: 'Kaab ibn Ujrah',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'كعب بن عجرة الأنصاري السالمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default kaabIbnUjrah;
