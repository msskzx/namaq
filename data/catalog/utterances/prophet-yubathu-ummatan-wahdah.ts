import type { CatalogUtterance } from '@/lib/catalog/types';

/**
 * The grading is al-Dhahabi's own word, إسناده حسن, carried as he wrote it.
 * The app grades nothing; it records what the source said about its own report.
 */
const prophetYubathuUmmatanWahdah = {
  kind: 'UTTERANCE',
  slug: 'prophet-yubathu-ummatan-wahdah',
  utteranceKind: 'SAYING',
  speaker: 'prophet-muhammad',
  subject: 'zayd-ibn-amr-ibn-nufayl',
  event: 'death-of-zayd-ibn-amr',
  textArabic: { value: 'إنه يبعث يوم القيامة أمة وحده.', claims: ['prophet/saying-ummah-wahdah'] },
  fields: {
    grading: { value: 'إسناده حسن', claims: ['prophet/saying-ummah-wahdah'] },
    occasion: { value: 'قاله لما أنزل عليه بعد موت زيد بن عمرو بن نفيل.', claims: ['prophet/saying-ummah-wahdah'] },
  },
} satisfies CatalogUtterance;

export default prophetYubathuUmmatanWahdah;
