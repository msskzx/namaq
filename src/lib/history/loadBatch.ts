import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import type { BatchFiles, HistoryBatch } from './batchSchema';

export const batchDefinitionFile = 'batch.json';

function collectMarkdown(dir: string, root: string, files: BatchFiles) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      collectMarkdown(full, root, files);
    } else if (entry.endsWith('.md')) {
      files[relative(root, full).split(sep).join('/')] = readFileSync(full, 'utf8');
    }
  }
  return files;
}

/** Reads a batch directory: its definition plus every Markdown file it holds. */
export function loadBatch(dir: string): { batch: HistoryBatch; files: BatchFiles } {
  const batch = JSON.parse(readFileSync(join(dir, batchDefinitionFile), 'utf8')) as HistoryBatch;
  return { batch, files: collectMarkdown(dir, dir, {}) };
}
