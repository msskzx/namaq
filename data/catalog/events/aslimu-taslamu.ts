import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * From the mosque the Prophet ﷺ took his Companions to the Jews and called «يا معشر يهود! أسلموا تسلموا» three times; they
 * said «قد بلغت يا أبا القاسم», and he told them the land was Allah's and His Messenger's and he would remove them, so
 * whoever had property should sell it. Told from Sahih Muslim 1765 (al-Jihad, the removal of the Jews from the Hijaz),
 * whole. Abu Hurayrah, who went with him, is linked.
 */
const aslimuTaslamu = {
  kind: 'EVENT',
  slug: 'aslimu-taslamu',
  name: "أسلموا تسلموا",
  nameTransliterated: "Accept islam and be safe",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-hurayrah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('muslim', 1765, 0, 118),
      source: { slug: 'sahih-muslim', hadith: 1765, url: 'https://sunnah.com/muslim:1765' },
      moments: [
        { title: "«انطلقوا إلى يهود»", text: sahih('muslim', 1765, 119, 361), people: ['prophet-muhammad', 'abu-hurayrah'],
          turns: [
            { text: sahih('muslim', 1765, 119, 190) },
            { text: sahih('muslim', 1765, 191, 226), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1765, 191, 198), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 199, quote: "(فقال) لنا رسول الله ﷺ: (انطلقوا)", url: "https://shamela.ws/book/18268/7874" } },
            { text: sahih('muslim', 1765, 227, 266) },
            { text: sahih('muslim', 1765, 267, 361), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1765, 267, 314) },
          ] },
        { title: "«اعلموا أنما الأرض لله ورسوله»", text: sahih('muslim', 1765, 362, 835), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1765, 362, 410), speaker: { name: "اليهود" }, lead: sahih('muslim', 1765, 362, 372), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 200, quote: "ولكن ملاعين اليهود إنما فهموا منه الدعاء إلى الإسلام وكرهوه (فقالوا) في جوابه (قد بلَّغت يا أبا القاسم)", url: "https://shamela.ws/book/18268/7875" } },
            { text: sahih('muslim', 1765, 411, 483), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1765, 411, 443) },
            { text: sahih('muslim', 1765, 484, 531) },
            { text: sahih('muslim', 1765, 532, 581), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1765, 532, 564) },
            { text: sahih('muslim', 1765, 582, 835), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('muslim', 1765, 582, 618), witness: { source: "kawkab-wahhaj", volume: 19, volumeLabel: "19", page: 200, quote: "(فقال لهم رسول الله ﷺ ذلك) أي اعترافكم بالتبليغ (أريد) منكم (فقال لهم) أيضًا أسلموا تسلموا المرة (الثالثة فقال)", url: "https://shamela.ws/book/18268/7875" } },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default aslimuTaslamu;
