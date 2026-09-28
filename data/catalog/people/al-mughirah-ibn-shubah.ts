import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData14.ts entry. No batch has
 * read this far into the nasab yet, so every value stays on the legacy
 * marker.
 */
const alMughirahIbnShubah = {
  kind: 'PERSON',
  slug: 'al-mughirah-ibn-shubah',
  name: 'المغيرة بن شعبة',
  nameTransliterated: 'Al-Mughirah ibn Shubah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'المغيرة بن شعبة بن أبي عامر بن مسعود بن معتب الثقفي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default alMughirahIbnShubah;
