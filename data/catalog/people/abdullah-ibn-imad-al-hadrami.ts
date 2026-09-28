import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const abdullahIbnImadAlHadrami = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-imad-al-hadrami',
  name: 'عبد الله بن عماد',
  nameTransliterated: 'Abdullah ibn Imad Al Hadrami',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'al-ala-ibn-al-hadrami', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdullahIbnImadAlHadrami;
