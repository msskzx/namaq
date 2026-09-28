import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. Given name Ramlah per the retired
 * prisma/personSeedData9.ts entry; "Umm Habibah" is her kunya.
 */
const ummHabibah = {
  kind: 'PERSON',
  slug: 'umm-habibah',
  name: 'أم حبيبة',
  nameTransliterated: 'Umm Habibah',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: {
      value: 'رملة بنت أبي سفيان صخر بن حرب بن أمية بن عبد شمس بن عبد مناف بن قصي القرشية الأموية',
      claims: legacyUnreviewed,
    },
    // Carried from the retired prisma/personSeedData.ts entry, uncited.
    virtues: {
      value: 'أم المؤمنين، ابنة أبي سفيان، هاجرت إلى الحبشة، تزوجها النبي وهي هناك.',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
    { title: 'mother-of-believers', name: 'أم المؤمنين', nameTransliterated: 'Mother of the Believers', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abu-sufyan-ibn-harb', claims: legacyUnreviewed },
    { type: 'DAUGHTER', inverse: 'MOTHER', to: 'hind-bint-utbah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ummHabibah;
