import { existsSync, readFileSync, writeFileSync, unlinkSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const mobile = fileURLToPath(new URL('../../', import.meta.url));
const configPath = join(mobile, 'app.config.js');
if (['app.config.js', 'app.config.ts', 'app.config.json'].some(name => existsSync(join(mobile, name)))) {
  throw new Error('Preserve the existing dynamic app config; select the sketch root there before exporting.');
}
const config = JSON.parse(readFileSync(join(mobile, 'app.json'), 'utf8')).expo;
config.plugins = config.plugins.map(plugin => plugin === 'expo-router' ? ['expo-router', { root: './sketches/adhkar' }] : plugin);
writeFileSync(configPath, `module.exports = ${JSON.stringify(config)};\n`);
try {
  const result = spawnSync(process.execPath, [join(mobile, 'node_modules/expo/bin/cli'), 'export', '--platform', 'web', '--output-dir', '/tmp/namaq-adhkar-sketch'], {
    cwd: mobile, stdio: 'inherit', env: { ...process.env, CI: '1', EXPO_NO_TELEMETRY: '1' },
  });
  if (result.error) throw result.error;
  process.exitCode = result.status ?? 1;
} finally {
  unlinkSync(configPath);
}
