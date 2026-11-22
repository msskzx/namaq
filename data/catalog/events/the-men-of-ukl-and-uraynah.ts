import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Men of Ukl and Uraynah came to Medina professing Islam, found it unhealthy, and were sent out to the camels to drink their
 * milk; they turned from Islam, killed the herdsman and drove the camels off, and were pursued and punished. Told from
 * Sahih al-Bukhari 4192 (al-Maghazi, the chapter on Ukl and Uraynah), whole, with Qatadah's word that he afterwards urged
 * charity and forbade mutilation. 4193 tells only how Abu Qilabah cited it («ذكر القصة») and is not repeated.
 */
const theMenOfUklAndUraynah = {
  kind: 'EVENT',
  slug: 'the-men-of-ukl-and-uraynah',
  name: "العرنيون",
  nameTransliterated: "The men of Ukl and Uraynah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: "حَدَّثَنِي عَبْدُ الْأَعْلَى بْنُ حَمَّادٍ: حَدَّثَنَا يَزِيدُ بْنُ زُرَيْعٍ: حَدَّثَنَا سَعِيدٌ، عَنْ قَتَادَةَ: أَنَّ أَنَسًا  رضي الله عنه حَدَّثَهُمْ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4192, url: 'https://sunnah.com/bukhari:4192' },
      moments: [
        { title: "استوخموا المدينة", text: "«أَنَّ نَاسًا مِنْ عُكْلٍ وَعُرَيْنَةَ، قَدِمُوا الْمَدِينَةَ عَلَى النَّبِيِّ ﷺ وَتَكَلَّمُوا بِالْإِسْلَامِ، فَقَالُوا: يَا نَبِيَّ اللهِ، إِنَّا كُنَّا أَهْلَ ضَرْعٍ، وَلَمْ نَكُنْ أَهْلَ رِيفٍ، وَاسْتَوْخَمُوا الْمَدِينَةَ، فَأَمَرَهُمْ رَسُولُ اللهِ ﷺ بِذَوْدٍ وَرَاعٍ، وَأَمَرَهُمْ أَنْ يَخْرُجُوا فِيهِ فَيَشْرَبُوا مِنْ أَلْبَانِهَا وَأَبْوَالِهَا،", people: ['prophet-muhammad'] },
        { title: "كفروا بعد إسلامهم", text: "فَانْطَلَقُوا حَتَّى إِذَا كَانُوا نَاحِيَةَ الْحَرَّةِ كَفَرُوا بَعْدَ إِسْلَامِهِمْ، وَقَتَلُوا رَاعِيَ النَّبِيِّ ﷺ وَاسْتَاقُوا الذَّوْدَ، فَبَلَغَ النَّبِيَّ ﷺ فَبَعَثَ الطَّلَبَ فِي آثَارِهِمْ، فَأَمَرَ بِهِمْ فَسَمَرُوا أَعْيُنَهُمْ، وَقَطَعُوا أَيْدِيَهُمْ، وَتُرِكُوا فِي نَاحِيَةِ الْحَرَّةِ حَتَّى مَاتُوا عَلَى حَالِهِمْ.", people: ['prophet-muhammad'] },
        { title: "ينهى عن المثلة", text: "قَالَ قَتَادَةُ: بَلَغَنَا أَنَّ النَّبِيَّ ﷺ بَعْدَ ذَلِكَ كَانَ يَحُثُّ عَلَى الصَّدَقَةِ، وَيَنْهَى عَنِ الْمُثْلَةِ». وَقَالَ شُعْبَةُ وَأَبَانُ وَحَمَّادٌ عَنْ قَتَادَةَ: مِنْ عُرَيْنَةَ وَقَالَ يَحْيَى بْنُ أَبِي كَثِيرٍ وَأَيُّوبُ عَنْ أَبِي قِلَابَةَ عَنْ أَنَسٍ: قَدِمَ نَفَرٌ مِنْ عُكْلٍ.", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theMenOfUklAndUraynah;
