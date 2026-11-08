// docs/plans/curated-passage-comparisons.md
import { execFile } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { NextResponse } from 'next/server';
import type { Verdict } from '@/lib/quran/curation/comparePairs';
import { reviewedVerdicts, type ReviewAction } from '@/lib/quran/curation/reviewPage';

type Verdicts = Record<string, Verdict>;
const ROOT = process.cwd();
const VERDICTS = join(ROOT, 'src/lib/quran/curation/comparePairs.json');
const read = (path: string) => JSON.parse(readFileSync(join(ROOT, path), 'utf8'));

// On globalThis because a verdict write hot-reloads this module.
const store = globalThis as unknown as { compareReviewDrafts?: Map<string, Verdicts> };
const drafts = (store.compareReviewDrafts ??= new Map<string, Verdicts>());

function pageKeys(a: number, b: number): string[] {
  const pairs: { a: string; b: string }[] = [...read('src/app/quran/compare/pairs.json').pairs, ...read('src/app/quran/compare/passagePairs.json').pairs];
  const curated = (read('src/lib/quran/curation/compareLinks.json').links as { pair: string }[]).map(link => link.pair);
  return [...new Set([...pairs.map(pair => `${pair.a}|${pair.b}`), ...curated])].filter(key => {
    const [x, y] = key.split('|').map(part => Number(part.split(':')[0]));
    return x === a && y === b;
  });
}

/** Records the owner's choice for a whole page on their own machine. The file changes stay uncommitted until reviewed. */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') return new NextResponse(null, { status: 404 });
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return new NextResponse(null, { status: 403 });
  const { a, b, action } = await request.json() as { a: number; b: number; action: ReviewAction | 'undo' };
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b > 114 || a >= b || !['agree', 'drop', 'undo'].includes(action)) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  const data = JSON.parse(readFileSync(VERDICTS, 'utf8')) as { pairs: Verdicts };
  const keys = pageKeys(a, b);
  const page = `${a}:${b}`;
  if (action === 'undo') {
    const drafted = drafts.get(page);
    if (!drafted) return NextResponse.json({ ok: false });
    for (const key of keys) {
      if (drafted[key]) data.pairs[key] = drafted[key];
      else delete data.pairs[key];
    }
    drafts.delete(page);
  } else {
    if (!drafts.has(page)) drafts.set(page, Object.fromEntries(keys.flatMap(key => (data.pairs[key] ? [[key, data.pairs[key]]] : []))));
    Object.assign(data.pairs, reviewedVerdicts(drafts.get(page)!, keys, action));
  }
  writeFileSync(VERDICTS, `${JSON.stringify(data, null, 1)}\n`);
  await promisify(execFile)('npx', ['tsx', 'scripts/quran/buildCompareCards.ts'], { cwd: ROOT });
  return NextResponse.json({ ok: true });
}
