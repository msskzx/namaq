import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Undated. The chapter places it قبل المبعث and nothing more, and a year
 * counted from the calling is not a value `hijriYear` holds -- the same reason
 * the birth and the rebuilding of the Kaaba leave it unset.
 *
 * The Prophet is on the roster because the claim is his word about Zayd, said
 * after the death: إنه يبعث يوم القيامة أمة وحده.
 */
const deathOfZaydIbnAmr = {
  kind: 'EVENT',
  slug: 'death-of-zayd-ibn-amr',
  name: 'موت زيد بن عمرو بن نفيل',
  nameTransliterated: 'The Death of Zayd ibn Amr ibn Nufayl',
  type: 'DEATH',
  fields: {
    description: {
      value:
        'مات زيد بن عمرو بن نفيل قبل المبعث، ثم أنزل على النبي صلى الله عليه وسلم فقال: (إنه يبعث يوم القيامة أمة وحده) . قال الذهبي: إسناده حسن.',
      claims: ['zayd-amr/ummah-wahdah'],
    },
  },
  people: [
    { person: 'zayd-ibn-amr-ibn-nufayl', claims: ['zayd-amr/ummah-wahdah'] },
    { person: 'prophet-muhammad', claims: ['zayd-amr/ummah-wahdah'] },
  ],
} satisfies CatalogEvent;

export default deathOfZaydIbnAmr;
