import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Confirmed by the retired prisma/personSeedData6.ts entry as a companion
 * (two hijras -- Abyssinia then Medina -- martyred at Yarmouk alongside his
 * brothers Khalid and Aban above), distinct from the much later Umayyad
 * governor "Amr ibn Sa'id al-Ashdaq".
 */
const amrIbnSaidAlUmawi = {
  kind: 'PERSON',
  slug: 'amr-ibn-said-al-umawi',
  name: 'عمرو بن سعيد الأموي',
  nameTransliterated: 'Amr ibn Said al-Umawi',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عمرو بن سعيد بن العاص بن أمية بن عبد شمس بن عبد مناف بن قصي القرشي الأموي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'said-ibn-al-as', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default amrIbnSaidAlUmawi;
