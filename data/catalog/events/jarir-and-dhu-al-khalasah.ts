import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ said to Jarir «ألا تريحني من ذي الخلصة», the house of Khath'am called the Yemeni Ka'bah; Jarir, who could
 * not sit firm on a horse, was struck on the chest and prayed for, «اللهم ثبته، واجعله هاديا مهديا», rode out with a hundred
 * and fifty horsemen of Ahmas, burned and broke it, made a man casting arrows break them and bear witness, and sent word
 * «كأنها جمل أجرب»; the Prophet ﷺ blessed the horses and men of Ahmas five times. Told from Sahih al-Bukhari (al-Maghazi,
 * the raid of Dhu al-Khalasah), each hadith whole: 4357 first, the fullest; then 4356 and 4355. Abu Artah and the man with
 * the arrows have no catalog subject.
 */
const jarirAndDhuAlKhalasah = {
  kind: 'EVENT',
  slug: 'jarir-and-dhu-al-khalasah',
  name: "جرير وذو الخلصة",
  nameTransliterated: "Jarir and Dhu al-Khalasah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'jarir-ibn-abdullah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4357, 0, 131),
      source: { slug: 'sahih-al-bukhari', hadith: 4357, url: 'https://sunnah.com/bukhari:4357' },
      moments: [
        { title: "«ألا تريحني من ذي الخلصة»", text: sahih('bukhari', 4357, 132, 215), people: ['prophet-muhammad', 'jarir-ibn-abdullah'] },
        { title: "«اللهم ثبته»", text: sahih('bukhari', 4357, 216, 555), people: ['jarir-ibn-abdullah', 'prophet-muhammad'] },
        { title: "حرقها بالنار وكسرها", text: sahih('bukhari', 4357, 556, 734), people: ['jarir-ibn-abdullah'] },
        { title: "«لتكسرنها ولتشهدا»", text: sahih('bukhari', 4357, 735, 1117), people: ['jarir-ibn-abdullah'] },
        { title: "«كأنها جمل أجرب»", text: sahih('bukhari', 4357, 1118, 1451), people: ['jarir-ibn-abdullah', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4356, 0, 141),
      source: { slug: 'sahih-al-bukhari', hadith: 4356, url: 'https://sunnah.com/bukhari:4356' },
      moments: [
        { title: "«ألا تريحني من ذي الخلصة»", text: sahih('bukhari', 4356, 142, 400), people: ['prophet-muhammad', 'jarir-ibn-abdullah'] },
        { title: "«اللهم ثبته»", text: sahih('bukhari', 4356, 401, 580), people: ['prophet-muhammad', 'jarir-ibn-abdullah'] },
        { title: "«كأنها جمل أجرب»", text: sahih('bukhari', 4356, 581, 801), people: ['jarir-ibn-abdullah', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4355, 0, 94),
      source: { slug: 'sahih-al-bukhari', hadith: 4355, url: 'https://sunnah.com/bukhari:4355' },
      moments: [
        {
          title: "«ألا تريحني من ذي الخلصة»",
          text: sahih('bukhari', 4355, 95, 379),
          people: ['prophet-muhammad', 'jarir-ibn-abdullah'],
          turns: [
            { text: sahih('bukhari', 4355, 95, 218) },
            { text: sahih('bukhari', 4355, 219, 283), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 4355, 219, 244) },
            { text: sahih('bukhari', 4355, 284, 379) },
          ],
        },
        {
          title: "فدعا لنا ولأحمس",
          text: sahih('bukhari', 4355, 380, 448),
          people: ['jarir-ibn-abdullah', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4355, 380, 448) },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default jarirAndDhuAlKhalasah;
