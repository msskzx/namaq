import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * One of the fourteen the sira names as the dead of Badr. He had no subject in
 * the app until this batch reached the roster, so the catalog creates him:
 * nothing under prisma/ declares him, which makes this module his only author.
 */
// Shot while drinking at the cistern, which is how the chapter has him die.
const harithahIbnSuraqah = {
  kind: 'PERSON',
  slug: 'harithah-ibn-suraqah',
  name: 'حارثة بن سراقة',
  nameTransliterated: 'Harithah ibn Suraqah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['harithah/sex'] },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default harithahIbnSuraqah;
