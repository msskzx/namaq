import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

let root: string;
const post = (body: unknown, headers: Record<string, string> = {}) => POST(new Request('http://localhost/api', { method: 'POST', headers, body: JSON.stringify(body) }));
const log = () => {
  try {
    return readFileSync(join(root, '.review-log.jsonl'), 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line));
  } catch {
    return [];
  }
};

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'compare-review-'));
  vi.spyOn(process, 'cwd').mockReturnValue(root);
  vi.stubEnv('NODE_ENV', 'development');
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  rmSync(root, { recursive: true });
});

describe('the compare review route', () => {
  it('does not exist outside development', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect((await post({ a: 2, b: 3, action: 'agree' })).status).toBe(404);
    expect(log()).toEqual([]);
  });

  it('refuses another site and bad input', async () => {
    expect((await post({ a: 2, b: 3, action: 'agree' }, { origin: 'https://evil.example', host: 'localhost:3002' })).status).toBe(403);
    expect((await post({ a: 3, b: 2, action: 'agree' })).status).toBe(400);
    expect((await post({ a: 2, b: 3, action: 'other' })).status).toBe(400);
    expect((await post({ a: 2, b: 3, action: 'keep' })).status).toBe(400);
    expect((await post({ a: 2, b: 3, card: [], action: 'keep' })).status).toBe(400);
    expect((await post({ a: 2, b: 3, card: ['4:1|5:1'], action: 'keep' })).status).toBe(400);
    expect((await post({ a: 2, b: 3, card: ['2:1|3:1'], action: 'agree' })).status).toBe(400);
    expect(log()).toEqual([]);
  });

  it('logs a card press with its pairs', async () => {
    expect((await post({ a: 2, b: 3, card: ['2:1|3:1', '2:2|3:2'], action: 'discuss' })).status).toBe(200);
    expect(log()).toMatchObject([{ page: '2/3', card: ['2:1|3:1', '2:2|3:2'], action: 'discuss' }]);
  });

  it('logs a press on a surah compared with itself', async () => {
    expect((await post({ a: 2, b: 2, card: ['2:35|2:58'], action: 'keep' })).status).toBe(200);
    expect(log()).toMatchObject([{ page: '2/2', card: ['2:35|2:58'], action: 'keep' }]);
  });

  it('appends each press to the log in order and touches nothing else', async () => {
    expect((await post({ a: 2, b: 3, action: 'drop' })).status).toBe(200);
    expect((await post({ a: 2, b: 3, action: 'undo' })).status).toBe(200);
    expect(log()).toMatchObject([{ page: '2/3', action: 'drop', t: expect.any(Number) }, { page: '2/3', action: 'undo', t: expect.any(Number) }]);
  });
});
