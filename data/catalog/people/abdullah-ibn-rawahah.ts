import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const abdullahIbnRawahah = {
  kind: 'PERSON',
  slug: 'abdullah-ibn-rawahah',
  name: 'عبد الله بن رواحة',
  nameTransliterated: 'Abdullah ibn Rawahah',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'عبد الله بن رواحة بن ثعلبة بن امرئ القيس بن ثعلبة الأنصاري الخزرجي',
      claims: ['abdullah-ibn-rawahah-siyar37/full-name'],
    },
    kunya: {
      value: 'أبو عمرو، أبو محمد، أبو رواحة',
      claims: ['abdullah-ibn-rawahah-siyar37/kunya'],
    },
    virtues: {
      value:
        'بدري نقيب شاعر، شهد العقبة، وكان من كتاب الأنصار، واستخلفه النبي صلى الله عليه وسلم على المدينة، وقال فيه: رحم الله ابن رواحة إنه يحب المجالس التي تتباهى بها الملائكة.',
      claims: ['abdullah-ibn-rawahah-siyar37/virtues', 'abdullah-ibn-rawahah-siyar37/virtues-praise'],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'rawahah-ibn-thalabah',
      claims: ['abdullah-ibn-rawahah-siyar37/father'],
    },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_BROTHER',
      to: 'abu-al-darda',
      claims: ['abdullah-ibn-rawahah-siyar37/half-brother'],
    },
  ],
} satisfies CatalogPerson;

export default abdullahIbnRawahah;
