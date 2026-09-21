import { legacyUnreviewed, type CatalogEvent } from '@/lib/catalog/types';

/**
 * The chapter dates it only against the hijra, which `hijriYear` can now hold:
 * al-Zuhri's قبل الهجرة بسنة is -1. Ibn Sa'd's بثمانية عشر شهرا reaches back
 * into the year before that and is `sira/isra-year-alt`, DISPUTED; his Rabi
 * al-Awwal against Ramadan is a month, which the model does not hold.
 *
 * al-Waqidi splits the Isra' from the Mi'raj and dates them separately. The
 * model has one event, so both legs share it; the description says so.
 *
 * prisma/eventSeedData.ts held this event too, under the slug
 * night-journey-and-ascension-isra-and-miraaj, and events have no per-subject
 * authority guard, so catalog:project created a second row rather than
 * reporting the collision. That entry is retired; its location is carried
 * below, and its hijriYear of -10 is left behind as the error it was.
 */
const alIsraWalMiraj = {
  kind: 'EVENT',
  slug: 'al-isra-wal-miraj',
  name: 'الإسراء والمعراج',
  nameTransliterated: "Al-Isra' wal-Mi'raj",
  type: 'TRAVEL',
  fields: {
    hijriYear: { value: -1, claims: ['sira/isra-year'] },
    // Carried from the retired seed entry. The chapter names المسجد الحرام and
    // بيت المقدس in the description, but not as a field the batch cites.
    location: { value: 'من مكة إلى القدس ثم السماوات العلى', claims: legacyUnreviewed },
    description: {
      value:
        'أسري به من المسجد الحرام إلى بيت المقدس على البراق قبل الهجرة بسنة، فربطه بالحلقة التي تربط بها الأنبياء وصلى بهم، ثم عرج به إلى السموات، وفرضت الصلوات خمسين ثم خففت إلى خمس بمراجعة موسى عليه السلام.',
      claims: ['sira/isra', 'sira/miraj-salah'],
    },
  },
  people: [{ person: 'prophet-muhammad', claims: ['sira/isra'] }],
} satisfies CatalogEvent;

export default alIsraWalMiraj;
