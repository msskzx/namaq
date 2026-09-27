import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData14.ts entry. Freed
 * slave/client of the Prophet, bought and freed by him. Father's name
 * disputed (Jahdar or Bajdad, per his own page) -- the first is used.
 */
const thawbanAlNabawi = {
  kind: 'PERSON',
  slug: 'thawban-al-nabawi',
  name: 'ثوبان',
  nameTransliterated: 'Thawban al-Nabawi',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'ثوبان بن جحدر',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default thawbanAlNabawi;
