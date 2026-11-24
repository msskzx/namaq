import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * In the truce Abu Sufyan was in Syria when Dihyah al-Kalbi's letter from the Prophet ﷺ reached Heraclius by way of the
 * governor of Busra; Heraclius called the Qurashis there, put Abu Sufyan in front as the nearest in lineage, questioned him
 * on the Prophet ﷺ, answered each reply with «وكذلك الرسل…», said «إن يكن ما تقول فيه حقا، فإنه نبي», and had the letter
 * read, «أسلم تسلم… ويا أهل الكتاب تعالوا إلى كلمة سواء»; Abu Sufyan went out sure the matter would prevail. Told from
 * Sahih Muslim 1773 (al-Jihad, the letter to Heraclius), the first of its routes, whole. Heraclius and his interpreter
 * have no catalog subject.
 */
const abuSufyanBeforeHeraclius = {
  kind: 'EVENT',
  slug: 'abu-sufyan-before-heraclius',
  name: "أبو سفيان عند هرقل",
  nameTransliterated: "Abu Sufyan before Heraclius",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-sufyan-ibn-harb' }, { person: 'prophet-muhammad' }, { person: 'dihyah-al-kalbi' }],
  ayat: [
    {
      kind: 'RECITED',
      from: '3:64',
      to: '3:64',
      evidence: [{ source: 'sahih-muslim', hadith: 1773, url: 'https://sunnah.com/muslim:1773', quote: sahih('muslim', 1773, 4612, 4680) }],
    },
  ],
  reports: [
    {
      isnad: sahih('muslim', 1773, 0, 389),
      source: { slug: 'sahih-muslim', hadith: 1773, url: 'https://sunnah.com/muslim:1773' },
      moments: [
        { title: "كتاب إلى هرقل", text: sahih('muslim', 1773, 390, 708), people: ['abu-sufyan-ibn-harb', 'prophet-muhammad', 'dihyah-al-kalbi'],
          turns: [
            { text: sahih('muslim', 1773, 390, 708) },
          ] },
        { title: "«أيكم أقرب نسبا من هذا الرجل»", text: sahih('muslim', 1773, 709, 1384), people: ['abu-sufyan-ibn-harb'],
          turns: [
            { text: sahih('muslim', 1773, 709, 801), speaker: { name: "هرقل" }, lead: sahih('muslim', 1773, 709, 722) },
            { text: sahih('muslim', 1773, 802, 818) },
            { text: sahih('muslim', 1773, 819, 920) },
            { text: sahih('muslim', 1773, 921, 1011), speaker: { name: "هرقل" }, lead: sahih('muslim', 1773, 921, 929), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 226, quote: "(فقال) لنا هرقل: (أيكم)", url: "https://shamela.ws/book/18268/7901" } },
            { text: sahih('muslim', 1773, 1012, 1053), speaker: { person: "abu-sufyan-ibn-harb", name: "أبو سفيان" }, lead: sahih('muslim', 1773, 1012, 1046) },
            { text: sahih('muslim', 1773, 1054, 1146) },
            { text: sahih('muslim', 1773, 1147, 1274), speaker: { name: "هرقل" }, lead: sahih('muslim', 1773, 1147, 1160), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 227, quote: "(فقال) هرقل (له) أي لترجمانه (قل لهم)", url: "https://shamela.ws/book/18268/7902" } },
            { text: sahih('muslim', 1773, 1275, 1384), speaker: { person: "abu-sufyan-ibn-harb", name: "أبو سفيان" }, lead: sahih('muslim', 1773, 1275, 1305) },
          ] },
        { title: "«كيف حسبه فيكم؟»", text: sahih('muslim', 1773, 1385, 2327), people: ['abu-sufyan-ibn-harb'],
          turns: [
            { text: sahih('muslim', 1773, 1385, 1446), speaker: { name: "هرقل" }, lead: sahih('muslim', 1773, 1385, 1413), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 227, quote: "(ثم قال) هرقل (لترجمانه سله)", url: "https://shamela.ws/book/18268/7902" } },
            { text: sahih('muslim', 1773, 1447, 1484), speaker: { person: "abu-sufyan-ibn-harb", name: "أبو سفيان" }, lead: sahih('muslim', 1773, 1447, 1460), teller: true },
            { text: sahih('muslim', 1773, 1485, 1526), speaker: { name: "هرقل" }, lead: sahih('muslim', 1773, 1485, 1491), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 228, quote: "(قال) لي هرقل: (فهل كان من آبائه ملك)", url: "https://shamela.ws/book/18268/7903" } },
            { text: sahih('muslim', 1773, 1527, 1539), speaker: { person: "abu-sufyan-ibn-harb", name: "أبو سفيان" }, lead: sahih('muslim', 1773, 1527, 1534), teller: true },
            { text: sahih('muslim', 1773, 1540, 1620), speaker: { name: "هرقل" }, lead: sahih('muslim', 1773, 1540, 1546), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 228, quote: "(قلت: لا قال) هرقل: (فهل كنتم", url: "https://shamela.ws/book/18268/7903" } },
            { text: sahih('muslim', 1773, 1621, 1633), speaker: { person: "abu-sufyan-ibn-harb", name: "أبو سفيان" }, lead: sahih('muslim', 1773, 1621, 1628), teller: true },
            { text: sahih('muslim', 1773, 1634, 1678), speaker: { name: "هرقل" }, lead: sahih('muslim', 1773, 1634, 1640), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 228, quote: "(قال) هرقل: (ومن يتبعه", url: "https://shamela.ws/book/18268/7903" } },
            { text: sahih('muslim', 1773, 1679, 1699), speaker: { person: "abu-sufyan-ibn-harb", name: "أبو سفيان" }, lead: sahih('muslim', 1773, 1679, 1687), teller: true },
            { text: sahih('muslim', 1773, 1700, 1728), speaker: { name: "هرقل" }, lead: sahih('muslim', 1773, 1700, 1704), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 228, quote: "(قال) هرقل: (أيزيدون)", url: "https://shamela.ws/book/18268/7903" } },
            { text: sahih('muslim', 1773, 1729, 1764), speaker: { person: "abu-sufyan-ibn-harb", name: "أبو سفيان" }, lead: sahih('muslim', 1773, 1729, 1742), teller: true },
            { text: sahih('muslim', 1773, 1765, 1859), speaker: { name: "هرقل" }, lead: sahih('muslim', 1773, 1765, 1771), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 228, quote: "(قال) هرقل: (هل يرتد)", url: "https://shamela.ws/book/18268/7903" } },
            { text: sahih('muslim', 1773, 1860, 1878), speaker: { person: "abu-sufyan-ibn-harb", name: "أبو سفيان" }, lead: sahih('muslim', 1773, 1860, 1873), teller: true },
            { text: sahih('muslim', 1773, 1879, 1908), speaker: { name: "هرقل" }, lead: sahih('muslim', 1773, 1879, 1885), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 228, quote: "(قال) هرقل: (فهل قاتلتموه)", url: "https://shamela.ws/book/18268/7903" } },
            { text: sahih('muslim', 1773, 1909, 1924), speaker: { person: "abu-sufyan-ibn-harb", name: "أبو سفيان" }, lead: sahih('muslim', 1773, 1909, 1916), teller: true },
            { text: sahih('muslim', 1773, 1925, 1968), speaker: { name: "هرقل" }, lead: sahih('muslim', 1773, 1925, 1931), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 228, quote: "(قال) هرقل: (فكيف كان قتالكم إياه)", url: "https://shamela.ws/book/18268/7903" } },
            { text: sahih('muslim', 1773, 1969, 2064), speaker: { person: "abu-sufyan-ibn-harb", name: "أبو سفيان" }, lead: sahih('muslim', 1773, 1969, 1982), teller: true },
            { text: sahih('muslim', 1773, 2065, 2088), speaker: { name: "هرقل" }, lead: sahih('muslim', 1773, 2065, 2071), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 229, quote: "(قال) هرقل: (فهل يغدر)", url: "https://shamela.ws/book/18268/7904" } },
            { text: sahih('muslim', 1773, 2089, 2166), speaker: { person: "abu-sufyan-ibn-harb", name: "أبو سفيان" }, lead: sahih('muslim', 1773, 2089, 2096), teller: true },
            { text: sahih('muslim', 1773, 2167, 2255) },
            { text: sahih('muslim', 1773, 2256, 2308), speaker: { name: "هرقل" }, lead: sahih('muslim', 1773, 2256, 2262), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 229, quote: "(قال) هرقل لأبي سفيان (فهل قال هذا القول)", url: "https://shamela.ws/book/18268/7904" } },
            { text: sahih('muslim', 1773, 2309, 2327), speaker: { person: "abu-sufyan-ibn-harb", name: "أبو سفيان" }, lead: sahih('muslim', 1773, 2309, 2322), teller: true },
          ] },
        { title: "«وكذلك الرسل تبعث في أحساب قومها»", text: sahih('muslim', 1773, 2328, 3786), people: ['abu-sufyan-ibn-harb'],
          turns: [
            { text: sahih('muslim', 1773, 2328, 3786), speaker: { name: "هرقل" }, lead: sahih('muslim', 1773, 2328, 2361), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 230, quote: "هرقل (لترجمانه قل له)", url: "https://shamela.ws/book/18268/7905" } },
          ] },
        { title: "«إن يكن ما تقول فيه حقا، فإنه نبي»", text: sahih('muslim', 1773, 3787, 4206), people: ['abu-sufyan-ibn-harb'],
          turns: [
            { text: sahih('muslim', 1773, 3787, 3825), speaker: { name: "هرقل" }, lead: sahih('muslim', 1773, 3787, 3806), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 232, quote: "(ثم قال) هرقل: (بم يأمركم)", url: "https://shamela.ws/book/18268/7907" } },
            { text: sahih('muslim', 1773, 3826, 3897), speaker: { person: "abu-sufyan-ibn-harb", name: "أبو سفيان" }, lead: sahih('muslim', 1773, 3826, 3833), teller: true },
            { text: sahih('muslim', 1773, 3898, 4206), speaker: { name: "هرقل" }, lead: sahih('muslim', 1773, 3898, 3904), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 232, quote: "(قال) هرقل: (إن يكن ما تقول فيه)", url: "https://shamela.ws/book/18268/7907" } },
          ] },
        { title: "«أسلم تسلم»", text: sahih('muslim', 1773, 4207, 4861), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1773, 4207, 4861) },
          ] },
        { title: "«لقد أمر أمر ابن أبي كبشة»", text: sahih('muslim', 1773, 4862, 5225), people: ['abu-sufyan-ibn-harb'],
          turns: [
            { text: sahih('muslim', 1773, 4862, 4987) },
            { text: sahih('muslim', 1773, 4988, 5122), speaker: { person: "abu-sufyan-ibn-harb", name: "أبو سفيان" }, lead: sahih('muslim', 1773, 4988, 5033), teller: true },
            { text: sahih('muslim', 1773, 5123, 5225) },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abuSufyanBeforeHeraclius;
