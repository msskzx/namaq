import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ asked Jabir whether he had married a virgin or a matron; Jabir said his father was killed at Uhud leaving nine
 * daughters and he wanted a woman to care for them, and the Prophet ﷺ said «أصبت». Told from Sahih al-Bukhari 4052
 * (al-Maghazi, the chapter on Uhud), whole. His wife is not named.
 */
const theMarriageOfJabir = {
  kind: 'EVENT',
  slug: 'the-marriage-of-jabir',
  name: "زواج جابر بن عبد الله",
  nameTransliterated: "The marriage of Jabir ibn Abd Allah",
  type: 'MARRIAGE',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'jabir-ibn-abdullah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4052, 0, 85),
      source: { slug: 'sahih-al-bukhari', hadith: 4052, url: 'https://sunnah.com/bukhari:4052' },
      moments: [
        { title: "«هل نكحت يا جابر؟»", text: sahih('bukhari', 4052, 86, 261), people: ['prophet-muhammad', 'jabir-ibn-abdullah'] },
        { title: "«إن أبي قتل يوم أحد»", text: sahih('bukhari', 4052, 262, 519), people: ['jabir-ibn-abdullah', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theMarriageOfJabir;
