import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Jabir's father was killed at Uhud owing a heavy debt; at the date harvest the Prophet ﷺ had Jabir heap each kind apart,
 * walked three times round the largest heap, sat on it and measured out to the creditors until the debt was paid, and the
 * heaps were left as they were. Told from Sahih al-Bukhari 4053 (al-Maghazi, the chapter on Uhud), whole.
 */
const theDebtOfJabirsFather = {
  kind: 'EVENT',
  slug: 'the-debt-of-jabirs-father',
  name: "دين أبي جابر",
  nameTransliterated: "The debt of Jabir's father",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'jabir-ibn-abdullah' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنِي أَحْمَدُ بْنُ أَبِي سُرَيْجٍ: أَخْبَرَنَا عُبَيْدُ اللهِ بْنُ مُوسَى: حَدَّثَنَا شَيْبَانُ، عَنْ فِرَاسٍ، عَنِ الشَّعْبِيِّ قَالَ: حَدَّثَنِي جَابِرُ بْنُ عَبْدِ اللهِ  رضي الله عنهما:",
      source: { slug: 'sahih-al-bukhari', hadith: 4053, url: 'https://sunnah.com/bukhari:4053' },
      moments: [
        { title: "«إني أحب أن يراك الغرماء»", text: "«أَنَّ أَبَاهُ اسْتُشْهِدَ يَوْمَ أُحُدٍ، وَتَرَكَ عَلَيْهِ دَيْنًا، وَتَرَكَ سِتَّ بَنَاتٍ، فَلَمَّا حَضَرَ جَِزَازُ النَّخْلِ قَالَ: أَتَيْتُ رَسُولَ اللهِ ﷺ فَقُلْتُ: قَدْ عَلِمْتَ أَنَّ وَالِدِي قَدِ اسْتُشْهِدَ يَوْمَ أُحُدٍ وَتَرَكَ دَيْنًا كَثِيرًا، وَإِنِّي أُحِبُّ أَنْ يَرَاكَ الْغُرَمَاءُ،", people: ['jabir-ibn-abdullah', 'prophet-muhammad'] },
        { title: "«اذهب فبيدر كل تمر على ناحية»", text: "فَقَالَ: اذْهَبْ فَبَيْدِرْ كُلَّ تَمْرٍ عَلَى نَاحِيَةٍ. فَفَعَلْتُ ثُمَّ دَعَوْتُهُ، فَلَمَّا نَظَرُوا إِلَيْهِ كَأَنَّهُمْ أُغْرُوا بِي تِلْكَ السَّاعَةَ، فَلَمَّا رَأَى مَا يَصْنَعُونَ أَطَافَ حَوْلَ أَعْظَمِهَا بَيْدَرًا ثَلَاثَ مَرَّاتٍ، ثُمَّ جَلَسَ عَلَيْهِ،", people: ['prophet-muhammad', 'jabir-ibn-abdullah'] },
        { title: "كأنها لم تنقص تمرة واحدة", text: "ثُمَّ قَالَ: ادْعُ لَكَ أَصْحَابَكَ. فَمَا زَالَ يَكِيلُ لَهُمْ حَتَّى أَدَّى اللهُ عَنْ وَالِدِي أَمَانَتَهُ، وَأَنَا أَرْضَى أَنْ يُؤَدِّيَ اللهُ أَمَانَةَ وَالِدِي وَلَا أَرْجِعَ إِلَى أَخَوَاتِي بِتَمْرَةٍ، فَسَلَّمَ اللهُ الْبَيَادِرَ كُلَّهَا، وَحَتَّى إِنِّي أَنْظُرُ إِلَى الْبَيْدَرِ الَّذِي كَانَ عَلَيْهِ النَّبِيُّ ﷺ كَأَنَّهَا لَمْ تَنْقُصْ تَمْرَةً وَاحِدَةً».", people: ['prophet-muhammad', 'jabir-ibn-abdullah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theDebtOfJabirsFather;
