import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Khalid ibn al-Walid called Banu Jadhimah to islam; not knowing how to say «أسلمنا» they said «صبأنا صبأنا», and he killed
 * and took captives and ordered each man to kill his captive; Ibn Umar refused, and the Prophet ﷺ raised his hands twice,
 * «اللهم إني أبرأ إليك مما صنع خالد». Told from Sahih al-Bukhari 4339 (al-Maghazi, the sending of Khalid to Banu
 * Jadhimah), whole. Ibn Umar, who tells it, has no catalog subject.
 */
const khalidAndBanuJadhimah = {
  kind: 'EVENT',
  slug: 'khalid-and-banu-jadhimah',
  name: "خالد وبنو جذيمة",
  nameTransliterated: "Khalid and Banu Jadhimah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'khalid-ibn-al-walid' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنِي مَحْمُودٌ: حَدَّثَنَا عَبْدُ الرَّزَّاقِ: أَخْبَرَنَا مَعْمَرٌ وَحَدَّثَنِي نُعَيْمٌ: أَخْبَرَنَا عَبْدُ اللهِ: أَخْبَرَنَا مَعْمَرٌ، عَنِ الزُّهْرِيِّ، عَنْ سَالِمٍ، عَنْ أَبِيهِ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4339, url: 'https://sunnah.com/bukhari:4339' },
      moments: [
        { title: "«صبأنا صبأنا»", text: "«بَعَثَ النَّبِيُّ ﷺ خَالِدَ بْنَ الْوَلِيدِ إِلَى بَنِي جَذِيمَةَ، فَدَعَاهُمْ إِلَى الْإِسْلَامِ، فَلَمْ يُحْسِنُوا أَنْ يَقُولُوا: أَسْلَمْنَا، فَجَعَلُوا يَقُولُونَ: صَبَأْنَا صَبَأْنَا، فَجَعَلَ خَالِدٌ يَقْتُلُ مِنْهُمْ وَيَأْسِرُ، وَدَفَعَ إِلَى كُلِّ رَجُلٍ مِنَّا أَسِيرَهُ،", people: ['prophet-muhammad', 'khalid-ibn-al-walid'] },
        { title: "«والله لا أقتل أسيري»", text: "حَتَّى إِذَا كَانَ يَوْمٌ أَمَرَ خَالِدٌ أَنْ يَقْتُلَ كُلُّ رَجُلٍ مِنَّا أَسِيرَهُ، فَقُلْتُ: وَاللهِ لَا أَقْتُلُ أَسِيرِي، وَلَا يَقْتُلُ رَجُلٌ مِنْ أَصْحَابِي أَسِيرَهُ،", people: ['khalid-ibn-al-walid'] },
        { title: "«اللهم إني أبرأ إليك مما صنع خالد»", text: "حَتَّى قَدِمْنَا عَلَى النَّبِيِّ ﷺ فَذَكَرْنَاهُ، فَرَفَعَ النَّبِيُّ ﷺ يَدَهُ فَقَالَ: اللَّهُمَّ إِنِّي أَبْرَأُ إِلَيْكَ مِمَّا صَنَعَ خَالِدٌ مَرَّتَيْنِ.»", people: ['prophet-muhammad', 'khalid-ibn-al-walid'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default khalidAndBanuJadhimah;
