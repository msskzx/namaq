import { spawnSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, it } from 'vitest';

it('rejects an empty web export before listening', () => {
  const root = mkdtempSync(join(tmpdir(), 'namaq-ui-'));
  try {
    const result = spawnSync(process.execPath, [join(__dirname, 'serve.mjs'), root, '0'], { encoding: 'utf8', timeout: 2000 });
    expect(result.status).toBe(1);
    expect(result.stderr).toContain('Missing web export entrypoint');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
