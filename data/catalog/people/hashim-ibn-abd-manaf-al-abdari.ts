import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const hashimIbnAbdManafAlAbdari = {
  kind: 'PERSON',
  slug: 'hashim-ibn-abd-manaf-al-abdari',
  name: 'هاشم بن عبد مناف',
  nameTransliterated: 'Hashim ibn Abd Manaf Al Abdari',
  hasProfile: false,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-manaf-ibn-abd-al-dar', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default hashimIbnAbdManafAlAbdari;
