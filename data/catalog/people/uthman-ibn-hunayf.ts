import { legacyUnreviewed, type CatalogPerson } from '@/lib/catalog/types';

/**
 * Carried from the retired prisma/personSeedData11.ts entry. Brother of
 * Sahl ibn Hunayf, who already declares the relation from his own side.
 * Governor of Basra under Ali; fought off Talha and al-Zubayr's men there
 * and was mistreated (beard and eyelids plucked) when they briefly seized
 * the city. His two sons, both named Abdullah per the retired entry, are
 * not modelled here.
 */
const uthmanIbnHunayf = {
  kind: 'PERSON',
  slug: 'uthman-ibn-hunayf',
  name: 'عثمان بن حنيف',
  nameTransliterated: 'Uthman ibn Hunayf',
  hasProfile: true,
  fields: {
    fullName: {
      value: 'عثمان بن حنيف بن واهب بن عكيم بن ثعلبة بن الحارث بن مجدعة بن عمرو بن حنش بن عوف بن عمرو بن عوف الأنصاري الأوسي القبائي',
      claims: legacyUnreviewed,
    },
  },
  titles: [
    { title: 'companion', name: 'صحابي', nameTransliterated: 'Companion', claims: legacyUnreviewed },
  ],
  relations: [],
} satisfies CatalogPerson;

export default uthmanIbnHunayf;
