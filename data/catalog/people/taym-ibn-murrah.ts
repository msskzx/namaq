import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData2.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so the
 * link to the next ancestor stays on the legacy marker.
 */
const taymIbnMurrah = {
  kind: 'PERSON',
  slug: 'taym-ibn-murrah',
  name: 'تيم بن مرة',
  nameTransliterated: 'Taym ibn Murrah',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'murrah-ibn-kaab', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default taymIbnMurrah;
