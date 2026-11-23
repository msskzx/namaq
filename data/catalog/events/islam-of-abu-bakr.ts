import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Ammar ibn Yasir saw the Prophet ﷺ when there were with him only five slaves, two women and Abu Bakr. Told from Sahih
 * al-Bukhari 3857, the one hadith of its chapter on Abu Bakr's islam (Manaqib al-Ansar), whole.
 */
const islamOfAbuBakr = {
  kind: 'EVENT',
  slug: 'islam-of-abu-bakr',
  name: "إسلام أبي بكر الصديق",
  nameTransliterated: "The Islam of Abu Bakr al-Siddiq",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-bakr-as-siddiq' }, { person: 'prophet-muhammad' }, { person: 'ammar-ibn-yasir' }],
  tags: ['ISLAM'],
  reports: [
    {
      isnad: "حَدَّثَنِي عَبْدُ اللهِ بْنُ حَمَّادٍ الْآمُلِيُّ قَالَ: حَدَّثَنِي يَحْيَى بْنُ مَعِينٍ: حَدَّثَنَا إِسْمَاعِيلُ بْنُ مُجَالِدٍ، عَنْ بَيَانٍ، عَنْ وَبَرَةَ، عَنْ هَمَّامِ بْنِ الْحَارِثِ",
      source: { slug: 'sahih-al-bukhari', hadith: 3857, url: 'https://sunnah.com/bukhari:3857' },
      moments: [
        { title: "«وما معه إلا خمسة أعبد وامرأتان وأبو بكر»", text: "قَالَ: قَالَ عَمَّارُ بْنُ يَاسِرٍ: «رَأَيْتُ رَسُولَ اللهِ ﷺ وَمَا مَعَهُ إِلَّا خَمْسَةُ أَعْبُدٍ وَامْرَأَتَانِ، وَأَبُو بَكْرٍ.»", people: ['ammar-ibn-yasir', 'prophet-muhammad', 'abu-bakr-as-siddiq'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default islamOfAbuBakr;
