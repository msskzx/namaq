import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const amrIbnMalik = {
  kind: 'PERSON',
  slug: 'amr-ibn-malik',
  name: 'عمرو بن مالك',
  nameTransliterated: 'Amr ibn Malik',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'malik-ibn-al-najjar', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default amrIbnMalik;
