import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * At al-Hudaybiyah the lice fell from Ka'b ibn Ujrah's head onto his face; the Prophet ﷺ told him to shave, and Allah sent
 * down the ransom: three days of fasting, feeding six poor people, or a sheep. Told from Sahih al-Bukhari, each hadith
 * whole: 4159 first (al-Maghazi, the chapter on al-Hudaybiyah), the fullest; then 4191, which recites the ayah, and 4190.
 */
const kaabIbnUjrahAndTheFidyah = {
  kind: 'EVENT',
  slug: 'kaab-ibn-ujrah-and-the-fidyah',
  name: "كعب بن عجرة والفدية",
  nameTransliterated: "Ka'b ibn Ujrah and the ransom",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'kaab-ibn-ujrah' }],
  tags: ['HIS_WORDS', 'REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '2:196',
      to: '2:196',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4191, url: 'https://sunnah.com/bukhari:4191', quote: sahih('bukhari', 4191, 457, 599) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4159, 0, 228),
      source: { slug: 'sahih-al-bukhari', hadith: 4159, url: 'https://sunnah.com/bukhari:4159' },
      moments: [
        { title: "«أيؤذيك هوامك؟»", text: sahih('bukhari', 4159, 229, 341), people: ['prophet-muhammad', 'kaab-ibn-ujrah'] },
        { title: "فأنزل الله الفدية", text: sahih('bukhari', 4159, 342, 666), people: ['prophet-muhammad', 'kaab-ibn-ujrah'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4191, 0, 186),
      source: { slug: 'sahih-al-bukhari', hadith: 4191, url: 'https://sunnah.com/bukhari:4191' },
      moments: [
        { title: "جعلت الهوام تساقط على وجهي", text: sahih('bukhari', 4191, 187, 449), people: ['kaab-ibn-ujrah', 'prophet-muhammad'] },
        { title: "وأنزلت هذه الآية", text: sahih('bukhari', 4191, 450, 601), people: [] },
      ],
    },
    {
      isnad: sahih('bukhari', 4190, 0, 172),
      source: { slug: 'sahih-al-bukhari', hadith: 4190, url: 'https://sunnah.com/bukhari:4190' },
      moments: [
        { title: "«أيؤذيك هوام رأسك؟»", text: sahih('bukhari', 4190, 173, 320), people: ['prophet-muhammad', 'kaab-ibn-ujrah'] },
        { title: "«فاحلق، وصم ثلاثة أيام»", text: sahih('bukhari', 4190, 321, 474), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default kaabIbnUjrahAndTheFidyah;
