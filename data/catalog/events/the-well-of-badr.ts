import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * On the third day after Badr the Prophet ﷺ stood at the well where the chiefs of Quraysh had been thrown and called them
 * by name, «فهل وجدتم ما وعد ربكم حقا»; Umar asked how he spoke to bodies without souls, and he said «ما أنتم بأسمع لما أقول
 * منهم». Told from Sahih al-Bukhari, each hadith whole: Abu Talhah's 3976 first, the fullest; then Ibn Umar's 3980 with
 * Aisha's answer; then Musa ibn Uqbah's from Ibn Shihab, 4026, with al-Bukhari's count of the Qurashi men of Badr after it.
 * 3978–3979, Aisha's answer alone, cut in two in our copy, are not repeated. Aisha recites «إنك لا تسمع الموتى», words that
 * stand in both al-Naml 80 and al-Rum 52; the text does not say which, so no ayah range is given.
 */
const theWellOfBadr = {
  kind: 'EVENT',
  slug: 'the-well-of-badr',
  name: "قليب بدر",
  nameTransliterated: "The well of Badr",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'umar-ibn-al-khattab' }, { person: 'aisha-bint-abi-bakr' }, { person: 'az-zubayr-ibn-al-awwam' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 3976, 0, 187),
      source: { slug: 'sahih-al-bukhari', hadith: 3976, url: 'https://sunnah.com/bukhari:3976' },
      moments: [
        { title: "طوي من أطواء بدر", text: sahih('bukhari', 3976, 188, 353), people: ['prophet-muhammad'] },
        { title: "على شفة الركي", text: sahih('bukhari', 3976, 354, 655), people: ['prophet-muhammad'] },
        { title: "«فهل وجدتم ما وعد ربكم حقا»", text: sahih('bukhari', 3976, 656, 927), people: ['prophet-muhammad'] },
        { title: "«ما أنتم بأسمع لما أقول منهم»", text: sahih('bukhari', 3976, 928, 1129), people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
        { title: "«أحياهم الله حتى أسمعهم قوله»", text: sahih('bukhari', 3976, 1130, 1253), people: [] },
      ],
    },
    {
      isnad: sahih('bukhari', 3980, 0, 111),
      source: { slug: 'sahih-al-bukhari', hadith: 3980, url: 'https://sunnah.com/bukhari:3980' },
      moments: [
        { title: "«إنهم الآن يسمعون ما أقول»", text: sahih('bukhari', 3980, 112, 263), people: ['prophet-muhammad'] },
        { title: "«إنهم الآن ليعلمون»", text: sahih('bukhari', 3980, 264, 483), people: ['aisha-bint-abi-bakr', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4026, 0, 147),
      source: { slug: 'sahih-al-bukhari', hadith: 4026, url: 'https://sunnah.com/bukhari:4026' },
      moments: [
        { title: "«تنادي ناسا أمواتا؟»", text: sahih('bukhari', 4026, 148, 494), people: ['prophet-muhammad'] },
        { title: "أحد وثمانون رجلا", text: sahih('bukhari', 4026, 495, 750), people: ['az-zubayr-ibn-al-awwam'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theWellOfBadr;
