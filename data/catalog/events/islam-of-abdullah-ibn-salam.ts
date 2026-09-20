import type { CatalogEvent } from '@/lib/catalog/types';

// He came the day the Prophet arrived, and the chapter puts his Islam in the
// first year alongside the mosque and the brotherhood.
const islamOfAbdullahIbnSalam = {
  kind: 'EVENT',
  slug: 'islam-of-abdullah-ibn-salam',
  name: 'إسلام عبد الله بن سلام',
  nameTransliterated: 'Islam of Abdullah ibn Salam',
  type: 'OTHER',
  fields: {
    hijriYear: { value: 1, claims: ['ibn-salam/islam'] },
    description: {
      value:
        'لما قدم رسول الله صلى الله عليه وسلم المدينة جاءه عبد الله بن سلام فقال: أشهد أنك رسول الله حقا. وكان أول ما سمعه منه: (أيها الناس، أطعموا الطعام، وأفشوا السلام، وصلوا الأرحام، وصلوا بالليل والناس نيام، تدخلوا الجنة بسلام) .',
      claims: ['ibn-salam/islam'],
    },
  },
  people: [{ person: 'abdullah-ibn-salam', claims: ['ibn-salam/islam'] }],
} satisfies CatalogEvent;

export default islamOfAbdullahIbnSalam;
