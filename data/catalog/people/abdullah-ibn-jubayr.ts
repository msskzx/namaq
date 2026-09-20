import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * Named among the dead of Uhud, with no subject in the app until this batch
 * reached him. Nothing under prisma/ declares him, so this module is his only
 * author and catalog:project creates the row.
 */
// The archers' commander at Uhud, and the one man of the fifty who obeyed the
// order not to leave the hill. The battle turned on the others leaving it.
const abdullahIbnJubayr = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-jubayr',
  name: 'عبد الله بن جبير',
  nameTransliterated: 'Abdullah ibn Jubayr',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['ibn-jubayr/sex'] },
    virtues: {
      value:
        'أمره رسول الله صلى الله عليه وسلم على الرماة يوم أحد وهم خمسون، وقال: (لا تبرحوا) ، فثبت مكانه حتى استشهد.',
      claims: ['ibn-jubayr/uhud'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default abdullahIbnJubayr;
