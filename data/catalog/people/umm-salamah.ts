import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Married in شوال of year four, once her عدة for Abu Salamah had run. The
 * chapter gives her nasab, her kunya-name, and أم المؤمنين in one sentence.
 *
 * She had no module before this, so the values her rows already held are
 * carried on the marker: a module makes her catalog-owned, and a title or edge
 * this file does not declare would be removed from the stores.
 */
const ummSalamah = {
  kind: 'PERSON',
  slug: 'umm-salamah',
  name: 'أم سلمة',
  nameTransliterated: 'Umm Salamah',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'هند بنت أبي أمية بن المغيرة بن عبد الله بن عمر بن مخزوم القرشية المخزومية',
      claims: ['umm-salamah/full-name'],
    },
    sex: { value: 'FEMALE', claims: ['umm-salamah/sex'] },
  },
  titles: [
    { title: 'mother-of-believers', claims: ['umm-salamah/umm-al-mumineen'] },
    // Carried from the seed rows; no batch cites it for her.
    { title: 'companion', claims: legacyUnreviewed },
  ],
  relations: [
    { type: 'WIFE', inverse: 'HUSBAND', to: 'prophet-muhammad', claims: ['prophet/wife-umm-salamah'] },
    { type: 'WIFE', inverse: 'HUSBAND', to: 'abu-salamah', claims: ['abu-salamah/husband-umm-salamah'] },
    // Carried from the graph seed. The chapter names her father أبو أمية and
    // disputes his ism, حذيفة or سهيل, which the edge does not hold either way.
    { type: 'DAUGHTER', inverse: 'FATHER', to: 'abi-umayyah-ibn-al-mughirah', claims: legacyUnreviewed },
  ],
} satisfies CatalogPerson;

export default ummSalamah;
