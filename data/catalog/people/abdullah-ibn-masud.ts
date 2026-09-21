import type { CatalogPerson } from '@/lib/catalog/types';

// Seed-declared, so additive. The chapter puts him in the first believers as a
// boy herding sheep, and ends the story with what he took from the Prophet's
// own mouth, which is the part the model has a field for.
const abdullahIbnMasud = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-masud',
  name: 'عبد الله بن مسعود',
  nameTransliterated: 'Abdullah ibn Masud',
  hasProfile: true,
  fields: {
    virtues: {
      value:
        'كان يرعى غنما لعقبة بن أبي معيط فمر به النبي صلى الله عليه وسلم وأبو بكر فحلب لهما من جذعة لم ينز عليها الفحل، فقال له: (إنك غلام معلم) . قال: فأخذت من فيه سبعين سورة ما ينازعني فيها أحد.',
      claims: ['ibn-masud/ghanam'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default abdullahIbnMasud;
