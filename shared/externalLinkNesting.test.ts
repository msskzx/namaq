import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

const ROOT = join(__dirname, '..');
const LINKS = new Set(['ExternalLink', 'LeadLink']);
const renamed = (source: string) => [...source.matchAll(/import\s+(\w+)[^;]*from\s+'@\/ui\/ExternalLink'/g)].map(m => m[1]);

function walk(dir: string): string[] {
  if (!existsSync(join(ROOT, dir))) return [];
  return readdirSync(join(ROOT, dir)).flatMap(name => {
    const path = `${dir}/${name}`;
    if (statSync(join(ROOT, path)).isDirectory()) return name === 'node_modules' || name.startsWith('.') ? [] : walk(path);
    return name.endsWith('.tsx') ? [path] : [];
  });
}

const tagOf = (node: ts.Node): string | null =>
  ts.isJsxElement(node) ? node.openingElement.tagName.getText()
    : ts.isJsxSelfClosingElement(node) ? node.tagName.getText() : null;

export function linksInText(file: string, source: string): string[] {
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found: string[] = [];
  const links = new Set([...LINKS, ...renamed(source)]);
  const visit = (node: ts.Node, inText: boolean) => {
    const tag = tagOf(node);
    if (tag && links.has(tag) && inText) found.push(`${file}:${tree.getLineAndCharacterOfPosition(node.getStart()).line + 1}`);
    const next = inText || (!!tag && /(^|\.)\w*Text$/.test(tag));
    if (ts.isFunctionLike(node) && !ts.isArrowFunction(node)) { ts.forEachChild(node, child => visit(child, false)); return; }
    ts.forEachChild(node, child => visit(child, next));
  };
  visit(tree, false);
  return found;
}

describe('links that leave the app', () => {
  it('catches a link written inside a Text', () => {
    const bad = `const a = <Text>«قول» <ExternalLink url="u" color="c">كتاب ص١</ExternalLink></Text>;
const b = <Text>{x ? <>صحيح · <LeadLink url="u" color="c">كتاب</LeadLink></> : null}</Text>;
const c = <Animated.Text><View><ExternalLink url="u" color="c">كتاب</ExternalLink></View></Animated.Text>;`;
    expect(linksInText('bad.tsx', bad)).toEqual(['bad.tsx:1', 'bad.tsx:2', 'bad.tsx:3']);
    const named = `import Link from '@/ui/ExternalLink';\nconst a = <Text>«قول» <Link url="u" color="c">كتاب</Link></Text>;`;
    expect(linksInText('named.tsx', named)).toEqual(['named.tsx:2']);
    const good = `const a = <View><Text>«قول»</Text><ExternalLink url="u" color="c">كتاب ص١</ExternalLink></View>;`;
    expect(linksInText('good.tsx', good)).toEqual([]);
  });

  it('are never inside a Text in the app', () => {
    const found = walk('mobile/src').flatMap(file => linksInText(file, readFileSync(join(ROOT, file), 'utf8')));
    expect(found).toEqual([]);
  });
});
