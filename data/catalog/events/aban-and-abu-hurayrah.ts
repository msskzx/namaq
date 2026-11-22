import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At Khaybar Abu Hurayrah told the Prophet ﷺ that Aban ibn Sa'id was the killer of Ibn Qawqal, and Aban answered him
 * «واعجبا لك، وبر تدأدأ من قدوم ضأن، ينعى علي امرأ أكرمه الله بيدي». Told from Sahih al-Bukhari (al-Maghazi, the chapter on
 * Khaybar), each hadith whole: 4239 first, which names Aban; then 4237, whole, folded, whose «فقال» is Aban, as 4239 names
 * him. 4238, which al-Bukhari gives with «ويذكر عن الزبيدي», is left out. Ibn Qawqal has no catalog subject and is not
 * linked.
 */
const abanAndAbuHurayrah = {
  kind: 'EVENT',
  slug: 'aban-and-abu-hurayrah',
  name: "أبان بن سعيد وأبو هريرة",
  nameTransliterated: "Aban ibn Sa'id and Abu Hurayrah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'aban-ibn-said' }, { person: 'prophet-muhammad' }, { person: 'abu-hurayrah' }],
  reports: [
    {
      isnad: "حَدَّثَنَا مُوسَى بْنُ إِسْمَاعِيلَ: حَدَّثَنَا عَمْرُو بْنُ يَحْيَى بْنِ سَعِيدٍ قَالَ: أَخْبَرَنِي جَدِّي:",
      source: { slug: 'sahih-al-bukhari', hadith: 4239, url: 'https://sunnah.com/bukhari:4239' },
      moments: [
        { title: "«هذا قاتل ابن قوقل»", text: "«أَنَّ أَبَانَ بْنَ سَعِيدٍ أَقْبَلَ إِلَى النَّبِيِّ ﷺ فَسَلَّمَ عَلَيْهِ، فَقَالَ أَبُو هُرَيْرَةَ: يَا رَسُولَ اللهِ، هَذَا قَاتِلُ ابْنِ قَوْقَلٍ،", people: ['aban-ibn-said', 'prophet-muhammad', 'abu-hurayrah'] },
        { title: "«ينعى علي امرأ أكرمه الله بيدي»", text: "وَقَالَ أَبَانُ لِأَبِي هُرَيْرَةَ: وَاعَجَبَا لَكَ، وَبْرٌ تَدَأْدَأَ مِنْ قَدُومِ ضَأْنٍ، يَنْعَى عَلَيَّ امْرَأً أَكْرَمَهُ اللهُ بِيَدِي، وَمَنَعَهُ أَنْ يُهِينَنِي بِيَدِهِ.»", people: ['aban-ibn-said', 'abu-hurayrah'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا عَلِيُّ بْنُ عَبْدِ اللهِ: حَدَّثَنَا سُفْيَانُ قَالَ: سَمِعْتُ الزُّهْرِيَّ، وَسَأَلَهُ إِسْمَاعِيلُ بْنُ أُمَيَّةَ، قَالَ: أَخْبَرَنِي عَنْبَسَةُ بْنُ سَعِيدٍ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4237, url: 'https://sunnah.com/bukhari:4237' },
      moments: [
        { title: "«لا تعطه»", text: "«أَنَّ أَبَا هُرَيْرَةَ رضي الله عنه أَتَى النَّبِيَّ ﷺ فَسَأَلَهُ، قَالَ لَهُ بَعْضُ بَنِي سَعِيدِ بْنِ الْعَاصِ: لَا تُعْطِهِ،", people: ['abu-hurayrah', 'prophet-muhammad'] },
        { title: "«هذا قاتل ابن قوقل»", text: "فَقَالَ أَبُو هُرَيْرَةَ: هَذَا قَاتِلُ ابْنِ قَوْقَلٍ، فَقَالَ: وَا عَجَبَاهْ لِوَبْرٍ، تَدَلَّى مِنْ قَدُومِ الضَّأْنِ»", people: ['abu-hurayrah', 'aban-ibn-said'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abanAndAbuHurayrah;
