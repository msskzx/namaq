import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const khubaybIbnAdi = {
  kind: 'PERSON',
  slug: 'khubayb-ibn-adi',
  name: 'خبيب بن عدي',
  nameTransliterated: 'Khubayb ibn Adi',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'خبيب بن عدي بن عامر بن مجدعة بن جحجبى الأنصاري',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'adi-ibn-amir', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default khubaybIbnAdi;
