import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Sent against al-Huraqah, Usamah ibn Zayd caught a man who said «لا إله إلا الله» and killed him; the Prophet ﷺ said
 * «يا أسامة، أقتلته بعدما قال لا إله إلا الله» and kept repeating it until Usamah wished he had not become Muslim before
 * that day. Told from Sahih al-Bukhari 4269 (al-Maghazi, the sending of Usamah to al-Huraqah), whole. The Ansari and the
 * man killed are not named. 4270–4273 are Salamah's counts of raids.
 */
const usamahAtAlHuraqah = {
  kind: 'EVENT',
  slug: 'usamah-at-al-huraqah',
  name: "أسامة يوم الحرقة",
  nameTransliterated: "Usamah at al-Huraqah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'usamah-ibn-zaid' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4269, 0, 168),
      source: { slug: 'sahih-al-bukhari', hadith: 4269, url: 'https://sunnah.com/bukhari:4269' },
      moments: [
        { title: "قال: لا إله إلا الله", text: sahih('bukhari', 4269, 169, 435), people: ['usamah-ibn-zaid'] },
        { title: "«أقتلته بعدما قال لا إله إلا الله»", text: sahih('bukhari', 4269, 436, 681), people: ['prophet-muhammad', 'usamah-ibn-zaid'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default usamahAtAlHuraqah;
