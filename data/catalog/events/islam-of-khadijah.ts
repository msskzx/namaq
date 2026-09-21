import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * Her precedence is the settled part and the first man is the contested one:
 * al-Dhahabi states the consensus about her and then reports the disagreement
 * over أول الرجال without resolving it. Both sit in the description because the
 * model records one value here, and the two claims behind it carry the
 * difference -- `sira/first-man-to-believe` is DISPUTED, hers is not.
 */
const islamOfKhadijah = {
  kind: 'EVENT',
  slug: 'islam-of-khadijah',
  name: 'إسلام خديجة بنت خويلد',
  nameTransliterated: 'The Islam of Khadijah bint Khuwaylid',
  type: 'OTHER',
  fields: {
    description: {
      value:
        'خديجة أول خلق الله أسلم بإجماع المسلمين، لم يتقدمها رجل ولا امرأة. واختلف في أول الرجال إسلاما: قيل أبو بكر، وقيل علي، وقال ابن إسحاق: أول ذكر آمن علي وهو ابن عشر سنين، ثم زيد، ثم أبو بكر.',
      claims: ['khadijah/first-believer', 'sira/first-man-to-believe'],
    },
  },
  people: [
    { person: 'khadijah-bint-khuwaylid', claims: ['khadijah/first-believer'] },
    { person: 'prophet-muhammad', claims: ['sira/first-man-to-believe'] },
  ],
} satisfies CatalogEvent;

export default islamOfKhadijah;
