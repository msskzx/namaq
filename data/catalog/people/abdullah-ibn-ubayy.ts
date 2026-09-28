import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const abdullahIbnUbayy = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-ubayy',
  name: 'عبد الله بن أبي',
  nameTransliterated: 'Abdullah ibn Ubayy',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'abdullah-ibn-abdullah-ibn-ubayy', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdullahIbnUbayy;
