import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Ibn Mas'ud: al-Miqdad ibn al-Aswad came to the Prophet ﷺ as he prayed against the mushrikun and said «لا نقول كما قال قوم
 * موسى… ولكنا نقاتل عن يمينك وعن شمالك وبين يديك وخلفك», and the Prophet's face lit up. Told from Sahih al-Bukhari 3952
 * (al-Maghazi, the chapter on «إذ تستغيثون ربكم»), whole. Al-Miqdad cites the words of Musa's people (al-Ma'idah 24)
 * without marking them as an ayah, so no ayah range is given.
 */
const alMiqdadAtBadr = {
  kind: 'EVENT',
  slug: 'al-miqdad-at-badr',
  name: "مشهد المقداد يوم بدر",
  nameTransliterated: "Al-Miqdad at Badr",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abdullah-ibn-masud' }, { person: 'al-miqdad-ibn-amr' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: "حَدَّثَنَا أَبُو نُعَيْمٍ: حَدَّثَنَا إِسْرَائِيلُ، عَنْ مُخَارِقٍ، عَنْ طَارِقِ بْنِ شِهَابٍ قَالَ: سَمِعْتُ ابْنَ مَسْعُودٍ يَقُولُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3952, url: 'https://sunnah.com/bukhari:3952' },
      moments: [
        { title: "شهدت من المقداد مشهدا", text: "«شَهِدْتُ مِنَ الْمِقْدَادِ بْنِ الْأَسْوَدِ مَشْهَدًا، لَأَنْ أَكُونَ صَاحِبَهُ أَحَبُّ إِلَيَّ مِمَّا عُدِلَ بِهِ، أَتَى النَّبِيَّ ﷺ وَهُوَ يَدْعُو عَلَى الْمُشْرِكِينَ،", people: ['abdullah-ibn-masud', 'al-miqdad-ibn-amr', 'prophet-muhammad'] },
        { title: "«لا نقول كما قال قوم موسى»", text: "فَقَالَ: لَا نَقُولُ كَمَا قَالَ قَوْمُ مُوسَى: اذْهَبْ أَنْتَ وَرَبُّكَ فَقَاتِلَا، وَلَكِنَّا نُقَاتِلُ عَنْ يَمِينِكَ وَعَنْ شِمَالِكَ وَبَيْنَ يَدَيْكَ وَخَلْفَكَ.", people: ['al-miqdad-ibn-amr'] },
        { title: "أشرق وجهه", text: "فَرَأَيْتُ النَّبِيَّ ﷺ أَشْرَقَ وَجْهُهُ وَسَرَّهُ». يَعْنِي: قَوْلَهُ.", people: ['abdullah-ibn-masud', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default alMiqdadAtBadr;
