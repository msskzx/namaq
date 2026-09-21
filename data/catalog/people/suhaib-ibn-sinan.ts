import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry is retired, so this module is the author; what it held and
// no batch cites is carried below with its evidence owed. The roster gives
// him both a nisba and a حلف in one breath, النمري حليف بني تميم, which is
// how the value reads here.
const suhaibIbnSinan = {
  kind: 'PERSON',
  slug: 'suhaib-ibn-sinan',
  name: 'صهيب بن سنان',
  nameTransliterated: 'Suhayb ibn Sinan',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: {
      value: 'صهيب بن سنان بن مالك بن عبد عمرو بن عقيل بن عامر النمري',
      claims: legacyUnreviewed,
    },
    tribalAffiliation: { value: 'النمري حليف بني تميم', claims: ['suhayb/hilf'] },
  },
  titles: [
    // Carried from the retired seed entry. The seeds gave every صحابي this
    // title without citing it.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    // Carried from neo4j/graphSeedData*.ts, which stated these ties without
    // citing them. The catalog owns this subject's edges now, so they live
    // here or not at all.
    { type: 'SON', inverse: 'FATHER', to: 'sinan-ibn-malik-al-namri', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default suhaibIbnSinan;
