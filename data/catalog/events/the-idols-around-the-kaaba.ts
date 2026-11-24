import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * On the day of the conquest there were three hundred and sixty idols around the Ka'bah; the Prophet ﷺ struck them with a
 * stick in his hand, reciting «جاء الحق وزهق الباطل» and «جاء الحق وما يبدئ الباطل وما يعيد». Told from Ibn Mas'ud's
 * hadith: Sahih al-Bukhari 4287 (al-Maghazi, the chapter on the conquest) first, whole; then Sahih Muslim 1781 (al-Jihad,
 * the removal of the idols from around the Ka'bah), whole, which gives 17:81 to its end.
 */
const theIdolsAroundTheKaaba = {
  kind: 'EVENT',
  slug: 'the-idols-around-the-kaaba',
  name: "الأنصاب حول الكعبة",
  nameTransliterated: "The idols around the Ka'bah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  ayat: [
    {
      kind: 'RECITED',
      from: '17:81',
      to: '17:81',
      evidence: [
        { source: 'sahih-al-bukhari', hadith: 4287, url: 'https://sunnah.com/bukhari:4287', quote: sahih('bukhari', 4287, 319, 355) },
        { source: 'sahih-muslim', hadith: 1781, url: 'https://sunnah.com/muslim:1781', quote: sahih('muslim', 1781, 394, 456) },
      ],
    },
    {
      kind: 'RECITED',
      from: '34:49',
      to: '34:49',
      evidence: [
        { source: 'sahih-al-bukhari', hadith: 4287, url: 'https://sunnah.com/bukhari:4287', quote: sahih('bukhari', 4287, 356, 412) },
        { source: 'sahih-muslim', hadith: 1781, url: 'https://sunnah.com/muslim:1781', quote: sahih('muslim', 1781, 476, 530) },
      ],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4287, 0, 167),
      source: { slug: 'sahih-al-bukhari', hadith: 4287, url: 'https://sunnah.com/bukhari:4287' },
      moments: [
        { title: "ستون وثلاثمائة نصب", text: sahih('bukhari', 4287, 168, 414), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('muslim', 1781, 0, 258),
      source: { slug: 'sahih-muslim', hadith: 1781, url: 'https://sunnah.com/muslim:1781' },
      moments: [
        { title: "ثلاثمائة وستون نصبا", text: sahih('muslim', 1781, 259, 574), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theIdolsAroundTheKaaba;
