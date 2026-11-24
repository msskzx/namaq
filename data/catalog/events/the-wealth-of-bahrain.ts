import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Abu Ubaydah came back from Bahrain with its jizyah; the Ansar heard and came to the dawn prayer, and the Prophet ﷺ smiled
 * and said «فوالله ما الفقر أخشى عليكم، ولكني أخشى أن تبسط عليكم الدنيا». Told from Sahih al-Bukhari 4015 (al-Maghazi, in
 * the chapters on Badr, for its narrator Amr ibn Awf, a man of Badr), whole.
 */
const theWealthOfBahrain = {
  kind: 'EVENT',
  slug: 'the-wealth-of-bahrain',
  name: "مال البحرين",
  nameTransliterated: "The wealth of Bahrain",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-ubaydah-ibn-al-jarrah' }, { person: 'al-ala-ibn-al-hadrami' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4015, 0, 309),
      source: { slug: 'sahih-al-bukhari', hadith: 4015, url: 'https://sunnah.com/bukhari:4015' },
      moments: [
        { title: "قدم أبو عبيدة بمال من البحرين", text: sahih('bukhari', 4015, 310, 581), people: ['prophet-muhammad', 'abu-ubaydah-ibn-al-jarrah', 'al-ala-ibn-al-hadrami'] },
        { title: "«أظنكم سمعتم أن أبا عبيدة قدم بشيء؟»", text: sahih('bukhari', 4015, 582, 872), people: ['prophet-muhammad', 'abu-ubaydah-ibn-al-jarrah'] },
        { title: "«فوالله ما الفقر أخشى عليكم»", text: sahih('bukhari', 4015, 873, 1134), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theWealthOfBahrain;
