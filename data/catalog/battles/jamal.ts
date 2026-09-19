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
      person: 'saad-ibn-abi-waqqas',
      isMuslim: true,
      relation: 'ABSENT_FROM',
      summary: {
        value: 'اعْتَزَلَ سَعْدٌ الفِتْنَةَ، فَلاَ حَضَرَ الجَمَلَ، وَلاَ صِفِّيْنَ، وَلاَ التَّحْكِيْمَ.',
        claims: ['saad/jamal'],
      },
      claims: ['saad/jamal'],
    },
    {
      person: 'talhah-ibn-ubaydullah',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: { value: 'وَكَانَ طَلْحَةُ مِنْ أَوَّلِ قَتِيْلٍ.', claims: ['talhah/jamal'] },
      claims: ['talhah/jamal'],
    },
    {
      person: 'az-zubayr-ibn-al-awwam',
      isMuslim: true,
      status: ['MARTYRED'],
      summary: {
        value: 'انْصَرَفَ يَوْمَ الجَمَلِ، فَطَعَنَهُ ابْنُ جُرْمُوْزٍ، فَوَقَعَ، وَدُفِنَ بِوَادِي السِّبَاعِ.',
        claims: ['zubayr/jamal'],
      },
      claims: ['zubayr/jamal'],
    },
  ],
} satisfies CatalogBattle;

export default jamal;
