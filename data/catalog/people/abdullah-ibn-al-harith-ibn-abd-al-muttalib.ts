import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const abdullahIbnAlHarithIbnAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-al-harith-ibn-abd-al-muttalib',
  name: 'عبد الله بن الحارث',
  nameTransliterated: 'Abdullah ibn al-Harith ibn Abd al-Muttalib',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عبد الله بن الحارث بن عبد المطلب الهاشمي',
      claims: ['abdullah-ibn-al-harith-ibn-abd-al-muttalib-siyar47/full-name'],
    },
    virtues: {
      value: 'قيل إنه قال فيه: هو سعيد، أدركته السعادة.',
      claims: ['abdullah-ibn-al-harith-ibn-abd-al-muttalib-siyar47/virtues'],
    },
    placeOfDeathArabic: {
      value: 'الصفراء',
      claims: ['abdullah-ibn-al-harith-ibn-abd-al-muttalib-siyar47/death-place'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'al-harith-ibn-abd-al-muttalib',
      claims: ['abdullah-ibn-al-harith-ibn-abd-al-muttalib-siyar47/father'],
    },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'rabiah-ibn-al-harith',
      claims: ['abdullah-ibn-al-harith-ibn-abd-al-muttalib-siyar47/half-brother-rabiah'],
    },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'nawfal-ibn-al-harith',
      claims: ['abdullah-ibn-al-harith-ibn-abd-al-muttalib-siyar47/half-brother-nawfal'],
    },
  ],
} satisfies CatalogPerson;

export default abdullahIbnAlHarithIbnAbdAlMuttalib;
