import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * No seed file declares him, so this module is his only author. He is not a
 * Companion -- he died before the mission -- but the sira gives him an entry of
 * his own, and Sa'id ibn Zayd, who is one, is his son.
 *
 * `hasProfile` is true because the chapter says enough about him to fill a
 * page: the ḥanīf who refused what was slaughtered for idols and saved the
 * buried daughters.
 */
const zaydIbnAmrIbnNufayl = {
  kind: 'PERSON',
  slug: 'zayd-ibn-amr-ibn-nufayl',
  name: 'زيد بن عمرو بن نفيل',
  nameTransliterated: 'Zayd ibn Amr ibn Nufayl',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['zayd-amr/sex'] },
    virtues: {
      value:
        'قال قائما مسندا ظهره إلى الكعبة: يا معشر قريش، والله ما منكم أحد على دين إبراهيم غيري. وكان يحيي الموءودة، ويأبى ما ذبح على الأنصاب. وقال فيه النبي صلى الله عليه وسلم: (إنه يبعث يوم القيامة أمة وحده) .',
      claims: ['zayd-amr/hanif', 'zayd-amr/ansab', 'zayd-amr/ummah-wahdah'],
    },
  },
  titles: [],
  relations: [],
} satisfies CatalogPerson;

export default zaydIbnAmrIbnNufayl;
