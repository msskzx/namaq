import type { CatalogBattle } from '@/lib/catalog/types';

const jamal = {
  kind: 'BATTLE',
  slug: 'jamal',
  // The entry dates the killing, not the battle: he was killed at Jamal and
  // his killing was in 36, so the battle was. Same move as plague-of-amwas,
  // which takes its year from the death it killed him in. A later entry may
  // date the battle outright -- al-Zubayr died there too -- and would then
  // cite it directly instead of through him.
  fields: { hijriYear: { value: 36, claims: ['talhah/death-year', 'talhah/jamal'] } },
  participants: [
    {
      person: 'talhah-ibn-ubaydullah',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: { value: 'وَكَانَ طَلْحَةُ مِنْ أَوَّلِ قَتِيْلٍ.', claims: ['talhah/jamal'] },
      claims: ['talhah/jamal'],
    },
  ],
} satisfies CatalogBattle;

export default jamal;
