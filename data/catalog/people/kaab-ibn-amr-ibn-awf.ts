import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const kaabIbnAmrIbnAwf = {
  kind: 'PERSON',
  slug: 'kaab-ibn-amr-ibn-awf',
  name: 'كعب بن عمرو',
  nameTransliterated: 'Kaab ibn Amr ibn Awf',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'amr-ibn-awf-ibn-mabdhul', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default kaabIbnAmrIbnAwf;
