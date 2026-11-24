import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Ammar ibn Yasir saw the Prophet ﷺ when there were with him only five slaves, two women and Abu Bakr. Told from Sahih
 * al-Bukhari 3857, the one hadith of its chapter on Abu Bakr's islam (Manaqib al-Ansar), whole.
 */
const islamOfAbuBakr = {
  kind: 'EVENT',
  slug: 'islam-of-abu-bakr',
  name: "إسلام أبي بكر الصديق",
  nameTransliterated: "The Islam of Abu Bakr al-Siddiq",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abu-bakr-as-siddiq' }, { person: 'prophet-muhammad' }, { person: 'ammar-ibn-yasir' }],
  tags: ['ISLAM'],
  reports: [
    {
      isnad: sahih('bukhari', 3857, 0, 188),
      source: { slug: 'sahih-al-bukhari', hadith: 3857, url: 'https://sunnah.com/bukhari:3857' },
      moments: [
        { title: "«وما معه إلا خمسة أعبد وامرأتان وأبو بكر»", text: sahih('bukhari', 3857, 189, 321), people: ['ammar-ibn-yasir', 'prophet-muhammad', 'abu-bakr-as-siddiq'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default islamOfAbuBakr;
