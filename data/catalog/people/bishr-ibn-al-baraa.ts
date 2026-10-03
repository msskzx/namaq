import { type CatalogPerson } from '@/lib/catalog/types';

const bishrIbnAlBaraa = {
  kind: 'PERSON',
  slug: 'bishr-ibn-al-baraa',
  name: 'بِشْرُ بنُ البَرَاءِ',
  nameTransliterated: 'Bishr ibn al-Baraa',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['bishr-ibn-al-baraa-siyar54/sex'] },
    fullName: {
      value: 'بِشْرُ بنُ البَرَاءِ بنُ مَعْرُوْرٍ الخَزْرَجِيُّ',
      claims: ['bishr-ibn-al-baraa-siyar54/full-name'],
    },
    virtues: {
      value:
        'مِنْ أَشْرَافِ قَوْمِهِ. بَلْ سَيِّدُكُم الأَبْيَضُ الجَعْدُ: بِشْرُ بنُ البَرَاءِ هُوَ الَّذِي أَكَلَ مَعَ النَّبِيِّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- مِنَ الشَّاةِ المَسْمُوْمَةِ يَوْمَ خَيْبَرَ، فَأُصِيْبَ',
      claims: [
        'bishr-ibn-al-baraa-siyar54/virtues-chiefs',
        'bishr-ibn-al-baraa-siyar54/virtues-sayyid',
        'bishr-ibn-al-baraa-siyar54/virtues-khaybar',
      ],
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: ['bishr-ibn-al-baraa-siyar54/titles'] },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'al-baraa-ibn-marur',
      claims: ['bishr-ibn-al-baraa-siyar54/father'],
    },
  ],
} satisfies CatalogPerson;

export default bishrIbnAlBaraa;
