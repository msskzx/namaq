import { sahih } from '@/lib/catalog/sahihText';
import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Musaylimah came to Medina saying he would follow Muhammad if he made the matter his after him; the Prophet ﷺ came to him
 * with Thabit ibn Qays, a palm stalk in his hand, and said «لو سألتني هذه القطعة ما أعطيتكها… وهذا ثابت يجيبك عني», and
 * the dream of the two gold bracelets he blew away was read as two liars, al-Ansi and Musaylimah. Told from Sahih
 * al-Bukhari (al-Maghazi, the delegation of Banu Hanifah and the story of al-Aswad al-Ansi), each whole: Ibn Abbas's 4373
 * first, a connected chain, and its end in our copy, 4374, which has no chain of its own; then Ubayd Allah's 4378, which he
 * gives as «بلغنا» (a Tabi'i's report, kept second as 4070 is in not-yours-is-the-matter), and its end, 4379, where he asks
 * Ibn Abbas about the dream.
 * 4375 is the dream alone (a saying); 4376–4377 are Abu Raja's memories of the jahiliyyah. Musaylimah and al-Ansi have no
 * catalog subject.
 */
const musaylimahInMedina = {
  kind: 'EVENT',
  slug: 'musaylimah-in-medina',
  name: "مسيلمة الكذاب في المدينة",
  nameTransliterated: "Musaylimah the Liar in Medina",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'thabit-ibn-qais' }],
  tags: ['HIS_WORDS'],
  reports: [
    {
      isnad: sahih('bukhari', 4373, 0, 166),
      source: { slug: 'sahih-al-bukhari', hadith: 4373, url: 'https://sunnah.com/bukhari:4373' },
      moments: [
        { title: "«إن جعل لي محمد من بعده تبعته»", text: sahih('bukhari', 4373, 167, 345), people: [] },
        { title: "«لو سألتني هذه القطعة ما أعطيتكها»", text: sahih('bukhari', 4373, 346, 779), people: ['prophet-muhammad', 'thabit-ibn-qais'] },
      ],
    },
    {
      source: { slug: 'sahih-al-bukhari', hadith: 4374, url: 'https://sunnah.com/bukhari:4374' },
      moments: [
        { title: "«فأولتهما كذابين يخرجان بعدي»", text: sahih('bukhari', 4374, 0, 448), people: ['prophet-muhammad'] },
      ],
    },
    {
      isnad: sahih('bukhari', 4378, 0, 264),
      source: { slug: 'sahih-al-bukhari', hadith: 4378, url: 'https://sunnah.com/bukhari:4378' },
      moments: [
        {
          title: "نزل في دار بنت الحارث",
          text: sahih('bukhari', 4378, 265, 455),
          people: [],
          turns: [
            { text: sahih('bukhari', 4378, 265, 455) },
          ],
        },
        {
          title: "«لو سألتني هذا القضيب ما أعطيتكه»",
          text: sahih('bukhari', 4378, 456, 965),
          people: ['prophet-muhammad', 'thabit-ibn-qais'],
          turns: [
            { text: sahih('bukhari', 4378, 456, 646) },
            { text: sahih('bukhari', 4378, 647, 758), speaker: { name: "مسيلمة" }, lead: sahih('bukhari', 4378, 647, 673) },
            { text: sahih('bukhari', 4378, 759, 939), speaker: { person: "prophet-muhammad", name: "النبي ﷺ" }, lead: sahih('bukhari', 4378, 759, 780) },
            { text: sahih('bukhari', 4378, 940, 965) },
          ],
        },
      ],
    },
    {
      source: { slug: 'sahih-al-bukhari', hadith: 4379, url: 'https://sunnah.com/bukhari:4379' },
      moments: [
        { title: "سواران من ذهب", text: sahih('bukhari', 4379, 0, 382), people: ['prophet-muhammad'] },
        { title: "العنسي ومسيلمة", text: sahih('bukhari', 4379, 383, 508), people: [] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default musaylimahInMedina;
