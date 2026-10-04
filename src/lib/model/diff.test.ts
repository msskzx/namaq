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

  it('finds the father the same in both', () => {
    expect(byField(lines, 'father')[0].status).toBe('same');
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
});
