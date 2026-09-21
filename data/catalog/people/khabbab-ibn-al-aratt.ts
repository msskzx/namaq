import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. The roster of the first believers is where
// this chapter places him, and by his حلف rather than by a nasab.
const khabbabIbnAlAratt = {
  kind: 'PERSON',
  slug: 'khabbab-ibn-al-aratt',
  name: 'خباب بن الأرت',
  nameTransliterated: 'Khabbab ibn al-Aratt',
  hasProfile: true,
  fields: {
    tribalAffiliation: { value: 'حليف بني زهرة', claims: ['khabbab/hilf'] },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default khabbabIbnAlAratt;
