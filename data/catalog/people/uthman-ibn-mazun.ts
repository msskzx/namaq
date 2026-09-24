import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/uthman-ibn-mazun in addition to the
// earlier prophet-muhammad-sira batch. First to migrate to Abyssinia and
// back, an ascetic, and the first Muhajir buried at al-Baqi.
const uthmanIbnMazun = {
  kind: 'PERSON',
  slug: 'uthman-ibn-mazun',
  name: 'عثمان بن مظعون',
  nameTransliterated: 'Uthman ibn Mazun',
  hasProfile: true,
  fields: {
    fullName: {
      value:
        'عُثْمَانُ بنُ مَظْعُوْنِ بنِ حَبِيْبِ بنِ وَهْبٍ بنِ حُذَافَةَ بنِ جُمَح بنِ عَمْرِو بنِ هُصَيْصِ بنِ كَعْبٍ الجُمَحِيُّ.',
      claims: ['uthman-mazun-siyar9/full-name'],
    },
    kunya: { value: 'أَبُو السَّائِبِ', claims: ['uthman-mazun-siyar9/kunya'] },
    appearance: {
      value: 'كَانَ عُثْمَانُ شَدِيْدَ الأُدْمَة، كَبِيْرَ اللِّحْيَة.',
      claims: ['uthman-mazun-siyar9/appearance'],
    },
    virtues: {
      value: 'أَمَّا لَيْلُهُ فَقَائِمٌ، وَأَمَّا نَهَارُهُ فَصَائِمٌ.',
      claims: ['uthman-mazun-siyar9/virtues'],
    },
  },
  titles: [
    // Carried from the seed. This entry never calls him صحابي in so many
    // words, so it stays legacy rather than promoted.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'mazun-ibn-habib', claims: ['uthman-mazun-siyar9/father'] },
    { type: 'BROTHER', inverse: 'BROTHER', to: 'qudamah-ibn-mazun', claims: ['uthman-mazun-siyar9/brother-qudamah'] },
    {
      type: 'BROTHER',
      inverse: 'BROTHER',
      to: 'abdullah-ibn-mazun-al-jumahi',
      claims: ['uthman-mazun-siyar9/brother-abdullah'],
    },
    // as-Saib's own entry (data/history/batches/as-saib-ibn-uthman) opens
    // with his nasab back to Uthman, promoting this off the legacy marker.
    { type: 'FATHER', inverse: 'SON', to: 'as-saib-ibn-uthman', claims: ['saib-uthman-siyar12/father'] },
  ],
} satisfies CatalogPerson;

export default uthmanIbnMazun;
