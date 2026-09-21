import type { CatalogPerson } from '@/lib/catalog/types';

/**
 * No seed file declares him, so this module is his only author. He is not a
 * Companion: he died before the message had spread, and the chapter says so in
 * the same breath as his word to the Prophet, ثم لم ينشب ورقة أن توفي. He is
 * here because chapter one keeps returning to him, and because two poems in the
 * catalog were carrying his name as text for want of a subject.
 *
 * The chapter disagrees with itself about how he is related to Khadijah. Ibn
 * Ishaq has عمها at `1/100-p2`; al-Zuhri's account has ابن عمها at `1/106-p2`.
 * The relation takes the cousin reading, which the chapter's own lineages
 * support -- Uthman ibn al-Huwayrith ibn Asad is called ابن عم ورقة at
 * `1/79-p3`, so Waraqah descends from Asad, as Khadijah bint Khuwaylid ibn Asad
 * does -- and `waraqah/uncle-khadijah` carries the other as DISPUTED.
 */
const waraqahIbnNawfal = {
  kind: 'PERSON',
  slug: 'waraqah-ibn-nawfal',
  name: 'ورقة بن نوفل',
  nameTransliterated: 'Waraqah ibn Nawfal',
  hasProfile: true,
  fields: {
    sex: { value: 'MALE', claims: ['waraqah/sex'] },
    virtues: {
      value:
        'تنصر وقرأ الكتب، وقال للنبي صلى الله عليه وسلم: (هذا الناموس الذي أنزل على موسى، يا ليتني فيها جذعا حين يخرجك قومك) .',
      claims: ['waraqah/virtues'],
    },
  },
  titles: [],
  relations: [
    {
      type: 'PATERNAL_COUSIN',
      inverse: 'PATERNAL_COUSIN',
      to: 'khadijah-bint-khuwaylid',
      claims: ['waraqah/cousin-khadijah'],
    },
  ],
} satisfies CatalogPerson;

export default waraqahIbnNawfal;
