import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * As his illness grew the Prophet ﷺ asked his wives' leave to be nursed in Aisha's house and walked out between al-Abbas and
 * another man his feet trailing on the ground; there he said «هريقوا علي من سبع قرب لم تحلل أوكيتهن، لعلي أعهد إلى
 * الناس», they poured water over him in a tub, and he went out, prayed with the people and addressed them. Told from Sahih
 * al-Bukhari 4442 (al-Maghazi, the illness of the Prophet ﷺ), whole. Aisha does not name the other man; Ibn Abbas in the
 * same hadith says «هو علي», and Ali is linked from that moment. Hafsah is named only as the owner of the tub.
 */
const hisIllnessInAishasHouse = {
  kind: 'EVENT',
  slug: 'his-illness-in-aishas-house',
  name: "تمريضه ﷺ في بيت عائشة",
  nameTransliterated: "His illness in Aisha's house",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'aisha-bint-abi-bakr' }, { person: 'al-abbas-ibn-abd-al-muttalib' }, { person: 'ali-ibn-abi-talib' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا سَعِيدُ بْنُ عُفَيْرٍ، قَالَ: حَدَّثَنِي اللَّيْثُ، قَالَ: حَدَّثَنِي عُقَيْلٌ، عَنِ ابْنِ شِهَابٍ، قَالَ: أَخْبَرَنِي عُبَيْدُ اللهِ بْنُ عَبْدِ اللهِ بْنِ عُتْبَةَ بْنِ مَسْعُودٍ: أَنَّ عَائِشَةَ زَوْجَ النَّبِيِّ ﷺ قَالَتْ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4442, url: 'https://sunnah.com/bukhari:4442' },
      moments: [
        { title: "يمرض في بيتي", text: "«لَمَّا ثَقُلَ رَسُولُ اللهِ ﷺ وَاشْتَدَّ بِهِ وَجَعُهُ، اسْتَأْذَنَ أَزْوَاجَهُ أَنْ يُمَرَّضَ فِي بَيْتِي، فَأَذِنَّ لَهُ، فَخَرَجَ وَهُوَ بَيْنَ الرَّجُلَيْنِ تَخُطُّ رِجْلَاهُ فِي الْأَرْضِ، بَيْنَ عَبَّاسِ بْنِ عَبْدِ الْمُطَّلِبِ وَبَيْنَ رَجُلٍ آخَرَ.", people: ['prophet-muhammad', 'aisha-bint-abi-bakr', 'al-abbas-ibn-abd-al-muttalib'] },
        { title: "«هو علي»", text: "قَالَ عُبَيْدُ اللهِ: فَأَخْبَرْتُ عَبْدَ اللهِ بِالَّذِي قَالَتْ عَائِشَةُ، فَقَالَ لِي عَبْدُ اللهِ بْنُ عَبَّاسٍ: هَلْ تَدْرِي مَنِ الرَّجُلُ الْآخَرُ الَّذِي لَمْ تُسَمِّ عَائِشَةُ؟ قَالَ: قُلْتُ: لَا، قَالَ ابْنُ عَبَّاسٍ: هُوَ عَلِيٌّ،", people: ['ali-ibn-abi-talib'] },
        { title: "«هريقوا علي من سبع قرب»", text: "وَكَانَتْ عَائِشَةُ زَوْجُ النَّبِيِّ ﷺ تُحَدِّثُ: أَنَّ رَسُولَ اللهِ ﷺ لَمَّا دَخَلَ بَيْتِي وَاشْتَدَّ بِهِ وَجَعُهُ قَالَ: هَرِيقُوا عَلَيَّ مِنْ سَبْعِ قِرَبٍ، لَمْ تُحْلَلْ أَوْكِيَتُهُنَّ، لَعَلِّي أَعْهَدُ إِلَى النَّاسِ، فَأَجْلَسْنَاهُ فِي مِخْضَبٍ لِحَفْصَةَ زَوْجِ النَّبِيِّ ﷺ، ثُمَّ طَفِقْنَا نَصُبُّ عَلَيْهِ مِنْ تِلْكَ الْقِرَبِ، حَتَّى طَفِقَ يُشِيرُ إِلَيْنَا بِيَدِهِ: أَنْ قَدْ فَعَلْتُنَّ، قَالَتْ: ثُمَّ خَرَجَ إِلَى النَّاسِ فَصَلَّى لَهُمْ وَخَطَبَهُمْ.»", people: ['prophet-muhammad', 'aisha-bint-abi-bakr'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default hisIllnessInAishasHouse;
