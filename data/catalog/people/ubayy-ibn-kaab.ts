import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const ubayyIbnKaab = {
  kind: 'PERSON',
  slug: 'ubayy-ibn-kaab',
  name: 'أبي بن كعب',
  nameTransliterated: 'Ubayy ibn Kaab',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'kaab-ibn-qais', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ubayyIbnKaab;
