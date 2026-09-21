import type { CatalogBattle } from '@/lib/catalog/types';

/**
 * A siege and an expulsion rather than a fight, and GHAZWAH all the same: the
 * chapter files it among the year's campaigns and the Prophet went out
 * himself.
 *
 * The year is the chapter's own heading سنة ثلاث, which is what dates every
 * engagement in this run. The section itself places the siege only فيما بين
 * بدر وأحد, and al-Waqidi's هلال ذي القعدة dates its end rather than the year.
 *
 * Abd Allah ibn Ubayy and Ubadah ibn as-Samit both act in the narration and
 * neither is on the roster: the app has no subject for either, and a name the
 * chapter mentions is not on its own a reason to make one.
 */
const ghazwahBaniQaynuqa = {
  kind: 'BATTLE',
  slug: 'ghazwah-bani-qaynuqa',
  name: 'غزوة بني قينقاع',
  nameTransliterated: 'The Expedition against Banu Qaynuqa',
  fields: {
    engagement: { value: 'GHAZWAH', claims: ['sira/bani-qaynuqa'] },
    hijriYear: { value: 3, claims: ['sira/bani-qaynuqa'] },
    location: { value: 'المدينة', claims: ['sira/bani-qaynuqa'] },
  },
  participants: [{ person: 'prophet-muhammad', isMuslim: true, claims: ['sira/bani-qaynuqa'] }],
} satisfies CatalogBattle;

export default ghazwahBaniQaynuqa;
