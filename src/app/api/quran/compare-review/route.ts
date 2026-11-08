// docs/plans/curated-passage-comparisons.md
import { execFile } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { promisify } from 'node:util';
import { NextResponse } from 'next/server';
import type { Verdict } from '@/lib/quran/curation/comparePairs';
import { restoredVerdicts, reviewedVerdicts, type ReviewAction } from '@/lib/quran/curation/reviewPage';

type Verdicts = Record<string, Verdict>;
const VERDICTS = 'src/lib/quran/curation/comparePairs.json';
const CARDS = 'src/app/quran/compare/compareCards.js';
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

const MESSAGES = { agree: 'owner agreed', drop: 'owner dropped', undo: 'owner restored' };

// On globalThis because a verdict write hot-reloads this module. Presses run one at a time: each one reads, rebuilds and commits the same files.
const queue = globalThis as unknown as { compareReviewQueue?: Promise<unknown> };
function inTurn<T>(task: () => Promise<T>): Promise<T> {
  const result = (queue.compareReviewQueue ?? Promise.resolve()).then(task, task);
  queue.compareReviewQueue = result.catch(() => undefined);
  return result;
}

/** Another git command, such as a status in a terminal, can hold the index lock for a moment. */
async function withRetry<T>(task: () => Promise<T>, tries = 5): Promise<T> {
  try {
    return await task();
  } catch (error) {
    if (tries <= 1 || !String((error as { stderr?: string }).stderr ?? error).includes('index.lock')) throw error;
    await new Promise(resolve => setTimeout(resolve, 400));
    return withRetry(task, tries - 1);
  }
}

async function record(a: number, b: number, action: ReviewAction | 'undo') {
  const cwd = process.cwd();
  const path = join(cwd, VERDICTS);
  // A press commits the whole file, so it must hold nothing but this press.
  if (await run('git', ['diff', '--quiet', 'HEAD', '--', VERDICTS], { cwd }).then(() => false, () => true)) return NextResponse.json({ error: 'The verdict file has uncommitted changes' }, { status: 409 });
  const before = readFileSync(path, 'utf8');
  const data = JSON.parse(before) as { pairs: Verdicts };
  const keys = pageKeys(a, b);
  if (action === 'undo') {
    const restored = restoredVerdicts(data.pairs, keys);
    for (const key of keys) {
      if (restored[key]) data.pairs[key] = restored[key];
      else delete data.pairs[key];
    }
  } else {
    Object.assign(data.pairs, reviewedVerdicts(data.pairs, keys, action));
  }
  const after = `${JSON.stringify(data, null, 1)}\n`;
  if (after === before) return NextResponse.json({ ok: true });
  writeFileSync(path, after);
  try {
    await run('npx', ['tsx', 'scripts/quran/buildCompareCards.ts'], { cwd });
    await withRetry(() => run('git', ['add', VERDICTS, CARDS], { cwd }));
    await withRetry(() => run('git', ['commit', '-q', '-m', `chore(compare): ${MESSAGES[action]} ${a}/${b}${action === 'undo' ? ' draft' : ''}`, '--', VERDICTS, CARDS], { cwd }));
  } catch {
    await run('git', ['reset', '-q', '--', VERDICTS, CARDS], { cwd }).catch(() => undefined);
    writeFileSync(path, before);
    await run('npx', ['tsx', 'scripts/quran/buildCompareCards.ts'], { cwd }).catch(() => undefined);
    return NextResponse.json({ error: 'Could not save the review' }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}

/** Records the owner's choice for a whole page on their own machine and commits it locally. The previous verdicts stay in the file, so a choice can be undone. */
export async function POST(request: Request) {
  if (process.env.NODE_ENV !== 'development') return new NextResponse(null, { status: 404 });
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== request.headers.get('host')) return new NextResponse(null, { status: 403 });
  const { a, b, action } = await request.json() as { a: number; b: number; action: ReviewAction | 'undo' };
  if (!Number.isInteger(a) || !Number.isInteger(b) || a < 1 || b > 114 || a >= b || !['agree', 'drop', 'undo'].includes(action)) return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  return inTurn(() => record(a, b, action));
}
