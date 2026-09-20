import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * One of the fourteen the sira names as the dead of Badr. He had no subject in
 * the app until this batch reached the roster, so the catalog creates him:
 * nothing under prisma/ declares him, which makes this module his only author.
 */
// The roster calls him فُسحُم.
const yazidIbnAlHarith = {
  kind: 'PERSON',
  slug: 'yazid-ibn-al-harith',
  name: 'يزيد بن الحارث',
  nameTransliterated: 'Yazid ibn al-Harith',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['yazid-harith/sex'] },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default yazidIbnAlHarith;
