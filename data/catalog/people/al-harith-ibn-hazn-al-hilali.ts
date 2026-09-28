import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const alHarithIbnHaznAlHilali = {
  kind: 'PERSON',
  slug: 'al-harith-ibn-hazn-al-hilali',
  name: 'الحارث بن حزن',
  nameTransliterated: 'Al Harith ibn Hazn Al Hilali',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'DAUGHTER', to: 'maymunah-bint-al-harith', claims: legacyUnreviewed },
    { type: 'FATHER', inverse: 'DAUGHTER', to: 'umm-al-fadl-bint-al-harith', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alHarithIbnHaznAlHilali;
