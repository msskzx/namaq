import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Brother of Abdullah ibn Masud (shared father) per the retired
 * prisma/personSeedData7.ts entry.
 */
const utbahIbnMasudAlHudhali = {
  kind: 'PERSON',
  slug: 'utbah-ibn-masud-al-hudhali',
  name: 'عتبة بن مسعود الهذلي',
  nameTransliterated: 'Utbah ibn Masud al-Hudhali',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عتبة بن مسعود بن غافل بن حبيب بن شمخ بن فار بن مخزوم بن صاهلة بن كاهل بن الحارث بن تميم بن سعد بن هذيل الهذلي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'masud-ibn-ghafil', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default utbahIbnMasudAlHudhali;
