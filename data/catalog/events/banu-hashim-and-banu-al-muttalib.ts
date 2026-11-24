import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Jubayr ibn Mut'im and Uthman went to the Prophet ﷺ: he had given Banu al-Muttalib from the fifth of Khaybar and left them,
 * though they stood to him alike; he said «إنما بنو هاشم وبنو المطلب شيء واحد». Told from Sahih al-Bukhari 4229
 * (al-Maghazi, the chapter on Khaybar), whole.
 */
const banuHashimAndBanuAlMuttalib = {
  kind: 'EVENT',
  slug: 'banu-hashim-and-banu-al-muttalib',
  name: "بنو هاشم وبنو المطلب",
  nameTransliterated: "Banu Hashim and Banu al-Muttalib",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'jubair-ibn-mutim' }, { person: 'uthman-ibn-affan' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4229, 0, 168),
      source: { slug: 'sahih-al-bukhari', hadith: 4229, url: 'https://sunnah.com/bukhari:4229' },
      moments: [
        { title: "«أعطيت بني المطلب من خمس خيبر وتركتنا»", text: sahih('bukhari', 4229, 169, 347), people: ['jubair-ibn-mutim', 'uthman-ibn-affan', 'prophet-muhammad'] },
        { title: "«إنما بنو هاشم وبنو المطلب شيء واحد»", text: sahih('bukhari', 4229, 348, 510), people: ['prophet-muhammad', 'jubair-ibn-mutim'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default banuHashimAndBanuAlMuttalib;
