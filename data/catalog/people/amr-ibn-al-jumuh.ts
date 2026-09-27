import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Father of Mu'adh, Mu'awwidh and Khallad ibn Amr ibn al-Jumuh -- a companion
 * in his own right per the retired prisma/personSeedData6.ts entry (fought
 * and was killed at Uhud), not merely a father-only entry.
 */
const amrIbnAlJumuh = {
  kind: 'PERSON',
  slug: 'amr-ibn-al-jumuh',
  name: 'عمرو بن الجموح',
  nameTransliterated: 'Amr ibn al-Jumuh',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عمرو بن الجموح بن زيد بن حرام بن كعب بن غنم بن كعب بن سلمة الأنصاري الخزرجي السلمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-jumuh-ibn-zayd', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default amrIbnAlJumuh;
