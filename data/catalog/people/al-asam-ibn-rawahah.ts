import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const alAsamIbnRawahah = {
  kind: 'PERSON',
  slug: 'al-asam-ibn-rawahah',
  name: 'الأصم بن رواحة',
  nameTransliterated: 'Al Asam ibn Rawahah',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'zaidah-ibn-al-asam', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alAsamIbnRawahah;
