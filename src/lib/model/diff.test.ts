import { describe, expect, it } from 'vitest';
import azZubayr from '../../../data/catalog/people/az-zubayr-ibn-al-awwam';
import { diffAgainstCatalog, type CatalogLike } from './diff';
import { loadModel } from './load';
import { profilesFromModel } from './profile';

const entries = profilesFromModel(loadModel('.'), '.').get('az-zubayr-ibn-al-awwam') ?? [];
const byField = (lines: ReturnType<typeof diffAgainstCatalog>, field: string) =>
  lines.filter((l) => l.field === field);

describe('diffAgainstCatalog on al-Zubayr', () => {
  const lines = diffAgainstCatalog(entries, azZubayr as unknown as CatalogLike);

  it('finds both parents and the wife the same in the catalog and the model', () => {
    expect(byField(lines, 'parents')[0].status).toBe('same');
    expect(byField(lines, 'spouses')[0].status).toBe('same');
    expect(byField(lines, 'cousins')[0].status).toBe('different');
  });

  it('reads the name across the paragraph break as the lineage is spelled, with the join rule applied and a final full stop ignored', () => {
    const [name] = byField(lines, 'fullName');
    expect(name.model).toContain('عَبْدِ العُزَّى بنِ قُصَيِّ');
    expect(name.model).not.toContain('ابْنِ');
    expect(name.catalog?.endsWith('.')).toBe(true);
    expect(name.model?.endsWith('.')).toBe(false);
    expect(name.status).toBe('same');
  });

  it('lists what only the catalog holds, and what only the model holds', () => {
    expect(byField(lines, 'placeOfDeathArabic')[0].status).toBe('same');
    expect(byField(lines, 'titles')[0].status).toBe('different');
    expect(
      byField(lines, 'islam.age')
        .map((l) => l.model)
        .sort(),
    ).toEqual(['16', '8']);
    expect(byField(lines, 'islam.age').every((l) => l.status === 'model-only')).toBe(true);
  });

  it('calls two equal texts the same even when whitespace and footnote markers differ', () => {
    const [name] = entries.filter((e) => e.predicate === 'name.full');
    const text = name.text.replace(/ /g, '  ');
    const result = diffAgainstCatalog(entries, { fields: { fullName: { value: `${text} (١)` } } });
    expect(byField(result, 'fullName')[0].status).toBe('same');
  });

  it('compares parents as sets, in any order, and lists relations the model has no field for', () => {
    const catalog: CatalogLike = {
      relations: [
        { type: 'SON', inverse: 'MOTHER', to: 'safiyyah-bint-abd-al-muttalib' },
        { type: 'SON', inverse: 'FATHER', to: 'al-awwam-ibn-khuwaylid' },
        { type: 'FRIEND_OF', to: 'prophet-muhammad' },
      ],
    };
    const result = diffAgainstCatalog(entries, catalog);
    expect(byField(result, 'parents')[0].status).toBe('same');
    expect(byField(result, 'relation FRIEND_OF')[0]).toMatchObject({
      status: 'catalog-only',
      catalog: 'prophet-muhammad',
    });
  });

  it('matches the catalog on companionship and on the verse said to be about him', () => {
    const result = diffAgainstCatalog(entries, {
      relations: [{ type: 'COMPANION_OF', to: 'prophet-muhammad' }],
      ayat: [{ surah: 3, ayah: 172 }],
    });
    expect(byField(result, 'companionOf')[0].status).toBe('same');
    expect(byField(result, 'ayat')[0].status).toBe('same');
  });

  it('treats the same values in another order as the same', () => {
    const two = [
      {
        ...entries.find((e) => e.predicate === 'islam.age')!,
        predicate: 'virtue' as const,
        parts: ['أَوَّلُ مَنْ سَلَّ سَيْفَهُ'],
        text: 'أَوَّلُ مَنْ سَلَّ سَيْفَهُ',
      },
      {
        ...entries.find((e) => e.predicate === 'islam.age')!,
        predicate: 'virtue' as const,
        parts: ['حَوَارِيُّ رَسُوْلِ اللهِ'],
        text: 'حَوَارِيُّ رَسُوْلِ اللهِ',
      },
    ];
    const catalog = {
      virtues: [{ value: 'حَوَارِيُّ رَسُوْلِ اللهِ' }, { value: 'أَوَّلُ مَنْ سَلَّ سَيْفَهُ' }],
    };
    expect(byField(diffAgainstCatalog(two, catalog), 'virtues')[0].status).toBe('same');
  });

  it('reports every catalog field as catalog-only when the model has no entries', () => {
    const result = diffAgainstCatalog([], azZubayr as unknown as CatalogLike);
    expect(result.every((l) => l.status === 'catalog-only')).toBe(true);
  });
});

describe('the name across the part boundary', () => {
  it('differs from the catalog if the exact parts are compared without the join rule', () => {
    const [name] = entries.filter((e) => e.predicate === 'name.full');
    const result = diffAgainstCatalog(entries, {
      fields: { fullName: { value: name.parts.join(' ') } },
    });
    expect(byField(result, 'fullName')[0].status).toBe('different');
  });
});
