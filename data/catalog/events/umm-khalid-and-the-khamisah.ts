import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Umm Khalid came back from Abyssinia a little girl, and the Prophet ﷺ clothed her in a khamisah with markings, stroking
 * them and saying «سناه سناه». Told from Sahih al-Bukhari 3874 (the chapter on the hijra to Abyssinia), whole, with
 * al-Humaydi's gloss.
 */
const ummKhalidAndTheKhamisah = {
  kind: 'EVENT',
  slug: 'umm-khalid-and-the-khamisah',
  name: "أم خالد وخميصة النبي ﷺ",
  nameTransliterated: "Umm Khalid and the Prophet's khamisah",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umm-khalid-bint-khalid' }, { person: 'prophet-muhammad' }],
  reports: [
    {
      isnad: sahih('bukhari', 3874, 0, 145),
      source: { slug: 'sahih-al-bukhari', hadith: 3874, url: 'https://sunnah.com/bukhari:3874' },
      moments: [
        { title: "قدمت من الحبشة جويرية", text: sahih('bukhari', 3874, 146, 210), people: ['umm-khalid-bint-khalid'] },
        { title: "«سناه سناه»", text: sahih('bukhari', 3874, 211, 349), people: ['prophet-muhammad', 'umm-khalid-bint-khalid'] },
        { title: "يعني حسن حسن", text: sahih('bukhari', 3874, 350, 394), people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ummKhalidAndTheKhamisah;
