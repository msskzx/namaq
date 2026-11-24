import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Coming back from Najd the Prophet ﷺ slept under a tree with his sword hanging on it; a bedouin drew it over him and said
 * «من يمنعك مني؟», he said «الله», and he did not punish him. Told from Sahih al-Bukhari, each hadith whole: Jabir's 4135
 * first (al-Maghazi, the chapter on Dhat al-Riqa'), the fullest connected one; then 4139; then 4136, which al-Bukhari gives
 * without his own chain («وقال أبان»), with the prayer of fear that followed and Musaddad's naming of the man, Ghawrath ibn
 * al-Harith, who has no catalog subject and is not linked.
 */
const whoWillProtectYouFromMe = {
  kind: 'EVENT',
  slug: 'who-will-protect-you-from-me',
  name: "«من يمنعك مني؟»",
  nameTransliterated: "Who will protect you from me?",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'jabir-ibn-abdullah' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4135, 0, 228),
      source: { slug: 'sahih-al-bukhari', hadith: 4135, url: 'https://sunnah.com/bukhari:4135' },
      moments: [
        { title: "نزل تحت سمرة", text: sahih('bukhari', 4135, 229, 542), people: ['jabir-ibn-abdullah', 'prophet-muhammad'] },
        { title: "«من يمنعك مني؟»", text: sahih('bukhari', 4135, 543, 898), people: ['jabir-ibn-abdullah', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4139, 0, 152),
      source: { slug: 'sahih-al-bukhari', hadith: 4139, url: 'https://sunnah.com/bukhari:4139' },
      moments: [
        { title: "نزل تحت شجرة", text: sahih('bukhari', 4139, 153, 388), people: ['prophet-muhammad'] },
        { title: "«من يمنعك مني؟»", text: sahih('bukhari', 4139, 389, 763), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4136, 0, 96),
      source: { slug: 'sahih-al-bukhari', hadith: 4136, url: 'https://sunnah.com/bukhari:4136' },
      moments: [
        { title: "شجرة ظليلة", text: sahih('bukhari', 4136, 97, 212), people: ['prophet-muhammad'] },
        { title: "«فمن يمنعك مني؟»", text: sahih('bukhari', 4136, 213, 388), people: ['prophet-muhammad'] },
        { title: "صلى بالطائفتين", text: sahih('bukhari', 4136, 389, 749), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default whoWillProtectYouFromMe;
