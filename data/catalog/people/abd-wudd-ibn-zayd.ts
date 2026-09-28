import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const abdWuddIbnZayd = {
  kind: 'PERSON',
  slug: 'abd-wudd-ibn-zayd',
  name: 'عبد ود بن زيد',
  nameTransliterated: 'Abd Wudd ibn Zayd',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'lawdhan-ibn-abd-wudd', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdWuddIbnZayd;
