import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from neo4j/graphSeedData*.ts, whose node declaration is retired
 * with the rest. The catalog owns this subject's edges now, so they live
 * here or not at all. No batch has read this far into the nasab yet, so
 * every link stays on the legacy marker.
 */
const alArqamIbnAbiAlArqam = {
  kind: 'PERSON',
  slug: 'al-arqam-ibn-abi-al-arqam',
  name: 'الأرقم بن أبي الأرقم',
  nameTransliterated: 'Al-Arqam ibn Abi al-Arqam',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'abd-manaf-ibn-asad-al-makhzumi', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alArqamIbnAbiAlArqam;
