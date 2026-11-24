import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Umar: on the day of Badr the Prophet ﷺ faced the qiblah and called on his Lord until his cloak fell, and Abu Bakr put it
 * back, «كذاك مناشدتك ربك», and Allah sent down «إذ تستغيثون ربكم»; a Muslim heard «أقدم حيزوم» over the man he chased; then
 * the Prophet ﷺ asked Abu Bakr and Umar about the captives, took ransom, and wept the next day, and Allah sent down «ما كان
 * لنبي أن يكون له أسرى». Told first as Sahih Muslim 1763 (al-Jihad, the chapter on the angels' help at Badr) has it, whole;
 * then Ibn Abbas's shorter telling, Sahih al-Bukhari 3953, folded, where he leaves reciting «سيهزم الجمع ويولون الدبر».
 * The kinsman of Umar whom the text leaves unnamed («فلان نسيبا لعمر») is not linked.
 */
const thePleaAndTheCaptivesOfBadr = {
  kind: 'EVENT',
  slug: 'the-plea-and-the-captives-of-badr',
  name: "الاستغاثة والأسرى يوم بدر",
  nameTransliterated: "The plea and the captives at Badr",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-bakr-as-siddiq' }, { person: 'umar-ibn-al-khattab' }, { person: 'ali-ibn-abi-talib' }, { person: 'aqil-ibn-abi-talib' }],
  tags: ['HIS_WORDS', 'REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '8:9',
      to: '8:9',
      evidence: [{ source: 'sahih-muslim', hadith: 1763, url: 'https://sunnah.com/muslim:1763', quote: sahih('muslim', 1763, 1219, 1356) }],
    },
    {
      kind: 'REVEALED_ABOUT',
      from: '8:67',
      to: '8:69',
      evidence: [{ source: 'sahih-muslim', hadith: 1763, url: 'https://sunnah.com/muslim:1763', quote: sahih('muslim', 1763, 3308, 3453) }],
    },
    {
      kind: 'RECITED',
      report: "في رواية عكرمة عن ابن عباس",
      from: '54:45',
      to: '54:45',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 3953, url: 'https://sunnah.com/bukhari:3953', quote: sahih('bukhari', 3953, 315, 385) }],
    },
  ],
  reports: [
    {
      isnad: sahih('muslim', 1763, 0, 515),
      source: { slug: 'sahih-muslim', hadith: 1763, url: 'https://sunnah.com/muslim:1763' },
      moments: [
        { title: "«اللهم أنجز لي ما وعدتني»", text: sahih('muslim', 1763, 516, 903), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1763, 516, 634) },
            { text: sahih('muslim', 1763, 635, 903), speaker: { person: "prophet-muhammad", name: "نبي الله ﷺ" }, lead: sahih('muslim', 1763, 635, 728) },
          ] },
        { title: "«كذاك مناشدتك ربك»", text: sahih('muslim', 1763, 904, 1411), people: ['prophet-muhammad', 'abu-bakr-as-siddiq'],
          turns: [
            { text: sahih('muslim', 1763, 904, 1131) },
            { text: sahih('muslim', 1763, 1132, 1218), speaker: { person: "abu-bakr-as-siddiq", name: "أبو بكر" }, lead: sahih('muslim', 1763, 1132, 1137), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 188, quote: "(وقال) أبو بكر:", url: "https://shamela.ws/book/18268/7863" } },
            { text: sahih('muslim', 1763, 1219, 1411) },
          ] },
        { title: "«أقدم حيزوم»", text: sahih('muslim', 1763, 1412, 2012), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1763, 1412, 1909) },
            { text: sahih('muslim', 1763, 1910, 1957), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1763, 1910, 1914), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 190, quote: "(رسول الله ﷺ فقال) له رسول الله ﷺ: (صدقت)", url: "https://shamela.ws/book/18268/7865" } },
            { text: sahih('muslim', 1763, 1958, 2012) },
          ] },
        { title: "«ما ترون في هؤلاء الأسارى؟»", text: sahih('muslim', 1763, 2013, 2820), people: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab', 'ali-ibn-abi-talib', 'aqil-ibn-abi-talib'],
          turns: [
            { text: sahih('muslim', 1763, 2013, 2086) },
            { text: sahih('muslim', 1763, 2087, 2176), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1763, 2087, 2134) },
            { text: sahih('muslim', 1763, 2177, 2386), speaker: { person: "abu-bakr-as-siddiq", name: "أبو بكر" }, lead: sahih('muslim', 1763, 2177, 2198) },
            { text: sahih('muslim', 1763, 2387, 2448), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1763, 2387, 2412) },
            { text: sahih('muslim', 1763, 2449, 2647), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('muslim', 1763, 2449, 2456), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 191, quote: "قال عمر: (قلت) لرسول الله ﷺ: (لا)", url: "https://shamela.ws/book/18268/7866" } },
            { text: sahih('muslim', 1763, 2648, 2667) },
            { text: sahih('muslim', 1763, 2668, 2743), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 191, quote: "قال عمر: (قلت) لرسول الله ﷺ: (لا)", url: "https://shamela.ws/book/18268/7866" } },
            { text: sahih('muslim', 1763, 2744, 2820) },
          ] },
        { title: "«أبكي للذي عرض علي أصحابك»", text: sahih('muslim', 1763, 2821, 3506), people: ['umar-ibn-al-khattab', 'prophet-muhammad', 'abu-bakr-as-siddiq'],
          turns: [
            { text: sahih('muslim', 1763, 2821, 2921) },
            { text: sahih('muslim', 1763, 2922, 3097), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('muslim', 1763, 2922, 2929), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 192, quote: "قال عمر: (قلت: يا رسول الله أخبرني", url: "https://shamela.ws/book/18268/7867" } },
            { text: sahih('muslim', 1763, 3098, 3263), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1763, 3098, 3123) },
            { text: sahih('muslim', 1763, 3264, 3506) },
          ] },
      ],
    },
    {
      isnad: sahih('bukhari', 3953, 0, 148),
      source: { slug: 'sahih-al-bukhari', hadith: 3953, url: 'https://sunnah.com/bukhari:3953' },
      moments: [
        { title: "«اللهم أنشدك عهدك ووعدك»", text: sahih('bukhari', 3953, 149, 263), people: ['prophet-muhammad'] },
        { title: "«حسبك»", text: sahih('bukhari', 3953, 264, 387), people: ['abu-bakr-as-siddiq', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default thePleaAndTheCaptivesOfBadr;
