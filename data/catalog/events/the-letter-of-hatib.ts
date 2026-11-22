import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ sent Ali, Abu Marthad and al-Zubayr to Rawdat Khakh after a woman carrying a letter from Hatib ibn Abi
 * Balta'ah to the mushrikun; they brought it back, Umar asked to strike his neck, Hatib gave his reason, and the Prophet ﷺ
 * said «صدق، ولا تقولوا له إلا خيرا… أليس من أهل بدر؟». Told from Sahih al-Bukhari 3983 (al-Maghazi, the virtue of those
 * who were at Badr), whole. Abu Marthad has no catalog subject and is not linked. Other tellings in the book (3007, 4274)
 * fall in later batches and should be weighed here when they come.
 */
const theLetterOfHatib = {
  kind: 'EVENT',
  slug: 'the-letter-of-hatib',
  name: "كتاب حاطب بن أبي بلتعة",
  nameTransliterated: "Hatib ibn Abi Balta'ah's letter",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'ali-ibn-abi-talib' }, { person: 'az-zubayr-ibn-al-awwam' }, { person: 'prophet-muhammad' }, { person: 'hatib-ibn-abi-baltaah' }, { person: 'umar-ibn-al-khattab' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنِي إِسْحَاقُ بْنُ إِبْرَاهِيمَ: أَخْبَرَنَا عَبْدُ اللهِ بْنُ إِدْرِيسَ قَالَ: سَمِعْتُ حُصَيْنَ بْنَ عَبْدِ الرَّحْمَنِ، عَنْ سَعْدِ بْنِ عُبَيْدَةَ، عَنْ أَبِي عَبْدِ الرَّحْمَنِ السُّلَمِيِّ، عَنْ عَلِيٍّ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3983, url: 'https://sunnah.com/bukhari:3983' },
      moments: [
        { title: "«انطلقوا حتى تأتوا روضة خاخ»", text: "«بَعَثَنِي رَسُولُ اللهِ ﷺ وَأَبَا مَرْثَدٍ وَالزُّبَيْرَ، وَكُلُّنَا فَارِسٌ، قَالَ: انْطَلِقُوا حَتَّى تَأْتُوا رَوْضَةَ خَاخٍ، فَإِنَّ بِهَا امْرَأَةً مِنَ الْمُشْرِكِينَ، مَعَهَا كِتَابٌ مِنْ حَاطِبِ بْنِ أَبِي بَلْتَعَةَ إِلَى الْمُشْرِكِينَ.", people: ['ali-ibn-abi-talib', 'az-zubayr-ibn-al-awwam', 'prophet-muhammad', 'hatib-ibn-abi-baltaah'] },
        { title: "«ما كذب رسول الله ﷺ»", text: "فَأَدْرَكْنَاهَا تَسِيرُ عَلَى بَعِيرٍ لَهَا حَيْثُ قَالَ رَسُولُ اللهِ ﷺ، فَقُلْنَا: الْكِتَابَ، فَقَالَتْ: مَا مَعَنَا كِتَابٌ، فَأَنَخْنَاهَا فَالْتَمَسْنَا فَلَمْ نَرَ كِتَابًا، فَقُلْنَا: مَا كَذَبَ رَسُولُ اللهِ ﷺ، لَتُخْرِجِنَّ الْكِتَابَ أَوْ لَنُجَرِّدَنَّكِ، فَلَمَّا رَأَتِ الْجِدَّ أَهْوَتْ إِلَى حُجْزَتِهَا، وَهِيَ مُحْتَجِزَةٌ بِكِسَاءٍ، فَأَخْرَجَتْهُ،", people: ['prophet-muhammad'] },
        { title: "«دعني فلأضرب عنقه»", text: "فَانْطَلَقْنَا بِهَا إِلَى رَسُولِ اللهِ ﷺ، فَقَالَ عُمَرُ: يَا رَسُولَ اللهِ، قَدْ خَانَ اللهَ وَرَسُولَهُ وَالْمُؤْمِنِينَ، فَدَعْنِي فَلَأَضْرِبْ عُنُقَهُ.", people: ['prophet-muhammad', 'umar-ibn-al-khattab'] },
        { title: "«ما حملك على ما صنعت»", text: "فَقَالَ النَّبِيُّ ﷺ: مَا حَمَلَكَ عَلَى مَا صَنَعْتَ. قَالَ حَاطِبٌ: وَاللهِ مَا بِي أَنْ لَا أَكُونَ مُؤْمِنًا بِاللهِ وَرَسُولِهِ ﷺ، أَرَدْتُ أَنْ يَكُونَ لِي عِنْدَ الْقَوْمِ يَدٌ يَدْفَعُ اللهُ بِهَا عَنْ أَهْلِي وَمَالِي، وَلَيْسَ أَحَدٌ مِنْ أَصْحَابِكَ إِلَّا لَهُ هُنَاكَ مِنْ عَشِيرَتِهِ مَنْ يَدْفَعُ اللهُ بِهِ عَنْ أَهْلِهِ وَمَالِهِ. فَقَالَ النَّبِيُّ ﷺ: صَدَقَ، وَلَا تَقُولُوا لَهُ إِلَّا خَيْرًا.", people: ['prophet-muhammad', 'hatib-ibn-abi-baltaah'] },
        { title: "«لعل الله اطلع إلى أهل بدر»", text: "فَقَالَ عُمَرُ: إِنَّهُ قَدْ خَانَ اللهَ وَرَسُولَهُ وَالْمُؤْمِنِينَ، فَدَعْنِي فَلأَضْرِبَ عُنُقَهُ. فَقَالَ: أَلَيْسَ مِنْ أَهْلِ بَدْرٍ؟ فَقَالَ: لَعَلَّ اللهَ اطَّلَعَ إِلَى أَهْلِ بَدْرٍ فَقَالَ: اعْمَلُوا مَا شِئْتُمْ، فَقَدْ وَجَبَتْ لَكُمُ الْجَنَّةُ، أَوْ: فَقَدْ غَفَرْتُ لَكُمْ. فَدَمَعَتْ عَيْنَا عُمَرَ، وَقَالَ: اللهُ وَرَسُولُهُ أَعْلَمُ.»", people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theLetterOfHatib;
