import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const utbahIbnGhazwan = {
  kind: 'PERSON',
  slug: 'utbah-ibn-ghazwan',
  name: 'عتبة بن غزوان',
  nameTransliterated: 'Utbah ibn Ghazwan',
  hasProfile: true,
  fields: {
    fullName: { value: 'عتبة بن غزوان بن جابر بن وهيب المازني حليف بني عبد شمس', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'ghazwan-ibn-jabir', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default utbahIbnGhazwan;
