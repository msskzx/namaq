import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The Prophet ﷺ recited al-Najm and prostrated, and everyone prostrated but one man, who lifted a handful of pebbles to
 * his forehead and said it was enough for him; Ibn Mas'ud later saw him killed as a disbeliever. Told from Sahih al-Bukhari
 * 3853 (Manaqib al-Ansar), whole. The man is not named in this text, so no one is linked for him. No ayah range: the
 * hadith names the surah but quotes none of it.
 */
const theProstrationAtAlNajm = {
  kind: 'EVENT',
  slug: 'the-prostration-at-al-najm',
  name: "السجود في سورة النجم",
  nameTransliterated: "The prostration at al-Najm",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'prophet-muhammad' }, { person: 'abdullah-ibn-masud' }],
  tags: ['HEARD_QURAN'],
  reports: [
    {
      isnad: "حَدَّثَنَا سُلَيْمَانُ بْنُ حَرْبٍ: حَدَّثَنَا شُعْبَةُ، عَنْ أَبِي إِسْحَاقَ، عَنِ الْأَسْوَدِ، عَنْ عَبْدِ اللهِ  رضي الله عنه",
      source: { slug: 'sahih-al-bukhari', hadith: 3853, url: 'https://sunnah.com/bukhari:3853' },
      moments: [
        { title: "قرأ النجم فسجد", text: "قَالَ: «قَرَأَ النَّبِيُّ ﷺ النَّجْمَ فَسَجَدَ فَمَا بَقِيَ أَحَدٌ إِلَّا سَجَدَ", people: ['prophet-muhammad'] },
        { title: "«هذا يكفيني»", text: "إِلَّا رَجُلٌ رَأَيْتُهُ أَخَذَ كَفًّا مِنْ حَصًا فَرَفَعَهُ فَسَجَدَ عَلَيْهِ، وَقَالَ: هَذَا يَكْفِينِي،", people: ['abdullah-ibn-masud'] },
        { title: "قُتل كافرا", text: "فَلَقَدْ رَأَيْتُهُ بَعْدُ قُتِلَ كَافِرًا بِاللهِ.»", people: ['abdullah-ibn-masud'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default theProstrationAtAlNajm;
