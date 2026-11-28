// see docs/plans/guard-proposals.md
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '..');
const ENTRY = 'mobile/src/ui/Text.tsx';
const ALLOWED: Record<string, string> = {
  'mobile/src/lib/useWriteBoxes.tsx': 'an invisible TextInput that only catches the keyboard for the write boxes; nothing is drawn',
};

function walk(dir: string): string[] {
  return readdirSync(join(ROOT, dir)).flatMap(name => {
    const path = `${dir}/${name}`;
    if (statSync(join(ROOT, path)).isDirectory()) return name === 'node_modules' || name.startsWith('.') ? [] : walk(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) ? [path] : [];
  });
}

export const takesNativeText = (source: string) =>
  /import\s*\{[^}]*\b(Text|TextInput)\b[^}]*\}\s*from\s*['"]react-native['"]/.test(source.replace(/\btype\s+\w+/g, ''))
  || /import\s+\*\s+as\s+(\w+)\s+from\s*['"]react-native['"][\s\S]*\b\1\.(Text|TextInput)\b/.test(source)
  || /export\s*\{[^}]*\b(Text|TextInput)\b[^}]*\}\s*from\s*['"]react-native['"]/.test(source)
  || /require\(\s*['"]react-native['"]\s*\)\.(Text|TextInput)\b/.test(source)
  || /\{[^}]*\b(Text|TextInput)\b[^}]*\}\s*=\s*require\(\s*['"]react-native['"]\s*\)/.test(source);

describe('the app draws text only through ui/Text', () => {
  it('no other file takes Text or TextInput from react-native', () => {
    const files = walk('mobile/src');
    expect(files).toContain(ENTRY);
    expect(files.filter(path => path !== ENTRY && !(path in ALLOWED) && takesNativeText(readFileSync(join(ROOT, path), 'utf8')))).toEqual([]);
  });

  it('keeps no exception that no longer takes them', () => {
    for (const path of Object.keys(ALLOWED)) expect(takesNativeText(readFileSync(join(ROOT, path), 'utf8')), path).toBe(true);
  });

  it('sees every way of taking them', () => {
    expect(takesNativeText("import { View, Text } from 'react-native';")).toBe(true);
    expect(takesNativeText("import {\n  View,\n  TextInput,\n} from 'react-native';")).toBe(true);
    expect(takesNativeText("import * as RN from 'react-native';\nconst a = <RN.Text />;")).toBe(true);
    expect(takesNativeText("export { Text as NativeText } from 'react-native';")).toBe(true);
    expect(takesNativeText("const { Text } = require('react-native');")).toBe(true);
    expect(takesNativeText("import { View, type TextStyle } from 'react-native';")).toBe(false);
    expect(takesNativeText("import { Text } from '@/ui/Text';")).toBe(false);
  });
});
