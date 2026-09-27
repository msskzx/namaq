/**
 * Every person and relationship this module once seeded is now authored in
 * data/catalog/people/ instead, written to Neo4j by catalog:project-graph.
 * These stay exported and empty rather than removed: scripts/people/
 * activeSeedData.ts and src/lib/graphIntegrity.live.test.ts import them by
 * name to check the catalog against whatever graph seed data still exists.
 */
export const corePeopleQueries: string[] = [];
export const corePeopleRelationsQueries: string[] = [];
export const peopleQueries: string[] = corePeopleQueries;
export const peopleRelationsQueries: string[] = corePeopleRelationsQueries;
