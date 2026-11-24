import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ sent Amr ibn al-As over the army of Dhat al-Salasil; Amr came and asked him who was dearest to him: «عائشة»,
 * then her father, then Umar, and he named more men until Amr fell silent for fear of being put last. Told from Sahih
 * al-Bukhari 4358 (al-Maghazi, the raid of Dhat al-Salasil), whole. Abu Uthman tells it without naming Amr as his source,
 * but the «قال: فأتيته» is Amr's, and the book's other telling, 3662 (Fada'il al-Sahabah), has «حدثني عمرو بن العاص».
 * Aisha, Abu Bakr and Umar are named only in his answer and are not linked.
 */
const amrIbnAlAsAsksWhoIsDearest = {
  kind: 'EVENT',
  slug: 'amr-ibn-al-as-asks-who-is-dearest',
  name: "سؤال عمرو بن العاص بعد ذات السلاسل",
  nameTransliterated: "Amr ibn al-As asks who is dearest",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'amr-ibn-al-as' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4358, 0, 108),
      source: { slug: 'sahih-al-bukhari', hadith: 4358, url: 'https://sunnah.com/bukhari:4358' },
      moments: [
        { title: "جيش ذات السلاسل", text: sahih('bukhari', 4358, 109, 193), people: ['prophet-muhammad', 'amr-ibn-al-as'] },
        { title: "«أي الناس أحب إليك؟»", text: sahih('bukhari', 4358, 194, 422), people: ['amr-ibn-al-as', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default amrIbnAlAsAsksWhoIsDearest;
