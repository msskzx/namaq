import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Name, type and date stay the seed's, which still authors this event; this
 * module only adds the person.
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
  people: [{ person: 'az-zubayr-ibn-al-awwam', claims: ['zubayr/hijra-madinah'] }],
} satisfies CatalogEvent;

export default hijraToMedina;
