import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData13.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Real name per al-Bukhari and others.
 */
const abuWaqidAlLaythi = {
  kind: 'PERSON',
  slug: 'abu-waqid-al-laythi',
  name: 'أبو واقد الليثي',
  nameTransliterated: 'Abu Waqid al-Laythi',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'الحارث بن عوف الليثي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuWaqidAlLaythi;
