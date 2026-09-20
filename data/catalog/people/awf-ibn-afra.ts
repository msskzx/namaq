import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * One of the fourteen the sira names as the dead of Badr. He had no subject in
 * the app until this batch reached the roster, so the catalog creates him:
 * nothing under prisma/ declares him, which makes this module his only author.
 */
// One of the two sons of Afra. He fell before his brother.
const awfIbnAfra = {
  kind: 'PERSON',
  slug: 'awf-ibn-afra',
  name: 'عوف بن عفراء',
  nameTransliterated: 'Awf ibn Afra',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['awf-afra/sex'] },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default awfIbnAfra;
