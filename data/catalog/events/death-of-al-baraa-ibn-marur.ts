import type { CatalogEvent } from '@/lib/catalog/types';

// One of the twelve naqibs, and the first hand to take the Prophet's at the
// second Aqaba. He died in the first year, before Badr.
const deathOfAlBaraaIbnMarur = {
  kind: 'EVENT',
  slug: 'death-of-al-baraa-ibn-marur',
  name: 'وفاة البراء بن معرور',
  nameTransliterated: 'The Death of al-Baraa ibn Marur',
  type: 'DEATH',
  fields: {
    hijriYear: { value: 1, claims: ['al-baraa/death'] },
    description: {
      value: 'مات البراء بن معرور السلمي، أحد نقباء العقبة، وهو أول من بايع النبي صلى الله عليه وسلم ليلة العقبة، وكان كبير الشأن.',
      claims: ['al-baraa/death', 'al-baraa/first-to-pledge'],
    },
  },
  people: [{ person: 'al-baraa-ibn-marur', claims: ['al-baraa/death'] }],
} satisfies CatalogEvent;

export default deathOfAlBaraaIbnMarur;
