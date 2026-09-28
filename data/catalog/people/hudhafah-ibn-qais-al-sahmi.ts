import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const hudhafahIbnQaisAlSahmi = {
  kind: 'PERSON',
  slug: 'hudhafah-ibn-qais-al-sahmi',
  name: 'حذافة بن قيس',
  nameTransliterated: 'Hudhafah ibn Qais Al Sahmi',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'qais-ibn-adi-al-sahmi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default hudhafahIbnQaisAlSahmi;
