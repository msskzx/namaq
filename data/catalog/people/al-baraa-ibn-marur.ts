import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry is retired, so this module is the author; what it held and
// no batch cites is carried below with its evidence owed. He is the one who
// said ابسط يدك يا رسول الله نبايعك at the second Aqaba, and his was the
// first hand.
const alBaraaIbnMarur = {
  kind: 'PERSON',
  slug: 'al-baraa-ibn-marur',
  name: 'البراء بن معرور',
  nameTransliterated: 'Al-Baraa ibn Marur',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: {
      value: 'البراء بن معرور بن صخر بن خنساء بن سنان الأنصاري الخزرجي السلمي',
      claims: legacyUnreviewed,
    },
    sex: { value: 'MALE', claims: ['al-baraa/sex'] },
    virtues: {
      value:
        'أحد نقباء العقبة، وهو أول من بايع النبي صلى الله عليه وسلم ليلة العقبة، وكان كبير الشأن.',
      claims: ['al-baraa/first-to-pledge'],
    },
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
    { type: 'SON', inverse: 'FATHER', to: 'marur-ibn-sakhr', claims: legacyUnreviewed },
    { type: 'FATHER', inverse: 'SON', to: 'bishr-ibn-al-baraa', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default alBaraaIbnMarur;
