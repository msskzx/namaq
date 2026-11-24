import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * On a night journey Umar asked the Prophet ﷺ three times and had no answer, rode ahead fearing Quran would come down about
 * him, and was called back: «لقد أنزلت علي الليلة سورة، لهي أحب إلي مما طلعت عليه الشمس», and he recited «إنا فتحنا لك
 * فتحا مبينا». Told from Sahih al-Bukhari 4177 (al-Maghazi, the chapter on al-Hudaybiyah), whole; then Anas's Sahih Muslim
 * 1786, whole, folded, which says it came down on the way back from al-Hudaybiyah.
 */
const theRevelationOfSuratAlFath = {
  kind: 'EVENT',
  slug: 'the-revelation-of-surat-al-fath',
  name: "نزول سورة الفتح",
  nameTransliterated: "The revelation of Surat al-Fath",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'umar-ibn-al-khattab' }],
  tags: ['HIS_WORDS', 'REVEALED_ABOUT'],
  ayat: [
    {
      kind: 'RECITED',
      from: '48:1',
      to: '48:1',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4177, url: 'https://sunnah.com/bukhari:4177', quote: sahih('bukhari', 4177, 885, 939) }],
    },
    {
      kind: 'REVEALED_ABOUT',
      report: "في رواية أنس",
      from: '48:1',
      to: '48:5',
      evidence: [{ source: 'sahih-muslim', hadith: 1786, url: 'https://sunnah.com/muslim:1786', quote: sahih('muslim', 1786, 185, 274) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4177, 0, 99),
      source: { slug: 'sahih-al-bukhari', hadith: 4177, url: 'https://sunnah.com/bukhari:4177' },
      moments: [
        { title: "سأله ثلاث مرات فلم يجبه", text: sahih('bukhari', 4177, 100, 354), people: ['prophet-muhammad', 'umar-ibn-al-khattab'] },
        { title: "«ثكلتك أمك يا عمر»", text: sahih('bukhari', 4177, 355, 604), people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
        { title: "«لقد أنزلت علي الليلة سورة»", text: sahih('bukhari', 4177, 605, 941), people: ['umar-ibn-al-khattab', 'prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('muslim', 1786, 0, 184),
      source: { slug: 'sahih-muslim', hadith: 1786, url: 'https://sunnah.com/muslim:1786' },
      moments: [
        { title: "«لقد أنزلت علي آية هي أحب إلي من الدنيا جميعا»", text: sahih('muslim', 1786, 185, 507), people: ['prophet-muhammad'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theRevelationOfSuratAlFath;
