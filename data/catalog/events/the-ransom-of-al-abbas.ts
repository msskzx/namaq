import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Men of the Ansar asked the Prophet ﷺ's leave to let their sister's son al-Abbas off his ransom, and he said «والله لا تذرون
 * منه درهما». Told from Sahih al-Bukhari 4018 (al-Maghazi, in the chapters on Badr), whole.
 */
const theRansomOfAlAbbas = {
  kind: 'EVENT',
  slug: 'the-ransom-of-al-abbas',
  name: "فداء العباس",
  nameTransliterated: "The ransom of al-Abbas",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'al-abbas-ibn-abd-al-muttalib' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4018, 0, 157),
      source: { slug: 'sahih-al-bukhari', hadith: 4018, url: 'https://sunnah.com/bukhari:4018' },
      moments: [
        { title: "«والله لا تذرون منه درهما»", text: sahih('bukhari', 4018, 158, 346), people: ['prophet-muhammad', 'al-abbas-ibn-abd-al-muttalib'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theRansomOfAlAbbas;
