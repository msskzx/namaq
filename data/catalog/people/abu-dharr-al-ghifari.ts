import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry is retired, so this module is the author; what it held and
// no batch cites is carried below with its evidence owed. The chapter gives
// his Islam at length in two narrations; what the model has a place for is
// his own count of where he stood in it and the greeting he was first to
// give.
const abuDharrAlGhifari = {
  kind: 'PERSON',
  slug: 'abu-dharr-al-ghifari',
  name: 'أبو ذر الغفاري',
  nameTransliterated: 'Abu Dharr al-Ghifari',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: { value: 'جندب بن جنادة الغفاري', claims: legacyUnreviewed },
    virtues: {
      value:
        'قال: كنت ربع الإسلام، أسلم قبل ثلاثة نفر. وكان أول من حيَّا النبي صلى الله عليه وسلم بتحية الإسلام.',
      claims: ['abu-dharr/rubu-al-islam'],
    },
  },
  titles: [
    // Carried from the retired seed entry. The seeds gave every صحابي this
    // title without citing it.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abuDharrAlGhifari;
