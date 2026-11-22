import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * On his way to the Prophet ﷺ Abu Hurayrah recited «يا ليلة من طولها وعنائها» and a slave of his ran off; as he sat with
 * the Prophet ﷺ after his pledge the slave appeared, «يا أبا هريرة، هذا غلامك», and he freed him for Allah. Told from Sahih
 * al-Bukhari 4393 (al-Maghazi, the story of Daws and al-Tufayl), whole.
 */
const abuHurayrahComes = {
  kind: 'EVENT',
  slug: 'abu-hurayrah-comes',
  name: "قدوم أبي هريرة",
  nameTransliterated: "Abu Hurayrah comes to the Prophet",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-hurayrah' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: "حَدَّثَنِي مُحَمَّدُ بْنُ الْعَلَاءِ: حَدَّثَنَا أَبُو أُسَامَةَ: حَدَّثَنَا إِسْمَاعِيلُ، عَنْ قَيْسٍ، عَنْ أَبِي هُرَيْرَةَ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4393, url: 'https://sunnah.com/bukhari:4393' },
      moments: [
        { title: "«يا ليلة من طولها وعنائها»", text: "«لَمَّا قَدِمْتُ عَلَى النَّبِيِّ ﷺ، قُلْتُ فِي الطَّرِيقِ: يَا لَيْلَةً مِنْ طُولِهَا وَعَنَائِهَا … عَلَى أَنَّهَا مِنْ دَارَةِ الْكُفْرِ نَجَّتِ وَأَبَقَ غُلَامٌ لِي فِي الطَّرِيقِ،", people: ['abu-hurayrah'] },
        { title: "«هو لوجه الله»", text: "فَلَمَّا قَدِمْتُ عَلَى النَّبِيِّ ﷺ، فَبَايَعْتُهُ، فَبَيْنَا أَنَا عِنْدَهُ إِذْ طَلَعَ الْغُلَامُ، فَقَالَ لِي النَّبِيُّ ﷺ: يَا أَبَا هُرَيْرَةَ، هَذَا غُلَامُكَ، فَقُلْتُ: هُوَ لِوَجْهِ اللهِ فَأَعْتَقْتُهُ.»", people: ['abu-hurayrah', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abuHurayrahComes;
