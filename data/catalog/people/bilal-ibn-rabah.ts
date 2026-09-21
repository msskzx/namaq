import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry is retired, so this module is the author; what it held and
// no batch cites is carried below with its evidence owed. أحد أحد is what
// the chapter records of him, and it records it in the middle of the roster
// of the seven rather than in an entry of his own.
const bilalIbnRabah = {
  kind: 'PERSON',
  slug: 'bilal-ibn-rabah',
  name: 'بلال بن رباح',
  nameTransliterated: 'Bilal ibn Rabah',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: { value: 'بلال بن رباح', claims: legacyUnreviewed },
    virtues: {
      value: 'هانت عليه نفسه في الله، فكان يعذب في شعاب مكة وهو يقول: أحد أحد.',
      claims: ['bilal/ahad', 'bilal/persecution'],
    },
  },
  titles: [
    // Carried from the retired seed entry. The seeds gave every صحابي this
    // title without citing it.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default bilalIbnRabah;
