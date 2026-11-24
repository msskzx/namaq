import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Anas's uncle missed Badr and swore that if Allah let him see battle with the Prophet ﷺ He would see what he would do; at
 * Uhud, when the people broke, he excused himself to Allah for the Muslims, told Sa'd ibn Mu'adh «إني أجد ريح الجنة دون
 * أحد», and was killed, known afterwards only by his sister. Told from Sahih al-Bukhari 4048 (al-Maghazi, the chapter on
 * Uhud), whole. The text calls him «عمه»; al-Bukhari's own telling of the same hadith from Anas (2805, al-Jihad) names him «عمي
 * أنس بن النضر», so he is linked. His sister is not named.
 */
const anasIbnAnNadrAtUhud = {
  kind: 'EVENT',
  slug: 'anas-ibn-an-nadr-at-uhud',
  name: "أنس بن النضر يوم أحد",
  nameTransliterated: 'Anas ibn al-Nadr at Uhud',
  type: 'OTHER',
  fields: {},
  people: [{ person: 'anas-ibn-an-nadr' }, { person: 'prophet-muhammad' }, { person: 'saad-ibn-muadh' }],
  reports: [
    {
      isnad: sahih('bukhari', 4048, 0, 119),
      source: { slug: 'sahih-al-bukhari', hadith: 4048, url: 'https://sunnah.com/bukhari:4048' },
      moments: [
        { title: "«ليرين الله ما أجد»", text: sahih('bukhari', 4048, 120, 278), people: ['anas-ibn-an-nadr', 'prophet-muhammad'] },
        { title: "«اللهم إني أعتذر إليك»", text: sahih('bukhari', 4048, 279, 471), people: ['anas-ibn-an-nadr'] },
        { title: "«إني أجد ريح الجنة دون أحد»", text: sahih('bukhari', 4048, 472, 615), people: ['anas-ibn-an-nadr', 'saad-ibn-muadh'] },
        { title: "عرفته أخته", text: sahih('bukhari', 4048, 616, 759), people: ['anas-ibn-an-nadr'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default anasIbnAnNadrAtUhud;
