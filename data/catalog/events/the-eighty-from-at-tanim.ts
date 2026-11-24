import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Eighty armed men of Makkah came down on the Prophet ﷺ and his companions from the hill of al-Tan'im to take them by
 * surprise; he took them without a fight and let them live, and Allah sent down «وهو الذي كف أيديهم عنكم». Told from Sahih
 * Muslim 1808 (al-Jihad, the chapter on «وهو الذي كف أيديهم عنكم»), whole.
 */
const theEightyFromAtTanim = {
  kind: 'EVENT',
  slug: 'the-eighty-from-at-tanim',
  name: "الثمانون من جبل التنعيم",
  nameTransliterated: "The eighty from al-Tan'im",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '48:24',
      to: '48:24',
      evidence: [{ source: 'sahih-muslim', hadith: 1808, url: 'https://sunnah.com/muslim:1808', quote: sahih('muslim', 1808, 350, 487) }],
    },
  ],
  reports: [
    {
      isnad: sahih('muslim', 1808, 0, 154),
      source: { slug: 'sahih-muslim', hadith: 1808, url: 'https://sunnah.com/muslim:1808' },
      moments: [
        { title: "هبطوا من جبل التنعيم", text: sahih('muslim', 1808, 155, 349), people: ['prophet-muhammad'] },
        { title: "«وهو الذي كف أيديهم عنكم»", text: sahih('muslim', 1808, 350, 504), people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theEightyFromAtTanim;
