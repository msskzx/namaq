import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * NOT a paternal aunt of the Prophet -- daughter of Abu Lahab ibn Abd
 * al-Muttalib per the retired prisma/personSeedData10.ts entry, making her
 * a first cousin and niece of Atikah bint Abd al-Muttalib.
 */
const durrahBintAbiLahab = {
  kind: 'PERSON',
  slug: 'durrah-bint-abi-lahab',
  name: 'درة بنت أبي لهب',
  nameTransliterated: 'Durrah bint Abi Lahab',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: { value: 'درة بنت أبي لهب بن عبد المطلب القرشية الهاشمية', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abu-lahab-ibn-abd-al-muttalib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default durrahBintAbiLahab;
