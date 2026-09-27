import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const yalaIbnUmayyah = {
  kind: 'PERSON',
  slug: 'yala-ibn-umayyah',
  name: 'يعلى بن أمية',
  nameTransliterated: 'Yala ibn Umayyah',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'MOTHER', to: 'munyah-bint-ghazwan', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default yalaIbnUmayyah;
