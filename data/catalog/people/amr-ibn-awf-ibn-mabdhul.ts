import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const amrIbnAwfIbnMabdhul = {
  kind: 'PERSON',
  slug: 'amr-ibn-awf-ibn-mabdhul',
  name: 'عمرو بن عوف',
  nameTransliterated: 'Amr Ibn Awf Ibn Mabdhul',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'awf-ibn-mabdhul', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default amrIbnAwfIbnMabdhul;
