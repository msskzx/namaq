import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When the news of Zayd, Ja'far and Ibn Rawahah came, the Prophet ﷺ sat with grief in his face; a man came three times
 * about the weeping of Ja'far's women and was told «فاحث في أفواههن من التراب», and Aisha, watching through the gap in the
 * door, said to him «أرغم الله أنفك». Told from Sahih al-Bukhari 4263 (al-Maghazi, the chapter on Mu'tah), whole. The man
 * is not named and is not linked.
 */
const theWomenOfJafar = {
  kind: 'EVENT',
  slug: 'the-women-of-jafar',
  name: "نساء جعفر",
  nameTransliterated: "The women of Ja'far",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'zaid-ibn-harithah' }, { person: 'jaafar-ibn-abi-talib' }, { person: 'abdullah-ibn-rawahah' }, { person: 'aisha-bint-abi-bakr' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4263, 0, 171),
      source: { slug: 'sahih-al-bukhari', hadith: 4263, url: 'https://sunnah.com/bukhari:4263' },
      moments: [
        { title: "جلس يعرف فيه الحزن", text: sahih('bukhari', 4263, 172, 423), people: ['prophet-muhammad', 'zaid-ibn-harithah', 'jaafar-ibn-abi-talib', 'abdullah-ibn-rawahah', 'aisha-bint-abi-bakr'] },
        { title: "«فاحث في أفواههن من التراب»", text: sahih('bukhari', 4263, 424, 822), people: ['prophet-muhammad'] },
        { title: "«أرغم الله أنفك»", text: sahih('bukhari', 4263, 823, 956), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theWomenOfJafar;
