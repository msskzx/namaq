import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const abbadIbnBishr = {
  kind: 'PERSON',
  slug: 'abbad-ibn-bishr',
  name: 'عباد بن بشر',
  nameTransliterated: 'Abbad ibn Bishr',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عباد بن بشر بن وقش بن زغبة بن زعوراء بن عبد الأشهل الأنصاري الأوسي الأشهلي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'bishr-ibn-waqsh', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abbadIbnBishr;
