import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker. His FATHER edge (abu-bakr-as-
 * siddiq.ts) is already declared from the other side. Explicitly "shaqiq"
 * (full sibling) of Aisha on his own page per the retired
 * prisma/personSeedData12.ts entry. Son Abdullah, daughter Hafsah, and
 * nephew al-Qasim ibn Muhammad are not yet in this pipeline.
 */
const abdAlRahmanIbnAbiBakr = {
  kind: 'PERSON',
  slug: 'abd-al-rahman-ibn-abi-bakr',
  name: 'عبد الرحمن بن أبي بكر',
  nameTransliterated: 'Abd al-Rahman ibn Abi Bakr',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: { value: 'عبد الرحمن بن أبي بكر الصديق', claims: legacyUnreviewed },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'BROTHER', inverse: 'SISTER', to: 'aisha-bint-abi-bakr', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default abdAlRahmanIbnAbiBakr;
