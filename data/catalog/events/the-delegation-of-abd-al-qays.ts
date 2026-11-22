import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The delegation of Abd al-Qays came, «مرحبا بالقوم، غير خزايا ولا الندامى»; cut off by the mushrikun of Mudar except in
 * the sacred months, they asked for a few things that would bring them into Paradise, and he gave them four commands and
 * four prohibitions. Told from Ibn Abbas's hadith in Sahih al-Bukhari (al-Maghazi, the delegation of Abd al-Qays), each
 * whole: Abu Jamrah's 4368 first, which he tells in answer to a question on nabidh; then 4369. 4370 (the two rak'ahs after
 * Asr) is its own event; 4371 is a note on Juwatha.
 */
const theDelegationOfAbdAlQays = {
  kind: 'EVENT',
  slug: 'the-delegation-of-abd-al-qays',
  name: "وفد عبد القيس",
  nameTransliterated: "The delegation of Abd al-Qays",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنِي إِسْحَاقُ: أَخْبَرَنَا أَبُو عَامِرٍ الْعَقَدِيُّ: حَدَّثَنَا قُرَّةُ، عَنْ أَبِي جَمْرَةَ،",
      source: { slug: 'sahih-al-bukhari', hadith: 4368, url: 'https://sunnah.com/bukhari:4368' },
      moments: [
        { title: "سأل ابن عباس عن النبيذ", text: "«قُلْتُ لِابْنِ عَبَّاسٍ رضي الله عنهما: إِنَّ لِي جَرَّةً يُنْتَبَذُ لِي نَبِيذٌ، فَأَشْرَبُهُ حُلْوًا فِي جَرٍّ، إِنْ أَكْثَرْتُ مِنْهُ فَجَالَسْتُ الْقَوْمَ فَأَطَلْتُ الْجُلُوسَ خَشِيتُ أَنْ أَفْتَضِحَ،", people: [] },
        { title: "«مرحبا بالقوم»", text: "فَقَالَ: قَدِمَ وَفْدُ عَبْدِ الْقَيْسِ عَلَى رَسُولِ اللهِ ﷺ، فَقَالَ: مَرْحَبًا بِالْقَوْمِ، غَيْرَ خَزَايَا وَلَا النَّدَامَى، فَقَالُوا: يَا رَسُولَ اللهِ، إِنَّ بَيْنَنَا وَبَيْنَكَ الْمُشْرِكِينَ مِنْ مُضَرَ، وَإِنَّا لَا نَصِلُ إِلَيْكَ إِلَّا فِي أَشْهُرِ الْحُرُمِ، حَدِّثْنَا بِجُمَلٍ مِنَ الْأَمْرِ: إِنْ عَمِلْنَا بِهِ دَخَلْنَا الْجَنَّةَ، وَنَدْعُو بِهِ مَنْ وَرَاءَنَا،", people: ['prophet-muhammad'] },
        { title: "«آمركم بأربع وأنهاكم عن أربع»", text: "قَالَ: آمُرُكُمْ بِأَرْبَعٍ وَأَنْهَاكُمْ عَنْ أَرْبَعٍ، الْإِيمَانِ بِاللهِ، هَلْ تَدْرُونَ مَا الْإِيمَانُ بِاللهِ؟ شَهَادَةُ أَنْ لَا إِلَهَ إِلَّا اللهُ، وَإِقَامُ الصَّلَاةِ، وَإِيتَاءُ الزَّكَاةِ، وَصَوْمُ رَمَضَانَ، وَأَنْ تُعْطُوا مِنَ الْمَغَانِمِ الْخُمُسَ، وَأَنْهَاكُمْ عَنْ أَرْبَعٍ: مَا انْتُبِذَ فِي الدُّبَّاءِ وَالنَّقِيرِ وَالْحَنْتَمِ وَالْمُزَفَّتِ».", people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا سُلَيْمَانُ بْنُ حَرْبٍ: حَدَّثَنَا حَمَّادُ بْنُ زَيْدٍ، عَنْ أَبِي جَمْرَةَ قَالَ: سَمِعْتُ ابْنَ عَبَّاسٍ يَقُولُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4369, url: 'https://sunnah.com/bukhari:4369' },
      moments: [
        { title: "«إنا هذا الحي من ربيعة»", text: "«قَدِمَ وَفْدُ عَبْدِ الْقَيْسِ عَلَى النَّبِيِّ ﷺ، فَقَالُوا: يَا رَسُولَ اللهِ، إِنَّا هَذَا الْحَيَّ مِنْ رَبِيعَةَ، وَقَدْ حَالَتْ بَيْنَنَا وَبَيْنَكَ كُفَّارُ مُضَرَ، فَلَسْنَا نَخْلُصُ إِلَيْكَ إِلَّا فِي شَهْرٍ حَرَامٍ، فَمُرْنَا بِأَشْيَاءَ نَأْخُذُ بِهَا وَنَدْعُو إِلَيْهَا مَنْ وَرَاءَنَا،", people: ['prophet-muhammad'] },
        { title: "«آمركم بأربع، وأنهاكم عن أربع»", text: "قَالَ: آمُرُكُمْ بِأَرْبَعٍ، وَأَنْهَاكُمْ عَنْ أَرْبَعٍ، الْإِيمَانِ بِاللهِ: شَهَادَةِ أَنْ لَا إِلَهَ إِلَّا اللهُ وَعَقَدَ وَاحِدَةً وَإِقَامِ الصَّلَاةِ، وَإِيتَاءِ الزَّكَاةِ، وَأَنْ تُؤَدُّوا لِلهِ خُمْسَ مَا غَنِمْتُمْ، وَأَنْهَاكُمْ عَنِ الدُّبَّاءِ وَالنَّقِيرِ وَالْحَنْتَمِ وَالْمُزَفَّتِ».", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theDelegationOfAbdAlQays;
