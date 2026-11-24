import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The year after al-Hudaybiyah the Prophet ﷺ came for the umrah they had agreed on: the writing «هذا ما قاضى عليه محمد
 * رسول الله» was refused, he wrote «محمد بن عبد الله» himself, he stayed the three days, and as he left Hamzah's daughter
 * followed him crying «يا عم يا عم»; Ali, Ja'far and Zayd disputed over her and he gave her to her maternal aunt, «الخالة
 * بمنزلة الأم». Told from Sahih al-Bukhari (al-Maghazi, the chapter on Umrat al-Qada'), each hadith whole: al-Bara's 4251
 * first, the fullest; then Ibn Umar's 4252 and Ibn Abbas's 4256 (the ramal, «وهنهم حمى يثرب»). Zayd is Zayd ibn Harithah,
 * whom the Prophet ﷺ calls «أخونا ومولانا» and who calls her «ابنة أخي» (he was Hamzah's brother in the mu'akhah).
 * Hamzah's daughter has no catalog subject and is not linked. 4253–4255, 4257–4259 are counts, one-line notes and rulings.
 */
const umratAlQada = {
  kind: 'EVENT',
  slug: 'umrat-al-qada',
  name: "عمرة القضاء",
  nameTransliterated: "Umrat al-Qada'",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'ali-ibn-abi-talib' }, { person: 'fatimah-bint-muhammad' }, { person: 'zaid-ibn-harithah' }, { person: 'jaafar-ibn-abi-talib' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4251, 0, 116),
      source: { slug: 'sahih-al-bukhari', hadith: 4251, url: 'https://sunnah.com/bukhari:4251' },
      moments: [
        { title: "أبى أهل مكة أن يدعوه يدخل", text: sahih('bukhari', 4251, 117, 514), people: ['prophet-muhammad'] },
        { title: "«لا والله لا أمحوك أبدا»", text: sahih('bukhari', 4251, 515, 1012), people: ['prophet-muhammad', 'ali-ibn-abi-talib'] },
        { title: "«يا عم يا عم»", text: sahih('bukhari', 4251, 1013, 1335), people: ['ali-ibn-abi-talib', 'prophet-muhammad', 'fatimah-bint-muhammad'] },
        { title: "«الخالة بمنزلة الأم»", text: sahih('bukhari', 4251, 1336, 1859), people: ['ali-ibn-abi-talib', 'zaid-ibn-harithah', 'jaafar-ibn-abi-talib', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4252, 0, 249),
      source: { slug: 'sahih-al-bukhari', hadith: 4252, url: 'https://sunnah.com/bukhari:4252' },
      moments: [
        { title: "حالوا بينه وبين البيت", text: sahih('bukhari', 4252, 250, 553), people: ['prophet-muhammad'] },
        { title: "اعتمر من العام المقبل", text: sahih('bukhari', 4252, 554, 702), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4256, 0, 160),
      source: { slug: 'sahih-al-bukhari', hadith: 4256, url: 'https://sunnah.com/bukhari:4256' },
      moments: [
        { title: "«وهنهم حمى يثرب»", text: sahih('bukhari', 4256, 161, 504), people: ['prophet-muhammad'] },
        { title: "«ارملوا»", text: sahih('bukhari', 4256, 505, 754), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default umratAlQada;
