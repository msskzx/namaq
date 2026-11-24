import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Amr ibn Salamah's people lived by a water where riders passed, and he learned by heart what they told of the Quran; the
 * Arabs waited on the conquest, and when it came his father brought his people's islam and the Prophet's words «وليؤمكم
 * أكثركم قرآنا», and they put the boy of six or seven in front, in a cloak too short for him. Told from Sahih al-Bukhari
 * 4302 (al-Maghazi, the chapter after the conquest), whole. Amr ibn Salamah and his father have no catalog subject.
 */
const amrIbnSalamahLeadsHisPeople = {
  kind: 'EVENT',
  slug: 'amr-ibn-salamah-leads-his-people',
  name: "عمرو بن سلمة يؤم قومه",
  nameTransliterated: "Amr ibn Salamah leads his people",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['ISLAM'],
  reports: [
    {
      isnad: sahih('bukhari', 4302, 0, 236),
      source: { slug: 'sahih-al-bukhari', hadith: 4302, url: 'https://sunnah.com/bukhari:4302' },
      moments: [
        { title: "كنت أحفظ ذلك الكلام", text: sahih('bukhari', 4302, 237, 688), people: [] },
        { title: "«جئتكم والله من عند النبي ﷺ حقا»", text: sahih('bukhari', 4302, 689, 1060), people: ['prophet-muhammad'] },
        { title: "«فما فرحت بشيء فرحي بذلك القميص»", text: sahih('bukhari', 4302, 1061, 1475), people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default amrIbnSalamahLeadsHisPeople;
