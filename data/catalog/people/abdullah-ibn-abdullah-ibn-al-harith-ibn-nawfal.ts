import type { CatalogPerson } from '@/lib/catalog/types';

const abdullahIbnAbdullahIbnAlHarithIbnNawfal = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-abdullah-ibn-al-harith-ibn-nawfal',
  name: 'عبد الله بن عبد الله بن الحارث',
  nameTransliterated: 'Abdullah ibn Abdullah ibn al-Harith',
  hasProfile: true,
  fields: {
    sex: {
      value: 'MALE',
      claims: ['abdullah-ibn-abdullah-ibn-al-harith-ibn-nawfal-siyar30/sex'],
    },
    fullName: {
      value: 'عبد الله بن عبد الله بن الحارث بن نوفل الهاشمي',
      claims: ['abdullah-ibn-abdullah-ibn-al-harith-ibn-nawfal-siyar30/full-name'],
    },
    kunya: {
      value: 'أبو يحيى',
      claims: ['abdullah-ibn-abdullah-ibn-al-harith-ibn-nawfal-siyar30/kunya'],
    },
    virtues: {
      value: 'كان من صحابة سليمان الخليفة؛ وقال ابن سعد: ثقة قليل الحديث.',
      claims: ['abdullah-ibn-abdullah-ibn-al-harith-ibn-nawfal-siyar30/virtues'],
    },
    deathYearHijri: {
      value: '97',
      claims: ['abdullah-ibn-abdullah-ibn-al-harith-ibn-nawfal-siyar30/death-year'],
    },
    placeOfDeathArabic: {
      value: 'الأبواء',
      claims: ['abdullah-ibn-abdullah-ibn-al-harith-ibn-nawfal-siyar30/death-place'],
    },
  },
  titles: [],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'abdullah-ibn-al-harith-ibn-nawfal',
      claims: ['abdullah-ibn-abdullah-ibn-al-harith-ibn-nawfal-siyar30/father'],
    },
  ],
} satisfies CatalogPerson;

export default abdullahIbnAbdullahIbnAlHarithIbnNawfal;
