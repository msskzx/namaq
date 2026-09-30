import { type CatalogPerson } from '@/lib/catalog/types';

// Named only as "حكيم" in data/history/batches/khawlah-bint-hakim's entry,
// with nothing else to identify him — not linked to hakim-ibn-hizam.ts,
// a different, unrelated companion the source gives no reason to conflate
// him with. Exists only to carry his daughter's nasab edge.
const hakimAbuKhawlah = {
  kind: 'PERSON',
  slug: 'hakim-abu-khawlah',
  name: 'حكيم',
  nameTransliterated: 'Hakim',
  hasProfile: false,
  fields: {
    sex: { value: 'MALE', claims: ['khawlah-bint-hakim-siyar38/full-name'] },
  },
  titles: [],
  relations: [
    {
      type: 'FATHER',
      inverse: 'DAUGHTER',
      to: 'khawlah-bint-hakim',
      claims: ['khawlah-bint-hakim-siyar38/full-name'],
    },
  ],
} satisfies CatalogPerson;

export default hakimAbuKhawlah;
