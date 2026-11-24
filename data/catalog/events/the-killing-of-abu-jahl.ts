import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abd al-Rahman ibn Awf, in the ranks at Badr, had two young men ask him in secret to show them Abu Jahl; he pointed, and
 * they fell on him like two falcons: the two sons of Afra. Then the Prophet ﷺ asked who would see what had become of Abu
 * Jahl, and Ibn Mas'ud found him struck down and took him by the beard. Told from the two Sahihs, each hadith whole: Ibn Awf's
 * Sahih al-Bukhari 3988 first; then Anas's, al-Bukhari 4020 (the fullest of his, with Abu Mijlaz's addition), 3962 and 3963,
 * and Sahih Muslim 1800; then Ibn Mas'ud's own one line, al-Bukhari 3961. 3964 only points to the hadith of the sons of
 * Afra and is not repeated. The text names the two young men only as «ابنا عفراء», so neither is linked.
 *
 * Then Abd al-Rahman ibn Awf's hadith in Sahih Muslim 1752 (al-Jihad, the killer's right to the spoils), whole, which names
 * the two youths at its end, Mu'adh ibn Amr ibn al-Jamuh and Mu'adh ibn Afra' (mu'adh-ibn-al-harith, Afra's son), and they
 * are linked from its moments.
 */
const theKillingOfAbuJahl = {
  kind: 'EVENT',
  slug: 'the-killing-of-abu-jahl',
  name: "مقتل أبي جهل",
  nameTransliterated: "The killing of Abu Jahl",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abdur-rahman-ibn-awf' }, { person: 'abu-jahl-ibn-hisham' }, { person: 'prophet-muhammad' }, { person: 'abdullah-ibn-masud' }, { person: 'muadh-ibn-amr-ibn-al-jumuh' }, { person: 'muadh-ibn-al-harith' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 3988, 0, 130),
      source: { slug: 'sahih-al-bukhari', hadith: 3988, url: 'https://sunnah.com/bukhari:3988' },
      moments: [
        { title: "«يا عم أرني أبا جهل»", text: sahih('bukhari', 3988, 131, 610), people: ['abdur-rahman-ibn-awf', 'abu-jahl-ibn-hisham'] },
        { title: "مثل الصقرين", text: sahih('bukhari', 3988, 611, 723), people: ['abdur-rahman-ibn-awf', 'abu-jahl-ibn-hisham'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4020, 0, 143),
      source: { slug: 'sahih-al-bukhari', hadith: 4020, url: 'https://sunnah.com/bukhari:4020' },
      moments: [
        { title: "«من ينظر ما صنع أبو جهل»", text: sahih('bukhari', 4020, 144, 305), people: ['prophet-muhammad', 'abdullah-ibn-masud', 'abu-jahl-ibn-hisham'] },
        { title: "«وهل فوق رجل قتلتموه»", text: sahih('bukhari', 4020, 306, 524), people: ['abdullah-ibn-masud', 'abu-jahl-ibn-hisham'] },
        { title: "«فلو غير أكار قتلني»", text: sahih('bukhari', 4020, 525, 610), people: ['abu-jahl-ibn-hisham'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3962, 0, 282),
      source: { slug: 'sahih-al-bukhari', hadith: 3962, url: 'https://sunnah.com/bukhari:3962' },
      moments: [
        { title: "«من ينظر ما صنع أبو جهل»", text: sahih('bukhari', 3962, 283, 406), people: ['prophet-muhammad', 'abdullah-ibn-masud', 'abu-jahl-ibn-hisham'] },
        { title: "«وهل فوق رجل قتلتموه»", text: sahih('bukhari', 3962, 407, 591), people: ['abdullah-ibn-masud', 'abu-jahl-ibn-hisham'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3963, 0, 134),
      source: { slug: 'sahih-al-bukhari', hadith: 3963, url: 'https://sunnah.com/bukhari:3963' },
      moments: [
        { title: "«من ينظر ما فعل أبو جهل؟»", text: sahih('bukhari', 3963, 135, 293), people: ['prophet-muhammad', 'abdullah-ibn-masud', 'abu-jahl-ibn-hisham'] },
        { title: "«وهل فوق رجل قتله قومه؟»", text: sahih('bukhari', 3963, 294, 552), people: ['abdullah-ibn-masud', 'abu-jahl-ibn-hisham'] },
      ],
    },
    {
      isnad: sahih('muslim', 1800, 0, 171),
      source: { slug: 'sahih-muslim', hadith: 1800, url: 'https://sunnah.com/muslim:1800' },
      moments: [
        { title: "«من ينظر لنا ما صنع أبو جهل؟»", text: sahih('muslim', 1800, 172, 328), people: ['prophet-muhammad', 'abdullah-ibn-masud', 'abu-jahl-ibn-hisham'] },
        { title: "«وهل فوق رجل قتلتموه»", text: sahih('muslim', 1800, 329, 463), people: ['abdullah-ibn-masud', 'abu-jahl-ibn-hisham'] },
        { title: "«فلو غير أكار قتلني»", text: sahih('muslim', 1800, 464, 537), people: ['abu-jahl-ibn-hisham'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3961, 0, 132),
      source: { slug: 'sahih-al-bukhari', hadith: 3961, url: 'https://sunnah.com/bukhari:3961' },
      moments: [
        {
          title: "«هل أعمد من رجل قتلتموه»",
          text: sahih('bukhari', 3961, 133, 253),
          people: ['abdullah-ibn-masud', 'abu-jahl-ibn-hisham'],
          turns: [
            { text: sahih('bukhari', 3961, 133, 189) },
            { text: sahih('bukhari', 3961, 190, 253), speaker: { person: "abu-jahl-ibn-hisham", name: "أبو جهل" }, lead: sahih('bukhari', 3961, 190, 211) },
          ],
        },
      ],
    },
    {
      isnad: sahih('muslim', 1752, 0, 219),
      source: { slug: 'sahih-muslim', hadith: 1752, url: 'https://sunnah.com/muslim:1752' },
      moments: [
        { title: "«يا عم! هل تعرف أبا جهل؟»", text: sahih('muslim', 1752, 220, 803), people: ['abdur-rahman-ibn-awf', 'abu-jahl-ibn-hisham'] },
        { title: "فابتدراه فضرباه", text: sahih('muslim', 1752, 804, 1006), people: ['abdur-rahman-ibn-awf', 'abu-jahl-ibn-hisham', 'muadh-ibn-amr-ibn-al-jumuh', 'muadh-ibn-al-harith'] },
        { title: "«كلاكما قتله»", text: sahih('muslim', 1752, 1007, 1373), people: ['prophet-muhammad', 'muadh-ibn-amr-ibn-al-jumuh', 'muadh-ibn-al-harith'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theKillingOfAbuJahl;
