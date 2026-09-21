import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. أحد أحد is what the chapter records of him, and
// it records it in the middle of the roster of the seven rather than in an
// entry of his own.
const bilalIbnRabah = {
  kind: 'PERSON',
  slug: 'bilal-ibn-rabah',
  name: 'بلال بن رباح',
  nameTransliterated: 'Bilal ibn Rabah',
  hasProfile: true,
  fields: {
    virtues: {
      value: 'هانت عليه نفسه في الله، فكان يعذب في شعاب مكة وهو يقول: أحد أحد.',
      claims: ['bilal/ahad', 'bilal/persecution'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default bilalIbnRabah;
