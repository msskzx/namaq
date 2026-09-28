import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const aqilIbnAbiTalib = {
  kind: 'PERSON',
  slug: 'aqil-ibn-abi-talib',
  name: 'عقيل بن أبي طالب',
  nameTransliterated: 'Aqil ibn Abi Talib',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عقيل بن أبي طالب عبد مناف بن عبد المطلب بن هاشم بن عبد مناف بن قصي القرشي الهاشمي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abu-talib', claims: legacyUnreviewed },
    { type: 'BROTHER', inverse: 'BROTHER', to: 'jaafar-ibn-abi-talib', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default aqilIbnAbiTalib;
