import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const zamahIbnQaisAlAmiri = {
  kind: 'PERSON',
  slug: 'zamah-ibn-qais-al-amiri',
  name: 'زمعة بن قيس',
  nameTransliterated: 'Zamah ibn Qais Al Amiri',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'DAUGHTER', to: 'sawdah-bint-zamah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default zamahIbnQaisAlAmiri;
