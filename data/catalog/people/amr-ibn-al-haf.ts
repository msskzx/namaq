import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const amrIbnAlHaf = {
  kind: 'PERSON',
  slug: 'amr-ibn-al-haf',
  name: 'عمرو بن الحاف',
  nameTransliterated: 'Amr ibn Al Haf',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-haf-ibn-qudaah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default amrIbnAlHaf;
