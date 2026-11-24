import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * A woman stole in the campaign of the conquest; her people asked Usamah to intercede, the Prophet's face changed «أتكلمني
 * في حد من حدود الله», and that evening he said «لو أن فاطمة بنت محمد سرقت لقطعت يدها»; her hand was cut, she repented and
 * married, and Aisha used to take her needs to him. Told from Sahih al-Bukhari 4304 (al-Maghazi, the chapter after the
 * conquest), whole. The woman is not named; Fatimah is named only in his words and is not linked.
 */
const theWomanWhoStoleInTheConquest = {
  kind: 'EVENT',
  slug: 'the-woman-who-stole-in-the-conquest',
  name: "المرأة التي سرقت في غزوة الفتح",
  nameTransliterated: "The woman who stole in the conquest",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'usamah-ibn-zaid' }, { person: 'prophet-muhammad' }, { person: 'aisha-bint-abi-bakr' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4304, 0, 147),
      source: { slug: 'sahih-al-bukhari', hadith: 4304, url: 'https://sunnah.com/bukhari:4304' },
      moments: [
        { title: "«أتكلمني في حد من حدود الله»", text: sahih('bukhari', 4304, 148, 482), people: ['usamah-ibn-zaid', 'prophet-muhammad'] },
        { title: "«لو أن فاطمة بنت محمد سرقت لقطعت يدها»", text: sahih('bukhari', 4304, 483, 950), people: ['prophet-muhammad'] },
        { title: "فحسنت توبتها", text: sahih('bukhari', 4304, 951, 1100), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theWomanWhoStoleInTheConquest;
