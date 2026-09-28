import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData15.ts entry. Distinct from
 * jundub-ibn-abdullah-al-bajali -- see that entry's note. His own page
 * gives an alternate name "Jundub ibn Kaab".
 */
const jundubAlAzdi = {
  kind: 'PERSON',
  slug: 'jundub-al-azdi',
  name: 'جندب الأزدي',
  nameTransliterated: 'Jundub al-Azdi',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'جندب بن عبد الله الأزدي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default jundubAlAzdi;
