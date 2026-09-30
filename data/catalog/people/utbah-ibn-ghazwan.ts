import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const utbahIbnGhazwan = {
  kind: 'PERSON',
  slug: 'utbah-ibn-ghazwan',
  name: 'عتبة بن غزوان',
  nameTransliterated: 'Utbah ibn Ghazwan',
  hasProfile: true,
  fields: {
    // The entry never states his sex outright.
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عتبة بن غزوان بن جابر بن وهيب',
      claims: ['utbah-ibn-ghazwan-siyar59/full-name'],
    },
    kunya: { value: 'أبو غزوان', claims: ['utbah-ibn-ghazwan-siyar59/kunya'] },
    tribalAffiliation: {
      value: 'المازني، حليف بني عبد شمس',
      claims: ['utbah-ibn-ghazwan-siyar59/tribal-affiliation'],
    },
    virtues: {
      value:
        'السيد الأمير المجاهد، أسلم سابع سبعة في الإسلام، وهاجر إلى الحبشة، وشهد بدراً والمشاهد، وكان أحد الرماة المذكورين ومن أمراء الغزاة، وهو الذي اختط البصرة وأنشاها. استعمله عمر على البصرة فمصرها واختطها وبنى مسجدها بقصب ولم يبن بها داراً، وقيل إن البصرة كانت قبل تسمى أرض الهند فأول من نزلها عتبة في ثمان مائة. وخطب الناس فقال: ألا إن الدنيا قد آذنت بصرم وولت حذاء ولم يبق منها إلا صبابة كصبابة الإناء، وله حديث في صحيح مسلم.',
      claims: [
        'utbah-ibn-ghazwan-siyar59/virtues',
        'utbah-ibn-ghazwan-siyar59/virtues-basra',
        'utbah-ibn-ghazwan-siyar59/virtues-khutbah',
      ],
    },
    deathYearHijri: { value: '17', claims: ['utbah-ibn-ghazwan-siyar59/death-year'] },
    placeOfDeathArabic: { value: 'بطريق البصرة', claims: ['utbah-ibn-ghazwan-siyar59/death-place'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['utbah-ibn-ghazwan-siyar59/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'ghazwan-ibn-jabir',
      claims: ['utbah-ibn-ghazwan-siyar59/father'],
    },
  ],
} satisfies CatalogPerson;

export default utbahIbnGhazwan;
