import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Sister of the companion al-Ashath ibn Qais (same father) per the retired
 * prisma/personSeedData10.ts entry. Per that entry, the Prophet married her
 * when the Kindah delegation arrived (10 AH) but died before she reached
 * him; an alternate report says she apostatized instead.
 */
const qutaylahBintQaisAlKindiyyah = {
  kind: 'PERSON',
  slug: 'qutaylah-bint-qais-al-kindiyyah',
  name: 'قتيلة',
  nameTransliterated: 'Qutaylah bint Qais al-Kindiyyah',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: { value: 'قتيلة بنت قيس بن معدي كرب الكندية', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'qais-ibn-muadikarib-al-kindi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default qutaylahBintQaisAlKindiyyah;
