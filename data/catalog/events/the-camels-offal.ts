import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * While the Prophet ﷺ was prostrating with men of Quraysh around him, Uqbah ibn Abi Mu'ayt threw a camel's offal on his
 * back; Fatimah took it off and prayed against whoever did it, and he prayed against the chiefs of Quraysh by name. Ibn
 * Mas'ud saw them killed at Badr. Told from Sahih al-Bukhari 3854 (Manaqib al-Ansar), whole. Of those named in the du'a,
 * Shaybah ibn Rabi'ah and Ubayy ibn Khalaf have no catalog subject and are not linked; Umayyah is linked though Shu'bah
 * doubts whether it was Umayyah or Ubayy, as the text says, because al-Bukhari settles it himself after Shu'bah's doubt
 * in 2934: «وَقَالَ شُعْبَةُ: أُمَيَّةُ أَوْ أُبَيٌّ وَالصَّحِيحُ أُمَيَّةُ». Then 3960 (al-Maghazi, the chapter on the du'a against
 * Shaybah, Utbah, al-Walid and Abu Jahl), the same hadith by another route, whole, folded; al-Walid ibn Utbah has no
 * catalog subject and is not linked.
 * Then Ibn Mas'ud's telling in Sahih Muslim 1794 (al-Jihad, the chapter on what the Prophet ﷺ met from the mushrikun),
 * whole, folded, naming Abu Jahl as the one who asked for it; Shaybah and al-Walid ibn Uqbah (whom Abu Ishaq calls a slip)
 * are not linked.
 */
const theCamelsOffal = {
  kind: 'EVENT',
  slug: 'the-camels-offal',
  name: "سلى الجزور على ظهره ﷺ",
  nameTransliterated: "The camel's offal on his back",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'uqba-ibn-abi-muayt' }, { person: 'fatimah-bint-muhammad' }, { person: 'abu-jahl-ibn-hisham' }, { person: 'utbah-ibn-rabiah' }, { person: 'umayyah-ibn-khalaf' }, { person: 'abdullah-ibn-masud' }],
  reports: [
    {
      isnad: "حَدَّثَنِي مُحَمَّدُ بْنُ بَشَّارٍ: حَدَّثَنَا غُنْدَرٌ: حَدَّثَنَا شُعْبَةُ، عَنْ أَبِي إِسْحَاقَ، عَنْ عَمْرِو بْنِ مَيْمُونٍ، عَنْ عَبْدِ اللهِ  رضي الله عنه",
      source: { slug: 'sahih-al-bukhari', hadith: 3854, url: 'https://sunnah.com/bukhari:3854' },
      moments: [
        {
          title: "سلى الجزور على ظهره",
          text: "قَالَ: «بَيْنَا النَّبِيُّ ﷺ سَاجِدٌ، وَحَوْلَهُ نَاسٌ مِنْ قُرَيْشٍ، جَاءَ عُقْبَةُ بْنُ أَبِي مُعَيْطٍ بِسَلَى جَزُورٍ، فَقَذَفَهُ عَلَى ظَهْرِ النَّبِيِّ ﷺ، فَلَمْ يَرْفَعْ رَأْسَهُ،",
          people: ['prophet-muhammad', 'uqba-ibn-abi-muayt'],
          turns: [
            { text: "قَالَ: «بَيْنَا النَّبِيُّ ﷺ سَاجِدٌ، وَحَوْلَهُ نَاسٌ مِنْ قُرَيْشٍ، جَاءَ عُقْبَةُ بْنُ أَبِي مُعَيْطٍ بِسَلَى جَزُورٍ، فَقَذَفَهُ عَلَى ظَهْرِ النَّبِيِّ ﷺ، فَلَمْ يَرْفَعْ رَأْسَهُ،" },
          ],
        },
        {
          title: "فاطمة تأخذه عن ظهره",
          text: "فَجَاءَتْ فَاطِمَةُ عليها السلام فَأَخَذَتْهُ مِنْ ظَهْرِهِ وَدَعَتْ عَلَى مَنْ صَنَعَ،",
          people: ['fatimah-bint-muhammad', 'prophet-muhammad'],
          turns: [
            { text: "فَجَاءَتْ فَاطِمَةُ عليها السلام فَأَخَذَتْهُ مِنْ ظَهْرِهِ وَدَعَتْ عَلَى مَنْ صَنَعَ،" },
          ],
        },
        {
          title: "«اللهم عليك الملأ من قريش»",
          text: "فَقَالَ النَّبِيُّ ﷺ: اللَّهُمَّ عَلَيْكَ الْمَلَأَ مِنْ قُرَيْشٍ: أَبَا جَهْلِ بْنَ هِشَامٍ، وَعُتْبَةَ بْنَ رَبِيعَةَ، وَشَيْبَةَ بْنَ رَبِيعَةَ، وَأُمَيَّةَ بْنَ خَلَفٍ، أَوْ أُبَيَّ بْنَ خَلَفٍ شُعْبَةُ الشَّاكُّ",
          people: ['prophet-muhammad', 'abu-jahl-ibn-hisham', 'utbah-ibn-rabiah', 'umayyah-ibn-khalaf'],
          turns: [
            { text: "فَقَالَ النَّبِيُّ ﷺ: اللَّهُمَّ عَلَيْكَ الْمَلَأَ مِنْ قُرَيْشٍ: أَبَا جَهْلِ بْنَ هِشَامٍ، وَعُتْبَةَ بْنَ رَبِيعَةَ، وَشَيْبَةَ بْنَ رَبِيعَةَ، وَأُمَيَّةَ بْنَ خَلَفٍ، أَوْ أُبَيَّ بْنَ خَلَفٍ شُعْبَةُ الشَّاكُّ", speaker: { person: 'prophet-muhammad', name: "النبي ﷺ" }, lead: "فَقَالَ النَّبِيُّ ﷺ:" },
          ],
        },
        {
          title: "قُتلوا يوم بدر",
          text: "فَرَأَيْتُهُمْ قُتِلُوا يَوْمَ بَدْرٍ، فَأُلْقُوا فِي بِئْرٍ غَيْرَ أُمَيَّةَ أَوْ أُبَيٍّ، تَقَطَّعَتْ أَوْصَالُهُ، فَلَمْ يُلْقَ فِي الْبِئْرِ.»",
          people: ['abdullah-ibn-masud'],
          turns: [
            { text: "فَرَأَيْتُهُمْ قُتِلُوا يَوْمَ بَدْرٍ، فَأُلْقُوا فِي بِئْرٍ غَيْرَ أُمَيَّةَ أَوْ أُبَيٍّ، تَقَطَّعَتْ أَوْصَالُهُ، فَلَمْ يُلْقَ فِي الْبِئْرِ.»" },
          ],
        },
      ],
    },
    {
      isnad: "حَدَّثَنِي عَمْرُو بْنُ خَالِدٍ: حَدَّثَنَا زُهَيْرٌ: حَدَّثَنَا أَبُو إِسْحَاقَ، عَنْ عَمْرِو بْنِ مَيْمُونٍ، عَنْ عَبْدِ اللهِ بْنِ مَسْعُودٍ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 3960, url: 'https://sunnah.com/bukhari:3960' },
      moments: [
        { title: "دعا على نفر من قريش", text: "«اسْتَقْبَلَ النَّبِيُّ ﷺ الْكَعْبَةَ، فَدَعَا عَلَى نَفَرٍ مِنْ قُرَيْشٍ: عَلَى شَيْبَةَ بْنِ رَبِيعَةَ، وَعُتْبَةَ بْنِ رَبِيعَةَ، وَالْوَلِيدِ بْنِ عُتْبَةَ، وَأَبِي جَهْلِ بْنِ هِشَامٍ", people: ['prophet-muhammad', 'utbah-ibn-rabiah', 'abu-jahl-ibn-hisham'] },
        { title: "«لقد رأيتهم صرعى»", text: "فَأَشْهَدُ بِاللهِ، لَقَدْ رَأَيْتُهُمْ صَرْعَى، قَدْ غَيَّرَتْهُمُ الشَّمْسُ، وَكَانَ يَوْمًا حَارًّا».", people: ['abdullah-ibn-masud'] },
      ],
    },
    {
      isnad: "وحَدَّثَنَا عَبْدُ اللَّهِ بْنُ عُمَرَ بْنِ مُحَمَّدِ بْنِ أَبَانَ الْجُعْفِيُّ. حَدَّثَنَا عَبْدُ الرَّحِيمِ (يَعْنِي ابْنَ سُلَيْمَانَ) عَنْ زَكَرِيَّاءَ، عَنْ أَبِي إِسْحَاق، عَنْ عَمْرِو بْنِ مَيْمُونٍ الْأَوْدِيِّ، عَنْ ابْنِ مَسْعُودٍ. قَالَ:",
      source: { slug: 'sahih-muslim', hadith: 1794, url: 'https://sunnah.com/muslim:1794' },
      moments: [
        { title: "«أيكم يقوم إلى سلا جزور بني فلان»", text: "بَيْنَمَا رَسُولُ اللَّهِ ﷺ يُصَلِّي عِنْدَ الْبَيْتِ، وَأَبُو جَهْلٍ وَأَصْحَابٌ لَهُ جلوس، وقد نحوت جَزُورٌ بِالْأَمْسِ. فَقَالَ أَبُو جَهْلٍ: أَيُّكُمْ يَقُومُ إلى سلا جزور بني فلان فيأخذه، فيضل فِي كَتِفَيْ مُحَمَّدٍ إِذَا سَجَدَ؟ فَانْبَعَثَ أَشْقَى الْقَوْمِ فَأَخَذَهُ. فَلَمَّا سَجَدَ النَّبِيُّ ﷺ وَضَعَهُ بَيْنَ كَتِفَيْهِ. قَالَ: فَاسْتَضْحَكُوا. وَجَعَلَ بَعْضُهُمْ يَمِيلُ عَلَى بَعْضٍ. وَأَنَا قَائِمٌ أَنْظُرُ. لَوْ كَانَتْ لِي مَنَعَةٌ طَرَحْتُهُ عَنْ ظَهْرِ رَسُولِ اللَّهِ ﷺ. وَالنَّبِيُّ ﷺ سَاجِدٌ، مَا يَرْفَعُ رَأْسَهُ.", people: ['prophet-muhammad', 'abu-jahl-ibn-hisham'] },
        { title: "فطرحته عنه", text: "حَتَّى انْطَلَقَ إِنْسَانٌ فَأَخْبَرَ فَاطِمَةَ. فَجَاءَتْ، وَهِيَ جُوَيْرِيَةٌ، فَطَرَحَتْهُ عَنْهُ. ثُمَّ أَقْبَلَتْ عَلَيْهِمْ تَشْتِمُهُمْ.", people: ['fatimah-bint-muhammad', 'prophet-muhammad'] },
        { title: "«اللهم عليك بقريش»", text: "فَلَمَّا قَضَى النَّبِيُّ ﷺ صَلَاتَهُ رَفَعَ صَوْتَهُ ثُمَّ دَعَا عَلَيْهِمْ. وَكَانَ إِذَا دَعَا، دَعَا ثَلَاثًا. وَإِذَا سَأَلَ، سَأَلَ ثَلَاثًا. ثُمَّ قَالَ (اللَّهُمَّ! عَلَيْكَ بِقُرَيْشٍ) ثَلَاثَ مَرَّاتٍ. فَلَمَّا سَمِعُوا صَوْتَهُ ذَهَبَ عَنْهُمُ الضِّحْكُ. وَخَافُوا دَعْوَتَهُ. ثُمَّ قَالَ (اللَّهُمَّ! عَلَيْكَ بِأَبِي جَهْلِ بْنِ هِشَامٍ، وَعُتْبَةَ بْنِ ربيعة، وشيبة ابن رَبِيعَةَ، وَالْوَلِيدِ بْنِ عُقْبَةَ، وَأُمَيَّةَ بْنِ خَلَفٍ، وَعُقْبَةَ بْنِ أَبِي مُعَيْطٍ) (وَذَكَرَ السَّابِعَ وَلَمْ أَحْفَظْهُ)", people: ['prophet-muhammad', 'abu-jahl-ibn-hisham', 'utbah-ibn-rabiah', 'umayyah-ibn-khalaf', 'uqba-ibn-abi-muayt'] },
        { title: "«لقد رأيت الذين سمى صرعى يوم بدر»", text: "فَوَالَّذِي بَعَثَ مُحَمَّدًا ﷺ بِالْحَقِّ! لَقَدْ رَأَيْتُ الَّذِينَ سَمَّى صَرْعَى يَوْمَ بَدْرٍ. ثُمَّ سُحِبُوا إِلَى الْقَلِيبِ، قَلِيبِ بَدْرٍ. قَالَ أَبُو إِسْحَاقَ: الْوَلِيدُ بْنُ عُقْبَةَ غلط في هذا الحديث.", people: ['abdullah-ibn-masud'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theCamelsOffal;
