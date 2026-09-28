import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData2.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so the
 * link to the next ancestor stays on the legacy marker.
 */
const kaabIbnSaad = {
  kind: 'PERSON',
  slug: 'kaab-ibn-saad',
  name: 'كعب بن سعد',
  nameTransliterated: 'Kaab ibn Saad',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'saad-ibn-taym', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default kaabIbnSaad;
