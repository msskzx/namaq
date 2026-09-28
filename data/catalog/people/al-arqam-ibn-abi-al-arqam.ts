import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 *
 * "Abu al-Arqam" is a kunya, not his real name, per the retired
 * prisma/personSeedData12.ts entry -- his own page gives his father's real
 * name as Abd Manaf.
 */
const alArqamIbnAbiAlArqam = {
  kind: 'PERSON',
  slug: 'al-arqam-ibn-abi-al-arqam',
  name: 'الأرقم بن أبي الأرقم',
  nameTransliterated: 'Al-Arqam ibn Abi al-Arqam',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'الأرقم بن عبد مناف بن أسد بن عبد الله بن عمر بن مخزوم بن يقظة المخزومي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-manaf-ibn-asad-al-makhzumi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alArqamIbnAbiAlArqam;
