import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * In the year of the conquest the Prophet ﷺ rode in with Usamah behind him, had Uthman ibn Talhah bring the key and went
 * into the House with Usamah, Bilal and Uthman, staying a long while; Ibn Umar, first in after them, asked Bilal where he had
 * prayed. Ibn Abbas tells that he would not enter while the gods were in it, had them brought out, among them images of
 * Ibrahim and Isma'il holding divining arrows («قاتلهم الله»), then said takbir in its corners and came out without
 * praying in it. The two do not agree on the prayer and both are kept whole. Told from Sahih al-Bukhari, each hadith whole:
 * Ibn Umar's 4400 first (al-Maghazi, the farewell hajj, though it says «عام الفتح»), the fullest; then 4289, given by
 * al-Bukhari with «وقال الليث»; then Ibn Abbas's 4288.
 */
const theProphetEntersTheKaaba = {
  kind: 'EVENT',
  slug: 'the-prophet-enters-the-kaaba',
  name: "دخوله ﷺ الكعبة عام الفتح",
  nameTransliterated: "The Prophet enters the Ka'bah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'usamah-ibn-zaid' }, { person: 'bilal-ibn-rabah' }, { person: 'uthman-ibn-talhah' }],
  reports: [
    {
      isnad: "حَدَّثَنِي مُحَمَّدٌ: حَدَّثَنَا سُرَيْجُ بْنُ النُّعْمَانِ: حَدَّثَنَا فُلَيْحٌ، عَنْ نَافِعٍ، عَنِ ابْنِ عُمَرَ  رضي الله عنهما قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4400, url: 'https://sunnah.com/bukhari:4400' },
      moments: [
        { title: "«ائتنا بالمفتاح»", text: "«أَقْبَلَ النَّبِيُّ ﷺ عَامَ الْفَتْحِ وَهُوَ مُرْدِفٌ أُسَامَةَ عَلَى الْقَصْوَاءِ، وَمَعَهُ بِلَالٌ، وَعُثْمَانُ بْنُ طَلْحَةَ، حَتَّى أَنَاخَ عِنْدَ الْبَيْتِ، ثُمَّ قَالَ لِعُثْمَانَ: ائْتِنَا بِالْمِفْتَاحِ، فَجَاءَهُ بِالْمِفْتَاحِ، فَفَتَحَ لَهُ الْبَابَ، فَدَخَلَ النَّبِيُّ ﷺ وَأُسَامَةُ وَبِلَالٌ وَعُثْمَانُ، ثُمَّ أَغْلَقُوا عَلَيْهِمِ الْبَابَ،", people: ['prophet-muhammad', 'usamah-ibn-zaid', 'bilal-ibn-rabah', 'uthman-ibn-talhah'] },
        { title: "سأل بلالا أين صلى", text: "فَمَكَثَ نَهَارًا طَوِيلًا، ثُمَّ خَرَجَ، وَابْتَدَرَ النَّاسُ الدُّخُولَ فَسَبَقْتُهُمْ، فَوَجَدْتُ بِلَالًا قَائِمًا مِنْ وَرَاءِ الْبَابِ، فَقُلْتُ لَهُ: أَيْنَ صَلَّى رَسُولُ اللهِ ﷺ؟ فَقَالَ: صَلَّى بَيْنَ ذَيْنِكَ الْعَمُودَيْنِ الْمُقَدَّمَيْنِ، وَكَانَ الْبَيْتُ عَلَى سِتَّةِ أَعْمِدَةٍ سَطْرَيْنِ، صَلَّى بَيْنَ الْعَمُودَيْنِ مِنَ السَّطْرِ الْمُقَدَّمِ، وَجَعَلَ بَابَ الْبَيْتِ خَلْفَ ظَهْرِهِ، وَاسْتَقْبَلَ بِوَجْهِهِ الَّذِي يَسْتَقْبِلُكَ حِينَ تَلِجُ الْبَيْتَ بَيْنَهُ وَبَيْنَ الْجِدَارِ، قَالَ: وَنَسِيتُ أَنْ أَسْأَلَهُ كَمْ صَلَّى، وَعِنْدَ الْمَكَانِ الَّذِي صَلَّى فِيهِ مَرْمَرَةٌ حَمْرَاءُ».", people: ['bilal-ibn-rabah', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: "وَقَالَ اللَّيْثُ حَدَّثَنِي يُونُسُ قَالَ أَخْبَرَنِي نَافِعٌ عَنْ عَبْدِ اللهِ بْنِ عُمَرَ  رضي الله عنهما",
      source: { slug: 'sahih-al-bukhari', hadith: 4289, url: 'https://sunnah.com/bukhari:4289' },
      moments: [
        { title: "أمره أن يأتي بمفتاح البيت", text: "«أَنَّ رَسُولَ اللهِ ﷺ أَقْبَلَ يَوْمَ الْفَتْحِ مِنْ أَعْلَى مَكَّةَ عَلَى رَاحِلَتِهِ مُرْدِفًا أُسَامَةَ بْنَ زَيْدٍ وَمَعَهُ بِلَالٌ وَمَعَهُ عُثْمَانُ بْنُ طَلْحَةَ مِنَ الْحَجَبَةِ حَتَّى أَنَاخَ فِي الْمَسْجِدِ فَأَمَرَهُ أَنْ يَأْتِيَ بِمِفْتَاحِ الْبَيْتِ فَدَخَلَ رَسُولُ اللهِ ﷺ وَمَعَهُ أُسَامَةُ بْنُ زَيْدٍ وَبِلَالٌ وَعُثْمَانُ بْنُ طَلْحَةَ فَمَكَثَ فِيهِ نَهَارًا طَوِيلًا", people: ['prophet-muhammad', 'usamah-ibn-zaid', 'bilal-ibn-rabah', 'uthman-ibn-talhah'] },
        { title: "سأل بلالا أين صلى", text: "ثُمَّ خَرَجَ فَاسْتَبَقَ النَّاسُ فَكَانَ عَبْدُ اللهِ بْنُ عُمَرَ أَوَّلَ مَنْ دَخَلَ فَوَجَدَ بِلَالًا وَرَاءَ الْبَابِ قَائِمًا فَسَأَلَهُ أَيْنَ صَلَّى رَسُولُ اللهِ ﷺ فَأَشَارَ لَهُ إِلَى الْمَكَانِ الَّذِي صَلَّى فِيهِ قَالَ عَبْدُ اللهِ فَنَسِيتُ أَنْ أَسْأَلَهُ كَمْ صَلَّى مِنْ سَجْدَةٍ».", people: ['bilal-ibn-rabah', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنِي إِسْحَاقُ: حَدَّثَنَا عَبْدُ الصَّمَدِ قَالَ: حَدَّثَنِي أَبِي: حَدَّثَنَا أَيُّوبُ، عَنْ عِكْرِمَةَ، عَنِ ابْنِ عَبَّاسٍ  رضي الله عنهما:",
      source: { slug: 'sahih-al-bukhari', hadith: 4288, url: 'https://sunnah.com/bukhari:4288' },
      moments: [
        { title: "«قاتلهم الله»", text: "«أَنَّ رَسُولَ اللهِ ﷺ لَمَّا قَدِمَ مَكَّةَ، أَبَى أَنْ يَدْخُلَ الْبَيْتَ وَفِيهِ الْآلِهَةُ، فَأَمَرَ بِهَا فَأُخْرِجَتْ، فَأُخْرِجَ صُورَةُ إِبْرَاهِيمَ وَإِسْمَاعِيلَ فِي أَيْدِيهِمَا مِنَ الْأَزْلَامِ، فَقَالَ النَّبِيُّ ﷺ: قَاتَلَهُمُ اللهُ، لَقَدْ عَلِمُوا: مَا اسْتَقْسَمَا بِهَا قَطُّ.", people: ['prophet-muhammad'] },
        { title: "كبر في نواحي البيت", text: "ثُمَّ دَخَلَ الْبَيْتَ، فَكَبَّرَ فِي نَوَاحِي الْبَيْتِ، وَخَرَجَ وَلَمْ يُصَلِّ فِيهِ» تَابَعَهُ مَعْمَرٌ، عَنْ أَيُّوبَ. وَقَالَ وُهَيْبٌ: حَدَّثَنَا أَيُّوبُ، عَنْ عِكْرِمَةَ، عَنِ النَّبِيِّ ﷺ.", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theProphetEntersTheKaaba;
