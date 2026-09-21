import type { CatalogUtterance } from '@/lib/catalog/types';

// One line, on the burning of the Nadir palms at al-Buwayrah. The chapter
// gives it as حسان's word for what was done rather than as a claim about it.
const hassanWaHanaAlaSaratBaniLuayy = {
  kind: 'UTTERANCE',
  slug: 'hassan-wa-hana-ala-sarat-bani-luayy',
  utteranceKind: 'POETRY',
  speaker: 'hassan-ibn-thabit',
  event: 'expulsion-of-banu-nadir',
  textArabic: { value: 'وهان على سراة بني لؤي ... حريق بالبويرة مستطير', claims: ['hassan/verses-al-buwayrah'] },
  fields: {
    occasion: { value: 'قالها في قطع نخل بني النضير وتحريقه.', claims: ['hassan/verses-al-buwayrah'] },
  },
} satisfies CatalogUtterance;

export default hassanWaHanaAlaSaratBaniLuayy;
