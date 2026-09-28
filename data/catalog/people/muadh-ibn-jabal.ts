import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const muadhIbnJabal = {
  kind: 'PERSON',
  slug: 'muadh-ibn-jabal',
  name: 'معاذ بن جبل',
  nameTransliterated: 'Muadh ibn Jabal',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'معاذ بن جبل بن عمرو بن أوس بن عائذ بن عدي بن كعب بن عمرو بن عدي بن سعد بن علي بن أسد بن ساردة بن يزيد بن جشم بن الخزرج الأنصاري الخزرجي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'jabal-ibn-amr', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default muadhIbnJabal;
