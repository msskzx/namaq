import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

// He satirised the Prophet in verse and went to Mecca to rouse Quraysh after
// Badr. Muhammad ibn Maslamah volunteered and asked leave to say what he had
// to say to reach him, which the Prophet granted.
// Told as a story from Sahih al-Bukhari 4037 (al-Maghazi, the chapter on Ka'b ibn al-Ashraf), whole. Ka'b, Abu
// Na'ilah and al-Harith ibn Aws have no catalog subject and are not linked.
// Then Jabir's telling in Sahih Muslim 1801 (al-Jihad, the chapter on Ka'b ibn al-Ashraf), whole, folded.
const killingOfKaabIbnAlAshraf = {
  kind: 'EVENT',
  slug: 'killing-of-kaab-ibn-al-ashraf',
  name: 'قتل كعب بن الأشرف',
  nameTransliterated: 'The Killing of Kaab ibn al-Ashraf',
  type: 'OTHER',
  fields: {
    hijriYear: { value: 3, claims: ['sira/kaab-ibn-al-ashraf'] },
    description: {
      value:
        'قال صلى الله عليه وسلم: (من لكعب بن الأشرف؟ فقد آذانا بالشعر وقوى المشركين علينا) . فقال محمد بن مسلمة: أنا يا رسول الله. فاستأذنه أن يقول، فأذن له، فأتاه ليلا في نفر فقتلوه.',
      claims: ['sira/kaab-ibn-al-ashraf'],
    },
  },
  people: [
    { person: 'muhammad-ibn-maslamah', claims: ['sira/kaab-ibn-al-ashraf'] },
    { person: 'abu-abs', claims: ['abu-abs-siyar21/kaab-ashraf'] },
    { person: 'abbad-ibn-bishr', claims: ['abbad-ibn-bishr-siyar73/kaab-ashraf'] },
    { person: 'prophet-muhammad' },
  ],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4037, 0, 134),
      source: { slug: 'sahih-al-bukhari', hadith: 4037, url: 'https://sunnah.com/bukhari:4037' },
      moments: [
        { title: "«من لكعب بن الأشرف»", text: sahih('bukhari', 4037, 135, 388), people: ['prophet-muhammad', 'muhammad-ibn-maslamah'] },
        { title: "«إني قد أتيتك أستسلفك»", text: sahih('bukhari', 4037, 389, 762), people: ['muhammad-ibn-maslamah'] },
        { title: "«ارهنوني نساءكم»", text: sahih('bukhari', 4037, 763, 1331), people: [] },
        { title: "«إن الكريم لو دعي إلى طعنة بليل لأجاب»", text: sahih('bukhari', 4037, 1332, 1861), people: ['muhammad-ibn-maslamah'] },
        { title: "«فإذا رأيتموني استمكنت من رأسه»", text: sahih('bukhari', 4037, 1862, 2346), people: ['muhammad-ibn-maslamah', 'abu-abs', 'abbad-ibn-bishr'] },
        { title: "«أتأذن لي أن أشم رأسك؟»", text: sahih('bukhari', 4037, 2347, 2824), people: ['muhammad-ibn-maslamah', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('muslim', 1801, 0, 271),
      source: { slug: 'sahih-muslim', hadith: 1801, url: 'https://sunnah.com/muslim:1801' },
      moments: [
        { title: "«من لكعب بن الأشرف؟»", text: sahih('muslim', 1801, 272, 510), people: ['prophet-muhammad', 'muhammad-ibn-maslamah'] },
        { title: "«ترهنني نساءكم»", text: sahih('muslim', 1801, 511, 1169), people: ['muhammad-ibn-maslamah'] },
        { title: "«إن الكريم لو دعي إلى طعنة ليلا لأجاب»", text: sahih('muslim', 1801, 1170, 1692), people: ['muhammad-ibn-maslamah', 'abu-abs', 'abbad-ibn-bishr'] },
        { title: "«أتأذن لي أن أعود؟»", text: sahih('muslim', 1801, 1693, 2050), people: ['muhammad-ibn-maslamah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default killingOfKaabIbnAlAshraf;
