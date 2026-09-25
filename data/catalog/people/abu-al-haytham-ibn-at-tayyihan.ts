import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

// Authored from data/history/batches/abu-al-haytham-ibn-at-tayyihan, entry
// 22, immediately after Abu Abs. Ibn Amarah's competing nasab and tribal
// claim (he names the father Malik rather than at-Tayyihan, and calls him a
// blood Ansari rather than a Bali confederate) stays DISPUTED in the batch;
// the heading's own reading, which matches the retired seed, is what the
// fields below carry.
const abuAlHaythamIbnAtTayyihan = {
  kind: 'PERSON',
  slug: 'abu-al-haytham-ibn-at-tayyihan',
  name: 'أبو الهيثم بن التيهان',
  nameTransliterated: 'Abu al-Haytham ibn at-Tayyihan',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'مالك بن التيهان بن بلي بن عمرو بن الحاف بن قضاعة الأنصاري',
      claims: ['abu-al-haytham-siyar22/full-name'],
    },
    kunya: { value: 'أبو الهيثم', claims: ['abu-al-haytham-siyar22/kunya'] },
    tribalAffiliation: { value: 'حليف بني عبد الأشهل', claims: ['abu-al-haytham-siyar22/tribal-affiliation'] },
    virtues: {
      value: 'كان أبو الهيثم يكره الأصنام في الجاهلية، ويؤفف بها، ويقول بالتوحيد هو وأسعد بن زرارة.',
      claims: ['abu-al-haytham-siyar22/virtues'],
    },
    deathYearHijri: { value: '20', claims: ['abu-al-haytham-siyar22/death-year'] },
  },
  titles: [
    // Carried from the retired seed. البدري is modeled as the Badr
    // PARTICIPATED_IN relation below rather than repeated as a title.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'SON', inverse: 'FATHER', to: 'at-tayyihan-ibn-bali', claims: ['abu-al-haytham-siyar22/father'] },
    {
      type: 'PACT_BROTHER',
      inverse: 'PACT_BROTHER',
      to: 'uthman-ibn-mazun',
      claims: ['abu-al-haytham-siyar22/pact-brother-uthman'],
    },
  ],
} satisfies CatalogPerson;

export default abuAlHaythamIbnAtTayyihan;
