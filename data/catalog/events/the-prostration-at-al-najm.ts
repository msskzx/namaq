import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ recited al-Najm and prostrated, and everyone prostrated but one man, who lifted a handful of pebbles to
 * his forehead and said it was enough for him; Ibn Mas'ud later saw him killed as a disbeliever. Told from Sahih al-Bukhari
 * 3853 (Manaqib al-Ansar), whole. The man is not named in this text, so no one is linked for him. No ayah range: the
 * hadith names the surah but quotes none of it. Then 3972 (al-Maghazi, in the chapters on Badr), the same
 * hadith by another route, whole, folded.
 */
const theProstrationAtAlNajm = {
  kind: 'EVENT',
  slug: 'the-prostration-at-al-najm',
  name: "السجود في سورة النجم",
  nameTransliterated: "The prostration at al-Najm",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abdullah-ibn-masud' }],
  tags: ['HEARD_QURAN'],
  reports: [
    {
      isnad: sahih('bukhari', 3853, 0, 128),
      source: { slug: 'sahih-al-bukhari', hadith: 3853, url: 'https://sunnah.com/bukhari:3853' },
      moments: [
        { title: "قرأ النجم فسجد", text: sahih('bukhari', 3853, 129, 209), people: ['prophet-muhammad'] },
        { title: "«هذا يكفيني»", text: sahih('bukhari', 3853, 210, 316), people: ['abdullah-ibn-masud'] },
        { title: "قُتل كافرا", text: sahih('bukhari', 3853, 317, 369), people: ['abdullah-ibn-masud'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3972, 0, 168),
      source: { slug: 'sahih-al-bukhari', hadith: 3972, url: 'https://sunnah.com/bukhari:3972' },
      moments: [
        { title: "قرأ والنجم فسجد بها", text: sahih('bukhari', 3972, 169, 338), people: ['prophet-muhammad'] },
        { title: "قُتل كافرا", text: sahih('bukhari', 3972, 339, 403), people: ['abdullah-ibn-masud'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theProstrationAtAlNajm;
