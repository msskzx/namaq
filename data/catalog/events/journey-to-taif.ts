import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

// After Abu Talib died and Quraysh closed in. Undated in the chapter.
// Told as a story from Sahih Muslim 1795 (al-Jihad, the chapter on what the Prophet ﷺ met from the mushrikun), whole:
// Aisha asks whether any day was harder than Uhud, and he tells of the day of al-Aqabah, Jibril and the angel of the
// mountains. Ibn Abd Yalil ibn Abd Kulal has no catalog subject and is not linked.
const journeyToTaif = {
  kind: 'EVENT',
  slug: 'journey-to-taif',
  name: 'خروجه إلى الطائف',
  nameTransliterated: 'The Journey to Ta’if',
  type: 'TRAVEL',
  fields: {
    location: { value: 'الطائف', claims: ['sira/taif'] },
    description: {
      value:
        'عمد إلى ثقيف بالطائف يرجو أن يؤووه، فرده سادتهم وتهزؤوا به وأقعدوا له صفين يرضخون رجليه بالحجارة، فعرض عليه ملك الجبال أن يطبق عليهم الأخشبين، فقال: بل أرجو أن يخرج الله من أصلابهم من يعبد الله لا يشرك به شيئا.',
      claims: ['sira/taif'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['sira/taif'] }, { person: 'aisha-bint-abi-bakr' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('muslim', 1795, 0, 310),
      source: { slug: 'sahih-muslim', hadith: 1795, url: 'https://sunnah.com/muslim:1795' },
      moments: [
        { title: "«هل أتى عليك يوم كان أشد من يوم أحد؟»", text: sahih('muslim', 1795, 311, 665), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1795, 311, 430), speaker: { person: "aisha-bint-abi-bakr", name: "عائشة" }, lead: sahih('muslim', 1795, 311, 348), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 325, quote: "أن عائشة زوج النبي ﷺ) رضي الله تعالى عنها وهذا السند من سداسياته (حدثته) أي حدثت لعروة (أنها قالت لرسول الله ﷺ", url: "https://shamela.ws/book/18268/8000" } },
            { text: sahih('muslim', 1795, 431, 665), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1795, 431, 438), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 325, quote: "(فقال) لها رسول الله ﷺ والله (لقد لقيت من قومك)", url: "https://shamela.ws/book/18268/8000" } },
          ] },
        { title: "فإذا فيها جبريل", text: sahih('muslim', 1795, 666, 990), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1795, 666, 827) },
            { text: sahih('muslim', 1795, 828, 990), speaker: { name: "جبريل" }, lead: sahih('muslim', 1795, 828, 836), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 327, quote: "(فناداني) جبريل (فقال) لي", url: "https://shamela.ws/book/18268/8002" } },
          ] },
        { title: "«إن شئت أن أطبق عليهم الأخشبين»", text: sahih('muslim', 1795, 991, 1278), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1795, 991, 1046), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1795, 991, 997), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 327, quote: "(قال) رسول الله ﷺ: (فناداني ملك الجبال", url: "https://shamela.ws/book/18268/8002" } },
            { text: sahih('muslim', 1795, 1047, 1278), speaker: { name: "ملك الجبال" }, lead: sahih('muslim', 1795, 1047, 1059), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 327, quote: "(فناداني ملك الجبال وسلم علي ثم قال: يا محمد", url: "https://shamela.ws/book/18268/8002" } },
          ] },
        { title: "«بل أرجو أن يخرج الله من أصلابهم»", text: sahih('muslim', 1795, 1279, 1414), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1795, 1279, 1414), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1795, 1279, 1309) },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default journeyToTaif;
