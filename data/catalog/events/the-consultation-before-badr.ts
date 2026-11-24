import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Anas: when word came of Abu Sufyan's approach the Prophet ﷺ consulted his companions, and Sa'd ibn Ubadah said they would
 * ride into the sea if he ordered it; at Badr they caught a black slave of Quraysh's water carriers and beat him when he
 * told the truth, and the Prophet ﷺ, finishing his prayer, rebuked them, then showed where each of Quraysh would fall.
 * Told from Sahih Muslim 1779 (al-Jihad, the chapter on the battle of Badr), whole. Shaybah is named among Quraysh but has
 * no catalog subject and is not linked.
 */
const theConsultationBeforeBadr = {
  kind: 'EVENT',
  slug: 'the-consultation-before-badr',
  name: "المشورة قبل بدر",
  nameTransliterated: "The consultation before Badr",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-bakr-as-siddiq' }, { person: 'umar-ibn-al-khattab' }, { person: 'saad-ibn-ubadah' }, { person: 'abu-sufyan-ibn-harb' }, { person: 'abu-jahl-ibn-hisham' }, { person: 'utbah-ibn-rabiah' }, { person: 'umayyah-ibn-khalaf' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('muslim', 1779, 0, 115),
      source: { slug: 'sahih-muslim', hadith: 1779, url: 'https://sunnah.com/muslim:1779' },
      moments: [
        { title: "«إيانا تريد؟ يا رسول الله»", text: sahih('muslim', 1779, 116, 521), people: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab', 'saad-ibn-ubadah'],
          turns: [
            { text: sahih('muslim', 1779, 116, 279) },
            { text: sahih('muslim', 1779, 280, 521), speaker: { person: "saad-ibn-ubadah", name: "سعد" }, lead: sahih('muslim', 1779, 280, 311) },
          ] },
        { title: "غلام أسود لبني الحجاج", text: sahih('muslim', 1779, 522, 1192), people: ['prophet-muhammad', 'abu-sufyan-ibn-harb', 'abu-jahl-ibn-hisham', 'utbah-ibn-rabiah', 'umayyah-ibn-khalaf'],
          turns: [
            { text: sahih('muslim', 1779, 522, 782) },
            { text: sahih('muslim', 1779, 783, 899), speaker: { name: "الغلام" }, lead: sahih('muslim', 1779, 783, 793), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 265, quote: "(فيقول) الغلام: (ما لي علم)", url: "https://shamela.ws/book/18268/7940" } },
            { text: sahih('muslim', 1779, 900, 932) },
            { text: sahih('muslim', 1779, 933, 992), speaker: { name: "الغلام" }, lead: sahih('muslim', 1779, 933, 941), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 265, quote: "فإذا قال) الغلام (ذلك) القول يعني قوله هذا أبو جهل (ضربوه فقال) أي فيقول: (نعم أنا أخبركم) وأقول لكم: (هذا أبو سفيان) تركوه (فإذا تركوه فسألوه) ثانيًا فقالوا له أين أبو سفيان (فقال ما لي بأبي سفيان علم ولكن)", url: "https://shamela.ws/book/18268/7940" } },
            { text: sahih('muslim', 1779, 993, 1022) },
            { text: sahih('muslim', 1779, 1023, 1153), speaker: { name: "الغلام" }, lead: sahih('muslim', 1779, 1023, 1031), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 265, quote: "فإذا قال) الغلام (ذلك) القول يعني قوله هذا أبو جهل (ضربوه فقال) أي فيقول: (نعم أنا أخبركم) وأقول لكم: (هذا أبو سفيان) تركوه (فإذا تركوه فسألوه) ثانيًا فقالوا له أين أبو سفيان (فقال ما لي بأبي سفيان علم ولكن)", url: "https://shamela.ws/book/18268/7940" } },
            { text: sahih('muslim', 1779, 1154, 1192) },
          ] },
        { title: "«لتضربوه إذا صدقكم»", text: sahih('muslim', 1779, 1193, 1354), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1779, 1193, 1354), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1779, 1193, 1260) },
          ] },
        { title: "«هذا مصرع فلان»", text: sahih('muslim', 1779, 1355, 1518), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1779, 1355, 1412), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1779, 1355, 1387) },
            { text: sahih('muslim', 1779, 1413, 1518) },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theConsultationBeforeBadr;
