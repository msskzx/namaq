import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const utbahIbnRabiah = {
  kind: 'PERSON',
  slug: 'utbah-ibn-rabiah',
  name: 'عتبة بن ربيعة',
  nameTransliterated: 'Utbah Ibn Rabiah',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'rabiah-ibn-abd-shams', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default utbahIbnRabiah;
