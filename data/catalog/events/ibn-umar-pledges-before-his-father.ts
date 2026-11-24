import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * People said Ibn Umar became Muslim before Umar: Nafi' says that at al-Hudaybiyah Umar sent his son for a horse, he passed
 * the Prophet ﷺ taking the pledge under the tree and pledged, then told Umar, who went and pledged. Told from Sahih al-Bukhari
 * 4186 (al-Maghazi, the chapter on al-Hudaybiyah), whole; then 4187, which al-Bukhari gives without his own chain («وقال هشام
 * بن عمار»), whole, folded; then 3916 (the chapter on the hijra), Ibn Umar's own telling against those who said he emigrated
 * before his father, whole, folded: it does not name the day, but tells the same thing, his pledging first when Umar sent
 * him and Umar pledging after. Ibn Umar has no catalog subject and is not linked.
 */
const ibnUmarPledgesBeforeHisFather = {
  kind: 'EVENT',
  slug: 'ibn-umar-pledges-before-his-father',
  name: "بيعة ابن عمر قبل أبيه",
  nameTransliterated: "Ibn Umar pledges before his father",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: sahih('bukhari', 4186, 0, 106),
      source: { slug: 'sahih-al-bukhari', hadith: 4186, url: 'https://sunnah.com/bukhari:4186' },
      moments: [
        { title: "«إن الناس يتحدثون أن ابن عمر أسلم قبل عمر»", text: sahih('bukhari', 4186, 107, 199), people: ['umar-ibn-al-khattab'] },
        { title: "فبايعه عبد الله", text: sahih('bukhari', 4186, 200, 480), people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
        { title: "فانطلق فذهب معه حتى بايع", text: sahih('bukhari', 4186, 481, 754), people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4187, 0, 169),
      source: { slug: 'sahih-al-bukhari', hadith: 4187, url: 'https://sunnah.com/bukhari:4187' },
      moments: [
        {
          title: "تفرقوا في ظلال الشجر",
          text: sahih('bukhari', 4187, 170, 314),
          people: ['prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4187, 170, 314) },
          ],
        },
        {
          title: "فبايع ثم رجع إلى عمر",
          text: sahih('bukhari', 4187, 315, 488),
          people: ['umar-ibn-al-khattab', 'prophet-muhammad'],
          turns: [
            { text: sahih('bukhari', 4187, 315, 404), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('bukhari', 4187, 315, 323), witness: { source: "fath-al-bari", volume: 7, volumeLabel: "7", page: 456, quote: "قَوْلُهُ: (فَقَالَ: يَا عَبْدَ اللَّهِ) الْقَائِلُ يَا عَبْدَ اللَّهِ هُوَ عُمَرُ.", url: "https://shamela.ws/book/1673/4284" } },
            { text: sahih('bukhari', 4187, 405, 488) },
          ],
        },
      ],
    },
    {
      isnad: sahih('bukhari', 3916, 0, 125),
      source: { slug: 'sahih-al-bukhari', hadith: 3916, url: 'https://sunnah.com/bukhari:3916' },
      moments: [
        { title: "«هاجر قبل أبيه»", text: sahih('bukhari', 3916, 126, 215), people: [] },
        { title: "«اذهب فانظر هل استيقظ»", text: sahih('bukhari', 3916, 216, 440), people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
        { title: "فبايعه ثم بايعته", text: sahih('bukhari', 3916, 441, 615), people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ibnUmarPledgesBeforeHisFather;
