import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Ali sent a piece of unrefined gold from Yemen and the Prophet ﷺ divided it among four men; when a Companion said they had
 * more right to it he said «ألا تأمنوني وأنا أمين من في السماء», a man with sunken eyes said «اتق الله», Khalid asked to
 * strike his neck and was told «إني لم أومر أن أنقب قلوب الناس», and looking after him the Prophet ﷺ said a people would
 * come from his line who recite the Quran and pass through the din like an arrow. Told from Sahih al-Bukhari 4351
 * (al-Maghazi, the sending of Ali and Khalid to Yemen), whole. The four men and the man with sunken eyes are not linked.
 */
const theGoldFromYemen = {
  kind: 'EVENT',
  slug: 'the-gold-from-yemen',
  name: "الذهيبة من اليمن",
  nameTransliterated: "The gold from Yemen",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'ali-ibn-abi-talib' }, { person: 'prophet-muhammad' }, { person: 'khalid-ibn-al-walid' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4351, 0, 202),
      source: { slug: 'sahih-al-bukhari', hadith: 4351, url: 'https://sunnah.com/bukhari:4351' },
      moments: [
        { title: "قسمها بين أربعة نفر", text: sahih('bukhari', 4351, 203, 623), people: ['ali-ibn-abi-talib', 'prophet-muhammad'] },
        { title: "«ألا تأمنوني وأنا أمين من في السماء»", text: sahih('bukhari', 4351, 624, 773), people: ['prophet-muhammad'] },
        { title: "«يا رسول الله، اتق الله»", text: sahih('bukhari', 4351, 774, 1044), people: ['prophet-muhammad'] },
        { title: "«إني لم أومر أن أنقب قلوب الناس»", text: sahih('bukhari', 4351, 1045, 1378), people: ['khalid-ibn-al-walid', 'prophet-muhammad'] },
        { title: "«يمرقون من الدين كما يمرق السهم من الرمية»", text: sahih('bukhari', 4351, 1379, 1682), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theGoldFromYemen;
