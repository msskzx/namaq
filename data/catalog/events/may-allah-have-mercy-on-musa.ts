import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When the Prophet ﷺ divided the spoils of Hunayn, giving al-Aqra' and Uyaynah a hundred camels each, a man said the
 * division was not meant for Allah; Ibn Mas'ud told him, his face changed, and he said «رحم الله موسى، قد أوذي بأكثر من
 * هذا فصبر». Told from Ibn Mas'ud's hadith in Sahih al-Bukhari (al-Maghazi, the raid of al-Ta'if), each whole: 4336 first,
 * the fuller, then 4335. The man, al-Aqra' and Uyaynah have no catalog subject and are not linked.
 */
const mayAllahHaveMercyOnMusa = {
  kind: 'EVENT',
  slug: 'may-allah-have-mercy-on-musa',
  name: "رحم الله موسى",
  nameTransliterated: "May Allah have mercy on Musa",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abdullah-ibn-masud' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4336, 0, 130),
      source: { slug: 'sahih-al-bukhari', hadith: 4336, url: 'https://sunnah.com/bukhari:4336' },
      moments: [
        { title: "«ما أريد بهذه القسمة وجه الله»", text: sahih('bukhari', 4336, 131, 348), people: ['prophet-muhammad'] },
        { title: "«رحم الله موسى»", text: sahih('bukhari', 4336, 349, 460), people: ['abdullah-ibn-masud', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4335, 0, 106),
      source: { slug: 'sahih-al-bukhari', hadith: 4335, url: 'https://sunnah.com/bukhari:4335' },
      moments: [
        { title: "«ما أراد بها وجه الله»", text: sahih('bukhari', 4335, 107, 217), people: ['prophet-muhammad'] },
        { title: "«رحمة الله على موسى»", text: sahih('bukhari', 4335, 218, 368), people: ['abdullah-ibn-masud', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default mayAllahHaveMercyOnMusa;
