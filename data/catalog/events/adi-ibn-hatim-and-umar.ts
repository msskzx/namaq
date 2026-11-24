import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Adi ibn Hatim came to Umar in a delegation; Umar called them man by man, and when Adi asked «أما تعرفني» he said «أسلمت
 * إذ كفروا، وأقبلت إذ أدبروا، ووفيت إذ غدروا، وعرفت إذ أنكروا». Told from Sahih al-Bukhari 4394 (al-Maghazi, the story
 * of the delegation of Tayy and Adi ibn Hatim), whole.
 */
const adiIbnHatimAndUmar = {
  kind: 'EVENT',
  slug: 'adi-ibn-hatim-and-umar',
  name: "عدي بن حاتم وعمر",
  nameTransliterated: "Adi ibn Hatim and Umar",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'adi-ibn-hatim' }, { person: 'umar-ibn-al-khattab' }],
  reports: [
    {
      isnad: sahih('bukhari', 4394, 0, 154),
      source: { slug: 'sahih-al-bukhari', hadith: 4394, url: 'https://sunnah.com/bukhari:4394' },
      moments: [
        { title: "«أسلمت إذ كفروا»", text: sahih('bukhari', 4394, 155, 451), people: ['adi-ibn-hatim', 'umar-ibn-al-khattab'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default adiIbnHatimAndUmar;
