import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abu Musa: six of us went out with the Prophet ﷺ sharing one camel, and our feet were holed and my nails fell off, so we
 * wrapped our feet in rags, and it was called the raid of the rags; then he disliked having told it. Told from Sahih
 * al-Bukhari 4128 (al-Maghazi, the chapter on Dhat al-Riqa'), whole.
 */
const theNamingOfDhatAlRiqa = {
  kind: 'EVENT',
  slug: 'the-naming-of-dhat-al-riqa',
  name: "تسمية ذات الرقاع",
  nameTransliterated: "How Dhat al-Riqa' got its name",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-musa-al-ashari' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: "حَدَّثَنَا مُحَمَّدُ بْنُ الْعَلَاءِ: حَدَّثَنَا أَبُو أُسَامَةَ، عَنْ بُرَيْدِ بْنِ عَبْدِ اللهِ بْنِ أَبِي بُرْدَةَ، عَنْ أَبِي بُرْدَةَ، عَنْ أَبِي مُوسَى  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4128, url: 'https://sunnah.com/bukhari:4128' },
      moments: [
        { title: "نقبت أقدامنا", text: "«خَرَجْنَا مَعَ النَّبِيِّ ﷺ فِي غَزَاةٍ وَنَحْنُ سِتَّةُ نَفَرٍ، بَيْنَنَا بَعِيرٌ نَعْتَقِبُهُ، فَنَقِبَتْ أَقْدَامُنَا، وَنَقِبَتْ قَدَمَايَ وَسَقَطَتْ أَظْفَارِي، وَكُنَّا نَلُفُّ عَلَى أَرْجُلِنَا الْخِرَقَ، فَسُمِّيَتْ غَزْوَةَ ذَاتِ الرِّقَاعِ، لِمَا كُنَّا نَعْصِبُ مِنَ الْخِرَقِ عَلَى أَرْجُلِنَا.", people: ['abu-musa-al-ashari', 'prophet-muhammad'] },
        { title: "كره أن يذكره", text: "وَحَدَّثَ أَبُو مُوسَى بِهَذَا، ثُمَّ كَرِهَ ذَاكَ، قَالَ: مَا كُنْتُ أَصْنَعُ بِأَنْ أَذْكُرَهُ، كَأَنَّهُ كَرِهَ أَنْ يَكُونَ شَيْءٌ مِنْ عَمَلِهِ أَفْشَاهُ».", people: ['abu-musa-al-ashari'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theNamingOfDhatAlRiqa;
