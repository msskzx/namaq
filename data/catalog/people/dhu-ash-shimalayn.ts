import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * One of the fourteen the sira names as the dead of Badr. He had no subject in
 * the app until this batch reached the roster, so the catalog creates him:
 * nothing under prisma/ declares him, which makes this module his only author.
 */
// Named in the roster and nowhere else in this chapter.
const dhuAshShimalayn = {
  kind: 'PERSON',
  slug: 'dhu-ash-shimalayn',
  name: 'ذو الشمالين عمير بن عبد عمرو',
  nameTransliterated: 'Dhu ash-Shimalayn',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['dhu-ash-shimalayn/sex'] },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default dhuAshShimalayn;
