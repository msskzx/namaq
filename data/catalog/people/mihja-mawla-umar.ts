import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * One of the fourteen the sira names as the dead of Badr. He had no subject in
 * the app until this batch reached the roster, so the catalog creates him:
 * nothing under prisma/ declares him, which makes this module his only author.
 */
// The first man killed in Islam, by the chapter's own words. He and Harithah
// are the two of the fourteen whose deaths it narrates rather than lists.
const mihjaMawlaUmar = {
  kind: 'PERSON',
  slug: 'mihja-mawla-umar',
  name: 'مِهْجَع مولى عمر',
  nameTransliterated: 'Mihja, mawla of Umar',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['mihja/sex'] },
    virtues: {
      value:
        'أول قتيل في سبيل الله، رمي بسهم يوم بدر.',
      claims: ['mihja/badr'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default mihjaMawlaUmar;
