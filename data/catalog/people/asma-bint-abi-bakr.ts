import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// ذات النطاقين is earned in this chapter, not merely reported: she cut her
// waistband to tie the provisions for the hijra. The seed entry is retired, so
// this module is the author; what it held and no batch cites is carried below
// with its evidence owed.
const asmaBintAbiBakr = {
  kind: 'PERSON',
  slug: 'asma-bint-abi-bakr',
  name: 'أسماء بنت أبي بكر',
  nameTransliterated: 'Asma bint Abi Bakr',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: {
      value: 'أسماء بنت أبي بكر عبد الله بن أبي قحافة عثمان بن عامر القرشية التيمية',
      claims: legacyUnreviewed,
    },
    sex: { value: 'FEMALE', claims: ['asma/sex'] },
  },
  titles: [
    { title: 'dhat-an-nitaqayn', claims: ['asma/dhat-an-nitaqayn'] },
    // Carried from the retired seed entry. The seeds gave every صحابي this
    // title without citing it.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    // Carried from neo4j/graphSeedData*.ts, which stated these ties without
    // citing them. The catalog owns this subject's edges now, so they live
    // here or not at all.
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abu-bakr-as-siddiq', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default asmaBintAbiBakr;
