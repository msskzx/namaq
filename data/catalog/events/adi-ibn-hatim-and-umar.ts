import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Adi ibn Hatim came to Umar in a delegation; Umar called them man by man, and when Adi asked «أما تعرفني» he said «أسلمت
 * إذ كفروا، وأقبلت إذ أدبروا، ووفيت إذ غدروا، وعرفت إذ أنكروا». Told from Sahih al-Bukhari 4394 (al-Maghazi, the story
 * of the delegation of Tayy and Adi ibn Hatim), whole.
 */
const adiIbnHatimAndUmar = {
  kind: 'EVENT',
  slug: 'adi-ibn-hatim-and-umar',
  name: "عدي بن حاتم وعمر",
  nameTransliterated: "Adi ibn Hatim and Umar",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'adi-ibn-hatim' }, { person: 'umar-ibn-al-khattab' }],
  reports: [
    {
      isnad: "حَدَّثَنَا مُوسَى بْنُ إِسْمَاعِيلَ: حَدَّثَنَا أَبُو عَوَانَةَ: حَدَّثَنَا عَبْدُ الْمَلِكِ، عَنْ عَمْرِو بْنِ حُرَيْثٍ، عَنْ عَدِيِّ بْنِ حَاتِمٍ قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4394, url: 'https://sunnah.com/bukhari:4394' },
      moments: [
        { title: "«أسلمت إذ كفروا»", text: "«أَتَيْنَا عُمَرَ فِي وَفْدٍ فَجَعَلَ يَدْعُو رَجُلًا رَجُلًا وَيُسَمِّيهِمْ، فَقُلْتُ: أَمَا تَعْرِفُنِي يَا أَمِيرَ الْمُؤْمِنِينَ، قَالَ: بَلَى أَسْلَمْتَ إِذْ كَفَرُوا، وَأَقْبَلْتَ إِذْ أَدْبَرُوا، وَوَفَيْتَ إِذْ غَدَرُوا، وَعَرَفْتَ إِذْ أَنْكَرُوا، فَقَالَ عَدِيٌّ: فَلَا أُبَالِي إِذًا.»", people: ['adi-ibn-hatim', 'umar-ibn-al-khattab'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default adiIbnHatimAndUmar;
