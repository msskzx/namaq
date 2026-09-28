import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const alJiddIbnAlAjlan = {
  kind: 'PERSON',
  slug: 'al-jidd-ibn-al-ajlan',
  name: 'الجد بن العجلان',
  nameTransliterated: 'Al Jidd ibn Al Ajlan',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'SON', to: 'adi-ibn-al-jidd', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alJiddIbnAlAjlan;
