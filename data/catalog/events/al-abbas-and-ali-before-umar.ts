import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Al-Abbas and Ali came to Umar disputing what Allah gave His Messenger ﷺ from Banu al-Nadir; Umar had those present affirm
 * «لا نورث ما تركنا صدقة», told how the Prophet ﷺ, then Abu Bakr, then he himself had used it, and refused to judge in it any
 * other way. Urwah confirms it from Aisha, who turned back the Prophet's wives. Told from Sahih al-Bukhari 4033 (al-Maghazi,
 * the chapter on Banu al-Nadir), whole: our copy prints 4034 inside it (from «قال: فحدثت…»). The «سعد» among those
 * asking leave is Sa'd ibn Abi Waqqas: al-Bukhari's own telling of the same hadith from Malik ibn Aws (3094) names him
 * «وَسَعْدِ بْنِ أَبِي وَقَّاصٍ», as it names «عبد الرحمن بن عوف».
 */
const alAbbasAndAliBeforeUmar = {
  kind: 'EVENT',
  slug: 'al-abbas-and-ali-before-umar',
  name: "العباس وعلي عند عمر",
  nameTransliterated: "Al-Abbas and Ali before Umar",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }, { person: 'uthman-ibn-affan' }, { person: 'abdur-rahman-ibn-awf' }, { person: 'az-zubayr-ibn-al-awwam' }, { person: 'saad-ibn-abi-waqqas' }, { person: 'al-abbas-ibn-abd-al-muttalib' }, { person: 'ali-ibn-abi-talib' }, { person: 'prophet-muhammad' }, { person: 'abu-bakr-as-siddiq' }, { person: 'aisha-bint-abi-bakr' }, { person: 'al-hasan-ibn-ali' }, { person: 'al-husayn-ibn-ali' }],
  tags: ['HIS_WORDS'],
  ayat: [
    {
      kind: 'RECITED',
      from: '59:6',
      to: '59:6',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4033, url: 'https://sunnah.com/bukhari:4033', quote: sahih('bukhari', 4033, 1311, 1460) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4033, 0, 139),
      source: { slug: 'sahih-al-bukhari', hadith: 4033, url: 'https://sunnah.com/bukhari:4033' },
      moments: [
        { title: "يستأذنون على عمر", text: sahih('bukhari', 4033, 140, 453), people: ['umar-ibn-al-khattab', 'uthman-ibn-affan', 'abdur-rahman-ibn-awf', 'az-zubayr-ibn-al-awwam', 'saad-ibn-abi-waqqas', 'al-abbas-ibn-abd-al-muttalib', 'ali-ibn-abi-talib'] },
        { title: "«اقض بيني وبين هذا»", text: sahih('bukhari', 4033, 454, 764), people: ['al-abbas-ibn-abd-al-muttalib', 'ali-ibn-abi-talib'] },
        { title: "«لا نورث ما تركنا صدقة»", text: sahih('bukhari', 4033, 765, 1149), people: ['umar-ibn-al-khattab', 'prophet-muhammad', 'al-abbas-ibn-abd-al-muttalib', 'ali-ibn-abi-talib'] },
        { title: "خالصة لرسول الله ﷺ", text: sahih('bukhari', 4033, 1150, 1854), people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
        { title: "فقبضه أبو بكر", text: sahih('bukhari', 4033, 1855, 2211), people: ['abu-bakr-as-siddiq', 'prophet-muhammad', 'al-abbas-ibn-abd-al-muttalib', 'ali-ibn-abi-talib'] },
        { title: "فقبضته سنتين من إمارتي", text: sahih('bukhari', 4033, 2212, 2475), people: ['umar-ibn-al-khattab', 'abu-bakr-as-siddiq'] },
        { title: "«فادفعا إلي فأنا أكفيكماه»", text: sahih('bukhari', 4033, 2476, 3264), people: ['umar-ibn-al-khattab', 'al-abbas-ibn-abd-al-muttalib', 'ali-ibn-abi-talib'] },
        { title: "أزواج النبي ﷺ يسألن ثمنهن", text: sahih('bukhari', 4033, 3265, 3857), people: ['aisha-bint-abi-bakr', 'uthman-ibn-affan', 'abu-bakr-as-siddiq', 'prophet-muhammad'] },
        { title: "صدقة رسول الله ﷺ", text: sahih('bukhari', 4033, 3858, 4203), people: ['ali-ibn-abi-talib', 'al-abbas-ibn-abd-al-muttalib', 'al-hasan-ibn-ali', 'al-husayn-ibn-ali'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default alAbbasAndAliBeforeUmar;
