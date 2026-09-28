import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData15.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker. Son Sulayman, a narrator from him, is not yet in this pipeline.
 */
const samurahIbnJundub = {
  kind: 'PERSON',
  slug: 'samurah-ibn-jundub',
  name: 'سمرة بن جندب',
  nameTransliterated: 'Samurah ibn Jundub',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'سمرة بن جندب بن هلال الفزاري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default samurahIbnJundub;
