import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

export function seedAuthoredPeople(): Set<string> {
  const slugs = new Set<string>();

  for (const file of readdirSync('prisma').filter((name) => /^personSeedData\d*\.ts$/.test(name))) {
    const source = readFileSync(join('prisma', file), 'utf8');
    for (const match of source.matchAll(/slug: '([a-z0-9-]+)'/g)) slugs.add(match[1]);
  }

  return slugs;
}
