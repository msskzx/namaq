import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const ummHaniBintAbiTalib = {
  kind: 'PERSON',
  slug: 'umm-hani-bint-abi-talib',
  name: 'أم هانئ',
  nameTransliterated: 'Umm Hani bint Abi Talib',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abu-talib', claims: legacyUnreviewed },
    { type: 'DAUGHTER', inverse: 'MOTHER', to: 'fatimah-bint-asad', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ummHaniBintAbiTalib;
