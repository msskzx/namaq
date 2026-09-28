import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const saadIbnKhaythamah = {
  kind: 'PERSON',
  slug: 'saad-ibn-khaythamah',
  name: 'سعد بن خيثمة',
  nameTransliterated: 'Saad ibn Khaythamah',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'سعد بن خيثمة بن الحارث بن مالك بن كعب الأنصاري الأوسي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'khaythamah-ibn-al-harith', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default saadIbnKhaythamah;
