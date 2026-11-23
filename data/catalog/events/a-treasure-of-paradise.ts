import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * On the way to Khaybar the people raised their voices in takbir over a valley and the Prophet ﷺ said «اربعوا على أنفسكم»;
 * he heard Abu Musa behind his mount saying «لا حول ولا قوة إلا بالله» and told him it was a treasure of the treasures of
 * Paradise. Told from Sahih al-Bukhari 4205 (al-Maghazi, the chapter on Khaybar), whole.
 */
const aTreasureOfParadise = {
  kind: 'EVENT',
  slug: 'a-treasure-of-paradise',
  name: "كنز من كنوز الجنة",
  nameTransliterated: "A treasure of Paradise",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-musa-al-ashari' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا مُوسَى بْنُ إِسْمَاعِيلَ: حَدَّثَنَا عَبْدُ الْوَاحِدِ، عَنْ عَاصِمٍ، عَنْ أَبِي عُثْمَانَ، عَنْ أَبِي مُوسَى الْأَشْعَرِيِّ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4205, url: 'https://sunnah.com/bukhari:4205' },
      moments: [
        { title: "«اربعوا على أنفسكم»", text: "«لَمَّا غَزَا رَسُولُ اللهِ ﷺ خَيْبَرَ، أَوْ قَالَ: لَمَّا تَوَجَّهَ رَسُولُ اللهِ ﷺ، أَشْرَفَ النَّاسُ عَلَى وَادٍ، فَرَفَعُوا أَصْوَاتَهُمْ بِالتَّكْبِيرِ: اللهُ أَكْبَرُ اللهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللهُ، فَقَالَ رَسُولُ اللهِ ﷺ: ارْبَعُوا عَلَى أَنْفُسِكُمْ، إِنَّكُمْ لَا تَدْعُونَ أَصَمَّ وَلَا غَائِبًا، إِنَّكُمْ تَدْعُونَ سَمِيعًا قَرِيبًا، وَهُوَ مَعَكُمْ.", people: ['prophet-muhammad'] },
        { title: "«ألا أدلك على كلمة من كنز من كنوز الجنة»", text: "وَأَنَا خَلْفَ دَابَّةِ رَسُولِ اللهِ ﷺ، فَسَمِعَنِي وَأَنَا أَقُولُ: لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ، فَقَالَ لِي: يَا عَبْدَ اللهِ بْنَ قَيْسٍ قُلْتُ: لَبَّيْكَ رَسُولَ اللهِ، قَالَ: أَلَا أَدُلُّكَ عَلَى كَلِمَةٍ مِنْ كَنْزٍ مِنْ كُنُوزِ الْجَنَّةِ. قُلْتُ: بَلَى يَا رَسُولَ اللهِ، فَدَاكَ أَبِي وَأُمِّي، قَالَ: لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللهِ».", people: ['abu-musa-al-ashari', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default aTreasureOfParadise;
