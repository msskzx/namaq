import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Aisha told Urwah that his father al-Zubayr and Abu Bakr were of «الذين استجابوا لله والرسول»: when the mushrikun left Uhud
 * the Prophet ﷺ feared they would return and asked who would go after them, and seventy volunteered. Told from Sahih
 * al-Bukhari 4077 (al-Maghazi, the chapter on that ayah), whole.
 */
const thoseWhoAnsweredAfterUhud = {
  kind: 'EVENT',
  slug: 'those-who-answered-after-uhud',
  name: "الذين استجابوا لله والرسول",
  nameTransliterated: "Those who answered Allah and the Messenger",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'az-zubayr-ibn-al-awwam' }, { person: 'abu-bakr-as-siddiq' }, { person: 'prophet-muhammad' }],
  tags: ['HIS_WORDS'],
  ayat: [
    {
      kind: 'RECITED',
      from: '3:172',
      to: '3:172',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4077, url: 'https://sunnah.com/bukhari:4077', quote: sahih('bukhari', 4077, 112, 251) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4077, 0, 110),
      source: { slug: 'sahih-al-bukhari', hadith: 4077, url: 'https://sunnah.com/bukhari:4077' },
      moments: [
        { title: "«كان أبوك منهم»", text: sahih('bukhari', 4077, 111, 342), people: ['az-zubayr-ibn-al-awwam', 'abu-bakr-as-siddiq'] },
        { title: "«من يذهب في إثرهم؟»", text: sahih('bukhari', 4077, 343, 585), people: ['prophet-muhammad', 'abu-bakr-as-siddiq', 'az-zubayr-ibn-al-awwam'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default thoseWhoAnsweredAfterUhud;
