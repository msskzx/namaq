import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Year -3, from al-Waqidi's قبل الهجرة بثلاث سنين for the exit from the
 * shi'b: he and Khadijah both died in that year, which the chapter says in the
 * same sentence. al-Dhahabi rejects the report that he said the
 * كلمة at the end: al-Abbas was still on his jahiliyyah when he claimed to have
 * heard it, the Prophet answered لم أسمع, and Ali called him الشيخ الضال after
 * he died. The description keeps what the sound reports say.
 *
 * Told as a story from Sahih al-Bukhari 3884 (Manaqib al-Ansar, «قصة أبي طالب»), whole, with the two ayat it
 * says came down (al-Tawbah 113, al-Qasas 56). 3883 and 3885 in the same chapter are about his state in the hereafter, not
 * his death, so they are not told here.
 */
const deathOfAbuTalib = {
  kind: 'EVENT',
  slug: 'death-of-abu-talib',
  name: 'وفاة أبي طالب',
  nameTransliterated: 'The Death of Abu Talib',
  type: 'DEATH',
  fields: {
    hijriYear: { value: -3, claims: ['sira/shib-exit-year'] },
    description: {
      value:
        'لما حضرته الوفاة دخل عليه النبي صلى الله عليه وسلم وعنده أبو جهل وعبد الله بن أبي أمية، فقال: يا عم قل لا إله إلا الله أحاج لك بها عند الله، فكان آخر كلمة أن قال: على ملة عبد المطلب. ومات هو وخديجة في عام واحد.',
      claims: ['sira/death-abu-talib'],
    },
  },
  people: [{ person: 'abu-talib', claims: ['sira/death-abu-talib'] }, { person: 'prophet-muhammad' }, { person: 'abu-jahl-ibn-hisham' }],
  tags: ['REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      about: 'abu-talib',
      from: '9:113',
      to: '9:113',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 3884, url: 'https://sunnah.com/bukhari:3884', quote: sahih('bukhari', 3884, 561, 814) }],
    },
    {
      kind: 'REVEALED_ABOUT',
      about: 'abu-talib',
      from: '28:56',
      to: '28:56',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 3884, url: 'https://sunnah.com/bukhari:3884', quote: sahih('bukhari', 3884, 815, 863) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 3884, 0, 131),
      source: { slug: 'sahih-al-bukhari', hadith: 3884, url: 'https://sunnah.com/bukhari:3884' },
      moments: [
        {
          title: "«أي عم، قل لا إله إلا الله»",
          text: sahih('bukhari', 3884, 132, 329),
          people: ['abu-talib', 'prophet-muhammad', 'abu-jahl-ibn-hisham'],
          turns: [
            { text: sahih('bukhari', 3884, 132, 329) },
          ],
        },
        {
          title: "«ترغب عن ملة عبد المطلب»",
          text: sahih('bukhari', 3884, 330, 449),
          people: ['abu-jahl-ibn-hisham', 'abu-talib'],
          turns: [
            { text: sahih('bukhari', 3884, 330, 449), speaker: { name: "أبو جهل وعبد الله بن أبي أمية" }, lead: sahih('bukhari', 3884, 330, 387) },
          ],
        },
        {
          title: "«على ملة عبد المطلب»",
          text: sahih('bukhari', 3884, 450, 560),
          people: ['abu-talib'],
          turns: [
            { text: sahih('bukhari', 3884, 450, 560) },
          ],
        },
        {
          title: "«لأستغفرن لك ما لم أنه عنه»",
          text: sahih('bukhari', 3884, 561, 628),
          people: ['prophet-muhammad', 'abu-talib'],
          turns: [
            { text: sahih('bukhari', 3884, 561, 628), speaker: { person: 'prophet-muhammad', name: "النبي ﷺ" }, lead: sahih('bukhari', 3884, 561, 582) },
          ],
        },
        {
          title: "فنزلت",
          text: sahih('bukhari', 3884, 629, 865),
          people: [],
          turns: [
            { text: sahih('bukhari', 3884, 629, 865) },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default deathOfAbuTalib;
