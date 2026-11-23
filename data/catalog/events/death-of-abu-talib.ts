import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Year -3, from al-Waqidi's قبل الهجرة بثلاث سنين for the exit from the
 * shi'b: he and Khadijah both died in that year, which the chapter says in the
 * same sentence. al-Dhahabi rejects the report that he said the
 * كلمة at the end: al-Abbas was still on his jahiliyyah when he claimed to have
 * heard it, the Prophet answered لم أسمع, and Ali called him الشيخ الضال after
 * he died. The description keeps what the sound reports say.
 *
 * Told as a story from Sahih al-Bukhari 3884 (Manaqib al-Ansar, «قصة أبي طالب»), whole, with the two ayat it
 * says came down (al-Tawbah 113, al-Qasas 56). 3883 and 3885 in the same chapter are about his state in the hereafter, not
 * his death, so they are not told here.
 */
const deathOfAbuTalib = {
  kind: 'EVENT',
  slug: 'death-of-abu-talib',
  name: 'وفاة أبي طالب',
  nameTransliterated: 'The Death of Abu Talib',
  type: 'DEATH',
  fields: {
    hijriYear: { value: -3, claims: ['sira/shib-exit-year'] },
    description: {
      value:
        'لما حضرته الوفاة دخل عليه النبي صلى الله عليه وسلم وعنده أبو جهل وعبد الله بن أبي أمية، فقال: يا عم قل لا إله إلا الله أحاج لك بها عند الله، فكان آخر كلمة أن قال: على ملة عبد المطلب. ومات هو وخديجة في عام واحد.',
      claims: ['sira/death-abu-talib'],
    },
  },
  people: [{ person: 'abu-talib', claims: ['sira/death-abu-talib'] }, { person: 'prophet-muhammad' }, { person: 'abu-jahl-ibn-hisham' }],
  tags: ['REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      about: 'abu-talib',
      from: '9:113',
      to: '9:113',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 3884, url: 'https://sunnah.com/bukhari:3884', quote: "فَقَالَ النَّبِيُّ ﷺ: لَأَسْتَغْفِرَنَّ لَكَ مَا لَمْ أُنْهَ عَنْهُ فَنَزَلَتْ: ﴿مَا كَانَ لِلنَّبِيِّ وَالَّذِينَ آمَنُوا أَنْ يَسْتَغْفِرُوا لِلْمُشْرِكِينَ وَلَوْ كَانُوا أُولِي قُرْبَى مِنْ بَعْدِ مَا تَبَيَّنَ لَهُمْ أَنَّهُمْ أَصْحَابُ الْجَحِيمِ﴾" }],
    },
    {
      kind: 'REVEALED_ABOUT',
      about: 'abu-talib',
      from: '28:56',
      to: '28:56',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 3884, url: 'https://sunnah.com/bukhari:3884', quote: "وَنَزَلَتْ: ﴿إِنَّكَ لا تَهْدِي مَنْ أَحْبَبْتَ﴾" }],
    },
  ],
  reports: [
    {
      isnad: "حَدَّثَنَا مَحْمُودٌ: حَدَّثَنَا عَبْدُ الرَّزَّاقِ: أَخْبَرَنَا مَعْمَرٌ، عَنِ الزُّهْرِيِّ، عَنِ ابْنِ الْمُسَيَّبِ، عَنْ أَبِيهِ",
      source: { slug: 'sahih-al-bukhari', hadith: 3884, url: 'https://sunnah.com/bukhari:3884' },
      moments: [
        {
          title: "«أي عم، قل لا إله إلا الله»",
          text: "«أَنَّ أَبَا طَالِبٍ لَمَّا حَضَرَتْهُ الْوَفَاةُ، دَخَلَ عَلَيْهِ النَّبِيُّ ﷺ وَعِنْدَهُ أَبُو جَهْلٍ، فَقَالَ: أَيْ عَمِّ، قُلْ لَا إِلَهَ إِلَّا اللهُ، كَلِمَةً أُحَاجُّ لَكَ بِهَا عِنْدَ اللهِ",
          people: ['abu-talib', 'prophet-muhammad', 'abu-jahl-ibn-hisham'],
          turns: [
            { text: "«أَنَّ أَبَا طَالِبٍ لَمَّا حَضَرَتْهُ الْوَفَاةُ، دَخَلَ عَلَيْهِ النَّبِيُّ ﷺ وَعِنْدَهُ أَبُو جَهْلٍ، فَقَالَ: أَيْ عَمِّ، قُلْ لَا إِلَهَ إِلَّا اللهُ، كَلِمَةً أُحَاجُّ لَكَ بِهَا عِنْدَ اللهِ" },
          ],
        },
        {
          title: "«ترغب عن ملة عبد المطلب»",
          text: "فَقَالَ أَبُو جَهْلٍ وَعَبْدُ اللهِ بْنُ أَبِي أُمَيَّةَ: يَا أَبَا طَالِبٍ، تَرْغَبُ عَنْ مِلَّةِ عَبْدِ الْمُطَّلِبِ،",
          people: ['abu-jahl-ibn-hisham', 'abu-talib'],
          turns: [
            { text: "فَقَالَ أَبُو جَهْلٍ وَعَبْدُ اللهِ بْنُ أَبِي أُمَيَّةَ: يَا أَبَا طَالِبٍ، تَرْغَبُ عَنْ مِلَّةِ عَبْدِ الْمُطَّلِبِ،", speaker: { name: "أبو جهل وعبد الله بن أبي أمية" }, lead: "فَقَالَ أَبُو جَهْلٍ وَعَبْدُ اللهِ بْنُ أَبِي أُمَيَّةَ:" },
          ],
        },
        {
          title: "«على ملة عبد المطلب»",
          text: "فَلَمْ يَزَالَا يُكَلِّمَانِهِ، حَتَّى قَالَ آخِرَ شَيْءٍ كَلَّمَهُمْ بِهِ: عَلَى مِلَّةِ عَبْدِ الْمُطَّلِبِ،",
          people: ['abu-talib'],
          turns: [
            { text: "فَلَمْ يَزَالَا يُكَلِّمَانِهِ، حَتَّى قَالَ آخِرَ شَيْءٍ كَلَّمَهُمْ بِهِ: عَلَى مِلَّةِ عَبْدِ الْمُطَّلِبِ،" },
          ],
        },
        {
          title: "«لأستغفرن لك ما لم أنه عنه»",
          text: "فَقَالَ النَّبِيُّ ﷺ: لَأَسْتَغْفِرَنَّ لَكَ مَا لَمْ أُنْهَ عَنْهُ",
          people: ['prophet-muhammad', 'abu-talib'],
          turns: [
            { text: "فَقَالَ النَّبِيُّ ﷺ: لَأَسْتَغْفِرَنَّ لَكَ مَا لَمْ أُنْهَ عَنْهُ", speaker: { person: 'prophet-muhammad', name: "النبي ﷺ" }, lead: "فَقَالَ النَّبِيُّ ﷺ:" },
          ],
        },
        {
          title: "فنزلت",
          text: "فَنَزَلَتْ: ﴿مَا كَانَ لِلنَّبِيِّ وَالَّذِينَ آمَنُوا أَنْ يَسْتَغْفِرُوا لِلْمُشْرِكِينَ وَلَوْ كَانُوا أُولِي قُرْبَى مِنْ بَعْدِ مَا تَبَيَّنَ لَهُمْ أَنَّهُمْ أَصْحَابُ الْجَحِيمِ﴾ وَنَزَلَتْ: ﴿إِنَّكَ لا تَهْدِي مَنْ أَحْبَبْتَ﴾.»",
          people: [],
          turns: [
            { text: "فَنَزَلَتْ: ﴿مَا كَانَ لِلنَّبِيِّ وَالَّذِينَ آمَنُوا أَنْ يَسْتَغْفِرُوا لِلْمُشْرِكِينَ وَلَوْ كَانُوا أُولِي قُرْبَى مِنْ بَعْدِ مَا تَبَيَّنَ لَهُمْ أَنَّهُمْ أَصْحَابُ الْجَحِيمِ﴾ وَنَزَلَتْ: ﴿إِنَّكَ لا تَهْدِي مَنْ أَحْبَبْتَ﴾.»" },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default deathOfAbuTalib;
