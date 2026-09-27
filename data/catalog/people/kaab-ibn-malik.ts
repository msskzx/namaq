import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. His father's kunya (Abu Ka'b) and
 * real name (Amr) are both given on his own page, per the retired
 * prisma/personSeedData12.ts entry. Several sons are named as narrators
 * from him but not modelled -- none are their own entries here.
 */
const kaabIbnMalik = {
  kind: 'PERSON',
  slug: 'kaab-ibn-malik',
  name: 'كعب بن مالك',
  nameTransliterated: 'Kaab ibn Malik',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'كعب بن مالك بن أبي كعب عمرو بن القين بن كعب بن سواد بن غنم بن كعب بن سلمة الأنصاري الخزرجي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'malik-ibn-al-qayn', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default kaabIbnMalik;
