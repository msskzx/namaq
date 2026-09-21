import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry is retired, so this module is the author; what it held and
// no batch cites is carried below with its evidence owed. Thuwaybah nursed
// him with the Prophet and with Hamzah, which is the one thing these
// chapters say about him outside the emigration rosters.
const abuSalamah = {
  kind: 'PERSON',
  slug: 'abu-salamah',
  name: 'أبو سلمة بن عبد الأسد',
  nameTransliterated: 'Abu Salamah ibn Abd al-Asad',
  hasProfile: true,
  fields: {},
  titles: [
    // Carried from the retired seed entry. The seeds gave every صحابي this
    // title without citing it.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    // Carried from neo4j/graphSeedData*.ts, which stated these ties without
    // citing them. The catalog owns this subject's edges now, so they live
    // here or not at all.
    { type: 'SON', inverse: 'FATHER', to: 'abd-al-asad-ibn-hilal', claims: legacyUnreviewed },
    { type: 'SON', inverse: 'MOTHER', to: 'barrah-bint-abd-al-muttalib', claims: legacyUnreviewed },
    {
      type: 'MILK_BROTHER',
      inverse: 'MILK_BROTHER',
      to: 'prophet-muhammad',
      claims: ['abu-salamah/rida-thuwaybah'],
    },
  ],
} satisfies CatalogPerson;

export default abuSalamah;
