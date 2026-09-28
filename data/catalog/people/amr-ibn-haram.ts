import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const amrIbnHaram = {
  kind: 'PERSON',
  slug: 'amr-ibn-haram',
  name: 'عمرو بن حرام',
  nameTransliterated: 'Amr ibn Haram',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'haram-ibn-thalabah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default amrIbnHaram;
