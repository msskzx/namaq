import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Al-Aqib and al-Sayyid of Najran came meaning to call down a curse with the Prophet ﷺ, thought better of it and offered
 * what he asked, asking him to send a trustworthy man with them; the Companions hoped for it, and he said «قم يا أبا عبيدة
 * بن الجراح… هذا أمين هذه الأمة». Told from Hudhayfah's hadith in Sahih al-Bukhari (al-Maghazi, the story of the people
 * of Najran), each whole: 4380 first, then 4381. 4382 is the saying alone. Al-Aqib and al-Sayyid have no catalog subject.
 */
const thePeopleOfNajran = {
  kind: 'EVENT',
  slug: 'the-people-of-najran',
  name: "أهل نجران",
  nameTransliterated: "The people of Najran",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abu-ubaydah-ibn-al-jarrah' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4380, 0, 159),
      source: { slug: 'sahih-al-bukhari', hadith: 4380, url: 'https://sunnah.com/bukhari:4380' },
      moments: [
        { title: "يريدان أن يلاعناه", text: sahih('bukhari', 4380, 160, 531), people: ['prophet-muhammad'] },
        { title: "«هذا أمين هذه الأمة»", text: sahih('bukhari', 4380, 532, 767), people: ['prophet-muhammad', 'abu-ubaydah-ibn-al-jarrah'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4381, 0, 186),
      source: { slug: 'sahih-al-bukhari', hadith: 4381, url: 'https://sunnah.com/bukhari:4381' },
      moments: [
        { title: "«لأبعثن إليكم رجلا أمينا حق أمين»", text: sahih('bukhari', 4381, 187, 413), people: ['prophet-muhammad', 'abu-ubaydah-ibn-al-jarrah'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default thePeopleOfNajran;
