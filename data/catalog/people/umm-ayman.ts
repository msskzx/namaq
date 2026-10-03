import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

const ummAyman = {
  kind: 'PERSON',
  slug: 'umm-ayman',
  name: 'أم أيمن',
  nameTransliterated: 'Umm Ayman',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: { value: 'بَرَكَةٌ', claims: ['umm-ayman-siyar24/full-name'] },
    virtues: {
      value:
        'وَكَانَتْ مِنَ المُهَاجِرَاتِ الأُوَلِ مَوْلاَةُ رَسُوْلِ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- وَحَاضِنَتُهُ يَقُوْلُ: (هَذِهِ بَقِيَّةُ أَهْلِ بَيْتِي فَقَالَ: (مَنْ سَرَّهُ أَنْ يَتَزَوَّجَ امْرَأَةً مِنْ أَهْلِ الجَنَّةِ، فَلْيَتَزَوَّجْ أُمَّ أَيْمَنَ) فَدُلِّيَ عَلَيْهَا مِنَ السِّمَاءِ دَلْوٌ مِنْ مَاءٍ بِرِشَاءٍ أَبْيَضَ، فَشَرِبَتْ وَلَكِنِّي إِنَّمَا أَبْكِي عَلَى الوَحْيِ إِذِ انْقَطَعَ عَنَّا مِنَ السِّمَاءِ',
      claims: ['umm-ayman-siyar24/virtues'],
    },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['umm-ayman-siyar24/virtues'],
    },
  ],
  relations: [
    {
      type: 'WIFE',
      inverse: 'HUSBAND',
      to: 'zaid-ibn-harithah',
      claims: ['umm-ayman-siyar24/husband-zaid'],
    },
    {
      type: 'MOTHER',
      inverse: 'SON',
      to: 'usamah-ibn-zaid',
      claims: ['umm-ayman-siyar24/son-usamah'],
    },
  ],
} satisfies CatalogPerson;

export default ummAyman;
