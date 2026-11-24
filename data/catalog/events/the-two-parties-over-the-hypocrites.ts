import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * When the Prophet ﷺ went out to Uhud some who had gone with him turned back, and his companions split over them, some saying
 * fight them and some not, and «فما لكم في المنافقين فئتين» came down. Told from Sahih al-Bukhari 4050 (al-Maghazi, the
 * chapter on Uhud), whole, with the line on Medina that ends it; the text does not say who says it, so no one is linked.
 */
const theTwoPartiesOverTheHypocrites = {
  kind: 'EVENT',
  slug: 'the-two-parties-over-the-hypocrites',
  name: "فئتان في المنافقين",
  nameTransliterated: "Two parties over the hypocrites",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '4:88',
      to: '4:88',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4050, url: 'https://sunnah.com/bukhari:4050', quote: sahih('bukhari', 4050, 361, 454) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4050, 0, 165),
      source: { slug: 'sahih-al-bukhari', hadith: 4050, url: 'https://sunnah.com/bukhari:4050' },
      moments: [
        { title: "رجع ناس ممن خرج معه", text: sahih('bukhari', 4050, 166, 360), people: ['prophet-muhammad'] },
        { title: "«فما لكم في المنافقين فئتين»", text: sahih('bukhari', 4050, 361, 454), people: [] },
        { title: "«إنها طيبة»", text: sahih('bukhari', 4050, 455, 545), people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theTwoPartiesOverTheHypocrites;
