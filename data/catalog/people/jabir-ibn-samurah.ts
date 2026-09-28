import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData15.ts entry. Distinct
 * lineage from samurah-ibn-jundub (his own father, Samurah ibn Junadah, is
 * a different person of the same first name, unrelated tribe) -- no
 * ancestor node modelled for either father.
 */
const jabirIbnSamurah = {
  kind: 'PERSON',
  slug: 'jabir-ibn-samurah',
  name: 'جابر بن سمرة',
  nameTransliterated: 'Jabir ibn Samurah',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'جابر بن سمرة بن جنادة بن جندب السوائي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default jabirIbnSamurah;
