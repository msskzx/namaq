import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const maanIbnAdi = {
  kind: 'PERSON',
  slug: 'maan-ibn-adi',
  name: 'معن بن عدي',
  nameTransliterated: 'Maan ibn Adi',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'معن بن عدي بن الجد بن العجلان الأنصاري حليف بني مالك بن عوف',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'adi-ibn-al-jidd', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default maanIbnAdi;
