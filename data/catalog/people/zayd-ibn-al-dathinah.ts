import type { CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/khalid-ibn-al-bukayr, entry 17: the
// Siyar names him only as Khalid's pact-brother, with no subject of his own
// anywhere in the app until now.
const zaydIbnAlDathinah = {
  kind: 'PERSON',
  slug: 'zayd-ibn-al-dathinah',
  name: 'زيد بن الدثنة',
  nameTransliterated: 'Zayd ibn al-Dathinah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['zayd-dathinah-siyar17/sex'] },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default zaydIbnAlDathinah;
