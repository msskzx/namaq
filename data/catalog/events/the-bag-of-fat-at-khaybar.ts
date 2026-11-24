import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * During the siege of Khaybar someone threw down a bag of fat; Abd Allah ibn Mughaffal leapt to take it, turned, saw the
 * Prophet ﷺ, and was ashamed. Told from Sahih al-Bukhari 4214 (al-Maghazi, the chapter on Khaybar), whole.
 *
 * Then Sahih Muslim 1772 (al-Jihad, food taken in enemy land), whole.
 */
const theBagOfFatAtKhaybar = {
  kind: 'EVENT',
  slug: 'the-bag-of-fat-at-khaybar',
  name: "جراب الشحم يوم خيبر",
  nameTransliterated: "The bag of fat at Khaybar",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'abdullah-ibn-mughaffal' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: sahih('bukhari', 4214, 0, 212),
      source: { slug: 'sahih-al-bukhari', hadith: 4214, url: 'https://sunnah.com/bukhari:4214' },
      moments: [
        { title: "جراب فيه شحم", text: sahih('bukhari', 4214, 213, 357), people: ['abdullah-ibn-mughaffal', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('muslim', 1772, 0, 164),
      source: { slug: 'sahih-muslim', hadith: 1772, url: 'https://sunnah.com/muslim:1772' },
      moments: [
        { title: "«لا أعطي اليوم أحدا من هذا شيئا»", text: sahih('muslim', 1772, 165, 350), people: ['abdullah-ibn-mughaffal', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theBagOfFatAtKhaybar;
