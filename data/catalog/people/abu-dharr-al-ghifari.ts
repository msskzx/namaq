import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. The chapter gives his Islam at length in two
// narrations; what the model has a place for is his own count of where he
// stood in it and the greeting he was first to give.
const abuDharrAlGhifari = {
  kind: 'PERSON',
  slug: 'abu-dharr-al-ghifari',
  name: 'أبو ذر الغفاري',
  nameTransliterated: 'Abu Dharr al-Ghifari',
  hasProfile: true,
  fields: {
    virtues: {
      value:
        'قال: كنت ربع الإسلام، أسلم قبل ثلاثة نفر. وكان أول من حيَّا النبي صلى الله عليه وسلم بتحية الإسلام.',
      claims: ['abu-dharr/rubu-al-islam'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default abuDharrAlGhifari;
