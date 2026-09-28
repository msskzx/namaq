import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. fullName and the companion title
 * are carried from the retired prisma/personSeedData14.ts entry. Called
 * "ibn amm al-Nabi" on his own page (a shared-Quraysh-ancestor kinsman via
 * Abd Manaf, not a first cousin) -- not modelled as a direct relation.
 */
const jubairIbnMutim = {
  kind: 'PERSON',
  slug: 'jubair-ibn-mutim',
  name: 'جبير بن مطعم',
  nameTransliterated: 'Jubair ibn Mutim',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'جبير بن مطعم بن عدي بن نوفل بن عبد مناف بن قصي القرشي النوفلي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'mutim-ibn-adi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default jubairIbnMutim;
