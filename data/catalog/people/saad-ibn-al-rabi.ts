import { type CatalogPerson } from '@/lib/catalog/types';

/**
 * Authored from data/history/batches/saad-ibn-al-rabi, entry 63. The nasab is
 * kept to the tribal eponym the entry's own chain gives and the nisbas are
 * appended as the entry labels them, matching the sibling entries. The Uhud
 * participation and the Badr roster stay as they are — see that batch's
 * summary.md.
 */
const saadIbnAlRabi = {
  kind: 'PERSON',
  slug: 'saad-ibn-al-rabi',
  name: 'سعد بن الربيع',
  nameTransliterated: 'Saad ibn al-Rabi',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['saad-ibn-al-rabi-siyar63/sex'] },
    fullName: {
      value:
        'سعد بن الربيع بن عمرو بن أبي زهير بن مالك بن امرئ القيس بن مالك بن ثعلبة بن كعب بن الخزرج الأنصاري الخزرجي الحارثي',
      claims: ['saad-ibn-al-rabi-siyar63/full-name'],
    },
    tribalAffiliation: {
      value: 'الأَنْصَارِيُّ، الخَزْرَجِيُّ، الحَارِثِي',
      claims: ['saad-ibn-al-rabi-siyar63/tribal-affiliation'],
    },
    virtues: {
      value:
        'الَّذِي آخَى النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بَيْنَهُ وَبَيْنَ عَبْدِ الرَّحْمَنِ بنِ عَوْفٍ، فَعَزَمَ عَلَى أَنْ يُعْطِيَ عَبْدَ الرَّحْمَنِ شَطْرَ مَالِهِ، وَيُطَلِّقَ إِحْدَى زَوْجَتَيْهِ لِيَتَزَوَّجَ بِهَا، فَامْتَنَعَ عَبْدُ الرَّحْمَنِ مِنْ ذَلِكَ، وَدَعَا لَه جَزَاكَ اللهُ عَنِّي خَيْرَ مَا جَزَى نَبِيّاً عَنْ أُمَّتِهِ، وَأَبْلِغْ قَوْمَكَ مِنِّي السَّلاَم إِنَّهُ لاَ عُذْرَ لَكُم عِنْدَ اللهِ إِنْ خُلِصَ إِلَى نَبِيِّكُم وَمِنْكُم عَيْنٌ تَطْرُف فَطُفْتُ بَيْنَ القَتْلَى، فَأَصَبْتُهُ وَهُوَ فِي آخِرِ رَمَقٍ، وَبِهِ سَبْعُوْنَ ضَرْبَة أَجِدُ رِيْحَ الجَنَّة',
      claims: ['saad-ibn-al-rabi-siyar63/virtues'],
    },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['saad-ibn-al-rabi-siyar63/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'al-rabi-ibn-amr',
      claims: ['saad-ibn-al-rabi-siyar63/father'],
    },
    {
      type: 'PACT_BROTHER',
      inverse: 'PACT_BROTHER',
      to: 'abdur-rahman-ibn-awf',
      claims: ['saad-ibn-al-rabi-siyar63/pact-brother'],
    },
  ],
} satisfies CatalogPerson;

export default saadIbnAlRabi;
