import type { CatalogPerson } from '@/lib/catalog/types';

const alAlaIbnAlHadrami = {
  kind: 'PERSON',
  slug: 'al-ala-ibn-al-hadrami',
  name: 'العلاء بن الحضرمي',
  nameTransliterated: 'Al-Ala ibn al-Hadrami',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['al-ala-ibn-al-hadrami-siyar51/sex'] },
    fullName: {
      value: 'العلاء بن عبد الله بن عماد بن أكبر بن ربيعة بن مقنع بن حضرموت، من حلفاء بني أمية',
      claims: ['al-ala-ibn-al-hadrami-siyar51/full-name'],
    },
    virtues: {
      value:
        'ولاه رسول الله البحرين ثم وليها لأبي بكر وعمر؛ وبعثه أبو بكر في جيش قبل البحرين فمشى البحر الذي بينه وبينهم — وهو الرقراق — بأرجلهم، فقاتلهم وأظهره الله عليهم وبذلوا الزكاة؛ وكان أبو هريرة يقول: رأيت من العلاء ثلاثة أشياء لا أزال أحبه أبدا.',
      claims: ['al-ala-ibn-al-hadrami-siyar51/virtues'],
    },
    deathYearHijri: { value: '21', claims: ['al-ala-ibn-al-hadrami-siyar51/death-year'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['al-ala-ibn-al-hadrami-siyar51/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'abdullah-ibn-imad-al-hadrami',
      claims: ['al-ala-ibn-al-hadrami-siyar51/father'],
    },
  ],
} satisfies CatalogPerson;

export default alAlaIbnAlHadrami;
