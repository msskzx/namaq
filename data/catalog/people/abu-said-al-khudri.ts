import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abuSaidAlKhudri = {
  kind: 'PERSON',
  slug: 'abu-said-al-khudri',
  name: 'أبو سعيد الخدري',
  nameTransliterated: 'Abu Said al-Khudri',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'BROTHER', inverse: 'BROTHER', to: 'qatadah-ibn-al-numan', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abuSaidAlKhudri;
