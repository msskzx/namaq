import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At al-Yarmuk al-Zubayr charged through the Roman ranks alone and came back with two sword blows on his shoulder, with a
 * Badr wound between them, in which Urwah as a boy would put his fingers. Told from Sahih al-Bukhari (al-Maghazi, in the
 * chapters on Badr), each hadith whole: 3975, the charge, first; then 3973, his wounds and his sword, which Abd al-Malik
 * ibn Marwan asked Urwah about after Abd Allah ibn al-Zubayr was killed. 3974 (his sword was decorated with silver) is not
 * a story. Abd Allah ibn al-Zubayr and Abd al-Malik have no catalog subject and are not linked.
 */
const azZubayrAtAlYarmuk = {
  kind: 'EVENT',
  slug: 'az-zubayr-at-al-yarmuk',
  name: "الزبير يوم اليرموك",
  nameTransliterated: "Al-Zubayr at al-Yarmuk",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'az-zubayr-ibn-al-awwam' }],
  reports: [
    {
      isnad: sahih('bukhari', 3975, 0, 109),
      source: { slug: 'sahih-al-bukhari', hadith: 3975, url: 'https://sunnah.com/bukhari:3975' },
      moments: [
        { title: "«ألا تشد فنشد معك؟»", text: sahih('bukhari', 3975, 110, 364), people: ['az-zubayr-ibn-al-awwam'] },
        { title: "ضربتين على عاتقه", text: sahih('bukhari', 3975, 365, 592), people: ['az-zubayr-ibn-al-awwam'] },
        { title: "وهو ابن عشر سنين", text: sahih('bukhari', 3975, 593, 742), people: ['az-zubayr-ibn-al-awwam'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3973, 0, 122),
      source: { slug: 'sahih-al-bukhari', hadith: 3973, url: 'https://sunnah.com/bukhari:3973' },
      moments: [
        { title: "ثلاث ضربات بالسيف", text: sahih('bukhari', 3973, 123, 326), people: ['az-zubayr-ibn-al-awwam'] },
        { title: "«هل تعرف سيف الزبير؟»", text: sahih('bukhari', 3973, 327, 770), people: ['az-zubayr-ibn-al-awwam'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default azZubayrAtAlYarmuk;
