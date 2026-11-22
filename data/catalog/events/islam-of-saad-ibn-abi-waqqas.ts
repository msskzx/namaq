import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Sa'd ibn Abi Waqqas: no one became Muslim but on the day he did, and he stayed seven days a third of Islam. Told from
 * Sahih al-Bukhari 3858, the one hadith of its chapter «إسلام سعد» (Manaqib al-Ansar), whole.
 */
const islamOfSaadIbnAbiWaqqas = {
  kind: 'EVENT',
  slug: 'islam-of-saad-ibn-abi-waqqas',
  name: "إسلام سعد بن أبي وقاص",
  nameTransliterated: "The Islam of Sa'd ibn Abi Waqqas",
  type: 'OTHER',
  fields: {},
  people: [{ person: 'saad-ibn-abi-waqqas' }],
  tags: ['ISLAM'],
  reports: [
    {
      isnad: "حَدَّثَنِي إِسْحَاقُ: أَخْبَرَنَا أَبُو أُسَامَةَ: حَدَّثَنَا هَاشِمٌ قَالَ: سَمِعْتُ سَعِيدَ بْنَ الْمُسَيَّبِ",
      source: { slug: 'sahih-al-bukhari', hadith: 3858, url: 'https://sunnah.com/bukhari:3858' },
      moments: [
        { title: "«ما أسلم أحد إلا في اليوم الذي أسلمت فيه»", text: "قَالَ: سَمِعْتُ أَبَا إِسْحَاقَ سَعْدَ بْنَ أَبِي وَقَّاصٍ يَقُولُ: «مَا أَسْلَمَ أَحَدٌ إِلَّا فِي الْيَوْمِ الَّذِي أَسْلَمْتُ فِيهِ،", people: ['saad-ibn-abi-waqqas'] },
        { title: "«وإني لثلث الإسلام»", text: "وَلَقَدْ مَكَثْتُ سَبْعَةَ أَيَّامٍ، وَإِنِّي لَثُلُثُ الْإِسْلَامِ».", people: ['saad-ibn-abi-waqqas'] },
      ],
    },
  ],
} satisfies CatalogEvent;

export default islamOfSaadIbnAbiWaqqas;
