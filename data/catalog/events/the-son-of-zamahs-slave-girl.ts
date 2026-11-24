import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Utbah ibn Abi Waqqas charged his brother Sa'd to take the son of Zam'ah's slave girl as his; in the conquest Sa'd brought
 * the boy, Abd ibn Zam'ah said he was his brother born on his father's bed, and the Prophet ﷺ gave him to Abd and told
 * Sawdah «احتجبي منه» for his likeness to Utbah: «الولد للفراش وللعاهر الحجر». Told from Sahih al-Bukhari 4303 (al-Maghazi,
 * the chapter after the conquest), whole. Utbah, Abd ibn Zam'ah and the boy have no catalog subject; Abu Hurayrah is named
 * only as one who used to proclaim it and is not linked.
 */
const theSonOfZamahsSlaveGirl = {
  kind: 'EVENT',
  slug: 'the-son-of-zamahs-slave-girl',
  name: "ابن وليدة زمعة",
  nameTransliterated: "The son of Zam'ah's slave girl",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'saad-ibn-abi-waqqas' }, { person: 'prophet-muhammad' }, { person: 'sawdah-bint-zamah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4303, 0, 279),
      source: { slug: 'sahih-al-bukhari', hadith: 4303, url: 'https://sunnah.com/bukhari:4303' },
      moments: [
        {
          title: "عهد عتبة إلى أخيه سعد",
          text: sahih('bukhari', 4303, 280, 418),
          people: ['saad-ibn-abi-waqqas'],
          turns: [
            { text: sahih('bukhari', 4303, 280, 384) },
            { text: sahih('bukhari', 4303, 385, 418), speaker: { name: "عتبة" }, lead: sahih('bukhari', 4303, 385, 402) },
          ],
        },
        {
          title: "«هذا ابن أخي»",
          text: sahih('bukhari', 4303, 419, 805),
          people: ['saad-ibn-abi-waqqas', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4303, 419, 612) },
            { text: sahih('bukhari', 4303, 613, 699), speaker: { person: "saad-ibn-abi-waqqas", name: "سعد بن أبي وقاص" }, lead: sahih('bukhari', 4303, 613, 648) },
            { text: sahih('bukhari', 4303, 700, 805), speaker: { name: "عبد بن زمعة" }, lead: sahih('bukhari', 4303, 700, 727) },
          ],
        },
        {
          title: "«احتجبي منه يا سودة»",
          text: sahih('bukhari', 4303, 806, 1325),
          people: ['prophet-muhammad', 'sawdah-bint-zamah'],
          turns: [
            { text: sahih('bukhari', 4303, 806, 920) },
            { text: sahih('bukhari', 4303, 921, 1039), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 4303, 921, 945) },
            { text: sahih('bukhari', 4303, 1040, 1095), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 4303, 1040, 1064) },
            { text: sahih('bukhari', 4303, 1096, 1149) },
            { text: sahih('bukhari', 4303, 1150, 1259), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 4303, 1150, 1212) },
            { text: sahih('bukhari', 4303, 1260, 1325) },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theSonOfZamahsSlaveGirl;
