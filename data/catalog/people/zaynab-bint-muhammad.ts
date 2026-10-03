import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Read in full from data/history/batches/zaynab-bint-muhammad. The Siyar gives
 * her two entries: a three-paragraph one in vol. 4 p. 334 and the substantive
 * one in vol. 5 pp. 246-249. Both are read; the death year is stated only in
 * the shorter one. `sex` and `fullName` stay on the legacy marker -- the
 * entries name her the Prophet's daughter but never give the chain her profile
 * carries, and never state her sex as a fact.
 */
const zaynabBintMuhammad = {
  kind: 'PERSON',
  slug: 'zaynab-bint-muhammad',
  name: 'زينب بنت محمد',
  nameTransliterated: 'Zaynab bint Muhammad',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: legacyUnreviewed },
    fullName: {
      value: 'زينب بنت محمد بن عبد الله بن عبد المطلب بن هاشم القرشية الهاشمية',
      claims: legacyUnreviewed,
    },
    deathYearHijri: { value: '8', claims: ['zaynab-siyar28/death-year'] },
  },
  virtues: [
    {
      value:
        'وَأَكْبَرُ أَخَوَاتِهَا، مِنَ المُهَاجِرَاتِ السَّيِّدَاتِ أَسْلَمَتْ زَيْنَبُ، وَهَاجَرَتْ قَبْلَ إِسْلاَمِ زَوْجِهَا بِسِتِّ سِنِيْنَ جَاءَ فِي فِدَاءِ أَبِي العَاصِ أَخُوْهُ عَمْرٌو، وَبَعَثَتْ مَعَهُ زَيْنَبُ بِقِلاَدَةٍ لَهَا مِنْ جَزْعِ ظَفَارٍ - أَدْخَلَتْهَا بِهَا خَدِيْجَةُ - فِي فِدَاءِ زَوْجِهَا فَلَمَّا رَأَى رَسُوْلُ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- القِلاَدَةَ عَرَفَهَا، وَرَقَّ لَهَا، وَقَالَ: (إِنْ رَأَيْتُمْ أَنْ تُطْلِقُوا لَهَا أَسِيْرَهَا فَعَلْتُمْ فَأَخَذَ عَلَيْهِ العَهْدَ أَنْ يُخَلِّيَ سَبِيْلَهَا إِلَيْهِ، فَفَعَلَ وَكَانَا نَخَسَا بِزَيْنَبَ بِنْتِ رَسُوْلِ اللهِ حِيْنَ خَرَجَتْ، فَلَمْ تَزَلْ ضَبِنَةً حَتَّى مَاتَتْ إِنِّي قَدْ أَجَرْتُ أَبَا العَاصِ بنَ الرَّبِيْعِ. فَلَمَّا سَلَّمَ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- قَالَ: (مَا عَلِمْتُ بِهَذَا؛ وَإِنَّهُ يُجِيْرُ عَلَى النَّاسِ أَدْنَاهُمْ ثُمَّ أُنْزِلَتْ بَرَاءةٌ بَعْدُ، فَإِذَا أَسْلَمَتِ امْرَأَةٌ قَبْلَ زَوْجِهَا؛ فَلاَ سَبِيْلَ لَهُ عَلَيْهَا إِلاَّ بِخِطْبَةٍ رَدَّ ابْنَتَهُ إِلَى أَبِي العَاصِ بَعْدَ سِنِيْنَ بِنِكَاحِهَا الأَوَّلِ، وَلَمْ يُحْدِثْ صَدَاقاً فَرَدَّ عَلَيْهِ زَيْنَبَ بِذَاكَ النِّكَاحِ الأَوَّلِ',
      claims: ['zaynab-siyar28/virtues'],
    },
  ],

  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['zaynab-siyar28/titles'],
    },
    {
      title: 'daughter-of-prophet',
      name: 'بنت النبي',
      nameTransliterated: 'Daughter of the Prophet',
      claims: ['zaynab-siyar28/titles'],
    },
  ],
  relations: [
    {
      type: 'DAUGHTER',
      inverse: 'FATHER',
      to: 'prophet-muhammad',
      claims: ['zaynab-siyar28/father'],
    },
    {
      type: 'HUSBAND',
      inverse: 'WIFE',
      to: 'abu-al-as-ibn-al-rabi',
      claims: ['zaynab-siyar28/husband'],
    },
  ],
} satisfies CatalogPerson;

export default zaynabBintMuhammad;
