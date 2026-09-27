import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const qaisIbnAdiAlSahmi = {
  kind: 'PERSON',
  slug: 'qais-ibn-adi-al-sahmi',
  name: 'قيس بن عدي',
  nameTransliterated: 'Qais ibn Adi Al Sahmi',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'hudhafah-ibn-qais-al-sahmi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default qaisIbnAdiAlSahmi;
