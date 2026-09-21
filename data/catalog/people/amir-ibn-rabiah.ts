import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. His حلف is with a household rather than a
// clan, آل الخطاب, and the value keeps the source's wording.
const amirIbnRabiah = {
  kind: 'PERSON',
  slug: 'amir-ibn-rabiah',
  name: 'عامر بن ربيعة',
  nameTransliterated: 'Amir ibn Rabiah',
  hasProfile: true,
  fields: {
    tribalAffiliation: { value: 'حليف آل الخطاب', claims: ['amir-ibn-rabiah/hilf'] },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default amirIbnRabiah;
