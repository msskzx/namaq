import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ visited Sa'd ibn Abi Waqqas in the year of the Farewell Hajj, in an illness that brought him near death;
 * Sa'd asked to give two thirds of his wealth in charity, then half, and was told «الثلث، والثلث كثير», and feared being
 * left behind after his companions; the Prophet ﷺ prayed that their hijra be completed for them and grieved for Sa'd ibn
 * Khawlah, who died at Makkah. Told from Sahih al-Bukhari 3936 (Manaqib al-Ansar, the chapter on «اللهم أمض لأصحابي
 * هجرتهم»), whole, with al-Bukhari's notes on Ahmad ibn Yunus's wording. Sa'd ibn Khawlah has no catalog subject and is
 * not linked.
 */
const theProphetVisitsSaadInHisIllness = {
  kind: 'EVENT',
  slug: 'the-prophet-visits-saad-in-his-illness',
  name: "عيادة النبي ﷺ سعد بن أبي وقاص",
  nameTransliterated: "The Prophet visits Sa'd ibn Abi Waqqas in his illness",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'saad-ibn-abi-waqqas' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا يَحْيَى بْنُ قَزَْعَةَ: حَدَّثَنَا إِبْرَاهِيمُ، عَنِ الزُّهْرِيِّ، عَنْ عَامِرِ بْنِ سَعْدِ بْنِ مَالِكٍ، عَنْ أَبِيهِ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3936, url: 'https://sunnah.com/bukhari:3936' },
      moments: [
        { title: "عاده عام حجة الوداع", text: "«عَادَنِي النَّبِيُّ ﷺ عَامَ حَجَّةِ الْوَدَاعِ مِنْ مَرَضٍ أَشْفَيْتُ مِنْهُ عَلَى الْمَوْتِ،", people: ['saad-ibn-abi-waqqas', 'prophet-muhammad'] },
        { title: "«الثلث، والثلث كثير»", text: "فَقُلْتُ: يَا رَسُولَ اللهِ، بَلَغَ بِي مِنَ الْوَجَعِ مَا تَرَى، وَأَنَا ذُو مَالٍ، وَلَا يَرِثُنِي إِلَّا ابْنَةٌ لِي وَاحِدَةٌ، أَفَأَتَصَدَّقُ بِثُلُثَيْ مَالِي؟ قَالَ: لَا قَالَ: فَأَتَصَدَّقُ بِشَطْرِهِ؟ قَالَ: الثُّلُثُ يَا سَعْدُ، وَالثُّلُثُ كَثِيرٌ، إِنَّكَ أَنْ تَذَرَ ذُرِّيَّتَكَ أَغْنِيَاءَ، خَيْرٌ مِنْ أَنْ تَذَرَهُمْ عَالَةً يَتَكَفَّفُونَ النَّاسَ", people: ['saad-ibn-abi-waqqas', 'prophet-muhammad'] },
        { title: "«حتى اللقمة تجعلها في في امرأتك»", text: "قَالَ أَحْمَدُ بْنُ يُونُسَ، عن إِبْرَاهِيمَ: أَنْ تَذرَ ذُرِّيَّتَكَ وَلَسْتَ بِنَافِقٍ نَفَقَةً تَبْتَغِي بِهَا وَجْهَ اللهِ إِلَّا آجَرَكَ اللهُ بِهَا، حَتَّى اللُّقْمَةَ تَجْعَلُهَا فِي فِي امْرَأَتِكَ", people: ['prophet-muhammad'] },
        { title: "«اللهم أمض لأصحابي هجرتهم»", text: "قُلْتُ: يَا رَسُولَ اللهِ، أُخَلَّفُ بَعْدَ أَصْحَابِي؟ قَالَ: إِنَّكَ لَنْ تُخَلَّفَ، فَتَعْمَلَ عَمَلًا تَبْتَغِي بِهِ وَجْهَ اللهِ إِلَّا ازْدَدْتَ بِهِ دَرَجَةً وَرِفْعَةً، وَلَعَلَّكَ تُخَلَّفُ حَتَّى يَنْتَفِعَ بِكَ أَقْوَامٌ، وَيُضَرَّ بِكَ آخَرُونَ، اللَّهُمَّ أَمْضِ لِأَصْحَابِي هِجْرَتَهُمْ، وَلَا تَرُدَّهُمْ عَلَى أَعْقَابِهِمْ،", people: ['saad-ibn-abi-waqqas', 'prophet-muhammad'] },
        { title: "«لكن البائس سعد بن خولة»", text: "لَكِنِ الْبَائِسُ سَعْدُ بْنُ خَوْلَةَ يَرْثِي لَهُ رَسُولُ اللهِ ﷺ أَنْ تُوُفِّيَ بِمَكَّةَ.» وَقَالَ أَحْمَدُ بْنُ يُونُسَ وَمُوسَى، عَنْ إِبْرَاهِيمَ: أَنْ تَذَرَ وَرَثَتَكَ.", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theProphetVisitsSaadInHisIllness;
