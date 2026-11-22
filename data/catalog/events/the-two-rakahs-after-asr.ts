import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Ibn Abbas, Abd al-Rahman ibn Azhar and al-Miswar sent Kurayb to ask Aisha about the two rak'ahs after Asr; she sent him
 * to Umm Salamah, who told how she had seen the Prophet ﷺ pray them, sent a servant girl to ask, and he answered that men
 * of Abd al-Qays had kept him from the two after Zuhr. Told from Sahih al-Bukhari 4370 (al-Maghazi, the delegation of Abd
 * al-Qays), whole. Kurayb, Abd al-Rahman ibn Azhar, al-Miswar and the servant girl are not linked.
 */
const theTwoRakahsAfterAsr = {
  kind: 'EVENT',
  slug: 'the-two-rakahs-after-asr',
  name: "الركعتان بعد العصر",
  nameTransliterated: "The two rak'ahs after Asr",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'aisha-bint-abi-bakr' }, { person: 'umm-salamah' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: "حَدَّثَنَا يَحْيَى بْنُ سُلَيْمَانَ: حَدَّثَنِي ابْنُ وَهْبٍ: أَخْبَرَنِي عَمْرٌو وَقَالَ بَكْرُ بْنُ مُضَرَ، عَنْ عَمْرِو بْنِ الْحَارِثِ، عَنْ بُكَيْرٍ: أَنَّ كُرَيْبًا مَوْلَى ابْنِ عَبَّاسٍ حَدَّثَهُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4370, url: 'https://sunnah.com/bukhari:4370' },
      moments: [
        { title: "أرسلوا كريبا إلى عائشة", text: "«أَنَّ ابْنَ عَبَّاسٍ وَعَبْدَ الرَّحْمَنِ بْنَ أَزْهَرَ وَالْمِسْوَرَ بْنَ مَخْرَمَةَ: أَرْسَلُوا إِلَى عَائِشَةَ رضي الله عنها فَقَالُوا: اقْرَأْ عليها السلام مِنَّا جَمِيعًا، وَسَلْهَا عَنِ الرَّكْعَتَيْنِ بَعْدَ الْعَصْرِ، وَإِنَّا أُخْبِرْنَا أَنَّكِ تُصَلِّيهَا، وَقَدْ بَلَغَنَا أَنَّ النَّبِيَّ ﷺ نَهَى عَنْهَا. قَالَ ابْنُ عَبَّاسٍ: وَكُنْتُ أَضْرِبُ مَعَ عُمَرَ النَّاسَ عَنْهُمَا. قَالَ كُرَيْبٌ: فَدَخَلْتُ عَلَيْهَا وَبَلَّغْتُهَا مَا أَرْسَلُونِي، فَقَالَتْ: سَلْ أُمَّ سَلَمَةَ، فَأَخْبَرْتُهُمْ، فَرَدُّونِي إِلَى أُمِّ سَلَمَةَ بِمِثْلِ مَا أَرْسَلُونِي إِلَى عَائِشَةَ،", people: ['aisha-bint-abi-bakr', 'umm-salamah'] },
        { title: "أرسلت إليه الخادم", text: "فَقَالَتْ أُمُّ سَلَمَةَ: سَمِعْتُ النَّبِيَّ ﷺ يَنْهَى عَنْهُمَا، وَإِنَّهُ صَلَّى الْعَصْرَ، ثُمَّ دَخَلَ عَلَيَّ وَعِنْدِي نِسْوَةٌ مِنْ بَنِي حَرَامٍ مِنَ الْأَنْصَارِ، فَصَلَّاهُمَا، فَأَرْسَلْتُ إِلَيْهِ الْخَادِمَ، فَقُلْتُ: قُومِي إِلَى جَنْبِهِ، فَقُولِي: تَقُولُ أُمُّ سَلَمَةَ: يَا رَسُولَ اللهِ، أَلَمْ أَسْمَعْكَ تَنْهَى عَنْ هَاتَيْنِ الرَّكْعَتَيْنِ؟ فَأَرَاكَ تُصَلِّيهِمَا، فَإِنْ أَشَارَ بِيَدِهِ فَاسْتَأْخِرِي، فَفَعَلَتِ الْجَارِيَةُ، فَأَشَارَ بِيَدِهِ فَاسْتَأْخَرَتْ عَنْهُ،", people: ['umm-salamah', 'prophet-muhammad'] },
        { title: "«أتاني أناس من عبد القيس»", text: "فَلَمَّا انْصَرَفَ قَالَ: يَا بِنْتَ أَبِي أُمَيَّةَ، سَأَلْتِ عَنِ الرَّكْعَتَيْنِ بَعْدَ الْعَصْرِ، إِنَّهُ أَتَانِي أُنَاسٌ مِنْ عَبْدِ الْقَيْسِ بِالْإِسْلَامِ مِنْ قَوْمِهِمْ، فَشَغَلُونِي عَنِ الرَّكْعَتَيْنِ اللَّتَيْنِ بَعْدَ الظُّهْرِ، فَهُمَا هَاتَانِ».", people: ['prophet-muhammad', 'umm-salamah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theTwoRakahsAfterAsr;
