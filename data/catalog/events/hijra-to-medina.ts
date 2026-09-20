import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Name, type and date stay the seed's, which still authors this event; this
 * module only adds the person.
 *
 * Chapter two of the sira adds the Prophet's own hijra to this event: the
 * three nights in غار ثور with Abu Bakr, and the arrival at Medina on Monday
 * the twelfth of Rabi al-Awwal. The date stays the seed's all the same, since a
 * day and month are not the hijriYear the model holds.
 *
 * The entry says هاجر الزبير without naming where to. Unqualified, that is the
 * hijra to Medina, and the claim is recorded LIKELY rather than ESTABLISHED
 * because the age it gives — eighteen — sits closer to Abyssinia than to a
 * migration some thirteen years after an Islam it dates to his sixteenth year.
 * The entry does not resolve it, so neither does this.
 */
const hijraToMedina = {
  kind: 'EVENT',
  slug: 'hijra-to-medina',
  name: 'هجرة إلى المدينة',
  nameTransliterated: 'Hijra to Medina',
  type: 'HIJRA',
  fields: {},
  people: [
    { person: 'az-zubayr-ibn-al-awwam', claims: ['zubayr/hijra-madinah'] },
    { person: 'abdur-rahman-ibn-awf', claims: ['awf/hijra-madinah'] },
    { person: 'prophet-muhammad', claims: ['sira/hijra-madinah'] },
    { person: 'abu-bakr-as-siddiq', claims: ['abu-bakr/hijra-cave'] },
    // Ibn Ishaq makes him the first of all of them, a year before the greater
    // Aqaba, not one of the party that left with the Prophet.
    { person: 'abu-salamah', claims: ['abu-salamah/hijra-madinah-first'] },
    { person: 'abu-ayyub-al-ansari', claims: ['abu-ayyub/hijra-host'] },
  ],
} satisfies CatalogEvent;

export default hijraToMedina;
