import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. Every relation touching him is already cited from the
 * other side; this restates the same evidence from his own file so his
 * node has an author too.
 */
const alHarithIbnAbiDirarAlMustaliqi = {
  kind: 'PERSON',
  slug: 'al-harith-ibn-abi-dirar-al-mustaliqi',
  name: 'الحارث بن أبي ضرار',
  nameTransliterated: 'Al Harith ibn Abi Dirar Al Mustaliqi',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'FATHER', inverse: 'DAUGHTER', to: 'juwayriyah-bint-al-harith', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alHarithIbnAbiDirarAlMustaliqi;
