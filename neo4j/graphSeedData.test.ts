import { describe, expect, it } from 'vitest';
import { getActiveSeedPeople, getRawGraphQueries } from '../scripts/people/activeSeedData';
import { RECIPROCAL_INVERSES } from '../src/lib/relationship/categories';
import type { RelationType } from '../src/lib/relationship/types';

const CREATE_RE = /^CREATE \(:Person \{[^}]*slug: "([a-z][a-z0-9-]*)"[^}]*\}\);$/;
const RELATION_RE =
  /^MATCH \(from:Person \{slug: "([a-z][a-z0-9-]*)"\}\), \(to:Person \{slug: "([a-z][a-z0-9-]*)"\}\) CREATE \(from\)-\[:([A-Z_]+)\]->\(to\);$/;

function parseCreatedSlugs(peopleQueries: string[]): string[] {
  return peopleQueries.map((query) => {
    const match = query.match(CREATE_RE);
    expect(match, `unparseable CREATE query: ${query}`).not.toBeNull();
    return match![1];
  });
}

function parseRelations(peopleRelationsQueries: string[]) {
  return peopleRelationsQueries.map((query) => {
    const match = query.match(RELATION_RE);
    expect(match, `unparseable relation query: ${query}`).not.toBeNull();
    const [, from, to, type] = match!;
    return { from, to, type };
  });
}

describe('graph seed data integrity', () => {
  it('creates every Person node at most once across all seed files', async () => {
    // Checked on the RAW per-batch arrays, before graphSeedData.ts's
    // uniqueBy(nodeKey) pass — that dedup step silently keeps only the first
    // CREATE for a given slug, so a duplicate can never be observed on the
    // already-deduped export even if two batches genuinely redeclare the
    // same person with different (possibly wrong) data.
    const { peopleQueries } = await getRawGraphQueries();
    const bySlug = new Map<string, string[]>();
    for (const query of peopleQueries) {
      const [slug] = parseCreatedSlugs([query]);
      bySlug.set(slug, [...(bySlug.get(slug) ?? []), query]);
    }
    const duplicates = [...bySlug.entries()].filter(([, queries]) => queries.length > 1);
    expect(
      duplicates.map(([slug, queries]) => `${slug} (${queries.length}x):\n  ${queries.join('\n  ')}`),
    ).toEqual([]);
  });

  it('creates every relationship at most once across all seed files', async () => {
    const { peopleRelationsQueries } = await getRawGraphQueries();
    const seen = new Map<string, string[]>();
    for (const query of peopleRelationsQueries) {
      const [{ from, to, type }] = parseRelations([query]);
      const key = `${from}:${type}:${to}`;
      seen.set(key, [...(seen.get(key) ?? []), query]);
    }
    const duplicates = [...seen.entries()].filter(([, queries]) => queries.length > 1);
    expect(duplicates.map(([key]) => key)).toEqual([]);
  });

  it('never leaves a relationship pointing at a slug with no node anywhere in the pipeline', async () => {
    const { peopleQueries, peopleRelationsQueries } = await getRawGraphQueries();
    const graphSlugs = new Set(parseCreatedSlugs(peopleQueries));
    const profileSlugs = new Set((await getActiveSeedPeople()).map((p) => p.slug));
    const knownSlugs = new Set([...graphSlugs, ...profileSlugs]);

    const dangling = new Set<string>();
    for (const { from, to } of parseRelations(peopleRelationsQueries)) {
      if (!knownSlugs.has(from)) dangling.add(from);
      if (!knownSlugs.has(to)) dangling.add(to);
    }
    expect([...dangling]).toEqual([]);
  });

  it('never creates a Person node with no relationship to anyone', async () => {
    // A node created but never referenced by any relation would silently
    // sit disconnected from the graph — almost certainly a mistake, since
    // every CREATE in this pipeline exists specifically to be someone's
    // ancestor or descendant.
    const { peopleQueries, peopleRelationsQueries } = await getRawGraphQueries();
    const graphSlugs = parseCreatedSlugs(peopleQueries);
    const referenced = new Set<string>();
    for (const { from, to } of parseRelations(peopleRelationsQueries)) {
      referenced.add(from);
      referenced.add(to);
    }
    const orphans = graphSlugs.filter((slug) => !referenced.has(slug));
    expect(orphans).toEqual([]);
  });

  it('pairs every reciprocal relationship with its inverse', async () => {
    // Which inverse is correct often turns on a person's sex, which the query
    // text does not encode -- a FATHER edge pairs with SON or DAUGHTER
    // depending on the child -- so any listed inverse is accepted.
    const { peopleRelationsQueries } = await getRawGraphQueries();
    const relations = parseRelations(peopleRelationsQueries);
    const present = new Set(relations.map((r) => `${r.from}|${r.type}|${r.to}`));

    const missing = relations.flatMap((r) => {
      const inverses = RECIPROCAL_INVERSES[r.type as RelationType];
      if (!inverses) return [];
      if (inverses.some((inverse) => present.has(`${r.to}|${inverse}|${r.from}`))) return [];
      return [`expected ${r.to} -[:${inverses.join(' or ')}]-> ${r.from} (inverse of ${r.type} ${r.from}->${r.to})`];
    });
    expect(missing).toEqual([]);
  });
});
