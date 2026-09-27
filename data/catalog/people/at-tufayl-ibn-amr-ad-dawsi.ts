import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const atTufaylIbnAmrAdDawsi = {
  kind: 'PERSON',
  slug: 'at-tufayl-ibn-amr-ad-dawsi',
  name: 'الطفيل بن عمرو الدوسي',
  nameTransliterated: 'At-Tufayl ibn Amr ad-Dawsi',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'amr-ibn-tarif', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default atTufaylIbnAmrAdDawsi;
