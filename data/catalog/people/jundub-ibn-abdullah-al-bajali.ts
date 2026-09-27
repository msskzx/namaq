import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData15.ts entry. Distinct from
 * jundub-al-azdi despite the similar name -- al-Dhahabi documents both,
 * disambiguated by tribe (Bajali vs Azdi).
 */
const jundubIbnAbdullahAlBajali = {
  kind: 'PERSON',
  slug: 'jundub-ibn-abdullah-al-bajali',
  name: 'جندب',
  nameTransliterated: 'Jundub ibn Abdullah al-Bajali',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'جندب بن عبد الله بن سفيان البجلي العلقي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default jundubIbnAbdullahAlBajali;
