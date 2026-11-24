import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Horsemen sent towards Najd brought Thumamah ibn Uthal of Banu Hanifah and tied him to a pillar of the mosque; three days
 * the Prophet ﷺ asked «ما عندك يا ثمامة» and he gave the same answer, then he was freed, bathed, came back and bore
 * witness, «والله ما كان على الأرض وجه أبغض إلي من وجهك…», went on to his umrah, and told Quraysh no grain would come from
 * al-Yamamah without the Prophet's leave. Told from Abu Hurayrah's hadith: Sahih Muslim 1764 (al-Jihad, binding and freeing
 * a captive) first, the fuller; then Sahih al-Bukhari 4372 (al-Maghazi, the delegation of Banu Hanifah), each whole.
 * Thumamah has no catalog subject.
 */
const islamOfThumamah = {
  kind: 'EVENT',
  slug: 'islam-of-thumamah',
  name: "إسلام ثمامة بن أثال",
  nameTransliterated: "The islam of Thumamah ibn Uthal",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['ISLAM'],
  reports: [
    {
      isnad: sahih('muslim', 1764, 0, 125),
      source: { slug: 'sahih-muslim', hadith: 1764, url: 'https://sunnah.com/muslim:1764' },
      moments: [
        { title: "ربطوه بسارية من سواري المسجد", text: sahih('muslim', 1764, 126, 330), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1764, 126, 330) },
          ] },
        { title: "«ماذا عندك؟ يا ثمامة!»", text: sahih('muslim', 1764, 331, 1097), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1764, 331, 408), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1764, 331, 374) },
            { text: sahih('muslim', 1764, 409, 586), speaker: { name: "ثمامة" }, lead: sahih('muslim', 1764, 409, 417), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 194, quote: "(فقال) ثمامة: (عندي يا محمد", url: "https://shamela.ws/book/18268/7869" } },
            { text: sahih('muslim', 1764, 587, 645) },
            { text: sahih('muslim', 1764, 646, 684), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1764, 646, 653), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 195, quote: "رجع إليه رسول الله ﷺ (فقال) له: (ما عندك يا ثمامة)", url: "https://shamela.ws/book/18268/7870" } },
            { text: sahih('muslim', 1764, 685, 845), speaker: { name: "ثمامة" }, lead: sahih('muslim', 1764, 685, 691), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 195, quote: "(قال) ثمامة: القول (ما قلت لك", url: "https://shamela.ws/book/18268/7870" } },
            { text: sahih('muslim', 1764, 846, 891) },
            { text: sahih('muslim', 1764, 892, 926), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1764, 892, 896), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 195, quote: "فتركه رسول الله ﷺ حتى) إذا (كان) ثمامة (من الغد) أي في الغد من هذا اليوم الثاني رجع إليه (فقال) له", url: "https://shamela.ws/book/18268/7870" } },
            { text: sahih('muslim', 1764, 927, 1097), speaker: { name: "ثمامة" }, lead: sahih('muslim', 1764, 927, 935), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 195, quote: "(يا ثمامة فقال) ثمامة: (عندي)", url: "https://shamela.ws/book/18268/7870" } },
          ] },
        { title: "«أطلقوا ثمامة»", text: sahih('muslim', 1764, 1098, 1706), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1764, 1098, 1146), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1764, 1098, 1123) },
            { text: sahih('muslim', 1764, 1147, 1706) },
          ] },
        { title: "أمره أن يعتمر", text: sahih('muslim', 1764, 1707, 1839), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1764, 1707, 1839) },
          ] },
        { title: "«ولكني أسلمت مع رسول الله ﷺ»", text: sahih('muslim', 1764, 1840, 2066), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1764, 1840, 1863) },
            { text: sahih('muslim', 1764, 1864, 1895), speaker: { name: "قائل" }, lead: sahih('muslim', 1764, 1864, 1883) },
            { text: sahih('muslim', 1764, 1896, 2066), speaker: { name: "ثمامة" }, lead: sahih('muslim', 1764, 1896, 1904), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 196, quote: "(فقال) له ثمامة: (لا)", url: "https://shamela.ws/book/18268/7871" } },
          ] },
      ],
    },
    {
      isnad: sahih('bukhari', 4372, 0, 157),
      source: { slug: 'sahih-al-bukhari', hadith: 4372, url: 'https://sunnah.com/bukhari:4372' },
      moments: [
        { title: "ربطوه بسارية من سواري المسجد", text: sahih('bukhari', 4372, 158, 329), people: ['prophet-muhammad'] },
        { title: "«ما عندك يا ثمامة»", text: sahih('bukhari', 4372, 330, 810), people: ['prophet-muhammad'] },
        { title: "«أطلقوا ثمامة»", text: sahih('bukhari', 4372, 811, 1378), people: ['prophet-muhammad'] },
        { title: "أمره أن يعتمر", text: sahih('bukhari', 4372, 1379, 1509), people: ['prophet-muhammad'] },
        { title: "«ولكن أسلمت مع محمد رسول الله ﷺ»", text: sahih('bukhari', 4372, 1510, 1731), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default islamOfThumamah;
