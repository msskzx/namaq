import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When Mu'adh came to Yemen he led them in the dawn prayer and recited «واتخذ الله إبراهيم خليلا», and a man behind him
 * said «لقد قرت عين أم إبراهيم». Told from Sahih al-Bukhari 4348 (al-Maghazi, the sending of Mu'adh to Yemen), whole, with
 * Mu'adh ibn Mu'adh's addition that it was Surat al-Nisa'. The man is not named.
 */
const muadhRecitesInYemen = {
  kind: 'EVENT',
  slug: 'muadh-recites-in-yemen',
  name: "قراءة معاذ باليمن",
  nameTransliterated: "Mu'adh recites in Yemen",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'muadh-ibn-jabal' }, { person: 'prophet-muhammad' }],
  ayat: [
    {
      kind: 'RECITED',
      from: '4:125',
      to: '4:125',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4348, url: 'https://sunnah.com/bukhari:4348', quote: sahih('bukhari', 4348, 226, 275) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4348, 0, 146),
      source: { slug: 'sahih-al-bukhari', hadith: 4348, url: 'https://sunnah.com/bukhari:4348' },
      moments: [
        {
          title: "«لقد قرت عين أم إبراهيم»",
          text: sahih('bukhari', 4348, 147, 349),
          people: ['muadh-ibn-jabal'],
          turns: [
            { text: sahih('bukhari', 4348, 147, 275) },
            { text: sahih('bukhari', 4348, 276, 349), speaker: { name: "رجل من القوم" }, lead: sahih('bukhari', 4348, 276, 306) },
          ],
        },
        {
          title: "قرأ في الصبح سورة النساء",
          text: sahih('bukhari', 4348, 350, 646),
          people: ['prophet-muhammad', 'muadh-ibn-jabal'],
          turns: [
            { text: sahih('bukhari', 4348, 350, 588) },
            { text: sahih('bukhari', 4348, 589, 646), speaker: { name: "رجل خلفه" }, lead: sahih('bukhari', 4348, 589, 611) },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default muadhRecitesInYemen;
