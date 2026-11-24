import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abu Musa and his people heard in Yemen that the Prophet ﷺ had come out, took ship, and were cast up at the Najashi's in
 * Abyssinia, where they found Ja'far ibn Abi Talib and stayed with him until they came to the Prophet ﷺ as he took Khaybar;
 * Umar told Asma bint Umays at Hafsah's «سبقناكم بالهجرة», she took it to the Prophet ﷺ, and he said «ولكم أنتم أهل
 * السفينة هجرتان». Told first from Sahih al-Bukhari 4230 (al-Maghazi, the chapter on Khaybar), whole, the fullest; our copy
 * numbers its end 4231 («فلما جاء النبي ﷺ قالت…»), which has no chain of its own and is given as the next report, whole.
 * Then 3876 (the chapter on the hijra to Abyssinia), whole. Drawn by speaker: each lead named in the text names who speaks;
 * the bare «قال»/«قالت» stay narration. Hafsah is linked where named; Abu Musa's brothers have no catalog subject and are
 * not linked.
 */
const thePeopleOfTheShip = {
  kind: 'EVENT',
  slug: 'the-people-of-the-ship',
  name: "أهل السفينة",
  nameTransliterated: "The people of the ship",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-musa-al-ashari' }, { person: 'prophet-muhammad' }, { person: 'an-najashi' }, { person: 'jaafar-ibn-abi-talib' }, { person: 'asma-bint-umays' }, { person: 'hafsa-bint-umar' }, { person: 'umar-ibn-al-khattab' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4230, 0, 164),
      source: { slug: 'sahih-al-bukhari', hadith: 4230, url: 'https://sunnah.com/bukhari:4230' },
      moments: [
        {
          title: "بلغهم مخرجه وهم باليمن",
          text: sahih('bukhari', 4230, 165, 547),
          people: ['abu-musa-al-ashari', 'prophet-muhammad', 'an-najashi'],
          turns: [
            { text: sahih('bukhari', 4230, 165, 547) },
          ],
        },
        {
          title: "مع جعفر عند النجاشي",
          text: sahih('bukhari', 4230, 548, 795),
          people: ['abu-musa-al-ashari', 'jaafar-ibn-abi-talib', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4230, 548, 795) },
          ],
        },
        {
          title: "«الحبشية هذه، البحرية هذه»",
          text: sahih('bukhari', 4230, 796, 1282),
          people: ['asma-bint-umays', 'hafsa-bint-umar', 'umar-ibn-al-khattab'],
          turns: [
            { text: sahih('bukhari', 4230, 796, 1027) },
            { text: sahih('bukhari', 4230, 1028, 1078), speaker: { person: 'umar-ibn-al-khattab', name: "عمر" }, lead: sahih('bukhari', 4230, 1028, 1065) },
            { text: sahih('bukhari', 4230, 1079, 1114) },
            { text: sahih('bukhari', 4230, 1115, 1174), speaker: { person: 'umar-ibn-al-khattab', name: "عمر" }, lead: sahih('bukhari', 4230, 1115, 1128) },
            { text: sahih('bukhari', 4230, 1175, 1201), speaker: { person: 'asma-bint-umays', name: "أسماء" }, lead: sahih('bukhari', 4230, 1175, 1193) },
            { text: sahih('bukhari', 4230, 1202, 1282) },
          ],
        },
        {
          title: "«كنتم مع رسول الله ﷺ يطعم جائعكم»",
          text: sahih('bukhari', 4230, 1283, 1757),
          people: ['asma-bint-umays', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4230, 1283, 1757) },
          ],
        },
      ],
    },
    {
      source: { slug: 'sahih-al-bukhari', hadith: 4231, url: 'https://sunnah.com/bukhari:4231' },
      moments: [
        {
          title: "«يا نبي الله إن عمر قال: كذا وكذا»",
          text: sahih('bukhari', 4231, 0, 152),
          people: ['asma-bint-umays', 'umar-ibn-al-khattab', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4231, 0, 152) },
          ],
        },
        {
          title: "«ولكم أنتم أهل السفينة هجرتان»",
          text: sahih('bukhari', 4231, 153, 284),
          people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4231, 153, 284) },
          ],
        },
        {
          title: "«يأتوني أرسالا يسألوني عن هذا الحديث»",
          text: sahih('bukhari', 4231, 285, 642),
          people: ['abu-musa-al-ashari', 'asma-bint-umays'],
          turns: [
            { text: sahih('bukhari', 4231, 285, 521), speaker: { person: "asma-bint-umays", name: "أسماء" }, lead: sahih('bukhari', 4231, 285, 293), witness: { source: "fath-al-bari", volume: 7, volumeLabel: "7", page: 487, quote: "قَوْلُهُ: (قَالَتْ) يَعْنِي أَسْمَاءُ بِنْتُ عُمَيْسٍ", url: "https://shamela.ws/book/1673/4315" } },
            { text: sahih('bukhari', 4231, 522, 642), speaker: { person: 'asma-bint-umays', name: "أسماء" }, lead: sahih('bukhari', 4231, 522, 562) },
          ],
        },
      ],
    },
    {
      isnad: sahih('bukhari', 3876, 0, 158),
      source: { slug: 'sahih-al-bukhari', hadith: 3876, url: 'https://sunnah.com/bukhari:3876' },
      moments: [
        {
          title: "بلغهم مخرجه وهم باليمن",
          text: sahih('bukhari', 3876, 159, 297),
          people: ['abu-musa-al-ashari', 'prophet-muhammad', 'an-najashi'],
          turns: [
            { text: sahih('bukhari', 3876, 159, 297) },
          ],
        },
        {
          title: "مع جعفر عند النجاشي",
          text: sahih('bukhari', 3876, 298, 376),
          people: ['abu-musa-al-ashari', 'jaafar-ibn-abi-talib'],
          turns: [
            { text: sahih('bukhari', 3876, 298, 376) },
          ],
        },
        {
          title: "«لكم أنتم يا أهل السفينة هجرتان»",
          text: sahih('bukhari', 3876, 377, 504),
          people: ['abu-musa-al-ashari', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 3876, 377, 428) },
            { text: sahih('bukhari', 3876, 429, 504), speaker: { person: 'prophet-muhammad', name: "النبي ﷺ" }, lead: sahih('bukhari', 3876, 429, 450) },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default thePeopleOfTheShip;
