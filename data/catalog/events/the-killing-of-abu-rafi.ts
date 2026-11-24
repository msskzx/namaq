import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ sent men of the Ansar under Abd Allah ibn Atik to Abu Rafi', the Jew of the Hijaz who harmed him; Ibn Atik
 * slipped into the fort at dusk, killed him in the dark, broke his leg coming down the stair, waited for the death cry at
 * dawn, and the Prophet ﷺ wiped his leg and it was whole. Told from Sahih al-Bukhari (al-Maghazi, the chapter on Abu
 * Rafi'), each hadith whole: al-Bara's 4039 first, then 4040 and the one line of 4038. Abd Allah ibn Atik and Abd Allah ibn
 * Utbah have no catalog subject and are not linked. Abu Rafi' himself is not linked: the text names him only by his kunya,
 * and the catalog's Abu Rafi' (abu-rafi) is the companion.
 */
const theKillingOfAbuRafi = {
  kind: 'EVENT',
  slug: 'the-killing-of-abu-rafi',
  name: "قتل أبي رافع",
  nameTransliterated: "The killing of Abu Rafi'",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4039, 0, 134),
      source: { slug: 'sahih-al-bukhari', hadith: 4039, url: 'https://sunnah.com/bukhari:4039' },
      moments: [
        { title: "إلى أبي رافع اليهودي", text: sahih('bukhari', 4039, 135, 379), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4039, 135, 379) },
          ] },
        { title: "«فإني منطلق ومتلطف للبواب»", text: sahih('bukhari', 4039, 380, 842), people: [],
          turns: [
            { text: sahih('bukhari', 4039, 380, 462) },
            { text: sahih('bukhari', 4039, 463, 594), speaker: { name: "عبد الله بن عتيك" }, lead: sahih('bukhari', 4039, 463, 498), witness: { source: "fath-al-bari", volume: 7, volumeLabel: "7", page: 343, quote: "وَعَبْدَ اللَّهِ بْنَ عَتِيكٍ بِالنَّصْبِ مَفْعُولُ بَعَثَ، وَهُوَ الْمَبْعُوثُ إِلَى أَبِي رَافِعٍ", url: "https://shamela.ws/book/1673/4171" } },
            { text: sahih('bukhari', 4039, 595, 711) },
            { text: sahih('bukhari', 4039, 712, 842), speaker: { name: "البواب" }, lead: sahih('bukhari', 4039, 712, 738) },
          ] },
        { title: "الأقاليد", text: sahih('bukhari', 4039, 843, 1299), people: [],
          turns: [
            { text: sahih('bukhari', 4039, 843, 1299) },
          ] },
        { title: "«يا أبا رافع»", text: sahih('bukhari', 4039, 1300, 1957), people: [],
          turns: [
            { text: sahih('bukhari', 4039, 1300, 1443) },
            { text: sahih('bukhari', 4039, 1444, 1656) },
            { text: sahih('bukhari', 4039, 1657, 1705), speaker: { name: "عبد الله بن عتيك" }, lead: sahih('bukhari', 4039, 1657, 1666), witness: { source: "fath-al-bari", volume: 7, volumeLabel: "7", page: 344, quote: "(فَقُلْتُ: مَا هَذَا الصَّوْتُ يَا أَبَا رَافِعٍ) فِي حَدِيثِ عَبْدِ اللَّهِ بْنِ أُنَيْسٍ، فَقَالَتِ امْرَأَتُهُ: يَا أَبَا رَافِعٍ هَذَا صَوْتُ عَبْدِ اللَّهِ بْنِ عَتِيكٍ", url: "https://shamela.ws/book/1673/4172" } },
            { text: sahih('bukhari', 4039, 1706, 1793), speaker: { name: "أبو رافع" }, lead: sahih('bukhari', 4039, 1706, 1714), witness: { source: "fath-al-bari", volume: 7, volumeLabel: "7", page: 344, quote: "(فَقُلْتُ: مَا هَذَا الصَّوْتُ يَا أَبَا رَافِعٍ) فِي حَدِيثِ عَبْدِ اللَّهِ بْنِ أُنَيْسٍ، فَقَالَتِ امْرَأَتُهُ: يَا أَبَا رَافِعٍ هَذَا صَوْتُ عَبْدِ اللَّهِ بْنِ عَتِيكٍ. فَقَالَ: ثَكِلَتْكِ أُمُّكِ", url: "https://shamela.ws/book/1673/4172" } },
            { text: sahih('bukhari', 4039, 1794, 1957) },
          ] },
        { title: "فانكسرت ساقي", text: sahih('bukhari', 4039, 1958, 2204), people: [],
          turns: [
            { text: sahih('bukhari', 4039, 1958, 2204) },
          ] },
        { title: "«أنعى أبا رافع تاجر أهل الحجاز»", text: sahih('bukhari', 4039, 2205, 2522), people: [],
          turns: [
            { text: sahih('bukhari', 4039, 2205, 2344) },
            { text: sahih('bukhari', 4039, 2345, 2434), speaker: { name: "الناعي" }, lead: sahih('bukhari', 4039, 2345, 2385) },
            { text: sahih('bukhari', 4039, 2435, 2522) },
          ] },
        { title: "«ابسط رجلك»", text: sahih('bukhari', 4039, 2523, 2667), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4039, 2523, 2597), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 4039, 2523, 2579) },
            { text: sahih('bukhari', 4039, 2598, 2667) },
          ] },
      ],
    },
    {
      isnad: sahih('bukhari', 4040, 0, 200),
      source: { slug: 'sahih-al-bukhari', hadith: 4040, url: 'https://sunnah.com/bukhari:4040' },
      moments: [
        { title: "«امكثوا أنتم حتى أنطلق»", text: sahih('bukhari', 4040, 201, 461), people: ['prophet-muhammad'] },
        { title: "في مربط حمار", text: sahih('bukhari', 4040, 462, 954), people: [] },
        { title: "مفتاح الحصن في كوة", text: sahih('bukhari', 4040, 955, 1300), people: [] },
        { title: "كهيئة المغيث", text: sahih('bukhari', 4040, 1301, 2049), people: [] },
        { title: "«أنعى أبا رافع»", text: sahih('bukhari', 4040, 2050, 2522), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4038, 0, 186),
      source: { slug: 'sahih-al-bukhari', hadith: 4038, url: 'https://sunnah.com/bukhari:4038' },
      moments: [
        { title: "دخل عليه بيته ليلا", text: sahih('bukhari', 4038, 187, 328), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theKillingOfAbuRafi;
