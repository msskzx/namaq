import type { CatalogPerson } from '@/lib/catalog/types';

// data/history/batches/usayd-ibn-al-hudayr, entry 74.
const usaydIbnAlHudayr = {
  kind: 'PERSON',
  slug: 'usayd-ibn-al-hudayr',
  name: 'أسيد بن الحضير',
  nameTransliterated: 'Usayd ibn al-Hudayr',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['usayd-ibn-al-hudayr-siyar74/sex'] },
    fullName: {
      value: 'أسيد بن الحضير بن سماك بن عتيك بن نافع بن امرئ القيس بن زيد بن عبد الأشهل',
      claims: ['usayd-ibn-al-hudayr-siyar74/full-name'],
    },
    kunya: { value: 'أبو يحيى، وقيل أبو عتيك', claims: ['usayd-ibn-al-hudayr-siyar74/kunya'] },
    tribalAffiliation: {
      value: 'الأنصاري، الأوسي، الأشهلي',
      claims: ['usayd-ibn-al-hudayr-siyar74/tribal-affiliation'],
    },
    virtues: {
      value:
        'أَحَدُ النُّقَبَاءِ الاثْنَيْ عَشَرَ لَيْلَةَ العَقَبَةِ، أَسْلَمَ قَدِيْماً عَلَى يَدِ مُصْعَبِ بنِ عُمَيْرٍ هُوَ وَسَعْدُ بنُ مُعَاذٍ. كَانَ يُعَدُّ مِنْ عُقَلاَءِ الأَشْرَافِ وَذَوِي الرَّأْيِ. آخَى النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بَيْنَهُ وَبَيْنَ زَيْدِ بنِ حَارِثَةَ. قَالَ رَسُوْلُ اللهِ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ-: (نِعْمَ الرَّجُلُ أُسَيْدُ بنُ حُضَيْرٍ). كَانَ مِنْ أَحْسَنِ النَّاسِ صَوْتاً بِالقُرْآنِ. قَالَتْ عَائِشَةُ: ثَلاَثَةٌ مِنَ الأَنْصَارِ مِنْ بَنِي عَبْدِ الأَشْهَلِ لَمْ يَكُنْ أَحَدٌ يَعْتَدُّ عَلَيْهِم فَضْلاً: سَعْدُ بنُ مُعَاذٍ، وَأُسَيْدُ بنُ حُضَيْرٍ، وَعَبَّادُ بنُ بِشْرٍ. كَانَ فِيْهِ مِزَاحٌ وَطِيْبُ أَخْلاَقٍ؛ طَعَنَهُ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- بِعُوْدٍ فَاسْتَقَادَ، فَكَشَفَ النَّبِيُّ قَمِيْصَهُ فَجَعَلَ يُقَبِّلُ كَشْحَهُ وَيَقُوْلُ: إِنَّمَا أَرَدْتُ هَذَا يَا رَسُوْلَ اللهِ. قَدِمَ الجَابِيَةَ مَعَ عُمَرَ مُقَدَّماً عَلَى رُبُعِ الأَنْصَارِ. مَاتَ وَعَلَيْهِ دَيْنُ أَرْبَعَةِ آلاَفٍ، فَسَأَلَ عُمَرُ غُرَمَاءَهُ أَنْ يَقْبِضُوا كُلَّ عَامٍ أَلْفاً مِنْ ثَمَرِ أَرْضِهِ فَرَضُوا. حَمَلَهُ عُمَرُ بَيْنَ عَمُوْدَيِ السَّرِيْرِ حَتَّى وَضَعَهُ بِالبَقِيْعِ ثُمَّ صَلَّى عَلَيْهِ. نَدِمَ عَلَى تَخَلُّفِهِ عَنْ بَدْرٍ وَقَالَ: ظَنَنْتُ أَنَّهَا العِيْرُ. وَجُرِحَ يَوْمَ أُحُدٍ سَبْعَ جِرَاحَاتٍ.',
      claims: ['usayd-ibn-al-hudayr-siyar74/virtues'],
    },
    deathYearHijri: { value: '20', claims: ['usayd-ibn-al-hudayr-siyar74/death-year'] },
  },
  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['usayd-ibn-al-hudayr-siyar74/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'al-hudayr-ibn-simak',
      claims: ['usayd-ibn-al-hudayr-siyar74/father'],
    },
  ],
} satisfies CatalogPerson;

export default usaydIbnAlHudayr;
