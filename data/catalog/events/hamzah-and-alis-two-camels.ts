import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Ali had two old she-camels from the spoils of Badr and meant to carry idhkhir on them to sell for his wedding feast with
 * Fatimah; Hamzah, drinking with some of the Ansar, cut them up when a singing girl called on him, and the Prophet ﷺ went to
 * Hamzah and found him drunk, and stepped back out. Told from Sahih al-Bukhari 4003 (al-Maghazi, in the chapters on Badr),
 * whole.
 */
const hamzahAndAlisTwoCamels = {
  kind: 'EVENT',
  slug: 'hamzah-and-alis-two-camels',
  name: "شارفا علي",
  nameTransliterated: "Ali's two old she-camels",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'ali-ibn-abi-talib' }, { person: 'prophet-muhammad' }, { person: 'fatimah-bint-muhammad' }, { person: 'hamzah-ibn-abd-al-muttalib' }, { person: 'zaid-ibn-harithah' }],
  reports: [
    {
      isnad: sahih('bukhari', 4003, 0, 275),
      source: { slug: 'sahih-al-bukhari', hadith: 4003, url: 'https://sunnah.com/bukhari:4003' },
      moments: [
        { title: "شارف من نصيبي من المغنم", text: sahih('bukhari', 4003, 276, 696), people: ['ali-ibn-abi-talib', 'prophet-muhammad', 'fatimah-bint-muhammad'] },
        { title: "قد أجبت أسنمتهما", text: sahih('bukhari', 4003, 697, 1053), people: ['ali-ibn-abi-talib'] },
        { title: "«ألا يا حمز للشرف النواء»", text: sahih('bukhari', 4003, 1054, 1406), people: ['ali-ibn-abi-talib', 'hamzah-ibn-abd-al-muttalib'] },
        { title: "«ما رأيت كاليوم»", text: sahih('bukhari', 4003, 1407, 1742), people: ['ali-ibn-abi-talib', 'prophet-muhammad', 'zaid-ibn-harithah', 'hamzah-ibn-abd-al-muttalib'] },
        { title: "«وهل أنتم إلا عبيد لأبي»", text: sahih('bukhari', 4003, 1743, 2369), people: ['prophet-muhammad', 'ali-ibn-abi-talib', 'zaid-ibn-harithah', 'hamzah-ibn-abd-al-muttalib'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default hamzahAndAlisTwoCamels;
