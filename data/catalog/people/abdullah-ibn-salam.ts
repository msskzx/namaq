import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. His own words, said to the Prophet before he
// asked him to put the question to the Jews of Medina.
const abdullahIbnSalam = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-salam',
  name: 'عبد الله بن سلام',
  nameTransliterated: 'Abdullah ibn Salam',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['ibn-salam/sex'] },
    virtues: {
      value: 'قال: لقد علمت يهود أني سيدهم وابن سيدهم، وأعلمهم وابن أعلمهم.',
      claims: ['ibn-salam/virtues'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default abdullahIbnSalam;
