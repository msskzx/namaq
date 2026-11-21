import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';
import { readCardPresses } from '@/lib/quran/curation/cardReviewLog';

let root: string;
const post = (body: unknown, headers: Record<string, string> = {}) => POST(new Request('http://localhost/api', { method: 'POST', headers, body: JSON.stringify(body) }));

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'card-review-'));
  vi.spyOn(process, 'cwd').mockReturnValue(root);
  vi.stubEnv('NODE_ENV', 'development');
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  rmSync(root, { recursive: true });
});

describe('the card review route', () => {
  it('does not exist outside development', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect((await post({ id: 'tree:a', action: 'keep', version: 'original' })).status).toBe(404);
    expect(readCardPresses()).toEqual([]);
  });

  it('refuses another site and bad input', async () => {
    expect((await post({ id: 'tree:a', action: 'keep', version: 'original' }, { origin: 'https://evil.example', host: 'localhost:3005' })).status).toBe(403);
    expect((await post({ id: 'tree:a', action: 'approve', version: 'original' })).status).toBe(400);
    expect((await post({ id: 'tree:a', action: 'keep', version: 'mine' })).status).toBe(400);
    expect((await post({ id: '<script>', action: 'keep', version: 'original' })).status).toBe(400);
    expect((await post({ id: 'tree:a', shared: 'x', action: 'keep', version: 'original' })).status).toBe(400);
    expect((await POST(new Request('http://localhost/api', { method: 'POST', body: '{not json' }))).status).toBe(400);
    expect((await post({ id: 'tree:a', action: 'keep', version: 'original' }, { origin: 'null', host: 'localhost:3005' })).status).toBe(403);
    expect(readCardPresses()).toEqual([]);
  });

  it('only appends: each press is one more line, earlier lines stay as they were', async () => {
    writeFileSync(join(root, '.card-review-log.jsonl'), '{"t":1,"id":"old","action":"drop","version":"original"}\n');
    await post({ id: 'tree:a', action: 'keep', version: 'agents' });
    await post({ id: 'cmp-card:2:8|3:114', shared: '2:8|3:114', action: 'undo', version: 'original' });
    const lines = readFileSync(join(root, '.card-review-log.jsonl'), 'utf8').trim().split('\n');
    expect(lines[0]).toBe('{"t":1,"id":"old","action":"drop","version":"original"}');
    expect(readCardPresses().map(({ id, action, version }) => [id, action, version])).toEqual([['old', 'drop', 'original'], ['tree:a', 'keep', 'agents'], ['cmp-card:2:8|3:114', 'undo', 'original']]);
  });

  it('skips a line a crash cut short instead of failing the page', () => {
    writeFileSync(join(root, '.card-review-log.jsonl'), '{"t":1,"id":"a","action":"keep","version":"original"}\n{"t":2,"id":"b","act');
    expect(readCardPresses().map(press => press.id)).toEqual(['a']);
  });
});
