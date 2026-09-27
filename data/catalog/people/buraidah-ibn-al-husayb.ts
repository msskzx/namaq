import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData12.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Sons Sulayman and Abdullah, narrators from him, are not yet in
 * this pipeline.
 */
const buraidahIbnAlHusayb = {
  kind: 'PERSON',
  slug: 'buraidah-ibn-al-husayb',
  name: 'بريدة بن الحصيب',
  nameTransliterated: 'Buraidah ibn al-Husayb',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'بريدة بن الحصيب بن عبد الله بن الحارث بن الأعرج بن سعد الأسلمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default buraidahIbnAlHusayb;
