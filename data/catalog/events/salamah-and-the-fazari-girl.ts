import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * In the raid on Fazarah under Abu Bakr, Salamah ibn al-Akwa' stopped a band of women and children with an arrow and drove
 * them in, and Abu Bakr gave him a girl from among them; twice in the market the Prophet ﷺ asked «يا سلمة! هب لي
 * المرأة», Salamah gave her, and he sent her to Makkah to ransom Muslims held there. Told from Sahih Muslim 1755 (al-Jihad,
 * ransoming Muslims with captives), whole.
 */
const salamahAndTheFazariGirl = {
  kind: 'EVENT',
  slug: 'salamah-and-the-fazari-girl',
  name: "سلمة وجارية فزارة",
  nameTransliterated: "Salamah and the girl of Fazarah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-bakr-as-siddiq' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنَا زُهَيْرُ بْنُ حَرْبٍ. حَدَّثَنَا عُمَرُ بْنُ يُونُسَ. حَدَّثَنَا عكرمة بن عمار. حدثني إياس بن سلمة. حَدَّثَنِي أَبِي قَالَ:",
      source: { slug: 'sahih-muslim', hadith: 1755, url: 'https://sunnah.com/muslim:1755' },
      moments: [
        { title: "غزونا فزارة وعلينا أبو بكر", text: "غَزَوْنَا فَزَارَةَ وَعَلَيْنَا أَبُو بَكْرٍ. أَمَّرَهُ رَسُولُ اللَّهِ ﷺ عَلَيْنَا. فَلَمَّا كَانَ بَيْنَنَا وَبَيْنَ الْمَاءِ سَاعَةٌ، أَمَرَنَا أَبُو بَكْرٍ فَعَرَّسْنَا. ثُمَّ شَنَّ الْغَارَةَ. فَوَرَدَ الْمَاءَ. فَقَتَلَ مَنْ قَتَلَ عَلَيْهِ، وَسَبَى. وَأَنْظُرُ إِلَى عُنُقٍ مِنَ النَّاسِ. فِيهِمُ الذَّرَارِيُّ. فَخَشِيتُ أَنْ يَسْبِقُونِي إِلَى الْجَبَلِ. فَرَمَيْتُ بِسَهْمٍ بَيْنهُمْ وَبَيْنَ الْجَبَلِ. فَلَمَّا رَأَوْا السَّهْمَ وَقَفُوا. فَجِئْتُ بِهِمْ أَسُوقُهُمْ. وَفِيهِمُ امْرَأَةٌ مِنْ بَنِي فَزَارَةَ. عَلَيْهَا قَشْعٌ مِنْ أَدَمٍ. (قَالَ: الْقَشْعُ النِّطَعُ) مَعَهَا ابْنَةٌ لَهَا مِنْ أَحْسَنِ الْعَرَبِ. فَسُقْتُهُمْ حَتَّى أَتَيْتُ بِهِمْ أَبَا بَكْرٍ فَنَفَّلَنِي أَبُو بَكْرٍ ابْنَتَهَا.", people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
        { title: "«يا سلمة! هب لي المرأة»", text: "فَقَدِمْنَا الْمَدِينَةَ وَمَا كَشَفْتُ لَهَا ثَوْبًا. فَلَقِيَنِي رَسُولُ اللَّهِ ﷺ فِي السُّوقِ. فَقَالَ (يَا سَلَمَةُ! هَبْ لِي الْمَرْأَةَ). فَقُلْتُ: يَا رَسُولَ اللَّهِ! وَاللَّهِ! لَقَدْ أَعْجَبَتْنِي. وَمَا كَشَفْتُ لَهَا ثَوْبًا. ثُمَّ لَقِيَنِي رَسُولُ اللَّهِ ﷺ مِنَ الْغَدِ فِي السُّوقِ. فَقَالَ لِي (يَا سَلَمَةُ! هَبْ لِي الْمَرْأَةَ. لِلَّهِ أَبُوكَ!) فَقُلْتُ: هِيَ لَكَ. يَا رَسُولَ اللَّهِ! فَوَاللَّهِ! مَا كَشَفْتُ لَهَا ثَوْبًا.", people: ['prophet-muhammad'] },
        { title: "ففدى بها ناسا من المسلمين", text: "فَبَعَثَ بِهَا رسول الله ﷺ إلى أَهْلِ مَكَّةَ. فَفَدَى بِهَا نَاسًا مِنَ الْمُسْلِمِينَ، كانوا أسروا بمكة.", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default salamahAndTheFazariGirl;
