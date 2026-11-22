import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Anas's uncle missed Badr and swore that if Allah let him see battle with the Prophet ﷺ He would see what he would do; at
 * Uhud, when the people broke, he excused himself to Allah for the Muslims, told Sa'd ibn Mu'adh «إني أجد ريح الجنة دون
 * أحد», and was killed, known afterwards only by his sister. Told from Sahih al-Bukhari 4048 (al-Maghazi, the chapter on
 * Uhud), whole. The text calls him «عمه»; al-Bukhari's own telling of the same hadith from Anas (2805, al-Jihad) names him «عمي
 * أنس بن النضر», so he is linked. His sister is not named.
 */
const anasIbnAnNadrAtUhud = {
  kind: 'EVENT',
  slug: 'anas-ibn-an-nadr-at-uhud',
  name: "أنس بن النضر يوم أحد",
  nameTransliterated: 'Anas ibn al-Nadr at Uhud',
  type: 'OTHER',
  fields: {},
  people: [{ person: 'anas-ibn-an-nadr' }, { person: 'prophet-muhammad' }, { person: 'saad-ibn-muadh' }],
  reports: [
    {
      isnad: "أَخْبَرَنَا حَسَّانُ بْنُ حَسَّانَ: حَدَّثَنَا مُحَمَّدُ بْنُ طَلْحَةَ: حَدَّثَنَا حُمَيْدٌ، عَنْ أَنَسٍ  رضي الله عنه:",
      source: { slug: 'sahih-al-bukhari', hadith: 4048, url: 'https://sunnah.com/bukhari:4048' },
      moments: [
        { title: "«ليرين الله ما أجد»", text: "«أَنَّ عَمَّهُ غَابَ عَنْ بَدْرٍ، فَقَالَ: غِبْتُ عَنْ أَوَّلِ قِتَالِ النَّبِيِّ ﷺ، لَئِنْ أَشْهَدَنِي اللهُ مَعَ النَّبِيِّ ﷺ لَيَرَيَنَّ اللهُ مَا أُجِدُّ،", people: ['anas-ibn-an-nadr', 'prophet-muhammad'] },
        { title: "«اللهم إني أعتذر إليك»", text: "فَلَقِيَ يَوْمَ أُحُدٍ، فَهُزِمَ النَّاسُ، فَقَالَ: اللَّهُمَّ إِنِّي أَعْتَذِرُ إِلَيْكَ مِمَّا صَنَعَ هَؤُلَاءِ، يَعْنِي الْمُسْلِمِينَ، وَأَبْرَأُ إِلَيْكَ مِمَّا جَاءَ بِهِ الْمُشْرِكُونَ،", people: ['anas-ibn-an-nadr'] },
        { title: "«إني أجد ريح الجنة دون أحد»", text: "فَتَقَدَّمَ بِسَيْفِهِ فَلَقِيَ سَعْدَ بْنَ مُعَاذٍ، فَقَالَ: أَيْنَ يَا سَعْدُ، إِنِّي أَجِدُ رِيحَ الْجَنَّةِ دُونَ أُحُدٍ، فَمَضَى فَقُتِلَ،", people: ['anas-ibn-an-nadr', 'saad-ibn-muadh'] },
        { title: "عرفته أخته", text: "فَمَا عُرِفَ حَتَّى عَرَفَتْهُ أُخْتُهُ بِشَامَةٍ، أَوْ بِبَنَانِهِ، وَبِهِ بِضْعٌ وَثَمَانُونَ: مِنْ طَعْنَةٍ وَضَرْبَةٍ وَرَمْيَةٍ بِسَهْمٍ.»", people: ['anas-ibn-an-nadr'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default anasIbnAnNadrAtUhud;
