import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Amr ibn al-As, dying, wept with his face to the wall and told of his three states: none hated the Prophet ﷺ more than
 * he; then Allah put Islam in his heart and he held back his hand at the pledge to ask to be forgiven, and was told that
 * Islam wipes out what was before it; then none was dearer to him, and he could not fill his eyes with him. Told from
 * Sahih Muslim 121 (al-Iman), whole. His son is not named in the text and is not linked.
 */
const islamOfAmrIbnAlAs = {
  kind: 'EVENT',
  slug: 'islam-of-amr-ibn-al-as',
  name: "إسلام عمرو بن العاص",
  nameTransliterated: "The Islam of Amr ibn al-As",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'amr-ibn-al-as' }, { person: 'prophet-muhammad' }],
  tags: ['ISLAM', 'HIS_WORDS'],
  reports: [
    {
      isnad: sahih('muslim', 121, 0, 335),
      source: { slug: 'sahih-muslim', hadith: 121, url: 'https://sunnah.com/muslim:121' },
      moments: [
        { title: "في سياقة الموت", text: sahih('muslim', 121, 336, 576), people: ['amr-ibn-al-as', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 121, 336, 450) },
            { text: sahih('muslim', 121, 451, 576), speaker: { person: "abdullah-ibn-amr-ibn-al-as", name: "عبد الله بن عمرو" }, lead: sahih('muslim', 121, 451, 476), witness: { source: "kawkab-wahhaj", volume: 3, volumeLabel: "3", page: 218, quote: "(فجعل ابنه) عبد الله بن عمرو أي شرع (يقول) له", url: "https://shamela.ws/book/18268/1362" } },
          ] },
        { title: "«كنت على أطباق ثلاث»", text: sahih('muslim', 121, 577, 978), people: ['amr-ibn-al-as', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 121, 577, 978), speaker: { person: "amr-ibn-al-as", name: "عمرو" }, lead: sahih('muslim', 121, 577, 613), witness: { source: "kawkab-wahhaj", volume: 3, volumeLabel: "3", page: 219, quote: "(قال) عمرو بن العاص (إن أفضل ما نعد)", url: "https://shamela.ws/book/18268/1363" } },
          ] },
        { title: "«ابسط يمينك فلأبايعك»", text: sahih('muslim', 121, 979, 1245), people: ['amr-ibn-al-as', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 121, 979, 1123), speaker: { person: "amr-ibn-al-as", name: "عمرو" }, witness: { source: "kawkab-wahhaj", volume: 3, volumeLabel: "3", page: 219, quote: "(قال) عمرو بن العاص (إن أفضل ما نعد)", url: "https://shamela.ws/book/18268/1363" } },
            { text: sahih('muslim', 121, 1124, 1148), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 121, 1124, 1127), witness: { source: "kawkab-wahhaj", volume: 3, volumeLabel: "3", page: 220, quote: "فـ (ـقال) لي رسول الله ﷺ (ما لك)", url: "https://shamela.ws/book/18268/1364" } },
            { text: sahih('muslim', 121, 1149, 1188), speaker: { person: "amr-ibn-al-as", name: "عمرو" }, lead: sahih('muslim', 121, 1149, 1162), witness: { source: "kawkab-wahhaj", volume: 3, volumeLabel: "3", page: 220, quote: "(قال) عمرو (قلت) له ﷺ (أردت)", url: "https://shamela.ws/book/18268/1364" } },
            { text: sahih('muslim', 121, 1189, 1218), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 121, 1189, 1194), witness: { source: "kawkab-wahhaj", volume: 3, volumeLabel: "3", page: 220, quote: "(قال) لي رسول الله ﷺ (تشترط بماذا)", url: "https://shamela.ws/book/18268/1364" } },
            { text: sahih('muslim', 121, 1219, 1245), speaker: { person: "amr-ibn-al-as", name: "عمرو" }, lead: sahih('muslim', 121, 1219, 1226), witness: { source: "kawkab-wahhaj", volume: 3, volumeLabel: "3", page: 221, quote: "قال عمرو (قلت) له ﷺ أريد أن أشترط على ربي (أن يغفر لي)", url: "https://shamela.ws/book/18268/1365" } },
          ] },
        { title: "«أن الإسلام يهدم ما كان قبله»", text: sahih('muslim', 121, 1246, 1412), people: ['prophet-muhammad', 'amr-ibn-al-as'],
          turns: [
            { text: sahih('muslim', 121, 1246, 1412), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 121, 1246, 1251), witness: { source: "kawkab-wahhaj", volume: 3, volumeLabel: "3", page: 221, quote: "فـ (ـقال) لي رسول الله ﷺ (أما علمت)", url: "https://shamela.ws/book/18268/1365" } },
          ] },
        { title: "«إجلالا له»", text: sahih('muslim', 121, 1413, 1748), people: ['amr-ibn-al-as', 'prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 121, 1413, 1748), speaker: { person: "amr-ibn-al-as", name: "عمرو" }, witness: { source: "kawkab-wahhaj", volume: 3, volumeLabel: "3", page: 219, quote: "(قال) عمرو بن العاص (إن أفضل ما نعد)", url: "https://shamela.ws/book/18268/1363" } },
          ] },
        { title: "«فشنّوا عليّ التراب شنّا»", text: sahih('muslim', 121, 1749, 2067), people: ['amr-ibn-al-as'],
          turns: [
            { text: sahih('muslim', 121, 1749, 2067), speaker: { person: "amr-ibn-al-as", name: "عمرو" }, witness: { source: "kawkab-wahhaj", volume: 3, volumeLabel: "3", page: 219, quote: "(قال) عمرو بن العاص (إن أفضل ما نعد)", url: "https://shamela.ws/book/18268/1363" } },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default islamOfAmrIbnAlAs;
