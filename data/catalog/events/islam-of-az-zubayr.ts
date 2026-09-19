import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * No year: the entry dates his Islam only by his age, and it gives two ages —
 * sixteen in the naming line, eight on Urwah's authority a paragraph later.
 * Neither is a value the model holds, so the disagreement stays on the page and
 * the description keeps the book's own word for him, حدث.
 */
const islamOfAzZubayr = {
  kind: 'EVENT',
  slug: 'islam-of-az-zubayr',
  name: 'إسلام الزبير بن العوام',
  nameTransliterated: 'Islam of al-Zubayr ibn al-Awwam',
  type: 'OTHER',
  fields: {
    description: {
      value: 'أسلم الزبير بن العوام وهو حدث، على يد أبي بكر الصديق.',
      claims: ['zubayr/islam'],
    },
  },
  people: [{ person: 'az-zubayr-ibn-al-awwam', claims: ['zubayr/islam'] }],
} satisfies CatalogEvent;

export default islamOfAzZubayr;
