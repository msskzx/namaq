import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abiUmayyahIbnAlMughirah = {
  kind: 'PERSON',
  slug: 'abi-umayyah-ibn-al-mughirah',
  name: 'أبو أمية بن المغيرة',
  nameTransliterated: 'Abi Umayyah Ibn Al Mughirah',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-mughirah-ibn-abdullah-ibn-umar', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abiUmayyahIbnAlMughirah;
