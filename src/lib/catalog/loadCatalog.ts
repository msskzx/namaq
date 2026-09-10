import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { CatalogBattle, CatalogEvent, CatalogPerson } from './types';

export const catalogRoot = 'data/catalog';

export interface Catalog {
  readonly people: readonly CatalogPerson[];
  readonly battles: readonly CatalogBattle[];
  readonly events: readonly CatalogEvent[];
}

/**
 * Sorted so a projection run over the same files always visits them in the
 * same order; readdir alone does not promise that across platforms.
 */
function moduleFiles(dir: string) {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch {
    return [];
  }
  return entries.filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts')).sort();
}

async function loadKind<T>(root: string, kind: string): Promise<T[]> {
  const dir = join(root, kind);
  const loaded: T[] = [];
  for (const file of moduleFiles(dir)) {
    const loadedModule = (await import(resolve(dir, file))) as { default: T };
    loaded.push(loadedModule.default);
  }
  return loaded;
}

export async function loadCatalog(root = catalogRoot): Promise<Catalog> {
  const [people, battles, events] = await Promise.all([
    loadKind<CatalogPerson>(root, 'people'),
    loadKind<CatalogBattle>(root, 'battles'),
    loadKind<CatalogEvent>(root, 'events'),
  ]);
  return { people, battles, events };
}
