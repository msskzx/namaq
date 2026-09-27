import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const muawwidhIbnAmrIbnAlJumuh = {
  kind: 'PERSON',
  slug: 'muawwidh-ibn-amr-ibn-al-jumuh',
  name: 'معوذ بن عمرو',
  nameTransliterated: 'Muawwidh ibn Amr ibn al-Jumuh',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'معوذ بن عمرو بن الجموح بن زيد بن حرام بن كعب بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'amr-ibn-al-jumuh', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default muawwidhIbnAmrIbnAlJumuh;
