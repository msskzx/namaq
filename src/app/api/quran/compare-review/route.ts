// docs/plans/curated-passage-comparisons.md
import { execFile } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { NextResponse } from 'next/server';
import type { Verdict } from '@/lib/quran/curation/comparePairs';
import { reviewedVerdicts, type ReviewAction } from '@/lib/quran/curation/reviewPage';

type Verdicts = Record<string, Verdict>;
const VERDICTS = 'src/lib/quran/curation/comparePairs.json';
const run = promisify(execFile);
const read = (path: string) => JSON.parse(readFileSync(join(process.cwd(), path), 'utf8'));

function pageKeys(a: number, b: number): string[] {
  const pairs: { a: string; b: string }[] = [...read('src/app/quran/compare/pairs.json').pairs, ...read('src/app/quran/compare/passagePairs.json').pairs];
  const curated = (read('src/lib/quran/curation/compareLinks.json').links as { pair: string }[]).map(link => link.pair);
  return [...new Set([...pairs.map(pair => `${pair.a}|${pair.b}`), ...curated])].filter(key => {
    const [x, y] = key.split('|').map(part => Number(part.split(':')[0]));
    return x === a && y === b;
  });
}

/** Records the owner's choice for a whole page on their own machine, working from the last commit so a choice can be switched or undone. */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') return new NextResponse(null, { status: 404 });
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return new NextResponse(null, { status: 403 });
  const { a, b, action } = await request.json() as { a: number; b: number; action: ReviewAction | 'undo' };
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b > 114 || a >= b || !['agree', 'drop', 'undo'].includes(action)) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });

  const cwd = process.cwd();
  const path = join(cwd, VERDICTS);
  const committed = JSON.parse((await run('git', ['show', `HEAD:${VERDICTS}`], { cwd, maxBuffer: 1 << 26 })).stdout).pairs as Verdicts;
  const before = readFileSync(path, 'utf8');
  const data = JSON.parse(before) as { pairs: Verdicts };
  const keys = pageKeys(a, b);
  if (action === 'undo') {
    for (const key of keys) {
      if (committed[key]) data.pairs[key] = committed[key];
      else delete data.pairs[key];
    }
  } else {
    Object.assign(data.pairs, reviewedVerdicts(committed, keys, action));
  }
  writeFileSync(path, `${JSON.stringify(data, null, 1)}\n`);
  try {
    await run('npx', ['tsx', 'scripts/quran/buildCompareCards.ts'], { cwd });
  } catch {
    writeFileSync(path, before);
    return NextResponse.json({ error: 'Could not rebuild the cards' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
