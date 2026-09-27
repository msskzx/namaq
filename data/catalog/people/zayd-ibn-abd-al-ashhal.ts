import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const zaydIbnAbdAlAshhal = {
  kind: 'PERSON',
  slug: 'zayd-ibn-abd-al-ashhal',
  name: 'زيد بن عبد الأشهل',
  nameTransliterated: 'Zayd Ibn Abd Al Ashhal',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'imru-al-qays-ibn-zayd', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default zaydIbnAbdAlAshhal;
