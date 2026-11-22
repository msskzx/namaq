import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Ali came out from the Prophet ﷺ in his last illness and told the people he was well; al-Abbas took his hand, «أنت والله
 * بعد ثلاث عبد العصا», said he knew the faces of Banu Abd al-Muttalib at death and wanted to ask him who would hold the
 * matter, and Ali refused, «وإني والله لا أسألها رسول الله ﷺ». Told from Sahih al-Bukhari 4447 (al-Maghazi, the illness
 * of the Prophet ﷺ), whole.
 */
const alAbbasAndAliInHisIllness = {
  kind: 'EVENT',
  slug: 'al-abbas-and-ali-in-his-illness',
  name: "العباس وعلي في مرضه ﷺ",
  nameTransliterated: "Al-Abbas and Ali in his illness",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'ali-ibn-abi-talib' }, { person: 'prophet-muhammad' }, { person: 'al-abbas-ibn-abd-al-muttalib' }],
  reports: [
    {
      isnad: "حَدَّثَنِي إِسْحَاقُ، أَخْبَرَنَا بِشْرُ بْنُ شُعَيْبِ بْنِ أَبِي حَمْزَةَ قَالَ: حَدَّثَنِي أَبِي، عَنِ الزُّهْرِيِّ قَالَ: أَخْبَرَنِي عَبْدُ اللهِ بْنُ كَعْبِ بْنِ مَالِكٍ الْأَنْصَارِيُّ، وَكَانَ كَعْبُ بْنُ مَالِكٍ أَحَدَ الثَّلَاثَةِ الَّذِينَ تِيبَ عَلَيْهِمْ: أَنَّ عَبْدَ اللهِ بْنَ عَبَّاسٍ أَخْبَرَهُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4447, url: 'https://sunnah.com/bukhari:4447' },
      moments: [
        { title: "«أصبح بحمد الله بارئا»", text: "«أَنَّ عَلِيَّ بْنَ أَبِي طَالِبٍ رضي الله عنه خَرَجَ مِنْ عِنْدِ رَسُولِ اللهِ ﷺ فِي وَجَعِهِ الَّذِي تُوُفِّيَ فِيهِ، فَقَالَ النَّاسُ: يَا أَبَا حَسَنٍ، كَيْفَ أَصْبَحَ رَسُولُ اللهِ ﷺ؟ فَقَالَ: أَصْبَحَ بِحَمْدِ اللهِ بَارِئًا،", people: ['ali-ibn-abi-talib', 'prophet-muhammad'] },
        { title: "«أنت والله بعد ثلاث عبد العصا»", text: "فَأَخَذَ بِيَدِهِ عَبَّاسُ بْنُ عَبْدِ الْمُطَّلِبِ فَقَالَ لَهُ: أَنْتَ وَاللهِ بَعْدَ ثَلَاثٍ عَبْدُ الْعَصَا، وَإِنِّي وَاللهِ لَأُرَى رَسُولَ اللهِ ﷺ سَوْفَ يُتَوَفَّى مِنْ وَجَعِهِ هَذَا، إِنِّي لَأَعْرِفُ وُجُوهَ بَنِي عَبْدِ الْمُطَّلِبِ عِنْدَ الْمَوْتِ، اذْهَبْ بِنَا إِلَى رَسُولِ اللهِ ﷺ فَلْنَسْأَلْهُ فِيمَنْ هَذَا الْأَمْرُ، إِنْ كَانَ فِينَا عَلِمْنَا ذَلِكَ، وَإِنْ كَانَ فِي غَيْرِنَا عَلِمْنَاهُ، فَأَوْصَى بِنَا،", people: ['al-abbas-ibn-abd-al-muttalib', 'ali-ibn-abi-talib', 'prophet-muhammad'] },
        { title: "«وإني والله لا أسألها رسول الله ﷺ»", text: "فَقَالَ عَلِيٌّ: إِنَّا وَاللهِ لَئِنْ سَأَلْنَاهَا رَسُولَ اللهِ ﷺ فَمَنَعَنَاهَا لَا يُعْطِينَاهَا النَّاسُ بَعْدَهُ، وَإِنِّي وَاللهِ لَا أَسْأَلُهَا رَسُولَ اللهِ ﷺ.»", people: ['ali-ibn-abi-talib', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default alAbbasAndAliInHisIllness;
