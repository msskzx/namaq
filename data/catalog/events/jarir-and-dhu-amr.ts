import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * In Yemen Jarir told Dhu Kala' and Dhu Amr about the Prophet ﷺ, and Dhu Amr said that if it was as he said, he had passed
 * his term three days ago; on the road riders from Medina said he had died and Abu Bakr was khalifah, the two went back,
 * and Dhu Amr later told Jarir the Arabs would do well while they chose their leaders. Told from Sahih al-Bukhari 4359
 * (al-Maghazi, Jarir's going to Yemen), whole. Dhu Kala' and Dhu Amr have no catalog subject.
 */
const jarirAndDhuAmr = {
  kind: 'EVENT',
  slug: 'jarir-and-dhu-amr',
  name: "جرير وذو عمرو",
  nameTransliterated: "Jarir and Dhu Amr",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'jarir-ibn-abdullah' }, { person: 'abu-bakr-as-siddiq' }],
  reports: [
    {
      isnad: "حَدَّثَنِي عَبْدُ اللهِ بْنُ أَبِي شَيْبَةَ الْعَبْسِيُّ: حَدَّثَنَا ابْنُ إِدْرِيسَ، عَنْ إِسْمَاعِيلَ بْنِ أَبِي خَالِدٍ، عَنْ قَيْسٍ، عَنْ جَرِيرٍ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4359, url: 'https://sunnah.com/bukhari:4359' },
      moments: [
        { title: "«لقد مر على أجله منذ ثلاث»", text: "«كُنْتُ بِالْبَحْرِ، فَلَقِيتُ رَجُلَيْنِ مِنْ أَهْلِ الْيَمَنِ: ذَا كَلَاعٍ وَذَا عَمْرٍو، فَجَعَلْتُ أُحَدِّثُهُمْ عَنْ رَسُولِ اللهِ ﷺ، فَقَالَ لَهُ ذُو عَمْرٍو: لَئِنْ كَانَ الَّذِي تَذْكُرُ مِنْ أَمْرِ صَاحِبِكَ، لَقَدْ مَرَّ عَلَى أَجَلِهِ مُنْذُ ثَلَاثٍ،", people: ['jarir-ibn-abdullah'] },
        { title: "«قبض رسول الله ﷺ، واستخلف أبو بكر»", text: "وَأَقْبَلَا مَعِي حَتَّى إِذَا كُنَّا فِي بَعْضِ الطَّرِيقِ، رُفِعَ لَنَا رَكْبٌ مِنْ قِبَلِ الْمَدِينَةِ فَسَأَلْنَاهُمْ، فَقَالُوا: قُبِضَ رَسُولُ اللهِ ﷺ، وَاسْتُخْلِفَ أَبُو بَكْرٍ، وَالنَّاسُ صَالِحُونَ، فَقَالَا: أَخْبِرْ صَاحِبَكَ أَنَّا قَدْ جِئْنَا وَلَعَلَّنَا سَنَعُودُ إِنْ شَاءَ اللهُ، وَرَجَعَا إِلَى الْيَمَنِ، فَأَخْبَرْتُ أَبَا بَكْرٍ بِحَدِيثِهِمْ، قَالَ: أَفَلَا جِئْتَ بِهِمْ،", people: ['jarir-ibn-abdullah', 'abu-bakr-as-siddiq'] },
        { title: "«لن تزالوا بخير»", text: "فَلَمَّا كَانَ بَعْدُ قَالَ لِي ذُو عَمْرٍو: يَا جَرِيرُ إِنَّ بِكَ عَلَيَّ كَرَامَةً، وَإِنِّي مُخْبِرُكَ خَبَرًا: إِنَّكُمْ مَعْشَرَ الْعَرَبِ، لَنْ تَزَالُوا بِخَيْرٍ مَا كُنْتُمْ إِذَا هَلَكَ أَمِيرٌ تَأَمَّرْتُمْ فِي آخَرَ، فَإِذَا كَانَتْ بِالسَّيْفِ كَانُوا مُلُوكًا، يَغْضَبُونَ غَضَبَ الْمُلُوكِ، وَيَرْضَوْنَ رِضَا الْمُلُوكِ».", people: ['jarir-ibn-abdullah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default jarirAndDhuAmr;
