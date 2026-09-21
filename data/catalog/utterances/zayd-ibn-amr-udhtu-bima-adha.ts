import type { CatalogUtterance } from '@/lib/catalog/types';

// Said standing at the Kaaba, facing the qiblah. The heading sweep gave Zayd a
// subject; this is the only place his own words can go.
const zaydIbnAmrUdhtuBimaAdha = {
  kind: 'UTTERANCE',
  slug: 'zayd-ibn-amr-udhtu-bima-adha',
  utteranceKind: 'POETRY',
  speaker: 'zayd-ibn-amr-ibn-nufayl',
  textArabic: {
    value: [
      'عذت بما عاذ به إبراهيم ... مستقبل القبلة وهو قائم',
      'أنفي لك اللهم عان راغم ... مهما تجشمني فإني جاشم',
    ].join('\n'),
    claims: ['zayd-amr/verses-udhtu'],
  },
  fields: {},
} satisfies CatalogUtterance;

export default zaydIbnAmrUdhtuBimaAdha;
