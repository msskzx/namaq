import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Banu Tamim came and the Prophet ﷺ said «أبشروا»; they said «قد بشرتنا فأعطنا» and his face changed, then people from
 * Yemen came and he said «اقبلوا البشرى إذ لم يقبلها بنو تميم», and they accepted. Told from Imran ibn Husayn's hadith in
 * Sahih al-Bukhari, each whole: 4386 (the coming of the Ash'aris and the people of Yemen) first, then 4365 (the delegation
 * of Banu Tamim).
 */
const banuTamimAndTheGoodNews = {
  kind: 'EVENT',
  slug: 'banu-tamim-and-the-good-news',
  name: "بنو تميم والبشرى",
  nameTransliterated: "Banu Tamim and the good news",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنِي عَمْرُو بْنُ عَلِيٍّ: حَدَّثَنَا أَبُو عَاصِمٍ: حَدَّثَنَا سُفْيَانُ: حَدَّثَنَا أَبُو صَخْرَةَ جَامِعُ بْنُ شَدَّادٍ: حَدَّثَنَا صَفْوَانُ بْنُ مُحْرِزٍ الْمَازِنِيُّ: حَدَّثَنَا عِمْرَانُ بْنُ حُصَيْنٍ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4386, url: 'https://sunnah.com/bukhari:4386' },
      moments: [
        { title: "«أبشروا يا بني تميم»", text: "«جَاءَتْ بَنُو تَمِيمٍ إِلَى رَسُولِ اللهِ ﷺ فَقَالَ: أَبْشِرُوا يَا بَنِي تَمِيمٍ، قَالُوا: أَمَّا إِذْ بَشَّرْتَنَا، فَأَعْطِنَا، فَتَغَيَّرَ وَجْهُ رَسُولِ اللهِ ﷺ،", people: ['prophet-muhammad'] },
        { title: "«اقبلوا البشرى إذ لم يقبلها بنو تميم»", text: "فَجَاءَ نَاسٌ مِنْ أَهْلِ الْيَمَنِ، فَقَالَ النَّبِيُّ ﷺ: اقْبَلُوا الْبُشْرَى إِذْ لَمْ يَقْبَلْهَا بَنُو تَمِيمٍ، قَالُوا: قَدْ قَبِلْنَا يَا رَسُولَ اللهِ».", people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا أَبُو نُعَيْمٍ: حَدَّثَنَا سُفْيَانُ، عَنْ أَبِي صَخْرَةَ، عَنْ صَفْوَانَ بْنِ مُحْرِزٍ الْمَازِنِيِّ، عَنْ عِمْرَانَ بْنِ حُصَيْنٍ  رضي الله عنهما قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4365, url: 'https://sunnah.com/bukhari:4365' },
      moments: [
        { title: "«اقبلوا البشرى يا بني تميم»", text: "«أَتَى نَفَرٌ مِنْ بَنِي تَمِيمٍ النَّبِيَّ ﷺ، فَقَالَ: اقْبَلُوا الْبُشْرَى يَا بَنِي تَمِيمٍ، قَالُوا: يَا رَسُولَ اللهِ، قَدْ بَشَّرْتَنَا فَأَعْطِنَا، فَرِيءَ ذَلِكَ فِي وَجْهِهِ،", people: ['prophet-muhammad'] },
        { title: "«قد قبلنا يا رسول الله»", text: "فَجَاءَ نَفَرٌ مِنَ الْيَمَنِ، فَقَالَ: اقْبَلُوا الْبُشْرَى إِذْ لَمْ يَقْبَلْهَا بَنُو تَمِيمٍ، قَالُوا: قَدْ قَبِلْنَا يَا رَسُولَ اللهِ».", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default banuTamimAndTheGoodNews;
