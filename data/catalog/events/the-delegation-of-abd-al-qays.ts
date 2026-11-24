import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The delegation of Abd al-Qays came, «مرحبا بالقوم، غير خزايا ولا الندامى»; cut off by the mushrikun of Mudar except in
 * the sacred months, they asked for a few things that would bring them into Paradise, and he gave them four commands and
 * four prohibitions. Told from Ibn Abbas's hadith in Sahih al-Bukhari (al-Maghazi, the delegation of Abd al-Qays), each
 * whole: Abu Jamrah's 4368 first, which he tells in answer to a question on nabidh; then 4369. 4370 (the two rak'ahs after
 * Asr) is its own event; 4371 is a note on Juwatha.
 */
const theDelegationOfAbdAlQays = {
  kind: 'EVENT',
  slug: 'the-delegation-of-abd-al-qays',
  name: "وفد عبد القيس",
  nameTransliterated: "The delegation of Abd al-Qays",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4368, 0, 102),
      source: { slug: 'sahih-al-bukhari', hadith: 4368, url: 'https://sunnah.com/bukhari:4368' },
      moments: [
        { title: "سأل ابن عباس عن النبيذ", text: sahih('bukhari', 4368, 103, 309), people: [] },
        { title: "«مرحبا بالقوم»", text: sahih('bukhari', 4368, 310, 694), people: ['prophet-muhammad'] },
        { title: "«آمركم بأربع وأنهاكم عن أربع»", text: sahih('bukhari', 4368, 695, 1065), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4369, 0, 128),
      source: { slug: 'sahih-al-bukhari', hadith: 4369, url: 'https://sunnah.com/bukhari:4369' },
      moments: [
        { title: "«إنا هذا الحي من ربيعة»", text: sahih('bukhari', 4369, 129, 430), people: ['prophet-muhammad'] },
        { title: "«آمركم بأربع، وأنهاكم عن أربع»", text: sahih('bukhari', 4369, 431, 733), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theDelegationOfAbdAlQays;
