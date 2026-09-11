import { readdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import type { Catalog, CatalogBattle, CatalogEvent, CatalogPerson } from './types';

export const catalogRoot = 'data/catalog';

/** Sorted, so repeated runs visit the same files in the same order. */
function moduleFiles(dir: string) {
  let entries: string[];
  try {
    entries = readdirSync(dir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
  return entries.filter((file) => file.endsWith('.ts') && !file.endsWith('.test.ts')).sort();
}

async function loadKind<T>(root: string, kind: string): Promise<T[]> {
  const dir = join(root, kind);
  const loaded: T[] = [];
  for (const file of moduleFiles(dir)) {
    const imported = (await import(resolve(dir, file))) as { default: T };
    loaded.push(imported.default);
  }
  return loaded;
}

/** `root` is resolved against the working directory, so run these commands from the repo root. */
export async function loadCatalog(root = catalogRoot): Promise<Catalog> {
  const [people, battles, events] = await Promise.all([
    loadKind<CatalogPerson>(root, 'people'),
    loadKind<CatalogBattle>(root, 'battles'),
    loadKind<CatalogEvent>(root, 'events'),
  ]);
  return { people, battles, events };
}
