import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. He is the one who said ابسط يدك يا رسول الله
// نبايعك at the second Aqaba, and his was the first hand.
const alBaraaIbnMarur = {
  kind: 'PERSON',
  slug: 'al-baraa-ibn-marur',
  name: 'البراء بن معرور',
  nameTransliterated: 'Al-Baraa ibn Marur',
  hasProfile: true,
  fields: {
    virtues: {
      value: 'أحد نقباء العقبة، وهو أول من بايع النبي صلى الله عليه وسلم ليلة العقبة، وكان كبير الشأن.',
      claims: ['al-baraa/first-to-pledge'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default alBaraaIbnMarur;
