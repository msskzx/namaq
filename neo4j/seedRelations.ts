export interface SeedRelation {
  from: string;
  to: string;
  type: string;
}

const RELATION_RE =
  /^MATCH \(from:Person \{slug: "([a-z][a-z0-9-]*)"\}\), \(to:Person \{slug: "([a-z][a-z0-9-]*)"\}\) CREATE \(from\)-\[:([A-Z_]+)\]->\(to\);$/;

export function parseSeedRelations(queries: string[]): SeedRelation[] {
  return queries.map(query => {
    const match = query.match(RELATION_RE);
    if (!match) throw new Error(`Unparseable relation seed query: ${query}`);
    const [, from, to, type] = match;
    return { from, to, type };
  });
}

// These relationships are maintained by canonical sync scripts, not the graph seed.
const SYNC_OWNED_RELATIONS = new Set([
  'COMPANION_OF', 'ACCOMPANIED_BY', 'HOLDS_TITLE',
  'PARTICIPATED_IN', 'INVOLVED_IN', 'PART_OF',
]);

export function findSeedRelationDrift(expected: SeedRelation[], deployed: SeedRelation[]) {
  const keys = (relations: SeedRelation[]) => new Set(relations
    .filter(edge => !SYNC_OWNED_RELATIONS.has(edge.type))
    .map(edge => `${edge.from} -[:${edge.type}]-> ${edge.to}`));
  const expectedKeys = keys(expected);
  const deployedKeys = keys(deployed);
  return {
    missing: [...expectedKeys].filter(key => !deployedKeys.has(key)).sort(),
    unexpected: [...deployedKeys].filter(key => !expectedKeys.has(key)).sort(),
  };
}
