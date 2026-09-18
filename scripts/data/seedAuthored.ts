import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Person slugs some seed file still declares, whether or not that file is
 * wired into a live seed command: a dormant file is still a second author.
 *
 * The catalog is total for a person no seed file mentions, and additive for one
 * they both describe. That is what makes the migration safe subject by subject:
 * deleting someone's seed entry is what hands the catalog authority over them,
 * so nothing has to be declared twice or remembered.
 */
export function seedAuthoredPeople(): Set<string> {
  const slugs = new Set<string>();

  for (const file of readdirSync('prisma').filter((name) => /^personSeedData\d*\.ts$/.test(name))) {
    const source = readFileSync(join('prisma', file), 'utf8');
    for (const match of source.matchAll(/slug: '([a-z0-9-]+)'/g)) slugs.add(match[1]);
  }

  for (const file of readdirSync('neo4j').filter((name) => /^graphSeedData\d*\.ts$/.test(name))) {
    const source = readFileSync(join('neo4j', file), 'utf8');
    for (const match of source.matchAll(/CREATE \(:Person \{[^}]*?slug: "([a-z0-9-]+)"/g)) slugs.add(match[1]);
  }

  return slugs;
}
