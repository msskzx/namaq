import { mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { POST } from './route';

let root: string;
const post = (body: unknown, headers: Record<string, string> = {}) => POST(new Request('http://localhost/api', { method: 'POST', headers, body: JSON.stringify(body) }));
const log = () => {
  try {
    return readFileSync(join(root, '.story-review-log.jsonl'), 'utf8').split('\n').filter(Boolean).map(line => JSON.parse(line));
  } catch {
    return [];
  }
};

beforeEach(() => {
  root = mkdtempSync(join(tmpdir(), 'story-review-route-'));
  vi.spyOn(process, 'cwd').mockReturnValue(root);
  vi.stubEnv('NODE_ENV', 'development');
});
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  rmSync(root, { recursive: true });
});

describe('the story review route', () => {
  it('does not exist outside development', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect((await post({ key: 'musa/7:103', action: 'keep' })).status).toBe(404);
    expect(log()).toEqual([]);
  });

  it('refuses another site and bad input', async () => {
    expect((await post({ key: 'musa/7:103', action: 'keep' }, { origin: 'https://evil.example', host: 'localhost:3002' })).status).toBe(403);
    expect((await post({ key: 'nobody/7:103', action: 'keep' })).status).toBe(400);
    expect((await post({ key: 'musa/7', action: 'keep' })).status).toBe(400);
    expect((await post({ key: 'musa/7:103', action: 'agree' })).status).toBe(400);
    expect((await post({ key: 'musa/999:1', action: 'keep' })).status).toBe(400);
    expect((await POST(new Request('http://localhost/api', { method: 'POST', body: '{' }))).status).toBe(400);
    expect((await post({ key: 'musa/7:103', action: 'keep' }, { origin: 'null', host: 'localhost:3002' })).status).toBe(403);
    expect(log()).toEqual([]);
  });

  it('writes each press to the log', async () => {
    expect((await post({ key: 'musa/7:103', action: 'drop' })).status).toBe(200);
    expect((await post({ key: 'musa/7:103', action: 'undo' })).status).toBe(200);
    expect(log().map(({ key, action }) => [key, action])).toEqual([['musa/7:103', 'drop'], ['musa/7:103', 'undo']]);
  });
});
