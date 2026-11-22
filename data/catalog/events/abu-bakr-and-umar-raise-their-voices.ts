import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When riders of Banu Tamim came, Abu Bakr said to make al-Qa'qa' ibn Ma'bad their leader and Umar said al-Aqra' ibn Habis;
 * they argued until their voices rose, and «يا أيها الذين آمنوا لا تقدموا» was sent down about it. Told from Sahih
 * al-Bukhari 4367 (al-Maghazi, the delegation of Banu Tamim), whole. Al-Qa'qa' and al-Aqra' have no catalog subject. The
 * hadith says «حتى انقضت»; only 49:1, which it quotes, is given.
 */
const abuBakrAndUmarRaiseTheirVoices = {
  kind: 'EVENT',
  slug: 'abu-bakr-and-umar-raise-their-voices',
  name: "تماري أبي بكر وعمر في وفد تميم",
  nameTransliterated: "Abu Bakr and Umar raise their voices",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-bakr-as-siddiq' }, { person: 'umar-ibn-al-khattab' }],
  tags: ['REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '49:1',
      to: '49:1',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4367, url: 'https://sunnah.com/bukhari:4367', quote: "فَنَزَلَ فِي ذَلِكَ: ﴿يَا أَيُّهَا الَّذِينَ آمَنُوا لا تُقَدِّمُوا﴾ حَتَّى انْقَضَتْ" }],
    },
  ],
  reports: [
    {
      isnad: "حَدَّثَنِي إِبْرَاهِيمُ بْنُ مُوسَى: حَدَّثَنَا هِشَامُ بْنُ يُوسُفَ: أَنَّ ابْنَ جُرَيْجٍ أَخْبَرَهُمْ، عَنِ ابْنِ أَبِي مُلَيْكَةَ: أَنَّ عَبْدَ اللهِ بْنَ الزُّبَيْرِ أَخْبَرَهُمْ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4367, url: 'https://sunnah.com/bukhari:4367' },
      moments: [
        {
          title: "«أمر القعقاع بن معبد بن زرارة»",
          text: "«أَنَّهُ قَدِمَ رَكْبٌ مِنْ بَنِي تَمِيمٍ عَلَى النَّبِيِّ ﷺ، فَقَالَ أَبُو بَكْرٍ: أَمِّرِ الْقَعْقَاعَ بْنَ مَعْبَدِ بْنِ زُرَارَةَ، قَالَ عُمَرُ: بَلْ أَمِّرِ الْأَقْرَعَ بْنَ حَابِسٍ،",
          people: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'],
          turns: [
            { text: "«أَنَّهُ قَدِمَ رَكْبٌ مِنْ بَنِي تَمِيمٍ عَلَى النَّبِيِّ ﷺ،" },
            { text: "فَقَالَ أَبُو بَكْرٍ: أَمِّرِ الْقَعْقَاعَ بْنَ مَعْبَدِ بْنِ زُرَارَةَ،", speaker: { person: "abu-bakr-as-siddiq", name: "أبو بكر" }, lead: "فَقَالَ أَبُو بَكْرٍ:" },
            { text: "قَالَ عُمَرُ: بَلْ أَمِّرِ الْأَقْرَعَ بْنَ حَابِسٍ،", speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: "قَالَ عُمَرُ:" },
          ],
        },
        {
          title: "«ما أردت إلا خلافي»",
          text: "قَالَ أَبُو بَكْرٍ: مَا أَرَدْتَ إِلَّا خِلَافِي، قَالَ عُمَرُ: مَا أَرَدْتُ خِلَافَكَ، فَتَمَارَيَا حَتَّى ارْتَفَعَتْ أَصْوَاتُهُمَا،",
          people: ['abu-bakr-as-siddiq', 'umar-ibn-al-khattab'],
          turns: [
            { text: "قَالَ أَبُو بَكْرٍ: مَا أَرَدْتَ إِلَّا خِلَافِي،", speaker: { person: "abu-bakr-as-siddiq", name: "أبو بكر" }, lead: "قَالَ أَبُو بَكْرٍ:" },
            { text: "قَالَ عُمَرُ: مَا أَرَدْتُ خِلَافَكَ،", speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: "قَالَ عُمَرُ:" },
            { text: "فَتَمَارَيَا حَتَّى ارْتَفَعَتْ أَصْوَاتُهُمَا،" },
          ],
        },
        {
          title: "فنزل في ذلك",
          text: "فَنَزَلَ فِي ذَلِكَ: ﴿يَا أَيُّهَا الَّذِينَ آمَنُوا لا تُقَدِّمُوا﴾ حَتَّى انْقَضَتْ».",
          people: [],
          turns: [
            { text: "فَنَزَلَ فِي ذَلِكَ: ﴿يَا أَيُّهَا الَّذِينَ آمَنُوا لا تُقَدِّمُوا﴾ حَتَّى انْقَضَتْ»." },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abuBakrAndUmarRaiseTheirVoices;
