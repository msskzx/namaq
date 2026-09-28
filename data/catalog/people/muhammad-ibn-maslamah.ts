import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const muhammadIbnMaslamah = {
  kind: 'PERSON',
  slug: 'muhammad-ibn-maslamah',
  name: 'محمد بن مسلمة',
  nameTransliterated: 'Muhammad ibn Maslamah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'محمد بن سلمة بن خالد بن عدي بن مجدعة الأنصاري الحارثي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'PATERNAL_COUSIN', inverse: 'PATERNAL_COUSIN', to: 'salamah-ibn-salamah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default muhammadIbnMaslamah;
