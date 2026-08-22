import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { CanonicalPerson } from '../../src/lib/canonicalPeople';

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/**
 * Finds every `from './<prefix><digits>'` import in a source file, by
 * parsing the file's own text rather than hardcoding the batch file list.
 * Keeps callers correct as new companion-extraction batches land, with no
 * per-batch maintenance.
 */
function discoverModuleNames(sourceRelativePath: string, importPattern: RegExp): string[] {
  const source = readFileSync(path.join(repoRoot, sourceRelativePath), 'utf-8');
  const names = new Set<string>();
  for (const match of source.matchAll(importPattern)) names.add(match[1]);
  return [...names];
}

/**
 * The companion profiles actually wired into the live seed pipeline
 * (prisma/personSeed.ts's `people` array), discovered by parsing that
 * file's own import list. Never imports personSeed.ts itself — that module
 * seeds a live database as a side effect of being loaded.
 */
export async function getActiveSeedPeople(): Promise<CanonicalPerson[]> {
  const modules = discoverModuleNames('prisma/personSeed.ts', /from '\.\/(personSeedData\w+)'/g);
  const people: CanonicalPerson[] = [];
  for (const moduleName of modules) {
    const mod = (await import(/* @vite-ignore */ `../../prisma/${moduleName}`)) as {
      people: CanonicalPerson[];
    };
    people.push(...mod.people);
  }
  return people;
}

/**
 * The raw, pre-deduplication Cypher query arrays that feed into
 * neo4j/graphSeedData.ts's exported peopleQueries/peopleRelationsQueries —
 * i.e. before its `uniqueBy(nodeKey)`/`uniqueBy(relationKey)` pass silently
 * collapses same-slug or same-edge duplicates down to the first one seen.
 * Testing the deduped export can never reveal a duplicate (dedup guarantees
 * uniqueness by construction), so integrity checks need these raw arrays.
 */
export async function getRawGraphQueries(): Promise<{
  peopleQueries: string[];
  peopleRelationsQueries: string[];
}> {
  const modules = discoverModuleNames('neo4j/graphSeedData.ts', /from '\.\/(graphSeedData\d+)'/g);
  const peopleQueries: string[] = [];
  const peopleRelationsQueries: string[] = [];
  for (const moduleName of modules) {
    const mod = (await import(/* @vite-ignore */ `../../neo4j/${moduleName}`)) as {
      peopleQueries: string[];
      peopleRelationsQueries: string[];
    };
    peopleQueries.push(...mod.peopleQueries);
    peopleRelationsQueries.push(...mod.peopleRelationsQueries);
  }
  const core = (await import('../../neo4j/graphSeedData')) as {
    corePeopleQueries: string[];
    corePeopleRelationsQueries: string[];
  };
  peopleQueries.push(...core.corePeopleQueries);
  peopleRelationsQueries.push(...core.corePeopleRelationsQueries);
  return { peopleQueries, peopleRelationsQueries };
}
