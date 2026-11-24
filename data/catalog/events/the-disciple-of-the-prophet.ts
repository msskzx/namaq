import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * On the day of the Confederates the Prophet ﷺ asked three times who would bring news of the enemy, and each time
 * al-Zubayr said «أنا»; then he said «إن لكل نبي حواري، وإن حواري الزبير». Told from Sahih al-Bukhari 4113 (al-Maghazi, the
 * chapter on al-Khandaq), whole.
 */
const theDiscipleOfTheProphet = {
  kind: 'EVENT',
  slug: 'the-disciple-of-the-prophet',
  name: "حواري النبي ﷺ",
  nameTransliterated: "The disciple of the Prophet",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'az-zubayr-ibn-al-awwam' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4113, 0, 116),
      source: { slug: 'sahih-al-bukhari', hadith: 4113, url: 'https://sunnah.com/bukhari:4113' },
      moments: [
        { title: "«من يأتينا بخبر القوم»", text: sahih('bukhari', 4113, 117, 378), people: ['prophet-muhammad', 'az-zubayr-ibn-al-awwam'] },
        { title: "«إن لكل نبي حواري»", text: sahih('bukhari', 4113, 379, 458), people: ['prophet-muhammad', 'az-zubayr-ibn-al-awwam'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theDiscipleOfTheProphet;
