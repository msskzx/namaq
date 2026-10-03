import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Read in full from data/history/batches/yazid-ibn-abi-sufyan (Siyar entry
 * 68, vol. 4 pp. 328-330). `sex` stays on the legacy marker: the entry uses
 * masculine grammar throughout but never states his sex as a fact. His
 * mother and his sister Umm Habibah are carried as virtues rather than as
 * relations -- the entry names the mother but the catalog has no person to
 * point a MOTHER edge at, and it says he is Umm Habibah's brother without
 * saying whether they share a mother. See the batch's summary.md.
 */
const yazidIbnAbiSufyan = {
  kind: 'PERSON',
  slug: 'yazid-ibn-abi-sufyan',
  name: 'يزيد بن أبي سفيان',
  nameTransliterated: 'Yazid ibn Abi Sufyan',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: legacyUnreviewed },
    fullName: {
      value: 'يَزِيْدُ بنُ أَبِي سُفْيَانَ بنِ حَرْبِ بنِ أُمَيَّةَ بنِ عَبْدِ شَمْسٍ بنِ عَبْدِ مَنَافٍ بنِ قُصَيِّ الأُمَوِيُّ',
      claims: ['yazid-ibn-abi-sufyan-siyar68/full-name'],
    },
    tribalAffiliation: { value: 'الأُمَوِيُّ', claims: ['yazid-ibn-abi-sufyan-siyar68/tribal-affiliation'] },
    deathYearHijri: { value: '18', claims: ['yazid-ibn-abi-sufyan-siyar68/death-year'] },
  },
  virtues: [
    {
      value:
        'وَيُقَالُ لَهُ: يَزِيْدُ الخَيْرُ وَأُمُّهُ: هِيَ زَيْنَبُ بِنْتُ نَوْفَلٍ الكِنَانِيَّةُ، وَهُوَ أَخُو أُمِّ المُؤْمِنِيْنَ أُمِّ حَبِيْبَةَ كَانَ مِنَ العُقَلاَءِ الأَلِبَّاءِ، وَالشُّجْعَانِ المَذْكُوْرِيْنَ وَشَهِدَ حُنَيْناً فَقِيْلَ: إِنَّ النَّبِيَّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- أَعْطَاهُ مِنْ غَنَائِمِ حُنَيْنٍ: مَائَةً مِنَ الإِبِلِ، وَأَرْبَعِيْنَ أُوْقِيَّةً فِضَّةً وَهُوَ أَحَدُ الأُمَرَاءِ الأَرْبَعَةِ الَّذِيْنَ نَدَبَهُم أَبُو بَكْرٍ لِغَزْوِ الرُّوْمِ وَعَلَى يَدِهِ كَانَ فَتْحُ قَيْسَارِيَّةَ غَزَا يَزِيْدُ بنُ أَبِي سُفْيَانَ بِالنَّاسِ، فَوْقَعَتْ جَارِيَةٌ نَفِيْسَةٌ فِي سَهْمِ رَجُلٍ، فَاغْتَصَبَهَا يَزِيْدُ. فَأَتَاهُ أَبُو ذَرٍّ، فَقَالَ: رُدَّ عَلَى الرَّجُلِ جَارِيَتَهُ كَانَ يَزِيْدُ بنُ أَبِي سُفْيَانَ عَلَى رُبُعٍ يَوْمَ اليَرْمُوْكِ',
      claims: ['yazid-ibn-abi-sufyan-siyar68/virtues', 'yazid-ibn-abi-sufyan-siyar68/mother-and-sister'],
    },
  ],

  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['yazid-ibn-abi-sufyan-siyar68/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'abu-sufyan-ibn-harb',
      claims: ['yazid-ibn-abi-sufyan-siyar68/father'],
    },
    {
      type: 'HALF_BROTHER',
      inverse: 'HALF_SISTER',
      to: 'muawiyah-ibn-abi-sufyan',
      claims: ['yazid-ibn-abi-sufyan-siyar68/half-brother'],
    },
  ],
} satisfies CatalogPerson;

export default yazidIbnAbiSufyan;
