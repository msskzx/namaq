import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';

/**
 * A link that leaves the app (mobile/src/ui/ExternalLink.tsx) is a pressable box with a drawn mark. Put inside a Text,
 * iOS places that box by its own measure, not with the words around it: on the owner's phone (2026-11-23) the citation
 * after al-Suyuti's quote in a reference sheet was drawn over the quote's last line, and the mark over the page's digits.
 * So no ExternalLink (or LeadLink) may sit inside a Text, however deep: the quote is its own Text above the link, and
 * words before a link go in LeadLink's row.
 */
const ROOT = join(__dirname, '..');
const LINKS = new Set(['ExternalLink', 'LeadLink']);
/** A default import of ExternalLink under another name is a link too. */
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

/** Each link inside a Text in one file's source, as `file:line`. */
export function linksInText(file: string, source: string): string[] {
  const tree = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const found: string[] = [];
  const links = new Set([...LINKS, ...renamed(source)]);
  const visit = (node: ts.Node, inText: boolean) => {
    const tag = tagOf(node);
    if (tag && links.has(tag) && inText) found.push(`${file}:${tree.getLineAndCharacterOfPosition(node.getStart()).line + 1}`);
    // Everything under a Text stays inside it: a box between them is placed inline on iOS too. Any tag named …Text
    // (Text, NativeText, Animated.Text) counts. A component that draws a Text around its children (info.tsx's Line)
    // cannot be seen from its caller's file, so a link is never passed as such a component's children.
    const next = inText || (!!tag && /(^|\.)\w*Text$/.test(tag));
    // A component written inside a Text's expression starts afresh: only the JSX it returns there counts.
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
