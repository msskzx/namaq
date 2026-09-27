import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const qutaylahBintQaisAlKindiyyah = {
  kind: 'PERSON',
  slug: 'qutaylah-bint-qais-al-kindiyyah',
  name: 'قتيلة',
  nameTransliterated: 'Qutaylah bint Qais al-Kindiyyah',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'qais-ibn-muadikarib-al-kindi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default qutaylahBintQaisAlKindiyyah;
