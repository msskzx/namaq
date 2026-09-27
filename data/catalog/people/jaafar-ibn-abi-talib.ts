import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const jaafarIbnAbiTalib = {
  kind: 'PERSON',
  slug: 'jaafar-ibn-abi-talib',
  name: 'جعفر بن أبي طالب',
  nameTransliterated: 'Jaafar ibn Abi Talib',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abu-talib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default jaafarIbnAbiTalib;
