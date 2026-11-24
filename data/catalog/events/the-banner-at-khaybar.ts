import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At Khaybar the Prophet ﷺ said he would give the banner next day to a man who loves Allah and His Messenger and whom they
 * love; everyone hoped for it, he asked for Ali, who had sore eyes, spat in them and they healed, gave him the banner and
 * told him to call them to Islam first. Told from Sahih al-Bukhari 4210 (al-Maghazi, the chapter on Khaybar), whole; then
 * Salamah's 4209, whole, folded.
 */
const theBannerAtKhaybar = {
  kind: 'EVENT',
  slug: 'the-banner-at-khaybar',
  name: "الراية يوم خيبر",
  nameTransliterated: "The banner at Khaybar",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'ali-ibn-abi-talib' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4210, 0, 153),
      source: { slug: 'sahih-al-bukhari', hadith: 4210, url: 'https://sunnah.com/bukhari:4210' },
      moments: [
        { title: "«لأعطين هذه الراية غدا»", text: sahih('bukhari', 4210, 154, 403), people: ['prophet-muhammad'] },
        { title: "فبصق في عينيه", text: sahih('bukhari', 4210, 404, 764), people: ['prophet-muhammad', 'ali-ibn-abi-talib'] },
        { title: "«لأن يهدي الله بك رجلا واحدا»", text: sahih('bukhari', 4210, 765, 1113), people: ['ali-ibn-abi-talib', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4209, 0, 129),
      source: { slug: 'sahih-al-bukhari', hadith: 4209, url: 'https://sunnah.com/bukhari:4209' },
      moments: [
        { title: "تخلف وكان رمدا", text: sahih('bukhari', 4209, 130, 271), people: ['ali-ibn-abi-talib', 'prophet-muhammad'] },
        { title: "«رجل يحبه الله ورسوله»", text: sahih('bukhari', 4209, 272, 526), people: ['prophet-muhammad', 'ali-ibn-abi-talib'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theBannerAtKhaybar;
