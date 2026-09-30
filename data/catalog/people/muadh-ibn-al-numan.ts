import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all.
 */
const muadhIbnAlNuman = {
  kind: 'PERSON',
  slug: 'muadh-ibn-al-numan',
  name: 'معاذ بن النعمان',
  nameTransliterated: 'Muadh ibn Al Numan',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: ['muadh-ibn-al-numan-siyar56/sex'] },
  },
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-numan-ibn-imri-al-qays', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default muadhIbnAlNuman;
