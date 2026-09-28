import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const kulthumIbnAlHidm = {
  kind: 'PERSON',
  slug: 'kulthum-ibn-al-hidm',
  name: 'كلثوم بن الهدم',
  nameTransliterated: 'Kulthum ibn al-Hidm',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'كلثوم بن الهدم بن امرئ القيس بن الحارث بن زيد الأنصاري الأوسي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-hidm-ibn-imri-al-qays', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default kulthumIbnAlHidm;
