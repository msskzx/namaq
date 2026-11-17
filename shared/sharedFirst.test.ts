import { existsSync, readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * Shared first (owner, 2026-11-17): every control and every framed box is drawn by one shared piece, and screens only
 * arrange shared pieces. A screen that needs something new adds an option to the shared piece, or builds a new shared
 * piece there; it never draws its own. The shared folders are mobile/src/ui/ (app) and src/components/common/ (website).
 * The plan and the inventory are in docs/plans/shared-first.md.
 *
 * sharedFirst.baseline.json lists today's breaks, counted per file. The checks fail when a file draws MORE than its listed
 * count (or a new file draws any), and when a file draws fewer (lower its count), so the list only shrinks.
 * `UPDATE_BASELINE=1 npx vitest run sharedFirst` rewrites it; only do that after moving a screen onto a shared piece,
 * never to let a new break in.
 */
const ROOT = join(__dirname, '..');
const BASELINE = join(__dirname, 'sharedFirst.baseline.json');

const APP_SHARED = 'mobile/src/ui/';
const WEB_SHARED = 'src/components/common/';
/** Files whose rounded shapes are the content, not a frame: tree nodes and curves, the mushaf page, videos, theme swatches. */
const DRAWINGS = [
  'mobile/src/components/BranchTree.tsx',
  'mobile/src/components/TreeCard.tsx',
  'mobile/src/components/MushafPageView.tsx',
  'mobile/src/components/ThemeTiles.tsx',
  'mobile/src/lib/treeVideo.ts',
  'mobile/src/lib/compareVideo.ts',
];

function walk(dir: string, keep: (name: string) => boolean): string[] {
  if (!existsSync(join(ROOT, dir))) return [];
  return readdirSync(join(ROOT, dir)).flatMap(name => {
    const path = `${dir}/${name}`;
    if (statSync(join(ROOT, path)).isDirectory()) return name === 'node_modules' || name.startsWith('.') ? [] : walk(path, keep);
    return keep(name) ? [path] : [];
  });
}

/** Comments name the rule without breaking it. */
const withoutComments = (text: string) => text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|\s)\/\/.*$/gm, '$1');
const notTest = (name: string) => !/\.test\.tsx?$/.test(name);
const read = (path: string) => withoutComments(readFileSync(join(ROOT, path), 'utf8'));
const count = (text: string, pattern: RegExp) => text.match(pattern)?.length ?? 0;

/** The opening tags `<Name ...>` in a file, each up to its closing `>` (props may hold braces and arrows). */
function openingTags(text: string, name: string): string[] {
  const tags: string[] = [];
  const start = new RegExp(`<${name}\\b`, 'g');
  for (let match = start.exec(text); match; match = start.exec(text)) {
    let depth = 0;
    let quote = '';
    let end = match.index + 1;
    for (; end < text.length; end++) {
      const ch = text[end];
      if (quote) { if (ch === quote) quote = ''; continue; }
      if (depth === 0 && (ch === '"' || ch === "'")) quote = ch;
      else if (ch === '{') depth++;
      else if (ch === '}') depth--;
      else if (ch === '>' && depth === 0 && text[end - 1] !== '=') break;
    }
    tags.push(text.slice(match.index, end + 1));
  }
  return tags;
}

/**
 * Every `{ ... }` group (style objects among them) with its nested groups taken out, so each group shows only its own
 * props: a style holding `transform: [{ ... }]` or `${palette.rule}55` still reads as one object.
 */
function objects(text: string): string[] {
  const found: string[] = [];
  const open: string[][] = [];
  for (const ch of text) {
    if (ch === '{') open.push([]);
    else if (ch === '}') { const own = open.pop(); if (own) found.push(own.join('')); }
    else if (open.length) open[open.length - 1].push(ch);
  }
  return found;
}

// ---- App ----------------------------------------------------------------------------------------------------------

/** Drawing primitives: a screen that imports one is drawing its own control, sheet, field, loader or bar. */
const PRIMITIVES: Record<string, RegExp> = {
  'react-native': /^(Pressable|Touchable\w*|Modal|TextInput|Switch|ActivityIndicator)$/,
  'react-native-gesture-handler': /^(Pressable|Touchable\w*|RectButton|BorderlessButton)$/,
  'expo-blur': /^BlurView$/,
  // The shared press (ui/Tap) is a raw tap area: a screen drawing one is still drawing its own control.
  '@/ui/Tap': /^Tap$/,
};

/** The local names a file gives the primitives it imports (aliases, multi-line imports, `import * as`, require). */
function primitiveNames(text: string): string[] {
  const names: string[] = [];
  for (const [from, primitive] of Object.entries(PRIMITIVES)) {
    const source = from.replace(/[-/]/g, '\\$&');
    const named = new RegExp(`import\\s+(?:type\\s+)?(?:\\w+\\s*,\\s*)?\\{([^}]*)\\}\\s*from\\s*['"]${source}['"]`, 'g');
    const required = new RegExp(`(?:const|let|var)\\s*\\{([^}]*)\\}\\s*=\\s*require\\(\\s*['"]${source}['"]\\s*\\)`, 'g');
    for (const regex of [named, required]) {
      for (const match of text.matchAll(regex)) {
        for (const part of match[1].split(',')) {
          const [imported, local] = part.replace(/^\s*type\s+/, '').split(/\s+as\s+|\s*:\s*/).map(word => word.trim());
          if (imported && primitive.test(imported)) names.push(local || imported);
        }
      }
    }
    for (const match of text.matchAll(new RegExp(`import\\s+\\*\\s+as\\s+(\\w+)\\s+from\\s*['"]${source}['"]`, 'g'))) {
      const all = ['Pressable', 'TouchableOpacity', 'TouchableHighlight', 'TouchableWithoutFeedback', 'TouchableNativeFeedback', 'Modal', 'TextInput', 'Switch', 'ActivityIndicator', 'RectButton', 'BorderlessButton', 'BlurView'];
      names.push(...all.filter(name => primitive.test(name)).map(name => `${match[1]}.${name}`));
    }
  }
  return names;
}

/** Plain text, boxes and gestures made tappable: the same control, drawn without a primitive. */
const TAP_PROPS = /\son(Press|LongPress|PressIn|PressOut|Responder\w+|StartShouldSetResponder\w*|MoveShouldSetResponder\w*)\s*=/;

function appControls(text: string): number {
  const drawn = primitiveNames(text).reduce((sum, name) => sum + count(text, new RegExp(`<${name.replace('.', '\\.')}\\b`, 'g')), 0);
  const tappable = ['Text', 'View', 'Animated\\.\\w+'].flatMap(tag => openingTags(text, tag)).filter(tag => TAP_PROPS.test(tag)).length;
  const gestures = count(text, /\bGesture\s*\.\s*(Tap|LongPress)\s*\(/g);
  return drawn + tappable + gestures;
}

/** A framed box: rounded corners together with a border or the card colour. Literal radii count too: radii come from ui/. */
const RADIUS = /\bborder\w*Radius\s*:|\.\.\.\s*CARD\b|\.radius\b/;
const FRAME = /\bborder\w*Width\s*:|\bborder\w*Color\s*:|backgroundColor\s*:\s*palette\.(card|paperDeep)\b/;
const LITERAL_RADIUS = /\bborder\w*Radius\s*:\s*\d/g;

/** One per framed box; otherwise one per literal radius. */
const appBoxes = (text: string) =>
  objects(text).reduce((sum, object) => sum + (RADIUS.test(object) && FRAME.test(object) ? 1 : count(object, LITERAL_RADIUS)), 0);

const appFiles = walk('mobile/src', name => /\.tsx?$/.test(name) && notTest(name)).filter(path => !path.startsWith(APP_SHARED));

// ---- Website ------------------------------------------------------------------------------------------------------

const WEB_CONTROLS = [
  /<(button|input|select|textarea|dialog|summary)\b/g,
  /\brole=["'{]+(dialog|button)\b/g,
  /\spopover(?=[\s=>])/g,
  /\bcreatePortal\s*\(/g,
];

function webControls(path: string, text: string): number {
  if (path.endsWith('.css')) return count(text, /position\s*:\s*fixed\b/g);
  const fixed = count(text, /[\s"'`:]fixed(?=[\s"'`])/g);
  const clickable = ['div', 'span', 'li', 'p', 'img', 'section', 'article'].flatMap(tag => openingTags(text, tag)).filter(tag => /\sonClick\s*=/.test(tag)).length;
  return WEB_CONTROLS.reduce((sum, pattern) => sum + count(text, pattern), 0) + fixed + clickable;
}

function webBoxes(path: string, text: string): number {
  if (path.endsWith('.css')) return count(text, /border(-\w+)*-radius\s*:/g);
  return count(text, /(?<![\w-])rounded(?!\w)/g);
}

const webFiles = walk('src', name => /\.(tsx?|css)$/.test(name) && notTest(name)).filter(path => !path.startsWith(WEB_SHARED));

// ---- Counts -------------------------------------------------------------------------------------------------------

type Counts = Record<string, number>;
function tally(files: string[], measure: (path: string, text: string) => number): Counts {
  const counts: Counts = {};
  for (const path of files.sort()) {
    const n = measure(path, read(path));
    if (n > 0) counts[path] = n;
  }
  return counts;
}

const breaks = {
  /** App: a control (button, sheet, field, switch, loader, blurred bar, tappable text or box) drawn outside mobile/src/ui/. */
  appControls: tally(appFiles, (_, text) => appControls(text)),
  /** App: a framed box or a literal radius outside mobile/src/ui/ (cards and boxes come from there). */
  appBoxes: tally(appFiles.filter(path => !DRAWINGS.includes(path)), (_, text) => appBoxes(text)),
  /** Website: a raw control, dialog, popover, portal, fixed overlay or clickable div outside src/components/common/. */
  webControls: tally(webFiles, webControls),
  /** Website: rounded corners set outside src/components/common/. */
  webBoxes: tally(webFiles, webBoxes),
};

if (process.env.UPDATE_BASELINE) writeFileSync(BASELINE, `${JSON.stringify(breaks, null, 2)}\n`);

describe('shared first', () => {
  const known = JSON.parse(readFileSync(BASELINE, 'utf8')) as typeof breaks;

  it('shared pieces never hand out a raw primitive', () => {
    const leaks = walk('mobile/src/ui', name => /\.tsx?$/.test(name)).filter(path => {
      const text = read(path);
      if (/export\s*(\*|\{[^}]*\})\s*from\s*['"](react-native|react-native-gesture-handler|expo-blur)['"]/.test(text)) return true;
      return primitiveNames(text).some(name => new RegExp(`export\\s*\\{[^}]*\\b${name}\\b|export\\s+(default\\s+|const\\s+\\w+\\s*=\\s*)${name}\\s*;`).test(text));
    });
    expect(leaks).toEqual([]);
  });

  for (const rule of Object.keys(breaks) as (keyof typeof breaks)[]) {
    it(`${rule}: nothing new is drawn outside the shared folder (use or extend a shared piece)`, () => {
      const grown = Object.entries(breaks[rule]).filter(([path, n]) => n > (known[rule][path] ?? 0)).map(([path, n]) => `${path}: ${known[rule][path] ?? 0} -> ${n}`);
      expect(grown).toEqual([]);
    });
    it(`${rule}: a file that draws less has its count lowered`, () => {
      const shrunk = Object.entries(known[rule]).filter(([path, n]) => (breaks[rule][path] ?? 0) < n).map(([path, n]) => `${path}: ${n} -> ${breaks[rule][path] ?? 0}`);
      expect(shrunk).toEqual([]);
    });
  }
});
