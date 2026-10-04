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

  it("shows the catalog's father and mother against the model's father alone as different", () => {
    expect(byField(lines, 'parents')[0].status).toBe('different');
  });

  it('shows the joined catalog name as different from the book-printed spans', () => {
    const [name] = byField(lines, 'fullName');
    expect(name.status).toBe('different');
    expect(name.model).toContain('ابْنِ قُصَيِّ');
    expect(name.catalog).not.toContain('ابْنِ قُصَيِّ');
  });

  it('lists what only the catalog holds, and what only the model holds', () => {
    expect(byField(lines, 'kunya')[0].status).toBe('catalog-only');
    expect(byField(lines, 'titles')[0].status).toBe('catalog-only');
    expect(
      byField(lines, 'islam.age')
        .map((l) => l.model)
        .sort(),
    ).toEqual(['16', '8']);
    expect(byField(lines, 'islam.age').every((l) => l.status === 'model-only')).toBe(true);
  });

  it('calls two equal texts the same even when whitespace and footnote markers differ', () => {
    const [name] = entries.filter((e) => e.predicate === 'name.full');
    const text = name.parts.join('\n\n');
    const result = diffAgainstCatalog(entries, { fields: { fullName: { value: `${text} (١)` } } });
    expect(byField(result, 'fullName')[0].status).toBe('same');
  });

  it('compares parents as sets and lists relations the model has no field for', () => {
    const catalog: CatalogLike = {
      relations: [
        { type: 'SON', inverse: 'FATHER', to: 'al-awwam-ibn-khuwaylid' },
        { type: 'HUSBAND', to: 'asma-bint-abi-bakr' },
      ],
    };
    const result = diffAgainstCatalog(entries, catalog);
    expect(byField(result, 'parents')[0].status).toBe('same');
    expect(byField(result, 'relation HUSBAND')[0]).toMatchObject({
      status: 'catalog-only',
      catalog: 'asma-bint-abi-bakr',
    });
  });

  it('treats the same values in another order as the same', () => {
    const two = [
      {
        ...entries.find((e) => e.predicate === 'islam.age')!,
        predicate: 'virtue' as const,
        parts: ['أَوَّلُ مَنْ سَلَّ سَيْفَهُ'],
      },
      {
        ...entries.find((e) => e.predicate === 'islam.age')!,
        predicate: 'virtue' as const,
        parts: ['حَوَارِيُّ رَسُوْلِ اللهِ'],
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
