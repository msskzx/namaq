import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const alHarithIbnZayd = {
  kind: 'PERSON',
  slug: 'al-harith-ibn-zayd',
  name: 'الحارث بن زيد',
  nameTransliterated: 'Al Harith Ibn Zayd',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'imru-al-qays-ibn-al-harith', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alHarithIbnZayd;
