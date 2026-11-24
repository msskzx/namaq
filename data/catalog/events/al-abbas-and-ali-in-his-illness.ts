import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Ali came out from the Prophet ﷺ in his last illness and told the people he was well; al-Abbas took his hand, «أنت والله
 * بعد ثلاث عبد العصا», said he knew the faces of Banu Abd al-Muttalib at death and wanted to ask him who would hold the
 * matter, and Ali refused, «وإني والله لا أسألها رسول الله ﷺ». Told from Sahih al-Bukhari 4447 (al-Maghazi, the illness
 * of the Prophet ﷺ), whole.
 */
const alAbbasAndAliInHisIllness = {
  kind: 'EVENT',
  slug: 'al-abbas-and-ali-in-his-illness',
  name: "العباس وعلي في مرضه ﷺ",
  nameTransliterated: "Al-Abbas and Ali in his illness",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'ali-ibn-abi-talib' }, { person: 'prophet-muhammad' }, { person: 'al-abbas-ibn-abd-al-muttalib' }],
  reports: [
    {
      isnad: sahih('bukhari', 4447, 0, 312),
      source: { slug: 'sahih-al-bukhari', hadith: 4447, url: 'https://sunnah.com/bukhari:4447' },
      moments: [
        { title: "«أصبح بحمد الله بارئا»", text: sahih('bukhari', 4447, 313, 544), people: ['ali-ibn-abi-talib', 'prophet-muhammad'] },
        { title: "«أنت والله بعد ثلاث عبد العصا»", text: sahih('bukhari', 4447, 545, 976), people: ['al-abbas-ibn-abd-al-muttalib', 'ali-ibn-abi-talib', 'prophet-muhammad'] },
        { title: "«وإني والله لا أسألها رسول الله ﷺ»", text: sahih('bukhari', 4447, 977, 1147), people: ['ali-ibn-abi-talib', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default alAbbasAndAliInHisIllness;
