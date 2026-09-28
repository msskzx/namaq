import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData2.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so the
 * link to the next ancestor stays on the legacy marker.
 */
const abiAlAsIbnUmayya = {
  kind: 'PERSON',
  slug: 'abi-al-as-ibn-umayya',
  name: 'أبي العاص بن أمية',
  nameTransliterated: 'Abi al-As ibn Umayya',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'umayya-ibn-abd-shams', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abiAlAsIbnUmayya;
