import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At Uhud the Prophet ﷺ set the archers under Abd Allah and told them not to move whatever happened; when the mushrikun fled
 * they went for the spoils, and seventy were killed; Abu Sufyan called out for Muhammad, Ibn Abi Quhafah and Ibn al-Khattab,
 * and the Prophet ﷺ had them answer «الله أعلى وأجل» and «الله مولانا ولا مولى لكم». Told from Sahih al-Bukhari 4043
 * (al-Maghazi, the chapter on Uhud), whole. The archers' leader is named only «عبد الله» here and is not linked.
 */
const theArchersAndAbuSufyanAtUhud = {
  kind: 'EVENT',
  slug: 'the-archers-and-abu-sufyan-at-uhud',
  name: "الرماة وأبو سفيان يوم أحد",
  nameTransliterated: "The archers and Abu Sufyan at Uhud",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-sufyan-ibn-harb' }, { person: 'abu-bakr-as-siddiq' }, { person: 'umar-ibn-al-khattab' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا عُبَيْدُ اللهِ بْنُ مُوسَى، عَنْ إِسْرَائِيلَ، عَنْ أَبِي إِسْحَاقَ، عَنِ الْبَرَاءِ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4043, url: 'https://sunnah.com/bukhari:4043' },
      moments: [
        { title: "«لا تبرحوا»", text: "«لَقِينَا الْمُشْرِكِينَ يَوْمَئِذٍ، وَأَجْلَسَ النَّبِيُّ ﷺ جَيْشًا مِنَ الرُّمَاةِ، وَأَمَّرَ عَلَيْهِمْ عَبْدَ اللهِ، وَقَالَ: لَا تَبْرَحُوا، إِنْ رَأَيْتُمُونَا ظَهَرْنَا عَلَيْهِمْ فَلَا تَبْرَحُوا، وَإِنْ رَأَيْتُمُوهُمْ ظَهَرُوا عَلَيْنَا فَلَا تُعِينُونَا.", people: ['prophet-muhammad'] },
        { title: "«الغنيمة الغنيمة»", text: "فَلَمَّا لَقِينَا هَرَبُوا حَتَّى رَأَيْتُ النِّسَاءَ يَشْتَدِدْنَ فِي الْجَبَلِ، رَفَعْنَ عَنْ سُوقِهِنَّ، قَدْ بَدَتْ خَلَاخِلُهُنَّ، فَأَخَذُوا يَقُولُونَ: الْغَنِيمَةَ الْغَنِيمَةَ، فَقَالَ عَبْدُ اللهِ: عَهِدَ إِلَيَّ النَّبِيُّ ﷺ أَنْ لَا تَبْرَحُوا، فَأَبَوْا، فَلَمَّا أَبَوْا صُرِفَ وُجُوهُهُمْ، فَأُصِيبَ سَبْعُونَ قَتِيلًا،", people: ['prophet-muhammad'] },
        { title: "«أفي القوم محمد؟»", text: "وَأَشْرَفَ أَبُو سُفْيَانَ فَقَالَ: أَفِي الْقَوْمِ مُحَمَّدٌ؟ فَقَالَ: لَا تُجِيبُوهُ. فَقَالَ: أَفِي الْقَوْمِ ابْنُ أَبِي قُحَافَةَ؟ قَالَ: لَا تُجِيبُوهُ. فَقَالَ: أَفِي الْقَوْمِ ابْنُ الْخَطَّابِ؟ فَقَالَ: إِنَّ هَؤُلَاءِ قُتِلُوا، فَلَوْ كَانُوا أَحْيَاءً لَأَجَابُوا، فَلَمْ يَمْلِكْ عُمَرُ نَفْسَهُ، فَقَالَ: كَذَبْتَ يَا عَدُوَّ اللهِ، أَبْقَى اللهُ عَلَيْكَ مَا يُخْزِيكَ.", people: ['abu-sufyan-ibn-harb', 'prophet-muhammad', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'] },
        { title: "«الله أعلى وأجل»", text: "قَالَ أَبُو سُفْيَانَ: أُعْلُ هُبَلْ، فَقَالَ النَّبِيُّ ﷺ: أَجِيبُوهُ. قَالُوا: مَا نَقُولُ؟ قَالَ: قُولُوا: اللهُ أَعْلَى وَأَجَلُّ. قَالَ أَبُو سُفْيَانَ: لَنَا الْعُزَّى وَلَا عُزَّى لَكُمْ، فَقَالَ النَّبِيُّ ﷺ: أَجِيبُوهُ. قَالُوا: مَا نَقُولُ؟ قَالَ: قُولُوا: اللهُ مَوْلَانَا وَلَا مَوْلَى لَكُمْ.", people: ['abu-sufyan-ibn-harb', 'prophet-muhammad'] },
        { title: "«يوم بيوم بدر»", text: "قَالَ أَبُو سُفْيَانَ: يَوْمٌ بِيَوْمِ بَدْرٍ، وَالْحَرْبُ سِجَالٌ، وَتَجِدُونَ مُثْلَةً، لَمْ آمُرْ بِهَا وَلَمْ تَسُؤْنِي».", people: ['abu-sufyan-ibn-harb'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theArchersAndAbuSufyanAtUhud;
