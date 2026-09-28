import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * A third, distinct "Umm Kulthum" in this pipeline (not Muhammad's daughter,
 * not Ali's daughter), of Banu Umayyah. Her maternal link to al-Bayda bint
 * Abd al-Muttalib is cross-referenced from al-Bayda's own retired
 * prisma/personSeedData10.ts entry, not stated on this one. A third marriage
 * to Amr ibn al-As is noted in that entry but not modelled -- he is not yet
 * a node in this pipeline.
 */
const ummKulthumBintUqbah = {
  kind: 'PERSON',
  slug: 'umm-kulthum-bint-uqbah',
  name: 'أم كلثوم بنت عقبة',
  nameTransliterated: 'Umm Kulthum bint Uqbah',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: {
      value: 'أم كلثوم بنت عقبة بن أبي معيط بن أبان بن ذكوان بن أمية بن عبد شمس القرشية الأموية',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'uqba-ibn-abi-muayt', claims: legacyUnreviewed },
    { type: 'DAUGHTER', inverse: 'MOTHER', to: 'al-bayda-bint-abd-al-muttalib', claims: legacyUnreviewed },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'zaid-ibn-harithah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ummKulthumBintUqbah;
