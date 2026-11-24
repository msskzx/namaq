import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Going out to Tabuk the Prophet ﷺ left Ali behind; Ali said «أتخلفني في الصبيان والنساء؟» and he answered «ألا ترضى أن
 * تكون مني بمنزلة هارون من موسى، إلا أنه ليس نبي بعدي». Told from Sa'd's hadith, Sahih al-Bukhari 4416 (al-Maghazi, the
 * raid of Tabuk), whole.
 */
const aliLeftInMedinaAtTabuk = {
  kind: 'EVENT',
  slug: 'ali-left-in-medina-at-tabuk',
  name: "استخلاف علي في غزوة تبوك",
  nameTransliterated: "Ali left in Medina at Tabuk",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'ali-ibn-abi-talib' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4416, 0, 113),
      source: { slug: 'sahih-al-bukhari', hadith: 4416, url: 'https://sunnah.com/bukhari:4416' },
      moments: [
        { title: "«ألا ترضى أن تكون مني بمنزلة هارون من موسى»", text: sahih('bukhari', 4416, 114, 432), people: ['prophet-muhammad', 'ali-ibn-abi-talib'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default aliLeftInMedinaAtTabuk;
