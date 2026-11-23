import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ announced the Najashi's death on the day he died, «مات اليوم رجل صالح», called him their brother Ashamah,
 * lined them up at the musalla and prayed over him with four takbirs. Told from Sahih al-Bukhari, each hadith whole, as
 * its chapter on the Najashi's death (Manaqib al-Ansar) gives them: Jabir's 3877 first for his words, then Abu Hurayrah's 3880 and
 * 3881 (al-Bukhari's own continuation of the chain «وعن صالح»), then Jabir's 3878 and 3879.
 */
const deathOfTheNajashi = {
  kind: 'EVENT',
  slug: 'death-of-the-najashi',
  name: "موت النجاشي والصلاة عليه",
  nameTransliterated: "The death of the Najashi and the prayer over him",
  type: 'DEATH',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'an-najashi' }, { person: 'jabir-ibn-abdullah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا أَبُو الرَّبِيعِ: حَدَّثَنَا ابْنُ عُيَيْنَةَ، عَنِ ابْنِ جُرَيْجٍ، عَنْ عَطَاءٍ، عَنْ جَابِرٍ  رضي الله عنه:",
      source: { slug: 'sahih-al-bukhari', hadith: 3877, url: 'https://sunnah.com/bukhari:3877' },
      moments: [
        {
          title: "«مات اليوم رجل صالح»",
          text: "«قَالَ النَّبِيُّ ﷺ حِينَ مَاتَ النَّجَاشِيُّ: مَاتَ الْيَوْمَ رَجُلٌ صَالِحٌ، فَقُومُوا فَصَلُّوا عَلَى أَخِيكُمْ أَصْحَمَةَ.»",
          people: ['prophet-muhammad', 'an-najashi'],
          turns: [
            { text: "«قَالَ النَّبِيُّ ﷺ حِينَ مَاتَ النَّجَاشِيُّ: مَاتَ الْيَوْمَ رَجُلٌ صَالِحٌ، فَقُومُوا فَصَلُّوا عَلَى أَخِيكُمْ أَصْحَمَةَ.»", speaker: { person: 'prophet-muhammad', name: "النبي ﷺ" }, lead: "«قَالَ النَّبِيُّ ﷺ حِينَ مَاتَ النَّجَاشِيُّ:" },
          ],
        },
      ],
    },
    {
      isnad: "حَدَّثَنَا زُهَيْرُ بْنُ حَرْبٍ: حَدَّثَنَا يَعْقُوبُ بْنُ إِبْرَاهِيمَ: حَدَّثَنَا أَبِي، عَنْ صَالِحٍ، عَنِ ابْنِ شِهَابٍ قَالَ: حَدَّثَنِي أَبُو سَلَمَةَ بْنُ عَبْدِ الرَّحْمَنِ وَابْنُ الْمُسَيَّبِ: أَنَّ أَبَا هُرَيْرَةَ  رضي الله عنه أَخْبَرَهُمَا:",
      source: { slug: 'sahih-al-bukhari', hadith: 3880, url: 'https://sunnah.com/bukhari:3880' },
      moments: [
        { title: "نعاه في اليوم الذي مات فيه", text: "«أَنَّ رَسُولَ اللهِ ﷺ نَعَى لَهُمُ النَّجَاشِيَّ، صَاحِبَ الْحَبَشَةِ، فِي الْيَوْمِ الَّذِي مَاتَ فِيهِ،", people: ['prophet-muhammad', 'an-najashi'] },
        { title: "«استغفروا لأخيكم»", text: "وَقَالَ: اسْتَغْفِرُوا لِأَخِيكُمْ».", people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: "وَعَنْ صَالِحٍ، عَنِ ابْنِ شِهَابٍ قَالَ: حَدَّثَنِي سَعِيدُ بْنُ الْمُسَيَّبِ: أَنَّ أَبَا هُرَيْرَةَ  رضي الله عنه أَخْبَرَهُمْ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3881, url: 'https://sunnah.com/bukhari:3881' },
      moments: [
        { title: "صفّ بهم في المصلى", text: "«أَنَّ رَسُولَ اللهِ ﷺ صَفَّ بِهِمْ فِي الْمُصَلَّى، فَصَلَّى عَلَيْهِ، وَكَبَّرَ أَرْبَعًا.»", people: ['prophet-muhammad', 'an-najashi'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا عَبْدُ الْأَعْلَى بْنُ حَمَّادٍ: حَدَّثَنَا يَزِيدُ بْنُ زُرَيْعٍ: حَدَّثَنَا سَعِيدٌ: حَدَّثَنَا قَتَادَةُ: أَنَّ عَطَاءً حَدَّثَهُمْ، عَنْ جَابِرِ بْنِ عَبْدِ اللهِ الْأَنْصَارِيِّ  رضي الله عنهما:",
      source: { slug: 'sahih-al-bukhari', hadith: 3878, url: 'https://sunnah.com/bukhari:3878' },
      moments: [
        { title: "في الصف الثاني أو الثالث", text: "«أَنَّ نَبِيَّ اللهِ ﷺ صَلَّى عَلَى النَّجَاشِيِّ، فَصَفَّنَا وَرَاءَهُ، فَكُنْتُ فِي الصَّفِّ الثَّانِي أَوِ الثَّالِثِ».", people: ['prophet-muhammad', 'an-najashi', 'jabir-ibn-abdullah'] },
      ],
    },
    {
      isnad: "حَدَّثَنِي عَبْدُ اللهِ بْنُ أَبِي شَيْبَةَ: حَدَّثَنَا يَزِيدُ، عَنْ سَلِيمِ بْنِ حَيَّانَ: حَدَّثَنَا سَعِيدُ بْنُ مِينَاءَ، عَنْ جَابِرِ بْنِ عَبْدِ اللهِ  رضي الله عنهما:",
      source: { slug: 'sahih-al-bukhari', hadith: 3879, url: 'https://sunnah.com/bukhari:3879' },
      moments: [
        { title: "كبّر عليه أربعا", text: "«أَنَّ النَّبِيَّ ﷺ صَلَّى عَلَى أَصْحَمَةَ النَّجَاشِيِّ، فَكَبَّرَ عَلَيْهِ أَرْبَعًا.» تَابَعَهُ عَبْدُ الصَّمَدِ.", people: ['prophet-muhammad', 'an-najashi'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default deathOfTheNajashi;
