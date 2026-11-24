import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * On the night march to Khaybar Amir ibn al-Akwa' chanted «اللهم لولا أنت ما اهتدينا», and the Prophet ﷺ said «يرحمه الله»;
 * after the siege his short sword sprang back on his own knee and killed him, and when some said his deeds were void the
 * Prophet ﷺ told Salamah «إن له لأجرين». Told from Sahih Muslim 1802 (al-Jihad, the chapter on Khaybar), whole, which names
 * Usayd ibn Hudayr among those who said it; then Sahih al-Bukhari 4196 (al-Maghazi, the chapter on Khaybar), whole, folded,
 * to Qutaybah's route at its end with «نشأ بها» for «مشى بها».
 * Amir and Salamah have no catalog subject and are not linked.
 */
const amirIbnAlAkwaAtKhaybar = {
  kind: 'EVENT',
  slug: 'amir-ibn-al-akwa-at-khaybar',
  name: "عامر بن الأكوع يوم خيبر",
  nameTransliterated: "Amir ibn al-Akwa' at Khaybar",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'usayd-ibn-al-hudayr' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('muslim', 1802, 0, 248),
      source: { slug: 'sahih-muslim', hadith: 1802, url: 'https://sunnah.com/muslim:1802' },
      moments: [
        { title: "«من هذا السائق؟»", text: sahih('muslim', 1802, 249, 910), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1802, 249, 321) },
            { text: sahih('muslim', 1802, 322, 403), speaker: { name: "رجل من القوم" }, lead: sahih('muslim', 1802, 322, 379) },
            { text: sahih('muslim', 1802, 404, 437) },
            { text: sahih('muslim', 1802, 438, 732), speaker: { name: "عامر" }, lead: sahih('muslim', 1802, 438, 472), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 354, quote: "(وكان عامر) بن الأكوع (رجلًا شاعرًا) أي منشئًا للشعر (فنزل) من دابته حالة كونه (يحدو", url: "https://shamela.ws/book/18268/8029" } },
            { text: sahih('muslim', 1802, 733, 775), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1802, 733, 752) },
            { text: sahih('muslim', 1802, 776, 793) },
            { text: sahih('muslim', 1802, 794, 820), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1802, 794, 799), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 356, quote: "(قال) رسول الله ﷺ: (يرحمه الله)", url: "https://shamela.ws/book/18268/8031" } },
            { text: sahih('muslim', 1802, 821, 910), speaker: { name: "رجل من القوم" }, lead: sahih('muslim', 1802, 821, 851) },
          ] },
        { title: "«أهريقوها واكسروها»", text: sahih('muslim', 1802, 911, 1457), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1802, 911, 998) },
            { text: sahih('muslim', 1802, 999, 1047), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1802, 999, 1010), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 356, quote: "(قال) رسول الله ﷺ: (إن الله فتحها)", url: "https://shamela.ws/book/18268/8031" } },
            { text: sahih('muslim', 1802, 1048, 1159) },
            { text: sahih('muslim', 1802, 1160, 1242), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1802, 1160, 1185) },
            { text: sahih('muslim', 1802, 1243, 1267) },
            { text: sahih('muslim', 1802, 1268, 1290), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1802, 1268, 1274), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 356, quote: "(على لحم قال) رسول الله ﷺ: (أي لحم)", url: "https://shamela.ws/book/18268/8031" } },
            { text: sahih('muslim', 1802, 1291, 1329) },
            { text: sahih('muslim', 1802, 1330, 1385), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1802, 1330, 1355) },
            { text: sahih('muslim', 1802, 1386, 1436), speaker: { name: "رجل" }, lead: sahih('muslim', 1802, 1386, 1401) },
            { text: sahih('muslim', 1802, 1437, 1457), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1802, 1437, 1444), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 357, quote: "(فقال) رسول الله ﷺ: (أو) افعلوا (ذاك)", url: "https://shamela.ws/book/18268/8032" } },
          ] },
        { title: "رجع ذباب سيفه", text: sahih('muslim', 1802, 1458, 1647), people: [],
          turns: [
            { text: sahih('muslim', 1802, 1458, 1647) },
          ] },
        { title: "«إن له لأجران»", text: sahih('muslim', 1802, 1648, 2188), people: ['prophet-muhammad', 'usayd-ibn-al-hudayr'],
          turns: [
            { text: sahih('muslim', 1802, 1648, 1760) },
            { text: sahih('muslim', 1802, 1761, 1774), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1802, 1761, 1766), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 358, quote: "(قال) سلمة: (فلما رآني رسول الله ﷺ ساكتًا) متأسفًا (قال) لي (ما لك)", url: "https://shamela.ws/book/18268/8033" } },
            { text: sahih('muslim', 1802, 1775, 1852), speaker: { name: "سلمة" }, lead: sahih('muslim', 1802, 1775, 1787), teller: true },
            { text: sahih('muslim', 1802, 1853, 1874), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1802, 1853, 1858), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 358, quote: "(حبط عمله قال) رسول الله ﷺ: (من قاله)", url: "https://shamela.ws/book/18268/8033" } },
            { text: sahih('muslim', 1802, 1875, 1942), speaker: { name: "سلمة" }, lead: sahih('muslim', 1802, 1875, 1882), teller: true },
            { text: sahih('muslim', 1802, 1943, 1978), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1802, 1943, 1950), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 358, quote: "(فقال) لي رسول الله ﷺ: (كذب) أي أخطأ (من قاله)", url: "https://shamela.ws/book/18268/8033" } },
            { text: sahih('muslim', 1802, 1979, 2007) },
            { text: sahih('muslim', 1802, 2008, 2075), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 359, quote: "(وجمع) النبي ﷺ (بين إصبعيه) من أصابعه فقال: (إنه)", url: "https://shamela.ws/book/18268/8034" } },
            { text: sahih('muslim', 1802, 2076, 2188) },
          ] },
      ],
    },
    {
      isnad: sahih('bukhari', 4196, 0, 164),
      source: { slug: 'sahih-al-bukhari', hadith: 4196, url: 'https://sunnah.com/bukhari:4196' },
      moments: [
        { title: "«من هذا السائق؟»", text: sahih('bukhari', 4196, 165, 849), people: ['prophet-muhammad'] },
        { title: "«أهريقوها واكسروها»", text: sahih('bukhari', 4196, 850, 1386), people: ['prophet-muhammad'] },
        { title: "رجع ذباب سيفه", text: sahih('bukhari', 4196, 1387, 1572), people: [] },
        { title: "«إن له لأجرين»", text: sahih('bukhari', 4196, 1573, 1980), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default amirIbnAlAkwaAtKhaybar;
