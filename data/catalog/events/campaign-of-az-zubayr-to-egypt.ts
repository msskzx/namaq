import type { CatalogEvent } from '@/lib/catalog/types';

// No year: the report places the campaign only against the plague that met him
// in Egypt, and names no caliphate, season or year.
const campaignOfAzZubayrToEgypt = {
  kind: 'EVENT',
  slug: 'campaign-of-az-zubayr-to-egypt',
  name: 'غزو الزبير نحو مصر',
  nameTransliterated: "al-Zubayr's Campaign toward Egypt",
  type: 'TRAVEL',
  fields: {
    location: { value: 'مصر', claims: ['zubayr/campaign-egypt'] },
    description: {
      value: 'خرج الزبير بن العوام غازياً نحو مصر، فكتب إليه أميرها أن بها الطاعون، فدخلها وقال: إنما خرجت للطعن والطاعون، فلقي طعنة في جبهته.',
      claims: ['zubayr/campaign-egypt'],
    },
  },
  people: [{ person: 'az-zubayr-ibn-al-awwam', claims: ['zubayr/campaign-egypt'] }],
} satisfies CatalogEvent;

export default campaignOfAzZubayrToEgypt;
