import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Read from the Siyar in data/history/batches/al-abbas-ibn-abd-al-muttalib
 * (vol 5, pp. 78-102). The entry never states the بن هاشم chain or a tribal
 * affiliation, so fullName stays on the legacy marker with its evidence owed;
 * the entry does name him العباس بن عبد المطلب once and names his mother,
 * which is what the SON edge below cites. See the batch's summary.md for the
 * graded reports kept out of virtues and the removed Khaybar/Tabuk rows.
 */
const alAbbasIbnAbdAlMuttalib = {
  kind: 'PERSON',
  slug: 'al-abbas-ibn-abd-al-muttalib',
  name: 'العباس بن عبد المطلب',
  nameTransliterated: 'Al-Abbas ibn Abd al-Muttalib',
  hasProfile: true,
  fields: {
    sex: {
      value: 'MALE',
      claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/sex'],
    },
    // Carried from the retired prisma/personSeedData.ts entry, uncited: the
    // batch's entry states only العباس بن عبد المطلب, never this full chain.
    fullName: { value: 'العباس بن عبد المطلب بن هاشم القرشي الهاشمي', claims: legacyUnreviewed },
    appearance: {
      value:
        'شَرِيْفاً، مَهِيْباً، عَاقِلاً، جَمِيْلاً، أَبْيَضَ، بَضّاً، لَهُ ضَفِيْرَتَانِ، مُعْتَدِلَ القَامَةِ مِنْ أَطْوَلِ الرِّجَالِ، وَأَحْسَنِهِمْ صُوْرَةً، وَأَبْهَاهُم، وَأَجْهَرِهِمْ صَوْتاً تَامَّ الشَّكْلِ، جَهْوَرِيَّ الصَّوْتِ جِدّاً',
      claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/appearance'],
    },
    deathYearHijri: { value: '32', claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/death-year'] },
  },
  virtues: [
    {
      value:
        'إِنَّ عَمَّ الرَّجُلِ صِنْوُ أَبِيْهِ، مَنْ آذَى العَبَّاسَ فَقَدْ آذَانِي فَإِنَّ العَبَّاسَ مِنِّي، وَأَنَا مِنْهُ أَجْوَدُ قُرَيْشٍ كَفّاً، وَأَوْصَلُهَا اغْفِرْ لِلْعَبَّاسِ وَوَلَدِهِ مَغْفِرَةً ظَاهِرَةً وَبَاطِنَةً لاَ تُغَادِرُ ذَنْباً إِنَّا كُنَّا إِذَا قَحَطْنَا عَلَى عَهْدِ نَبِيِّكَ تَوَسَّلْنَا بِهِ؛ وَإِنَا نَسْتَسْقِي إِلَيْكَ بِعَمِّ نَبِيِّكَ العَبَّاسِ كَانَ يَرَى لِلْعَبَّاسِ مَا يَرَى الوَلَدُ لِوَالِدِهِ وَلَيْسَ هُوَ فِي عِدَادِ الطُّلَقَاءِ؛ فَإِنَّهُ كَانَ قَدْ قَدِمَ إِلَى النَّبِيِّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- قَبْلَ الفَتْحِ؛ أَلاَ تَرَاهُ أَجَارَ أَبَا سُفْيَانَ بنَ حَرْبٍ وَهُوَ الَّذِي أَمَرَهُ النَّبِيُّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- أَن يَهْتِفَ يَوْمَ حُنَيْنٍ: يَا أَصْحَابَ الشَّجَرَةِ وَفَرَضَ لِلْعَبَّاسِ اثْنَيْ عَشَرَ أَلْفاً كَانَ لِلعَبَّاسِ ثَوْبٌ لِعَارِي بَنِي هَاشِمٍ، وَجَفْنَةٌ لِجَائِعِهِمْ وَكَانَ يَمْنَعُ الجَارَ، وَيَبْذُلُ المَالَ يُقَبِّلُ يَدَ العَبَّاسِ وَرِجْلَهُ لَمْ يَزَلِ العَبَّاسُ مُشْفِقاً عَلَى النَّبِيِّ -صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ- مُحِبّاً لَهُ، صَابِراً عَلَى الأَذَى',
      claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/virtues'],
    },
  ],

  titles: [
    {
      title: 'companion',
      name: 'صحابي',
      nameTransliterated: 'Companion',
      claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/titles'],
    },
  ],
  relations: [
    {
      type: 'SON',
      inverse: 'FATHER',
      to: 'abd-al-muttalib-ibn-hashim',
      claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/nasab-father'],
    },
    {
      type: 'HUSBAND',
      inverse: 'WIFE',
      to: 'umm-al-fadl-bint-al-harith',
      claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/wife-umm-al-fadl'],
    },
    {
      type: 'PATERNAL_UNCLE',
      inverse: 'PATERNAL_NEPHEW',
      to: 'aqil-ibn-abi-talib',
      claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/nephew-aqil'],
    },
  ],
  ayat: [{ surah: 8, ayah: 70, claims: ['al-abbas-ibn-abd-al-muttalib-siyar11/ayah-anfal'] }],
} satisfies CatalogPerson;

export default alAbbasIbnAbdAlMuttalib;
