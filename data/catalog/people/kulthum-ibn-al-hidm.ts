import type { CatalogPerson } from '@/lib/catalog/types';

const kulthumIbnAlHidm = {
  kind: 'PERSON',
  slug: 'kulthum-ibn-al-hidm',
  name: 'كُلْثُوْمُ بنُ الهِدْمِ',
  nameTransliterated: 'Kulthum ibn al-Hidm',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['kulthum-ibn-al-hidm-siyar38/sex'] },
    fullName: {
      value:
        'كُلْثُوْمُ بنُ الهِدْمِ بنِ امْرِئِ القَيْسِ بنِ الحَارِثِ الأَنْصَارِيُّ بنِ زَيْدِ بنِ عُبَيْدِ بنِ زَيْدِ بنِ مَالِكِ بنِ عَوْفِ بنِ عَمْرِو بنِ عَوْفِ بنِ مَالِكِ بنِ الأَوْسِ الأَنْصَارِيُّ، العَوْفِيُّ',
      claims: ['kulthum-ibn-al-hidm-siyar38/full-name'],
    },
    virtues: {
      value:
        'شَيْخُ الأَنْصَارِ، وَمَنْ نَزَلَ عَلَيْهِ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- أَوَّلَ مَا قَدِمَ المَدِيْنَةَ بِقُبَاءَ رَجُلاً شَرِيْفاً، وَكَانَ مُسِنّاً، أَسْلَمَ قَبْلَ مَقْدَمِ النَّبِيِّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- المَدِيْنَةَ تُوُفِّيَ -رَضِيَ اللهُ عَنْهُ- وَذَلِكَ قَبْلَ بَدْرٍ، وَكَانَ رَجُلاً صَالِحاً',
      claims: ['kulthum-ibn-al-hidm-siyar38/virtues', 'kulthum-ibn-al-hidm-siyar38/prophet-lodging'],
    },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['kulthum-ibn-al-hidm-siyar38/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'al-hidm-ibn-imri-al-qays',
      claims: ['kulthum-ibn-al-hidm-siyar38/father'],
    },
  ],
} satisfies CatalogPerson;

export default kulthumIbnAlHidm;
