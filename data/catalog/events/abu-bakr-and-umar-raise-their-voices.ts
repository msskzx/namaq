import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When riders of Banu Tamim came, Abu Bakr said to make al-Qa'qa' ibn Ma'bad their leader and Umar said al-Aqra' ibn Habis;
 * they argued until their voices rose, and «يا أيها الذين آمنوا لا تقدموا» was sent down about it. Told from Sahih
 * al-Bukhari 4367 (al-Maghazi, the delegation of Banu Tamim), whole. Al-Qa'qa' and al-Aqra' have no catalog subject. The
 * hadith says «حتى انقضت»; only 49:1, which it quotes, is given.
 */
const abuBakrAndUmarRaiseTheirVoices = {
  kind: 'EVENT',
  slug: 'abu-bakr-and-umar-raise-their-voices',
  name: "تماري أبي بكر وعمر في وفد تميم",
  nameTransliterated: "Abu Bakr and Umar raise their voices",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-bakr-as-siddiq' }, { person: 'umar-ibn-al-khattab' }],
  tags: ['REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '49:1',
      to: '49:1',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4367, url: 'https://sunnah.com/bukhari:4367', quote: sahih('bukhari', 4367, 508, 593) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4367, 0, 183),
      source: { slug: 'sahih-al-bukhari', hadith: 4367, url: 'https://sunnah.com/bukhari:4367' },
      moments: [
        {
          title: "«أمر القعقاع بن معبد بن زرارة»",
          text: sahih('bukhari', 4367, 184, 371),
          people: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'umar-ibn-al-khattab'],
          turns: [
            { text: sahih('bukhari', 4367, 184, 245) },
            { text: sahih('bukhari', 4367, 246, 318), speaker: { person: "abu-bakr-as-siddiq", name: "أبو بكر" }, lead: sahih('bukhari', 4367, 246, 267) },
            { text: sahih('bukhari', 4367, 319, 371), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('bukhari', 4367, 319, 332) },
          ],
        },
        {
          title: "«ما أردت إلا خلافي»",
          text: sahih('bukhari', 4367, 372, 507),
          people: ['abu-bakr-as-siddiq', 'umar-ibn-al-khattab'],
          turns: [
            { text: sahih('bukhari', 4367, 372, 421), speaker: { person: "abu-bakr-as-siddiq", name: "أبو بكر" }, lead: sahih('bukhari', 4367, 372, 391) },
            { text: sahih('bukhari', 4367, 422, 459), speaker: { person: "umar-ibn-al-khattab", name: "عمر" }, lead: sahih('bukhari', 4367, 422, 435) },
            { text: sahih('bukhari', 4367, 460, 507) },
          ],
        },
        {
          title: "فنزل في ذلك",
          text: sahih('bukhari', 4367, 508, 595),
          people: [],
          turns: [
            { text: sahih('bukhari', 4367, 508, 595) },
          ],
        },
      ],
    },
  ],
} satisfies CatalogEvent;

export default abuBakrAndUmarRaiseTheirVoices;
