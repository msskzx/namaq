import { beforeEach, describe, expect, it, vi } from 'vitest';

const files = vi.hoisted(() => new Map<string, string>());
const shell = vi.hoisted(() => ({ fail: false, commits: [] as string[] }));

vi.mock('node:fs', () => ({
  readFileSync: (path: string) => files.get(path.split('/src/')[1]) ?? '',
  writeFileSync: (path: string, text: string) => { files.set(path.split('/src/')[1], text); },
}));
vi.mock('node:child_process', () => ({
  execFile: (command: string, _args: string[], _options: unknown, done: (error: Error | null, out?: { stdout: string }) => void) => {
    if (command === 'git' && _args[0] === 'commit') shell.commits.push(_args[3].split('\n')[0]);
    done(shell.fail && command !== 'git' ? new Error('build failed') : null, { stdout: '' });
  },
}));

import { POST } from './route';

const VERDICTS = 'lib/quran/curation/comparePairs.json';
const post = (body: unknown, headers: Record<string, string> = {}) => POST(new Request('http://localhost/api', { method: 'POST', headers, body: JSON.stringify(body) }));
const verdicts = () => JSON.parse(files.get(VERDICTS)!).pairs;
const unsaved = { keep: false, why: 'Another page the owner has changed.', checked: true };
const drafted = { '2:1|3:1': { keep: true, why: 'Same.' }, '2:2|3:2': { keep: false, why: 'Formula.' }, '4:1|5:1': { keep: true, why: 'Other page.' } };

beforeEach(() => {
  vi.stubEnv('NODE_ENV', 'development');
  shell.fail = false;
  shell.commits = [];
  files.clear();
  files.set(VERDICTS, `${JSON.stringify({ pairs: { ...drafted, '4:1|5:1': unsaved } }, null, 1)}\n`);
  files.set('app/quran/compare/pairs.json', JSON.stringify({ pairs: [{ a: '2:1', b: '3:1' }, { a: '2:2', b: '3:2' }, { a: '4:1', b: '5:1' }] }));
  files.set('app/quran/compare/passagePairs.json', JSON.stringify({ pairs: [] }));
  files.set('lib/quran/curation/compareLinks.json', JSON.stringify({ links: [] }));
});

describe('the compare review route', () => {
  it('does not exist outside development', async () => {
    vi.stubEnv('NODE_ENV', 'production');
    expect((await post({ a: 2, b: 3, action: 'agree' })).status).toBe(404);
  });

  it('refuses another site and bad input', async () => {
    expect((await post({ a: 2, b: 3, action: 'agree' }, { origin: 'https://evil.example', host: 'localhost:3002' })).status).toBe(403);
    expect((await post({ a: 3, b: 2, action: 'agree' })).status).toBe(400);
    expect((await post({ a: 2, b: 3, action: 'other' })).status).toBe(400);
  });

  it('changes only the pairs of that page, keeping the file format', async () => {
    expect((await post({ a: 2, b: 3, action: 'drop' })).status).toBe(200);
    expect(verdicts()['2:1|3:1']).toEqual({ keep: false, why: 'Same. (owner removed)', checked: true, draft: { keep: true, why: 'Same.' } });
    expect(shell.commits).toEqual(['Compare verdicts: owner dropped 2/3']);
    expect(verdicts()['4:1|5:1']).toEqual(unsaved);
    expect(files.get(VERDICTS)!.endsWith('}\n')).toBe(true);
  });

  it('switches a choice from the stored draft, and undoes back to it', async () => {
    await post({ a: 2, b: 3, action: 'drop' });
    await post({ a: 2, b: 3, action: 'agree' });
    expect(verdicts()['2:1|3:1']).toMatchObject({ keep: true, why: 'Same.', checked: true });
    await post({ a: 2, b: 3, action: 'undo' });
    expect(verdicts()).toEqual({ ...drafted, '4:1|5:1': unsaved });
    expect(shell.commits[2]).toBe('Compare verdicts: owner restored 2/3 draft');
  });

  it('restores the file when the cards cannot be rebuilt', async () => {
    shell.fail = true;
    const before = files.get(VERDICTS);
    expect((await post({ a: 2, b: 3, action: 'drop' })).status).toBe(500);
    expect(files.get(VERDICTS)).toBe(before);
    expect(shell.commits).toEqual([]);
  });

  it('commits nothing when a page is already in that state', async () => {
    await post({ a: 2, b: 3, action: 'undo' });
    expect(shell.commits).toEqual([]);
  });
});
