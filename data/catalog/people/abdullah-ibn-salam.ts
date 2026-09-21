import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// The seed entry is retired, so this module is the author; what it held and
// no batch cites is carried below with its evidence owed. His own words,
// said to the Prophet before he asked him to put the question to the Jews of
// Medina.
const abdullahIbnSalam = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-salam',
  name: 'عبد الله بن سلام',
  nameTransliterated: 'Abdullah ibn Salam',
  hasProfile: true,
  fields: {
    // Carried from the retired seed entry, which took it from the Siyar
    // without citing it.
    fullName: { value: 'عبد الله بن سلام بن الحارث الإسرائيلي', claims: legacyUnreviewed },
    sex: { value: 'MALE', claims: ['ibn-salam/sex'] },
    virtues: {
      value: 'قال: لقد علمت يهود أني سيدهم وابن سيدهم، وأعلمهم وابن أعلمهم.',
      claims: ['ibn-salam/virtues'],
    },
  },
  titles: [
    // Carried from the retired seed entry. The seeds gave every صحابي this
    // title without citing it.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default abdullahIbnSalam;
