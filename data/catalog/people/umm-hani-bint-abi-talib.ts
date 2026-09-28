import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Given name Fakhitah per the retired prisma/personSeedData10.ts entry.
 * Her husband's name is given inconsistently between that entry's two
 * sources ("Hubayrah ibn Amr ibn Aidh al-Makhzumi" vs "Hubayrah ibn Abi
 * Wahb") -- not modelled here pending a check against the raw page. Well
 * known for the "we grant protection to whoever you protect" hadith at the
 * conquest of Mecca.
 */
const ummHaniBintAbiTalib = {
  kind: 'PERSON',
  slug: 'umm-hani-bint-abi-talib',
  name: 'أم هانئ',
  nameTransliterated: 'Umm Hani bint Abi Talib',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'أم هانئ فاختة بنت أبي طالب عبد مناف بن عبد المطلب بن هاشم القرشية الهاشمية',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abu-talib', claims: legacyUnreviewed },
    { type: 'DAUGHTER', inverse: 'MOTHER', to: 'fatimah-bint-asad', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ummHaniBintAbiTalib;
