import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

/**
 * No icon with Latin letters or Western digits (owner, 2026-11-19): this is an Arabic app, so an icon that draws «A», «Aa»,
 * «AZ», «01», «H1» and the like reads as foreign. The names below are the lucide icons whose drawing holds a letter or a
 * digit; an icon added later that draws one goes on this list too.
 */
const LATIN = [
  /^A[A-Z]/, /^ALargeSmall$/, /^BookA$/, /^BookType$/, /^Languages$/, /^Type(Outline)?$/, /^Case(Sensitive|Upper|Lower)$/,
  /(AZ|ZA|Az|Za|01|10)$/, /^Heading\d?$/, /^Bold$/, /^Italic$/, /^Underline$/, /^Strikethrough$/, /^Subscript$/, /^Superscript$/,
  /^Spell[Cc]heck\d?$/, /^WholeWord$/, /^Regex$/, /^LetterText$/, /^Baseline$/, /^RemoveFormatting$/, /^FileType\d?$/,
  /Parking/, /^ListOrdered$/, /^Calendar\d+$/, /^Binary$/, /^SquareM$/, /^SquareSigma$/, /^Sigma$/, /^Pi$/, /^Omega$/,
  /^Dice\d$/, /^Hd$/, /^Tally\d$/, /^ScanText$/, /^TextSelect$/, /^Signature$/,
];

/** The same for FontAwesome on the website: «A», «ABC», a script signature, letters and digits. */
const FONT_AWESOME = [
  /^fa[A-Z0-9]$/, /^faFont/, /^faSpellCheck$/, /^faSignature$/, /^faHeading$/, /^faBold$/, /^faItalic$/, /^faUnderline$/,
  /^faStrikethrough$/, /^faSubscript$/, /^faSuperscript$/, /^faLanguage$/, /^faTextHeight$/, /^faTextWidth$/,
  /^faArrow(Down|Up)(AZ|ZA|19|91)$/, /^faSort(Alpha|Numeric)/,
  /^faParagraph$/, /^faCopyright$/, /^faRegistered$/, /^faTrademark$/, /^faEuroSign$/, /^faSterlingSign$/,
  /^faSquareParking$/, /^faP$/, /^faH$/, /^faClosedCaptioning$/, /^faRectangleAd$/, /^faFilePdf$/, /^faFileWord$/, /^faFileExcel$/,
  /^faFilePowerpoint$/, /^faFileCsv$/,
];

const ROOT = join(__dirname, '..');
function walk(dir: string): string[] {
  if (!existsSync(join(ROOT, dir))) return [];
  return readdirSync(join(ROOT, dir)).flatMap(name => {
    const path = `${dir}/${name}`;
    if (statSync(join(ROOT, path)).isDirectory()) return name === 'node_modules' || name === 'generated' || name.startsWith('.') ? [] : walk(path);
    return /\.(tsx?|jsx?)$/.test(name) && !/\.test\./.test(name) ? [path] : [];
  });
}

describe('icons', () => {
  it('draw no Latin letter or Western digit, in the app or on the website', () => {
    const found: string[] = [];
    for (const file of [...walk('mobile/src'), ...walk('src')]) {
      const text = readFileSync(join(ROOT, file), 'utf8');
      // Both quote styles: the app writes 'lucide-react-native', the website "lucide-react".
      for (const [, names, pkg] of text.matchAll(/import\s*(?:type\s+)?\{([^}]*)\}\s*from\s*['"](lucide-react(?:-native)?(?:\/[^'"]*)?|@fortawesome\/[^'"]+)['"]/g)) {
        const list = pkg.startsWith('@fortawesome') ? FONT_AWESOME : LATIN;
        for (const raw of names.split(',')) {
          const name = raw.trim().replace(/^type\s+/, '').split(/\s+as\s+/)[0];
          if (name && list.some(re => re.test(name))) found.push(`${file}: ${name}`);
        }
      }
      // A whole icon set imported at once could reach any icon by name, which the lists above cannot see.
      if (/import\s+\*\s+as\s+\w+\s+from\s+['"](lucide-react(?:-native)?|@fortawesome\/[^'"]+)['"]/.test(text)) found.push(`${file}: import * from an icon set`);
    }
    expect(found).toEqual([]);
  });
});
