import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. Chapter five already has him at Uhud; this is
// where he enters Islam, and the chapter frames it by what changed for the
// Prophet rather than by anything Hamzah said afterwards.
const hamzahIbnAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'hamzah-ibn-abd-al-muttalib',
  name: 'حمزة بن عبد المطلب',
  nameTransliterated: 'Hamzah ibn Abd al-Muttalib',
  hasProfile: true,
  fields: {
    virtues: {
      value:
        'كان أعز فتى في قريش وأشده شكيمة، فلما أسلم عرفت قريش أن رسول الله صلى الله عليه وسلم قد عز وامتنع.',
      claims: ['hamzah/virtues-islam'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default hamzahIbnAbdAlMuttalib;
