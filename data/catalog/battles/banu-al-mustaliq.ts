import type { CatalogBattle } from '@/lib/catalog/types';

/**
 * The old seed never had it, so the catalog creates the row.
 *
 * The year is the one place in this batch where two readings compete over a
 * value the model actually holds, and the book settles it: Ibn Ishaq says
 * شعبان سنة ست, Ibn Shihab, Urwah and Qatadah say سنة خمس, and al-Dhahabi ends
 * the passage وهو الصحيح. So the column takes five and Ibn Ishaq's six stays
 * as a DISPUTED claim rather than being dropped or averaged away
 * ([ADR 0008](../../../docs/adr/0008-separate-review-from-visibility.md) on
 * recording what is honest and letting it be visible).
 *
 * Compare the Khandaq in chapter seven, where the competing readings were
 * months: there the disagreement stays in the pages, because a claim needs a
 * value to compete over and the model holds no month.
 */
const banuAlMustaliq = {
  kind: 'BATTLE',
  slug: 'banu-al-mustaliq',
  name: 'غزوة بني المصطلق',
  nameTransliterated: 'Expedition against Banu al-Mustaliq',
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['mustaliq/engagement'] },
    hijriYear: { value: 5, claims: ['mustaliq/year'] },
  },
  participants: [{ person: 'prophet-muhammad', isMuslim: true, claims: ['prophet/mustaliq'] }],
} satisfies CatalogBattle;

export default banuAlMustaliq;
