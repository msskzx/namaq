import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * On the day of the conquest there were three hundred and sixty idols around the Ka'bah; the Prophet ﷺ struck them with a
 * stick in his hand, reciting «جاء الحق وزهق الباطل» and «جاء الحق وما يبدئ الباطل وما يعيد». Told from Ibn Mas'ud's
 * hadith: Sahih al-Bukhari 4287 (al-Maghazi, the chapter on the conquest) first, whole; then Sahih Muslim 1781 (al-Jihad,
 * the removal of the idols from around the Ka'bah), whole, which gives 17:81 to its end.
 */
const theIdolsAroundTheKaaba = {
  kind: 'EVENT',
  slug: 'the-idols-around-the-kaaba',
  name: "الأنصاب حول الكعبة",
  nameTransliterated: "The idols around the Ka'bah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  ayat: [
    {
      kind: 'RECITED',
      from: '17:81',
      to: '17:81',
      evidence: [
        { source: 'sahih-al-bukhari', hadith: 4287, url: 'https://sunnah.com/bukhari:4287', quote: "﴿جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ﴾" },
        { source: 'sahih-muslim', hadith: 1781, url: 'https://sunnah.com/muslim:1781', quote: "جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ. إِنَّ الْبَاطِلَ كان زهوقا" },
      ],
    },
    {
      kind: 'RECITED',
      from: '34:49',
      to: '34:49',
      evidence: [
        { source: 'sahih-al-bukhari', hadith: 4287, url: 'https://sunnah.com/bukhari:4287', quote: "﴿جَاءَ الْحَقُّ وَمَا يُبْدِئُ الْبَاطِلُ وَمَا يُعِيدُ﴾" },
        { source: 'sahih-muslim', hadith: 1781, url: 'https://sunnah.com/muslim:1781', quote: "جَاءَ الْحَقُّ وَمَا يُبْدِئُ الْبَاطِلُ وَمَا يُعِيدُ" },
      ],
    },
  ],
  reports: [
    {
      isnad: "حَدَّثَنَا صَدَقَةُ بْنُ الْفَضْلِ: أَخْبَرَنَا ابْنُ عُيَيْنَةَ، عَنِ ابْنِ أَبِي نَجِيحٍ، عَنْ مُجَاهِدٍ، عَنْ أَبِي مَعْمَرٍ، عَنْ عَبْدِ اللهِ  رضي الله عنه قَالَ:",
      source: { slug: 'sahih-al-bukhari', hadith: 4287, url: 'https://sunnah.com/bukhari:4287' },
      moments: [
        { title: "ستون وثلاثمائة نصب", text: "«دَخَلَ النَّبِيُّ ﷺ مَكَّةَ يَوْمَ الْفَتْحِ، وَحَوْلَ الْبَيْتِ سِتُّونَ وَثَلَاثُمِائَةِ نُصُبٍ، فَجَعَلَ يَطْعُنُهَا بِعُودٍ فِي يَدِهِ وَيَقُولُ: ﴿جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ﴾ ﴿جَاءَ الْحَقُّ وَمَا يُبْدِئُ الْبَاطِلُ وَمَا يُعِيدُ﴾.»", people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: "حَدَّثَنَا أَبُو بَكْرِ بْنُ أَبِي شَيْبَةَ وعمرو بن النَّاقِدُ وَابْنُ أَبِي عُمَرَ (وَاللَّفْظُ لِابْنِ أَبِي شَيْبَةَ) قَالُوا: حَدَّثَنَا سُفْيَانُ بْنُ عُيَيْنَةَ عَنْ ابْنِ أَبِي نَجِيحٍ، عَنْ مُجَاهِدٍ، عَنْ أَبِي مَعْمَرٍ، عَنْ عَبْدِ اللَّهِ. قَالَ:",
      source: { slug: 'sahih-muslim', hadith: 1781, url: 'https://sunnah.com/muslim:1781' },
      moments: [
        { title: "ثلاثمائة وستون نصبا", text: "دَخَلَ النَّبِيُّ ﷺ مَكَّةَ. وَحَوْلَ الْكَعْبَةِ ثلاثمائة وَسِتُّونَ نُصُبًا. فَجَعَلَ يَطْعُنُهَا بِعُودٍ كَانَ بِيَدِهِ. وَيَقُولُ (جَاءَ الْحَقُّ وَزَهَقَ الْبَاطِلُ. إِنَّ الْبَاطِلَ كان زهوقا [١٧ /الإسراء /٨١]. جَاءَ الْحَقُّ وَمَا يُبْدِئُ الْبَاطِلُ وَمَا يُعِيدُ) [٣٤ /سبأ /٤٩]. زاد ابن أبي عمر: يوم الفتح.", people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theIdolsAroundTheKaaba;
