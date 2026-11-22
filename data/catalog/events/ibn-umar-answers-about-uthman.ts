import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * A man on hajj asked Ibn Umar whether Uthman fled at Uhud, missed Badr and missed the pledge of al-Ridwan, and said «الله
 * أكبر»; Ibn Umar answered each: Allah pardoned him, he stayed by the Prophet's sick daughter with a share of Badr, and he
 * was in Makkah on the Prophet's errand, whose right hand stood for his. Told from Sahih al-Bukhari 4066 (al-Maghazi, the
 * chapter on «إن الذين تولوا منكم يوم التقى الجمعان»), whole. Ibn Umar has no catalog subject and is not linked; nor is the
 * Prophet's daughter, unnamed here.
 */
const ibnUmarAnswersAboutUthman = {
  kind: 'EVENT',
  slug: 'ibn-umar-answers-about-uthman',
  name: "ابن عمر يجيب عن عثمان",
  nameTransliterated: "Ibn Umar answers about Uthman",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'uthman-ibn-affan' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا عَبْدَانُ: أَخْبَرَنَا أَبُو حَمْزَةَ، عَنْ عُثْمَانَ بْنِ مَوْهَبٍ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4066, url: 'https://sunnah.com/bukhari:4066' },
      moments: [
        { title: "«أتعلم أن عثمان بن عفان فر يوم أحد؟»", text: "«جَاءَ رَجُلٌ حَجَّ الْبَيْتَ، فَرَأَى قَوْمًا جُلُوسًا، فَقَالَ: مَنْ هَؤُلَاءِ الْقُعُودُ؟ قَالُوا: هَؤُلَاءِ قُرَيْشٌ قَالَ: مَنِ الشَّيْخُ؟ قَالُوا: ابْنُ عُمَرَ، فَأَتَاهُ فَقَالَ: إِنِّي سَائِلُكَ عَنْ شَيْءٍ أَتُحَدِّثُنِي؟ قَالَ: أَنْشُدُكَ بِحُرْمَةِ هَذَا الْبَيْتِ، أَتَعْلَمُ أَنَّ عُثْمَانَ بْنَ عَفَّانَ فَرَّ يَوْمَ أُحُدٍ؟ قَالَ: نَعَمْ. قَالَ: فَتَعْلَمُهُ تَغَيَّبَ عَنْ بَدْرٍ فَلَمْ يَشْهَدْهَا؟ قَالَ: نَعَمْ. قَالَ: فَتَعْلَمُ أَنَّهُ تَخَلَّفَ عَنْ بَيْعَةِ الرُِّضْوَانِ فَلَمْ يَشْهَدْهَا؟ قَالَ: نَعَمْ. قَالَ: فَكَبَّرَ.", people: ['uthman-ibn-affan'] },
        { title: "«أما فراره يوم أحد، فأشهد أن الله عفا عنه»", text: "قَالَ ابْنُ عُمَرَ: تَعَالَ لِأُخْبِرَكَ وَلِأُبَيِّنَ لَكَ عَمَّا سَأَلْتَنِي عَنْهُ، أَمَّا فِرَارُهُ يَوْمَ أُحُدٍ، فَأَشْهَدُ أَنَّ اللهَ عَفَا عَنْهُ، وَأَمَّا تَغَيُّبُهُ عَنْ بَدْرٍ، فَإِنَّهُ كَانَ تَحْتَهُ بِنْتُ رَسُولِ اللهِ ﷺ وَكَانَتْ مَرِيضَةً، فَقَالَ لَهُ النَّبِيُّ ﷺ: إِنَّ لَكَ أَجْرَ رَجُلٍ مِمَّنْ شَهِدَ بَدْرًا وَسَهْمَهُ.", people: ['uthman-ibn-affan', 'prophet-muhammad'] },
        { title: "«هذه يد عثمان»", text: "وَأَمَّا تَغَيُّبُهُ عَنْ بَيْعَةِ الرُِّضْوَانِ، فَإِنَّهُ لَوْ كَانَ أَحَدٌ أَعَزَّ بِبَطْنِ مَكَّةَ مِنْ عُثْمَانَ بْنِ عَفَّانَ لَبَعَثَهُ مَكَانَهُ، فَبَعَثَ عُثْمَانَ، وَكَانَ بَيْعَةُ الرُِّضْوَانِ بَعْدَمَا ذَهَبَ عُثْمَانُ إِلَى مَكَّةَ، فَقَالَ النَّبِيُّ ﷺ بِيَدِهِ الْيُمْنَى: هَذِهِ يَدُ عُثْمَانَ فَضَرَبَ بِهَا عَلَى يَدِهِ، فَقَالَ هَذِهِ لِعُثْمَانَ اذْهَبْ بِهَذَا الْآنَ مَعَكَ».", people: ['uthman-ibn-affan', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ibnUmarAnswersAboutUthman;
