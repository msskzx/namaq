import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Sahl ibn Sa'd, asked about the Prophet's wound, said Fatimah washed it and Ali poured water from his shield, and when the
 * blood would not stop she burned a piece of mat and pressed it on; that day his tooth was broken, his face wounded and the
 * helmet broken on his head. Told from Sahih al-Bukhari 4075 (al-Maghazi, in the chapters on Uhud), whole.
 * Then Sahl's telling in Sahih Muslim 1790 (al-Jihad, the chapter on Uhud), whole, folded.
 */
const theWoundOfTheProphetAtUhud = {
  kind: 'EVENT',
  slug: 'the-wound-of-the-prophet-at-uhud',
  name: "جرح النبي ﷺ يوم أحد",
  nameTransliterated: "The Prophet's wound at Uhud",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'fatimah-bint-muhammad' }, { person: 'ali-ibn-abi-talib' }],
  reports: [
    {
      isnad: sahih('bukhari', 4075, 0, 85),
      source: { slug: 'sahih-al-bukhari', hadith: 4075, url: 'https://sunnah.com/bukhari:4075' },
      moments: [
        { title: "من كان يغسل جرح رسول الله ﷺ", text: sahih('bukhari', 4075, 86, 292), people: ['prophet-muhammad'] },
        { title: "أخذت قطعة من حصير فأحرقتها", text: sahih('bukhari', 4075, 293, 669), people: ['fatimah-bint-muhammad', 'prophet-muhammad', 'ali-ibn-abi-talib'] },
      ],
    },
    {
      isnad: sahih('muslim', 1790, 0, 108),
      source: { slug: 'sahih-muslim', hadith: 1790, url: 'https://sunnah.com/muslim:1790' },
      moments: [
        { title: "جرح وجه رسول الله ﷺ", text: sahih('muslim', 1790, 109, 295), people: ['prophet-muhammad'] },
        { title: "أخذت قطعة من حصير فأحرقته", text: sahih('muslim', 1790, 296, 594), people: ['fatimah-bint-muhammad', 'ali-ibn-abi-talib', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theWoundOfTheProphetAtUhud;
