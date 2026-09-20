import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * One of the fourteen the sira names as the dead of Badr. He had no subject in
 * the app until this batch reached the roster, so the catalog creates him:
 * nothing under prisma/ declares him, which makes this module his only author.
 */
// Sa'd's brother, which is how the roster identifies him.
const umayrIbnAbiWaqqas = {
  kind: 'PERSON',
  slug: 'umayr-ibn-abi-waqqas',
  name: 'عمير بن أبي وقاص',
  nameTransliterated: 'Umayr ibn Abi Waqqas',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['umayr-waqqas/sex'] },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default umayrIbnAbiWaqqas;
