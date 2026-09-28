import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. Brothers Abu Ruhm and Abu Burdah,
 * paternal uncle Abu Amir al-Ashari, and son Abu Burdah ibn Abi Musa are
 * not yet their own entries in this pipeline, per the retired
 * prisma/personSeedData11.ts entry.
 */
const abuMusaAlAshari = {
  kind: 'PERSON',
  slug: 'abu-musa-al-ashari',
  name: 'أبو موسى الأشعري',
  nameTransliterated: 'Abu Musa al-Ashari',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: { value: 'عبد الله بن قيس بن سليم بن حضار بن حرب الأشعري', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'MOTHER', to: 'zabyah-bint-wahb', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abuMusaAlAshari;
