import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Al-Rubayyi' bint Mu'awwidh: the Prophet ﷺ came in on the morning of her wedding and sat on her bed while girls beat the
 * duff and mourned their fathers killed at Badr, until one sang «وفينا نبي يعلم ما في غد», and he said «لا تقولي هكذا وقولي
 * ما كنت تقولين». Told from Sahih al-Bukhari 4001 (al-Maghazi, in the chapters on Badr), whole, drawn by speaker: each
 * lead names who speaks. Al-Rubayyi' has no catalog subject and is not linked.
 */
const theGirlsWithTheDuff = {
  kind: 'EVENT',
  slug: 'the-girls-with-the-duff',
  name: "الجويريات يضربن بالدف",
  nameTransliterated: "The girls beating the duff",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4001, 0, 135),
      source: { slug: 'sahih-al-bukhari', hadith: 4001, url: 'https://sunnah.com/bukhari:4001' },
      moments: [
        {
          title: "يندبن من قتل من آبائهن يوم بدر",
          text: sahih('bukhari', 4001, 136, 393),
          people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4001, 136, 327) },
            { text: sahih('bukhari', 4001, 328, 393), speaker: { name: "جارية" }, lead: sahih('bukhari', 4001, 328, 353) },
          ],
        },
        {
          title: "«لا تقولي هكذا»",
          text: sahih('bukhari', 4001, 394, 469),
          people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4001, 394, 469), speaker: { person: 'prophet-muhammad', name: "النبي ﷺ" }, lead: sahih('bukhari', 4001, 394, 415) },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theGirlsWithTheDuff;
