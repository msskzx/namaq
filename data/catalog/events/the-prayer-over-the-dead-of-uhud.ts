import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Eight years after Uhud the Prophet ﷺ prayed over its dead, as one taking leave of the living and the dead, then went up
 * the minbar: «إني بين أيديكم فرط… ولكني أخشى عليكم الدنيا أن تنافسوها»; it was Uqbah's last look at him. Told from Sahih
 * al-Bukhari, each hadith whole: 4042 first, then 4085.
 */
const thePrayerOverTheDeadOfUhud = {
  kind: 'EVENT',
  slug: 'the-prayer-over-the-dead-of-uhud',
  name: "الصلاة على قتلى أحد",
  nameTransliterated: "The prayer over the dead of Uhud",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'uqbah-ibn-amir-al-juhani' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا مُحَمَّدُ بْنُ عَبْدِ الرَّحِيمِ: أَخْبَرَنَا زَكَرِيَّاءُ بْنُ عَدِيٍّ: أَخْبَرَنَا ابْنُ الْمُبَارَكِ، عَنْ حَيْوَةَ، عَنْ يَزِيدَ بْنِ أَبِي حَبِيبٍ، عَنْ أَبِي الْخَيْرِ، عَنْ عُقْبَةَ بْنِ عَامِرٍ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4042, url: 'https://sunnah.com/bukhari:4042' },
      moments: [
        { title: "صلى على قتلى أحد بعد ثماني سنين", text: "«صَلَّى رَسُولُ اللهِ ﷺ عَلَى قَتْلَى أُحُدٍ بَعْدَ ثَمَانِي سِنِينَ، كَالْمُوَدِّعِ لِلْأَحْيَاءِ وَالْأَمْوَاتِ،", people: ['prophet-muhammad'] },
        { title: "«إني بين أيديكم فرط»", text: "ثُمَّ طَلَعَ الْمِنْبَرَ فَقَالَ: إِنِّي بَيْنَ أَيْدِيكُمْ فَرَطٌ، وَأَنَا عَلَيْكُمْ شَهِيدٌ، وَإِنَّ مَوْعِدَكُمُ الْحَوْضُ، وَإِنِّي لَأَنْظُرُ إِلَيْهِ مِنْ مَقَامِي هَذَا، وَإِنِّي لَسْتُ أَخْشَى عَلَيْكُمْ أَنْ تُشْرِكُوا، وَلَكِنِّي أَخْشَى عَلَيْكُمُ الدُّنْيَا أَنْ تَنَافَسُوهَا.", people: ['prophet-muhammad'] },
        { title: "آخر نظرة", text: "قَالَ: فَكَانَتْ آخِرَ نَظْرَةٍ نَظَرْتُهَا إِلَى رَسُولِ اللهِ ﷺ.»", people: ['uqbah-ibn-amir-al-juhani', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنِي عَمْرُو بْنُ خَالِدٍ: حَدَّثَنَا اللَّيْثُ، عَنْ يَزِيدَ بْنِ أَبِي حَبِيبٍ، عَنْ أَبِي الْخَيْرِ، عَنْ عُقْبَةَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4085, url: 'https://sunnah.com/bukhari:4085' },
      moments: [
        { title: "صلى على أهل أحد", text: "«أَنَّ النَّبِيَّ ﷺ خَرَجَ يَوْمًا، فَصَلَّى عَلَى أَهْلِ أُحُدٍ صَلَاتَهُ عَلَى الْمَيِّتِ،", people: ['prophet-muhammad'] },
        { title: "«إني فرط لكم»", text: "ثُمَّ انْصَرَفَ إِلَى الْمِنْبَرِ فَقَالَ: إِنِّي فَرَطٌ لَكُمْ، وَأَنَا شَهِيدٌ عَلَيْكُمْ، وَإِنِّي لَأَنْظُرُ إِلَى حَوْضِي الْآنَ، وَإِنِّي أُعْطِيتُ مَفَاتِيحَ خَزَائِنِ الْأَرْضِ، أَوْ مَفَاتِيحَ الْأَرْضِ، وَإِنِّي وَاللهِ مَا أَخَافُ عَلَيْكُمْ أَنْ تُشْرِكُوا بَعْدِي، وَلَكِنِّي أَخَافُ عَلَيْكُمْ أَنْ تَنَافَسُوا فِيهَا».", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default thePrayerOverTheDeadOfUhud;
