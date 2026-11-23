import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Amr ibn Salamah's people lived by a water where riders passed, and he learned by heart what they told of the Quran; the
 * Arabs waited on the conquest, and when it came his father brought his people's islam and the Prophet's words «وليؤمكم
 * أكثركم قرآنا», and they put the boy of six or seven in front, in a cloak too short for him. Told from Sahih al-Bukhari
 * 4302 (al-Maghazi, the chapter after the conquest), whole. Amr ibn Salamah and his father have no catalog subject.
 */
const amrIbnSalamahLeadsHisPeople = {
  kind: 'EVENT',
  slug: 'amr-ibn-salamah-leads-his-people',
  name: "عمرو بن سلمة يؤم قومه",
  nameTransliterated: "Amr ibn Salamah leads his people",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['ISLAM'],
  reports: [
    {
      isnad: "حَدَّثَنَا سُلَيْمَانُ بْنُ حَرْبٍ: حَدَّثَنَا حَمَّادُ بْنُ زَيْدٍ، عَنْ أَيُّوبَ، عَنْ أَبِي قِلَابَةَ، عَنْ عَمْرِو بْنِ سَلِمَةَ قَالَ: قَالَ لِي أَبُو قِلَابَةَ: أَلَا تَلْقَاهُ فَتَسْأَلَهُ؟ قَالَ فَلَقِيتُهُ فَسَأَلْتُهُ فَقَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4302, url: 'https://sunnah.com/bukhari:4302' },
      moments: [
        { title: "كنت أحفظ ذلك الكلام", text: "«كُنَّا بِمَاءٍ مَمَرَّ النَّاسِ، وَكَانَ يَمُرُّ بِنَا الرُّكْبَانُ فَنَسْأَلُهُمْ: مَا لِلنَّاسِ، مَا لِلنَّاسِ؟ مَا هَذَا الرَّجُلُ؟ فَيَقُولُونَ: يَزْعُمُ أَنَّ اللهَ أَرْسَلَهُ، أَوْحَى إِلَيْهِ. أَوْ: أَوْحَى اللهُ بِكَذَا، فَكُنْتُ أَحْفَظُ ذَلِكَ الْكَلَامَ، وَكَأَنَّمَا يُغْرَى فِي صَدْرِي، وَكَانَتِ الْعَرَبُ تَلَوَّمُ بِإِسْلَامِهِمُ الْفَتْحَ، فَيَقُولُونَ: اتْرُكُوهُ وَقَوْمَهُ، فَإِنَّهُ إِنْ ظَهَرَ عَلَيْهِمْ فَهُوَ نَبِيٌّ صَادِقٌ،", people: [] },
        { title: "«جئتكم والله من عند النبي ﷺ حقا»", text: "فَلَمَّا كَانَتْ وَقْعَةُ أَهْلِ الْفَتْحِ، بَادَرَ كُلُّ قَوْمٍ بِإِسْلَامِهِمْ، وَبَدَرَ أَبِي قَوْمِي بِإِسْلَامِهِمْ، فَلَمَّا قَدِمَ قَالَ: جِئْتُكُمْ وَاللهِ مِنْ عِنْدِ النَّبِيِّ ﷺ حَقًّا، فَقَالَ: صَلُّوا صَلَاةَ كَذَا فِي حِينِ كَذَا، وَصَلَّوْا كَذَا فِي حِينِ كَذَا، فَإِذَا حَضَرَتِ الصَّلَاةُ فَلْيُؤَذِّنْ أَحَدُكُمْ، وَلْيَؤُمَّكُمْ أَكْثَرُكُمْ قُرْآنًا.", people: ['prophet-muhammad'] },
        { title: "«فما فرحت بشيء فرحي بذلك القميص»", text: "فَنَظَرُوا فَلَمْ يَكُنْ أَحَدٌ أَكْثَرَ قُرْآنًا مِنِّي، لِمَا كُنْتُ أَتَلَقَّى مِنَ الرُّكْبَانِ، فَقَدَّمُونِي بَيْنَ أَيْدِيهِمْ، وَأَنَا ابْنُ سِتٍّ أَوْ سَبْعِ سِنِينَ، وَكَانَتْ عَلَيَّ بُرْدَةٌ، كُنْتُ إِذَا سَجَدْتُ تَقَلَّصَتْ عَنِّي، فَقَالَتِ امْرَأَةٌ مِنَ الْحَيِّ: أَلَا تُغَطُّوا عَنَّا اسْتَ قَارِئِكُمْ؟ فَاشْتَرَوْا فَقَطَعُوا لِي قَمِيصًا، فَمَا فَرِحْتُ بِشَيْءٍ فَرَحِي بِذَلِكَ الْقَمِيصِ».", people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default amrIbnSalamahLeadsHisPeople;
