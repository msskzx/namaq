import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Harithah was killed at Badr as a boy; his mother came to the Prophet ﷺ asking whether he was in Paradise, and he said
 * «أوجنة واحدة هي، إنها جنان كثيرة، وإنه في جنة الفردوس». Told from Sahih al-Bukhari 3982 (al-Maghazi, the virtue of
 * those who were at Badr), whole. His mother is not named and is not linked.
 */
const theMotherOfHarithah = {
  kind: 'EVENT',
  slug: 'the-mother-of-harithah',
  name: "أم حارثة",
  nameTransliterated: "The mother of Harithah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'harithah-ibn-suraqah' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 3982, 0, 165),
      source: { slug: 'sahih-al-bukhari', hadith: 3982, url: 'https://sunnah.com/bukhari:3982' },
      moments: [
        { title: "«قد عرفت منزلة حارثة مني»", text: sahih('bukhari', 3982, 166, 419), people: ['harithah-ibn-suraqah', 'prophet-muhammad'] },
        { title: "«إنها جنان كثيرة»", text: sahih('bukhari', 3982, 420, 546), people: ['prophet-muhammad', 'harithah-ibn-suraqah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theMotherOfHarithah;
