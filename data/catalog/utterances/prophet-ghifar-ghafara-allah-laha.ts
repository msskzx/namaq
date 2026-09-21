import type { CatalogUtterance } from '@/lib/catalog/types';

// The grading here is a takhrij rather than a verdict, أخرجه مسلم, which is
// the other shape the column takes.
const prophetGhifarGhafaraAllahLaha = {
  kind: 'UTTERANCE',
  slug: 'prophet-ghifar-ghafara-allah-laha',
  utteranceKind: 'SAYING',
  speaker: 'prophet-muhammad',
  event: 'islam-of-abu-dharr',
  textArabic: { value: 'غفار غفر الله لها، وأسلم سالمها الله.', claims: ['prophet/saying-ghifar'] },
  fields: {
    grading: { value: 'أخرجه مسلم', claims: ['prophet/saying-ghifar'] },
    occasion: { value: 'قاله لما أسلمت غفار وجاءت أسلم تسلم على ما أسلموا عليه.', claims: ['prophet/saying-ghifar'] },
  },
} satisfies CatalogUtterance;

export default prophetGhifarGhafaraAllahLaha;
