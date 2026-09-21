import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. Thuwaybah nursed him with the Prophet and with
// Hamzah, which is the one thing these chapters say about him outside the
// emigration rosters.
const abuSalamah = {
  kind: 'PERSON',
  slug: 'abu-salamah',
  name: 'أبو سلمة بن عبد الأسد',
  nameTransliterated: 'Abu Salamah ibn Abd al-Asad',
  hasProfile: true,
  fields: {},
  titles: [],
  relations: [
    { type: 'MILK_BROTHER', inverse: 'MILK_BROTHER', to: 'prophet-muhammad', claims: ['abu-salamah/rida-thuwaybah'] },
  ],
} satisfies CatalogPerson;

export default abuSalamah;
