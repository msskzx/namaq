import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ put Usamah ibn Zayd over an army and people spoke against his command; he stood and said «إن تطعنوا في
 * إمارته فقد كنتم تطعنون في إمارة أبيه من قبل… وإن هذا لمن أحب الناس إلي بعده». Told from Ibn Umar's hadith in Sahih
 * al-Bukhari, each whole: 4469 (al-Maghazi, the sending of Usamah in his last illness) first; then 4250 (the chapter
 * before Umrat al-Qada') and 4468. «أبيه» is Usamah's father, Zayd ibn Harithah, named only as a reference in his words, and is not linked.
 */
const theCommandOfUsamah = {
  kind: 'EVENT',
  slug: 'the-command-of-usamah',
  name: "إمارة أسامة",
  nameTransliterated: "Usamah's command",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'usamah-ibn-zaid' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4469, 0, 124),
      source: { slug: 'sahih-al-bukhari', hadith: 4469, url: 'https://sunnah.com/bukhari:4469' },
      moments: [
        {
          title: "فطعن الناس في إمارته",
          text: sahih('bukhari', 4469, 125, 242),
          people: ['prophet-muhammad', 'usamah-ibn-zaid'],
          turns: [
            { text: sahih('bukhari', 4469, 125, 242) },
          ],
        },
        {
          title: "«إن تطعنوا في إمارته»",
          text: sahih('bukhari', 4469, 243, 525),
          people: ['prophet-muhammad', 'usamah-ibn-zaid'],
          turns: [
            { text: sahih('bukhari', 4469, 243, 525), speaker: { person: "prophet-muhammad", name: "رسول الله ﷺ" }, lead: sahih('bukhari', 4469, 243, 275) },
          ],
        },
      ],
    },
    {
      isnad: sahih('bukhari', 4250, 0, 169),
      source: { slug: 'sahih-al-bukhari', hadith: 4250, url: 'https://sunnah.com/bukhari:4250' },
      moments: [
        { title: "«إن تطعنوا في إمارته»", text: sahih('bukhari', 4250, 170, 493), people: ['prophet-muhammad', 'usamah-ibn-zaid'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4468, 0, 147),
      source: { slug: 'sahih-al-bukhari', hadith: 4468, url: 'https://sunnah.com/bukhari:4468' },
      moments: [
        {
          title: "«وإنه أحب الناس إلي»",
          text: sahih('bukhari', 4468, 148, 309),
          people: ['prophet-muhammad', 'usamah-ibn-zaid'],
          turns: [
            { text: sahih('bukhari', 4468, 148, 201) },
            { text: sahih('bukhari', 4468, 202, 309), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 4468, 202, 223) },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theCommandOfUsamah;
