import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ said «لا يصلين أحد العصر إلا في بني قريظة»; the time came on the road, some would not pray until they got
 * there and some prayed, and he blamed neither. Told from Sahih al-Bukhari 4119 (al-Maghazi, the chapter on the march on
 * Banu Qurayzah), whole.
 *
 * Then Ibn Umar's same hadith in Sahih Muslim 1770 (al-Jihad, hastening to the raid), whole. It says «الظهر» where 4119
 * says «العصر»; both are kept as printed.
 */
const theAsrAtBanuQurayzah = {
  kind: 'EVENT',
  slug: 'the-asr-at-banu-qurayzah',
  name: "العصر في بني قريظة",
  nameTransliterated: "The Asr prayer at Banu Qurayzah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4119, 0, 149),
      source: { slug: 'sahih-al-bukhari', hadith: 4119, url: 'https://sunnah.com/bukhari:4119' },
      moments: [
        {
          title: "«لا يصلين أحد العصر إلا في بني قريظة»",
          text: sahih('bukhari', 4119, 150, 252),
          people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4119, 150, 252), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 4119, 150, 190) },
          ],
        },
        {
          title: "فلم يعنف واحدا منهم",
          text: sahih('bukhari', 4119, 253, 481),
          people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4119, 253, 299) },
            { text: sahih('bukhari', 4119, 300, 352), speaker: { name: "بعضهم" }, lead: sahih('bukhari', 4119, 300, 319) },
            { text: sahih('bukhari', 4119, 353, 414), speaker: { name: "بعضهم" }, lead: sahih('bukhari', 4119, 353, 372) },
            { text: sahih('bukhari', 4119, 415, 481) },
          ],
        },
      ],
    },
    {
      isnad: sahih('muslim', 1770, 0, 151),
      source: { slug: 'sahih-muslim', hadith: 1770, url: 'https://sunnah.com/muslim:1770' },
      moments: [
        { title: "«أن لا يصلين أحد الظهر إلا في بني قريظة»", text: sahih('muslim', 1770, 152, 459), people: ['prophet-muhammad'] },
        { title: "فما عنف واحدا من الفريقين", text: sahih('muslim', 1770, 460, 510), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theAsrAtBanuQurayzah;
