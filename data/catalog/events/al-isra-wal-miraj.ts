import type { CatalogEvent } from '@/lib/catalog/types';

/**
 * The chapter dates it only against the hijra: al-Zuhri says قبل الهجرة بسنة,
 * al-Waqidi قبل الهجرة بثمانية عشر شهرا, and Ibn Sa'd's collective account puts
 * it in Rabi al-Awwal rather than Ramadan. None is a hijri year, so the field
 * is unset and the description keeps al-Zuhri's, the one this batch cites.
 *
 * al-Waqidi splits the Isra' from the Mi'raj and dates them separately. The
 * model has one event, so both legs share it; the description says so.
 */
const alIsraWalMiraj = {
  kind: 'EVENT',
  slug: 'al-isra-wal-miraj',
  name: 'الإسراء والمعراج',
  nameTransliterated: "Al-Isra' wal-Mi'raj",
  type: 'TRAVEL',
  fields: {
    description: {
      value:
        'أسري به من المسجد الحرام إلى بيت المقدس على البراق قبل الهجرة بسنة، فربطه بالحلقة التي تربط بها الأنبياء وصلى بهم، ثم عرج به إلى السموات، وفرضت الصلوات خمسين ثم خففت إلى خمس بمراجعة موسى عليه السلام.',
      claims: ['sira/isra', 'sira/miraj-salah'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['sira/isra'] }],
} satisfies CatalogEvent;

export default alIsraWalMiraj;
