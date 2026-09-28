import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData2.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so the
 * link to the next ancestor stays on the legacy marker.
 */
const abdShamsIbnAbdManaf = {
  kind: 'PERSON',
  slug: 'abd-shams-ibn-abd-manaf',
  name: 'عبد شمس بن عبد مناف',
  nameTransliterated: 'Abd Shams ibn Abd Manaf',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-manaf-ibn-qusay', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdShamsIbnAbdManaf;
