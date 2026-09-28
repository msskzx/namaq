import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData11.ts entry. His paternal
 * uncle Iyad ibn Zuhayr al-Fihri (a major Badri companion per the same
 * page) is not yet in this pipeline, so no relation is modelled.
 */
const iyadIbnGhanm = {
  kind: 'PERSON',
  slug: 'iyad-ibn-ghanm',
  name: 'عياض بن غنم',
  nameTransliterated: 'Iyad ibn Ghanm',
  hasProfile: true,
  fields: {
    fullName: { value: 'عياض بن غنم بن زهير بن أبي شداد الفهري', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default iyadIbnGhanm;
