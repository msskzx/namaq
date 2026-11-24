import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Umar brought the young Ibn Abbas into the gathering of the elders of Badr; when some objected he asked them about «إذا جاء
 * نصر الله والفتح», and Ibn Abbas said it was the Prophet's term made known to him, and Umar said «ما أعلم منها إلا ما
 * تعلم». Told from Sahih al-Bukhari 4294 (al-Maghazi, the chapter on the conquest) first, whole; then 4430 (the illness
 * of the Prophet ﷺ), whole, which names Abd al-Rahman ibn Awf as the one who objected. Ibn Abbas has no catalog subject.
 */
const ibnAbbasAndSuratAnNasr = {
  kind: 'EVENT',
  slug: 'ibn-abbas-and-surat-an-nasr',
  name: "ابن عباس وسورة النصر",
  nameTransliterated: "Ibn Abbas and Surat al-Nasr",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'umar-ibn-al-khattab' }, { person: 'abdur-rahman-ibn-awf' }],
  ayat: [
    {
      kind: 'RECITED',
      from: '110:1',
      to: '110:3',
      evidence: [{ source: 'sahih-al-bukhari', hadith: 4294, url: 'https://sunnah.com/bukhari:4294', quote: sahih('bukhari', 4294, 449, 571) }],
    },
  ],
  reports: [
    {
      isnad: sahih('bukhari', 4294, 0, 148),
      source: { slug: 'sahih-al-bukhari', hadith: 4294, url: 'https://sunnah.com/bukhari:4294' },
      moments: [
        { title: "«لم تدخل هذا الفتى معنا»", text: sahih('bukhari', 4294, 149, 448), people: ['umar-ibn-al-khattab'] },
        { title: "سألهم عن السورة", text: sahih('bukhari', 4294, 449, 745), people: ['umar-ibn-al-khattab'] },
        { title: "«ما أعلم منها إلا ما تعلم»", text: sahih('bukhari', 4294, 746, 1100), people: ['umar-ibn-al-khattab'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4430, 0, 132),
      source: { slug: 'sahih-al-bukhari', hadith: 4430, url: 'https://sunnah.com/bukhari:4430' },
      moments: [
        { title: "«إن لنا أبناء مثله»", text: sahih('bukhari', 4430, 133, 316), people: ['umar-ibn-al-khattab', 'abdur-rahman-ibn-awf'] },
        { title: "«ما أعلم منها إلا ما تعلم»", text: sahih('bukhari', 4430, 317, 514), people: ['umar-ibn-al-khattab'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default ibnAbbasAndSuratAnNasr;
