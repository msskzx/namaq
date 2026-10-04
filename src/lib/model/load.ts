// docs/adr/0023-files-are-the-authority-and-both-databases-are-derived.md
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { Edition, UnitFile, Witness, Work, WorkFolder } from './types';

export const worksRoot = 'data/works';

function readJson<T>(path: string) {
  return JSON.parse(readFileSync(path, 'utf8')) as T;
}

export function loadModel(root: string): WorkFolder[] {
  const dir = join(root, worksRoot);
  if (!existsSync(dir)) return [];
  return readdirSync(dir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => {
      const base = join(dir, entry.name);
      const { editions, witnesses } = readJson<{ editions: Edition[]; witnesses: Witness[] }>(
        join(base, 'editions.json'),
      );
      const unitsDir = join(base, 'units');
      const units = existsSync(unitsDir)
        ? readdirSync(unitsDir)
            .filter((name) => name.endsWith('.json'))
            .sort()
            .map((name) => readJson<UnitFile>(join(unitsDir, name)))
        : [];
      return { work: readJson<Work>(join(base, 'work.json')), editions, witnesses, units };
    });
}
