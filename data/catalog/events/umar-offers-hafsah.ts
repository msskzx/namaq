import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When Hafsah was widowed of Khunays ibn Hudhafah, a man of Badr, Umar offered her to Uthman, who declined, then to Abu Bakr,
 * who said nothing; the Prophet ﷺ then asked for her, and Abu Bakr told Umar he had known the Prophet ﷺ had spoken of her.
 * Told from Sahih al-Bukhari 4005 (al-Maghazi, in the chapters on Badr), whole. Khunays has no catalog subject and is not
 * linked.
 */
const umarOffersHafsah = {
  kind: 'EVENT',
  slug: 'umar-offers-hafsah',
  name: "عرض عمر حفصة",
  nameTransliterated: "Umar offers Hafsah in marriage",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }, { person: 'hafsa-bint-umar' }, { person: 'uthman-ibn-affan' }, { person: 'abu-bakr-as-siddiq' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: "حَدَّثَنَا أَبُو الْيَمَانِ: أَخْبَرَنَا شُعَيْبٌ، عَنِ الزُّهْرِيِّ قَالَ: أَخْبَرَنِي سَالِمُ بْنُ عَبْدِ اللهِ: أَنَّهُ سَمِعَ عَبْدَ اللهِ بْنَ عُمَرَ  رضي الله عنهما يُحَدِّثُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4005, url: 'https://sunnah.com/bukhari:4005' },
      moments: [
        { title: "«إن شئت أنكحتك حفصة»", text: "«أَنَّ عُمَرَ بْنَ الْخَطَّابِ،» حِينَ تَأَيَّمَتْ حَفْصَةُ بِنْتُ عُمَرَ مِنْ خُنَيْسِ بْنِ حُذَافَةَ السَّهْمِيِّ، وَكَانَ مِنْ أَصْحَابِ رَسُولِ اللهِ ﷺ قَدْ شَهِدَ بَدْرًا، تُوُفِّيَ بِالْمَدِينَةِ، قَالَ عُمَرُ: فَلَقِيتُ عُثْمَانَ بْنَ عَفَّانَ، فَعَرَضْتُ عَلَيْهِ حَفْصَةَ، فَقُلْتُ: إِنْ شِئْتَ أَنْكَحْتُكَ حَفْصَةَ بِنْتَ عُمَرَ، قَالَ: سَأَنْظُرُ فِي أَمْرِي، فَلَبِثْتُ لَيَالِيَ، فَقَالَ: قَدْ بَدَا لِي أَنْ لَا أَتَزَوَّجَ يَوْمِي هَذَا.", people: ['umar-ibn-al-khattab', 'hafsa-bint-umar', 'uthman-ibn-affan'] },
        { title: "فصمت أبو بكر", text: "قَالَ عُمَرُ: فَلَقِيتُ أَبَا بَكْرٍ، فَقُلْتُ: إِنْ شِئْتَ أَنْكَحْتُكَ حَفْصَةَ بِنْتَ عُمَرَ، فَصَمَتَ أَبُو بَكْرٍ فَلَمْ يَرْجِعْ إِلَيَّ شَيْئًا، فَكُنْتُ عَلَيْهِ أَوْجَدَ مِنِّي عَلَى عُثْمَانَ،", people: ['umar-ibn-al-khattab', 'abu-bakr-as-siddiq'] },
        { title: "«ولو تركها لقبلتها»", text: "فَلَبِثْتُ لَيَالِيَ ثُمَّ خَطَبَهَا رَسُولُ اللهِ ﷺ فَأَنْكَحْتُهَا إِيَّاهُ، فَلَقِيَنِي أَبُو بَكْرٍ فَقَالَ: لَعَلَّكَ وَجَدْتَ عَلَيَّ حِينَ عَرَضْتَ عَلَيَّ حَفْصَةَ فَلَمْ أَرْجِعْ إِلَيْكَ؟ قُلْتُ: نَعَمْ، قَالَ: فَإِنَّهُ لَمْ يَمْنَعْنِي أَنْ أَرْجِعَ إِلَيْكَ فِيمَا عَرَضْتَ، إِلَّا أَنِّي قَدْ عَلِمْتُ أَنَّ رَسُولَ اللهِ ﷺ قَدْ ذَكَرَهَا، فَلَمْ أَكُنْ لِأُفْشِيَ سِرَّ رَسُولِ اللهِ ﷺ، وَلَوْ تَرَكَهَا لَقَبِلْتُهَا.", people: ['prophet-muhammad', 'hafsa-bint-umar', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default umarOffersHafsah;
