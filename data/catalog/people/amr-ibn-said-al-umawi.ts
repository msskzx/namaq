import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const amrIbnSaidAlUmawi = {
  kind: 'PERSON',
  slug: 'amr-ibn-said-al-umawi',
  name: 'عمرو بن سعيد الأموي',
  nameTransliterated: 'Amr ibn Said al-Umawi',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'said-ibn-al-as', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default amrIbnSaidAlUmawi;
