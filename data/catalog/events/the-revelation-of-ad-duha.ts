import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Jibril was slow to come to the Prophet ﷺ and the mushrikun said «قد ودع محمد», and Allah sent down «والضحى. والليل إذا
 * سجى. ما ودعك ربك وما قلى». Told from Sahih Muslim 1797 (al-Jihad, the chapter on what the Prophet ﷺ met from the
 * mushrikun), whole.
 */
const theRevelationOfAdDuha = {
  kind: 'EVENT',
  slug: 'the-revelation-of-ad-duha',
  name: "نزول سورة الضحى",
  nameTransliterated: "The revelation of al-Duha",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }],
  tags: ['REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'REVEALED_ABOUT',
      from: '93:1',
      to: '93:3',
      evidence: [{ source: 'sahih-muslim', hadith: 1797, url: 'https://sunnah.com/muslim:1797', quote: sahih('muslim', 1797, 218, 324) }],
    },
  ],
  reports: [
    {
      isnad: sahih('muslim', 1797, 0, 125),
      source: { slug: 'sahih-muslim', hadith: 1797, url: 'https://sunnah.com/muslim:1797' },
      moments: [
        { title: "«قد ودع محمد»", text: sahih('muslim', 1797, 126, 217), people: ['prophet-muhammad'],
          turns: [
            { text: sahih('muslim', 1797, 126, 169) },
            { text: sahih('muslim', 1797, 170, 217), speaker: { name: "المشركون" }, lead: sahih('muslim', 1797, 170, 193) },
          ] },
        { title: "﴿ما ودعك ربك وما قلى﴾", text: sahih('muslim', 1797, 218, 346), people: [],
          turns: [
            { text: sahih('muslim', 1797, 218, 346) },
          ] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theRevelationOfAdDuha;
