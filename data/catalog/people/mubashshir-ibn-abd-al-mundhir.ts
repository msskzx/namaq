import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * One of the fourteen the sira names as the dead of Badr. He had no subject in
 * the app until this batch reached the roster, so the catalog creates him:
 * nothing under prisma/ declares him, which makes this module his only author.
 */
// Abu Lubabah's brother, which is how the roster identifies him. Abu Lubabah
// was turned back from Badr and given a share; this brother died in it.
const mubashshirIbnAbdAlMundhir = {
  kind: 'PERSON',
  slug: 'mubashshir-ibn-abd-al-mundhir',
  name: 'مبشر بن عبد المنذر',
  nameTransliterated: 'Mubashshir ibn Abd al-Mundhir',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['mubashshir/sex'] },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default mubashshirIbnAbdAlMundhir;
