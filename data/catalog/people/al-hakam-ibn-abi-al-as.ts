import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * Marginal companion status per the retired prisma/personSeedData8.ts entry:
 * his own page frames him as "من مسلمة الفتح" (converted at the Conquest of
 * Mecca) with "له أدنى نصيب من الصحبة" (the slightest share of
 * companionship) -- the Prophet reportedly exiled him to Ta'if, recalled to
 * Medina under Uthman. Kept as a companion per the book's own explicit
 * "من الصحبة" wording, same precedent as umamah-bint-abi-al-as. His son
 * Marwan (the future Umayyad caliph) is a tabi'i, not in scope here.
 */
const alHakamIbnAbiAlAs = {
  kind: 'PERSON',
  slug: 'al-hakam-ibn-abi-al-as',
  name: 'الحكم بن أبي العاص',
  nameTransliterated: 'Al-Hakam ibn Abi al-As',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'الحكم بن أبي العاص بن أمية بن عبد شمس القرشي الأموي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abi-al-as-ibn-umayya', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alHakamIbnAbiAlAs;
