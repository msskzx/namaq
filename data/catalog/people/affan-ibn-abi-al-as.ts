import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData2.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so the
 * link to the next ancestor stays on the legacy marker.
 */
const affanIbnAbiAlAs = {
  kind: 'PERSON',
  slug: 'affan-ibn-abi-al-as',
  name: 'عفان بن أبي العاص',
  nameTransliterated: 'Affan ibn Abi al-As',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abi-al-as-ibn-umayya', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default affanIbnAbiAlAs;
