import type { CatalogBattle } from '@/lib/catalog/types';

/**
 * The morning after Uhud, and open only to those who had fought there. The
 * year comes from the chapter heading سنة ثلاث, the same heading that dates
 * Uhud itself; the section places this one at صبيحة وقعة أحد.
 *
 * Aishah names her father and al-Zubayr among the seventy who went out. Nobody
 * carries a status: لم يلقوا عدوا.
 */
const ghazwahHamraAlAsad = {
  kind: 'BATTLE',
  slug: 'ghazwah-hamra-al-asad',
  name: 'غزوة حمراء الأسد',
  nameTransliterated: 'The Expedition of Hamra al-Asad',
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['sira/hamra-al-asad'] },
    hijriYear: { value: 3, claims: ['sira/hamra-al-asad'] },
    location: { value: 'حمراء الأسد، على ثمانية أميال من المدينة', claims: ['sira/hamra-al-asad'] },
  },
  participants: [
    { person: 'prophet-muhammad', isMuslim: true, claims: ['sira/hamra-al-asad'] },
    {
      person: 'abu-bakr-as-siddiq',
      isMuslim: true,
      summary: { value: 'انتدب في سبعين خرجوا في آثار القوم، فلم يلقوا عدوا.', claims: ['abu-bakr/hamra-al-asad'] },
      claims: ['abu-bakr/hamra-al-asad'],
    },
    {
      person: 'az-zubayr-ibn-al-awwam',
      isMuslim: true,
      summary: { value: 'انتدب في سبعين خرجوا في آثار القوم، فلم يلقوا عدوا.', claims: ['zubayr/hamra-al-asad'] },
      claims: ['zubayr/hamra-al-asad'],
    },
  ],
} satisfies CatalogBattle;

export default ghazwahHamraAlAsad;
