import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * No seed file declares her, so this module is her only author. The chapter
 * names her twice: among the seven who first declared Islam, and as the first
 * to be killed for it.
 *
 * Her relation to Ammar is not recorded here. The sira calls her أم عمار, and
 * the catalog could carry MOTHER from that, but the kunya is how the book
 * identifies her rather than a statement about parentage, and the entry says
 * nothing else about the family. It waits for a passage that does.
 */
const sumayyahBintKhayyat = {
  kind: 'PERSON',
  slug: 'sumayyah-bint-khayyat',
  name: 'سمية بنت خياط',
  nameTransliterated: 'Sumayyah bint Khayyat',
  hasProfile: true,
  fields: {
    sex: { value: 'FEMALE', claims: ['sumayyah/sex'] },
    virtues: {
      value: 'كانت أول شهيد في الإسلام، طعنها أبو جهل بحربة.',
      claims: ['sumayyah/virtues'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default sumayyahBintKhayyat;
