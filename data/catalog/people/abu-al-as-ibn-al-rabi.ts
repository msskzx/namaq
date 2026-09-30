import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const abuAlAsIbnAlRabi = {
  kind: 'PERSON',
  slug: 'abu-al-as-ibn-al-rabi',
  name: 'أبو العاص بن الربيع',
  nameTransliterated: 'Abu al-As ibn al-Rabi',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'أبو العاص بن الربيع بن عبد العزى بن عبد شمس بن عبد مناف بن قصي بن كلاب القرشي العبشمي',
      claims: ['abu-al-as-ibn-al-rabi-siyar69/full-name'],
    },
    virtues: {
      value: 'صهر رسول الله صلى الله عليه وسلم، زوج بنته زينب، ووالد أمامة التي كان يحملها النبي في صلاته؛ أثنى النبي عليه في مصاهرته خيرا، وقال: حدثني فصدقني، ووعدني فوفى لي؛ وكان من تجار قريش وأمنائهم.',
      claims: ['abu-al-as-ibn-al-rabi-siyar69/virtues'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'al-rabi-ibn-abd-al-uzza', claims: ['abu-al-as-ibn-al-rabi-siyar69/father'] },
    { type: 'HUSBAND', inverse: 'WIFE', to: 'zaynab-bint-muhammad', claims: ['abu-al-as-ibn-al-rabi-siyar69/zaynab-wife'] },
  ],
} satisfies CatalogPerson;

export default abuAlAsIbnAlRabi;
