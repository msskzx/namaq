import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const asmaBintAlNumanAlKindiyyah = {
  kind: 'PERSON',
  slug: 'asma-bint-al-numan-al-kindiyyah',
  name: 'أسماء بنت النعمان',
  nameTransliterated: 'Asma bint al-Numan al-Kindiyyah',
  hasProfile: true,
  fields: {
    fullName: { value: 'أسماء بنت النعمان بن أبي الجون الكندي', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'al-numan-ibn-abi-al-jawn-al-kindi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default asmaBintAlNumanAlKindiyyah;
