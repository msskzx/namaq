import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Harithah was killed at Badr as a boy; his mother came to the Prophet ﷺ asking whether he was in Paradise, and he said
 * «أوجنة واحدة هي، إنها جنان كثيرة، وإنه في جنة الفردوس». Told from Sahih al-Bukhari 3982 (al-Maghazi, the virtue of
 * those who were at Badr), whole. His mother is not named and is not linked.
 */
const theMotherOfHarithah = {
  kind: 'EVENT',
  slug: 'the-mother-of-harithah',
  name: "أم حارثة",
  nameTransliterated: "The mother of Harithah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'harithah-ibn-suraqah' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنِي عَبْدُ اللهِ بْنُ مُحَمَّدٍ: حَدَّثَنَا مُعَاوِيَةُ بْنُ عَمْرٍو: حَدَّثَنَا أَبُو إِسْحَاقَ، عَنْ حُمَيْدٍ قَالَ: سَمِعْتُ أَنَسًا  رضي الله عنه يَقُولُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3982, url: 'https://sunnah.com/bukhari:3982' },
      moments: [
        { title: "«قد عرفت منزلة حارثة مني»", text: "«أُصِيبَ حَارِثَةُ يَوْمَ بَدْرٍ وَهُوَ غُلَامٌ، فَجَاءَتْ أُمُّهُ إِلَى النَّبِيِّ ﷺ فَقَالَتْ: يَا رَسُولَ اللهِ، قَدْ عَرَفْتَ مَنْزِلَةَ حَارِثَةَ مِنِّي، فَإِنْ يَكُنْ فِي الْجَنَّةِ أَصْبِرْ وَأَحْتَسِبْ، وَإِنْ تَكُ الْأُخْرَى تَرَى مَا أَصْنَعُ،", people: ['harithah-ibn-suraqah', 'prophet-muhammad'] },
        { title: "«إنها جنان كثيرة»", text: "فَقَالَ: وَيْحَكِ، أَوَهَبِلْتِ، أَوَجَنَّةٌ وَاحِدَةٌ هِيَ، إِنَّهَا جِنَانٌ كَثِيرَةٌ، وَإِنَّهُ فِي جَنَّةِ الْفِرْدَوْسِ».", people: ['prophet-muhammad', 'harithah-ibn-suraqah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theMotherOfHarithah;
