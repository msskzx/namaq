import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Sent against al-Huraqah, Usamah ibn Zayd caught a man who said «لا إله إلا الله» and killed him; the Prophet ﷺ said
 * «يا أسامة، أقتلته بعدما قال لا إله إلا الله» and kept repeating it until Usamah wished he had not become Muslim before
 * that day. Told from Sahih al-Bukhari 4269 (al-Maghazi, the sending of Usamah to al-Huraqah), whole. The Ansari and the
 * man killed are not named. 4270–4273 are Salamah's counts of raids.
 */
const usamahAtAlHuraqah = {
  kind: 'EVENT',
  slug: 'usamah-at-al-huraqah',
  name: "أسامة يوم الحرقة",
  nameTransliterated: "Usamah at al-Huraqah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'usamah-ibn-zaid' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: "حَدَّثَنِي عَمْرُو بْنُ مُحَمَّدٍ: حَدَّثَنَا هُشَيْمٌ: أَخْبَرَنَا حُصَيْنٌ: أَخْبَرَنَا أَبُو ظَبْيَانَ قَالَ: سَمِعْتُ أُسَامَةَ بْنَ زَيْدٍ  رضي الله عنهما يَقُولُ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4269, url: 'https://sunnah.com/bukhari:4269' },
      moments: [
        { title: "قال: لا إله إلا الله", text: "«بَعَثَنَا رَسُولُ اللهِ ﷺ إِلَى الْحُرَقَةِ، فَصَبَّحْنَا الْقَوْمَ فَهَزَمْنَاهُمْ، وَلَحِقْتُ أَنَا وَرَجُلٌ مِنَ الْأَنْصَارِ رَجُلًا مِنْهُمْ، فَلَمَّا غَشِينَاهُ قَالَ: لَا إِلَهَ إِلَّا اللهُ، فَكَفَّ الْأَنْصَارِيُّ، فَطَعَنْتُهُ بِرُمْحِي حَتَّى قَتَلْتُهُ،", people: ['usamah-ibn-zaid'] },
        { title: "«أقتلته بعدما قال لا إله إلا الله»", text: "فَلَمَّا قَدِمْنَا بَلَغَ النَّبِيَّ ﷺ فَقَالَ: يَا أُسَامَةُ، أَقَتَلْتَهُ بَعْدَمَا قَالَ لَا إِلَهَ إِلَّا اللهُ. قُلْتُ: كَانَ مُتَعَوِّذًا، فَمَا زَالَ يُكَرِّرُهَا، حَتَّى تَمَنَّيْتُ أَنِّي لَمْ أَكُنْ أَسْلَمْتُ قَبْلَ ذَلِكَ الْيَوْمِ.»", people: ['prophet-muhammad', 'usamah-ibn-zaid'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default usamahAtAlHuraqah;
