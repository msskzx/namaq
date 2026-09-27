import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const harithaIbnAlHarith = {
  kind: 'PERSON',
  slug: 'haritha-ibn-al-harith',
  name: 'حارثة بن الحارث',
  nameTransliterated: 'Haritha Ibn Al Harith',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'jusham-ibn-haritha', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default harithaIbnAlHarith;
