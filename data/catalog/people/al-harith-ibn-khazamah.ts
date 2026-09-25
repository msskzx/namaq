import type { CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/iyas-ibn-al-bukayr, entry 18: the
// Siyar names him only as Iyas's pact-brother, with no subject of his own
// anywhere in the app until now.
const alHarithIbnKhazamah = {
  kind: 'PERSON',
  slug: 'al-harith-ibn-khazamah',
  name: 'الحارث بن خزمة',
  nameTransliterated: 'al-Harith ibn Khazamah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['al-harith-khazamah-siyar18/sex'] },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default alHarithIbnKhazamah;
