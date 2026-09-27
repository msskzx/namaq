import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const amrIbnNufayl = {
  kind: 'PERSON',
  slug: 'amr-ibn-nufayl',
  name: 'عمرو بن نفيل',
  nameTransliterated: 'Amr ibn Nufayl',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'nufayl-ibn-abd-al-uzza', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default amrIbnNufayl;
