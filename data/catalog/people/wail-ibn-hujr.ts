import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData13.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Sons Alqamah and Abd al-Jabbar, narrators from him, are not yet
 * in this pipeline.
 */
const wailIbnHujr = {
  kind: 'PERSON',
  slug: 'wail-ibn-hujr',
  name: 'وائل بن حجر',
  nameTransliterated: 'Wail ibn Hujr',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'وائل بن حجر بن سعد الحضرمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default wailIbnHujr;
