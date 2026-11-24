import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Jubayr ibn Mut'im, before he became Muslim, came about the captives of Badr and heard the Prophet ﷺ recite al-Tur at
 * Maghrib: at {أم خلقوا من غير شيء} (al-Tur 35-37) his heart all but flew, and it was the first time faith settled in
 * it. Told from Sahih al-Bukhari, each hadith whole: 4854 (Kitab al-Tafsir) names the ayat, 4023 (al-Maghazi) says it was
 * the first stirring of his faith, 3050 (al-Jihad) that he had come about the captives of Badr, and 765 (al-Adhan) is
 * Malik's report of the recitation. Not tagged ISLAM: the texts say faith first settled in his heart, not that he became
 * Muslim then. The people stand on these reports, which name them, not on a batch claim.
 */
const jubairHearsAlTur = {
  kind: 'EVENT',
  slug: 'jubair-hears-al-tur',
  name: 'جبير بن مطعم يسمع سورة الطور',
  nameTransliterated: "Jubayr ibn Mut'im hears al-Tur",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'jubair-ibn-mutim' }, { person: 'prophet-muhammad' }],
  tags: ['HEARD_QURAN'],
  ayat: [
    {
      kind: 'RECITED',
      from: '52:35',
      to: '52:37',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4854, url: 'https://sunnah.com/bukhari:4854', quote: sahih('bukhari', 4854, 224, 464) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4854, 0, 156),
      source: { slug: 'sahih-al-bukhari', hadith: 4854, url: 'https://sunnah.com/bukhari:4854' },
      moments: [
        { title: 'يقرأ في المغرب بالطور', text: sahih('bukhari', 4854, 157, 223), people: ['jubair-ibn-mutim', 'prophet-muhammad'] },
        { title: '«كاد قلبي أن يطير»', text: sahih('bukhari', 4854, 224, 466), people: ['jubair-ibn-mutim', 'prophet-muhammad'] },
        { title: 'ما سمعه سفيان من الزهري', text: sahih('bukhari', 4854, 467, 702), people: ['jubair-ibn-mutim', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4023, 0, 151),
      source: { slug: 'sahih-al-bukhari', hadith: 4023, url: 'https://sunnah.com/bukhari:4023' },
      moments: [
        { title: 'يقرأ في المغرب بالطور', text: sahih('bukhari', 4023, 152, 218), people: ['jubair-ibn-mutim', 'prophet-muhammad'] },
        { title: 'أول ما وقر الإيمان في قلبه', text: sahih('bukhari', 4023, 219, 272), people: ['jubair-ibn-mutim'] },
      ],
    },
    {
      isnad: sahih('bukhari', 3050, 0, 136),
      source: { slug: 'sahih-al-bukhari', hadith: 3050, url: 'https://sunnah.com/bukhari:3050' },
      moments: [
        { title: 'جاء في أسارى بدر', text: sahih('bukhari', 3050, 137, 170), people: ['jubair-ibn-mutim'] },
        { title: 'يقرأ في المغرب بالطور', text: sahih('bukhari', 3050, 171, 238), people: ['jubair-ibn-mutim', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 765, 0, 141),
      source: { slug: 'sahih-al-bukhari', hadith: 765, url: 'https://sunnah.com/bukhari:765' },
      moments: [
        { title: 'قرأ في المغرب بالطور', text: sahih('bukhari', 765, 142, 210), people: ['jubair-ibn-mutim', 'prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default jubairHearsAlTur;
