import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abu Hurayrah, at a gathering in Mu'awiyah's time, told the Ansar how the Prophet ﷺ entered Makkah: al-Zubayr and Khalid
 * on the two wings, Abu Ubaydah over the unarmoured men, the Ansar called to him and sent through the rabble of Quraysh to
 * meet him at al-Safa; Abu Sufyan said «أبيحت خضراء قريش», the Prophet ﷺ said «من دخل دار أبي سفيان فهو آمن», the Ansar
 * said he longed for his town, and after the revelation he told them «هاجرت إلى الله وإليكم. والمحيا محياكم. والممات
 * مماتكم»; then he kissed the Stone, struck the idol by the House with his bow saying «جاء الحق وزهق الباطل» and stood on
 * al-Safa. Told from Sahih Muslim 1780 (al-Jihad, the conquest of Makkah), the first of its routes, whole.
 */
const theAnsarOnTheDayOfTheConquest = {
  kind: 'EVENT',
  slug: 'the-ansar-on-the-day-of-the-conquest',
  name: "الأنصار يوم فتح مكة",
  nameTransliterated: "The Ansar on the day of the conquest",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-hurayrah' }, { person: 'prophet-muhammad' }, { person: 'az-zubayr-ibn-al-awwam' }, { person: 'khalid-ibn-al-walid' }, { person: 'abu-ubaydah-ibn-al-jarrah' }, { person: 'abu-sufyan-ibn-harb' }],
  tags: ['HIS_WORDS'],
  ayat: [
    {
      kind: 'RECITED',
      from: '17:81',
      to: '17:81',
      evidence: [{ source: 'sahih-muslim', hadith: 1780, url: 'https://sunnah.com/muslim:1780', quote: sahih('muslim', 1780, 3159, 3236) }],
    },
  ],
  reports: [
    {
      isnad: sahih('muslim', 1780, 0, 174),
      source: { slug: 'sahih-muslim', hadith: 1780, url: 'https://sunnah.com/muslim:1780' },
      moments: [
        { title: "الدعوة في رمضان", text: sahih('muslim', 1780, 175, 720), people: ['abu-hurayrah'],
          turns: [
            { text: sahih('muslim', 1780, 175, 499) },
            { text: sahih('muslim', 1780, 500, 537), speaker: { name: "عبد الله بن رباح" }, lead: sahih('muslim', 1780, 500, 509), teller: true },
            { text: sahih('muslim', 1780, 538, 551), speaker: { person: "abu-hurayrah", name: "أبو هريرة" }, lead: sahih('muslim', 1780, 538, 543), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 269, quote: "(فقال) لي أبو هريرة: سبقتني", url: "https://shamela.ws/book/18268/7944" } },
            { text: sahih('muslim', 1780, 552, 567), speaker: { name: "عبد الله بن رباح" }, lead: sahih('muslim', 1780, 552, 559), teller: true },
            { text: sahih('muslim', 1780, 568, 583) },
            { text: sahih('muslim', 1780, 584, 683), speaker: { person: "abu-hurayrah", name: "أبو هريرة" }, lead: sahih('muslim', 1780, 584, 609) },
            { text: sahih('muslim', 1780, 684, 720) },
          ] },
        { title: "«لا يأتيني إلا أنصاري»", text: sahih('muslim', 1780, 721, 1209), people: ['prophet-muhammad', 'az-zubayr-ibn-al-awwam', 'khalid-ibn-al-walid', 'abu-ubaydah-ibn-al-jarrah', 'abu-hurayrah'],
          turns: [
            { text: sahih('muslim', 1780, 721, 1010) },
            { text: sahih('muslim', 1780, 1011, 1037), speaker: { person: "prophet-muhammad", name: "رسول الله" }, lead: sahih('muslim', 1780, 1011, 1018), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 270, quote: "(فنظر) رسول الله جوانبه (فرآني فقال) لي أنت (أبو هريرة", url: "https://shamela.ws/book/18268/7945" } },
            { text: sahih('muslim', 1780, 1038, 1077), speaker: { person: "abu-hurayrah", name: "أبو هريرة" }, lead: sahih('muslim', 1780, 1038, 1045), teller: true },
            { text: sahih('muslim', 1780, 1078, 1123), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1780, 1078, 1085), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 270, quote: "(يا رسول الله فقال) لي رسول الله ﷺ: ناد لي في الناس ولكن (لا يأتيني", url: "https://shamela.ws/book/18268/7945" } },
            { text: sahih('muslim', 1780, 1124, 1147) },
            { text: sahih('muslim', 1780, 1148, 1184), speaker: { person: "prophet-muhammad", name: "رسول الله" }, lead: sahih('muslim', 1780, 1148, 1155), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 270, quote: "(فقال) لي رسول الله صلى اللأ عليه وسلم: (اهتف)", url: "https://shamela.ws/book/18268/7945" } },
            { text: sahih('muslim', 1780, 1185, 1209) },
          ] },
        { title: "«حتى توافوني بالصفا»", text: sahih('muslim', 1780, 1210, 1701), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1780, 1210, 1385) },
            { text: sahih('muslim', 1780, 1386, 1463), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1780, 1386, 1411) },
            { text: sahih('muslim', 1780, 1464, 1518) },
            { text: sahih('muslim', 1780, 1519, 1562), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1780, 1519, 1530), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 271, quote: "(قال) لهم رسول الله ﷺ عليكم بهم (حتى توافوني)", url: "https://shamela.ws/book/18268/7946" } },
            { text: sahih('muslim', 1780, 1563, 1701) },
          ] },
        { title: "«من دخل دار أبي سفيان فهو آمن»", text: sahih('muslim', 1780, 1702, 2012), people: ['abu-sufyan-ibn-harb', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1780, 1702, 1823), speaker: { person: "abu-sufyan-ibn-harb", name: "أبو سفيان" }, lead: sahih('muslim', 1780, 1702, 1741) },
            { text: sahih('muslim', 1780, 1824, 1884), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1780, 1824, 1835), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 272, quote: "(ثم قال) رسول الله ﷺ تأليفًا لقلب أبي سفيان", url: "https://shamela.ws/book/18268/7947" } },
            { text: sahih('muslim', 1780, 1885, 2012), speaker: { name: "الأنصار" }, lead: sahih('muslim', 1780, 1885, 1929) },
          ] },
        { title: "«هاجرت إلى الله وإليكم»", text: sahih('muslim', 1780, 2013, 2789), people: ['abu-hurayrah', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1780, 2013, 2237) },
            { text: sahih('muslim', 1780, 2238, 2290), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1780, 2238, 2261) },
            { text: sahih('muslim', 1780, 2291, 2331) },
            { text: sahih('muslim', 1780, 2332, 2406), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1780, 2332, 2337), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 272, quote: "فقال لهم رسول الله ﷺ قلتم كذا وكذا", url: "https://shamela.ws/book/18268/7947" } },
            { text: sahih('muslim', 1780, 2407, 2433) },
            { text: sahih('muslim', 1780, 2434, 2574) },
            { text: sahih('muslim', 1780, 2575, 2700) },
            { text: sahih('muslim', 1780, 2701, 2789), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1780, 2701, 2726) },
          ] },
        { title: "«جاء الحق وزهق الباطل»", text: sahih('muslim', 1780, 2790, 3414), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1780, 2790, 3414) },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theAnsarOnTheDayOfTheConquest;
